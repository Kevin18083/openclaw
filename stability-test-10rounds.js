/**
 * 系统稳定性测试 - 10 轮渐进难度版
 * 目标：确保系统稳定运行，无宕机、无延迟、无卡顿
 * 每轮增加难度，验证系统可靠性
 */

const fs = require('fs');
const path = require('path');

// 测试配置
const CONFIG = {
  totalRounds: 10,
  workspace: 'C:\\Users\\17589\\.openclaw\\workspace',
  logFile: 'stability-test-log.json',
  reportFile: 'STABILITY-TEST-REPORT.md'
};

// 10 轮测试定义（难度递增）
const testRounds = [
  {
    round: 1,
    name: '基础文件读写',
    difficulty: 1,
    task: 'file_io_basic',
    description: '测试基础文件读写能力',
    expectedTime: 100
  },
  {
    round: 2,
    name: 'JSON 数据处理',
    difficulty: 2,
    task: 'json_processing',
    description: '测试 JSON 数据解析和生成',
    expectedTime: 150
  },
  {
    round: 3,
    name: '多文件操作',
    difficulty: 3,
    task: 'multi_file_operations',
    description: '测试同时操作多个文件',
    expectedTime: 200
  },
  {
    round: 4,
    name: '目录遍历和统计',
    difficulty: 3,
    task: 'directory_traversal',
    description: '测试目录遍历和文件统计',
    expectedTime: 250
  },
  {
    round: 5,
    name: '大数据量处理',
    difficulty: 4,
    task: 'large_data_processing',
    description: '测试处理大数据量',
    expectedTime: 300
  },
  {
    round: 6,
    name: '并发文件操作',
    difficulty: 5,
    task: 'concurrent_operations',
    description: '测试并发文件操作',
    expectedTime: 400
  },
  {
    round: 7,
    name: '错误处理和恢复',
    difficulty: 6,
    task: 'error_handling',
    description: '测试错误处理和系统恢复',
    expectedTime: 350
  },
  {
    round: 8,
    name: '内存密集操作',
    difficulty: 7,
    task: 'memory_intensive',
    description: '测试内存密集操作',
    expectedTime: 500
  },
  {
    round: 9,
    name: '复杂数据处理',
    difficulty: 8,
    task: 'complex_data_processing',
    description: '测试复杂数据结构处理',
    expectedTime: 600
  },
  {
    round: 10,
    name: '综合压力测试',
    difficulty: 9,
    task: 'comprehensive_stress',
    description: '综合压力测试',
    expectedTime: 800
  }
];

// 测试结果记录
const results = {
  startTime: new Date().toISOString(),
  rounds: [],
  summary: {}
};

