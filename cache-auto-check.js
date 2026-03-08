/**
 * 缓存优化自动排查脚本
 * 定期运行，自动发现问题并优化
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  logPath: 'C:\\Users\\17589\\.openclaw\\workspace\\cache-optimization-log.json',
  reportPath: 'C:\\Users\\17589\\.openclaw\\workspace\\cache-optimization-report.md',
  backupPath: 'C:\\Users\\17589\\.openclaw\\workspace\\backups\\cache-optimization\\',
  checkInterval: 259200000, // 3 天检查一次 (3 * 24 * 60 * 60 * 1000)
  hitRateThreshold: 70,
  alertThreshold: 50
};

// 确保备份目录存在
const backupDir = path.dirname(CONFIG.backupPath);
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`创建备份目录：${backupDir}`);
}

console.log('='.repeat(80));
console.log('缓存优化自动排查系统');
console.log('='.repeat(80));
console.log(`检查时间：${new Date().toLocaleString('zh-CN')}`);
console.log('');

// 读取统计数据
let stats = { totalRequests: 0, cacheHits: 0, cacheMisses: 0, templates: {} };

if (fs.existsSync(CONFIG.logPath)) {
  try {
    const data = fs.readFileSync(CONFIG.logPath, 'utf-8');
    stats = JSON.parse(data);
    console.log(`✅ 已加载统计数据：${stats.totalRequests} 次请求`);
  } catch (e) {
    console.log('⚠️ 无法读取统计数据，从头开始');
  }
} else {
  console.log('ℹ️ 首次运行，无历史数据');
}

// 计算命中率
const hitRate = stats.totalRequests > 0 
  ? ((stats.cacheHits / stats.totalRequests) * 100).toFixed(1)
  : 0;

console.log('');
console.log('📊 当前状态:');
console.log(`  总请求数：${stats.totalRequests}`);
console.log(`  缓存命中：${stats.cacheHits}`);
console.log(`  缓存未命中：${stats.cacheMisses}`);
console.log(`  命中率：${hitRate}% (目标：${CONFIG.hitRateThreshold}%)`);
console.log('');

// 分析模板表现
console.log('📋 模板表现分析:');
console.log('');

const templateAnalysis = [];

for (const [name, data] of Object.entries(stats.templates || {})) {
  if (data.uses >= 5) { // 至少 5 次使用才有统计意义
    const templateHitRate = ((data.hits / data.uses) * 100).toFixed(1);
    const status = parseFloat(templateHitRate) >= CONFIG.hitRateThreshold ? '✅' : 
                   parseFloat(templateHitRate) >= CONFIG.alertThreshold ? '⚠️' : '❌';
    
    templateAnalysis.push({
      name,
      hitRate: parseFloat(templateHitRate),
      uses: data.uses,
      avgResponseTime: data.avgResponseTime?.toFixed(0) || 'N/A',
      avgTokenUsage: data.avgTokenUsage?.toFixed(0) || 'N/A',
      status
    });
    
    console.log(`${status} ${name}`);
    console.log(`   命中率：${templateHitRate}% (${data.hits}/${data.uses})`);
    console.log(`   平均响应：${data.avgResponseTime?.toFixed(0) || 'N/A'}ms`);
    console.log(`   平均 Token: ${data.avgTokenUsage?.toFixed(0) || 'N/A'}`);
    console.log('');
  }
}

if (templateAnalysis.length === 0) {
  console.log('  暂无足够数据进行模板分析（需要至少 5 次使用）');
  console.log('');
}

// 生成优化建议
console.log('💡 优化建议:');
console.log('');

const recommendations = [];

// 整体命中率建议
if (parseFloat(hitRate) < CONFIG.alertThreshold) {
  recommendations.push({
    priority: '🔴 紧急',
    issue: '整体命中率过低',
    suggestion: '立即检查模板设计，增加固定前缀，减少动态变量'
  });
} else if (parseFloat(hitRate) < CONFIG.hitRateThreshold) {
  recommendations.push({
    priority: '🟡 需要改进',
    issue: '命中率未达目标',
    suggestion: '持续优化低效模板，增加模板复用'
  });
} else {
  recommendations.push({
    priority: '🟢 良好',
    issue: '命中率达到目标',
    suggestion: '继续保持，关注极端场景'
  });
}

// 低效模板建议
const underperformingTemplates = templateAnalysis.filter(t => t.hitRate < CONFIG.hitRateThreshold);
if (underperformingTemplates.length > 0) {
  underperformingTemplates.forEach(t => {
    recommendations.push({
      priority: '🟠 模板优化',
      issue: `${t.name} 命中率偏低 (${t.hitRate}%)`,
      suggestion: t.hitRate < 50 
        ? '重构模板结构，增加固定内容比例'
        : '微调模板措辞，统一输出格式'
    });
  });
}

// 输出建议
recommendations.forEach((rec, i) => {
  console.log(`${i + 1}. ${rec.priority} - ${rec.issue}`);
  console.log(`   建议：${rec.suggestion}`);
  console.log('');
});

// 生成 Markdown 报告
const report = `# 缓存优化排查报告

**生成时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

## 整体状态

| 指标 | 数值 | 目标 | 状态 |
|------|------|------|------|
| 总请求数 | ${stats.totalRequests} | - | - |
| 缓存命中 | ${stats.cacheHits} | - | - |
| 缓存未命中 | ${stats.cacheMisses} | - | - |
| **命中率** | **${hitRate}%** | ${CONFIG.hitRateThreshold}% | ${parseFloat(hitRate) >= CONFIG.hitRateThreshold ? '✅' : '⚠️'} |

## 模板表现

${templateAnalysis.length > 0 ? templateAnalysis.map(t => `
### ${t.status} ${t.name}
- **命中率**: ${t.hitRate}%
- **使用次数**: ${t.uses}
- **平均响应时间**: ${t.avgResponseTime}ms
- **平均 Token 使用**: ${t.avgTokenUsage}
`).join('\n') : '暂无足够数据'}

## 优化建议

${recommendations.map((rec, i) => `
### ${i + 1}. ${rec.priority} - ${rec.issue}
**建议**: ${rec.suggestion}
`).join('\n')}

## 下一步行动

${parseFloat(hitRate) < CONFIG.alertThreshold ? `
### 🔴 紧急行动
1. 立即审查所有模板结构
2. 增加固定前缀比例
3. 减少动态变量位置变化
4. 24 小时后重新评估
` : parseFloat(hitRate) < CONFIG.hitRateThreshold ? `
### 🟡 改进行动
1. 优化低效模板（见上文）
2. 增加模板使用频率
3. 监控命中率变化趋势
4. 48 小时后重新评估
` : `
### 🟢 维持行动
1. 保持当前模板设计
2. 持续监控命中率
3. 每周生成一次报告
4. 关注新增场景的模板覆盖
`}

## 历史趋势

> 注：需要至少 3 次排查记录才能生成趋势图

---
*报告由缓存优化自动排查系统生成*
`;

// 保存报告
fs.writeFileSync(CONFIG.reportPath, report);
console.log(`📄 报告已保存：${CONFIG.reportPath}`);

// 备份统计数据
const backupFile = path.join(
  CONFIG.backupPath,
  `cache-stats-${Date.now()}.json`
);
fs.writeFileSync(backupFile, JSON.stringify(stats, null, 2));
console.log(`💾 备份已保存：${backupFile}`);

// 清理旧备份（保留最近 10 个）
try {
  const backups = fs.readdirSync(CONFIG.backupPath)
    .filter(f => f.startsWith('cache-stats-'))
    .sort()
    .reverse();
  
  if (backups.length > 10) {
    backups.slice(10).forEach(f => {
      fs.unlinkSync(path.join(CONFIG.backupPath, f));
    });
    console.log(`🧹 已清理旧备份（保留最近 10 个）`);
  }
} catch (e) {
  console.log('⚠️ 备份清理失败:', e.message);
}

console.log('');
console.log('='.repeat(80));
console.log('排查完成');
console.log('='.repeat(80));

// 如果有紧急问题，输出告警
if (parseFloat(hitRate) < CONFIG.alertThreshold) {
  console.log('');
  console.log('🚨 告警：命中率低于阈值，需要立即关注！');
  console.log('');
}
