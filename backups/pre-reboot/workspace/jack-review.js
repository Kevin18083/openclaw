#!/usr/bin/env node

/**
 * 扎克操作 - 杰克检查 自动化流程 v1.0
 *
 * 功能说明：
 * 1. 监听触发词 - 识别"让杰克检查"、"给杰克检查"
 * 2. 自动创建检查任务 - 生成任务 ID、记录创建时间
 * 3. 引导扎克提交内容 - 输出提交格式模板
 * 4. 通知杰克开始检查 - 初检 + 深检两轮检查
 * 5. 跟踪修改循环直到通过 - 记录修订次数
 * 6. 生成最终报告给罗总 - 归档任务、输出汇报模板
 *
 * 角色分工：
 * - 扎克：执行任务、自己修改、重新提交、最终汇报
 * - 杰克：检查问题、教怎么改、不动手改
 * - 罗总：说关键词触发检查、接收最终结果
 *
 * 配置说明：
 * - TRIGGER_KEYWORDS: 触发词数组
 * - TASKS_DIR: 任务文件目录 (.jack-review-tasks)
 * - ARCHIVE_DIR: 归档文件目录 (.jack-review-archive)
 * - 任务状态：pending, initial_review, deep_review, modifying, passed, archived
 *
 * 用法：
 *   node jack-review.js "让杰克检查缓存配置"     # 创建检查任务
 *   node jack-review.js submit "提交内容"        # 扎克提交内容
 *   node jack-review.js initial '{"passed":true}' # 杰克初检结果
 *   node jack-review.js deep '{"passed":false}'   # 杰克深检结果
 *   node jack-review.js status                    # 查看当前状态
 *   node jack-review.js help                      # 显示帮助信息
 *
 * 触发词：
 *   任务名称中包含 "让杰克检查" 或 "给杰克检查" 自动触发检查流程
 *
 * 示例输出：
 *   ════════════════════════════════════════════════════════════
 *   扎克操作 - 杰克检查 自动化流程
 *   ════════════════════════════════════════════════════════════
 *   ✅ 检测到触发词：让杰克检查
 *   📋 创建检查任务：TASK-20260310143000
 *
 * 常见错误：
 * - 任务目录创建失败 → 检查工作区权限
 * - JSON 解析失败 → 检查引号转义
 * - 任务文件不存在 → 先触发检查流程
 *
 * 依赖：
 * - Node.js 14+
 * - fs, path (内置模块)
 *
 * 修改历史：
 * - 2026-03-07: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// 配置
// ============================================================================

const WORKSPACE = path.join(__dirname);
const TASKS_DIR = path.join(WORKSPACE, '.jack-review-tasks');    // 任务文件目录
const ARCHIVE_DIR = path.join(WORKSPACE, '.jack-review-archive'); // 归档文件目录

// 触发词数组
const TRIGGER_KEYWORDS = [
  '让杰克检查',
  '给杰克检查'
];

// 颜色定义（用于控制台输出）
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  white: '\x1b[37m'
};

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 确保目录存在
 */
function ensureDirs() {
  if (!fs.existsSync(TASKS_DIR)) {
    fs.mkdirSync(TASKS_DIR, { recursive: true });
  }
  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  }
}

/**
 * 生成任务 ID - 使用时间戳格式
 * @returns {string} 14 位数字的任务 ID
 */
function generateTaskId() {
  const now = new Date();
  return now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
}

/**
 * 格式化日期为中文格式
 * @param {Date} date - 日期对象
 * @returns {string} 中文格式日期字符串
 */
function formatDate(date = new Date()) {
  return date.toLocaleString('zh-CN');
}

// ============================================================================
// 检查任务类
// ============================================================================

/**
 * 检查任务类 - 管理单个检查任务的生命周期
 */
class ReviewTask {
  /**
   * 创建检查任务
   * @param {string} taskName - 任务名称
   * @param {string} submitter - 提交人，默认 Zack
   */
  constructor(taskName, submitter = 'Zack') {
    this.id = generateTaskId();
    this.name = taskName;
    this.submitter = submitter;
    this.createdAt = formatDate();
    this.status = 'pending'; // pending, initial_review, deep_review, modifying, passed, archived
    this.history = [];
    this.revisions = 0;
  }

  /**
   * 获取任务文件路径
   * @returns {string} 任务文件完整路径
   */
  getFilePath() {
    return path.join(TASKS_DIR, `${this.id}-${this.name}.json`);
  }

