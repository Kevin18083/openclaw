# Claude Code Hooks 技能

> 学习时间：2026-03-07

---

## 📚 概述

Hooks 是 Claude Code 的事件驱动自动化脚本，用于在工具调用前后执行验证、添加上下文或集成外部工具。

---

## 🔧 Hook 事件类型

| 事件 | 触发时机 | 用途 |
|------|----------|------|
| **PreToolUse** | 工具运行前 | 验证、批准、修改工具调用 |
| **PostToolUse** | 工具完成后 | 反馈、日志、分析结果 |
| **Stop** | 主代理准备停止 | 验证任务完整性 |
| **SubagentStop** | 子代理准备停止 | 验证子代理任务完成 |
| **UserPromptSubmit** | 用户提交提示时 | 添加上下文、验证 |
| **SessionStart** | 会话开始时 | 加载项目上下文 |
| **SessionEnd** | 会话结束时 | 清理、日志 |
| **PreCompact** | 上下文压缩前 | 添加关键信息 |
| **Notification** | 发送通知时 | 日志、反应 |

---

## 📝 Hook 配置格式

### Plugin hooks.json 格式（插件用）
```json
{
  "hooks": {
    "PreToolUse": [...],
    "Stop": [...],
    "SessionStart": [...]
  }
}
```

### Settings 格式（用户设置）
```json
{
  "PreToolUse": [...],
  "Stop": [...]
}
```

---

## 🎯 Hook 类型

### Prompt-Based Hook（推荐）
```json
{
  "type": "prompt",
  "prompt": "验证工具使用：$TOOL_INPUT",
  "timeout": 30
}
```
- 用于复杂判断
- 上下文感知决策
- 无需编写脚本

### Command Hook
```json
{
  "type": "command",
  "command": "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh",
  "timeout": 60
}
```
- 快速确定性验证
- 文件系统操作
- 外部工具集成

---

## 🛠️ 常用工具钩子

### Hookify 命令
```bash
/hookify 警告我使用 rm -rf 命令      # 创建规则
/hookify:list                        # 列出所有规则
/hookify:configure                   # 交互式配置
/hookify:help                        # 获取帮助
```

### 规则文件示例
```markdown
---
name: block-dangerous-rm
enabled: true
event: bash
pattern: rm\s+-rf
action: block
---

⚠️ 检测到危险 rm 命令！
```

---

## 📋 常用钩子模式

1. **安全验证** - 阻止写入敏感文件
2. **测试强制** - 停止前确保运行测试
3. **上下文加载** - 会话开始加载项目配置
4. **通知日志** - 记录所有通知
5. **MCP 工具监控** - 验证 MCP 工具使用
6. **构建验证** - 代码修改后验证构建
7. **权限确认** - 危险操作前询问用户
8. **代码质量检查** - 文件编辑后运行 linter

---

## 📂 配置文件位置

- **Plugin Hooks**: `.claude/plugins/*/hooks/hooks.json`
- **User Hooks**: `.claude/settings.json`
- **Hookify Rules**: `.claude/hookify.*.local.md`

---

## 💡 环境变量

- `$CLAUDE_PROJECT_DIR` - 项目根目录
- `$CLAUDE_PLUGIN_ROOT` - 插件目录
- `$CLAUDE_ENV_FILE` - 持久化环境变量

---

*此技能记录永久保存*
