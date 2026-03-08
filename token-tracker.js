/**
 * Token 用量统计脚本
 * 记录每次 API 调用的 token 消耗
 */

const fs = require('fs');
const path = require('path');

class TokenTracker {
  constructor() {
    this.statsPath = 'C:\\Users\\17589\\.openclaw\\logs\\token-stats.json';
    this.dailyPath = 'C:\\Users\\17589\\.openclaw\\logs\\token-daily.md';
    this.stats = this.loadStats();
  }

  // 加载统计数据
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

  // 保存统计数据
  saveStats() {
    try {
      fs.writeFileSync(this.statsPath, JSON.stringify(this.stats, null, 2));
    } catch (e) {
      console.error('[TokenTracker] 保存数据失败:', e.message);
    }
  }

  // 记录 token 使用
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

  // 更新日誌
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

  // 获取今日统计
  getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    return this.stats.daily[today] || { input: 0, output: 0, cache: 0, count: 0 };
  }

  // 获取总统计
  getTotalStats() {
    return this.stats.total;
  }

  // 获取模型统计
  getModelStats(model) {
    return this.stats.models[model] || { input: 0, output: 0, cache: 0, count: 0 };
  }

  // 打印报告
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
