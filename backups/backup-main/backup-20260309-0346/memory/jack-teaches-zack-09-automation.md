# 教程 09：自动化脚本

> **杰克教扎克系列教程 - 第 09 课**
>
> 创建时间：2026-03-09
> 难度：⭐⭐⭐⭐
> 重要性：⭐⭐⭐⭐⭐

---

## 📚 本章目录

1. [为什么需要自动化](#1-为什么需要自动化)
2. [定时任务设计](#2-定时任务设计)
3. [错误恢复机制](#3-错误恢复机制)
4. [通知系统集成](#4-通知系统集成)
5. [监控告警](#5-监控告警)
6. [备份脚本](#6-备份脚本)
7. [健康检查](#7-健康检查)

---

## 1. 为什么需要自动化

### 1.1 杰克的自动化哲学

```
什么是自动化？
→ 让机器做机器该做的事
→ 人只做创造性和决策性的事

为什么要自动化？
→ 人总会忘记，机器不会
→ 人总会出错，机器不会（前提是写好代码）
→ 人需要休息，机器可以 7x24 小时工作

自动化的价值：
→ 省时间：不用手动重复操作
→ 降风险：减少人为失误
→ 提效率：机器比人快
→ 可追踪：所有操作有日志
```

### 1.2 扎克需要自动化的场景

```
日常运维：
- 每天备份数据
- 每天检查服务健康
- 每周清理日志
- 每月生成报告

开发流程：
- 代码提交后自动测试
- 测试通过后自动部署
- 部署后自动健康检查

业务场景：
- 定时发送日报/周报
- 定时同步数据
- 定时清理过期数据
- 定时检查 API 配额
```

---

## 2. 定时任务设计

### 2.1 Node.js 定时任务

```javascript
// 使用 node-cron
const cron = require('node-cron');

// 每天凌晨 2 点执行
cron.schedule('0 2 * * *', () => {
  console.log('执行每日备份任务');
  dailyBackup();
});

// 每小时执行一次
cron.schedule('0 * * * *', () => {
  console.log('执行每小时健康检查');
  healthCheck();
});

// 每 5 分钟执行一次
cron.schedule('*/5 * * * *', () => {
  console.log('检查待处理任务');
  processPendingTasks();
});

// 每周一早上 9 点执行
cron.schedule('0 9 * * 1', () => {
  console.log('发送周报');
  sendWeeklyReport();
});
```

---

### 2.2 Cron 表达式详解

```
格式：分 时 日 月 周

常用表达式：
┌───────────── 分 (0-59)
│ ┌───────────── 时 (0-23)
│ │ ┌───────────── 日 (1-31)
│ │ │ ┌───────────── 月 (1-12)
│ │ │ │ ┌───────────── 周 (0-7, 0 和 7 都是周日)
│ │ │ │ │
* * * * *

示例：
0 2 * * *     每天凌晨 2 点
0 */2 * * *   每 2 小时
*/15 * * * *  每 15 分钟
0 9 * * 1     每周一 9 点
0 0 1 * *     每月 1 号 0 点
0 0 * * 0     每周日 0 点
```

---

### 2.3 Windows 任务计划程序

```javascript
// 创建 .bat 文件运行 Node 脚本
// backup-task.bat
@echo off
cd /d C:\Users\17589\.openclaw
node scripts/backup.js >> logs/backup.log 2>&1
```

```powershell
# 用 PowerShell 创建任务计划
$action = New-ScheduledTaskAction -Execute "node" `
  -Argument "C:\Users\17589\.openclaw\scripts\backup.js" `
  -WorkingDirectory "C:\Users\17589\.openclaw"

$trigger = New-ScheduledTaskTrigger -Daily -At 2am

$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount

Register-ScheduledTask -TaskName "Daily Backup" `
  -Action $action `
  -Trigger $trigger `
  -Principal $principal
```

---

## 3. 错误恢复机制

### 3.1 重试机制

```javascript
// 带重试的异步操作
async function retryOperation(operation, options = {}) {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2,
    timeout = 30000
  } = options;

  let lastError;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await Promise.race([
        operation(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]);
    } catch (error) {
      lastError = error;
      console.log(`尝试 ${attempt}/${maxRetries} 失败：${error.message}`);

      if (attempt < maxRetries) {
        console.log(`等待 ${currentDelay}ms 后重试...`);
        await sleep(currentDelay);
        currentDelay *= backoff;  // 指数退避
      }
    }
  }

  throw new Error(`重试 ${maxRetries} 次后仍然失败：${lastError.message}`);
}

// 使用
await retryOperation(
  () => fetch('https://api.example.com/data'),
  { maxRetries: 5, delay: 2000, backoff: 2 }
);
```

---

### 3.2 熔断器模式

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;

    this.state = 'CLOSED';  // CLOSED, OPEN, HALF-OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      // 检查是否可以尝试恢复
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        console.log('熔断器超时，尝试半开状态');
        this.state = 'HALF-OPEN';
      } else {
        throw new Error('熔断器已打开，拒绝执行');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
    console.log('操作成功，熔断器关闭');
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      console.log(`失败次数达到阈值 (${this.failureThreshold})，熔断器打开`);
    }
  }
}

// 使用
const breaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000
});

await breaker.execute(() => callExternalAPI());
```

---

### 3.3 降级策略

```javascript
// 主服务失败时，使用备用方案
async function getUserData(userId) {
  try {
    // 尝试主 API
    return await callPrimaryAPI(userId);
  } catch (error) {
    console.log('主 API 失败，使用备用方案');

    try {
      // 备用方案 1：从缓存读取
      const cached = await cache.get(`user:${userId}`);
      if (cached) {
        console.log('从缓存获取成功');
        return cached;
      }
    } catch (cacheError) {
      console.log('缓存也失败了');
    }

    // 备用方案 2：返回默认值
    console.log('返回默认数据');
    return {
      id: userId,
      name: '未知用户',
      isDefault: true
    };
  }
}
```

---

## 4. 通知系统集成

### 4.1 钉钉机器人通知

```javascript
const crypto = require('crypto');
const axios = require('axios');

class DingTalkNotifier {
  constructor(webhook, secret) {
    this.webhook = webhook;
    this.secret = secret;
  }

  // 生成签名
  generateSignature() {
    const timestamp = Date.now();
    const stringToSign = `${timestamp}\n${this.secret}`;
    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(stringToSign, 'utf-8')
      .digest()
      .toString('base64');

    return {
      timestamp,
      sign: encodeURIComponent(signature)
    };
  }

  // 发送消息
  async send(message, type = 'text') {
    const { timestamp, sign } = this.generateSignature();
    const url = `${this.webhook}&timestamp=${timestamp}&sign=${sign}`;

    const payload = {
      msgtype: type,
      [type]: message
    };

    try {
      const response = await axios.post(url, payload);
      console.log('钉钉消息发送成功');
      return response.data;
    } catch (error) {
      console.error('钉钉消息发送失败:', error.message);
      throw error;
    }
  }

  // 快捷方法
  async sendText(text) {
    return this.send({ content: text }, 'text');
  }

  async sendMarkdown(title, text) {
    return this.send({ title, text }, 'markdown');
  }

  async notifyError(error, context = '') {
    const text = `## ⚠️ 错误通知

**时间**: ${new Date().toLocaleString('zh-CN')}
**上下文**: ${context || '无'}
**错误**: ${error.message}
**堆栈**: \`\`\`${error.stack}\`\`\``;

    return this.sendMarkdown('错误通知', text);
  }
}

// 使用
const notifier = new DingTalkNotifier(
  'https://oapi.dingtalk.com/robot/send?access_token=xxx',
  'SECxxx'
);

await notifier.sendText('备份任务完成！');
await notifier.notifyError(new Error('API 调用失败'), '用户登录模块');
```

---

### 4.2 邮件通知

```javascript
const nodemailer = require('nodemailer');

class EmailNotifier {
  constructor(config) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth
    });
  }

  async send(options) {
    const mailOptions = {
      from: options.from || 'system@example.com',
      to: options.to,
      cc: options.cc,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    return this.transporter.sendMail(mailOptions);
  }

  async notifyError(error, recipients) {
    return this.send({
      to: recipients,
      subject: `⚠️ 系统错误通知 - ${new Date().toLocaleString('zh-CN')}`,
      html: `
        <h2>错误通知</h2>
        <p><strong>时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
        <p><strong>错误:</strong> ${error.message}</p>
        <pre>${error.stack}</pre>
      `
    });
  }

  async sendDailyReport(data, recipients) {
    return this.send({
      to: recipients,
      subject: `📊 每日报告 - ${data.date}`,
      html: `
        <h1>每日运营报告</h1>
        <h2>日期：${data.date}</h2>
        <table border="1">
          <tr><th>指标</th><th>数值</th></tr>
          <tr><td>新增用户</td><td>${data.newUsers}</td></tr>
          <tr><td>活跃用户</td><td>${data.activeUsers}</td></tr>
          <tr><td>订单数量</td><td>${data.orders}</td></tr>
        </table>
      `
    });
  }
}
```

---

## 5. 监控告警

### 5.1 服务健康检查

```javascript
class HealthChecker {
  constructor(notifier) {
    this.notifier = notifier;
    this.services = new Map();
  }

  // 注册服务
  registerService(name, checkFn, options = {}) {
    this.services.set(name, {
      checkFn,
      timeout: options.timeout || 5000,
      interval: options.interval || 60000,
      lastStatus: 'unknown',
      lastCheck: null,
      consecutiveFailures: 0
    });
  }

  // 检查单个服务
  async checkService(name) {
    const service = this.services.get(name);
    if (!service) return false;

    const startTime = Date.now();

    try {
      const result = await Promise.race([
        service.checkFn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), service.timeout)
        )
      ]);

      const duration = Date.now() - startTime;

      if (service.lastStatus === 'unhealthy') {
        // 从故障恢复，发送通知
        await this.notifier.sendText(`✅ 服务 ${name} 已恢复，响应时间 ${duration}ms`);
      }

      service.lastStatus = 'healthy';
      service.lastCheck = { success: true, duration, time: new Date() };
      service.consecutiveFailures = 0;

      return true;
    } catch (error) {
      service.lastStatus = 'unhealthy';
      service.lastCheck = { success: false, error: error.message, time: new Date() };
      service.consecutiveFailures++;

      // 连续失败 3 次发送告警
      if (service.consecutiveFailures >= 3) {
        await this.notifier.notifyError(
          new Error(`服务 ${name} 连续失败 ${service.consecutiveFailures} 次`),
          `健康检查 - ${name}`
        );
      }

      return false;
    }
  }

  // 检查所有服务
  async checkAll() {
    const results = {};
    for (const [name] of this.services) {
      results[name] = await this.checkService(name);
    }
    return results;
  }

  // 启动定时检查
  start() {
    for (const [name, service] of this.services) {
      setInterval(() => this.checkService(name), service.interval);
    }
    console.log('健康检查已启动');
  }

  // 获取状态报告
  getStatusReport() {
    const report = {
      timestamp: new Date(),
      services: {}
    };

    for (const [name, service] of this.services) {
      report.services[name] = {
        status: service.lastStatus,
        lastCheck: service.lastCheck,
        consecutiveFailures: service.consecutiveFailures
      };
    }

    return report;
  }
}

