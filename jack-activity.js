/**
 * 杰克活动记录工具
 * 供 Claude Code (杰克) 使用，记录活动到日志文件
 */

const fs = require('fs');
const path = require('path');

const LOG_PATH = 'C:\\Users\\17589\\.openclaw\\logs\\jack-activity.jsonl';
const URGENT_PATH = 'C:\\Users\\17589\\.openclaw\\logs\\jack-urgent.json';

// 事件类型
const EventType = {
  FILE_CREATED: 'file_created',
  FILE_MODIFIED: 'file_modified',
  FILE_DELETED: 'file_deleted',
  CONFIG_CHANGED: 'config_changed',
  SYSTEM_EVENT: 'system_event',
  TASK_COMPLETE: 'task_complete',
  ERROR_OCCURRED: 'error_occurred'
};

/**
 * 记录活动日志
 * @param {string} type - 事件类型
 * @param {string} description - 描述
 * @param {object} extra - 额外数据 (可选)
 */
function logActivity(type, description, extra = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    type,
    description,
    status: extra.status || 'ok',
    ...extra
  };

  // 确保目录存在
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 追加写入
  fs.appendFileSync(LOG_PATH, JSON.stringify(record) + '\n');
  console.log(`[Jack Activity] ${type}: ${description}`);
  return record;
}

/**
 * 发送紧急通知
 * @param {string} title - 标题
 * @param {string} message - 消息
 * @param {string} action - 需要扎克采取的行动
 */
function sendUrgent(title, message, action) {
  const urgent = {
    timestamp: new Date().toISOString(),
    priority: 'URGENT',
    title,
    message,
    actionRequired: action
  };

  fs.writeFileSync(URGENT_PATH, JSON.stringify(urgent, null, 2));
  console.log(`[Jack Urgent] ${title}: ${message}`);
  return urgent;
}

/**
 * 清除紧急通知 (处理完后调用)
 */
function clearUrgent() {
  if (fs.existsSync(URGENT_PATH)) {
    fs.unlinkSync(URGENT_PATH);
    console.log('[Jack Urgent] Cleared');
  }
}

// 导出
module.exports = {
  EventType,
  logActivity,
  sendUrgent,
  clearUrgent
};

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const [type, ...descParts] = args;
    logActivity(type, descParts.join(' '));
  } else {
    console.log('Usage: node jack-activity.js <type> <description>');
    console.log('Types: file_created, file_modified, config_changed, system_event, task_complete, error_occurred');
  }
}
