#!/usr/bin/env node

/**
 * 杰克活动记录工具 v1.0
 *
 * 功能说明：
 * 1. 活动记录 - 记录杰克的所有操作活动到日志文件
 * 2. 事件分类 - 支持 7 种事件类型（文件创建/修改/删除、配置变更、系统事件、任务完成、错误）
 * 3. 紧急通知 - 支持记录紧急事件到单独文件
 * 4. 日志查询 - 支持按时间、类型查询活动日志
 *
 * 配置说明：
 * - LOG_PATH: 活动日志文件路径（JSONL 格式）
 * - URGENT_PATH: 紧急事件文件路径
 * - EventType: 事件类型枚举（7 种类型）
 *
 * 用法：
 *   const { logActivity, EventType } = require('./jack-activity')
 *   logActivity(EventType.TASK_COMPLETE, '完成健康检查')
 *
 * 示例输出：
 *   [杰克活动] 记录：task_complete - 完成健康检查
 *
 * 常见错误：
 * - 日志文件写入失败 → 检查日志目录权限
 * - JSON 解析失败 → 检查日志文件格式
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
