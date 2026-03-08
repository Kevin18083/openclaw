/**
 * Save Money - 智能财务管理核心模块
 * 
 * 功能：消费跟踪、预算管理、支出分析、省钱建议
 */

const fs = require('fs');
const path = require('path');

class MoneyManager {
  constructor(dataPath = './money-data.json') {
    this.dataPath = dataPath;
    this.data = this.loadData();
  }

  /**
   * 加载数据
   */
  loadData() {
    if (fs.existsSync(this.dataPath)) {
      return JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
    }
    return {
      expenses: [],
      budgets: {},
      goals: [],
      settings: {
        currency: 'CNY',
        categories: ['餐饮', '交通', '住房', '购物', '娱乐', '医疗', '教育', '其他']
      }
    };
  }

  /**
   * 保存数据
   */
  saveData() {
    fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  /**
   * 添加消费记录
   */
  addExpense(expense) {
    const record = {
      id: Date.now().toString(),
      amount: parseFloat(expense.amount),
      category: expense.category || '其他',
      description: expense.description || '',
      date: expense.date || new Date().toISOString().split('T')[0],
      paymentMethod: expense.paymentMethod || '现金',
      tags: expense.tags || [],
      createdAt: new Date().toISOString()
    };

    this.data.expenses.push(record);
    this.saveData();
    return record.id;
  }

  /**
   * 获取消费记录
   */
  getExpenses(filters = {}) {
    let expenses = this.data.expenses;

    if (filters.startDate) {
      expenses = expenses.filter(e => e.date >= filters.startDate);
    }
    if (filters.endDate) {
      expenses = expenses.filter(e => e.date <= filters.endDate);
    }
    if (filters.category) {
      expenses = expenses.filter(e => e.category === filters.category);
    }
    if (filters.minAmount) {
      expenses = expenses.filter(e => e.amount >= filters.minAmount);
    }
    if (filters.maxAmount) {
      expenses = expenses.filter(e => e.amount <= filters.maxAmount);
    }

    return expenses;
  }

  /**
   * 设置分类预算
   */
  setCategoryBudget(category, limit) {
    this.data.budgets[category] = {
      limit: parseFloat(limit),
      spent: this.calculateCategorySpending(category),
      remaining: limit - this.calculateCategorySpending(category)
    };
    this.saveData();
    return this.data.budgets[category];
  }

  /**
   * 计算分类支出
   */
  calculateCategorySpending(category) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return this.data.expenses
      .filter(e => e.category === category && e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + e.amount, 0);
  }

  /**
   * 获取月度分析
   */
  getMonthlyAnalysis(month) {
    const monthExpenses = this.data.expenses.filter(e => e.date.startsWith(month));
    
    const byCategory = {};
    monthExpenses.forEach(e => {
      if (!byCategory[e.category]) {
        byCategory[e.category] = 0;
      }
      byCategory[e.category] += e.amount;
    });

    const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const average = monthExpenses.length > 0 ? total / monthExpenses.length : 0;

    return {
      month,
      total,
      average,
      count: monthExpenses.length,
      byCategory,
      topCategory: Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]
    };
  }

  /**
   * 获取省钱建议
   */
  getSaveSuggestions() {
    const suggestions = [];
    const currentMonth = new Date().toISOString().slice(0, 7);
    const analysis = this.getMonthlyAnalysis(currentMonth);

    // 分析各大类支出
    for (const [category, amount] of Object.entries(analysis.byCategory)) {
      const percentage = (amount / analysis.total * 100).toFixed(1);
      
      // 如果某类支出超过 30%，给出建议
      if (parseFloat(percentage) > 30) {
        suggestions.push({
          type: 'high_spending',
          category,
          amount,
          percentage,
          suggestion: `${category}支出占总支出的${percentage}%，建议控制在 25% 以内`,
          potentialSavings: (amount * 0.2).toFixed(2)
        });
      }

      // 检查是否超预算
      if (this.data.budgets[category] && amount > this.data.budgets[category].limit) {
        const overAmount = amount - this.data.budgets[category].limit;
        suggestions.push({
          type: 'over_budget',
          category,
          amount,
          budget: this.data.budgets[category].limit,
          overAmount: overAmount.toFixed(2),
          suggestion: `${category}已超预算${overAmount.toFixed(2)}元，建议减少非必要支出`
        });
      }
    }

    // 消费频率建议
    const dailyExpenses = this.getExpenses({ startDate: currentMonth + '-01', endDate: currentMonth + '-31' });
    const avgDaily = dailyExpenses.length / 30;
    if (avgDaily > 3) {
      suggestions.push({
        type: 'frequency',
        avgDaily: avgDaily.toFixed(1),
        suggestion: `平均每天消费${avgDaily.toFixed(1)}次，建议减少冲动消费，改为计划性购物`
      });
    }

    return suggestions;
  }

  /**
   * 设置储蓄目标
   */
  setSavingsGoal(goal) {
    const goalRecord = {
      id: Date.now().toString(),
      name: goal.name,
      targetAmount: parseFloat(goal.targetAmount),
      currentAmount: goal.currentAmount || 0,
      deadline: goal.deadline,
      monthlyContribution: goal.monthlyContribution,
      createdAt: new Date().toISOString()
    };

    this.data.goals.push(goalRecord);
    this.saveData();
    return goalRecord.id;
  }

  /**
   * 更新储蓄进度
   */
  updateGoalProgress(goalId, amount) {
    const goal = this.data.goals.find(g => g.id === goalId);
    if (goal) {
      goal.currentAmount += parseFloat(amount);
      goal.lastUpdated = new Date().toISOString();
      this.saveData();
      return goal;
    }
    return null;
  }

  /**
   * 生成消费趋势报告
   */
  getSpendingTrend(months = 6) {
    const trends = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      const analysis = this.getMonthlyAnalysis(monthStr);
      
      trends.push({
        month: monthStr,
        total: analysis.total,
        count: analysis.count
      });
    }

    return trends;
  }

  /**
   * 检测异常消费
   */
  detectAnomalies() {
    const anomalies = [];
    const currentMonth = new Date().toISOString().slice(0, 7);
    const expenses = this.getExpenses({ startDate: currentMonth + '-01' });

    // 计算平均消费
    const avgAmount = expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length;

    // 检测大额消费（超过平均 3 倍）
    expenses.forEach(e => {
      if (e.amount > avgAmount * 3) {
        anomalies.push({
          type: 'large_expense',
          expense: e,
          reason: `消费金额${e.amount}元，是平均值${avgAmount.toFixed(2)}元的${(e.amount/avgAmount).toFixed(1)}倍`
        });
      }
    });

    return anomalies;
  }
}

module.exports = { MoneyManager };
