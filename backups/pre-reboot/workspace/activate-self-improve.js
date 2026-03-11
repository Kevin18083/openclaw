#!/usr/bin/env node

/**
 * 扎克自我改进系统激活脚本 v1.0
 *
 * 功能说明：
 * 1. 自动反思 - 每次任务完成后自动记录反思
 * 2. 分析改进 - 分析错误或成功，提取改进点
 * 3. 性能指标 - 记录任务执行时间和性能数据
 * 4. 生成报告 - 输出改进报告供杰克检查
 *
 * 配置说明：
 * - MEMORY_DIR: 记忆目录路径
 * - SELF_IMPROVE_PY: Python 自我改进脚本路径
 * - IMPROVEMENT_LOG: 改进日志文件路径
 * - METRICS_FILE: 性能指标 JSON 文件路径
 *
 * 用法：
 *   node activate-self-improve.js <任务名> <结果> [指标 JSON]
 *   node activate-self-improve.js task_success "任务完成" "{\"duration\": 10}"
 *   node activate-self-improve.js task_error "文件不存在" "{}"
 *   node activate-self-improve.js help
 *
 * 示例输出：
 *   ═══════════════════════════════════════
 *   扎克自我改进系统 - 激活
 *   ═══════════════════════════════════════
 *   任务：task_success
 *   结果：任务完成
 *   ✅ 改进点已记录
 *
 * 常见错误：
 * - Python 未安装 → 使用纯 JavaScript 模式继续运行
 * - 记忆目录不存在 → 脚本会自动创建
 * - 指标 JSON 格式错误 → 使用空指标继续
 *
 * 依赖：
 * - Node.js 14+
 * - Python 3.x (可选，用于运行 Python 自我改进脚本)
 * - fs, path, child_process (内置模块)
 *
 * 修改历史：
 * - 2026-03-09: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MEMORY_DIR = path.join(__dirname, 'memory');
const SELF_IMPROVE_PY = path.join(MEMORY_DIR, 'self-improvement-system.py');
const IMPROVEMENT_LOG = path.join(MEMORY_DIR, 'self-improvement.md');
const METRICS_FILE = path.join(MEMORY_DIR, 'metrics', 'performance.json');

// 颜色定义
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * 确保目录存在
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`${colors.green}✅${colors.reset} 创建目录：${dir}`);
  }
}

/**
 * 记录任务反思（调用 Python 脚本）
 */
function reflectOnTask(taskName, result, metrics = {}) {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}📝 扎克自我反思${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);

  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  // 确保目录存在
  ensureDir(path.join(MEMORY_DIR, 'metrics'));
  ensureDir(path.join(MEMORY_DIR, 'knowledge'));
  ensureDir(path.join(MEMORY_DIR, 'improvement'));
  ensureDir(path.join(MEMORY_DIR, 'strategies'));

  // 记录到日志文件
  let logContent = '';
  if (fs.existsSync(IMPROVEMENT_LOG)) {
    logContent = fs.readFileSync(IMPROVEMENT_LOG, 'utf-8');
  }

  let entry = `
## ${dateStr}

**任务**: ${taskName}
**时间**: ${timestamp}
**结果**: ${result.substring(0, 200)}${result.length > 200 ? '...' : ''}
**指标**: ${JSON.stringify(metrics, null, 2)}

`;

  // 分析改进点
  const improvements = analyzeImprovements(result, metrics);
  if (improvements.length > 0) {
    entry += `**改进建议**:\n`;
    improvements.forEach(imp => {
      entry += `- ${imp}\n`;
    });
    entry += '\n';
  }

  entry += `---\n\n`;

  // 写入日志
  fs.appendFileSync(IMPROVEMENT_LOG, entry);
  console.log(`${colors.green}✅${colors.reset} 反思已记录到：${IMPROVEMENT_LOG}`);

  // 记录性能指标
  recordMetrics(taskName, metrics);

  // 如果有改进建议，记录到单独文件
  if (improvements.length > 0) {
    const improvementFile = path.join(MEMORY_DIR, 'improvement', `${Date.now()}-${taskName.replace(/\s+/g, '-')}.md`);
    const improvementContent = `# 改进建议 - ${taskName}

**时间**: ${dateStr}

## 分析结果
${improvements.map((imp, i) => `${i + 1}. ${imp}`).join('\n')}

## 行动计划
${improvements.map(imp => `- [ ] ${imp}`).join('\n')}
`;
    fs.writeFileSync(improvementFile, improvementContent);
    console.log(`${colors.yellow}💡${colors.reset} 改进建议已保存：${improvementFile}`);
  }

  return improvements;
}

/**
 * 分析改进点
 */
function analyzeImprovements(result, metrics) {
  const improvements = [];

  // 分析错误
  if (result.toLowerCase().includes('error') || result.includes('❌') || result.includes('失败')) {
    improvements.push(`错误处理：${result.substring(0, 100)}`);
  }

  // 分析指标
  if (metrics.error_rate > 0.1) {
    improvements.push('错误率过高，需要优化错误处理');
  }

  if (metrics.response_time > 5) {
    improvements.push('响应时间过长，需要优化性能');
  }

  if (metrics.success_rate < 0.8) {
    improvements.push('成功率较低，需要分析失败原因');
  }

  if (metrics.duration > 60) {
    improvements.push(`任务耗时过长 (${metrics.duration}秒)，考虑优化或并行处理`);
  }

  return improvements;
}