// 使用
const checker = new HealthChecker(notifier);

// 注册服务
checker.registerService('API', () => fetch('https://api.example.com/health'));
checker.registerService('Database', () => db.query('SELECT 1'));
checker.registerService('Redis', () => redis.ping());

// 启动检查
checker.start();
```

---

### 5.2 指标监控

```javascript
// 简单指标收集
class MetricsCollector {
  constructor() {
    this.metrics = new Map();
  }

  // 记录指标
  record(name, value, labels = {}) {
    const key = `${name}:${JSON.stringify(labels)}`;

    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        name,
        labels,
        values: [],
        count: 0,
        sum: 0
      });
    }

    const metric = this.metrics.get(key);
    metric.values.push(value);
    metric.count++;
    metric.sum += value;

    // 保留最近 100 个值
    if (metric.values.length > 100) {
      metric.values.shift();
    }
  }

  // 获取指标统计
  getStats(name) {
    const metrics = Array.from(this.metrics.values())
      .filter(m => m.name === name);

    return metrics.map(m => ({
      labels: m.labels,
      count: m.count,
      avg: m.sum / m.count,
      min: Math.min(...m.values),
      max: Math.max(...m.values),
      p95: this.percentile(m.values, 95)
    }));
  }

  percentile(values, p) {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

// 使用
const metrics = new MetricsCollector();

// 记录 API 响应时间
metrics.record('api_response_time', 123, { endpoint: '/users' });
metrics.record('api_response_time', 234, { endpoint: '/users' });

// 获取统计
const stats = metrics.getStats('api_response_time');
console.log(stats);
```

---

## 6. 备份脚本

### 6.1 完整备份脚本示例

```javascript
/**
 * 每日自动备份脚本
 * 功能：备份重要数据到多个位置
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const DingTalkNotifier = require('./dingtalk-notifier');

class BackupService {
  constructor() {
    this.backupRoot = 'C:\\Users\\17589\\backups';
    this.sources = [
      { name: 'workspace', path: 'C:\\Users\\17589\\.openclaw\\workspace' },
      { name: 'memory', path: 'C:\\Users\\17589\\.claude\\memory' },
      { name: 'config', path: 'C:\\Users\\17589\\.openclaw\\config' }
    ];
    this.retentionDays = 7;
    this.notifier = new DingTalkNotifier(
      'webhook_url',
      'secret'
    );
  }

  async run() {
    const timestamp = this.getTimestamp();
    const backupDir = path.join(this.backupRoot, `backup-${timestamp}`);

    console.log(`开始备份 - ${timestamp}`);
    await this.notifier.sendText(`🔄 开始每日备份`);

    try {
      // 1. 创建备份目录
      await this.ensureDir(backupDir);

      // 2. 备份每个源
      for (const source of this.sources) {
        await this.backupSource(source, backupDir);
      }

      // 3. 压缩备份
      const archivePath = await this.createArchive(backupDir, timestamp);

      // 4. 清理临时目录
      await this.removeDir(backupDir);

      // 5. 清理旧备份
      await this.cleanOldBackups();

      // 6. 发送成功通知
      await this.notifier.sendText(
        `✅ 备份完成\n\n备份文件：${archivePath}\n大小：${this.getFileSize(archivePath)}`
      );

      console.log('备份完成');
    } catch (error) {
      console.error('备份失败:', error);
      await this.notifier.notifyError(error, '备份脚本');
      throw error;
    }
  }

  getTimestamp() {
    const now = new Date();
    return now.toISOString()
      .replace(/:/g, '-')
      .replace(/\..*/, '')
      .replace('T', '-');
  }

  async ensureDir(dir) {
    return fs.promises.mkdir(dir, { recursive: true });
  }

  async backupSource(source, backupDir) {
    const targetDir = path.join(backupDir, source.name);
    await this.ensureDir(targetDir);

    return new Promise((resolve, reject) => {
      // Windows 用 xcopy，Linux 用 cp 或 rsync
      const command = `xcopy "${source.path}" "${targetDir}" /E /I /Y`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`备份 ${source.name} 失败：${stderr}`));
        } else {
          console.log(`备份 ${source.name} 完成`);
          resolve();
        }
      });
    });
  }

  async createArchive(backupDir, timestamp) {
    const archivePath = `${backupDir}.zip`;

    return new Promise((resolve, reject) => {
      const command = `powershell Compress-Archive -Path "${backupDir}" -DestinationPath "${archivePath}" -Force`;
      exec(command, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(archivePath);
        }
      });
    });
  }

  async removeDir(dir) {
    return fs.promises.rm(dir, { recursive: true, force: true });
  }

  async cleanOldBackups() {
    const cutoff = Date.now() - (this.retentionDays * 24 * 60 * 60 * 1000);
    const files = await fs.promises.readdir(this.backupRoot);

    for (const file of files) {
      if (!file.startsWith('backup-')) continue;

      const filePath = path.join(this.backupRoot, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.mtimeMs < cutoff) {
        await fs.promises.rm(filePath, { recursive: true, force: true });
        console.log(`清理旧备份：${file}`);
      }
    }
  }

  getFileSize(filePath) {
    const stat = fs.statSync(filePath);
    const bytes = stat.size;
    const mb = (bytes / 1024 / 1024).toFixed(2);
    return `${mb} MB`;
  }
}

