# 扎克备份清理指南

> **版本**: v1.0
> **创建时间**: 2026-03-12
> **维护者**: 杰克 (Jack)
> **适用对象**: 扎克 (Zack) 系统管理员

---

## 📋 目录

1. [问题背景](#问题背景)
2. [清理方案](#清理方案)
3. [执行步骤](#执行步骤)
4. [验证结果](#验证结果)
5. [自动化维护](#自动化维护)
6. [应急处理](#应急处理)

---

## 问题背景

### 问题描述

扎克系统加载速度变慢，经检查发现 `backups/` 目录积累了大量冗余备份文件。

### 问题原因

1. **备份频率高**: 每天执行多次备份 (00:00, 04:09, 10:43, 10:50, 11:43 等)
2. **清理策略宽松**: 原策略保留 7 天内所有备份，导致同一天多个备份都保留
3. **只按时间清理**: 原逻辑只检查文件夹 mtime，不检查备份名称中的日期

### 清理前状态

```
backups/backup-main/   : 16 个备份 (96MB)
backups/backup-copy/   : 16 个备份 (96MB)
D 盘历史备份            : 16 个备份
Workspace 总计          : 447MB
```

---

## 清理方案

### 核心原则

1. **保留最近 3 天** - 确保有足够历史版本可回滚
2. **每天只留 1 个** - 保留每天最新的备份
3. **三重备份完整** - C 盘 x2 + D 盘 x1 保持同步
4. **镜像不受影响** - 三重镜像保持实时同步

### 保留策略

| 日期 | 保留的备份 | 说明 |
|------|-----------|------|
| 2026-03-12 | backup-2026-03-12-114333 | 最新备份 (11:43) |
| 2026-03-11 | backup-2026-03-11-054332 | 最新备份 (05:43) |
| 2026-03-10 | backup-20260310-1834 | 唯一备份 (18:34) |

### 删除策略

- 超过 3 天的备份 → 全部删除
- 同一天的多个备份 → 只保留最新 1 个

---

## 执行步骤

### 步骤 1: 创建清理脚本

创建文件：`cleanup-backups.js`

```javascript
#!/usr/bin/env node
/**
 * 扎克备份清理脚本
 * 规则：保留最近 3 天，每天最多 1 个最新备份
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';

/**
 * 从备份名称中提取日期
 */
function extractDate(backupName) {
  const name = backupName.replace('backup-', '');

  // 格式 1: 2026-03-09-001057
  if (name.match(/^\d{4}-\d{2}-\d{2}/)) {
    return name.substring(0, 10);
  }

  // 格式 2: 20260309-0048
  if (name.match(/^\d{8}/)) {
    const raw = name.substring(0, 8);
    return `${raw.substring(0, 4)}-${raw.substring(4, 6)}-${raw.substring(6, 8)}`;
  }

  return null;
}

/**
 * 从备份名称提取时间 (用于排序)
 */
function extractTime(backupName) {
  const name = backupName.replace('backup-', '');

  const match1 = name.match(/^\d{4}-\d{2}-\d{2}-(\d+)/);
  if (match1) return match1[1];

  const match2 = name.match(/^\d{8}-(\d+)/);
  if (match2) return match2[1].padEnd(6, '0');

  return '000000';
}

function cleanupBackupDir(baseDir) {
  if (!fs.existsSync(baseDir)) {
    console.log(`  Skip (not exists): ${baseDir}`);
    return 0;
  }

  const backups = fs.readdirSync(baseDir)
    .filter(name => name.startsWith('backup-') && fs.statSync(path.join(baseDir, name)).isDirectory());

  console.log(`\nProcessing: ${baseDir}`);
  console.log(`  Found ${backups.length} backups`);

  // 按日期分组
  const byDate = {};
  backups.forEach(name => {
    const date = extractDate(name);
    if (!date) {
      console.log(`  Warning: Cannot parse date from ${name}`);
      return;
    }
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(name);
  });

  // 排序日期 (从新到旧)
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));
  console.log(`  Dates found: ${dates.join(', ')}`);

  // 只保留最近 3 天
  const keepDates = dates.slice(0, 3);
  let deleted = 0;

  dates.forEach(date => {
    const dayBackups = byDate[date];

    if (!keepDates.includes(date)) {
      // 超过 3 天，全部删除
      dayBackups.forEach(name => {
        const backupPath = path.join(baseDir, name);
        fs.rmSync(backupPath, { recursive: true, force: true });
        console.log(`  Deleted (old): ${name} (${date})`);
        deleted++;
      });
      return;
    }

    // 3 天内，只保留最新的一个
    if (dayBackups.length > 1) {
      // 按时间排序 (最新的在前)
      dayBackups.sort((a, b) => extractTime(b).localeCompare(extractTime(a)));
      const keep = dayBackups[0];

      for (let i = 1; i < dayBackups.length; i++) {
        const backupPath = path.join(baseDir, dayBackups[i]);
        fs.rmSync(backupPath, { recursive: true, force: true });
        console.log(`  Deleted: ${dayBackups[i]} (keeping: ${keep})`);
        deleted++;
      }
    } else {
      console.log(`  Keeping: ${dayBackups[0]} (${date})`);
    }
  });

  return deleted;
}

function main() {
  console.log('🧹 清理冗余备份...\n');
  console.log('规则：保留最近 3 天，每天最多 1 个备份\n');

  const backupDirs = [
    path.join(WORKSPACE, 'backups', 'backup-main'),
    path.join(WORKSPACE, 'backups', 'backup-copy'),
    'D:\\AAAAAA\\openclaw-backup-history'
  ];

  let totalDeleted = 0;

  backupDirs.forEach(dir => {
    totalDeleted += cleanupBackupDir(dir);
  });

  console.log(`\n✅ 清理完成！共删除 ${totalDeleted} 个冗余备份`);

  // 显示清理后的大小
  console.log('\n📊 清理后备份目录大小:');
  backupDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const count = fs.readdirSync(dir).filter(n => n.startsWith('backup-')).length;
      console.log(`  ${dir}: ${count} backups`);
    }
  });
}

main();
```

### 步骤 2: 执行清理

```bash
# 执行清理脚本
node cleanup-backups.js
```

### 步骤 3: 验证结果

```bash
# 检查各备份目录保留的数量
ls backups/backup-main/ | grep backup-
ls backups/backup-copy/ | grep backup-
ls D:/AAAAAA/openclaw-backup-history/ | grep backup-
```

---

## 验证结果

### 清理效果统计

| 项目 | 清理前 | 清理后 | 节省空间 |
|------|--------|--------|----------|
| backup-main | 16 个 (96MB) | 3 个 (5.3MB) | 90.7MB |
| backup-copy | 16 个 (96MB) | 3 个 (5.3MB) | 90.7MB |
| D 盘历史备份 | 16 个 | 3 个 | ~90MB |
| Workspace 总计 | 447MB | 267MB | **180MB** |

### 数据完整性验证

```
✅ 三重备份：各 3 个 (C 盘 x2 + D 盘 x1)
✅ 三重镜像：核心文件完整 (MEMORY.md 等)
✅ AB 记忆：MEMORY.md + MEMORY-B.md 正常
✅ 记忆目录：memory/ (69 文件) + memory-backup (67 文件)
✅ 模型系统：阿里云稳定，DeepSeek 就绪
```

### 保留的备份清单

**backup-main/**:
```
backup-2026-03-12-114333  (最新)
backup-2026-03-11-054332
backup-20260310-1834
```

**backup-copy/**:
```
backup-2026-03-12-114333  (最新)
backup-2026-03-11-054332
backup-20260310-1834
```

**D 盘历史备份/**:
```
backup-2026-03-12-114333  (最新)
backup-2026-03-11-054332
backup-20260310-1834
```

---

## 自动化维护

### 更新 auto-backup.js

已更新 `scripts/auto-backup.js` 中的 `cleanupOldBackups()` 函数：

```javascript
/**
 * 清理过期备份 (保留最近 3 天，每天最多 1 个最新备份)
 */
function cleanupOldBackups() {
  console.log('\n🧹 清理过期备份 (保留最近 3 天，每天最多 1 个)...\n');

  const backupDirs = [
    path.join(WORKSPACE, 'backups', 'backup-main'),
    path.join(WORKSPACE, 'backups', 'backup-copy'),
    'D:\\AAAAAA\\openclaw-backup-history'
  ];

  const today = new Date();
  let deletedCount = 0;

  backupDirs.forEach(baseDir => {
    if (!fs.existsSync(baseDir)) return;

    const backups = fs.readdirSync(baseDir)
      .filter(name => name.startsWith('backup-'));

    // 按日期分组
    const backupsByDate = {};
    backups.forEach(backup => {
      const backupPath = path.join(baseDir, backup);
      const stats = fs.statSync(backupPath);
      const mtime = new Date(stats.mtime);
      const dateKey = mtime.toISOString().split('T')[0];
      const daysOld = Math.floor((today - mtime) / (1000 * 60 * 60 * 24));

      if (daysOld <= 3) {
        if (!backupsByDate[dateKey]) {
          backupsByDate[dateKey] = [];
        }
        backupsByDate[dateKey].push({ name: backup, path: backupPath, mtime: stats.mtime });
      } else {
        fs.rmSync(backupPath, { recursive: true, force: true });
        deletedCount++;
        console.log(`  📦 已删除：${backup} (${daysOld} 天前)`);
      }
    });

    // 对每一天的备份，只保留最新的一个
    Object.keys(backupsByDate).forEach(date => {
      const dayBackups = backupsByDate[date];
      if (dayBackups.length > 1) {
        dayBackups.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
        for (let i = 1; i < dayBackups.length; i++) {
          fs.rmSync(dayBackups[i].path, { recursive: true, force: true });
          deletedCount++;
          console.log(`  📦 已删除：${dayBackups[i].name} (保留：${dayBackups[0].name})`);
        }
      }
    });
  });

  console.log(`✅ 清理完成，删除 ${deletedCount} 个冗余备份`);
  return { deleted: deletedCount };
}
```

### 定时维护建议

**建议 1**: 每次执行备份后自动清理
```javascript
// auto-backup.js 主函数中
function main() {
  // ... 执行备份 ...

  // 自动清理冗余
  cleanupOldBackups();
}
```

**建议 2**: 设置独立的定时任务
```bash
# 每天 23:00 执行清理
node cleanup-backups.js
```

---

## 应急处理

### 场景 1: 误删备份

**症状**: 发现删除了重要备份

**恢复方法**:
1. 从三重镜像恢复：`backups/knowledge-main/` 或 `D:\AAAAAA\openclaw-backup\`
2. 从其他备份位置恢复：三个备份位置保持同步，任意一个可用

### 场景 2: 备份不一致

**症状**: 三个备份位置内容不一致

**恢复方法**:
```bash
# 运行备份切换检查
node scripts/backup-switcher.js

# 手动同步
# 1. 选择最完整的备份作为源
# 2. 复制到其他两个位置
```

### 场景 3: 磁盘空间不足

**症状**: C 盘空间不足

**临时方案**:
```bash
# 手动清理更旧的备份，只保留最新 1 个
node -e "
const fs = require('fs');
const backups = fs.readdirSync('backups/backup-main').filter(n => n.startsWith('backup-'));
backups.sort().reverse();
backups.slice(1).forEach(b => fs.rmSync('backups/backup-main/' + b, { recursive: true }));
"
```

**长期方案**: 将备份位置迁移到 D 盘

---

## 附录：备份目录结构

```
backups/
├── backup-main/           # 三重历史备份 1
│   ├── backup-2026-03-12-114333/  ← 保留 (最新)
│   ├── backup-2026-03-11-054332/  ← 保留
│   └── backup-20260310-1834/      ← 保留
├── backup-copy/           # 三重历史备份 2
│   ├── backup-2026-03-12-114333/  ← 保留
│   ├── backup-2026-03-11-054332/  ← 保留
│   └── backup-20260310-1834/      ← 保留
├── knowledge-main/        # 三重镜像 1 (实时同步)
├── knowledge-backup/      # 三重镜像 2 (实时同步)
├── full-backup/           # 完整备份 (特殊用途)
├── mirror/                # 镜像备份
├── skills-backup/         # 技能备份
└── cleanup-backups.js     # 清理脚本
```

---

## 检查清单

### 日常检查 (每日执行备份后)

- [ ] 检查备份是否成功创建
- [ ] 检查备份数量是否正常 (每天最多 3 个)
- [ ] 检查镜像同步状态

### 每周检查

- [ ] 运行完整数据完整性检查
- [ ] 验证 D 盘备份同步
- [ ] 检查 Workspace 大小

### 每月检查

- [ ] 清理超过 3 天的备份
- [ ] 验证备份恢复流程
- [ ] 更新备份策略文档

---

*文档创建：2026-03-12*
*维护者：杰克 (Jack)*
*下次审查：2026-03-19*
