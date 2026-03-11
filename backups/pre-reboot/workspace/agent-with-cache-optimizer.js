#!/usr/bin/env node

/**
 * Agent 脚本示例 - 集成缓存优化器 v1.0
 *
 * 功能说明：
 * 1. 演示集成 - 展示如何在实际 agent 脚本中使用 zach-cache-optimizer
 * 2. 模板调用 - 演示 4 种常见场景的模板化请求生成
 * 3. API 模拟 - 模拟阿里云 API 调用流程
 * 4. 统计查看 - 引导用户查看缓存统计状态
 *
 * 配置说明：
 * - 依赖：zach-cache-optimizer.js 提供模板生成功能
 * - 系统消息类型：coder/analyst/default 三种预设
 * - 模板类别：code/basic/analysis/learn 四种场景
 *
 * 用法：
 *   node agent-with-cache-optimizer.js                    # 执行示例脚本
 *   const { generateOptimizedRequest } = require('./zach-cache-optimizer')
 *
 * 示例输出：
 *   ============================================================
 *   缓存优化器集成示例
 *   ============================================================
 *   【示例 1】编写代码任务
 *   ------------------------------------------------------------
 *   📤 发送请求到阿里云 API...
 *   ✅ 请求已发送（模拟）
 *
 * 常见错误：
 * - 找不到 zach-cache-optimizer → 检查文件路径
 * - API 调用失败 → 检查网络和 API 密钥
 *
 * 依赖：
 * - Node.js 14+
 * - fs (内置模块)
 * - zach-cache-optimizer.js (本地模块)
 *
 * 修改历史：
 * - 2026-03-07: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
 */

const { generateOptimizedRequest } = require('./zach-cache-optimizer');

/**
 * 模拟阿里云 API 调用
 * @param {string} systemPrompt - 系统提示内容
 * @param {string} userPrompt - 用户提示内容
 * @returns {Promise<Object>} 模拟的 API 响应
 */
async function callAliyunAPI(systemPrompt, userPrompt) {
  console.log('📤 发送请求到阿里云 API...');
  console.log('系统消息长度:', systemPrompt.length);
  console.log('用户消息长度:', userPrompt.length);

  // 实际使用时替换为真实的 API 调用
  // const response = await fetch('https://dashscope.aliyuncs.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${API_KEY}`
  //   },
  //   body: JSON.stringify({
  //     model: 'qwen3.5-plus',
  //     messages: [
  //       { role: 'system', content: systemPrompt },
  //       { role: 'user', content: userPrompt }
  //     ]
  //   })
  // });

  console.log('✅ 请求已发送（模拟）\n');
  return { success: true };
}

// ============================================================================
// 使用示例
// ============================================================================

/**
 * 主函数 - 执行 4 个示例场景
 * @returns {Promise<void>}
 */
async function main() {
  console.log('='.repeat(60));
  console.log('缓存优化器集成示例');
  console.log('='.repeat(60));
  console.log();

  // 示例 1: 编写代码
  console.log('【示例 1】编写代码任务');
  console.log('-'.repeat(60));
  const codeRequest = generateOptimizedRequest(
    'code',           // 类别
    'func',           // 模板：函数编写
    {
      functionality: '计算斐波那契数列',
      language: 'JavaScript',
      inputs: 'n (数字)',
      outputs: '第 n 个斐波那契数'
    },
    'coder'          // 系统消息类型
  );

  await callAliyunAPI(codeRequest.system, codeRequest.user);

  // 示例 2: 天气查询
  console.log('【示例 2】天气查询');
  console.log('-'.repeat(60));
  const weatherRequest = generateOptimizedRequest(
    'basic',
    'weather',
    {
      location: '北京',
      time: '今天'
    },
    'default'
  );

  await callAliyunAPI(weatherRequest.system, weatherRequest.user);

  // 示例 3: 数据分析
  console.log('【示例 3】数据分析');
  console.log('-'.repeat(60));
  const analysisRequest = generateOptimizedRequest(
    'analysis',
    'data',
    {
      dataset: '销售数据',
      metrics: '销售额、利润率、增长率',
      goal: '找出表现最好的产品'
    },
    'analyst'
  );

  await callAliyunAPI(analysisRequest.system, analysisRequest.user);

  // 示例 4: 概念学习
  console.log('【示例 4】概念学习');
  console.log('-'.repeat(60));
  const learnRequest = generateOptimizedRequest(
    'learn',
    'concept',
    {
      topic: 'React Hooks',
      level: '中级',
      focus: 'useEffect 的使用场景'
    },
    'default'
  );

  await callAliyunAPI(learnRequest.system, learnRequest.user);

  // 查看缓存统计
  console.log('='.repeat(60));
  console.log('查看缓存统计');
  console.log('='.repeat(60));
  console.log('运行以下命令查看缓存状态:');
  console.log('  node zach-cache-optimizer.js status');
  console.log();
}

// 执行
if (require.main === module) {
  main();
}

// 导出供其他模块使用
module.exports = {
  generateOptimizedRequest,
  callAliyunAPI
};
