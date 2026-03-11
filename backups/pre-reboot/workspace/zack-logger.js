#!/usr/bin/env node

/**
 * 扎克日志工具 v1.0 - 按杰克的规范实现
 *
 * 功能说明：
 * 1. 操作日志 - 记录扎克的所有操作到日志文件
 * 2. 回复记录 - 记录 AI 回复到 JSON 文件供分析
 * 3. 多级日志 - 支持 INFO/WARN/ERROR/DEBUG 四个级别
 * 4. 格式统一 - 遵循杰克制定的日志格式规范
 *
 * 配置说明：
 * - LOG_DIR: 日志目录路径
 * - LOG_PATH: zack.log 文件路径
 * - REPLIES_PATH: replies.json 文件路径
 * - LogLevel: 日志级别枚举
 *
 * 用法：
 *   const logger = require('./zack-logger')
 *   logger.info('任务开始')
 *   logger.error('发生错误')
 *   logger.recordReply({ role: 'assistant', content: '回复内容' })
 *
 * 示例输出：
 *   [2026-03-10 12:00:00] [INFO] [zack] 任务开始
 *   [2026-03-10 12:00:01] [ERROR] [zack] 发生错误
 *
 * 常见错误：
 * - 日志目录不存在 → 脚本会自动创建
 * - 文件写入失败 → 检查磁盘空间和权限
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

const LOG_DIR = 'C:\\Users\\17589\\.openclaw\\logs';
const LOG_PATH = path.join(LOG_DIR, 'zack.log');
const REPLIES_PATH = path.join(LOG_DIR, 'replies.json');

// 日志级别
const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

/**
 * 确保日志目录存在 - 如果不存在则创建
 * @returns {void}
 */
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * 格式化时间戳 - 输出中文格式的时间
 * @returns {string} 格式化的时间字符串
 */
function formatTimestamp() {
  return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
}

/**
 * 写入日志 - 将日志消息写入文件
 * @param {string} level - 日志级别
 * @param {string} message - 日志消息
 * @returns {void}
 */
function writeLog(level, message) {
  ensureLogDir();
  const timestamp = formatTimestamp();
  const line = `[${timestamp}] [${level}] [zack] ${message}\n`;
  fs.appendFileSync(LOG_PATH, line, 'utf-8');
}

/**
 * 记录 Info 日志
 * @param {string} message - 日志消息
 * @returns {void}
 */
function info(message) {
  writeLog(LogLevel.INFO, message);
  console.log(`[INFO] ${message}`);
}

/**
 * 记录 Warn 日志
 * @param {string} message - 日志消息
 * @returns {void}
 */
function warn(message) {
  writeLog(LogLevel.WARN, message);
  console.log(`[WARN] ${message}`);
}

/**
 * 记录 Error 日志
 * @param {string} message - 日志消息
 * @returns {void}
 */
function error(message) {
  writeLog(LogLevel.ERROR, message);
  console.error(`[ERROR] ${message}`);
}

/**
 * 记录 Debug 日志
 * @param {string} message - 日志消息
 * @returns {void}
 */
function debug(message) {
  writeLog(LogLevel.DEBUG, message);
  console.log(`[DEBUG] ${message}`);
}

/**
 * 记录回复 - 将 AI 回复记录到 JSON 文件
 * @param {Object} reply - 回复对象
 * @returns {void}
 */
function recordReply(reply) {
  ensureLogDir();

  let replies = [];
  if (fs.existsSync(REPLIES_PATH)) {
    try {
      replies = JSON.parse(fs.readFileSync(REPLIES_PATH, 'utf-8'));
    } catch (e) {
      replies = [];
    }
  }

  replies.push({
    timestamp: new Date().toISOString(),
    ...reply
  });

  // 只保留最近 100 条回复
  if (replies.length > 100) {
    replies = replies.slice(-100);
  }

  fs.writeFileSync(REPLIES_PATH, JSON.stringify(replies, null, 2), 'utf-8');
}

// 导出
module.exports = {
  info,
  warn,
  error,
  debug,
  recordReply,
  LogLevel,
  LOG_PATH,
  REPLIES_PATH
};
