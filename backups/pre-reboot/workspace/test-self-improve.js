#!/usr/bin/env node

/**
 * 扎克自我改进系统 - 测试脚本 v1.0
 *
 * 功能说明：
 * 1. 全面测试 - 测试 activate-self-improve.js 的所有功能
 * 2. 6 项测试 - 帮助信息/初始化/记录成功/记录失败/报告/指标
 * 3. 自动清理 - 测试完成后清理临时文件
 * 4. 结果统计 - 输出通过率和问题汇总
 *
 * 配置说明：
 * - WORKSPACE: 工作区目录
 * - SCRIPT: 被测试脚本路径 (activate-self-improve.js)
 * - MEMORY_DIR: 记忆文件目录 (memory/)
 * - 测试项：testHelp/testInit/testRecordSuccess/testRecordError/testReport/testMetrics
 *
 * 用法：
 *   node test-self-improve.js                   # 执行全套测试
 *
 * 示例输出：
 *   ╔════════════════════════════════════════════════════╗
 *   ║     扎克自我改进系统 - 测试套件                    ║
 *   ╚════════════════════════════════════════════════════╝
 *   测试 1: 帮助信息
 *   ✅ PASS: 帮助信息包含标题
 *
 * 常见错误：
 * - 脚本不存在 → 检查 activate-self-improve.js 路径
 * - 权限不足 → 检查工作区目录权限
 * - 内存文件损坏 → 删除 memory 目录后重试
 *
 * 依赖：
 * - Node.js 14+
 * - fs, path, child_process (内置模块)
 *
 * 修改历史：
 * - 2026-03-07: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = path.join(__dirname);
const SCRIPT = path.join(WORKSPACE, 'activate-self-improve.js');
const MEMORY_DIR = path.join(WORKSPACE, 'memory');

// 颜色定义
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// 测试计数
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * 断言函数
 */
function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`${colors.green}✅ PASS${colors.reset}: ${testName}`);
    passedTests++;
    return true;
  } else {
    console.log(`${colors.red}❌ FAIL${colors.reset}: ${testName}`);
    failedTests++;
    return false;
  }
}

/**
 * 执行命令并返回输出
 */
function runCommand(cmd) {
  try {
    const output = execSync(cmd, { encoding: 'utf-8', cwd: WORKSPACE });
    return { success: true, output };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

/**
 * 清理测试文件
 */
function cleanup() {
  const files = [
    path.join(MEMORY_DIR, 'test-improvement.md'),
    path.join(MEMORY_DIR, 'metrics', 'test-performance.json')
  ];

  files.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
}

/**
 * 测试 1: 帮助信息
 */
function testHelp() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}测试 1: 帮助信息${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);

  const result = runCommand(`node "${SCRIPT}"`);
  assert(result.output.includes('扎克自我改进系统'), '帮助信息包含标题');
  assert(result.output.includes('用法'), '帮助信息包含用法');
  assert(result.output.includes('report'), '帮助信息包含 report 命令');
  assert(result.output.includes('init'), '帮助信息包含 init 命令');
}

/**
 * 测试 2: 初始化
 */
function testInit() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}测试 2: 初始化${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);

  const result = runCommand(`node "${SCRIPT}" init`);
  assert(result.success, '初始化命令执行成功');
  assert(result.output.includes('初始化完成'), '初始化完成提示');

  // 检查目录是否创建
  assert(fs.existsSync(path.join(MEMORY_DIR, 'metrics')), 'metrics 目录存在');
  assert(fs.existsSync(path.join(MEMORY_DIR, 'knowledge')), 'knowledge 目录存在');
  assert(fs.existsSync(path.join(MEMORY_DIR, 'improvement')), 'improvement 目录存在');
  assert(fs.existsSync(path.join(MEMORY_DIR, 'strategies')), 'strategies 目录存在');
}

/**
 * 测试 3: 记录成功任务
 */
