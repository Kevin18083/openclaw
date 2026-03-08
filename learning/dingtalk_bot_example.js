/**
 * 钉钉机器人示例代码
 * 学习目标：掌握钉钉机器人基本开发
 * 创建时间：2026-03-06
 */

const crypto = require('crypto');
const axios = require('axios');

/**
 * 钉钉机器人工具类
 */
class DingTalkBot {
  /**
   * 构造函数
   * @param {string} webhook - 钉钉机器人Webhook URL
   * @param {string} secret - 签名密钥（可选）
   */
  constructor(webhook, secret = '') {
    this.webhook = webhook;
    this.secret = secret;
  }

  /**
   * 生成签名
   * @param {number} timestamp - 时间戳
   * @returns {string} 签名
   */
  generateSign(timestamp) {
    if (!this.secret) return '';
    
    const stringToSign = `${timestamp}\n${this.secret}`;
    const hmac = crypto.createHmac('sha256', this.secret);
    hmac.update(stringToSign);
    return encodeURIComponent(hmac.digest('base64'));
  }

  /**
   * 发送文本消息
   * @param {string} content - 消息内容
   * @param {Array} atMobiles - @的手机号数组
   * @param {boolean} isAtAll - 是否@所有人
   * @returns {Promise} 发送结果
   */
  async sendText(content, atMobiles = [], isAtAll = false) {
    const timestamp = Date.now();
    let url = this.webhook;
    
    // 如果有签名密钥，添加签名参数
    if (this.secret) {
      const sign = this.generateSign(timestamp);
      url += `&timestamp=${timestamp}&sign=${sign}`;
    }

    const message = {
      msgtype: 'text',
      text: {
        content: content
      },
      at: {
        atMobiles: atMobiles,
        isAtAll: isAtAll
      }
    };

    try {
      const response = await axios.post(url, message, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('发送钉钉消息失败:', error.message);
      throw error;
    }
  }

  /**
   * 发送Markdown消息
   * @param {string} title - 标题
   * @param {string} text - Markdown内容
   * @param {Array} atMobiles - @的手机号数组
   * @param {boolean} isAtAll - 是否@所有人
   * @returns {Promise} 发送结果
   */
  async sendMarkdown(title, text, atMobiles = [], isAtAll = false) {
    const timestamp = Date.now();
    let url = this.webhook;
    
    if (this.secret) {
      const sign = this.generateSign(timestamp);
      url += `&timestamp=${timestamp}&sign=${sign}`;
    }

    const message = {
      msgtype: 'markdown',
      markdown: {
        title: title,
        text: text
      },
      at: {
        atMobiles: atMobiles,
        isAtAll: isAtAll
      }
    };

    try {
      const response = await axios.post(url, message);
      return response.data;
    } catch (error) {
      console.error('发送Markdown消息失败:', error.message);
      throw error;
    }
  }

  /**
   * 发送ActionCard消息（交互卡片）
   * @param {string} title - 标题
   * @param {string} text - 内容
   * @param {Array} btns - 按钮数组 [{title, actionURL}]
   * @param {string} btnOrientation - 按钮排列方向 0-竖直，1-横向
   * @returns {Promise} 发送结果
   */
  async sendActionCard(title, text, btns, btnOrientation = '0') {
    const message = {
      msgtype: 'actionCard',
      actionCard: {
        title: title,
        text: text,
        btns: btns,
        btnOrientation: btnOrientation
      }
    };

    try {
      const response = await axios.post(this.webhook, message);
      return response.data;
    } catch (error) {
      console.error('发送ActionCard消息失败:', error.message);
      throw error;
    }
  }

  /**
   * 发送FeedCard消息（链接卡片）
   * @param {Array} links - 链接数组 [{title, messageURL, picURL}]
   * @returns {Promise} 发送结果
   */
  async sendFeedCard(links) {
    const message = {
      msgtype: 'feedCard',
      feedCard: {
        links: links
      }
    };

    try {
      const response = await axios.post(this.webhook, message);
      return response.data;
    } catch (error) {
      console.error('发送FeedCard消息失败:', error.message);
      throw error;
    }
  }
}

/**
 * Webhook接收服务器示例
 */
class WebhookServer {
  constructor(port = 3000) {
    this.port = port;
    this.bot = null;
  }