  /**
   * 保存任务到文件
   * @returns {string} 保存的文件路径
   */
  save() {
    const filePath = this.getFilePath();
    fs.writeFileSync(filePath, JSON.stringify(this, null, 2), 'utf-8');
    return filePath;
  }

  /**
   * 添加历史记录
   * @param {string} action - 动作名称
   * @param {string} details - 详细内容
   */
  addLog(action, details) {
    this.history.push({
      time: formatDate(),
      action,
      details
    });
    this.save();
  }

  /**
   * 更新任务状态
   * @param {string} status - 新状态
   */
  updateStatus(status) {
    this.status = status;
    this.addLog('status_change', status);
    this.save();
  }

  /**
   * 增加修订次数
   */
  incrementRevision() {
    this.revisions++;
    this.addLog('revision', `第 ${this.revisions} 次修改`);
    this.save();
  }

  /**
   * 从文件加载任务
   * @param {string} filePath - 文件路径
   * @returns {ReviewTask} 任务对象
   */
  static load(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const task = new ReviewTask(data.name, data.submitter);
    Object.assign(task, data);
    return task;
  }

  /**
   * 获取最新任务（按修改时间排序）
   * @returns {ReviewTask|null} 最新任务或 null
   */
  static getLatest() {
    if (!fs.existsSync(TASKS_DIR)) return null;
    const files = fs.readdirSync(TASKS_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) return null;
    // 按修改时间排序，返回最新的
    files.sort((a, b) => {
      const statA = fs.statSync(path.join(TASKS_DIR, a));
      const statB = fs.statSync(path.join(TASKS_DIR, b));
      return statB.mtimeMs - statA.mtimeMs;
    });
    return ReviewTask.load(path.join(TASKS_DIR, files[0]));
  }
}

// ============================================================================
// 流程控制
// ============================================================================

class ReviewFlow {
  constructor() {
    ensureDirs();
    this.currentTask = null;
  }

  // 1. 触发检查流程
  triggerReview(taskName, triggeredBy = 'user') {
    console.log(`\n${colors.cyan}════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}🔄 触发检查流程${colors.reset}`);
    console.log(`${colors.cyan}════════════════════════════════════════════${colors.reset}\n`);

    // 创建任务
    this.currentTask = new ReviewTask(taskName);
    this.currentTask.addLog('created', `任务创建，触发者：${triggeredBy}`);
    this.currentTask.save();

    console.log(`${colors.green}✅ 检查任务已创建${colors.reset}`);
    console.log(`   任务 ID: ${this.currentTask.id}`);
    console.log(`   任务名：${taskName}`);
    console.log(`   提交人：扎克`);
    console.log(`   检查人：杰克`);
    console.log(`   创建时间：${this.currentTask.createdAt}`);
    console.log();

    // 输出扎克需要做的
    console.log(`${colors.yellow}📋 扎克请提交以下内容：${colors.reset}\n`);
    console.log('请按以下格式提交任务详情：\n');
    console.log('```markdown');
    console.log('## 任务名称');
    console.log('[任务描述]');
    console.log();
    console.log('## 执行步骤');
    console.log('1. [步骤 1]');
    console.log('2. [步骤 2]');
    console.log('3. [步骤 3]');
    console.log();
    console.log('## 操作内容');
    console.log('- 修改的文件：[文件路径]');
    console.log('- 新增的内容：[具体内容]');
    console.log('- 配置变更：[变更详情]');
    console.log();
    console.log('## 自检查结果');
    console.log('- [ ] 语法正确');
    console.log('- [ ] 逻辑正确');
    console.log('- [ ] 无遗漏步骤');
    console.log('```\n');

    console.log(`${colors.magenta}📢 下一步${colors.reset}`);
    console.log('1. 扎克提交任务详情');
    console.log('2. 杰克开始初检');
    console.log('3. 有问题则扎克修改，无问题则深检');
    console.log('4. 循环直到通过');
    console.log('5. 扎克向罗总汇报最终结果');
    console.log();

    console.log(`${colors.cyan}════════════════════════════════════════════${colors.reset}\n`);

    return this.currentTask;
  }