function testRecordSuccess() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}测试 3: 记录成功任务${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);

  const taskName = '测试任务 - 成功';
  const result = '任务执行成功';
  const metrics = { duration: 10, success: true };

  const cmd = `node "${SCRIPT}" "${taskName}" "${result}" "${JSON.stringify(metrics).replace(/"/g, '\\"')}"`;
  const execResult = runCommand(cmd);

  assert(execResult.success, '记录成功任务命令执行成功');
  assert(execResult.output.includes('反思已记录'), '输出包含反思已记录');
  assert(execResult.output.includes('指标已记录'), '输出包含指标已记录');

  // 检查日志文件
  const logFile = path.join(MEMORY_DIR, 'self-improvement.md');
  assert(fs.existsSync(logFile), '反思日志文件存在');

  const logContent = fs.readFileSync(logFile, 'utf-8');
  assert(logContent.includes(taskName), '日志包含任务名称');
  assert(logContent.includes(result), '日志包含结果');
}

/**
 * 测试 4: 记录失败任务
 */
function testRecordError() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}测试 4: 记录失败任务${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);

  const taskName = '测试任务 - 失败';
  const result = '❌ 任务执行失败：网络错误';
  const metrics = { error: true, retry_count: 3 };

  const cmd = `node "${SCRIPT}" "${taskName}" "${result}" "${JSON.stringify(metrics).replace(/"/g, '\\"')}"`;
  const execResult = runCommand(cmd);

  assert(execResult.success, '记录失败任务命令执行成功');
  assert(execResult.output.includes('改进建议'), '输出包含改进建议');

  // 检查是否生成了改进建议文件
  const improvementDir = path.join(MEMORY_DIR, 'improvement');
  const files = fs.readdirSync(improvementDir);
  const testFiles = files.filter(f => f.includes('测试任务'));
  assert(testFiles.length > 0, '生成了改进建议文件');
}

/**
 * 测试 5: 查看报告
 */
function testReport() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}测试 5: 查看报告${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);

  const result = runCommand(`node "${SCRIPT}" report 7`);
  assert(result.success, '报告命令执行成功');
  assert(result.output.includes('生成改进报告'), '输出包含报告标题');
  assert(result.output.includes('记录数'), '输出包含记录数统计');
}

/**
 * 测试 6: 指标记录
 */
function testMetrics() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}测试 6: 指标记录${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);

  const metricsFile = path.join(MEMORY_DIR, 'metrics', 'performance.json');
  assert(fs.existsSync(metricsFile), '指标文件存在');

  const metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf-8'));
  assert(Object.keys(metrics).length > 0, '指标数据不为空');

  // 检查是否有测试相关的指标
  const testMetrics = Object.keys(metrics).filter(k => k.includes('测试') || k.includes('test'));
  assert(testMetrics.length > 0, '包含测试任务指标');
}

/**
 * 主测试函数
 */
function runAllTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     扎克自我改进系统 - 测试套件                      ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`\n开始时间：${new Date().toLocaleString('zh-CN')}\n`);

  try {
    // 运行所有测试
    testHelp();
    testInit();
    testRecordSuccess();
    testRecordError();
    testReport();
    testMetrics();

    // 输出结果
    console.log(`\n${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}测试结果${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════${colors.reset}`);

    console.log(`\n总测试数：${totalTests}`);
    console.log(`${colors.green}通过：${passedTests}${colors.reset}`);
    console.log(`${colors.red}失败：${failedTests}${colors.reset}`);

    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
    console.log(`通过率：${passRate}%\n`);

    if (failedTests === 0) {
      console.log(`${colors.green}✅ 所有测试通过！系统可靠！${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`${colors.red}❌ 有 ${failedTests} 项失败，请检查！${colors.reset}\n`);
      process.exit(1);
    }

  } catch (error) {
    console.error(`${colors.red}❌ 测试执行出错：${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// 执行测试
runAllTests();
