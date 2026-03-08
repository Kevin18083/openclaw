"""
Tavily Web Search 技能核心学习
重点：API使用、搜索优化、实际应用
"""

print("🔍 Tavily Web Search 技能学习\n")

def learn_tavily_basics():
    print("=== 1. Tavily 是什么？ ===")
    print("🎯 特点：")
    print("• 专门为AI代理设计的搜索API")
    print("• 提供结构化、高质量的搜索结果")
    print("• 优化了AI可读性和相关性")
    print("• 支持深度搜索和答案提取")
    
    print("\n=== 2. 与其他搜索引擎对比 ===")
    print("✅ Tavily 优势：")
    print("• 结果已经过AI优化")
    print("• 自动提取关键信息")
    print("• 支持深度研究和分析")
    print("• 专门为AI对话设计")
    
    print("\n⚠️ 限制：")
    print("• 需要API密钥")
    print("• 有使用限制（免费额度）")
    print("• 可能不如传统搜索引擎全面")
    
    print("\n=== 3. 核心功能 ===")
    
    print("\n🔍 功能1：基础搜索")
    print("""
// 基础搜索示例
const results = await tavily.search("OpenAI最新发布");
    
// 返回结构：
{
  query: "搜索查询",
  answer: "直接答案（如果有）",
  results: [
    {
      title: "网页标题",
      url: "网页链接",
      content: "网页内容摘要",
      score: 相关性分数
    }
  ],
  responseTime: 响应时间
}
    """)
    
    print("\n🎯 功能2：答案提取")
    print("""
// 提取直接答案
const results = await tavily.search({
  query: "谁发明了Python？",
  includeAnswer: true  // 启用答案提取
});
    
// 结果包含：
answer: "Python由Guido van Rossum发明"
    """)
    
    print("\n📚 功能3：深度搜索")
    print("""
// 深度搜索模式
const results = await tavily.search({
  query: "人工智能对就业市场的影响",
  searchDepth: "advanced",  // 深度搜索
  includeRawContent: true,  // 包含原始内容
  maxResults: 15           // 最大结果数
});
    """)
    
    print("\n🌐 功能4：多语言支持")
    print("""
// 多语言搜索
const results = await tavily.search({
  query: "人工智能发展趋势",
  // 自动检测语言或指定
});
    """)
    
    print("\n=== 4. 安装和配置 ===")
    
    print("\n📦 安装步骤：")
    print("1. 注册Tavily账户获取API密钥")
    print("2. 安装Node.js包：")
    print("   npm install @tavily/core")
    print("3. 设置环境变量：")
    print("   export TAVILY_API_KEY=your_key")
    
    print("\n⚙️ 配置示例：")
    print("""
// JavaScript配置
const { TavilyClient } = require('@tavily/core');

const tavily = new TavilyClient({
  apiKey: process.env.TAVILY_API_KEY,
  // 可选配置
  timeout: 30000,  // 超时时间
  maxRetries: 3    // 重试次数
});
    """)
    
    print("\n=== 5. 实际应用场景 ===")
    
    print("\n💼 场景1：实时信息查询")
    print("• 查询最新新闻和事件")
    print("• 获取实时数据和统计")
    print("• 跟踪技术发展趋势")
    
    print("\n📚 场景2：研究和分析")
    print("• 收集研究资料")
    print("• 分析市场趋势")
    print("• 比较不同观点")
    
    print("\n🤖 场景3：AI辅助回答")
    print("• 补充AI的知识库")
    print("• 提供最新信息")
    print("• 验证事实和准确性")
    
    print("\n🔧 场景4：数据收集")
    print("• 收集网页数据")
    print("• 监控竞争对手")
    print("• 跟踪行业动态")

