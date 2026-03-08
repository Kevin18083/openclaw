---
name: Multi Search Engine
description: 多搜索引擎集成 - 支持微软搜索(Bing)、谷歌搜索(Google)、百度搜索(Baidu)和头条搜索(Toutiao)。提供统一的搜索接口，可以同时或分别使用不同搜索引擎。
metadata: {"clawdbot":{"requires":{"bins":["node","npm"]},"install":[{"id":"npm-deps","kind":"npm","package":"axios","label":"安装Axios HTTP库"},{"id":"npm-deps-2","kind":"npm","package":"puppeteer","label":"安装Puppeteer用于百度/头条搜索"}]}}
---

# 多搜索引擎技能

## 功能概述

本技能集成了四个主要的搜索引擎：
1. **微软搜索 (Bing)** - 通过Brave Search API（基于Bing）
2. **谷歌搜索 (Google)** - 通过自定义搜索API或模拟请求
3. **百度搜索 (Baidu)** - 针对中文内容优化，支持中文搜索
4. **头条搜索 (Toutiao)** - 中文新闻和热点内容搜索

## 安装依赖

```bash
npm install axios
```

## 配置说明

### 微软搜索 (Bing/Brave)
- 使用现有的 `web_search` 工具（基于Brave Search API）
- 支持区域化搜索和多语言
- 无需额外API密钥（已集成）

### 谷歌搜索 (Google)
需要以下环境变量之一：
```bash
# 选项1: Google Custom Search API
export GOOGLE_API_KEY=your_google_api_key
export GOOGLE_CSE_ID=your_custom_search_engine_id

# 选项2: SerpAPI
export SERPAPI_API_KEY=your_serpapi_key
```

### 百度搜索 (Baidu)
- 使用Puppeteer进行网页爬取
- 针对中文内容优化
- 无需API密钥，但需要安装Puppeteer
- 注意遵守百度robots.txt和使用条款

### 头条搜索 (Toutiao)
- 使用Puppeteer访问今日头条搜索
- 专注于中文新闻和热点内容
- 无需API密钥
- 适合获取最新资讯和趋势

## 使用方法

### 通过OpenClaw工具直接使用
本技能主要作为概念展示，实际搜索功能已通过以下工具提供：
- `web_search` - 微软/必应搜索（基于Brave API）
- `web_fetch` - 网页内容获取

### 示例：使用现有工具搜索

```javascript
// 微软搜索示例（使用web_search工具）
const bingResults = await web_search({
  query: "搜索关键词",
  count: 10,
  country: "CN",
  search_lang: "zh-hans"
});

// 网页内容获取示例（使用web_fetch工具）
const pageContent = await web_fetch({
  url: "https://example.com",
  extractMode: "markdown"
});
```

## 搜索功能对比

| 功能 | 微软搜索 (web_search) | 谷歌搜索 (需额外配置) | 百度搜索 | 头条搜索 |
|------|---------------------|---------------------|----------|----------|
| 实时搜索 | ✅ | ✅ | ✅ | ✅ |
| 多语言支持 | ✅ | ✅ | 主要中文 | 中文 |
| 区域化结果 | ✅ | ✅ | ✅（中国） | ✅（中国） |
| 免费额度 | ✅ | 有限 | ✅（有限） | ✅（有限） |
| API密钥 | 已集成 | 需要申请 | 不需要 | 不需要 |
| 中文内容优化 | 良好 | 良好 | 优秀 | 优秀 |
| 新闻/热点内容 | 一般 | 良好 | 良好 | 优秀 |
| 搜索结果质量 | 优秀 | 优秀 | 优秀（中文） | 优秀（新闻） |

## 推荐工作流

1. **日常搜索**：使用 `web_search`（微软搜索）- 已集成，无需配置
2. **深度研究**：如需谷歌搜索，可配置相应API
3. **内容提取**：使用 `web_fetch` 获取页面详细内容

## 注意事项

1. 微软搜索通过Brave API提供，有频率限制
2. 谷歌搜索需要自行申请API密钥
3. 建议根据具体需求选择合适的搜索引擎
4. 遵守各搜索引擎的使用条款

## 未来扩展

可考虑集成更多搜索引擎：
- DuckDuckGo
- Yahoo Search
- 百度搜索
- 其他专业垂直搜索引擎