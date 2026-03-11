# Coding Agent 技能

> 学习时间：2026-03-07

---

## 📋 概述

Coding Agent 技能用于通过后台进程委托编码任务给 **Codex**、**Claude Code**、**Pi** 等 AI 编程代理。

### 适用场景
1. 构建/创建新功能或应用
2. 审查 PR（在临时目录）
3. 重构大型代码库
4. 需要文件探索的迭代编码

### 不适用场景
- 简单一行修复（直接编辑）
- 阅读代码（使用 read 工具）
- 在 `~/clawd` 工作区工作（不要在这里生成代理）

---

## ⚠️ PTY 模式必须！

编程代理是**交互式终端应用**，需要伪终端 (PTY) 才能正常工作。

```bash
# ✅ 正确 - 使用 PTY
bash pty:true command:"codex exec '你的提示'"

# ❌ 错误 - 没有 PTY，代理可能崩溃
bash command:"codex exec '你的提示'"
```

### Bash 工具参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `command` | string | 要运行的 shell 命令 |
| `pty` | boolean | **编程代理必备！** 分配伪终端 |
| `workdir` | string | 工作目录（代理只看到此文件夹上下文） |
| `background` | boolean | 后台运行，返回 sessionId 用于监控 |
| `timeout` | number | 超时秒数 |
| `elevated` | boolean | 在主机上运行而非沙盒 |

---

## 🚀 快速开始

### 一次性任务
```bash
# 快速提示（Codex 需要 git 仓库！）
SCRATCH=$(mktemp -d) && cd $SCRATCH && git init && codex exec "你的提示"

# 在真实项目中 - 使用 PTY！
bash pty:true workdir:~/Projects/myproject command:"codex exec '为 API 调用添加错误处理'"
```

### 后台运行（长时间任务）
```bash
# 在目标目录启动代理（使用 PTY！）
bash pty:true workdir:~/project background:true command:"codex exec --full-auto '构建一个贪吃游戏'"

# 监控进度
process action:log sessionId:XXX

# 检查是否完成
process action:poll sessionId:XXX

# 发送输入
process action:submit sessionId:XXX data:"yes"

# 终止会话
process action:kill sessionId:XXX
```

---

## 🛠️ Process 工具动作（后台会话）

| 动作 | 说明 |
|------|------|
| `list` | 列出所有运行中/最近的会话 |
| `poll` | 检查会话是否仍在运行 |
| `log` | 获取会话输出（可选 offset/limit） |
| `write` | 发送原始数据到 stdin |
| `submit` | 发送数据 + 换行（如输入并按 Enter） |
| `send-keys` | 发送键令牌或十六进制字节 |
| `paste` | 粘贴文本 |
| `kill` | 终止会话 |

---

## 🤖 各代理使用方式

### Codex CLI
```bash
# 一次性（自动批准）- 记得 PTY！
bash pty:true workdir:~/project command:"codex exec --full-auto '构建深色模式切换'"

# 后台运行
bash pty:true workdir:~/project background:true command:"codex --yolo '重构 auth 模块'"

# 审查 PR
bash pty:true workdir:/tmp/review command:"codex review --base origin/main"
```

**模式说明：**
- `exec "prompt"` - 一次性执行，完成后退出
- `--full-auto` - 沙盒内自动批准
- `--yolo` - 无沙盒，无批准（最快，最危险）

### Claude Code
```bash
# 使用 PTY 获得正确的终端输出
bash pty:true workdir:~/project command:"claude '你的任务'"

# 后台运行
bash pty:true workdir:~/project background:true command:"claude '你的任务'"
```

### OpenCode
```bash
bash pty:true workdir:~/project command:"opencode run '你的任务'"
```

### Pi Coding Agent
```bash
# 安装：npm install -g @mariozechner/pi-coding-agent
bash pty:true workdir:~/project command:"pi '你的任务'"

# 非交互模式
bash pty:true command:"pi -p '总结 src/'"

# 不同提供商/模型
bash pty:true command:"pi --provider openai --model gpt-4o-mini -p '你的任务'"
```

---

## 📋 批量 PR 审查（并行）

```bash
# 获取所有 PR refs
git fetch origin '+refs/pull/*/head:refs/remotes/origin/pr/*'

# 并行审查多个 PR
bash pty:true workdir:~/project background:true command:"codex exec '审查 PR #86. git diff origin/main...origin/pr/86'"
bash pty:true workdir:~/project background:true command:"codex exec '审查 PR #87. git diff origin/main...origin/pr/87'"

# 监控所有
process action:list

# 发布结果到 GitHub
gh pr comment <PR#> --body "<审查内容>"
```

---

## 🌳 使用 git worktrees 并行修复问题

```bash
# 1. 为每个问题创建 worktree
git worktree add -b fix/issue-78 /tmp/issue-78 main
git worktree add -b fix/issue-99 /tmp/issue-99 main

# 2. 在每个 worktree 中启动 Codex（后台 + PTY！）
bash pty:true workdir:/tmp/issue-78 background:true command:"pnpm install && codex --yolo '修复问题 #78'"
bash pty:true workdir:/tmp/issue-99 background:true command:"pnpm install && codex --yolo '修复问题 #99'"

# 3. 监控进度
process action:list

# 4. 创建 PR
cd /tmp/issue-78 && git push -u origin fix/issue-78
gh pr create --repo user/repo --head fix/issue-78 --title "fix: ..." --body "..."

# 5. 清理
git worktree remove /tmp/issue-78
git worktree remove /tmp/issue-99
```

---

## ⚠️ 重要规则

1. **始终使用 pty:true** - 编程代理需要终端！
2. **尊重工具选择** - 用户要求 Codex 就用 Codex
3. **要有耐心** - 不要因为"慢"就终止会话
4. **使用 process:log 监控** - 检查进度不干扰
5. **--full-auto 用于构建** - 自动批准更改
6. **vanilla 用于审查** - 不需要特殊标志
7. **可以并行** - 同时运行多个 Codex 进程
8. **绝不在 ~/.openclaw/ 启动 Codex** - 会读取敏感文件
9. **绝不在 ~/Projects/openclaw/ 切换分支** - 这是 LIVE OpenClaw 实例

---

## 📢 完成时自动通知

对于长时间运行的任务，添加唤醒触发器：

```bash
bash pty:true workdir:~/project background:true command:"codex --yolo exec '构建 REST API'

当完全完成时，运行：
openclaw system event --text \"Done: 构建了 todos REST API\" --mode now"
```

这会在完成后立即触发通知！

---

*此技能记录永久保存*
