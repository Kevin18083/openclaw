#!/usr/bin/env node

/**
 * 性能监控系统 v1.0
 *
 * 功能说明：
 * 1. 系统监控 - 监控系统性能和资源使用
 * 2. API 监控 - 记录 API 响应时间和调用次数
 * 3. 错误追踪 - 统计错误率和错误类型
 * 4. 自动告警 - 错误率超过阈值时发出警告
 *
 * 配置说明：
 * - LOG_FILE: 性能日志文件路径
 * - metrics: 性能指标对象（apiCalls, errors, avgResponseTime 等）
 * - 自动检查间隔：30 分钟
 * - 错误率告警阈值：10%
 *
 * 用法：
 *   const { logPerformance, generateReport } = require('./performance-monitor')
 *   logPerformance('API 调用', 150, true)
 *   generateReport()
 *
 * 示例输出：
 *   [性能日志] API 调用：150ms - 成功
 *   [性能监控] 运行时长：2 小时
 *   [性能监控] API 调用：50 次
 *   [性能监控] 成功率：98.00%
 *
 * 常见错误：
 * - 日志文件写入失败 → 检查文件权限
 * - 指标数据异常 → 检查是否有除零错误
 *
 * 依赖：
 * - Node.js 14+
 * - fs, path (内置模块)
 *
 * 修改历史：
 * - 2026-03-07: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
 */

const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'performance-log.md');

// 性能指标
const metrics = {
  startTime: Date.now(),
  apiCalls: 0,
  errors: 0,
  avgResponseTime: 0,
  lastCheck: new Date().toISOString()
};

/**
 * 记录性能数据 - 记录事件的性能数据到日志
 * @param {string} event - 事件名称
 * @param {number} duration - 耗时（毫秒）
 * @param {boolean} [success=true] - 是否成功
 * @returns {void}
 */
function logPerformance(event, duration, success = true) {
  metrics.apiCalls++;
  if (!success) metrics.errors++;
  
  // 计算平均响应时间
  metrics.avgResponseTime = ((metrics.avgResponseTime * (metrics.apiCalls - 1)) + duration) / metrics.apiCalls;
  metrics.lastCheck = new Date().toISOString();
  
  // 写入日志
  const logEntry = `## ${metrics.lastCheck}\n- 事件：${event}\n- 耗时：${duration}ms\n- 状态：${success ? '✅ 成功' : '❌ 失败'}\n\n`;
  
  fs.appendFileSync(LOG_FILE, logEntry);
  console.log(`[性能日志] ${event}: ${duration}ms - ${success ? '成功' : '失败'}`);
}

/**
 * 生成性能报告 - 生成完整的性能监控报告
 * @returns {string} Markdown 格式的性能报告
 */
function generateReport() {
  const successRate = ((metrics.apiCalls - metrics.errors) / metrics.apiCalls * 100).toFixed(2);
  
  const report = `# 性能监控报告\n\n**生成时间：** ${new Date().toISOString()}\n\n## 核心指标\n- 总调用次数：${metrics.apiCalls}\n- 成功次数：${metrics.apiCalls - metrics.errors}\n- 失败次数：${metrics.errors}\n- 成功率：${successRate}%\n- 平均响应时间：${metrics.avgResponseTime.toFixed(2)}ms\n- 运行时长：${((Date.now() - metrics.startTime) / 1000 / 60).toFixed(2)} 分钟\n\n`;
  
  fs.writeFileSync(LOG_FILE.replace('.md', '-report.md'), report);
  return report;
}

// 导出函数
module.exports = { logPerformance, generateReport, metrics };

// 如果是直接运行，生成报告
if (require.main === module) {
  console.log(generateReport());
}

/**
 * 自动性能检查 - 定期检查性能指标并发出告警
 * @returns {void}
 */
function autoCheck() {
  const now = Date.now();
  const uptime = now - metrics.startTime;
  const hours = Math.floor(uptime / 1000 / 3600);
  
  console.log(`[性能监控] 运行时长：${hours} 小时`);
  console.log(`[性能监控] API 调用：${metrics.apiCalls} 次`);
  console.log(`[性能监控] 成功率：${((metrics.apiCalls - metrics.errors) / metrics.apiCalls * 100).toFixed(2)}%`);
  
  // 如果错误率超过 10%，发出警告
  const errorRate = metrics.errors / metrics.apiCalls * 100;
  if (errorRate > 10) {
    console.warn(`⚠️ [警告] 错误率过高：${errorRate.toFixed(2)}%`);
  }
}

// 每 30 分钟自动检查
setInterval(autoCheck, 30 * 60 * 1000);

module.exports.autoCheck = autoCheck;
