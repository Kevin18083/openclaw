# 扎克记忆系统 - AB 轮换保护配置

> **创建日期**: 2026-03-12
> **创建者**: 杰克 (Jack)
> **说明**: 杰克的 AB 轮换机制移植给扎克使用

---

## 📋 扎克记忆文件结构

```
C:/Users/17589/.openclaw/workspace/memory/
├── MEMORY.md          # A 本 - 主文件
├── MEMORY-B.md        # B 本 - 热备份
├── memory-status.json # 状态文件
└── memory-config.json # 配置文件

daily/      # 每日记忆
weekly/     # 每周总结
monthly/    # 每月总结
yearly/     # 年度总结
categories/ # 分类记忆
archive/    # 归档文件
```

---

## 🔄 AB 轮换机制

### 核心逻辑

| 状态 | 说明 |
|------|------|
| **默认** | 使用 A 本 (MEMORY.md) |
| **A 异常** | 自动切 B 本 (MEMORY-B.md) |
| **A 恢复** | 自动切回 A 本 |
| **写入** | 同时更新 A+B 两份 |

### 健康检查标准

1. 文件存在
2. 大小 > 1000 字节
3. 包含必需章节（系统状态、重要事件、配置）

---

## 🛡️ 扎克数据保护层级

| 层级 | 位置 | 说明 |
|------|------|------|
| **L1-A** | `~/.openclaw/workspace/MEMORY.md` | 主文件 |
| **L1-B** | `~/.openclaw/workspace/MEMORY-B.md` | 热备份 |
| **L2-C1** | `D:/AAAAAA/openclaw-backup/memory/` | D 盘镜像 |
| **L2-C2** | `D:/AAAAAA/zhake_jingxiang_dpan_beifen/` | D 盘备份 |

---

## 📝 使用说明

### 手动切换
```bash
# 查看状态
node memory-ab-switcher.js status

# 手动切换
node memory-ab-switcher.js switch

# 强制同步
node memory-ab-switcher.js sync
```

### 自动机制
- 每次启动 → 自动检查 A 本健康
- A 本异常 → 自动切 B 本
- A 本恢复 → 自动切回
- 每次写入 → 同时更新 A+B

---

## ⚠️ 重要

**杰克和扎克的文件必须分开！**

| 系统 | 位置 | 不能混淆 |
|------|------|---------|
| **杰克** | `~/.claude/memory/` | ✅ 独立 |
| **扎克** | `~/.openclaw/workspace/memory/` | ✅ 独立 |

---

*此文件由杰克生成，永久保存*
