---
name: Tavily Search
description: 使用Tavily API进行网络搜索。Tavily是一个专门为AI代理设计的搜索API，提供高质量、结构化的搜索结果。
metadata: {"clawdbot":{"requires":{"bins":["node"]},"install":[{"id":"npm","kind":"npm","package":"@tavily/core","label":"Install Tavily SDK"}]}}
---

# Tavily Search Skill

## 安装依赖

```bash
npm install @tavily/core
```

## 配置

需要设置环境变量：
```bash
export TAVILY_API_KEY=your_api_key_here
```

或者在代码中直接设置：
```javascript
const tavily = new TavilyClient({ apiKey: "your_api_key_here" });
```

## 基本用法

```javascript
const { TavilyClient } = require('@tavily/core');

const tavily = new TavilyClient({
  apiKey: process.env.TAVILY_API_KEY
});

// 简单搜索
const searchResults = await tavily.search("OpenAI最新发布");
console.log(searchResults);

// 带参数的搜索
const detailedResults = await tavily.search({
  query: "人工智能发展趋势",
  searchDepth: "advanced",
  includeAnswer: true,
  includeRawContent: true,
  maxResults: 10
});
```

## 高级功能

- **研究模式**：深度搜索和分析
- **答案提取**：自动提取问题的直接答案
- **内容抓取**：获取网页原始内容
- **多语言支持**：支持多种语言的搜索

## 注意事项

1. 需要注册Tavily账户获取API密钥
2. 有免费额度，超出后需要付费
3. 搜索结果经过优化，更适合AI代理使用
4. 支持实时搜索和历史搜索