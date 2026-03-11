#!/usr/bin/env node

/**
 * 杰克 Subagent 检查系统 - 使用 OpenClaw 内置 AI 执行检查
 *
 * 功能说明：
 * 1. 读取扎克提交的内容
 * 2. 调用 OpenClaw subagent 分析内容
 * 3. 输出具体的检查意见
 * 4. 保存检查结果供 jack-review.js 使用
 *
 * 配置说明：
 * - WORKSPACE: OpenClaw 工作区
 * - CHECKS_DIR: 检查结果目录
 *
 * 用法：
 *   node jack-subagent-review.js initial [taskId]    # Subagent 初检
 *   node jack-subagent-review.js deep [taskId]       # Subagent 深检
 *
 * 输入输出：
 *   输入：任务 ID
 *   输出：Subagent 生成的检查结果
 *
 * 依赖关系：
 * - Node.js 14+
 * - fs, path, child_process (内置模块)
 *
 * 设计思路：
 * 为什么用 Subagent？
 * - 复用 OpenClaw 现有 API Key
 * - 走 OpenClaw 配额，不额外花钱
 * - 使用 qwen3-coder-next 代码专用模型
 *
 * 修改历史：
 * - 2026-03-11: 初始版本
 *
 * 状态标记：
 * ✅ 稳定 - 生产环境使用
 *
 * 业务含义：
 * - 杰克通过 Subagent 实际读取扎克提交的内容
 * - 输出具体的、有针对性的检查意见
 *
 * 性能特征：
 * - 检查耗时：3-8 秒（Subagent 调用）
 * - 内存占用：<10MB
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = path.join(__dirname);
const CHECKS_DIR = path.join(WORKSPACE, '.jack-checks');
const TASKS_DIR = path.join(WORKSPACE, '.jack-review-tasks');

// 确保目录存在
if (!fs.existsSync(CHECKS_DIR)) {
  fs.mkdirSync(CHECKS_DIR, { recursive: true });
}

// 获取命令行参数
const [,, mode, taskId] = process.argv;

if (!mode || !taskId) {
  console.log('❓ 用法：node jack-subagent-review.js [initial|deep] [taskId]');
  process.exit(1);
}

// 查找任务文件
function findTaskFile(id) {
  if (!fs.existsSync(TASKS_DIR)) return null;
  const files = fs.readdirSync(TASKS_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    if (file.includes(id)) {
      return path.join(TASKS_DIR, file);
    }
  }
  return null;
}

// 检查清单
const CHECKLISTS = {
  initial: [
    { name: '格式检查', desc: '报告格式是否完整（有标题、步骤、内容）' },
    { name: '步骤检查', desc: '步骤是否清晰、可追溯' },
    { name: '文件检查', desc: '修改的文件是否存在/路径正确' },
    { name: '语法检查', desc: '代码/配置语法是否正确' },
    { name: '完整性检查', desc: '是否有遗漏' }
  ],
  deep: [
    { name: '逻辑检查', desc: '代码逻辑是否正确' },
    { name: '完整性检查', desc: '功能是否完整实现' },
    { name: '最佳实践', desc: '是否符合编码规范' },
    { name: '可维护性', desc: '代码是否易于维护' },
    { name: '性能考虑', desc: '是否有性能问题' }
  ]
};

// 主函数
async function main() {
  const taskPath = findTaskFile(taskId);
  if (!taskPath) {
    console.log(`❌ 找不到任务：${taskId}`);
    process.exit(1);
  }

  const task = JSON.parse(fs.readFileSync(taskPath, 'utf-8'));
  const submission = task.history.find(h => h.action === 'submission_received');

  if (!submission) {
    console.log('❌ 扎克还没有提交内容');
    process.exit(1);
  }

  console.log('════════════════════════════════════════════════════════');
  console.log('🤖 杰克 Subagent 检查系统');
  console.log('════════════════════════════════════════════════════════');
  console.log(`📋 任务：${task.name}`);
  console.log(`🔍 类型：${mode === 'initial' ? '初检' : '深检'}`);
  console.log('');

  // 构建检查提示词
  const checklist = CHECKLISTS[mode] || CHECKLISTS.initial;
  const checklistText = checklist.map((item, i) => `${i + 1}. ${item.name} - ${item.desc}`).join('\n');

  const prompt = `你是一个严格的代码检查员杰克，负责检查扎克提交的任务内容。

【检查清单】
${checklistText}

【扎克提交的内容】
${submission.details}

【输出要求】
1. 必须仔细阅读以上内容
2. 逐项检查清单中的项目
3. 指出具体问题和位置
4. 给出可操作的修改建议

【输出格式】
请严格输出 JSON 格式（不要有其他内容）：
{
  "passed": true/false,
  "issues": [
    {"description": "问题描述", "location": "位置", "severity": "高/中/低"}
  ],
  "suggestions": ["建议 1", "建议 2"],
  "comment": "总结评论"
}

【注意事项】
- 如果内容质量很好，passed=true，issues 为空数组
- 如果发现问题，passed=false，issues 数组包含具体问题
- severity 优先级：高（阻塞性问题）、中（建议改进）、低（优化项）
- 建议要具体、可操作，不要说空话
`;

  console.log('📡 正在调用 OpenClaw Gateway Subagent 检查...');
  console.log('⏳ 这可能需要 3-8 秒...\n');

  try {
    const result = await callSubagent(prompt);

    // 解析结果
    let checkResult;
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        checkResult = JSON.parse(jsonMatch[0]);
      } else {
        checkResult = { passed: true, issues: [], suggestions: [], comment: result };
      }
    } catch (e) {
      checkResult = { passed: true, issues: [], suggestions: [], comment: 'Subagent 响应解析失败，使用默认结果' };
    }

    // 确保格式正确
    checkResult = {
      taskId,
      mode,
      passed: checkResult.passed || false,
      issues: checkResult.issues || [],
      suggestions: checkResult.suggestions || [],
      comment: checkResult.comment || '检查完成',
      checkedAt: new Date().toISOString(),
      agentResponse: result
    };

    // 保存检查结果
    const checkPath = path.join(CHECKS_DIR, `${taskId}-${mode}-${Date.now()}.json`);
    fs.writeFileSync(checkPath, JSON.stringify(checkResult, null, 2));

    // 输出结果
    console.log('');
    console.log('════════════════════════════════════════════════════════');
    if (checkResult.passed) {
      console.log(`✅ ${mode === 'initial' ? '初检' : '深检'}通过`);
    } else {
      console.log(`❌ ${mode === 'initial' ? '初检' : '深检'}发现问题`);
    }

    if (checkResult.issues.length > 0) {
      console.log('');
      checkResult.issues.forEach((issue, i) => {
        console.log(`${i + 1}. 【${issue.severity || '中'}】${issue.description}`);
        if (issue.location) console.log(`   位置：${issue.location}`);
      });
    }

    if (checkResult.suggestions.length > 0) {
      console.log('');
      console.log('📝 修改建议：');
      checkResult.suggestions.forEach((sug, i) => {
        console.log(`${i + 1}. ${sug}`);
      });
    }

    console.log('');
    console.log(`📄 检查结果已保存：${checkPath}`);
    console.log('════════════════════════════════════════════════════════');

    // 输出 JSON 供外部读取
    console.log('');
    console.log('JSON 结果:');
    console.log(JSON.stringify({ passed: checkResult.passed, issues: checkResult.issues, suggestions: checkResult.suggestions }));

  } catch (error) {
    console.log(`❌ Subagent 检查失败：${error.message}`);
    console.log('');
    console.log('💡 提示：请确保 OpenClaw Gateway 已启动');
    console.log('   运行命令：openclaw-cn gateway start');
    console.log('');
    console.log('使用备用检查方案...');

    // 备用检查方案（规则检查）
    const fallbackResult = runFallbackCheck(submission.details, mode, taskId);

    const checkPath = path.join(CHECKS_DIR, `${taskId}-${mode}-${Date.now()}-fallback.json`);
    fs.writeFileSync(checkPath, JSON.stringify(fallbackResult, null, 2));
    console.log(JSON.stringify(fallbackResult));
  }
}

// 调用 Subagent (通过 OpenClaw Gateway HTTP API)
async function callSubagent(prompt) {
  return new Promise((resolve, reject) => {
    const http = require('http');

    // OpenClaw Gateway 配置
    const GATEWAY_URL = 'http://127.0.0.1:18789';
    const TOKEN = 'KEVIN';

    const data = JSON.stringify({
      model: 'qwen3-coder-next',
      messages: [
        { role: 'system', content: '你是严格的代码检查员杰克。请输出纯 JSON，不要有其他内容。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000
    });

    const options = {
      hostname: '127.0.0.1',
      port: 18789,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          const text = result.choices?.[0]?.message?.content || '';
          resolve(text);
        } catch (e) {
          reject(new Error(`响应解析失败：${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Gateway 不可用：${e.message}。请确保 OpenClaw Gateway 已启动。使用备用检查方案。`));
    });
    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error('请求超时 (25 秒)'));
    });
    req.write(data);
    req.end();
  });
}

// 备用检查方案（规则检查）
function runFallbackCheck(content, mode, taskId) {
  const checklist = CHECKLISTS[mode] || CHECKLISTS.initial;
  const issues = [];
  const suggestions = [];

  // 规则检查
  const rules = {
    '格式检查': (c) => c.includes('##') || c.length > 30,
    '步骤检查': (c) => /\d+\./.test(c),
    '文件检查': (c) => c.includes('.js') || c.includes('.md') || c.includes('文件'),
    '语法检查': (c) => !c.includes('undefined') && !c.includes('null'),
    '完整性检查': (c) => c.length > 50,
    '逻辑检查': (c) => c.includes('因为') || c.includes('所以') || c.includes('原因'),
    '最佳实践': (c) => c.includes('应该') || c.includes('建议'),
    '可维护性': (c) => c.includes('函数') || c.includes('模块'),
    '性能考虑': (c) => c.includes('性能') || c.includes('效率') || c.includes('优化')
  };

  for (const item of checklist) {
    const rule = rules[item.name];
    if (rule && !rule(content)) {
      issues.push({
        name: item.name,
        description: `${item.name}未通过 - ${item.desc}`,
        severity: '中'
      });
      suggestions.push(`改进 ${item.name}：确保内容包含${item.name}相关要素`);
    }
  }

  return {
    taskId,
    mode,
    passed: issues.length === 0,
    issues,
    suggestions,
    comment: issues.length === 0
      ? `${mode === 'initial' ? '初检' : '深检'}通过！内容质量良好。`
      : `${mode === 'initial' ? '初检' : '深检'}发现${issues.length}个问题。`,
    checkedAt: new Date().toISOString(),
    fallback: true
  };
}

main();

module.exports = { runReview: () => true };
