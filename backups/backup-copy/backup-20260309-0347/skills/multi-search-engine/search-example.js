/**
 * 多搜索引擎示例代码
 * 演示如何使用微软搜索、谷歌搜索和百度搜索
 */

const axios = require('axios');
// 注意：Puppeteer需要额外安装，这里先注释掉实际调用
// const puppeteer = require('puppeteer');

/**
 * 微软搜索函数（使用Brave Search API）
 * 注意：实际使用中应通过OpenClaw的web_search工具
 */
async function microsoftSearch(query, options = {}) {
  console.log(`执行微软搜索: ${query}`);
  
  // 这里只是示例，实际应该调用OpenClaw的web_search工具
  // const results = await web_search({
  //   query: query,
  //   count: options.count || 10,
  //   country: options.country || 'US',
  //   search_lang: options.lang || 'en'
  // });
  
  return {
    engine: 'Microsoft/Bing',
    query: query,
    results: [
      { title: '示例结果1', url: 'https://example.com/1', snippet: '这是微软搜索的示例结果1' },
      { title: '示例结果2', url: 'https://example.com/2', snippet: '这是微软搜索的示例结果2' }
    ]
  };
}

/**
 * 谷歌搜索函数（需要API配置）
 */
async function googleSearch(query, options = {}) {
  console.log(`执行谷歌搜索: ${query}`);
  
  // 需要配置GOOGLE_API_KEY和GOOGLE_CSE_ID环境变量
  const apiKey = process.env.GOOGLE_API_KEY;
  const cseId = process.env.GOOGLE_CSE_ID;
  
  if (!apiKey || !cseId) {
    throw new Error('需要配置GOOGLE_API_KEY和GOOGLE_CSE_ID环境变量');
  }
  
  const url = `https://www.googleapis.com/customsearch/v1`;
  const params = {
    key: apiKey,
    cx: cseId,
    q: query,
    num: options.count || 10
  };
  
  try {
    const response = await axios.get(url, { params });
    return {
      engine: 'Google',
      query: query,
      results: response.data.items || []
    };
  } catch (error) {
    console.error('谷歌搜索错误:', error.message);
    throw error;
  }
}

/**
 * 百度搜索函数
 * 使用Puppeteer模拟浏览器搜索
 * 注意：需要安装puppeteer，且遵守百度使用条款
 */
async function baiduSearch(query, options = {}) {
  console.log(`执行百度搜索: ${query}`);
  
  // 这里提供两种实现方式
  
  // 方式1: 使用Puppeteer（需要安装）
  /*
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // 设置用户代理，避免被识别为爬虫
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // 访问百度搜索
    const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    // 提取搜索结果
    const results = await page.evaluate(() => {
      const items = [];
      // 百度搜索结果的选择器
      const resultElements = document.querySelectorAll('.result.c-container');
      
      resultElements.forEach((element, index) => {
        const titleElement = element.querySelector('h3 a');
        const contentElement = element.querySelector('.content-right_8Zs40');
        
        if (titleElement) {
          items.push({
            title: titleElement.textContent.trim(),
            url: titleElement.href,
            snippet: contentElement ? contentElement.textContent.trim() : '',
            rank: index + 1
          });
        }
      });
      
      return items;
    });
    
    await browser.close();
    
    return {
      engine: 'Baidu',
      query: query,
      results: results.slice(0, options.count || 10)
    };
    
  } catch (error) {
    console.error('百度搜索错误:', error.message);
    throw error;
  }
  */
  
  // 方式2: 模拟返回示例数据（无需安装Puppeteer）
  return {
    engine: 'Baidu',
    query: query,
    results: [
      { 
        title: `百度搜索示例: ${query} - 结果1`, 
        url: 'https://www.baidu.com/link?url=example1', 
        snippet: `这是关于"${query}"的百度搜索结果示例1，百度搜索针对中文内容有很好的优化。`,
        rank: 1
      },
      { 
        title: `百度搜索示例: ${query} - 结果2`, 
        url: 'https://www.baidu.com/link?url=example2', 
        snippet: `百度是中国最大的搜索引擎，对于中文网页的收录和排名有独特优势。`,
        rank: 2
      },
      { 
        title: `百度搜索示例: ${query} - 结果3`, 
        url: 'https://www.baidu.com/link?url=example3', 
        snippet: `使用百度搜索可以找到更多中文相关的资源和信息。`,
        rank: 3
      }
    ],
    note: '这是示例数据，实际使用需要安装Puppeteer并实现真实的网页爬取'
  };
}

