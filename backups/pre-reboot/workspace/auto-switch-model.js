#!/usr/bin/env node

/**
 * 阿里云 API 健康检查与自动切换脚本 v1.0
 *
 * 功能说明：
 * 1. 健康检查 - 定期检查阿里云 API 健康状态
 * 2. 自动切换 - 检测到故障时自动切换到 DeepSeek 备用模型
 * 3. 日志记录 - 记录切换事件和原因
 * 4. 配置管理 - 自动更新 openclaw.json 配置
 *
 * 配置说明：
 * - CONFIG_PATH: 配置文件路径
 * - LOG_PATH: 切换日志文件路径
 * - MODELS: 模型配置（primary 主用/backup 备用）
 * - currentModel: 当前使用的模型
 *
 * 用法：
 *   node auto-switch-model.js                    # 执行健康检查
 *   const { checkHealth } = require('./auto-switch-model')
 *
 * 示例输出：
 *   [健康检查] 检查阿里云 API 状态...
 *   ✅ API 健康，继续使用阿里云
 *   或
 *   ⚠️ API 故障，切换到 DeepSeek
 *
 * 常见错误：
 * - 配置文件读取失败 → 检查文件路径和权限
 * - API 请求失败 → 检查网络连接和 API 密钥
 *
 * 依赖：
 * - Node.js 14+
 * - fs, https, path (内置模块)
 *
 * 修改历史：
 * - 2026-03-07: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const CONFIG_PATH = 'C:\\Users\\17589\\.openclaw\\openclaw.json';
const LOG_PATH = 'C:\\Users\\17589\\.openclaw\\workspace\\model-switch-log.md';

// 模型配置
const MODELS = {
  primary: {
    name: 'bailian/qwen3.5-plus',
    provider: 'bailian',
    healthUrl: 'https://coding.dashscope.aliyuncs.com/v1'
  },
  backup: {
    name: 'deepseek/deepseek-chat',
    provider: 'deepseek'
  }
};

let currentModel = MODELS.primary;

/**
 * 检查阿里云 API 健康状态 - 发送请求检测 API 是否可用
 * @returns {Promise<boolean>} API 是否健康
 */
async function checkHealth() {
  return new Promise((resolve) => {
    const req = https.get(MODELS.primary.healthUrl, { timeout: 5000 }, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
  });
}

/**
 * 切换模型 - 切换到备用模型并记录日志
 * @returns {void}
 */
function switchModel() {
  currentModel = MODELS.backup;
  logSwitch();
}

/**
 * 记录切换日志 - 将切换事件记录到日志文件
 * @returns {void}
 */
function logSwitch() {
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const log = `## ${timestamp}\n\n切换到备用模型：${MODELS.backup.name}\n\n原因：阿里云 API 故障\n\n`;
  fs.appendFileSync(LOG_PATH, log, 'utf-8');
}

/**
 * 更新配置文件 - 将新模型配置写入 openclaw.json
 * @returns {boolean} 更新是否成功
 */
function updateConfig() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    config.model = MODELS.backup.name;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('[切换] 更新配置文件失败:', e.message);
    return false;
  }
}

/**
 * 主函数 - 执行健康检查和自动切换
 * @returns {Promise<void>}
 */
async function main() {
  console.log('[健康检查] 检查阿里云 API 状态...');

  const healthy = await checkHealth();

  if (healthy) {
    console.log('✅ API 健康，继续使用阿里云');
  } else {
    console.log('⚠️ API 故障，切换到 DeepSeek');
    switchModel();
    updateConfig();
  }
}

// 导出
module.exports = { checkHealth, switchModel, MODELS };

// 运行
if (require.main === module) {
  main();
}
