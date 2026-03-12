# 扎克 (Zack) 记忆系统配置

> **整理时间**: 2026-03-09
> **整理者**: 杰克 (Jack)

---

## 📂 扎克记忆根目录

```
C:\Users\17589\.openclaw\workspace\
```

### 核心目录结构

```
workspace/
├── memory/                           # 主记忆目录
│   ├── MEMORY.md                     # 主记忆文件
│   ├── 2026-03-XX.md                 # 日常记忆
│   ├── self-improvement.md           # 自我改进日志
│   ├── memory-state.json             # 状态文件
│   ├── metrics/                      # 性能指标
│   ├── improvement/                  # 改进建议
│   ├── knowledge/                    # 知识库
│   └── strategies/                   # 策略库
├── memory-backup/                    # 备份记忆目录
│   └── mirror/                       # 镜像
├── backups/                          # 备份目录
│   ├── knowledge-backup/             # 知识备份
│   ├── knowledge-main/               # 知识主备份
│   └── mirror/                       # 镜像
└── MEMORY-BACKUP.md                  # 备份记忆文件
```

---

## 💾 扎克的 6 份保护系统

### 3 个备份文件（带时间戳，保留 7 天）

| # | 位置 | 路径 |
|---|------|------|
| 1 | **C 盘备份 1** | `C:\Users\17589\.openclaw\workspace\backups\knowledge-backup\` |
| 2 | **C 盘备份 2** | `C:\Users\17589\.openclaw\workspace\backups\knowledge-main\` |
| 3 | **D 盘备份** | `D:\AAAAAA\ClaudeBackups\backup\` |

### 3 个镜像文件（只保留最新）

| # | 位置 | 路径 |
|---|------|------|
| 1 | **C 盘镜像 1** | `C:\Users\17589\.openclaw\workspace\memory-backup\mirror\` |
| 2 | **C 盘镜像 2** | `C:\Users\17589\.openclaw\workspace\backups\mirror\` |
| 3 | **D 盘镜像** | `D:\AAAAAA\ClaudeBackups\mirror\` |

---

## 🔧 扎克查看记忆的命令

```bash
# 进入根目录
cd C:\Users\17589\.openclaw\workspace\

# 查看记忆目录
ls memory/

# 查看记忆整理报告
cat memory/扎克记忆整理报告.md

# 查看自我改进日志
cat memory/self-improvement.md

# 查看当前状态
cat memory/memory-state.json

# 查看日常记忆
ls memory/*.md

# 运行记忆维护
node memory/memory-maintenance.js

# 查看报告
node activate-self-improve.js report 7
```

---

## 📊 记忆系统配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 保留天数 | 7 天 | 保留最近 7 天的日常记忆 |
| 维护时间 | 每天 00:00 | 自动维护 |
| 备份数量 | 3 份 | C 盘 2 份 + D 盘 1 份 |
| 镜像数量 | 3 份 | C 盘 2 份 + D 盘 1 份 |
| 总计保护 | 6 份 | 3 备份 +3 镜像 |

---

## 📋 相关文件

| 文件 | 路径 |
|------|------|
| 激活脚本 | `C:\Users\17589\.openclaw\workspace\memory\activate-self-improve.js` |
| 维护脚本 | `C:\Users\17589\.openclaw\workspace\memory\memory-maintenance.js` |
| 使用指南 | `C:\Users\17589\.openclaw\workspace\memory\扎克自我改进使用指南.md` |
| 整理报告 | `C:\Users\17589\.openclaw\workspace\memory\扎克记忆整理报告.md` |

---

*扎克，这是你的记忆系统完整配置，请妥善保管！*

**根目录**: `C:\Users\17589\.openclaw\workspace\`
