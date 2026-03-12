#!/usr/bin/env node
/**
 * 扎克自我改进系统 - 激活脚本
 * 用于记录任务反思、生成报告、管理知识库
 */

const fs = require('fs');
const path = require('path');

// 基础目录
const BASE_DIR = __dirname;
const LOG_FILE = path.join(BASE_DIR, 'self-improvement.md');
const METRICS_DIR = path.join(BASE_DIR, 'metrics');
const KNOWLEDGE_DIR = path.join(BASE_DIR, 'knowledge');
const IMPROVEMENT_DIR = path.join(BASE_DIR, 'improvement');
const STRATEGIES_DIR = path.join(BASE_DIR, 'strategies');

/**
 * 初始化系统 - 创建必要目录
 */
function init() {
  const dirs = [METRICS_DIR, KNOWLEDGE_DIR, IMPROVEMENT_DIR, STRATEGIES_DIR];
  
  console.log('🚀 初始化自我改进系统...\n');
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ 创建目录：${dir}`);
    } else {
      console.log(`✓ 目录已存在：${dir}`);
    }
  });
  
  // 初始化指标文件
  const metricsFile = path.join(METRICS_DIR, 'performance.json');
  if (!fs.existsSync(metricsFile)) {
    fs.writeFileSync(metricsFile, JSON.stringify({}, null, 2), 'utf-8');
    console.log(`✅ 创建指标文件：${metricsFile}`);
  }
  
  console.log('\n✅ 系统初始化完成！');
  console.log('\n📊 系统状态:');
  console.log(`- 改进日志：${LOG_FILE}`);
  console.log(`- 知识库：${KNOWLEDGE_DIR}/`);
  console.log(`- 性能指标：${metricsFile}`);
  console.log(`- 改进建议：${IMPROVEMENT_DIR}/`);
  console.log(`- 策略库：${STRATEGIES_DIR}/`);
}

/**
 * 分析改进机会
 */
function analyzeForImprovements(result, metrics) {
  const improvements = [];
  
  // 基于结果分析
  if (result instanceof Error || (typeof result === 'string' && result.toLowerCase().includes('失败') || result.toLowerCase().includes('错误'))) {
    improvements.push(`错误处理：${result.toString().substring(0, 100)}`);
  }
  
  // 基于指标分析
  if (metrics) {
    if (metrics.error_rate > 0.1) {
      improvements.push('错误率过高，需要优化错误处理');
    }
    if (metrics.response_time > 5) {
      improvements.push('响应时间过长，需要优化性能');
    }
    if (metrics.success_rate < 0.8) {
      improvements.push('成功率较低，需要分析失败原因');
    }
    if (metrics.duration > 300) {
      improvements.push('任务耗时过长，考虑优化流程');
    }
  }
  
  return improvements;
}

/**
 * 记录任务反思
 */
function recordTask(taskName, result, metricsStr) {
  let metrics = {};
  try {
    metrics = metricsStr ? JSON.parse(metricsStr) : {};
  } catch (e) {
    console.warn('⚠️ 指标 JSON 解析失败，使用空对象');
  }
  
  const timestamp = new Date().toISOString();
  const timeStr = new Date().toLocaleString('zh-CN', { 
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // 分析改进机会
  const improvements = analyzeForImprovements(result, metrics);
  
  // 构建日志条目
  let logEntry = `\n## ${timeStr}\n`;
  logEntry += `**任务**: ${taskName}\n`;
  
  if (result.length > 200) {
    logEntry += `**结果**: ${result.substring(0, 200)}...\n`;
  } else {
    logEntry += `**结果**: ${result}\n`;
  }
  
  if (Object.keys(metrics).length > 0) {
    logEntry += `**指标**: ${JSON.stringify(metrics, null, 2)}\n`;
  }
  
  if (improvements.length > 0) {
    logEntry += `**改进建议**:\n`;
    improvements.forEach(imp => {
      logEntry += `- ${imp}\n`;
    });
    
    // 创建改进建议文件
    createImprovementFile(taskName, improvements, metrics);
  }
  
  logEntry += `\n---\n`;
  
  // 追加到日志文件
  fs.appendFileSync(LOG_FILE, logEntry, 'utf-8');
  
  console.log(`📝 任务反思已记录：${taskName}`);
  if (improvements.length > 0) {
    console.log(`💡 生成 ${improvements.length} 条改进建议`);
  }
  
  // 记录性能指标
  if (metrics.duration) {
    recordMetric(`task_${taskName.replace(/\s+/g, '_')}_duration`, metrics.duration);
  }
  if (metrics.success_rate) {
    recordMetric(`task_${taskName.replace(/\s+/g, '_')}_success_rate`, metrics.success_rate);
  }
}

/**
 * 创建改进建议文件
 */
function createImprovementFile(taskName, improvements, metrics) {
  const fileName = `improvement-${new Date().toISOString().split('T')[0]}-${taskName.replace(/\s+/g, '-').toLowerCase()}.md`;
  const filePath = path.join(IMPROVEMENT_DIR, fileName);
  
  let content = `# 改进建议 - ${taskName}\n\n`;
  content += `**时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n\n`;
  content += `## 分析结果\n`;
  
  improvements.forEach((imp, index) => {
    content += `${index + 1}. ${imp}\n`;
  });
  
  content += `\n## 行动计划\n`;
  improvements.forEach(imp => {
    content += `- [ ] ${imp}\n`;
  });
  
  if (Object.keys(metrics).length > 0) {
    content += `\n## 相关指标\n`;
    content += `\`\`\`json\n${JSON.stringify(metrics, null, 2)}\n\`\`\`\n`;
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`📋 改进建议文件：${filePath}`);
}

