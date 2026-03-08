/**
 * 自动错误监控和预防系统
 * 功能：记录错误、分析模式、主动预防
 */

const fs = require('fs');
const path = require('path');

class ErrorMonitor {
  constructor() {
    this.errorLogPath = 'C:\\Users\\17589\\.openclaw\\workspace\\error-log.md';
    this.errorDataPath = 'C:\\Users\\17589\\.openclaw\\workspace\\error-data.json';
    this.errors = [];
    this.loadErrors();
  }

  // 加载错误数据
  loadErrors() {
    try {
      if (fs.existsSync(this.errorDataPath)) {
        const data = fs.readFileSync(this.errorDataPath, 'utf-8');
        this.errors = JSON.parse(data);
      }
    } catch (e) {
      console.log('[ErrorMonitor] 无历史错误数据');
    }
  }

  // 保存错误数据
  saveErrors() {
    try {
      fs.writeFileSync(this.errorDataPath, JSON.stringify(this.errors, null, 2));
    } catch (e) {
      console.error('[ErrorMonitor] 保存错误数据失败:', e.message);
    }
  }

  // 记录错误
  recordError(error) {
    const errorRecord = {
      id: `ERR-${String(this.errors.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      category: error.category || 'uncategorized',
      severity: error.severity || 'medium', // critical, medium, low
      type: error.type || 'unknown', // code, config, logic, operation, communication
      description: error.description,
      rootCause: error.rootCause || '待分析',
      solution: error.solution || '待解决',
      prevention: error.prevention || [],
      status: 'open', // open, resolved, verified
      occurrenceCount: 1,
      relatedFiles: error.relatedFiles || [],
      tags: error.tags || []
    };

    this.errors.push(errorRecord);
    this.saveErrors();
    this.updateErrorLog();

    console.log(`[ErrorMonitor] 记录错误：${errorRecord.id} - ${error.description.substring(0, 50)}...`);
    
    return errorRecord;
  }

  // 更新错误日志 Markdown
  updateErrorLog() {
    try {
      let content = `# 错误日志 - 扎克的问题记录和改进

**创建时间**: ${new Date().toLocaleString('zh-CN')}
**目的**: 记录所有错误、异常、问题，避免重复犯错
**原则**: 同样的错误不犯第二次

---

## 📊 错误统计

### 总体情况
- **总错误数**: ${this.errors.length}
- **已解决**: ${this.errors.filter(e => e.status === 'resolved' || e.status === 'verified').length}
- **待解决**: ${this.errors.filter(e => e.status === 'open').length}
- **重复发生**: ${this.errors.filter(e => e.occurrenceCount > 1).length}

### 按严重程度
| 级别 | 数量 | 占比 |
|------|------|------|
| 🔴 严重 | ${this.errors.filter(e => e.severity === 'critical').length} | ${this.calculatePercentage('critical')}% |
| 🟡 中等 | ${this.errors.filter(e => e.severity === 'medium').length} | ${this.calculatePercentage('medium')}% |
| 🟢 轻微 | ${this.errors.filter(e => e.severity === 'low').length} | ${this.calculatePercentage('low')}% |

### 按类型
| 类型 | 数量 |
|------|------|
| 代码错误 | ${this.errors.filter(e => e.type === 'code').length} |
| 配置错误 | ${this.errors.filter(e => e.type === 'config').length} |
| 逻辑错误 | ${this.errors.filter(e => e.type === 'logic').length} |
| 操作错误 | ${this.errors.filter(e => e.type === 'operation').length} |
| 沟通错误 | ${this.errors.filter(e => e.type === 'communication').length} |
| 其他 | ${this.errors.filter(e => e.type === 'other').length} |

---

## 📝 错误详情

${this.errors.map(error => this.formatErrorDetail(error)).join('\n---\n')}

---

## 🎯 改进措施总结

${this.generatePreventionSummary()}

---

*最后更新：${new Date().toLocaleString('zh-CN')}*  
*维护者：扎克*  
*原则：同样的错误不犯第二次*
`;

      fs.writeFileSync(this.errorLogPath, content, 'utf-8');
    } catch (e) {
      console.error('[ErrorMonitor] 更新错误日志失败:', e.message);
    }
  }

  // 计算百分比
  calculatePercentage(severity) {
    if (this.errors.length === 0) return 0;
    const count = this.errors.filter(e => e.severity === severity).length;
    return ((count / this.errors.length) * 100).toFixed(1);
  }

  // 格式化错误详情
  formatErrorDetail(error) {
    const severityIcon = {
      critical: '🔴',
      medium: '🟡',
      low: '🟢'
    }[error.severity] || '⚪';

    const statusIcon = error.status === 'open' ? '⏳' : '✅';

    return `
### ${error.id}: ${error.description.substring(0, 50)}${error.description.length > 50 ? '...' : ''}
- **发生时间**: ${new Date(error.timestamp).toLocaleString('zh-CN')}
- **错误类型**: ${error.type}
- **严重程度**: ${severityIcon} ${error.severity}
- **问题描述**: ${error.description}
- **根本原因**: ${error.rootCause}
- **解决方案**: ${error.solution}
- **预防措施**: ${error.prevention.length > 0 ? error.prevention.join(', ') : '待制定'}
- **状态**: ${statusIcon} ${error.status}
- **发生次数**: ${error.occurrenceCount}
`;
  }

  // 生成预防总结
  generatePreventionSummary() {
    const allPreventions = new Set();
    this.errors.forEach(error => {
      if (error.prevention && error.prevention.length > 0) {
        error.prevention.forEach(p => allPreventions.add(p));
      }
    });

    if (allPreventions.size === 0) {
      return '暂无预防措施，待制定。';
    }

    return Array.from(allPreventions)
      .map((p, i) => `${i + 1}. ${p}`)
      .join('\n');
  }

  // 检查是否有类似错误
  checkSimilarErrors(description, threshold = 0.6) {
    const similarities = this.errors.map(error => ({
      error,
      similarity: this.calculateSimilarity(description, error.description)
    })).filter(item => item.similarity >= threshold);

    return similarities.sort((a, b) => b.similarity - a.similarity);
  }

  // 计算文本相似度（简单版本）
  calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word));
    const maxWords = Math.max(words1.length, words2.length);
    
    return maxWords > 0 ? commonWords.length / maxWords : 0;
  }

  // 标记错误为已解决
  resolveError(errorId, solution) {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.status = 'resolved';
      error.solution = solution;
      error.resolvedAt = new Date().toISOString();
      this.saveErrors();
      this.updateErrorLog();
      console.log(`[ErrorMonitor] 错误 ${errorId} 已标记为已解决`);
    }
  }

  // 增加错误发生次数
  incrementOccurrence(errorId) {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.occurrenceCount++;
      error.lastOccurrence = new Date().toISOString();
      this.saveErrors();
      this.updateErrorLog();
      console.log(`[ErrorMonitor] 错误 ${errorId} 再次发生，累计 ${error.occurrenceCount} 次`);
    }
  }

  // 获取错误统计
  getStatistics() {
    return {
      total: this.errors.length,
      open: this.errors.filter(e => e.status === 'open').length,
      resolved: this.errors.filter(e => e.status === 'resolved' || e.status === 'verified').length,
      bySeverity: {
        critical: this.errors.filter(e => e.severity === 'critical').length,
        medium: this.errors.filter(e => e.severity === 'medium').length,
        low: this.errors.filter(e => e.severity === 'low').length
      },
      byType: {
        code: this.errors.filter(e => e.type === 'code').length,
        config: this.errors.filter(e => e.type === 'config').length,
        logic: this.errors.filter(e => e.type === 'logic').length,
        operation: this.errors.filter(e => e.type === 'operation').length,
        communication: this.errors.filter(e => e.type === 'communication').length,
        other: this.errors.filter(e => e.type === 'other').length
      },
      repeatedErrors: this.errors.filter(e => e.occurrenceCount > 1).length
    };
  }

  // 生成报告
  generateReport() {
    const stats = this.getStatistics();
    const report = {
      generatedAt: new Date().toISOString(),
      statistics: stats,
      recentErrors: this.errors.slice(-5).map(e => ({
        id: e.id,
        description: e.description,
        severity: e.severity,
        status: e.status,
        timestamp: e.timestamp
      })),
      repeatedErrors: this.errors.filter(e => e.occurrenceCount > 1).map(e => ({
        id: e.id,
        description: e.description,
        occurrenceCount: e.occurrenceCount,
        lastOccurrence: e.lastOccurrence
      }))
    };

    const reportPath = 'C:\\Users\\17589\\.openclaw\\workspace\\error-monitor-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }
}

// 导出使用
module.exports = { ErrorMonitor };

// 如果是直接运行，显示统计
if (require.main === module) {
  const monitor = new ErrorMonitor();
  const stats = monitor.getStatistics();
  
  console.log('='.repeat(60));
  console.log('错误监控系统 - 统计报告');
  console.log('='.repeat(60));
  console.log(`总错误数：${stats.total}`);
  console.log(`待解决：${stats.open}`);
  console.log(`已解决：${stats.resolved}`);
  console.log(`重复发生：${stats.repeatedErrors}`);
  console.log('');
  console.log('按严重程度:');
  console.log(`  🔴 严重：${stats.bySeverity.critical}`);
  console.log(`  🟡 中等：${stats.bySeverity.medium}`);
  console.log(`  🟢 轻微：${stats.bySeverity.low}`);
  console.log('');
  console.log('按类型:');
  console.log(`  代码错误：${stats.byType.code}`);
  console.log(`  配置错误：${stats.byType.config}`);
  console.log(`  逻辑错误：${stats.byType.logic}`);
  console.log(`  操作错误：${stats.byType.operation}`);
  console.log(`  沟通错误：${stats.byType.communication}`);
  console.log(`  其他：${stats.byType.other}`);
  console.log('='.repeat(60));
  
  // 生成报告
  monitor.generateReport();
  console.log('详细报告已保存到：error-monitor-report.json');
}