  /**
   * 设置机器人实例
   * @param {DingTalkBot} bot - 钉钉机器人实例
   */
  setBot(bot) {
    this.bot = bot;
  }

  /**
   * 启动服务器
   */
  start() {
    const http = require('http');
    
    const server = http.createServer(async (req, res) => {
      // 只处理POST请求
      if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          
          // 处理不同类型的消息
          const result = await this.handleMessage(data);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, result }));
        } catch (error) {
          console.error('处理请求失败:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    });

    server.listen(this.port, () => {
      console.log(`Webhook服务器运行在 http://localhost:${this.port}`);
      console.log('等待钉钉消息推送...');
    });
  }

  /**
   * 处理接收到的消息
   * @param {Object} data - 消息数据
   * @returns {Object} 处理结果
   */
  async handleMessage(data) {
    // 这里可以根据实际需求处理消息
    // 例如：命令解析、任务执行、回复消息等
    
    console.log('收到消息:', JSON.stringify(data, null, 2));
    
    // 示例：简单回复
    if (this.bot && data.text && data.text.content) {
      const userMessage = data.text.content;
      let reply = '收到你的消息了！';
      
      // 简单命令处理
      if (userMessage.includes('帮助') || userMessage.includes('help')) {
        reply = '可用命令：\n1. 帮助 - 显示帮助信息\n2. 状态 - 查看系统状态\n3. 备份 - 执行备份操作';
      } else if (userMessage.includes('状态')) {
        reply = '系统状态：正常\n运行时间：24小时\n内存使用：256MB';
      } else if (userMessage.includes('备份')) {
        reply = '正在执行备份操作...';
        // 这里可以触发实际的备份操作
      }
      
      // 发送回复
      await this.bot.sendText(reply);
    }
    
    return { processed: true, timestamp: Date.now() };
  }
}

/**
 * 使用示例
 */
async function exampleUsage() {
  console.log('=== 钉钉机器人开发示例 ===\n');
  
  // 1. 创建机器人实例
  const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN';
  const secret = 'YOUR_SECRET'; // 如果有签名密钥
  
  const bot = new DingTalkBot(webhook, secret);
  
  // 2. 发送文本消息示例
  console.log('1. 发送文本消息...');
  try {
    const textResult = await bot.sendText(
      '你好，我是扎克助手！\n当前时间：' + new Date().toLocaleString(),
      [], // @的手机号数组
      false // 不@所有人
    );
    console.log('文本消息发送结果:', textResult);
  } catch (error) {
    console.log('文本消息发送失败（正常，因为没有真实token）');
  }
  
  // 3. 发送Markdown消息示例
  console.log('\n2. 发送Markdown消息...');
  const markdownContent = `# 系统状态报告
  
## 运行状态
- ✅ 服务正常
- ⏰ 运行时间: 24小时
- 💾 内存使用: 256MB

## 今日任务
1. 完成代码学习计划
2. 测试钉钉机器人集成
3. 优化系统性能

[查看详情](https://example.com)`;
  
  try {
    const mdResult = await bot.sendMarkdown('每日报告', markdownContent);
    console.log('Markdown消息发送结果:', mdResult);
  } catch (error) {
    console.log('Markdown消息发送失败（正常）');
  }
  
  // 4. 启动Webhook服务器示例
  console.log('\n3. 启动Webhook服务器...');
  const server = new WebhookServer(3000);
  server.setBot(bot);
  
  // 在实际使用中取消注释
  // server.start();
  
  console.log('\n=== 示例代码学习完成 ===');
  console.log('学习要点：');
  console.log('1. 钉钉机器人消息类型：text, markdown, actionCard, feedCard');
  console.log('2. 安全签名机制：使用secret生成签名');
  console.log('3. Webhook接收：处理钉钉推送的消息');
  console.log('4. 异步处理：使用async/await处理API调用');
}

// 运行示例
if (require.main === module) {
  exampleUsage().catch(console.error);
}

module.exports = {
  DingTalkBot,
  WebhookServer
};