/**
 * 头条搜索函数
 * 使用Puppeteer访问今日头条搜索
 * 专注于中文新闻和热点内容
 */
async function toutiaoSearch(query, options = {}) {
  console.log(`执行头条搜索: ${query}`);
  
  // 方式1: 使用Puppeteer（需要安装）
  /*
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // 设置用户代理
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // 访问今日头条搜索
    const searchUrl = `https://so.toutiao.com/search?keyword=${encodeURIComponent(query)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    // 提取搜索结果
    const results = await page.evaluate(() => {
      const items = [];
      // 今日头条搜索结果的选择器
      const resultElements = document.querySelectorAll('.article-item');
      
      resultElements.forEach((element, index) => {
        const titleElement = element.querySelector('.title a');
        const contentElement = element.querySelector('.abstract');
        const sourceElement = element.querySelector('.source');
        const timeElement = element.querySelector('.time');
        
        if (titleElement) {
          items.push({
            title: titleElement.textContent.trim(),
            url: titleElement.href,
            snippet: contentElement ? contentElement.textContent.trim() : '',
            source: sourceElement ? sourceElement.textContent.trim() : '头条',
            time: timeElement ? timeElement.textContent.trim() : '',
            rank: index + 1,
            type: 'news' // 标记为新闻类型
          });
        }
      });
      
      return items;
    });
    
    await browser.close();
    
    return {
      engine: 'Toutiao',
      query: query,
      results: results.slice(0, options.count || 10)
    };
    
  } catch (error) {
    console.error('头条搜索错误:', error.message);
    throw error;
  }
  */
  
  // 方式2: 模拟返回示例数据（无需安装Puppeteer）
  return {
    engine: 'Toutiao',
    query: query,
    results: [
      { 
        title: `头条新闻: ${query}最新动态`, 
        url: 'https://www.toutiao.com/article/example1', 
        snippet: `今日头条关于"${query}"的最新新闻报道，包含详细分析和专家观点。`,
        source: '新华网',
        time: '2小时前',
        rank: 1,
        type: 'news'
      },
      { 
        title: `${query}热点分析：市场反应强烈`, 
        url: 'https://www.toutiao.com/article/example2', 
        snippet: `专家解读${query}对市场的影响，投资者需要关注这些变化。`,
        source: '财经网',
        time: '5小时前',
        rank: 2,
        type: 'news'
      },
      { 
        title: `深度报道：${query}背后的故事`, 
        url: 'https://www.toutiao.com/article/example3', 
        snippet: `记者深入调查${query}事件，揭示不为人知的细节。`,
        source: '深度新闻',
        time: '1天前',
        rank: 3,
        type: 'news'
      },
      { 
        title: `${query}相关视频内容推荐`, 
        url: 'https://www.toutiao.com/video/example4', 
        snippet: `观看关于${query}的精彩视频内容，了解更多视觉信息。`,
        source: '视频频道',
        time: '3小时前',
        rank: 4,
        type: 'video'
      }
    ],
    note: '这是示例数据，实际使用需要安装Puppeteer并实现真实的网页爬取',
    features: {
      news_focused: true,
      chinese_content: true,
      real_time: true,
      hot_trends: true
    }
  };
}

/**
 * 多引擎并行搜索
 */
async function multiSearch(query, engines = ['microsoft', 'google', 'baidu', 'toutiao']) {
  console.log(`开始多引擎搜索: ${query}`);
  
  const promises = [];
  
  if (engines.includes('microsoft')) {
    promises.push(microsoftSearch(query));
  }
  
  if (engines.includes('google')) {
    promises.push(googleSearch(query).catch(err => {
      console.warn('谷歌搜索失败:', err.message);
      return { engine: 'Google', error: err.message, results: [] };
    }));
  }
  
  if (engines.includes('baidu')) {
    promises.push(baiduSearch(query).catch(err => {
      console.warn('百度搜索失败:', err.message);
      return { engine: 'Baidu', error: err.message, results: [] };
    }));
  }
  
  if (engines.includes('toutiao')) {
    promises.push(toutiaoSearch(query).catch(err => {
      console.warn('头条搜索失败:', err.message);
      return { engine: 'Toutiao', error: err.message, results: [] };
    }));
  }
  
  const results = await Promise.all(promises);
  
  // 合并结果
  const allResults = [];
  results.forEach(result => {
    if (result.results) {
      allResults.push(...result.results.map(item => ({
        ...item,
        engine: result.engine
      })));
    }
  });
  
  return {
    query: query,
    engines: engines,
    totalResults: allResults.length,
    results: allResults
  };
}