def practical_examples():
    print("\n=== 6. 实用代码示例 ===")
    
    print("\n🎯 示例1：新闻搜索")
    print("""
async function searchLatestNews(topic, days=7) {
  const query = `${topic} 最新新闻 ${days}天内`;
  
  const results = await tavily.search({
    query: query,
    searchDepth: "basic",
    includeAnswer: false,
    maxResults: 5,
    timeRange: `${days}d`  // 时间范围
  });
  
  return results.results.map(item => ({
    title: item.title,
    url: item.url,
    summary: item.content,
    date: new Date().toISOString().split('T')[0]
  }));
}
    """)
    
    print("\n🎯 示例2：事实核查")
    print("""
async function factCheck(statement) {
  const query = `验证: ${statement}`;
  
  const results = await tavily.search({
    query: query,
    includeAnswer: true,
    searchDepth: "advanced",
    maxResults: 3
  });
  
  return {
    statement: statement,
    answer: results.answer,
    sources: results.results.slice(0, 3),
    confidence: results.results.length > 0 ? "高" : "低"
  };
}
    """)
    
    print("\n🎯 示例3：研究收集")
    print("""
async function collectResearch(topic, numSources=10) {
  const results = await tavily.search({
    query: topic,
    searchDepth: "advanced",
    includeRawContent: true,
    maxResults: numSources
  });
  
  // 整理研究资料
  const research = {
    topic: topic,
    collectedAt: new Date().toISOString(),
    sources: results.results.map((item, index) => ({
      id: index + 1,
      title: item.title,
      url: item.url,
      keyPoints: extractKeyPoints(item.content),
      relevance: item.score
    })),
    summary: generateSummary(results.results)
  };
  
  return research;
}
    """)
    
    print("\n🎯 示例4：竞争对手分析")
    print("""
async function analyzeCompetitor(companyName) {
  const queries = [
    `${companyName} 最新产品`,
    `${companyName} 市场表现`,
    `${companyName} 用户评价`,
    `${companyName} 竞争对手`
  ];
  
  const allResults = [];
  
  for (const query of queries) {
    const results = await tavily.search({
      query: query,
      searchDepth: "basic",
      maxResults: 3
    });
    allResults.push(...results.results);
  }
  
  // 去重和分析
  const uniqueResults = removeDuplicates(allResults);
  const analysis = analyzeCompetitorData(uniqueResults);
  
  return {
    company: companyName,
    analysisDate: new Date().toISOString(),
    dataPoints: uniqueResults.length,
    insights: analysis
  };
}
    """)

def best_practices():
    print("\n=== 7. 最佳实践 ===")
    
    print("\n✅ 搜索优化技巧：")
    print("1. **明确查询**：使用具体的关键词")
    print("2. **使用引号**：精确匹配短语")
    print("3. **限制时间**：使用timeRange获取最新信息")
    print("4. **分步搜索**：复杂问题分解为多个查询")
    
    print("\n✅ 成本控制：")
    print("1. **缓存结果**：相同查询使用缓存")
    print("2. **限制数量**：合理设置maxResults")
    print("3. **使用基础搜索**：非必要不用深度搜索")
    print("4. **监控使用量**：定期检查API使用情况")
    
    print("\n✅ 错误处理：")
    print("1. **超时设置**：避免长时间等待")
    print("2. **重试机制**：网络问题自动重试")
    print("3. **备用方案**：准备传统搜索引擎备用")
    print("4. **优雅降级**：API失败时提供基础功能")

def integration_with_openclaw():
    print("\n=== 8. 与OpenClaw集成 ===")
    
    print("\n🔧 集成方式1：作为工具使用")
    print("""
// 在OpenClaw中作为搜索工具
async function tavilySearchTool(query, options = {}) {
  try {
    const results = await tavily.search({
      query: query,
      ...options
    });
    
    return {
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
    """)
    
    print("\n🔧 集成方式2：自动信息补充")
    print("""
// 自动补充AI回答
async function enhanceResponseWithSearch(userQuery, aiResponse) {
  // 判断是否需要搜索补充
  if (needsFreshInfo(userQuery)) {
    const searchResults = await tavily.search({
      query: extractSearchQuery(userQuery),
      maxResults: 3
    });
    
    return {
      originalResponse: aiResponse,
      supplementalInfo: searchResults.results,
      sources: searchResults.results.map(r => r.url)
    };
  }
  
  return aiResponse;
}
    """)
    
    print("\n🔧 集成方式3：定期信息更新")
    print("""
// 定期搜索更新知识
async function updateKnowledgeBase() {
  const topics = ["AI发展", "技术趋势", "行业新闻"];
  
  for (const topic of topics) {
    const results = await tavily.search({
      query: `${topic} 最新动态`,
      timeRange: "7d",
      maxResults: 5
    });
    
    // 更新知识库
    await saveToKnowledgeBase(topic, results);
  }
  
  console.log("知识库更新完成");
}
    """)

if __name__ == "__main__":
    learn_tavily_basics()
    practical_examples()
    best_practices()
    integration_with_openclaw()
    
    print("\n" + "="*50)
    print("✅ Tavily Web Search 技能学习完成")
    
    print("\n📚 掌握要点：")
    print("1. Tavily是AI优化的搜索API")
    print("2. 核心功能：基础搜索、答案提取、深度搜索")
    print("3. 实际应用：新闻搜索、事实核查、研究收集")
    print("4. 最佳实践：查询优化、成本控制、错误处理")
    
    print("\n🚀 下一步：")
    print("1. 获取Tavily API密钥")
    print("2. 安装 @tavily/core 包")
    print("3. 测试基础搜索功能")
    print("4. 集成到实际项目中")
    
    print("\n💡 价值：")
    print("• 为AI提供实时、准确的信息")
    print("• 增强回答的时效性和准确性")
    print("• 支持深度研究和分析")
    print("• 优化AI的知识更新机制")