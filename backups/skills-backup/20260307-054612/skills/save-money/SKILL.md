---
name: Save Money
description: 智能省钱和财务管理工具。帮助跟踪消费、分析支出、制定预算、优化储蓄，提供个性化的省钱建议和财务规划。
metadata: {"clawdbot":{"requires":{"bins":["node"]},"install":[{"id":"npm-deps","kind":"npm","package":"chart.js","label":"安装图表库用于数据可视化"},{"id":"npm-deps-2","kind":"npm","package":"moment","label":"安装时间处理库"}]}}
---

# Save Money - 智能省钱工具

## 概述

Save Money 是一个智能财务管理工具，帮助用户跟踪消费、分析支出模式、制定预算计划、优化储蓄策略。通过数据分析和个性化建议，帮助用户实现财务目标。

## 核心功能

### 1. 消费跟踪
- 记录日常消费
- 分类管理支出
- 支持多种货币
- 自动分类识别

### 2. 预算管理
- 制定月度/年度预算
- 实时预算监控
- 超支预警提醒
- 预算调整建议

### 3. 支出分析
- 消费趋势分析
- 类别分布统计
- 对比分析（月/年）
- 异常消费检测

### 4. 省钱建议
- 个性化省钱策略
- 消费习惯优化
- 替代方案推荐
- 长期储蓄规划

### 5. 财务目标
- 储蓄目标设定
- 进度跟踪
- 里程碑提醒
- 目标调整建议

## 快速开始

### 安装依赖
```bash
npm install chart.js moment
```

### 基础使用
```javascript
const { MoneyManager } = require('./money-core.js');

// 创建财务管理器
const manager = new MoneyManager();

// 记录消费
manager.addExpense({
  amount: 150.00,
  category: '餐饮',
  description: '午餐',
  date: '2026-03-06'
});

// 设置月度预算
manager.setBudget('餐饮', 1000.00);

// 获取消费分析
const analysis = manager.getMonthlyAnalysis('2026-03');
console.log('本月消费分析:', analysis);

// 获取省钱建议
const suggestions = manager.getSaveSuggestions();
console.log('省钱建议:', suggestions);
```

## 详细功能

### 消费记录管理
```javascript
// 添加消费记录
const expenseId = await manager.addExpense({
  amount: 299.00,
  category: '购物',
  subcategory: '服装',
  description: '购买衬衫',
  date: new Date().toISOString().split('T')[0],
  paymentMethod: '信用卡',
  tags: ['必需品', '工作服装']
});

// 查询消费记录
const expenses = manager.getExpenses({
  startDate: '2026-03-01',
  endDate: '2026-03-31',
  category: '餐饮',
  minAmount: 50
});

// 更新消费记录
await manager.updateExpense(expenseId, {
  amount: 250.00,
  description: '更新后的描述'
});

// 删除消费记录
await manager.deleteExpense(expenseId);
```

### 预算管理
```javascript
// 设置分类预算
manager.setCategoryBudget({
  category: '餐饮',
  monthlyLimit: 1000.00,
  weeklyLimit: 250.00,
  alertThreshold: 0.8  // 达到80%时提醒
});

// 设置总体预算
manager.setOverallBudget({
  monthlyIncome: 15000.00,
  monthlySavingsGoal: 3000.00,
  essentialExpenses: 8000.00,
  discretionaryExpenses: 4000.00
});

// 检查预算状态
const budgetStatus = manager.checkBudgetStatus('2026-03');
console.log('预算状态:', budgetStatus);

// 获取预算建议
const budgetAdvice = manager.getBudgetAdvice();
console.log('预算调整建议:', budgetAdvice);
```

### 数据分析
```javascript
// 月度分析
const monthlyReport = await manager.generateMonthlyReport('2026-03', {
  includeCharts: true,
  compareWithPrevious: true,
  highlightIssues: true
});

// 趋势分析
const trendAnalysis = manager.analyzeSpendingTrends({
  period: '6months',
  categories: ['餐饮', '交通', '娱乐'],
  showPredictions: true
});

// 类别分析
const categoryAnalysis = manager.analyzeByCategory({
  period: '2026-Q1',
  topN: 5,
  includePercentages: true
});

// 异常检测
const anomalies = manager.detectSpendingAnomalies({
  sensitivity: 'medium',
  notify: true
});
```

### 省钱建议
```javascript
// 获取个性化建议
const saveSuggestions = manager.getPersonalizedSuggestions({
  basedOnHistory: true,
  priority: 'highImpact',
  timeframe: '30days'
});

// 替代方案推荐
const alternatives = manager.findCostAlternatives({
  category: '餐饮',
  currentSpending: 1500.00,
  targetReduction: 0.3  // 减少30%
});

// 习惯优化建议
const habitSuggestions = manager.optimizeSpendingHabits({
  focusAreas: ['外卖', '打车', '订阅服务'],
  savingsGoal: 1000.00
});

// 长期规划
const longTermPlan = manager.createSavingsPlan({
  goalAmount: 50000.00,
  timeframe: '2years',
  monthlyContribution: 2000.00,
  investmentReturn: 0.05  // 5%年化收益
});
```

## 高级功能