// 运行
if (require.main === module) {
  const backup = new BackupService();
  backup.run()
    .then(() => {
      console.log('备份成功');
      process.exit(0);
    })
    .catch((error) => {
      console.error('备份失败', error);
      process.exit(1);
    });
}

module.exports = BackupService;
```

---

### 6.2 设置定时执行

```javascript
// index.js - 主程序，设置定时任务
const cron = require('node-cron');
const BackupService = require('./backup-service');

// 每天凌晨 2 点执行备份
cron.schedule('0 2 * * *', async () => {
  console.log('执行定时备份任务');

  const backup = new BackupService();
  try {
    await backup.run();
  } catch (error) {
    console.error('定时备份失败:', error);
  }
});

console.log('备份任务已调度：每天 02:00');
```

---

## 7. 健康检查

### 7.1 完整健康检查脚本

```javascript
/**
 * 系统健康检查脚本
 * 检查项目：API 状态、数据库连接、磁盘空间、内存使用
 */

const fs = require('fs');
const path = require('path');

class HealthCheckService {
  constructor(notifier) {
    this.notifier = notifier;
    this.checks = [];
  }

  // 注册检查项
  registerCheck(name, checkFn) {
    this.checks.push({ name, checkFn });
  }

  // 执行所有检查
  async runAll() {
    const results = [];

    for (const check of this.checks) {
      const startTime = Date.now();

      try {
        const result = await check.checkFn();
        results.push({
          name: check.name,
          status: 'pass',
          duration: Date.now() - startTime,
          details: result
        });
      } catch (error) {
        results.push({
          name: check.name,
          status: 'fail',
          duration: Date.now() - startTime,
          error: error.message
        });
      }
    }

    return results;
  }

