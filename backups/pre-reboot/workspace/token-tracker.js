#!/usr/bin/env node

/**
 * Token 用量统计系统 v1.0
 *
 * 功能说明：
 * 1. 用量记录 - 记录每次 API 调用的 token 消耗
 * 2. 分类统计 - 按日期、模型分类统计用量
 * 3. 缓存追踪 - 单独追踪缓存命中 token
 * 4. 报告生成 - 生成 Markdown 格式的日用量和总报告
 *
 * 配置说明：
 * - statsPath: 统计数据文件路径
 * - dailyPath: 日用量日志文件路径
 * - stats 结构：total(总计), daily(每日), models(按模型)
 *
 * 用法：
 *   const TokenTracker = require('./token-tracker')
 *   const tracker = new TokenTracker()
 *   tracker.record('claude-sonnet-4-6', 1000, 500, 200)
 *   tracker.printReport()
 *
 * 示例输出：
 *   ========== Token 用量报告 ==========
 *   【今日 2026-03-10】
 *     Input:  10,000 tokens
 *     Output: 5,000 tokens
 *     Cache:  2,000 tokens
 *     Total:  17,000 tokens
 *   ====================================
 *
 * 常见错误：
 * - 保存数据失败 → 检查日志目录权限
 * - 历史数据加载失败 → 使用空数据继续运行
 *
 * 依赖：
 * - Node.js 14+
 * - fs, path (内置模块)
 *
 * 修改历史：
 * - 2026-03-09: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
 */

const fs = require('fs');
const path = require('path');

class TokenTracker {
  constructor() {
    this.statsPath = 'C:\\Users\\17589\\.openclaw\\logs\\token-stats.json';
    this.dailyPath = 'C:\\Users\\17589\\.openclaw\\logs\\token-daily.md';
    this.stats = this.loadStats();
  }

  /**
   * 加载统计数据 - 从 JSON 文件加载历史 token 数据
   * @returns {Object} 统计数据对象
   */
  loadStats() {
    try {
      if (fs.existsSync(this.statsPath)) {
        return JSON.parse(fs.readFileSync(this.statsPath, 'utf-8'));
      }
    } catch (e) {
      console.log('[TokenTracker] 无历史数据');
    }

    return {
      total: { input: 0, output: 0, cache: 0 },
      daily: {},
      models: {}
    };
  }

  /**
   * 保存统计数据 - 将统计数据保存到 JSON 文件
   * @returns {void}
   */
  saveStats() {
    try {
      fs.writeFileSync(this.statsPath, JSON.stringify(this.stats, null, 2));
    } catch (e) {
      console.error('[TokenTracker] 保存数据失败:', e.message);
    }
  }

  /**
   * 记录 token 使用 - 记录一次 API 调用的 token 消耗
   * @param {string} model - 模型名称
   * @param {number} inputTokens - 输入 token 数
   * @param {number} outputTokens - 输出 token 数
   * @param {number} [cacheTokens=0] - 缓存命中 token 数
   * @returns {void}
   */
  record(model, inputTokens, outputTokens, cacheTokens = 0) {
    const today = new Date().toISOString().split('T')[0];

    // 初始化今日数据
    if (!this.stats.daily[today]) {
      this.stats.daily[today] = { input: 0, output: 0, cache: 0, count: 0 };
    }

    // 初始化模型数据
    if (!this.stats.models[model]) {
      this.stats.models[model] = { input: 0, output: 0, cache: 0, count: 0 };
    }

    // 更新统计
    this.stats.total.input += inputTokens;
    this.stats.total.output += outputTokens;
    this.stats.total.cache += cacheTokens;

    this.stats.daily[today].input += inputTokens;
    this.stats.daily[today].output += outputTokens;
    this.stats.daily[today].cache += cacheTokens;
    this.stats.daily[today].count++;

    this.stats.models[model].input += inputTokens;
    this.stats.models[model].output += outputTokens;
    this.stats.models[model].cache += cacheTokens;
    this.stats.models[model].count++;

    this.saveStats();
    this.updateDailyLog(today, model, inputTokens, outputTokens, cacheTokens);

    console.log(`[TokenTracker] 记录：${model} +${inputTokens + outputTokens} tokens`);
  }

  /**
   * 更新日志 - 更新每日 token 用量日志文件
   * @param {string} date - 日期字符串
   * @param {string} model - 模型名称
   * @param {number} input - 输入 token 数
   * @param {number} output - 输出 token 数
   * @param {number} cache - 缓存 token 数
   * @returns {void}
   */
  updateDailyLog(date, model, input, output, cache) {
    const logFile = `C:\\Users\\17589\\.openclaw\\logs\\token-${date}.md`;
    let content = `# Token 用量日志 - ${date}\n\n`;
    content += `| 时间 | 模型 | Input | Output | Cache | Total |\n`;
    content += `|------|------|-------|--------|-------|------|\n`;

    // 读取已有日志
    try {
      if (fs.existsSync(logFile)) {
        const existing = fs.readFileSync(logFile, 'utf-8');
        const lines = existing.split('\n').filter(l => l.includes('|'));
        content += lines.slice(2).join('\n');
      }
    } catch (e) {}

    const time = new Date().toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai' });
    content += `| ${time} | ${model} | ${input} | ${output} | ${cache} | ${input + output + cache} |\n`;

    fs.writeFileSync(logFile, content);
  }

  /**
   * 获取今日统计 - 返回今日的 token 使用统计
   * @returns {Object} 今日统计数据
   */
  getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    return this.stats.daily[today] || { input: 0, output: 0, cache: 0, count: 0 };
  }

  /**
   * 获取总统计 - 返回总计 token 使用统计
   * @returns {Object} 总计统计数据
   */
  getTotalStats() {
    return this.stats.total;
  }

  /**
   * 获取模型统计 - 返回指定模型的 token 使用统计
   * @param {string} model - 模型名称
   * @returns {Object} 模型统计数据
   */
  getModelStats(model) {
    return this.stats.models[model] || { input: 0, output: 0, cache: 0, count: 0 };
  }

  /**
   * 打印报告 - 输出 token 用量报告到控制台
   * @returns {void}
   */
  printReport() {
    console.log('\n========== Token 用量报告 ==========');

    const today = this.getTodayStats();
    const total = this.getTotalStats();

    console.log(`\n【今日 ${new Date().toISOString().split('T')[0]}】`);
    console.log(`  Input:  ${today.input.toLocaleString()} tokens`);
    console.log(`  Output: ${today.output.toLocaleString()} tokens`);
    console.log(`  Cache:  ${today.cache.toLocaleString()} tokens`);
    console.log(`  Total:  ${(today.input + today.output + today.cache).toLocaleString()} tokens`);
    console.log(`  调用次数：${today.count}`);

    console.log(`\n【总计】`);
    console.log(`  Input:  ${total.input.toLocaleString()} tokens`);
    console.log(`  Output: ${total.output.toLocaleString()} tokens`);
    console.log(`  Cache:  ${total.cache.toLocaleString()} tokens`);
    console.log(`  Total:  ${(total.input + total.output + total.cache).toLocaleString()} tokens`);

    console.log('\n【按模型】');
    for (const [name, stats] of Object.entries(this.stats.models)) {
      console.log(`  ${name}: ${(stats.input + stats.output + stats.cache).toLocaleString()} tokens (${stats.count} 次)`);
    }

    console.log('====================================\n');
  }
}

// 导出
module.exports = TokenTracker;

// 命令行运行
if (require.main === module) {
  const tracker = new TokenTracker();
  tracker.printReport();
}