### 数据导入导出
```javascript
// 导入银行对账单
await manager.importBankStatement('bank-statement.csv', {
  format: 'csv',
  bank: '招商银行',
  autoCategorize: true
});

// 导出消费数据
const exportData = await manager.exportData({
  format: 'json',  // json, csv, excel
  includeAllFields: true,
  dateRange: 'lastYear'
});

// 备份数据
await manager.backupData('./backups/money-data-backup.json');

// 恢复数据
await manager.restoreData('./backups/money-data-backup.json');
```

### 报表生成
```javascript
// 生成月度报表
const monthlyReport = await manager.generateReport({
  type: 'monthly',
  month: '2026-03',
  include: ['summary', 'charts', 'comparisons', 'recommendations'],
  outputFormat: 'html'  // html, pdf, json
});

// 生成年度总结
const annualSummary = await manager.generateAnnualSummary(2026, {
  highlightAchievements: true,
  setNextYearGoals: true,
  includeVisualizations: true
});

// 生成储蓄进度报告
const savingsReport = manager.generateSavingsProgressReport({
  goalId: 'house-downpayment',
  includeMilestones: true,
  showProjections: true
});
```

### 提醒和通知
```javascript
// 设置预算提醒
manager.setBudgetAlert({
  category: '餐饮',
  threshold: 0.8,  // 达到预算80%时提醒
  notificationMethod: 'email',  // email, push, sms
  message: '餐饮预算即将用完'
});

// 设置定期消费提醒
manager.setRecurringAlert({
  type: 'weeklyReview',
  dayOfWeek: 'sunday',
  time: '20:00',
  enabled: true
});

// 设置目标提醒
manager.setGoalReminder({
  goalId: 'vacation-fund',
  milestoneAmount: 5000.00,
  notification: '恭喜！已达到储蓄里程碑：5000元'
});
```

## 集成功能

### 与日历集成
```javascript
// 同步账单日
await manager.syncBillDatesWithCalendar({
  calendarId: 'primary',
  createEvents: true,
  reminders: ['1dayBefore', '3daysBefore']
});

// 安排财务审查
manager.scheduleFinancialReview({
  frequency: 'monthly',
  dayOfMonth: 25,
  duration: '1hour'
});
```

### 与银行API集成（示例）
```javascript
// 连接银行账户（需要银行API支持）
const bankConnection = await manager.connectBankAccount({
  bank: '招商银行',
  accountType: 'checking',
  readOnly: true  // 只读权限
});

// 自动同步交易
await manager.syncTransactions({
  connectionId: bankConnection.id,
  autoCategorize: true,
  period: 'last30days'
});
```

## 配置选项

在 `money-config.json` 中配置：

```json
{
  "currency": "CNY",
  "decimalPlaces": 2,
  "defaultCategories": [
    "餐饮", "交通", "住房", "购物", "娱乐",
    "医疗", "教育", "投资", "其他"
  ],
  "budgetCycle": "monthly",
  "savingsGoal": {
    "enabled": true,
    "targetAmount": 50000,
    "timeframe": "12months"
  },
  "notifications": {
    "budgetAlerts": true,
    "weeklyReports": true,
    "goalReminders": true
  },
  "dataRetention": {
    "keepRecordsForMonths": 36,
    "autoBackup": true,
    "backupIntervalDays": 7
  }
}
```

## 最佳实践

### 1. 持续跟踪
- 每天记录消费
- 每周审查预算
- 每月分析趋势
- 每季度调整目标

### 2. 分类细化
- 使用子分类更精确跟踪
- 定期审查和调整分类
- 合并相似类别
- 删除不用的类别

### 3. 目标设定
- 设定SMART目标（具体、可衡量、可实现、相关、有时限）
- 分解大目标为小里程碑
- 定期评估进度
- 灵活调整目标

### 4. 习惯养成
- 建立消费记录习惯
- 定期审查财务状况
- 学习财务知识
- 分享经验和建议

## 故障排除

### 常见问题
1. **数据不同步**
   - 检查网络连接
   - 验证API密钥
   - 查看日志文件

2. **分类不准确**
   - 训练分类器
   - 手动调整规则
   - 添加自定义分类

3. **预算超支**
   - 分析超支原因
   - 调整预算分配
   - 设置更严格的提醒

4. **报告生成失败**
   - 检查数据完整性
   - 验证模板文件
   - 查看系统资源

## 安全注意事项

### 数据安全
- 本地加密存储敏感数据
- 使用安全连接传输数据
- 定期备份重要数据
- 实施访问控制

### 隐私保护
- 不收集不必要的个人信息
- 匿名化分析数据
- 提供数据删除选项
- 遵守隐私法规

## 扩展开发

### 添加新功能
```javascript
// 自定义分析模块
class CustomAnalysisModule {
  constructor(moneyManager) {
    this.manager = moneyManager;
  }
  
  async analyzeSpendingPatterns(options) {
    // 实现自定义分析逻辑
  }
  
  async generateCustomReport(data) {
    // 生成自定义报告
  }
}

// 注册扩展
manager.registerExtension(new CustomAnalysisModule(manager));
```

### 集成第三方服务
```javascript
// 集成投资平台
manager.integrateInvestmentPlatform({
  platform: '蚂蚁财富',
  apiKey: process.env.ANT_WEALTH_API_KEY,
  syncPortfolio: true
});

// 集成信用卡管理
manager.integrateCreditCardManager({
  cards: ['招商银行信用卡', '建设银行信用卡'],
  syncStatements: true
});
```

---

*Save Money 工具旨在帮助您更好地管理财务，实现储蓄目标。记住，财务健康是一个持续的过程，需要定期关注和调整。*