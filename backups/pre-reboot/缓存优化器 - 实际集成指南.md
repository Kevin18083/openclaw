# 缓存优化器 - 实际集成指南

> **创建时间**: 2026-03-09 19:50  
> **目标**: 将缓存优化器集成到实际使用的 agent 脚本中

---

## 📦 核心原理

阿里云百炼的缓存是**基于 prompt 相似度自动命中**的：
- ✅ 相同的 system message → 高命中率
- ✅ 相同的 user prompt 前缀 → 部分命中
- ✅ 变量位置固定 → 可预测

---

## 🚀 快速集成（3 步）

### 步骤 1: 引入缓存优化器

在你的 agent 脚本顶部添加：

```javascript
const { generateOptimizedRequest } = require('./zach-cache-optimizer');
```

### 步骤 2: 替换原有请求

**原来的代码**（假设）：
```javascript
const messages = [
  { role: 'system', content: '你是扎克，一个 AI 助手...' },
  { role: 'user', content: '请帮我写一个函数...' }
];
```

**替换为**：
```javascript
const request = generateOptimizedRequest(
  'code',           // 类别：basic, code, analysis, learn
  'func',           // 模板名
  {
    functionality: '计算斐波那契数列',
    language: 'JavaScript',
    inputs: 'n (数字)',
    outputs: '第 n 个斐波那契数'
  },
  'coder'          // 系统消息类型
);

const messages = [
  { role: 'system', content: request.system },
  { role: 'user', content: request.user }
];
```

### 步骤 3: 发送到 API

```javascript
const response = await fetch('https://dashscope.aliyuncs.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  },
  body: JSON.stringify({
    model: 'qwen3.5-plus',
    messages: messages
  })
});
```

---

## 📋 完整示例

### 示例 1: 代码编写任务

```javascript
const { generateOptimizedRequest } = require('./zach-cache-optimizer');

async function writeCode(functionality, language) {
  // 生成优化的请求
  const request = generateOptimizedRequest(
    'code',
    'func',
    {
      functionality: functionality,
      language: language,
      inputs: '根据功能决定',
      outputs: '根据功能决定'
    },
    'coder'
  );
  
  // 发送到 API
  const response = await callAPI(request.system, request.user);
  return response;
}

// 使用
writeCode('计算斐波那契数列', 'JavaScript');
```

### 示例 2: 天气查询

```javascript
async function getWeather(location, time) {
  const request = generateOptimizedRequest(
    'basic',
    'weather',
    {
      location: location,
      time: time || '今天'
    },
    'default'
  );
  
  return await callAPI(request.system, request.user);
}

// 使用
getWeather('北京', '今天');
getWeather('上海', '明天');  // 缓存可能命中！
```

### 示例 3: 数据分析

```javascript
async function analyzeData(dataset, metrics, goal) {
  const request = generateOptimizedRequest(
    'analysis',
    'data',
    {
      dataset: dataset,
      metrics: metrics,
      goal: goal
    },
    'analyst'
  );
  
  return await callAPI(request.system, request.user);
}

// 使用
analyzeData('销售数据', '销售额、利润率', '找出最佳产品');
```

---

## 🎯 20 个可用模板

### 基础问答 (6 个)
| 模板名 | 用途 | 示例 |
|--------|------|------|
| `weather` | 天气查询 | `location: '北京'` |
| `fact` | 事实查询 | `question: '地球周长'` |
| `calc` | 计算问题 | `expression: '1+2+3'` |
| `define` | 定义解释 | `term: '人工智能'` |
| `list` | 列表生成 | `topic: 'Python 库'` |
| `trouble` | 故障排查 | `problem: '无法连接'` |

### 代码任务 (5 个)
| 模板名 | 用途 | 示例 |
|--------|------|------|
| `func` | 函数编写 | `functionality: '排序'` |
| `debug` | 调试分析 | `error: 'TypeError'` |
| `refactor` | 代码重构 | `code: '旧代码'` |
| `review` | 代码审查 | `code: '待审查代码'` |
| `api` | API 设计 | `endpoint: '/users'` |

### 分析任务 (5 个)
| 模板名 | 用途 | 示例 |
|--------|------|------|
| `data` | 数据分析 | `dataset: '销售数据'` |
| `compare` | 对比分析 | `items: 'A vs B'` |
| `swot` | SWOT 分析 | `subject: '公司'` |
| `summary` | 文本摘要 | `text: '长文章'` |
| `root` | 根因分析 | `problem: '问题描述'` |

### 学习任务 (4 个)
| 模板名 | 用途 | 示例 |
|--------|------|------|
| `concept` | 概念学习 | `topic: 'React Hooks'` |
| `compare2` | 技术对比 | `tech1: 'Vue'` |
| `roadmap` | 学习路线 | `skill: 'Python'` |
| `best` | 最佳实践 | `topic: '代码规范'` |

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

## 🧪 测试集成

```bash
# 运行测试示例
node agent-with-cache-optimizer.js

# 查看缓存状态
node zach-cache-optimizer.js status
```

---

## 🔍 常见问题

### Q: 我的 agent 脚本在哪里？

**A**: 检查以下位置：
- `scripts/` 目录
- `memory/` 目录
- 根目录的 `*.js` 文件
- OpenClaw 网关配置中指定的脚本

### Q: 如何确认集成成功？

**A**:
1. 运行 `node zach-cache-optimizer.js status`
2. 查看命中率是否提升
3. 检查日志中的 system message 是否一致

### Q: 可以自定义模板吗？

**A**: 可以！在 `zach-cache-optimizer.js` 的 `TEMPLATES` 对象中添加新模板。

---

## 📁 相关文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 优化器 | `zach-cache-optimizer.js` | 核心脚本 |
| 集成示例 | `agent-with-cache-optimizer.js` | 使用示例 |
| 使用指南 | `扎克缓存优化器使用指南.md` | 详细说明 |
| 测试报告 | `zach-cache-test-report.md` | 测试结果 |
| 统计数据 | `zach-cache-stats.json` | 缓存统计 |

---

*扎克，记住：每次使用模板，都是在提高效率！*

**缓存优化不是一次性工作，而是持续的习惯！**

---
*最后更新：2026-03-09 19:50*
