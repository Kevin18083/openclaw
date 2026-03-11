# Token 用量统计系统

## 📋 系统说明

自动记录每次 API 调用的 token 消耗，帮助您了解用量和成本。

## 📍 文件位置

| 文件 | 路径 | 说明 |
|------|------|------|
| 统计脚本 | `workspace/token-tracker.js` | 核心统计模块 |
| 总统计数据 | `logs/token-stats.json` | 累计用量数据 |
| 每日日志 | `logs/token-YYYY-MM-DD.md` | 每日详细记录 |

## 🚀 使用方法

### 1. 在代码中引入

```javascript
const TokenTracker = require('./token-tracker');
const tracker = new TokenTracker();

// 记录 token 使用
tracker.record('qwen3.5-plus', 1000, 500, 200);
// 参数：模型名，input tokens, output tokens, cache tokens
```

### 2. 查看统计报告

```bash
# 命令行查看报告
node workspace/token-tracker.js
```

## 📊 统计内容

| 项目 | 说明 |
|------|------|
| Input tokens | 输入的 token 数量 |
| Output tokens | 输出的 token 数量 |
| Cache tokens | 缓存命中的 token 数量 |
| Total tokens | 总计 token 数量 |
| 调用次数 | API 调用次数 |

## 💰 成本估算（阿里云）

| 模型 | 价格（元/1K tokens） |
|------|---------------------|
| qwen3.5-plus | 输入 ¥0.004 / 输出 ¥0.012 |
| qwen-max | 输入 ¥0.04 / 输出 ¥0.12 |
| DeepSeek | 输入 ¥0.001 / 输出 ¥0.004 |

## 📈 查看今日用量

```bash
node workspace/token-tracker.js
```

---

*最后更新：2026-03-09*
