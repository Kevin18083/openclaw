# 扎克缓存优化器 - 集成指南

> **版本**: v1.0
> **创建时间**: 2026-03-09
> **目标**: 将缓存命中率从 32.6% 提升到 50-70%

---

## 📦 核心原理

阿里云百炼的缓存是**基于 prompt 相似度自动命中**的：
- 相同的 system message ✅
- 相同的 user prompt 前缀 ✅
- 变量位置固定 ✅

**命中率低的原因**：每次请求的 prompt 变化太大

---

## 🚀 扎克如何集成

### 方法 1: 在 agent 脚本中调用（推荐）

```javascript
const { generateOptimizedRequest } = require('./zach-cache-optimizer');

// 生成优化的请求
const request = generateOptimizedRequest(
  'code',           // 类别：basic, code, analysis, learn
  'func',           // 模板名
  {                 // 变量
    functionality: '计算斐波那契数列',
    language: 'JavaScript',
    inputs: 'n (数字)',
    outputs: '第 n 个斐波那契数'
  },
  'coder'          // 系统消息类型：default, coder, analyst, chat
);

// 发送到阿里云 API
const response = await fetch('https://coding.dashscope.aliyuncs.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  },
  body: JSON.stringify({
    model: 'qwen3.5-plus',
    messages: [
      { role: 'system', content: request.system },
      { role: 'user', content: request.user }
    ]
  })
});
```

### 方法 2: 使用命令行

```bash
# 生成优化的 prompt
node zach-cache-optimizer.js generate code func '{"functionality":"xxx","language":"JavaScript"}'

# 查看缓存状态
node zach-cache-optimizer.js status
```

---

## 📋 20 个可用模板

### 基础问答 (5 个)
| 模板名 | 用途 | 命中率目标 |
|--------|------|-----------|
| `weather` | 天气查询 | 70% |
| `fact` | 事实查询 | 70% |
| `calc` | 计算问题 | 75% |
| `define` | 定义解释 | 72% |
| `list` | 列表生成 | 75% |
| `trouble` | 故障排查 | 70% |

### 代码任务 (5 个)
| 模板名 | 用途 | 命中率目标 |
|--------|------|-----------|
| `func` | 函数编写 | 70% |
| `debug` | 调试分析 | 70% |
| `refactor` | 代码重构 | 70% |
| `review` | 代码审查 | 70% |
| `api` | API 设计 | 70% |

### 分析任务 (5 个)
| 模板名 | 用途 | 命中率目标 |
|--------|------|-----------|
| `data` | 数据分析 | 68% |
| `compare` | 对比分析 | 68% |
| `swot` | SWOT 分析 | 68% |
| `summary` | 文本摘要 | 70% |
| `root` | 根因分析 | 68% |

### 学习任务 (5 个)
| 模板名 | 用途 | 命中率目标 |
|--------|------|-----------|
| `concept` | 概念学习 | 70% |
| `compare2` | 技术对比 | 70% |
| `roadmap` | 学习路线 | 70% |
| `best` | 最佳实践 | 70% |

---

## 🔧 系统消息类型

| 类型 | 用途 | 说明 |
|------|------|------|
| `default` | 通用任务 | 80% 的请求使用这个 |
| `coder` | 编程任务 | 写代码、调试、审查 |
| `analyst` | 分析任务 | 数据分析、报告 |
| `chat` | 聊天模式 | 自然对话 |

**重要**：同类型请求**必须使用相同的系统消息**！

---

## 💡 提高命中率的技巧

### 1. 固定系统消息 ✅

```javascript
// ✅ 好 - 始终使用相同的系统消息
const req1 = generateOptimizedRequest('code', 'func', {...}, 'coder');
const req2 = generateOptimizedRequest('code', 'func', {...}, 'coder');

// ❌ 坏 - 系统消息变来变去
const req1 = generateOptimizedRequest('code', 'func', {...}, 'coder');
const req2 = generateOptimizedRequest('code', 'func', {...}, 'default');
```

### 2. 使用模板 ✅

```javascript
// ✅ 好 - 使用模板，前缀固定
const req = generateOptimizedRequest('basic', 'weather', {
  location: '北京',
  time: '今天'
});

// ❌ 坏 - 自由发挥
const prompt = `你好，请告诉我北京今天的天气情况，谢谢！`;
```

### 3. 批处理相似请求 ✅

```javascript
// ✅ 好 - 连续发送相似请求
for (let i = 0; i < 5; i++) {
  generateOptimizedRequest('basic', 'fact', {
    question: `问题${i}`
  }, 'default');
}
```

---

## 📊 监控缓存命中率

```bash
# 查看当前状态
node zach-cache-optimizer.js status

# 输出示例：
# 总请求数：100
# 缓存命中：55
# 缓存未命中：45
# 命中率：55.0%
# 状态：良好 ⚠️
```

### 命中率标准

| 命中率 | 状态 | 说明 |
|--------|------|------|
| ≥70% | ✅ 优秀 | 缓存利用很好 |
| 50-70% | ⚠️ 良好 | 还有提升空间 |
| <50% | ❌ 需改进 | 需要优化使用方式 |

---

## 🎯 快速参考

### 选择模板流程

```
任务类型？
├─ 查询事实/数据 → basic (weather, fact, calc, define, list, trouble)
├─ 写代码/调试 → code (func, debug, refactor, review, api)
├─ 分析数据/报告 → analysis (data, compare, swot, summary, root)
└─ 学习新知识 → learn (concept, compare2, roadmap, best)
```

### 选择系统消息

```
任务类型？
├─ 通用问答 → default
├─ 编程相关 → coder
├─ 数据分析 → analyst
└─ 闲聊对话 → chat
```

---

## 📁 相关文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 优化器 | `zach-cache-optimizer.js` | 核心脚本 |
| 使用指南 | `扎克缓存优化器使用指南.md` | 详细说明 |
| 测试报告 | `zach-cache-test-report.md` | 测试结果 |
| 统计数据 | `zach-cache-stats.json` | 缓存统计 |

---

## 🔍 常见问题

### Q: 为什么命中率还是低？

**A**: 可能原因：
1. 没有使用模板，自由发挥太多
2. 系统消息经常变化
3. 请求间隔超过缓存 TTL（2 小时）
4. 任务本身多样性太高（创意、写作等）

### Q: 如何查看阿里云的缓存数据？

**A**:
1. 打开 OpenClaw Dashboard
2. 进入 **用量** 页面
3. 查看 **缓存命中率**

### Q: 可以自定义模板吗？

**A**: 可以！在 `zach-cache-optimizer.js` 的 `TEMPLATES` 对象中添加。

---

*扎克，记住：每次使用模板，都是在提高效率！*

**缓存优化不是一次性工作，而是持续的习惯！**

---
*最后更新：2026-03-09*