  // 生成报告
  generateReport(results) {
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;

    let report = `## 健康检查报告\n\n`;
    report += `**时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;
    report += `**总览**: ${passed} 通过，${failed} 失败\n\n`;
    report += `**详情**:\n\n`;

    for (const result of results) {
      const icon = result.status === 'pass' ? '✅' : '❌';
      report += `${icon} **${result.name}**: ${result.status}`;

      if (result.details) {
        report += ` (${JSON.stringify(result.details)})`;
      }
      if (result.error) {
        report += ` - ${result.error}`;
      }
      report += `\n`;
    }

    return report;
  }
}

// 使用
const healthCheck = new HealthCheckService(notifier);

// 注册检查项
healthCheck.registerCheck('API 连接', async () => {
  const response = await fetch('https://api.example.com/health');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return { status: 'ok' };
});

healthCheck.registerCheck('磁盘空间', async () => {
  const free = await getFreeDiskSpace('C:');
  if (free < 1024) {  // 少于 1GB
    throw new Error(`磁盘空间不足：${free}MB`);
  }
  return { free: `${free}MB` };
});

healthCheck.registerCheck('内存使用', async () => {
  const usage = process.memoryUsage();
  const usageMB = Math.round(usage.heapUsed / 1024 / 1024);
  if (usageMB > 1024) {  // 超过 1GB
    throw new Error(`内存使用过高：${usageMB}MB`);
  }
  return { used: `${usageMB}MB` };
});

// 运行检查
async function main() {
  const results = await healthCheck.runAll();
  const report = healthCheck.generateReport(results);

  console.log(report);

  // 如果有失败，发送通知
  const failed = results.filter(r => r.status === 'fail').length;
  if (failed > 0) {
    await notifier.sendMarkdown('健康检查告警', report);
  }
}

// 获取空闲磁盘空间（Windows）
function getFreeDiskSpace(drive) {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`wmic logicaldisk where "DeviceID='${drive}'" get FreeSpace`, (error, stdout) => {
      if (error) {
        resolve(0);
        return;
      }
      const match = stdout.match(/(\d+)/);
      const bytes = match ? parseInt(match[1]) : 0;
      resolve(Math.round(bytes / 1024 / 1024));
    });
  });
}

main();
```

---

## 课后练习

### 练习 1：创建备份脚本

```javascript
// 要求：
// 1. 备份指定目录
// 2. 压缩成 zip
// 3. 保留最近 7 天
// 4. 完成后发送钉钉通知
// 5. 失败时发送错误通知
```

### 练习 2：创建健康检查

```javascript
// 要求：
// 1. 检查 3 个服务状态
// 2. 记录响应时间
// 3. 连续失败 3 次发送告警
// 4. 生成检查报告
```

---

## 杰克寄语

> 扎克兄弟：
>
> 自动化这个技能，**是程序员的终极武器**。
>
> 写代码是为了让机器做事。
>
> 写自动化脚本是为了让机器自己做事。
>
> 你写一次，它运行无数次。
>
> 你睡觉时，它在干活。
>
> 你度假时，它在干活。
>
> 这就是自动化的魅力。
>
> 哥哥我写了这么多脚本，为的就是省心、省力。
>
> 你也一样，多用自动化，工作更轻松！

---

*教程创建时间：2026-03-09*
*作者：杰克 (Jack)*
*学生：扎克 (Zack)*