/**
 * 搜索比较函数
 */
async function compareSearchEngines(query) {
  console.log(`\n=== 搜索引擎比较: "${query}" ===`);
  
  const [microsoftResult, googleResult, baiduResult, toutiaoResult] = await Promise.all([
    microsoftSearch(query),
    googleSearch(query).catch(err => ({ engine: 'Google', error: err.message, results: [] })),
    baiduSearch(query).catch(err => ({ engine: 'Baidu', error: err.message, results: [] })),
    toutiaoSearch(query).catch(err => ({ engine: 'Toutiao', error: err.message, results: [] }))
  ]);
  
  console.log(`\n微软搜索结果: ${microsoftResult.results.length} 条`);
  console.log(`谷歌搜索结果: ${googleResult.results ? googleResult.results.length : 0} 条`);
  console.log(`百度搜索结果: ${baiduResult.results ? baiduResult.results.length : 0} 条`);
  console.log(`头条搜索结果: ${toutiaoResult.results ? toutiaoResult.results.length : 0} 条`);
  
  if (googleResult.error) {
    console.log(`谷歌搜索错误: ${googleResult.error}`);
  }
  
  if (baiduResult.error) {
    console.log(`百度搜索错误: ${baiduResult.error}`);
  }
  
  if (toutiaoResult.error) {
    console.log(`头条搜索错误: ${toutiaoResult.error}`);
  }
  
  // 显示各引擎特点
  console.log('\n--- 各引擎特点 ---');
  console.log('微软搜索: 国际内容，多语言支持');
  console.log('谷歌搜索: 全球覆盖，技术内容强');
  console.log('百度搜索: 中文内容优化，本地化好');
  console.log('头条搜索: 新闻热点，实时资讯');
  
  // 分析结果类型
  const newsCount = toutiaoResult.results ? toutiaoResult.results.filter(r => r.type === 'news').length : 0;
  if (newsCount > 0) {
    console.log(`\n头条新闻内容: ${newsCount} 条新闻文章`);
  }
  
  return { 
    microsoft: microsoftResult, 
    google: googleResult,
    baidu: baiduResult,
    toutiao: toutiaoResult
  };
}

// 导出函数
module.exports = {
  microsoftSearch,
  googleSearch,
  baiduSearch,
  toutiaoSearch,
  multiSearch,
  compareSearchEngines
};

// 如果直接运行此文件
if (require.main === module) {
  (async () => {
    try {
      const query = process.argv[2] || '人工智能';
      console.log(`测试多搜索引擎: ${query}`);
      
      // 测试微软搜索
      const msResult = await microsoftSearch(query);
      console.log('\n微软搜索示例结果:');
      msResult.results.forEach((item, i) => {
        console.log(`${i + 1}. [${item.title}]`);
      });
      
      // 测试百度搜索
      const baiduResult = await baiduSearch(query);
      console.log('\n百度搜索示例结果:');
      baiduResult.results.forEach((item, i) => {
        console.log(`${i + 1}. [${item.title}]`);
      });
      
      if (baiduResult.note) {
        console.log(`\n注: ${baiduResult.note}`);
      }
      
      // 注意：谷歌搜索需要配置环境变量
      // const googleResult = await googleSearch(query);
      
      // 测试头条搜索
      const toutiaoResult = await toutiaoSearch(query);
      console.log('\n头条搜索示例结果:');
      toutiaoResult.results.forEach((item, i) => {
        console.log(`${i + 1}. [${item.source}] ${item.title} (${item.time})`);
      });
      
      if (toutiaoResult.note) {
        console.log(`\n注: ${toutiaoResult.note}`);
      }
      
      // 测试多引擎搜索
      console.log('\n--- 多引擎搜索测试 ---');
      const multiResult = await multiSearch(query, ['microsoft', 'baidu', 'toutiao']);
      console.log(`多引擎搜索共找到 ${multiResult.totalResults} 条结果`);
      
      // 按引擎分类统计
      const engineStats = {};
      multiResult.results.forEach(item => {
        engineStats[item.engine] = (engineStats[item.engine] || 0) + 1;
      });
      
      console.log('\n各引擎贡献结果数:');
      Object.entries(engineStats).forEach(([engine, count]) => {
        console.log(`  ${engine}: ${count} 条`);
      });
      
    } catch (error) {
      console.error('搜索测试失败:', error.message);
    }
  })();
}