/**
 * 阿里云API健康检查与自动切换脚本
 * 当检测到阿里云API故障时，自动切换到DeepSeek备用模型
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
 * 检查阿里云API健康状态
 */
function checkAliyunHealth() {
  return new Promise((resolve) => {
    const timeout = 10000; // 10秒超时
    
    const req = https.get(MODELS.primary.healthUrl, { timeout }, (res) => {
      // 只要服务器响应（即使是401未授权），说明服务正常
      resolve({
        healthy: res.statusCode !== 503 && res.statusCode !== 502,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString()
      });
    });
    
    req.on('error', (err) => {
      resolve({
        healthy: false,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        healthy: false,
        error: 'Connection timeout',
        timestamp: new Date().toISOString()
      });
    });
  });
}

/**
 * 读取当前配置
 */
function readConfig() {
  const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(content);
}

/**
 * 写入新配置
 */
function writeConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * 切换到指定模型
 */
function switchModel(targetModel) {
  const config = readConfig();
  
  // 更新主用模型
  config.agents.defaults.model.primary = targetModel.name;
  config.meta.lastTouchedAt = new Date().toISOString();
  
  writeConfig(config);
  currentModel = targetModel;
  
  logSwitch(targetModel);
  
  return true;
}

/**
 * 记录切换日志
 */
function logSwitch(targetModel) {
  const logEntry = `## 模型切换 - ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
- **原因**: 阿里云API健康检查失败
- **切换至**: ${targetModel.name}
- **时间**: ${new Date().toISOString()}

`;
  
  let logContent = '';
  if (fs.existsSync(LOG_PATH)) {
    logContent = fs.readFileSync(LOG_PATH, 'utf-8');
  }
  
  fs.writeFileSync(LOG_PATH, logEntry + logContent, 'utf-8');
}

/**
 * 主函数：健康检查与自动切换
 */
async function main() {
  console.log(`[${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}] 开始健康检查...`);
  
  const health = await checkAliyunHealth();
  
  if (health.healthy) {
    console.log(`✅ 阿里云API正常 (状态码: ${health.statusCode})`);
    
    // 如果当前是备用模型且阿里云已恢复，可以切换回来（可选）
    if (currentModel === MODELS.backup) {
      console.log('ℹ️  阿里云已恢复，但保持使用DeepSeek（避免频繁切换）');
    }
  } else {
    console.log(`❌ 阿里云API异常: ${health.error || health.statusCode}`);
    
    // 如果当前使用的是阿里云模型，切换到DeepSeek
    if (currentModel === MODELS.primary) {
      console.log('🔄 正在自动切换到DeepSeek备用模型...');
      switchModel(MODELS.backup);
      console.log('✅ 已切换到 DeepSeek');
    } else {
      console.log('ℹ️  已在使用DeepSeek，无需切换');
    }
  }
  
  console.log(`当前模型: ${currentModel.name}`);
}

// 执行
main().catch(console.error);