/**
 * 记录性能指标
 */
function recordMetric(metricName, value, tags = {}) {
  const metricsFile = path.join(METRICS_DIR, 'performance.json');
  
  let metricsData = {};
  if (fs.existsSync(metricsFile)) {
    try {
      metricsData = JSON.parse(fs.readFileSync(metricsFile, 'utf-8'));
    } catch (e) {
      metricsData = {};
    }
  }
  
  const timestamp = new Date().toISOString();
  const metricEntry = {
    timestamp,
    value,
    tags
  };
  
  if (!metricsData[metricName]) {
    metricsData[metricName] = [];
  }
  
  metricsData[metricName].push(metricEntry);
  
  // 只保留最近 1000 条
  if (metricsData[metricName].length > 1000) {
    metricsData[metricName] = metricsData[metricName].slice(-1000);
  }
  
  fs.writeFileSync(metricsFile, JSON.stringify(metricsData, null, 2), 'utf-8');
  console.log(`📊 指标已记录：${metricName} = ${value}`);
}

/**
 * 生成改进报告
 */
function generateReport(days = 7) {
  console.log(`📋 生成改进报告（最近 ${days} 天）...\n`);
  
  const report = {
    generated_at: new Date().toISOString(),
    period_days: days,
    summary: {},
    improvements: [],
    recommendations: []
  };
  
  // 分析改进日志
  if (fs.existsSync(LOG_FILE)) {
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    const taskCount = (content.match(/## \d{4}-\d{2}-\d{2}/g) || []).length;
    const improvementCount = (content.match(/改进建议/g) || []).length;
    
    report.summary.tasks_analyzed = taskCount;
    report.summary.improvements_identified = improvementCount;
    
    console.log(`📊 分析结果:`);
    console.log(`- 任务反思数：${taskCount}`);
    console.log(`- 改进建议数：${improvementCount}`);
  }
  
  // 分析知识积累
  if (fs.existsSync(KNOWLEDGE_DIR)) {
    const knowledgeFiles = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.md'));
    report.summary.knowledge_categories = knowledgeFiles.length;
    console.log(`- 知识分类数：${knowledgeFiles.length}`);
  }
  
  // 生成建议
  report.recommendations = [
    '定期回顾改进日志',
    '将知识应用到实际任务',
    '监控关键性能指标',
    '持续优化改进流程'
  ];
  
  // 保存报告
  const reportFile = path.join(IMPROVEMENT_DIR, `report-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');
  
  console.log(`\n✅ 改进报告已生成：${reportFile}`);
  
  // 显示报告摘要
  console.log('\n📊 报告摘要:');
  console.log(JSON.stringify(report.summary, null, 2));
  
  return report;
}

/**
 * 添加知识到知识库
 */
function addKnowledge(category, knowledge, context = '') {
  const knowledgeFile = path.join(KNOWLEDGE_DIR, `${category}.md`);
  
  let content = `\n### ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n`;
  content += `**知识**: ${knowledge}\n`;
  if (context) {
    content += `**上下文**: ${context}\n`;
  }
  content += `**分类**: ${category}\n`;
  content += `\n---\n`;
  
  fs.appendFileSync(knowledgeFile, content, 'utf-8');
  
  console.log(`📚 知识已添加：${category}`);
  console.log(`📁 文件：${knowledgeFile}`);
}

/**
 * 显示使用帮助
 */
function showHelp() {
  console.log(`
🚀 扎克自我改进系统 - 使用指南

用法:
  node activate-self-improve.js <命令> [参数]

命令:
  init                          初始化系统（创建目录结构）
  "任务名称" "结果" [指标 JSON]  记录任务反思
  report [天数]                 生成改进报告（默认 7 天）
  knowledge <分类> <知识> [上下文]  添加知识
  help                          显示此帮助信息

示例:
  node activate-self-improve.js init
  node activate-self-improve.js "备份系统运行" "6 份备份全部完成" "{\\"duration\\": 180, \\"backup_count\\": 6}"
  node activate-self-improve.js "网关启动" "端口被占用，启动失败" "{\\"error\\": true}"
  node activate-self-improve.js report 30
  node activate-self-improve.js knowledge "technical" "Python 装饰器可以包装函数" "用于任务监控"
  `);
}

// 主程序
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    showHelp();
    return;
  }
  
  const command = args[0];
  
  switch (command) {
    case 'init':
      init();
      break;
    
    case 'report':
      const days = args[1] ? parseInt(args[1]) : 7;
      generateReport(days);
      break;
    
    case 'knowledge':
      if (args.length < 3) {
        console.error('❌ 错误：knowledge 命令需要至少 2 个参数');
        console.error('用法：node activate-self-improve.js knowledge <分类> <知识> [上下文]');
        process.exit(1);
      }
      addKnowledge(args[1], args[2], args[3] || '');
      break;
    
    case 'help':
      showHelp();
      break;
    
    default:
      // 假设是记录任务
      if (args.length >= 2) {
        const taskName = command;
        const result = args[1];
        const metricsStr = args[2] || '{}';
        recordTask(taskName, result, metricsStr);
      } else {
        console.error('❌ 错误：参数不足');
        showHelp();
        process.exit(1);
      }
  }
}

main();
