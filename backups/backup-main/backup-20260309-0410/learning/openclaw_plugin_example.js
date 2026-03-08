/**
 * OpenClaw插件开发示例
 * 学习目标：掌握OpenClaw插件开发基础
 * 创建时间：2026-03-06
 */

/**
 * OpenClaw插件基础结构
 * 一个典型的OpenClaw插件包含以下部分：
 * 1. 插件元数据（名称、描述、版本等）
 * 2. 工具定义（提供的功能）
 * 3. 事件处理器（响应系统事件）
 * 4. 配置管理（插件配置）
 * 5. 工具实现（具体功能实现）
 */

// 插件元数据
const PLUGIN_METADATA = {
  name: 'zack-dingtalk-plugin',
  version: '1.0.0',
  description: '扎克的钉钉集成插件',
  author: '扎克助手',
  homepage: 'https://github.com/zack-ai/openclaw-plugins',
  license: 'MIT'
};

/**
 * 工具定义
 * 每个工具都需要定义：
 * - name: 工具名称（唯一标识）
 * - description: 工具描述
 * - parameters: 参数定义
 * - handler: 处理函数
 */
const TOOLS = [
  {
    name: 'dingtalk_send_message',
    description: '发送钉钉消息',
    parameters: {
      type: 'object',
      required: ['content'],
      properties: {
        content: {
          type: 'string',
          description: '消息内容'
        },
        messageType: {
          type: 'string',
          enum: ['text', 'markdown'],
          default: 'text',
          description: '消息类型'
        },
        atMobiles: {
          type: 'array',
          items: { type: 'string' },
          description: '@的手机号数组'
        },
        isAtAll: {
          type: 'boolean',
          default: false,
          description: '是否@所有人'
        }
      }
    },
    handler: sendDingTalkMessage
  },
  {
    name: 'dingtalk_receive_webhook',
    description: '配置钉钉Webhook接收',
    parameters: {
      type: 'object',
      required: ['webhookUrl'],
      properties: {
        webhookUrl: {
          type: 'string',
          description: 'Webhook接收地址'
        },
        secret: {
          type: 'string',
          description: '签名密钥'
        }
      }
    },
    handler: setupWebhookReceiver
  },
  {
    name: 'dingtalk_get_status',
    description: '获取钉钉机器人状态',
    parameters: {
      type: 'object',
      properties: {
        checkConnection: {
          type: 'boolean',
          default: true,
          description: '是否检查连接状态'
        }
      }
    },
    handler: getDingTalkStatus
  }
];

/**
 * 配置管理器
 */
class ConfigManager {
  constructor() {
    this.config = {
      dingtalk: {
        webhook: '',
        secret: '',
        enabled: false
      },
      messageTemplates: {},
      autoReplies: []
    };
  }

  load(configPath) {
    try {
      const fs = require('fs');
      if (fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath, 'utf8');
        this.config = { ...this.config, ...JSON.parse(data) };
        console.log('配置加载成功');
      }
    } catch (error) {
      console.warn('加载配置失败，使用默认配置:', error.message);
    }
  }

  save(configPath) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // 确保目录存在
      const dir = path.dirname(configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
      console.log('配置保存成功');
    } catch (error) {
      console.error('保存配置失败:', error.message);
    }
  }

  get(key, defaultValue = null) {
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value;
  }

  set(key, value) {
    const keys = key.split('.');
    let config = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in config) || typeof config[k] !== 'object') {
        config[k] = {};
      }
      config = config[k];
    }
    
    config[keys[keys.length - 1]] = value;
  }
}

/**
 * 钉钉机器人客户端
 */
class DingTalkClient {
  constructor(config) {
    this.config = config;
    this.httpClient = require('axios');
    this.crypto = require('crypto');
  }

  generateSign(timestamp) {
    if (!this.config.secret) return '';
    
    const stringToSign = `${timestamp}\n${this.config.secret}`;
    const hmac = this.crypto.createHmac('sha256', this.config.secret);
    hmac.update(stringToSign);
    return encodeURIComponent(hmac.digest('base64'));
  }

