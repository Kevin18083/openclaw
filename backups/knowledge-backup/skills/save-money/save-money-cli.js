#!/usr/bin/env node

/**
 * Save Money CLI - 命令行界面
 * 
 * 使用示例：
 * node save-money-cli.js add --amount 50 --category 餐饮 --description 午餐
 * node save-money-cli.js list --month 2026-03
 * node save-money-cli.js budget --category 餐饮 --limit 1000
 * node save-money-cli.js analyze --month 2026-03
 * node save-money-cli.js suggestions
 */

const { MoneyManager } = require('./money-core.js');

const manager = new MoneyManager();

// 解析命令行参数
const args = process.argv.slice(2);
const command = args[0];

function parseArgs(argList) {
  const parsed = {};
  for (let i = 0; i < argList.length; i++) {
    if (argList[i].startsWith('--')) {
      const key = argList[i].slice(2);
      const value = argList[i + 1];
      parsed[key] = value;
      i++;
    }
  }
  return parsed;
}

function printJSON(data) {
  console.log(JSON.stringify(data, null, 2));
}

function printTable(data) {
  if (data.length === 0) {
    console.log('暂无数据');
    return;
  }

  const headers = Object.keys(data[0]);
  const widths = headers.map(h => Math.max(h.length, ...data.map(r => String(r[h]).length)));
  
  // 打印表头
  console.log(headers.map((h, i) => h.padEnd(widths[i])).join(' | '));
  console.log(headers.map((h, i) => '-'.repeat(widths[i])).join('-|-'));
  
  // 打印数据
  data.forEach(row => {
    console.log(headers.map((h, i) => String(row[h]).padEnd(widths[i])).join(' | '));
  });
}