  // 2. 接收扎克提交
  receiveSubmission(submission) {
    // 从文件加载最新任务
    this.currentTask = ReviewTask.getLatest();
    if (!this.currentTask) {
      console.log(`${colors.red}❌ 无活跃任务，请先触发检查流程${colors.reset}`);
      return null;
    }

    this.currentTask.addLog('submission_received', submission);
    this.currentTask.updateStatus('initial_review');

    console.log(`${colors.green}✅ 已接收扎克提交${colors.reset}`);
    console.log(`   提交时间：${formatDate()}`);
    console.log();

    console.log(`${colors.magenta}📢 杰克请开始初检${colors.reset}`);
    console.log();
    console.log('初检清单：');
    console.log('□ 格式检查 - 报告格式是否完整');
    console.log('□ 步骤检查 - 步骤是否清晰、可追溯');
    console.log('□ 文件检查 - 修改的文件是否存在');
    console.log('□ 语法检查 - 代码/配置语法是否正确');
    console.log('□ 完整性检查 - 是否有遗漏');
    console.log();

    return this.currentTask;
  }

  // 3. 杰克初检结果
  initialReviewResult(passed, issues = [], suggestions = []) {
    // 从文件加载最新任务
    this.currentTask = ReviewTask.getLatest();
    if (!this.currentTask) {
      console.log(`${colors.red}❌ 无活跃任务${colors.reset}`);
      return;
    }

    this.currentTask.addLog('initial_review', { passed, issues, suggestions });

    console.log(`\n${colors.cyan}════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}📋 初检结果${colors.reset}`);
    console.log(`${colors.cyan}════════════════════════════════════════════${colors.reset}\n`);

    if (passed) {
      console.log(`${colors.green}✅ 初检通过${colors.reset}`);
      this.currentTask.updateStatus('deep_review');
      console.log('\n进入深检阶段...\n');
    } else {
      console.log(`${colors.red}❌ 初检发现问题${colors.reset}\n`);

      issues.forEach((issue, i) => {
        console.log(`${colors.red}【问题${i + 1}】${issue.description}${colors.reset}`);
        console.log(`  位置：${issue.location || '未指定'}`);
        console.log(`  严重程度：${issue.severity || '中'}`);
      });

      console.log(`\n${colors.yellow}📝 修改建议${colors.reset}\n`);
      suggestions.forEach((sug, i) => {
        console.log(`${i + 1}. ${sug}`);
      });

      console.log(`\n${colors.magenta} 扎克请修改${colors.reset}`);
      console.log('按以上建议修改后，重新提交 "让杰克检查"');

      this.currentTask.updateStatus('modifying');
    }

    console.log();
  }

  // 4. 杰克深检结果
  deepReviewResult(passed, issues = [], suggestions = []) {
    // 从文件加载最新任务
    this.currentTask = ReviewTask.getLatest();
    if (!this.currentTask) {
      console.log(`${colors.red}❌ 无活跃任务${colors.reset}`);
      return;
    }

    this.currentTask.addLog('deep_review', { passed, issues, suggestions });

    console.log(`\n${colors.cyan}════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}📋 深检结果${colors.reset}`);
    console.log(`${colors.cyan}════════════════════════════════════════════${colors.reset}\n`);

    if (passed) {
      console.log(`${colors.green}✅ 深检通过${colors.reset}`);
      this.currentTask.updateStatus('passed');

      console.log(`\n${colors.green}🎉 检查流程完成！${colors.reset}\n`);
      console.log(`${colors.magenta}📢 扎克请向罗总汇报${colors.reset}\n`);
      console.log('汇报格式：');
      console.log('```markdown');
      console.log('## 📋 任务完成报告');
      console.log('');
      console.log(`**任务名称**: ${this.currentTask.name}`);
      console.log(`**执行时间**: ${this.currentTask.createdAt} - ${formatDate()}`);
      console.log(`**检查状态**: ✅ 杰克两轮检查通过`);
      console.log(`**迭代次数**: ${this.currentTask.revisions} 次`);
      console.log('');
      console.log('### 执行内容');
      console.log('[简要说明做了什么]');
      console.log('');
      console.log('### 修改的文件');
      console.log('- [文件路径]');
      console.log('');
      console.log('### 自验证');
      console.log('- [x] 功能已测试');
      console.log('- [x] 无遗留问题');
      console.log('');
      console.log('---');
      console.log('请罗总审阅。');
      console.log('```');
      console.log();

      // 归档
      this.archiveTask();
    } else {
      console.log(`${colors.red}❌ 深检发现问题${colors.reset}\n`);

      issues.forEach((issue, i) => {
        console.log(`${colors.red}【问题${i + 1}】${issue.description}${colors.reset}`);
        console.log(`  位置：${issue.location || '未指定'}`);
        console.log(`  影响：${issue.impact || '未知'}`);
      });

      console.log(`\n${colors.yellow}📝 修改建议${colors.reset}\n`);
      suggestions.forEach((sug, i) => {
        console.log(`${i + 1}. ${sug}`);
      });

      console.log(`\n${colors.magenta}📢 扎克请修改${colors.reset}`);
      console.log('按以上建议修改后，重新提交 "让杰克检查"');

      this.currentTask.incrementRevision();
      this.currentTask.updateStatus('modifying');
    }

    console.log();
  }

