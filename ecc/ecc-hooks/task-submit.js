#!/usr/bin/env node

/**
 * ECC 融合版 - 任务提交钩子
 *
 * 功能说明：
 * 1. 捕获任务提交
 * 2. 自动触发杰克 AI 检查
 * 3. 保存提交历史
 * 4. 生成审查报告
 *
 * 来源：ECC continuous-learning hooks + 杰克 AI 检查系统
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const WORKSPACE = path.join(__dirname, '../workspace');
const TASKS_DIR = path.join(WORKSPACE, '.jack-review-tasks');
const CHECKS_DIR = path.join(WORKSPACE, '.jack-checks');
const SUBMISSIONS_DIR = path.join(WORKSPACE, '.submissions');

/**
 * 确保目录存在
 */
function ensureDirs() {
  [TASKS_DIR, CHECKS_DIR, SUBMISSIONS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * 保存提交记录
 */
function saveSubmission(taskId, content) {
  const submission = {
    taskId,
    content,
    timestamp: new Date().toISOString(),
    status: 'pending_review'
  };

  const file = path.join(SUBMISSIONS_DIR, `${taskId}-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(submission, null, 2));
  return file;
}

/**
 * 触发杰克 AI 检查
 */
function triggerAiCheck(taskId) {
  try {
    execSync(`node jack-review.js initial ai`, {
      cwd: WORKSPACE,
      stdio: 'inherit'
    });
  } catch (e) {
    console.error('⚠️ AI 检查失败:', e.message);
  }
}

/**
 * 主函数
 */
function main() {
  const [,, taskId, content] = process.argv;

  if (!taskId) {
    console.log('❌ 用法：node task-submit.js [taskId] [content]');
    process.exit(1);
  }

  ensureDirs();

  console.log('═══════════════════════════════════════════════════════');
  console.log('📤 ECC 融合版 - 任务提交');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📋 任务 ID: ${taskId}`);
  console.log(`📝 内容长度：${content?.length || 0} 字符`);

  // 保存提交
  const file = saveSubmission(taskId, content || '');
  console.log(`💾 已保存：${file}`);

  // 触发 AI 检查
  console.log('\n🤖 触发杰克 AI 检查...');
  triggerAiCheck(taskId);

  console.log('\n✅ 提交流程完成');
  console.log('═══════════════════════════════════════════════════════\n');
}

main();
