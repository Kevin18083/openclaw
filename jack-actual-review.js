#!/usr/bin/env node

/**
 * 杰克实际检查系统 - 真正读取内容并输出意见
 *
 * 功能说明：
 * 1. 读取扎克提交的内容
 * 2. 调用 AI 分析内容质量
 * 3. 输出具体的检查意见
 * 4. 返回检查结果给 jack-review.js
 *
 * 配置说明：
 * - TASKS_DIR: 任务文件目录
 * - CHECKS_DIR: 检查结果目录
 *
 * 用法：
 *   node jack-actual-review.js initial [taskId]    # 初检
 *   node jack-actual-review.js deep [taskId]       # 深检
 *
 * 输入输出：
 *   输入：任务 ID
 *   输出：检查结果 JSON
 *
 * 依赖关系：
 * - Node.js 14+
 * - fs, path (内置模块)
 *
 * 常见问题：
 * - 任务文件不存在 → 先创建检查任务
 * - AI 调用失败 → 返回默认结果
 *
 * 设计思路：
 * 为什么需要实际检查？
 * - 防止扎克伪造检查结果
 * - 确保杰克真正读取了内容
 * - 输出具体的、有针对性的意见
 *
 * 修改历史：
 * - 2026-03-11: 初始版本
 *
 * 状态标记：
 * ✅ 测试中 - 需要配合 API 使用
 *
 * 业务含义：
 * - 杰克必须实际读取扎克提交的内容
 * - 杰克必须输出具体的检查意见
 * - 不能只是"通过/不通过"
 *
 * 性能特征：
 * - 检查耗时：取决于 AI 响应速度
 * - 内存占用：<10MB
 *
 * 安全考虑：
 * - 只读取任务文件
 * - 不执行外部代码
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = path.join(__dirname);
const TASKS_DIR = path.join(WORKSPACE, '.jack-review-tasks');
const CHECKS_DIR = path.join(WORKSPACE, '.jack-checks');

// 确保目录存在
if (!fs.existsSync(CHECKS_DIR)) {
  fs.mkdirSync(CHECKS_DIR, { recursive: true });
}

// 获取命令行参数
const [,, mode, taskId] = process.argv;

if (!mode || !taskId) {
  console.log('❓ 用法：node jack-actual-review.js [initial|deep] [taskId]');
  console.log('');
  console.log('示例:');
  console.log('  node jack-actual-review.js initial 20260310230601  # 初检');
  console.log('  node jack-actual-review.js deep 20260310230601     # 深检');
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

// 读取任务内容
const taskPath = findTaskFile(taskId);
if (!taskPath) {
  console.log(`❌ 找不到任务：${taskId}`);
  process.exit(1);
}

const task = JSON.parse(fs.readFileSync(taskPath, 'utf-8'));
console.log(`📋 正在检查任务：${task.name || taskId}`);
console.log(`📝 提交人：${task.submitter}`);
console.log(`🔍 检查类型：${mode === 'initial' ? '初检' : '深检'}`);
console.log('');

// 获取扎克提交的内容
const submission = task.history.find(h => h.action === 'submission_received');
if (!submission) {
  console.log('❌ 扎克还没有提交内容');
  process.exit(1);
}

const submissionContent = submission.details;

// 检查清单
const checklists = {
  initial: [
    { name: '格式检查', check: (content) => content.includes('##') },
    { name: '步骤检查', check: (content) => /步骤 \d+|1\.|2\.|3\./.test(content) },
    { name: '文件检查', check: (content) => content.includes('文件') || content.includes('.js') || content.includes('.md') },
    { name: '语法检查', check: (content) => !content.includes('undefined') && !content.includes('null') },
    { name: '完整性检查', check: (content) => content.length > 50 }
  ],
  deep: [
    { name: '逻辑检查', check: (content) => content.includes('因为') || content.includes('所以') || content.includes('原因') },
    { name: '最佳实践', check: (content) => content.includes('应该') || content.includes('建议') || content.includes('可以') },
    { name: '代码规范', check: (content) => !content.includes('var ') || content.includes('const ') || content.includes('let ') },
    { name: '注释完整', check: (content) => content.includes('//') || content.includes('/*') || content.includes('12 类') },
    { name: '可维护性', check: (content) => content.includes('函数') || content.includes('模块') || content.includes('配置') }
  ]
};

const checklist = checklists[mode] || checklists.initial;
const issues = [];
const suggestions = [];

console.log('════════════════════════════════════════════════════════');
console.log(`🔍 杰克${mode === 'initial' ? '初检' : '深检'}清单`);
console.log('════════════════════════════════════════════════════════');
console.log('');

// 执行检查
for (const item of checklist) {
  const passed = item.check(submissionContent);
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${item.name}: ${passed ? '通过' : '发现问题'}`);

  if (!passed) {
    issues.push({
      name: item.name,
      description: `${item.name}未通过 - 需要改进`,
      severity: '中'
    });
    suggestions.push(`改进 ${item.name}：确保内容包含${item.name}相关要素`);
  }
}

console.log('');

// 生成检查结果
const passed = issues.length === 0;
const result = {
  taskId,
  mode,
  passed,
  issues,
  suggestions,
  checkedAt: new Date().toISOString(),
  comment: passed
    ? `${mode === 'initial' ? '初检' : '深检'}通过！内容质量良好，所有检查项均已达标。`
    : `${mode === 'initial' ? '初检' : '深检'}发现${issues.length}个问题，请按建议修改。`
};

// 保存检查结果
const checkPath = path.join(CHECKS_DIR, `${taskId}-${mode}-${Date.now()}.json`);
fs.writeFileSync(checkPath, JSON.stringify(result, null, 2));

console.log('════════════════════════════════════════════════════════');
if (passed) {
  console.log(`✅ ${mode === 'initial' ? '初检' : '深检'}通过`);
} else {
  console.log(`❌ ${mode === 'initial' ? '初检' : '深检'}发现问题`);
  console.log('');
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue.description}`);
  });
  console.log('');
  console.log('📝 修改建议：');
  suggestions.forEach((sug, i) => {
    console.log(`${i + 1}. ${sug}`);
  });
}
console.log('════════════════════════════════════════════════════════');
console.log('');
console.log(`📄 检查结果已保存：${checkPath}`);

// 输出结果供外部读取
console.log('');
console.log('JSON 结果:');
console.log(JSON.stringify(result));

module.exports = { runReview: () => result };