// 工具函数
function log(message) {
  const timestamp = new Date().toLocaleString('zh-CN');
  console.log(`[${timestamp}] ${message}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 测试任务实现
const tasks = {
  // 任务 1: 基础文件读写
  file_io_basic: async () => {
    const testFile = path.join(CONFIG.workspace, 'test-io-temp.txt');
    const testData = '稳定性测试数据 - ' + Date.now();
    
    // 写入
    fs.writeFileSync(testFile, testData, 'utf-8');
    
    // 读取
    const content = fs.readFileSync(testFile, 'utf-8');
    
    // 清理
    fs.unlinkSync(testFile);
    
    return content === testData;
  },
  
  // 任务 2: JSON 数据处理
  json_processing: async () => {
    const testData = {
      timestamp: Date.now(),
      data: Array(100).fill(0).map((_, i) => ({
        id: i,
        value: Math.random(),
        name: `Item_${i}`
      }))
    };
    
    // 序列化
    const json = JSON.stringify(testData, null, 2);
    
    // 反序列化
    const parsed = JSON.parse(json);
    
    return parsed.data.length === 100;
  },
  
  // 任务 3: 多文件操作
  multi_file_operations: async () => {
    const testFiles = [];
    const fileCount = 10;
    
    // 创建多个文件
    for (let i = 0; i < fileCount; i++) {
      const filePath = path.join(CONFIG.workspace, `test-multi-${i}.tmp`);
      fs.writeFileSync(filePath, `File ${i} content`, 'utf-8');
      testFiles.push(filePath);
    }
    
    // 读取验证
    let success = true;
    for (let i = 0; i < fileCount; i++) {
      const content = fs.readFileSync(testFiles[i], 'utf-8');
      if (content !== `File ${i} content`) {
        success = false;
        break;
      }
    }
    
    // 清理
    testFiles.forEach(f => {
      try { fs.unlinkSync(f); } catch(e) {}
    });
    
    return success;
  },
  
  // 任务 4: 目录遍历和统计
  directory_traversal: async () => {
    const files = fs.readdirSync(CONFIG.workspace);
    const stats = {
      total: files.length,
      md: files.filter(f => f.endsWith('.md')).length,
      js: files.filter(f => f.endsWith('.js')).length,
      json: files.filter(f => f.endsWith('.json')).length
    };
    
    return stats.total > 0;
  },
  
  // 任务 5: 大数据量处理
  large_data_processing: async () => {
    const dataSize = 10000;
    const data = Array(dataSize).fill(0).map((_, i) => ({
      id: i,
      timestamp: Date.now(),
      value: Math.random() * 1000,
      tags: [`tag_${i % 10}`, `category_${i % 5}`]
    }));
    
    // 处理
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    const avg = sum / dataSize;
    
    return avg > 0 && avg < 1000;
  },
  
  // 任务 6: 并发文件操作
  concurrent_operations: async () => {
    const concurrentCount = 5;
    const promises = [];
    
    for (let i = 0; i < concurrentCount; i++) {
      const promise = (async () => {
        const testFile = path.join(CONFIG.workspace, `test-concurrent-${i}-${Date.now()}.tmp`);
        fs.writeFileSync(testFile, `Concurrent ${i}`, 'utf-8');
        await sleep(10);
        const content = fs.readFileSync(testFile, 'utf-8');
        fs.unlinkSync(testFile);
        return content === `Concurrent ${i}`;
      })();
      promises.push(promise);
    }
    
    const results = await Promise.all(promises);
    return results.every(r => r === true);
  },
  
  // 任务 7: 错误处理和恢复
  error_handling: async () => {
    let errorCaught = false;
    let systemRecovery = false;
    
    try {
      // 故意触发错误
      fs.readFileSync('non-existent-file-12345.txt', 'utf-8');
    } catch (e) {
      errorCaught = true;
    }
    
    // 验证系统仍然正常工作
    try {
      const testFile = path.join(CONFIG.workspace, 'test-recovery.tmp');
      fs.writeFileSync(testFile, 'recovery test', 'utf-8');
      fs.unlinkSync(testFile);
      systemRecovery = true;
    } catch (e) {
      systemRecovery = false;
    }
    
    return errorCaught && systemRecovery;
  },
  
  // 任务 8: 内存密集操作
  memory_intensive: async () => {
    const arraySize = 100000;
    const arrays = [];
    
    // 创建大数组
    for (let i = 0; i < 10; i++) {
      arrays.push(new Array(arraySize).fill(Math.random()));
    }
    
    // 处理
    let sum = 0;
    arrays.forEach(arr => {
      sum += arr.reduce((a, b) => a + b, 0);
    });
    
    // 清理
    arrays.length = 0;
    
    return sum > 0;
  },
  
  // 任务 9: 复杂数据处理
  complex_data_processing: async () => {
    // 创建复杂数据结构
    const complexData = {
      users: Array(1000).fill(0).map((_, i) => ({
        id: i,
        name: `User_${i}`,
        profile: {
          age: 20 + (i % 50),
          city: ['北京', '上海', '广州', '深圳'][i % 4],
          skills: ['JS', 'Python', 'Java', 'Go'].slice(0, 1 + (i % 4))
        },
        orders: Array(10).fill(0).map((_, j) => ({
          orderId: `${i}-${j}`,
          amount: Math.random() * 1000,
          status: ['pending', 'completed', 'cancelled'][j % 3]
        }))
      }))
    };
    
    // 复杂查询
    const result = {
      totalUsers: complexData.users.length,
      beijingUsers: complexData.users.filter(u => u.profile.city === '北京').length,
      avgOrderAmount: complexData.users.reduce((sum, u) => {
        return sum + u.orders.reduce((oSum, o) => oSum + o.amount, 0);
      }, 0) / complexData.users.length / 10
    };
    
    return result.totalUsers === 1000 && result.beijingUsers > 0;
  },
  
  // 任务 10: 综合压力测试
  comprehensive_stress: async () => {
    const tasks = [];
    
    // 混合多种操作
    for (let i = 0; i < 20; i++) {
      tasks.push((async () => {
        // 文件操作
        const testFile = path.join(CONFIG.workspace, `test-stress-${i}.tmp`);
        fs.writeFileSync(testFile, JSON.stringify({ id: i, data: Array(100).fill(i) }), 'utf-8');
        
        // 数据处理
        const data = JSON.parse(fs.readFileSync(testFile, 'utf-8'));
        const sum = data.data.reduce((a, b) => a + b, 0);
        
        // 清理
        fs.unlinkSync(testFile);
        
        return sum === i * 100;
      })());
    }
    
    const results = await Promise.all(tasks);
    return results.every(r => r === true);
  }
};

// 执行单轮测试
async function runTestRound(roundConfig) {
  const { round, name, difficulty, task, description, expectedTime } = roundConfig;
  
  log(`\n【第 ${round} 轮】${name}`);
  log(`难度：${'★'.repeat(difficulty)}${'☆'.repeat(9-difficulty)} (${difficulty}/9)`);
  log(`任务：${description}`);
  log(`预期时间：<${expectedTime}ms`);
  log('-'.repeat(60));
  
  const startTime = Date.now();
  let success = false;
  let error = null;
  
  try {
    const taskFn = tasks[task];
    if (!taskFn) {
      throw new Error(`未知任务：${task}`);
    }
    
    success = await taskFn();
  } catch (e) {
    error = e.message;
    success = false;
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const status = success ? '✅ 通过' : '❌ 失败';
  const timeStatus = duration < expectedTime ? '正常' : '⚠️ 超时';
  
  log(`${status} | 耗时：${duration}ms (${timeStatus})`);
  
  if (error) {
    log(`错误：${error}`);
  }
  
  const result = {
    round,
    name,
    difficulty,
    success,
    duration,
    expectedTime,
    error,
    timestamp: new Date().toISOString()
  };
  
  results.rounds.push(result);
  
  return result;
}

// 生成测试报告
function generateReport() {
  const totalRounds = results.rounds.length;
  const passedRounds = results.rounds.filter(r => r.success).length;
  const failedRounds = totalRounds - passedRounds;
  const avgDuration = results.rounds.reduce((sum, r) => sum + r.duration, 0) / totalRounds;
  const maxDuration = Math.max(...results.rounds.map(r => r.duration));
  const minDuration = Math.min(...results.rounds.map(r => r.duration));
  
  const report = `# 系统稳定性测试报告

**生成时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
**测试轮数**: ${totalRounds}
**总体状态**: ${passedRounds === totalRounds ? '✅ 全部通过' : '⚠️ 有失败'}

## 测试结果汇总

| 指标 | 数值 | 状态 |
|------|------|------|
| 总轮数 | ${totalRounds} | - |
| 通过 | ${passedRounds} | ${passedRounds === totalRounds ? '✅' : '⚠️'} |
| 失败 | ${failedRounds} | ${failedRounds === 0 ? '✅' : '❌'} |
| 通过率 | ${((passedRounds / totalRounds) * 100).toFixed(1)}% | ${passedRounds === totalRounds ? '✅' : '⚠️'} |
| 平均耗时 | ${avgDuration.toFixed(0)}ms | ${avgDuration < 500 ? '✅' : '⚠️'} |
| 最大耗时 | ${maxDuration}ms | - |
| 最小耗时 | ${minDuration}ms | - |

## 详细结果

| 轮次 | 名称 | 难度 | 状态 | 耗时 | 预期 |
|------|------|------|------|------|------|
${results.rounds.map(r => `| ${r.round} | ${r.name} | ${r.difficulty}/9 | ${r.success ? '✅' : '❌'} | ${r.duration}ms | <${r.expectedTime}ms |`).join('\n')}

## 性能分析

### 耗时分布
- **<200ms**: ${results.rounds.filter(r => r.duration < 200).length} 轮
- **200-500ms**: ${results.rounds.filter(r => r.duration >= 200 && r.duration < 500).length} 轮
- **500-1000ms**: ${results.rounds.filter(r => r.duration >= 500 && r.duration < 1000).length} 轮
- **>1000ms**: ${results.rounds.filter(r => r.duration >= 1000).length} 轮

### 难度与性能关系
${results.rounds.map(r => `- 难度${r.difficulty}: ${r.duration}ms (${r.success ? '通过' : '失败'})`).join('\n')}

## 问题和建议

${failedRounds > 0 ? `
### ❌ 失败轮次
${results.rounds.filter(r => !r.success).map(r => `
**第${r.round}轮**: ${r.name}
- 错误：${r.error}
- 建议：${getSuggestion(r.name, r.error)}`
).join('\n')}
` : `
### ✅ 所有测试通过！
系统运行稳定，无发现问题。
`}

### 优化建议
${generateOptimizationSuggestions()}

## 结论

${passedRounds === totalRounds && avgDuration < 500 ? `
**✅ 系统稳定性优秀！**

- 所有测试通过
- 平均响应时间优秀
- 无宕机风险
- 可以安心使用
` : passedRounds === totalRounds ? `
**✅ 系统稳定性良好！**

- 所有测试通过
- 平均响应时间可接受
- 建议关注高难度场景性能
` : `
**⚠️ 系统存在稳定性问题！**

- ${failedRounds} 轮测试失败
- 需要立即修复
- 建议排查问题后重新测试
`}

---
*测试开始时间*: ${results.startTime}
*测试结束时间*: ${new Date().toISOString()}
*维护者：扎克*
`;

  const reportPath = path.join(CONFIG.workspace, CONFIG.reportFile);
  fs.writeFileSync(reportPath, report, 'utf-8');
  log(`\n📄 报告已保存：${reportPath}`);
  
  // 保存 JSON 结果
  const jsonPath = path.join(CONFIG.workspace, CONFIG.logFile);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8');
  log(`💾 数据已保存：${jsonPath}`);
  
  return report;
}

// 生成优化建议
function generateOptimizationSuggestions() {
  const suggestions = [];
  
  const slowRounds = results.rounds.filter(r => r.duration > 500);
  if (slowRounds.length > 0) {
    suggestions.push(`- ${slowRounds.length} 轮测试耗时>500ms，建议优化性能`);
  }
  
  const failedRounds = results.rounds.filter(r => !r.success);
  if (failedRounds.length > 0) {
    suggestions.push(`- ${failedRounds.length} 轮测试失败，需要立即修复`);
  }
  
  if (results.rounds.every(r => r.success)) {
    suggestions.push('- 系统运行稳定，继续保持');
    suggestions.push('- 定期运行稳定性测试');
    suggestions.push('- 监控系统资源使用');
  }
  
  return suggestions.map(s => s).join('\n') || '- 无';
}

// 获取建议
function getSuggestion(name, error) {
  if (error.includes('non-existent')) return '错误处理正常，无需修复';
  if (error.includes('permission')) return '检查文件权限';
  if (error.includes('memory')) return '优化内存使用或增加限制';
  return '需要进一步分析';
}

// 主函数
async function main() {
  log('='.repeat(80));
  log('系统稳定性测试 - 10 轮渐进难度版');
  log('='.repeat(80));
  log(`开始时间：${new Date().toLocaleString('zh-CN')}`);
  log(`工作区：${CONFIG.workspace}`);
  log('');
  
  // 执行所有轮次
  for (let i = 0; i < testRounds.length; i++) {
    await runTestRound(testRounds[i]);
    await sleep(50); // 轮次间隔
  }
  
  // 生成报告
  log('');
  log('='.repeat(80));
  log('生成测试报告...');
  log('='.repeat(80));
  generateReport();
  
  // 总结
  const passedRounds = results.rounds.filter(r => r.success).length;
  log('');
  log('='.repeat(80));
  log('测试完成！');
  log(`通过：${passedRounds}/${results.rounds.length}`);
  log(`状态：${passedRounds === results.rounds.length ? '✅ 全部通过' : '⚠️ 有失败'}`);
  log('='.repeat(80));
}

// 运行测试
main().catch(e => {
  log(`❌ 测试执行失败：${e.message}`);
  console.error(e);
});