// 命令处理
switch (command) {
  case 'add': {
    // 添加消费
    const params = parseArgs(args);
    const id = manager.addExpense({
      amount: params.amount,
      category: params.category || '其他',
      description: params.description || '',
      date: params.date
    });
    console.log(`✅ 已添加消费记录，ID: ${id}`);
    break;
  }

  case 'list': {
    // 列出消费
    const params = parseArgs(args);
    const expenses = manager.getExpenses({
      startDate: params.month ? params.month + '-01' : undefined,
      endDate: params.month ? params.month + '-31' : undefined,
      category: params.category
    });
    console.log(`\n📊 消费记录 (${expenses.length}条):\n`);
    printTable(expenses.map(e => ({
      date: e.date,
      category: e.category,
      amount: `¥${e.amount.toFixed(2)}`,
      description: e.description
    })));
    break;
  }

  case 'budget': {
    // 设置预算
    const params = parseArgs(args);
    const budget = manager.setCategoryBudget(params.category, params.limit);
    console.log(`\n💰 预算设置成功:`);
    console.log(`类别：${params.category}`);
    console.log(`预算：¥${budget.limit.toFixed(2)}`);
    console.log(`已用：¥${budget.spent.toFixed(2)}`);
    console.log(`剩余：¥${budget.remaining.toFixed(2)}`);
    break;
  }

  case 'analyze': {
    // 月度分析
    const params = parseArgs(args);
    const month = params.month || new Date().toISOString().slice(0, 7);
    const analysis = manager.getMonthlyAnalysis(month);
    
    console.log(`\n📈 ${month}月度分析:`);
    console.log(`总支出：¥${analysis.total.toFixed(2)}`);
    console.log(`平均每天：¥${analysis.average.toFixed(2)}`);
    console.log(`消费次数：${analysis.count}次`);
    console.log(`\n分类统计:`);
    Object.entries(analysis.byCategory).forEach(([cat, amount]) => {
      const percentage = (amount / analysis.total * 100).toFixed(1);
      console.log(`  ${cat}: ¥${amount.toFixed(2)} (${percentage}%)`);
    });
    if (analysis.topCategory) {
      console.log(`\n最大支出：${analysis.topCategory[0]} (¥${analysis.topCategory[1].toFixed(2)})`);
    }
    break;
  }

  case 'suggestions': {
    // 省钱建议
    const suggestions = manager.getSaveSuggestions();
    
    console.log('\n💡 省钱建议:\n');
    if (suggestions.length === 0) {
      console.log('暂无建议，继续保持！');
    } else {
      suggestions.forEach((s, i) => {
        console.log(`${i + 1}. ${s.suggestion}`);
        if (s.potentialSavings) {
          console.log(`   预计可省：¥${s.potentialSavings}`);
        }
        console.log('');
      });
    }
    break;
  }

  case 'trend': {
    // 消费趋势
    const params = parseArgs(args);
    const months = parseInt(params.months) || 6;
    const trend = manager.getSpendingTrend(months);
    
    console.log(`\n📊 消费趋势 (${months}个月):\n`);
    printTable(trend.map(t => ({
      month: t.month,
      total: `¥${t.total.toFixed(2)}`,
      count: t.count
    })));
    break;
  }

  case 'goal': {
    // 储蓄目标
    const params = parseArgs(args);
    if (params.add) {
      const id = manager.setSavingsGoal({
        name: params.name,
        targetAmount: params.target,
        currentAmount: params.current || 0,
        deadline: params.deadline,
        monthlyContribution: params.monthly
      });
      console.log(`✅ 储蓄目标已创建，ID: ${id}`);
    } else if (params.update) {
      const goal = manager.updateGoalProgress(params.id, params.amount);
      if (goal) {
        console.log(`✅ 已更新进度：${goal.name}`);
        console.log(`当前：¥${goal.currentAmount.toFixed(2)} / ¥${goal.targetAmount.toFixed(2)}`);
        console.log(`进度：${(goal.currentAmount / goal.targetAmount * 100).toFixed(1)}%`);
      }
    } else {
      console.log('\n🎯 储蓄目标:\n');
      if (manager.data.goals.length === 0) {
        console.log('暂无目标');
      } else {
        manager.data.goals.forEach(g => {
          const percentage = (g.currentAmount / g.targetAmount * 100).toFixed(1);
          console.log(`${g.name}: ¥${g.currentAmount.toFixed(2)} / ¥${g.targetAmount.toFixed(2)} (${percentage}%)`);
        });
      }
    }
    break;
  }

  case 'anomalies': {
    // 异常检测
    const anomalies = manager.detectAnomalies();
    
    console.log('\n⚠️  异常消费检测:\n');
    if (anomalies.length === 0) {
      console.log('未发现异常消费');
    } else {
      anomalies.forEach((a, i) => {
        console.log(`${i + 1}. ${a.reason}`);
        console.log(`   ${a.expense.category} - ${a.expense.description} - ¥${a.expense.amount}`);
        console.log('');
      });
    }
    break;
  }

  case 'help':
  default:
    console.log(`
💰 Save Money - 智能财务管理工具

用法：node save-money-cli.js <命令> [参数]

命令:
  add         添加消费记录
              --amount 金额 --category 类别 --description 描述 --date 日期
              
  list        列出消费记录
              --month 月份 (YYYY-MM) --category 类别
              
  budget      设置/查看预算
              --category 类别 --limit 限额
              
  analyze     月度分析
              --month 月份 (YYYY-MM)
              
  suggestions 获取省钱建议
  
  trend       消费趋势
              --months 月数 (默认 6)
              
  goal        储蓄目标管理
              --add --name 名称 --target 目标金额 --monthly 每月存入
              --update --id 目标 ID --amount 存入金额
              
  anomalies   异常消费检测
  
  help        显示帮助信息

示例:
  node save-money-cli.js add --amount 50 --category 餐饮 --description 午餐
  node save-money-cli.js budget --category 餐饮 --limit 1000
  node save-money-cli.js analyze --month 2026-03
  node save-money-cli.js suggestions
`);
}
