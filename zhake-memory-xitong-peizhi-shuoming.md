# 扎克记忆系统 - 完整配置说明

> **创建日期**: 2026-03-12
> **创建者**: 杰克 (Jack) 帮扎克整理
> **版本**: v1.0

---

## 📋 扎克记忆文件位置

**核心原则：杰克和扎克的文件完全分开！**

| 系统 | 位置 | 说明 |
|------|------|------|
| **杰克** | `C:/Users/17589/.claude/` | 杰克的独立数据 |
| **扎克** | `C:/Users/17589/.openclaw/workspace/` | 扎克的独立数据 |

---

## 🗂️ 扎克记忆结构

```
C:/Users/17589/.openclaw/workspace/
├── MEMORY.md              # A 本 - 主记忆文件
├── MEMORY-B.md            # B 本 - 热备份（AB 轮换）
├── MEMORY-BACKUP.md       # 旧备份文件
├── memory-ab-state.json   # AB 轮换状态
├── memory-ab-switcher.js  # AB 轮换脚本
│
├── memory/                # 记忆目录
│   ├── daily/             # 每日记忆
│   ├── weekly/            # 每周总结
│   ├── monthly/           # 每月总结
│   ├── yearly/            # 年度总结
│   ├── categories/        # 分类记忆
│   │   ├── learning/      # 学习记录
│   │   ├── skills/        # 技能掌握
│   │   ├── system/        # 系统状态
│   │   └── events/        # 重要事件
│   └── archive/           # 归档文件
│
├── knowledge/             # 知识库
│   └── daily-learning/    # 每日学习内容
│
├── zach-daily-learning.js       # 扎克每日学习脚本
├── install-zach-learning.ps1    # 扎克学习计划任务安装
│
└── (其他扎克系统文件...)
```

---

## 🔄 AB 轮换保护机制

### 工作原理

| 状态 | 说明 |
|------|------|
| **正常** | 使用 A 本 (MEMORY.md) |
| **A 异常** | 自动切 B 本 (MEMORY-B.md) |
| **A 恢复** | 自动切回 A 本 |
| **写入** | 同时更新 A+B 两份 |

### 健康检查标准

1. ✅ 文件存在
2. ✅ 大小 > 1000 字节
3. ✅ 包含必需章节（System Status, Important Event, Memory）

### 使用命令

```bash
# 查看状态
node memory-ab-switcher.js status

# 手动切换
node memory-ab-switcher.js switch

# 强制同步 A/B
node memory-ab-switcher.js sync
```

---

## 📚 每日学习系统

### 扎克的学习主题（和杰克不同）

扎克学的是**OpenClaw 和 Node.js 相关**的实用技能：

| 分类 | 主题 |
|------|------|
| OpenClaw | RPC 通信、网关配置 |
| Node.js | 文件系统、进程管理 |
| 数据库 | SQLite、MongoDB |
| API | HTTP、RESTful |
| 安全 | Token 认证、输入验证 |
| 测试 | 单元测试、集成测试 |
| 工具 | CLI 开发、日志系统 |
| 架构 | 模块化、配置管理 |

### 计划任务时间

| 任务 | 时间 | 说明 |
|------|------|------|
| **杰克学习** | 13:00 + 19:00 | 杰克的技术主题 |
| **扎克学习** | 14:00 + 20:00 | 扎克的实用技能 |

### 使用命令

```bash
# 运行今日学习
node zach-daily-learning.js

# 查看学习内容
ls knowledge/daily-learning/
```

---

## 🛡️ 数据保护层级

| 层级 | 位置 | 说明 |
|------|------|------|
| **L1-A** | `workspace/MEMORY.md` | 主文件 |
| **L1-B** | `workspace/MEMORY-B.md` | 热备份 |
| **L2-C1** | `D:/AAAAAA/openclaw-backup/` | D 盘镜像 1 |
| **L2-C2** | `D:/AAAAAA/zhake_jingxiang_dpan_beifen/` | D 盘镜像 2 |

---

## ⚠️ 重要：杰克和扎克文件区分

| 系统 | 记忆文件 | 学习脚本 | 计划任务 | 知识库存放 |
|------|---------|---------|---------|-----------|
| **杰克** | `~/.claude/memory/MEMORY.md` | `~/.claude/jack-daily-learning.js` | Jack Daily Learning (1PM/7PM) | `~/.claude/jack-knowledge/` |
| **扎克** | `~/.openclaw/workspace/MEMORY.md` | `~/.openclaw/workspace/zach-daily-learning.js` | Zach Daily Learning (2PM/8PM) | `~/.openclaw/workspace/knowledge/` |

**绝对不能混在一起！**

---

## 📝 维护命令

### 扎克系统

```bash
# AB 轮换检查
node memory-ab-switcher.js status

# 运行今日学习
node zach-daily-learning.js

# 查看学习历史
ls knowledge/daily-learning/
```

### 杰克系统

```bash
# AB 轮换检查
node jack-memory-ab-switcher.js status  # (如需要可创建)

# 运行今日学习
node jack-daily-learning.js

# 查看学习历史
ls jack-knowledge/deep-learning/
```

---

## ✅ 系统状态 (2026-03-12)

| 系统 | 状态 |
|------|------|
| 扎克 MEMORY.md | ✅ 健康 (18480 字节) |
| 扎克 MEMORY-B.md | ✅ 健康 (18480 字节) |
| AB 轮换脚本 | ✅ 已创建 |
| 扎克每日学习 | ✅ 已创建 |
| 扎克计划任务 | ✅ 已安装 (14:00 + 20:00) |
| D 盘镜像同步 | ✅ 已完成 |

---

*此文档由杰克生成，永久保存*
*位置：`C:/Users/17589/.openclaw/workspace/扎克记忆系统配置说明.md`*
