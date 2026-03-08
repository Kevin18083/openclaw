/**
 * 扎克日志工具 - 按杰克的规范实现
 * 
 * 功能：记录扎克的所有操作到日志文件
 * 格式：[时间戳] [级别] [zack] 消息
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
 * 确保日志目录存在
 */
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * 格式化时间戳 - 完全匹配杰克的格式
 * 格式：2026-03-07 22:30:00
 */
function formatTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 记录日志
 * @param {string} message - 日志消息
 * @param {string} level - 日志级别 (INFO/WARN/ERROR/DEBUG)
 */
function log(message, level = LogLevel.INFO) {
  ensureLogDir();
  
  const timestamp = formatTimestamp();
  const logLine = `[${timestamp}] [${level}] [zack] ${message}`;
  
  // 输出到控制台
  console.log(logLine);
  
  // 追加到日志文件
  try {
    fs.appendFileSync(LOG_PATH, logLine + '\n', 'utf-8');
  } catch (error) {
    console.error(`[ERROR] [zack] 写入日志失败：${error.message}`);
  }
  
  return logLine;
}

/**
 * 记录回复到 replies.json
 * @param {string} messageId - 消息 ID
 * @param {string} content - 回复内容
 * @param {string} status - 状态 (ok/error/pending)
 */
function recordReply(messageId, content, status = 'ok') {
  ensureLogDir();
  
  let replies = [];
  
  // 读取现有回复
  try {
    if (fs.existsSync(REPLIES_PATH)) {
      const data = fs.readFileSync(REPLIES_PATH, 'utf-8');
      replies = JSON.parse(data);
    }
  } catch (error) {
    console.error(`[ERROR] [zack] 读取 replies.json 失败：${error.message}`);
    replies = [];
  }
  
  // 添加新回复
  replies.push({
    timestamp: new Date().toISOString(),
    messageId,
    content,
    status
  });
  
  // 保留最近 100 条回复
  if (replies.length > 100) {
    replies = replies.slice(-100);
  }
  
  // 写入文件
  try {
    fs.writeFileSync(REPLIES_PATH, JSON.stringify(replies, null, 2), 'utf-8');
    log(`回复记录到 replies.json: ${messageId}`, LogLevel.DEBUG);
  } catch (error) {
    log(`写入 replies.json 失败：${error.message}`, LogLevel.ERROR);
  }
}

/**
 * 带错误处理的日志包装器
 * @param {Function} fn - 要执行的函数
 * @param {string} description - 操作描述
 */
async function withErrorHandling(fn, description) {
  log(`开始执行：${description}`, LogLevel.INFO);
  
  try {
    const result = await fn();
    log(`完成：${description}`, LogLevel.INFO);
    return result;
  } catch (error) {
    log(`错误 - ${description}: ${error.message}`, LogLevel.ERROR);
    throw error;
  }
}

/**
 * 清理每日任务日志 - 保留最近 7 天
 */
function cleanDailyTasks() {
  log('执行 clean_daily_tasks：清理每日任务日志', LogLevel.INFO);
  
  ensureLogDir();
  
  try {
    const files = fs.readdirSync(LOG_DIR);
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    let cleaned = 0;
    
    for (const file of files) {
      if (file === 'zack.log' || file === 'replies.json') continue;
      
      const filePath = path.join(LOG_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > sevenDaysMs) {
        fs.unlinkSync(filePath);
        log(`清理旧文件：${file}`, LogLevel.DEBUG);
        cleaned++;
      }
    }
    
    log(`clean_daily_tasks 完成：清理了 ${cleaned} 个旧文件`, LogLevel.INFO);
  } catch (error) {
    log(`clean_daily_tasks 失败：${error.message}`, LogLevel.ERROR);
  }
}

// 导出
module.exports = {
  LogLevel,
  log,
  recordReply,
  withErrorHandling,
  cleanDailyTasks
};

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === 'clean') {
    cleanDailyTasks();
  } else if (args.length >= 1) {
    log(args.join(' '), args[1] || LogLevel.INFO);
  } else {
    console.log('Usage:');
    console.log('  node zack-logger.js <message> [level]');
    console.log('  node zack-logger.js clean  # 清理每日任务');
  }
}
