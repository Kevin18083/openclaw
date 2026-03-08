// 性能监控脚本
// 用途：监控系统性能、API 响应时间、错误率

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

// 记录性能数据
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

// 生成性能报告
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

// 自动性能检查
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
