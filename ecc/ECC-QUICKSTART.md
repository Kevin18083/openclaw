# ECC 融合版 - 快速参考卡片

> 打印此卡片放在桌边，随时参考

---

## 🎯 三句话用法

1. **规划任务** → 说 `/plan [任务]` 或 "用 TDD 方式"
2. **执行检查** → 说 "让杰克检查"
3. **学习新知** → 说 `/learn [主题]` 或 "记住这个"

---

## 📋 ECC 命令速查

| 命令 | 作用 | 示例 |
|------|------|------|
| `/plan` | 结构化规划 | `/plan 添加登录功能` |
| `/tdd` | 测试驱动开发 | `/tdd 修复缓存 bug` |
| `/learn` | 持续学习 | `/learn Redis 优化` |

---

## 🔥 ECC 触发词

```
用 TDD 方式          → TDD 工作流
代码审查            → Code Review
安全扫描            → Security Scan
学习一下            → 持续学习
记住这个            → 写入记忆
让杰克检查          → AI 审查
```

---

## 🚀 杰克系统命令

```bash
# 创建检查任务
node jack-review.js "让杰克检查 [任务名]"

# 提交内容
node jack-review.js submit "详情"

# 查看状态
node jack-review.js status
```

---

## 📁 文件位置

| 内容 | 路径 |
|------|------|
| ECC 技能 | `workspace/ecc-skills/` |
| ECC 命令 | `workspace/ecc-commands/` |
| ECC 钩子 | `workspace/ecc-hooks/` |
| ECC 文档 | `workspace/ECC-README.md` |
| 杰克记忆 | `~/.claude/memory/MEMORY.md` |

---

## ✅ 核心流程

```
/plan → /tdd → 代码审查 → 安全扫描 → 让杰克检查 → ✅杰克已阅
```

---

## 💡 提示

- ECC 命令用斜杠 `/` 开头
- 触发词直接用中文说
- 杰克检查自动调用 DeepSeek AI
- 所有学习自动写入记忆

---

*ECC 融合版 v1.0 - 2026-03-11*