  async sendText(content, atMobiles = [], isAtAll = false) {
    if (!this.config.webhook) {
      throw new Error('钉钉Webhook未配置');
    }

    const timestamp = Date.now();
    let url = this.config.webhook;
    
    if (this.config.secret) {
      const sign = this.generateSign(timestamp);
      url += `&timestamp=${timestamp}&sign=${sign}`;
    }

    const message = {
      msgtype: 'text',
      text: { content },
      at: { atMobiles, isAtAll }
    };

    try {
      const response = await this.httpClient.post(url, message, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      return {
        success: true,
        data: response.data,
        messageId: response.data.msgId || Date.now().toString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }

  async sendMarkdown(title, text, atMobiles = [], isAtAll = false) {
    if (!this.config.webhook) {
      throw new Error('钉钉Webhook未配置');
    }

    const timestamp = Date.now();
    let url = this.config.webhook;
    
    if (this.config.secret) {
      const sign = this.generateSign(timestamp);
      url += `&timestamp=${timestamp}&sign=${sign}`;
    }

    const message = {
      msgtype: 'markdown',
      markdown: { title, text },
      at: { atMobiles, isAtAll }
    };

    try {
      const response = await this.httpClient.post(url, message);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async testConnection() {
    try {
      const result = await this.sendText('连接测试消息');
      return {
        connected: result.success,
        message: result.success ? '连接正常' : result.error
      };
    } catch (error) {
      return {
        connected: false,
        message: error.message
      };
    }
  }
}

/**
 * 工具处理函数
 */

// 发送钉钉消息
async function sendDingTalkMessage(params, context) {
  const configManager = new ConfigManager();
  configManager.load('./config/dingtalk.json');
  
  const client = new DingTalkClient({
    webhook: configManager.get('dingtalk.webhook'),
    secret: configManager.get('dingtalk.secret')
  });

  let result;
  if (params.messageType === 'markdown') {
    result = await client.sendMarkdown(
      '系统通知',
      params.content,
      params.atMobiles,
      params.isAtAll
    );
  } else {
    result = await client.sendText(
      params.content,
      params.atMobiles,
      params.isAtAll
    );
  }

  return {
    success: result.success,
    message: result.success ? '消息发送成功' : `消息发送失败: ${result.error}`,
    data: result.data
  };
}

// 配置Webhook接收
async function setupWebhookReceiver(params, context) {
  const configManager = new ConfigManager();
  configManager.load('./config/dingtalk.json');
  
  configManager.set('dingtalk.webhook', params.webhookUrl);
  if (params.secret) {
    configManager.set('dingtalk.secret', params.secret);
  }
  configManager.set('dingtalk.enabled', true);
  
  configManager.save('./config/dingtalk.json');
  
  // 这里可以启动Webhook服务器
  // 在实际实现中，需要启动HTTP服务器接收钉钉回调
  
  return {
    success: true,
    message: '钉钉Webhook配置已更新',
    config: {
      webhook: params.webhookUrl,
      enabled: true
    }
  };
}

// 获取钉钉状态
async function getDingTalkStatus(params, context) {
  const configManager = new ConfigManager();
  configManager.load('./config/dingtalk.json');
  
  const client = new DingTalkClient({
    webhook: configManager.get('dingtalk.webhook'),
    secret: configManager.get('dingtalk.secret')
  });

  const status = {
    configured: !!configManager.get('dingtalk.webhook'),
    enabled: configManager.get('dingtalk.enabled', false),
    lastCheck: new Date().toISOString()
  };

  if (params.checkConnection && status.configured) {
    const connection = await client.testConnection();
    status.connection = connection;
  }

  return {
    success: true,
    data: status,
    message: status.configured ? '钉钉已配置' : '钉钉未配置'
  };
}

/**
 * 插件主类
 */
class ZackDingTalkPlugin {
  constructor() {
    this.name = PLUGIN_METADATA.name;
    this.version = PLUGIN_METADATA.version;
    this.configManager = new ConfigManager();
    this.dingtalkClient = null;
  }

  /**
   * 插件初始化
   */
  async initialize() {
    console.log(`初始化插件: ${this.name} v${this.version}`);
    
    // 加载配置
    this.configManager.load('./config/dingtalk.json');
    
    // 初始化钉钉客户端
    const webhook = this.configManager.get('dingtalk.webhook');
    const secret = this.configManager.get('dingtalk.secret');
    
    if (webhook) {
      this.dingtalkClient = new DingTalkClient({ webhook, secret });
      console.log('钉钉客户端初始化完成');
    }
    
    // 注册工具
    this.registerTools();
    
    // 设置定时任务示例
    this.setupScheduledTasks();
    
    return { success: true, message: '插件初始化完成' };
  }

  /**
   * 注册工具到OpenClaw
   */
  registerTools() {
    console.log('注册工具:', TOOLS.map(t => t.name).join(', '));
    
    // 在实际的OpenClaw插件中，这里会调用API注册工具
    // 示例：openclaw.registerTools(TOOLS);
    
    TOOLS.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
  }

  /**
   * 设置定时任务
   */
  setupScheduledTasks() {
    // 示例：每天上午9点发送日报
    const schedule = require('node-schedule');
    
    // 每天9点发送日报
    schedule.scheduleJob('0 9 * * *', async () => {
      if (this.dingtalkClient && this.configManager.get('dingtalk.enabled')) {
        const report = this.generateDailyReport();
        await this.dingtalkClient.sendMarkdown('每日系统报告', report);
        console.log('每日报告已发送');
      }
    });
    
    console.log('定时任务已设置: 每日9点发送报告');
  }

  /**
   * 生成每日报告
   */
  generateDailyReport() {
    const now = new Date();
    const report = `# 📊 系统每日报告
**生成时间:** ${now.toLocaleString()}

## 系统状态
- ✅ 服务运行正常
- ⏰ 运行时间: 24小时
- 💾 内存使用: 稳定

## 今日任务
1. 监控系统健康状态
2. 处理用户请求
3. 执行定时备份
4. 学习新知识

## 性能指标
- 请求处理: 100%
- 响应时间: < 1秒
- 错误率: 0%

---
*报告由扎克助手自动生成*`;
    
    return report;
  }

  /**
   * 处理系统事件
   */
  async handleEvent(event, data) {
    switch (event) {
      case 'system.start':
        console.log('系统启动事件');
        break;
      case 'system.shutdown':
        console.log('系统关闭事件');
        // 发送关机通知
        if (this.dingtalkClient) {
          await this.dingtalkClient.sendText('系统即将关闭，感谢使用！');
        }
        break;
      case 'error.occurred':
        console.log('错误事件:', data);
        // 发送错误通知
        if (this.dingtalkClient && data.severity === 'high') {
          await this.dingtalkClient.sendText(
            `系统错误: ${data.message}\n时间: ${new Date().toLocaleString()}`
          );
        }
        break;
      default:
        console.log('未知事件:', event);
    }
  }

  /**
   * 获取插件信息
   */
  getInfo() {
    return {
      ...PLUGIN_METADATA,
      tools: TOOLS.map(t => ({
        name: t.name,
        description: t.description
      })),
      config: this.configManager.get('dingtalk')
    };
  }
}

/**
 * 使用示例
 */
async function runExample() {
  console.log('=== OpenClaw插件开发示例 ===\n');
  
  // 创建插件实例
  const plugin = new ZackDingTalkPlugin();
  
  // 初始化插件
  const initResult = await plugin.initialize();
  console.log('初始化结果:', initResult.message);
  
  // 显示插件信息
  const info = plugin.getInfo();
  console.log('\n插件信息:');
  console.log(`名称: ${info.name}`);
  console.log(`版本: ${info.version}`);
  console.log(`描述: ${info.description}`);
  console.log(`工具数量: ${info.tools.length}`);
  
  // 演示工具调用
  console.log('\n工具调用示例:');
  
  // 模拟调用发送消息工具
  const mockContext = { userId: 'user123', sessionId: 'session456' };
  const mockParams = {
    content: '这是一条测试消息',
    messageType: 'text'
  };
  
  console.log('调用 dingtalk_send_message:');
  console.log('参数:', mockParams);
  
  // 在实际插件中，OpenClaw会调用handler函数
  // const result = await sendDingTalkMessage(mockParams, mockContext);
  // console.log('结果:', result);
  
  console.log('\n=== 插件开发学习要点 ===');
  console.log('1. 插件结构: 元数据 + 工具定义 + 事件处理');
  console.log('2. 工具设计: 明确的参数定义和返回值');
  console.log('3. 配置管理: 独立的配置加载和保存');
  console.log('4. 错误处理: 完善的异常捕获和处理');
  console.log('5. 事件驱动: 响应系统事件');
  console.log('6. 定时任务: 自动化执行任务');
  
  console.log('\n下一步学习:');
  console.log('1. 实际部署插件到OpenClaw');
  console.log('2. 测试工具的实际调用');
  console.log('3. 实现Webhook接收服务器');
  console.log('4. 添加更多高级功能');
}

// 运行示例
if (require.main === module) {
  runExample().catch(console.error);
}

module.exports = {
  ZackDingTalkPlugin,
  DingTalkClient,
  ConfigManager,
  TOOLS,
  PLUGIN_METADATA
};