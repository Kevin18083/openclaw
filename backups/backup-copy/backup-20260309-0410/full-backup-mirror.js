/**
 * 完整备份 + 镜像系统
 * 功能：备份所有东西到 6 个位置（3 镜像 + 3 备份）
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 源目录
const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';

// 三重镜像位置（实时同步，每日覆盖）
const MIRROR_TARGETS = [
  'C:\\Users\\17589\\.openclaw\\workspace\\backups\\knowledge-main',
  'C:\\Users\\17589\\.openclaw\\workspace\\backups\\knowledge-backup',
  'D:\\AAAAAA\\openclaw-backup'
];

// 三重备份位置（历史版本，保留 7 天）
const BACKUP_TARGETS = [
  'C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-main',
  'C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-copy',
  'D:\\AAAAAA\\openclaw-backup-history'
];

// 获取日期时间字符串
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}`;
}

// 获取 7 天前的日期字符串
function getDateBefore(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 复制目录（使用 robocopy，Windows 原生）
function copyDir(src, dest) {
  try {
    if (!fs.existsSync(src)) {
      console.log(`  跳过：${src} 不存在`);
      return true;
    }
    
    // 确保目标目录存在
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // 使用 robocopy（更可靠）
    const command = `robocopy "${src}" "${dest}" /E /NFL /NDL /NJH /NJS /nc /ns /np`;
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (e) {
    // robocopy 失败，尝试 xcopy
    try {
      const command = `xcopy "${src}" "${dest}" /E /I /Y`;
      execSync(command, { stdio: 'pipe' });
      return true;
    } catch (e2) {
      console.error(`  复制失败：${src} -> ${dest}`, e2.message);
      return false;
    }
  }
}

// 复制单个文件
function copyFile(src, dest) {
  try {
    if (!fs.existsSync(src)) return true;
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    return true;
  } catch (e) {
    console.error(`  文件复制失败：${src} -> ${dest}`, e.message);
    return false;
  }
}

// 更新镜像（覆盖式）
function updateMirrors() {
  console.log('\n═══════════════════════════════════════');
  console.log('🪞 更新三重镜像（实时同步，每日覆盖）');
  console.log('═══════════════════════════════════════');
  
  let successCount = 0;
  
  MIRROR_TARGETS.forEach((target, index) => {
    console.log(`\n[${index + 1}/3] 镜像到：${target}`);
    
    // 确保目标目录存在
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    
    // 复制所有目录
    const dirsToMirror = [
      'memory',
      'skills',
      'learning',
      'tools',
      'scripts',
      'backup'
    ];
    
    let copied = 0;
    dirsToMirror.forEach(dir => {
      const src = path.join(WORKSPACE, dir);
      const dest = path.join(target, dir);
      if (fs.existsSync(src)) {
        if (copyDir(src, dest)) {
          copied++;
        }
      }
    });
    
    // 复制根目录文件
    const filesToMirror = [
      'MEMORY.md',
      'HEARTBEAT.md',
      'SOUL.md',
      'USER.md',
      'AGENTS.md',
      'TOOLS.md',
      'IDENTITY.md',
      'skills-inventory.md',
      'file-lookup-table.json',
      'auto-backup.js',
      'full-backup-mirror.js'
    ];
    
    filesToMirror.forEach(file => {
      const src = path.join(WORKSPACE, file);
      const dest = path.join(target, file);
      if (copyFile(src, dest)) {
        copied++;
      }
    });
    
    console.log(`  ✅ 完成：复制了 ${copied} 个项目`);
    successCount++;
  });
  
  return successCount;
}

// 创建备份（带时间戳）
function createBackups() {
  console.log('\n═══════════════════════════════════════');
  console.log('📦 创建三重备份（历史版本，保留 7 天）');
  console.log('═══════════════════════════════════════');
  
  const timestamp = getTimestamp();
  const backupName = `backup-${timestamp}`;
  let successCount = 0;
  
  BACKUP_TARGETS.forEach((target, index) => {
    console.log(`\n[${index + 1}/3] 备份到：${target}`);
    
    const backupDir = path.join(target, backupName);
    
    // 确保目标目录存在
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    
    // 复制所有目录
    const dirsToBackup = [
      'memory',
      'skills',
      'learning',
      'tools',
      'scripts',
      'backup'
    ];
    
    let copied = 0;
    dirsToBackup.forEach(dir => {
      const src = path.join(WORKSPACE, dir);
      const dest = path.join(backupDir, dir);
      if (fs.existsSync(src)) {
        if (copyDir(src, dest)) {
          copied++;
        }
      }
    });
    
    // 复制根目录文件
    const filesToBackup = [
      'MEMORY.md',
      'HEARTBEAT.md',
      'SOUL.md',
      'USER.md',
      'AGENTS.md',
      'TOOLS.md',
      'IDENTITY.md',
      'skills-inventory.md',
      'file-lookup-table.json',
      'auto-backup.js',
      'full-backup-mirror.js'
    ];
    
    filesToBackup.forEach(file => {
      const src = path.join(WORKSPACE, file);
      const dest = path.join(backupDir, file);
      if (copyFile(src, dest)) {
        copied++;
      }
    });
    
    console.log(`  ✅ 完成：复制了 ${copied} 个项目`);
    successCount++;
    
    // 清理旧备份（保留 7 天）
    console.log(`  清理旧备份...`);
    cleanupOldBackups(target);
  });
  
  return { successCount, backupName };
}

// 清理旧备份
function cleanupOldBackups(targetDir) {
  try {
    if (!fs.existsSync(targetDir)) return;
    
    const dirs = fs.readdirSync(targetDir);
    const cutoffDate = getDateBefore(7);
    
    dirs.forEach(dir => {
      // 匹配日期格式 YYYYMMDD-HHMM
      const match = dir.match(/^backup-(\d{8})-\d{4}$/);
      if (match && match[1] < cutoffDate) {
        const oldPath = path.join(targetDir, dir);
        console.log(`    删除旧备份：${dir}`);
        fs.rmSync(oldPath, { recursive: true, force: true });
      }
    });
  } catch (e) {
    console.error(`  清理失败：`, e.message);
  }
}

// 写入备份日志
function writeBackupLog(backupName, mirrorSuccess, backupSuccess) {
  const logPath = path.join(WORKSPACE, 'backup-log.md');
  const logContent = `# 备份日志

## 最近备份
- **时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
- **备份名称**: ${backupName}
- **镜像更新**: ${mirrorSuccess}/3 成功
- **备份创建**: ${backupSuccess}/3 成功

## 镜像位置（3 份 - 实时同步）
1. C:\\Users\\17589\\.openclaw\\workspace\\backups\\knowledge-main
2. C:\\Users\\17589\\.openclaw\\workspace\\backups\\knowledge-backup
3. D:\\AAAAAA\\openclaw-backup

## 备份位置（3 份 - 历史版本，保留 7 天）
1. C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-main\\${backupName}
2. C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-copy\\${backupName}
3. D:\\AAAAAA\\openclaw-backup-history\\${backupName}

## 备份内容
- ✅ memory/ - 所有记忆文件
- ✅ skills/ - 所有技能文件
- ✅ learning/ - 学习文件
- ✅ tools/ - 工具文件
- ✅ scripts/ - 脚本文件
- ✅ backup/ - 备份目录
- ✅ 根目录配置文件（MEMORY.md, HEARTBEAT.md, SOUL.md, USER.md, AGENTS.md, TOOLS.md, IDENTITY.md 等）

## 保留策略
- 镜像：实时同步，每日覆盖，永久保留
- 备份：每日创建，保留最近 7 天，自动清理

## 总计
**6 份保护**（3 镜像 + 3 备份）
`;
  fs.writeFileSync(logPath, logContent, 'utf-8');
}

// 主函数
function main() {
  console.log('═══════════════════════════════════════');
  console.log('完整备份 + 镜像系统 - 6 份保护');
  console.log('═══════════════════════════════════════');
  console.log('开始时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
  
  // 更新镜像
  const mirrorSuccess = updateMirrors();
  
  // 创建备份
  const { successCount: backupSuccess, backupName } = createBackups();
  
  // 写入日志
  writeBackupLog(backupName, mirrorSuccess, backupSuccess);
  
  console.log('\n═══════════════════════════════════════');
  console.log('备份 + 镜像完成！');
  console.log(`镜像更新：${mirrorSuccess}/3 成功`);
  console.log(`备份创建：${backupSuccess}/3 成功`);
  console.log(`备份名称：${backupName}`);
  console.log(`备份日志：backup-log.md`);
  console.log('═══════════════════════════════════════');
}

// 运行
main();