/**
 * 记录性能指标
 */
function recordMetrics(taskName, metrics) {
  let metricsData = {};

  if (fs.existsSync(METRICS_FILE)) {
    try {
      metricsData = JSON.parse(fs.readFileSync(METRICS_FILE, 'utf-8'));
    } catch (e) {
      metricsData = {};
    }
  }

  // 添加新指标
  const timestamp = new Date().toISOString();
  const metricName = taskName.replace(/\s+/g, '_').toLowerCase();

  if (!metricsData[metricName]) {
    metricsData[metricName] = [];
  }

  const entry = {
    timestamp: timestamp,
    value: metrics,
    tags: { task: taskName }
  };

  metricsData[metricName].push(entry);

  // 只保留最近 1000 条
  if (metricsData[metricName].length > 1000) {
    metricsData[metricName] = metricsData[metricName].slice(-1000);
  }

  fs.writeFileSync(METRICS_FILE, JSON.stringify(metricsData, null, 2, 'utf-8'));
  console.log(`${colors.green}✅${colors.reset} 指标已记录：${metricName}`);
}

/**
 * 生成改进报告
 */
function generateReport(days = 7) {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}📊 生成改进报告 (最近${days}天)${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);

  if (!fs.existsSync(IMPROVEMENT_LOG)) {
    console.log('暂无改进日志');
    return;
  }

  const logContent = fs.readFileSync(IMPROVEMENT_LOG, 'utf-8');
  const entries = logContent.split('---').filter(e => e.trim());

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentEntries = entries.filter(entry => {
    const dateMatch = entry.match(/(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) return false;
    const entryDate = new Date(dateMatch[1]);
    return entryDate >= cutoffDate;
  });

  console.log(`\n${colors.green}最近${days}天记录数：${recentEntries.length}${colors.reset}`);

  if (recentEntries.length > 0) {
    console.log('\n最新 5 条记录:');
    recentEntries.slice(-5).forEach(entry => {
      const taskMatch = entry.match(/\*\*任务\*\*: (.+)/);
      const task = taskMatch ? taskMatch[1] : '未知任务';
      console.log(`  - ${task}`);
    });
  }

  // 读取指标文件
  if (fs.existsSync(METRICS_FILE)) {
    const metricsData = JSON.parse(fs.readFileSync(METRICS_FILE, 'utf-8'));
    const taskCount = Object.keys(metricsData).length;
    console.log(`\n${colors.green}记录的任务指标数：${taskCount}${colors.reset}`);
  }
}

/**
 * 主函数
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
${colors.cyan}扎克自我改进系统激活脚本${colors.reset}

用法:
  node activate-self-improve.js <任务名> <结果> [指标 JSON]
  node activate-self-improve.js report [天数]
  node activate-self-improve.js init

示例:
  node activate-self-improve.js task_success "任务完成" "{\\"duration\\": 10}"
  node activate-self-improve.js task_error "文件不存在" "{}"
  node activate-self-improve.js report 7
  node activate-self-improve.js init
`);
    return;
  }

  if (args[0] === 'report') {
    const days = parseInt(args[1]) || 7;
    generateReport(days);
    return;
  }

  if (args[0] === 'init') {
    console.log(`${colors.cyan}初始化自我改进系统...${colors.reset}`);
    ensureDir(path.join(MEMORY_DIR, 'metrics'));
    ensureDir(path.join(MEMORY_DIR, 'knowledge'));
    ensureDir(path.join(MEMORY_DIR, 'improvement'));
    ensureDir(path.join(MEMORY_DIR, 'strategies'));

    // 创建初始日志
    if (!fs.existsSync(IMPROVEMENT_LOG)) {
      fs.writeFileSync(IMPROVEMENT_LOG, `# 扎克自我改进日志

> 创建时间：${new Date().toISOString()}
> 目的：记录每次任务的反思和改进建议

---

`);
      console.log(`${colors.green}✅${colors.reset} 已创建初始日志文件`);
    }

    console.log(`${colors.green}✅${colors.reset} 初始化完成！`);
    return;
  }

  // 记录任务反思
  const taskName = args[0];
  const result = args[1] || '';
  let metrics = {};

  if (args[2]) {
    try {
      metrics = JSON.parse(args[2]);
    } catch (e) {
      console.log(`${colors.yellow}⚠️${colors.reset} 指标 JSON 解析失败，使用空对象`);
    }
  }

  const improvements = reflectOnTask(taskName, result, metrics);

  console.log(`\n${colors.green}✅${colors.reset} 自我改进记录完成！`);
  if (improvements.length > 0) {
    console.log(`${colors.yellow}💡${colors.reset} 发现 ${improvements.length} 个改进点`);
  }
}

main();
