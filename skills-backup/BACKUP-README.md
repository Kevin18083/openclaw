# 技能备份机制 (Skills Backup)

> **原则**：主备双活，确保任何时候都有技能可用！
>
> **目标**：主文件出问题时，备份文件能立刻顶上！

---

## 📁 目录结构

```
workspace/
├── skills/              ← 主技能库（日常使用）
│   ├── code-quality-workflow/
│   ├── tech-error-log/
│   ├── code-security-check/
│   └── SKILL-MAINTENANCE.md
│
└── skills-backup/       ← 备份技能库（灾备使用）
    ├── code-quality-workflow/
    ├── tech-error-log/
    ├── code-security-check/
    └── SKILL-MAINTENANCE.md
```

---

## 🔄 备份机制

### 正常工作流程

```
┌─────────────────────────────────────────────────────┐
│  1. 杰克写代码                                       │
│       ↓                                             │
│  2. 使用 skills/ 目录下的技能                        │
│       ↓                                             │
│  3. 检查技能是否可用                                 │
│       ↓                                             │
│  4. 可用 → 正常使用                                 │
│       ↓                                             │
│  5. 不可用 → 切换到 skills-backup/                  │
└─────────────────────────────────────────────────────┘
```

### 切换流程

```
检测到主技能库异常
       ↓
自动切换到备份库
       ↓
使用备份库继续工作
       ↓
修复主库后同步备份
```

---

## ⚠️ 什么情况算"异常"？

| 情况 | 处理 |
|------|------|
| 技能文件被删除 | 切换到备份库 |
| 技能文件损坏（无法读取） | 切换到备份库 |
| 技能内容被篡改（错误内容） | 切换到备份库 |
| 目录权限问题 | 切换到备份库 |
| Git 冲突未解决 | 切换到备份库 |

---

## 🔄 同步机制

### 原则

```
主库更新 → 立刻同步到备份库
备份库 → 只读，不直接修改
```

### 同步时机

| 时机 | 操作 |
|------|------|
| 每次 commit 主库后 | 同步到备份库 |
| 每天自动检查一次 | 确保一致性 |
| 发现不一致时 | 以主库为准同步 |

---

## 📝 同步脚本

### 手动同步命令

```bash
# 从主库同步到备份库
cp -r skills/code-quality-workflow/ skills-backup/
cp -r skills/tech-error-log/ skills-backup/
cp -r skills/code-security-check/ skills-backup/
cp skills/SKILL-MAINTENANCE.md skills-backup/

echo "备份完成！$(date)"
```

### 自动化同步（推荐）

```bash
# 添加到 git post-commit hook
#!/bin/bash
# .git/hooks/post-commit

# 同步到备份库
cp -r skills/ skills-backup/

echo "Skills backed up at $(date)"
```

---

## 🧪 验证备份

### 每周检查一次

```bash
# 1. 检查备份目录是否存在
ls -la skills-backup/

# 2. 检查文件数量
find skills-backup/ -type f | wc -l

# 3. 对比主库和备份库
diff -r skills/ skills-backup/

# 如果有差异，会显示出来
```

### 检查清单

```
□ skills-backup/ 目录存在
□ 所有技能文件都已备份
□ 备份文件大小与主库一致
□ 备份文件可以正常读取
□ 最近 7 天内有同步记录
```

---

## 🚨 紧急切换流程

### 场景：主库损坏

```
1. 发现 skills/ 目录异常
   ↓
2. 检查异常类型（删除/损坏/权限）
   ↓
3. 确认需要切换
   ↓
4. 修改配置指向 skills-backup/
   ↓
5. 验证备份库可用
   ↓
6. 继续使用
   ↓
7. 修复主库后重新同步
```

### 切换命令

```bash
# 方法 1：修改引用路径
# 将代码中的 skills/ 改为 skills-backup/

# 方法 2：符号链接（推荐）
rm -rf skills
ln -s skills-backup skills

# 方法 3：复制覆盖
rm -rf skills
cp -r skills-backup skills
```

---

## 📊 同步状态追踪

### 状态文件

创建 `.backup-state.json` 记录同步状态：

```json
{
  "lastSync": "2026-03-09T12:00:00Z",
  "status": "synced",
  "primaryPath": "skills/",
  "backupPath": "skills-backup/",
  "filesSynced": [
    "code-quality-workflow/SKILL.md",
    "code-quality-workflow/bug-lessons.md",
    "tech-error-log/SKILL.md",
    "tech-error-log/errors/*",
    "code-security-check/SKILL.md",
    "SKILL-MAINTENANCE.md"
  ],
  "lastVerified": "2026-03-09T12:00:00Z",
  "verificationResult": "passed"
}
```

---

## 📅 维护计划

### 每日（自动）

```
□ 主库更新后自动同步到备份
```

### 每周（手动检查）

```
□ 运行 diff 检查主备一致性
□ 验证备份文件可读
□ 更新状态文件
```

### 每月（完整测试）

```
□ 模拟切换测试（切换到备份库）
□ 验证备份库功能正常
□ 切换回主库
□ 记录测试结果
```

---

## 🎯 版本控制

### Git 策略

```
主库：正常 commit
备份库：可以选择是否纳入 Git

选项 A：备份库也提交到 Git（推荐）
- 优点：有历史记录，可追溯
- 缺点：仓库体积翻倍

选项 B：备份库不提交（.gitignore）
- 优点：仓库体积小
- 缺点：没历史记录

推荐：选项 A（安全第一）
```

### .gitignore 配置

```gitignore
# 如果选择备份库不提交
skills-backup/**/*

# 但保留目录结构
!skills-backup/.gitkeep
```

---

## 💡 最佳实践

### 1. 主库优先

```
始终先修改主库 (skills/)
       ↓
然后同步到备份库
       ↓
不直接修改备份库
```

### 2. 及时同步

```
每次 commit 主库后
       ↓
立刻同步到备份库
       ↓
不要积压
```

### 3. 定期验证

```
每周至少验证一次
       ↓
确保备份可用
       ↓
不要等出问题时才发现备份坏了
```

### 4. 文档化

```
记录每次切换事件
       ↓
分析原因
       ↓
改进流程
```

---

## 📋 切换日志模板

```markdown
## 切换记录

| 日期 | 原因 | 操作 | 结果 |
|------|------|------|------|
| YYYY-MM-DD | [为什么切换] | [切换命令] | [成功/失败] |
```

---

## 🔗 相关文件

| 文件 | 作用 |
|------|------|
| [SKILL-MAINTENANCE.md](skills/SKILL-MAINTENANCE.md) | 技能维护指南 |
| skills/ | 主技能库 |
| skills-backup/ | 备份技能库 |

---

## 🚀 快速参考

### 同步主库到备份

```bash
# 一键同步
cp -r skills/* skills-backup/
echo "Synced at $(date)" >> skills-backup/.sync-log
```

### 检查差异

```bash
diff -r skills/ skills-backup/
```

### 验证备份

```bash
# 检查文件数量
find skills/ -type f | wc -l
find skills-backup/ -type f | wc -l

# 应该相同
```

### 紧急切换

```bash
# 切换到备份
rm -rf skills
cp -r skills-backup skills

# 或符号链接
rm -rf skills
ln -s skills-backup skills
```

---

*版本：1.0 | 创建日期：2026-03-09 | 使用者：杰克（Claude）*

*最后更新：2026-03-09*

---

**双份保障，万无一失**！🔒