  // 归档任务
  archiveTask() {
    if (!this.currentTask) return;

    const archivePath = path.join(ARCHIVE_DIR, `${this.currentTask.id}-${this.currentTask.name}-已归档.json`);
    fs.copyFileSync(
      path.join(TASKS_DIR, `${this.currentTask.id}-${this.currentTask.name}.json`),
      archivePath
    );

    fs.unlinkSync(path.join(TASKS_DIR, `${this.currentTask.id}-${this.currentTask.name}.json`));

    console.log(`${colors.green}✅ 任务已归档${colors.reset}`);
    console.log(`   归档路径：${archivePath}`);
    console.log();
  }
}

// ============================================================================
// 命令行接口
// ============================================================================

function showHelp() {
  console.log(`
${colors.cyan}扎克操作 - 杰克检查 自动化流程${colors.reset}

${colors.yellow}用法:${colors.reset}
  node jack-review.js "任务名称"                    # 创建检查任务
  node jack-review.js submit "提交内容"             # 扎克提交
  node jack-review.js initial "结果 JSON"           # 杰克初检结果
  node jack-review.js deep "结果 JSON"              # 杰克深检结果
  node jack-review.js status                        # 查看当前状态
  node jack-review.js help                          # 显示帮助

${colors.yellow}触发词:${colors.reset}
  任务名称中包含 "让杰克检查" 或 "给杰克检查" 自动触发

${colors.yellow}示例:${colors.reset}
  node jack-review.js "让杰克检查缓存配置"
  node jack-review.js submit "缓存配置已修改完成..."
  node jack-review.js initial '{"passed":false,"issues":[...],"suggestions":[...]}'
  node jack-review.js deep '{"passed":true}'
`);
}

// ============================================================================
// 主函数
// ============================================================================

function main() {
  const args = process.argv.slice(2);
  const flow = new ReviewFlow();

  if (args.length === 0) {
    showHelp();
    return;
  }

  const command = args[0];

  if (command === 'help') {
    showHelp();
    return;
  }

  if (command === 'status') {
    const files = fs.readdirSync(TASKS_DIR).filter(f => f.endsWith('.json'));
    console.log(`\n${colors.cyan}当前活跃任务：${files.length}${colors.reset}\n`);
    files.forEach(f => {
      const task = JSON.parse(fs.readFileSync(path.join(TASKS_DIR, f), 'utf-8'));
      console.log(`- ${task.name} (状态：${task.status}, 修订：${task.revisions}次)`);
    });
    console.log();
    return;
  }

  if (command === 'trigger' || args.join(' ').includes('让杰克检查') || args.join(' ').includes('给杰克检查')) {
    const taskName = args.join(' ').replace('让杰克检查', '').replace('给杰克检查', '').trim() || '未命名任务';
    flow.triggerReview(taskName);
    return;
  }

  if (command === 'submit') {
    const submission = args.slice(1).join(' ');
    flow.receiveSubmission(submission);
    return;
  }

  if (command === 'initial') {
    const result = JSON.parse(args.slice(1).join(' '));
    flow.initialReviewResult(result.passed, result.issues || [], result.suggestions || []);
    return;
  }

  if (command === 'deep') {
    const result = JSON.parse(args.slice(1).join(' '));
    flow.deepReviewResult(result.passed, result.issues || [], result.suggestions || []);
    return;
  }

  // 默认：创建任务
  const taskName = args.join(' ');
  flow.triggerReview(taskName);
}

// ============================================================================
// 导出
// ============================================================================

module.exports = {
  ReviewTask,
  ReviewFlow,
  TRIGGER_KEYWORDS,
  TASKS_DIR,
  ARCHIVE_DIR
};

// ============================================================================
// 执行
// ============================================================================

if (require.main === module) {
  main();
}
