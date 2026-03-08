# 多搜索引擎技能

为OpenClaw创建的多搜索引擎集成技能，支持微软搜索(Bing)、谷歌搜索(Google)、百度搜索(Baidu)和头条搜索(Toutiao)。

## 快速开始

### 1. 安装依赖
```bash
cd skills/multi-search-engine
npm install

# 如果只需要基本功能（微软搜索）
npm install axios

# 如果需要百度搜索功能（需要Puppeteer）
npm install puppeteer
```

### 2. 配置环境变量（谷歌搜索需要）
```bash
# 谷歌自定义搜索API
export GOOGLE_API_KEY=your_api_key
export GOOGLE_CSE_ID=your_search_engine_id

# 或使用SerpAPI
export SERPAPI_API_KEY=your_serpapi_key
```

### 3. 使用示例
```javascript
const { multiSearch, compareSearchEngines, baiduSearch, toutiaoSearch } = require('./search-example.js');

// 多引擎搜索
async function searchExample() {
  const results = await multiSearch('人工智能', ['microsoft', 'google', 'baidu', 'toutiao']);
  console.log(`找到 ${results.totalResults} 条结果`);
}

// 百度搜索（中文内容优化）
async function baiduExample() {
  const baiduResults = await baiduSearch('北京天气');
  console.log(`百度搜索找到 ${baiduResults.results.length} 条结果`);
}

// 头条搜索（新闻热点）
async function toutiaoExample() {
  const toutiaoResults = await toutiaoSearch('科技新闻');
  console.log(`头条搜索找到 ${toutiaoResults.results.length} 条新闻`);
  // 头条结果包含额外信息：source, time, type等
  toutiaoResults.results.forEach(item => {
    console.log(`[${item.source}] ${item.title} (${item.time})`);
  });
}

// 搜索引擎比较
async function compareExample() {
  const comparison = await compareSearchEngines('机器学习');
  console.log('四引擎搜索比较完成');
}
```

## 与OpenClaw集成

### 已集成的搜索工具
OpenClaw已经内置了强大的搜索工具，可以直接使用：

1. **微软搜索** - 使用 `web_search` 工具
   ```javascript
   // 通过OpenClaw工具调用
   const bingResults = await web_search({
     query: "搜索关键词",
     count: 10,
     country: "CN",
     search_lang: "zh-hans"
   });
   ```

2. **网页内容获取** - 使用 `web_fetch` 工具
   ```javascript
   const content = await web_fetch({
     url: "https://example.com",
     extractMode: "markdown"
   });
   ```

### 实际使用建议

对于大多数搜索需求，建议直接使用OpenClaw的 `web_search` 工具，因为它：
- ✅ 已集成，无需额外配置
- ✅ 基于微软/Bing搜索，质量优秀
- ✅ 支持多语言和区域化
- ✅ 有免费额度

如果需要谷歌搜索，可以考虑：
1. 配置谷歌自定义搜索API
2. 或使用SerpAPI等第三方服务
3. 或直接使用谷歌网页版（通过浏览器工具）

## 功能特点

### 微软搜索 (通过web_search)
- 实时网络搜索
- 多语言支持（中文、英文等）
- 区域化搜索结果
- 无需API密钥（已集成）
- 有频率限制

### 谷歌搜索 (需要配置)
- 高质量的搜索结果
- 丰富的搜索功能
- 需要API密钥配置
- 可能有费用产生

### 百度搜索 (需要Puppeteer)
- 中文内容优化，适合中文搜索
- 无需API密钥
- 需要安装Puppeteer进行网页爬取
- 遵守百度使用条款和robots.txt
- 对于中国本地内容有优势

### 头条搜索 (需要Puppeteer)
- 专注于中文新闻和热点内容
- 实时资讯和趋势分析
- 无需API密钥
- 需要安装Puppeteer
- 提供新闻来源、发布时间等元数据
- 适合获取最新资讯和市场动态

## 命令行测试

```bash
# 测试微软搜索示例
node search-example.js "人工智能"

# 安装依赖
npm run install-deps
```

## 注意事项

1. 遵守各搜索引擎的使用条款
2. 注意API调用频率限制
3. 谷歌搜索需要自行申请和配置API
4. 建议优先使用已集成的 `web_search` 工具

## 扩展开发

如需扩展更多搜索引擎，可以：
1. 在 `search-example.js` 中添加新的搜索函数
2. 配置相应的API密钥
3. 更新 `multiSearch` 函数以支持新引擎

## 许可证

MIT License