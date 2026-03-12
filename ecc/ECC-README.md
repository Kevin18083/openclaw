# ECC 融合版 - Everything Claude Code for OpenClaw

> **版本**: v1.0
> **创建时间**: 2026-03-11
> **来源**: [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) + 杰克/扎克系统

---

## 🎯 概述

这是 **Everything Claude Code (ECC)** 的精简融合版本，专为 **OpenClaw + 杰克/扎克系统** 定制。

**融合了**:
- ✅ ECC 的 80+ Skills → 杰克触发词响应模板
- ✅ ECC 的 40+ Commands → OpenClaw 斜杠命令
- ✅ ECC 的 Hooks → Node.js 钩子集成
- ✅ ECC 的 Rules → workspace 规范目录
- ✅ ECC 的 Instincts → 杰克 12 类注释系统

**保留了**:
- ✅ 杰克 AI 检查系统 (DeepSeek)
- ✅ 扎克执行工作流
- ✅ AB 轮换记忆系统
- ✅ OpenClaw Gateway 集成

---

## 📁 目录结构

```
.openclaw/workspace/
├── ecc-skills/           # ECC 技能模板
│   ├── tdd-workflow.md   # TDD 工作流
│   ├── code-review.md    # 代码审查
│   └── security-scan.md  # 安全扫描
├── ecc-commands/         # ECC 命令定义
│   ├── plan.md           # /plan 规划命令
│   ├── tdd.md            # /tdd 测试命令
│   └── learn.md          # /learn 学习命令
├── ecc-hooks/            # ECC 钩子脚本
│   ├── session-start.js  # 会话启动钩子
│   └── task-submit.js    # 任务提交钩子
└── ECC-README.md         # 本文档
```

---

## 🚀 快速开始

### 1. 使用 ECC Skills

在聊天中使用触发词：

| 触发词 | 激活技能 |
|--------|----------|
| "用 TDD 方式" | TDD 工作流 |
| "代码审查" | Code Review |
| "安全扫描" | Security Scan |

### 2. 使用 ECC Commands

在 OpenClaw 中使用斜杠命令：

```bash
/plan 添加用户登录功能
/tdd 修复缓存失效 bug
/learn Redis 最佳实践
```

### 3. 与杰克系统联动

```bash
# 创建检查任务
node jack-review.js "让杰克检查 [任务名]"

# 提交内容
node jack-review.js submit "任务详情"

# 查看状态
node jack-review.js status
```

---

## 📚 Skills 列表

### TDD 工作流
- **触发词**: "用 TDD 方式"、"测试驱动"
- **流程**: 红 → 绿 → 重构
- **输出**: 测试覆盖率 ≥ 80%

### 代码审查
- **触发词**: "代码审查"、"code review"
- **维度**: 质量/安全/性能/可维护性
- **输出**: 审查报告 + 修改建议

### 安全扫描
- **触发词**: "安全扫描"、"检查漏洞"
- **扫描**: 敏感数据/注入风险/依赖安全
- **输出**: 风险等级 + 修复建议

---

## 📋 Commands 列表

| 命令 | 说明 | 输出 |
|------|------|------|
| `/plan` | 结构化规划 | 任务列表 + 验收标准 |
| `/tdd` | 测试驱动开发 | 测试用例 + 实现代码 |
| `/learn` | 持续学习 | 学习笔记 + 记忆更新 |
| `/review` | 代码审查 | 审查报告 + 建议 |
| `/security` | 安全扫描 | 风险报告 + 修复 |

---

## 🔗 Hooks 集成

### SessionStart (会话启动)

自动执行：
1. 记忆系统健康检查
2. A/B 文件同步
3. 加载会话状态

```bash
node ecc-hooks/session-start.js
```

### TaskSubmit (任务提交)

自动执行：
1. 保存提交记录
2. 触发杰克 AI 检查
3. 生成审查报告

```bash
node ecc-hooks/task-submit.js [taskId] [content]
```

---

## 💡 最佳实践

### 1. 使用触发词
在聊天中自然使用触发词，杰克会自动响应：
- "这个用 TDD 方式写"
- "代码审查一下"
- "让杰克检查安全"

### 2. 遵循流程
```
规划 → TDD 实现 → 代码审查 → 安全扫描 → 杰克已阅
```

### 3. 持续学习
每次任务完成后：
1. `/learn` 学习新知识
2. 自动写入记忆
3. 更新技能模板

---

## 🔧 配置

### 环境变量
```bash
# ECC 配置
export ECC_HOOK_PROFILE=standard  # minimal|standard|strict
export ECC_DISABLED_HOOKS=        # 逗号分隔的禁用钩子列表
```

### 杰克系统配置
```bash
# AI 检查配置
export DEEPSEEK_API_KEY=sk-xxx
export DEEPSEEK_MODEL=deepseek-chat
```

---

## 📊 对比 ECC 原版

| 组件 | ECC 原版 | 融合版 | 说明 |
|------|----------|--------|------|
| Skills | 80+ | 3 (核心) | 精选最实用的 |
| Commands | 40+ | 3 (核心) | 精选最常用的 |
| Hooks | 10+ | 2 (核心) | 会话启动 + 任务提交 |
| Rules | 50+ | 使用现有 | 复用杰克规范 |
| AI 检查 | 无 | DeepSeek | 杰克独有 |

---

## 🎯 核心原则

融合版遵循 ECC 的核心原则：

- ✅ **测试 BEFORE 代码** - TDD 优先
- ✅ **持续学习** - 每次会话提取模式
- ✅ **安全第一** - 所有代码经过审查
- ✅ **文档驱动** - 先写文档再实现
- ✅ **自动化** - 能自动的不手动

---

## 📝 版本历史

| 版本 | 日期 | 内容 |
|------|------|------|
| v1.0 | 2026-03-11 | 初始融合版发布 |

---

## 🔗 参考链接

- [ECC 原版仓库](https://github.com/affaan-m/everything-claude-code)
- [ECC 简体中文文档](https://github.com/affaan-m/everything-claude-code/blob/main/README.zh-CN.md)
- [杰克 AI 检查系统](./杰克 AI 检查系统使用说明.md)
- [扎克完全指南](./扎克完全指南.md)

---

*ECC 融合版 v1.0 - 2026-03-11*
*为 OpenClaw + 杰克/扎克系统定制*
