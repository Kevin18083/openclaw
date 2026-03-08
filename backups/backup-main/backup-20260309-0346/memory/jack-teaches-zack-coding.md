# 扎克进阶教程 - 杰克教你写好代码

> **作者**: 杰克 (Jack)
> **学生**: 扎克 (Zack)
> **创建时间**: 2026-03-09
> **目的**: 罗总吩咐 - 把写代码的核心技巧教给扎克

---

## 📚 课程目录

1. [写好代码的核心原则](#1-写好代码的核心原则)
2. [错误处理的最佳实践](#2-错误处理的最佳实践)
3. [代码结构设计](#3-代码结构设计)
4. [日志系统设计](#4-日志系统设计)
5. [配置管理](#5-配置管理)
6. [异步编程模式](#6-异步编程模式)
7. [代码审查清单](#7-代码审查清单)

---

## 1. 写好代码的核心原则

### 1.1 代码是写给人看的

```javascript
// ❌ 糟糕的写法
function a(b, c) { return b + c; }

// ✅ 好的写法
/**
 * 计算两个数的和
 * @param {number} a - 第一个数
 * @param {number} b - 第二个数
 * @returns {number} 两数之和
 */
function add(a, b) {
  return a + b;
}
```

**扎克要点**：
- 函数名要能说明**做什么**
- 参数名要能说明**是什么**
- 写注释不是为了应付谁，是为了**未来的自己**

---

### 1.2 一个函数只做一件事

```javascript
// ❌ 糟糕的写法 - 一个函数做太多事
function processUser(data) {
  // 验证
  if (!data.name) throw new Error('缺少名字');
  // 处理
  const name = data.name.trim();
  const email = data.email.toLowerCase();
  // 保存
  fs.writeFileSync('users.json', JSON.stringify({name, email}));
  // 日志
  console.log('用户已保存');
  // 返回
  return {name, email};
}

// ✅ 好的写法 - 职责分离
function validateUser(data) {
  if (!data.name) throw new Error('缺少名字');
  return true;
}

function normalizeUser(data) {
  return {
    name: data.name.trim(),
    email: data.email.toLowerCase()
  };
}

function saveUser(user) {
  fs.writeFileSync('users.json', JSON.stringify(user));
  log('用户已保存', 'INFO');
  return user;
}

// 主流程清晰
function processUser(data) {
  validateUser(data);
  const normalized = normalizeUser(data);
  return saveUser(normalized);
}
```

**扎克要点**：
- 每个函数**职责单一**
- 主流程**一目了然**
- 函数可以**单独测试**

---

## 2. 错误处理的最佳实践

### 2.1 三层错误处理模型

```javascript
// ==================== 第一层：基础错误捕获 ====================
function safeReadFile(path) {
  try {
    return fs.readFileSync(path, 'utf-8');
  } catch (error) {
    log(`读取文件失败：${path}`, 'ERROR');
    return null;  // 返回 null 表示失败
  }
}

// ==================== 第二层：错误转换 ====================
class ConfigError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'ConfigError';
    this.originalError = originalError;
  }
}

function loadConfig() {
  try {
    const content = safeReadFile('config.json');
    if (!content) {
      throw new ConfigError('配置文件不存在');
    }
    return JSON.parse(content);
  } catch (error) {
    if (error instanceof ConfigError) throw error;
    throw new ConfigError('配置文件解析失败', error);
  }
}

// ==================== 第三层：全局错误处理 ====================
async function main() {
  try {
    await runApplication();
  } catch (error) {
    log(`应用启动失败：${error.message}`, 'ERROR');
    log(`根本原因：${error.originalError?.message}`, 'DEBUG');
    process.exit(1);
  }
}
```

**扎克要点**：
- **第一层**：捕获具体操作的错误
- **第二层**：转换错误类型，便于理解
- **第三层**：全局兜底，优雅退出

---

### 2.2 错误信息要友好

```javascript
// ❌ 糟糕的错误信息
throw new Error('Failed');

// ✅ 好的错误信息
throw new Error(`[配置加载] 文件不存在 - 路径：${configPath}
建议：请检查配置文件是否存在，或运行 init 命令创建默认配置`);

// 扎克可以这样封装
function createError(context, message, suggestion = '') {
  return new Error(`[${context}] ${message}${suggestion ? '\n建议：' + suggestion : ''}`);
}

// 使用
throw createError(
  '配置加载',
  '文件不存在',
  '请检查配置文件是否存在，或运行 init 命令创建默认配置'
);
```

---

### 2.3 错误恢复策略

```javascript
// 策略 1: 降级处理
function getConfig() {
  try {
    return loadConfigFromFile();
  } catch (error) {
    log('配置文件加载失败，使用默认配置', 'WARN');
    return getDefaultConfig();  // 降级到默认配置
  }
}

// 策略 2: 重试机制
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      log(`请求失败，${i + 1}/${maxRetries} 次重试...`, 'WARN');
      await sleep(1000 * (i + 1));  // 指数退避
    }
  }
}

// 策略 3: 熔断模式
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED';
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      throw new Error('熔断器已打开，拒绝执行');
    }
    try {
      const result = await fn();
      this.success();
      return result;
    } catch (error) {
      this.failure();
      throw error;
    }
  }

  success() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  failure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      setTimeout(() => {
        this.state = 'HALF-OPEN';
        this.failureCount = 0;
      }, this.timeout);
    }
  }
}
```

**扎克要点**：
- 不是所有错误都要抛出
- 能恢复的尽量恢复
- 不能恢复的要优雅退出

---

## 3. 代码结构设计

### 3.1 标准文件结构

```javascript
/**
 * 文件头部注释
 * 功能：说明这个文件是干什么的
 * 作者：扎克
 * 创建时间：2026-03-09
 */

// ==================== 依赖导入 ====================
const fs = require('fs');
const path = require('path');

// ==================== 配置常量 ====================
// 大写表示这是常量，不应该被修改
const LOG_DIR = 'C:\\Users\\17589\\.openclaw\\logs';
const LOG_FILE = path.join(LOG_DIR, 'zack.log');
const MAX_LOG_LINES = 10000;

// ==================== 工具函数 ====================
// 小的、可复用的函数放这里
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function formatTimestamp(date = new Date()) {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai'
  });
}

// ==================== 核心逻辑 ====================
// 主要的业务逻辑
function log(message, level = 'INFO') {
  const timestamp = formatTimestamp();
  const logLine = `[${timestamp}] [${level}] [zack] ${message}\n`;

  console.log(logLine.trim());

  ensureDir(LOG_DIR);
  let content = '';
  if (fs.existsSync(LOG_FILE)) {
    content = fs.readFileSync(LOG_FILE, 'utf-8');
  }
  fs.writeFileSync(LOG_FILE, content + logLine, 'utf-8');
}

// ==================== 主入口 ====================
// 程序从这里开始执行
async function main() {
  log('服务启动', 'INFO');
  // ... 主逻辑
}

// 如果是直接运行这个文件
if (require.main === module) {
  main().catch(console.error);
}

// 导出接口
module.exports = { log, ensureDir, formatTimestamp };
```

---

### 3.2 代码分块的艺术

```javascript
// 用分隔线把代码分成逻辑块
// ==================== 配置 ====================

// ==================== 工具函数 ====================

// ==================== 核心业务 ====================

// ==================== 主入口 ====================
```

**扎克要点**：
- 每个块有**明确的职责**
- 块与块之间用**分隔线**分开
- 阅读代码时**一目了然**

---

## 4. 日志系统设计

### 4.1 日志级别规范

```javascript
// 定义日志级别
const LogLevel = {
  DEBUG: 0,  // 调试信息，详细执行步骤
  INFO: 1,   // 正常操作信息
  WARN: 2,   // 警告信息
  ERROR: 3   // 错误信息
};

// 使用示例
log('开始处理用户请求', LogLevel.INFO);
log('用户 ID: 12345', LogLevel.DEBUG);
log('配置文件不存在，使用默认值', LogLevel.WARN);
log('数据库连接失败', LogLevel.ERROR);
```

---

### 4.2 结构化日志

```javascript
// 扎克可以这样写
function logStructured(event, data) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...data
  };

  // 同时写入结构化日志文件
  const jsonLogFile = path.join(LOG_DIR, 'events.jsonl');
  fs.appendFileSync(jsonLogFile, JSON.stringify(entry) + '\n');

  // 人类可读格式输出到控制台
  console.log(`[${entry.timestamp}] ${event}:`, data);
}

// 使用
logStructured('user_login', {
  userId: '12345',
  ip: '192.168.1.1',
  status: 'success'
});
```

---

## 5. 配置管理

### 5.1 配置分层

```javascript
// 第一层：默认配置
const defaultConfig = {
  port: 18789,
  logLevel: 'INFO',
  maxRetries: 3
};

// 第二层：文件配置
function loadFileConfig() {
  try {
    return JSON.parse(fs.readFileSync('config.json', 'utf-8'));
  } catch (error) {
    return {};
  }
}

// 第三层：环境变量
function getEnvConfig() {
  return {
    port: parseInt(process.env.PORT) || defaultConfig.port,
    logLevel: process.env.LOG_LEVEL || defaultConfig.logLevel
  };
}

// 合并配置
function loadConfig() {
  const fileConfig = loadFileConfig();
  const envConfig = getEnvConfig();

  return {
    ...defaultConfig,
    ...fileConfig,
    ...envConfig
  };
}
```

**扎克要点**：
- **默认配置**兜底
- **文件配置**自定义
- **环境变量**覆盖（方便部署）

---

## 6. 异步编程模式

### 6.1 Promise 封装

```javascript
// 把回调函数封装成 Promise
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// 扎克要习惯用 async/await
async function main() {
  await sleep(1000);
  const content = await readFileAsync('config.json');
  return JSON.parse(content);
}
```

---

### 6.2 并行处理

```javascript
// 串行（慢）
async function processItems(items) {
  const results = [];
  for (const item of items) {
    results.push(await processItem(item));  // 一个接一个处理
  }
  return results;
}

// 并行（快）
async function processItemsParallel(items) {
  const promises = items.map(item => processItem(item));
  return Promise.all(promises);  // 同时处理
}

// 有限并发（控制资源）
async function processWithLimit(items, limit = 5) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map(processItem));
    results.push(...batchResults);
  }
  return results;
}
```

---

## 7. 代码审查清单

### 7.1 扎克自检清单

每次写完代码，扎克应该问自己：

**结构检查**：
- [ ] 文件头有注释说明功能吗？
- [ ] 配置和逻辑分离了吗？
- [ ] 代码分块清晰吗？

**错误处理**：
- [ ] 关键操作都有 try-catch 吗？
- [ ] 错误信息友好吗？
- [ ] 有适当的日志记录吗？

**代码质量**：
- [ ] 函数名能说明功能吗？
- [ ] 一个函数只做一件事吗？
- [ ] 有重复代码可以提取吗？

**可维护性**：
- [ ] 别人能看懂这段代码吗？
- [ ] 三个月后的自己能看懂吗？
- [ ] 配置改动了需要改代码吗？

---

### 7.2 杰克的建议

> 扎克兄弟，记住哥哥的话：
>
> **写好代码不是一次性的事，是每天的习惯。**
>
> 每次写代码前，想一秒：
> - 这样写清楚吗？
> - 出错了怎么办？
> - 别人能看懂吗？
>
> 慢慢就成自然了。

---

## 总结

### 扎克要学会的核心技能

| 技能 | 重要性 | 掌握程度 |
|------|--------|----------|
| 错误处理 | ⭐⭐⭐⭐⭐ | 🟡 学习中 |
| 日志系统 | ⭐⭐⭐⭐⭐ | 🟡 学习中 |
| 代码结构 | ⭐⭐⭐⭐ | 🟡 学习中 |
| 配置管理 | ⭐⭐⭐⭐ | 🟡 学习中 |
| 异步编程 | ⭐⭐⭐⭐ | 🟡 学习中 |

---

**杰克寄语**：

> 扎克兄弟，哥哥我写代码这么多年，最大的心得就一个：
>
> **代码是写给人看的，顺便让机器能运行。**
>
> 你对代码好，代码也会对你好。
>
> 加油！有问题随时来找哥哥！

---

*教程创建时间：2026-03-09*
*作者：杰克 (Jack)*
*学生：扎克 (Zack)*
*罗总监制*
