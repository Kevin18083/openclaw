# 教程 08：模块化设计

> **杰克教扎克系列教程 - 第 08 课**
>
> 创建时间：2026-03-09
> 难度：⭐⭐⭐⭐
> 重要性：⭐⭐⭐⭐

---

## 📚 本章目录

1. [模块化好处](#1-模块化好处)
2. [如何设计可复用模块](#2-如何设计可复用模块)
3. [依赖管理](#3-依赖管理)
4. [接口设计原则](#4-接口设计原则)
5. [解耦技巧](#5-解耦技巧)
6. [设计模式简介](#6-设计模式简介)
7. [重构技巧](#7-重构技巧)

---

## 1. 模块化好处

### 1.1 杰克的模块化理解

```
什么是模块？
→ 一个独立的、完成特定功能的代码单元
→ 像乐高积木，可以拼来拼去
→ 像厨房的电器，电饭煲煮饭，微波炉加热

为什么要模块化？
→ 好维护：改一个模块，不影响其他
→ 好测试：单独测试每个模块
→ 好复用：写一次，多处用
→ 好理解：每个模块职责清晰
```

### 1.2 模块化 vs 面条代码

```javascript
// ❌ 面条代码（所有逻辑混在一起）
function handleRequest(req, res) {
  // 验证用户
  if (!req.body.username) {
    return res.status(400).send('缺少用户名');
  }

  // 连接数据库
  const db = connectDatabase();

  // 查询用户
  const user = db.query('SELECT * FROM users WHERE ...');

  // 验证密码
  if (!bcrypt.compare(req.body.password, user.password)) {
    return res.status(401).send('密码错误');
  }

  // 生成 token
  const token = jwt.sign({ userId: user.id }, 'secret');

  // 记录日志
  fs.appendFileSync('login.log', `${user.username} logged in\n`);

  // 返回结果
  res.json({ token });
}

// ✅ 模块化代码
// auth.js - 认证模块
const auth = require('./auth');
const db = require('./db');
const logger = require('./logger');

async function handleRequest(req, res) {
  try {
    await auth.validateLogin(req.body);
    const user = await db.users.findByUsername(req.body.username);
    await auth.verifyPassword(req.body.password, user.password);
    const token = auth.generateToken(user);
    logger.info('用户登录', { userId: user.id });
    res.json({ token });
  } catch (error) {
    logger.error('登录失败', { error: error.message });
    res.status(error.code || 500).send(error.message);
  }
}
```

---

## 2. 如何设计可复用模块

### 2.1 单一职责原则

```javascript
// ❌ 一个模块做太多事
const utils = {
  validateEmail(email) { ... },
  validatePhone(phone) { ... },
  formatCurrency(amount) { ... },
  formatDate(date) { ... },
  sendEmail(to, subject, body) { ... },
  sendSMS(phone, message) { ... },
  uploadFile(file) { ... },
  downloadFile(url) { ... }
  // ... 还有 50 个方法
};

// ✅ 按职责拆分
// validators.js
module.exports = {
  validateEmail: (email) => { ... },
  validatePhone: (phone) => { ... }
};

// formatters.js
module.exports = {
  formatCurrency: (amount) => { ... },
  formatDate: (date) => { ... }
};

// messaging.js
module.exports = {
  sendEmail: (to, subject, body) => { ... },
  sendSMS: (phone, message) => { ... }
};

// storage.js
module.exports = {
  uploadFile: (file) => { ... },
  downloadFile: (url) => { ... }
};
```

---

### 2.2 高内聚 低耦合

```
高内聚：模块内部的功能要相关
→ 文件操作模块就只做文件操作
→ 不要突然发个邮件出去

低耦合：模块之间依赖要少
→ 改 A 模块，不需要改 B 模块
→ 模块之间通过接口通信，不直接操作内部数据
```

```javascript
// ❌ 高耦合
// order.js 直接操作 user.js 的内部数据
const user = require('./user');
function createOrder(userId) {
  user.internalData.lastOrderId = generateId();  // 直接操作内部数据
  // ...
}

// ✅ 低耦合
// order.js 通过公共接口与 user.js 交互
const user = require('./user');
function createOrder(userId) {
  user.updateLastOrder(userId, generateId());  // 通过公共方法
  // ...
}
```

---

### 2.3 可复用模块的特征

```javascript
/**
 * 好的可复用模块：
 *
 * 1. 职责单一 - 只做一件事，做好
 * 2. 接口清晰 - 输入输出明确
 * 3. 无副作用 - 不修改外部状态
 * 4. 可配置 - 通过参数定制行为
 * 5. 可测试 - 容易编写单元测试
 * 6. 有文档 - 说明如何使用的
 */

// 示例：好的可复用模块
/**
 * CSV 解析模块
 * @module csvParser
 */
module.exports = {
  /**
   * 解析 CSV 字符串为数组
   * @param {string} csv - CSV 字符串
   * @param {Object} options - 选项
   * @param {string} options.delimiter - 分隔符，默认 ','
   * @param {boolean} options.hasHeader - 是否有表头，默认 true
   * @returns {Array<Object>} 解析后的数据
   */
  parse: (csv, options = {}) => {
    // 实现...
  },

  /**
   * 将数组转换为 CSV 字符串
   * @param {Array<Object>} data - 数据
   * @returns {string} CSV 字符串
   */
  stringify: (data) => {
    // 实现...
  }
};
```

---

## 3. 依赖管理

### 3.1 package.json 最佳实践

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "项目描述",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "jest",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.0"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
```

**版本号说明**：
- `^4.18.0` - 允许更新次版本号（4.19.0 OK，5.0.0 不行）
- `~4.18.0` - 只允许更新修订号（4.18.1 OK，4.19.0 不行）
- `4.18.0` - 锁定确切版本

---

### 3.2 依赖管理技巧

```bash
# 查看依赖树
npm list
npm list --depth=0  # 只看直接依赖

# 检查过时依赖
npm outdated

# 更新依赖
npm update              # 更新兼容版本
npm update -g           # 更新全局包

# 检查安全漏洞
npm audit
npm audit fix           # 自动修复
npm audit fix --force   # 强制修复（可能有破坏性变更）

# 清理缓存
npm cache clean --force
```

---

### 3.3 减少依赖

```javascript
// ❌ 为了一个小功能引入大库
const _ = require('lodash');
const firstItem = _.first(array);  // 就为了这个方法

// ✅ 用原生方法或引入小模块
const firstItem = array[0];  // 原生

// 或者只引入需要的
const first = require('lodash.first');

// 或者用更小的替代
const R = require('ramda');  // Ramda 更模块化
```

---

## 4. 接口设计原则

### 4.1 API 设计规范

```javascript
// 1. 命名清晰
// ❌
function fn(a, b, c) { ... }

// ✅
function createUser(username, email, password) { ... }

// 2. 参数对象化（参数多时）
// ❌
function sendEmail(to, cc, bcc, subject, body, attachments, priority, replyTo) { ... }

// ✅
function sendEmail({
  to,
  cc = [],
  bcc = [],
  subject,
  body,
  attachments = [],
  priority = 'normal',
  replyTo = null
}) { ... }

// 3. 返回值一致
// ❌ 有时返回数组，有时返回 null
function findUser(id) {
  if (found) return [user];
  return null;
}

// ✅ 总是返回同类型
function findUser(id) {
  if (found) return { success: true, data: user };
  return { success: false, error: 'User not found' };
}
```

---

### 4.2 错误处理接口

```javascript
// 统一的错误处理格式
class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// 使用
function validateUser(user) {
  if (!user.username) {
    throw new AppError('缺少用户名', 'VALIDATION_ERROR', 400);
  }
  if (!user.email) {
    throw new AppError('缺少邮箱', 'VALIDATION_ERROR', 400);
  }
}

// 捕获
try {
  validateUser(data);
} catch (error) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.code,
      message: error.message
    });
  } else {
    // 未知错误
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    });
  }
}
```

---

## 5. 解耦技巧

### 5.1 依赖注入

```javascript
// ❌ 硬编码依赖
class UserService {
  constructor() {
    this.db = new Database();  // 直接 new，难以测试
    this.email = new EmailService();
  }
}

// ✅ 依赖注入
class UserService {
  constructor(db, emailService) {
    this.db = db;  // 从外部传入
    this.email = emailService;
  }
}

// 使用时
const db = new Database();
const email = new EmailService();
const userService = new UserService(db, email);

// 测试时
const mockDb = { query: jest.fn() };
const mockEmail = { send: jest.fn() };
const testService = new UserService(mockDb, mockEmail);
```

---

### 5.2 事件驱动解耦

```javascript
// 模块之间通过事件通信，而不是直接调用
const EventEmitter = require('events');
const events = new EventEmitter();

// 订单模块
class OrderModule {
  createOrder(data) {
    // ... 创建订单
    events.emit('order:created', { orderId: 123, data });
  }
}

// 邮件模块（监听订单创建事件）
events.on('order:created', async ({ orderId }) => {
  const order = await getOrderDetails(orderId);
  await sendEmail(order.customerEmail, '订单创建成功', ...);
});

// 库存模块（也监听同一个事件）
events.on('order:created', async ({ orderId }) => {
  await updateInventory(orderId);
});

// 订单模块不需要知道有邮件和库存模块
// 解耦完成！
```

---

### 5.3 适配器模式

```javascript
// 场景：需要兼容多个支付网关

// 定义统一接口
class PaymentAdapter {
  pay(amount) { throw new Error('Must implement'); }
  refund(transactionId) { throw new Error('Must implement'); }
}

// 支付宝适配器
class AlipayAdapter extends PaymentAdapter {
  pay(amount) {
    // 调用支付宝 API
    return alipay.charge(amount);
  }
  refund(transactionId) {
    return alipay.refund(transactionId);
  }
}

// 微信支付适配器
class WechatPayAdapter extends PaymentAdapter {
  pay(amount) {
    return wechat.charge(amount);
  }
  refund(transactionId) {
    return wechat.refund(transactionId);
  }
}

// 使用
const payment = config.paymentProvider === 'alipay'
  ? new AlipayAdapter()
  : new WechatPayAdapter();

payment.pay(100);  // 统一接口，不关心具体实现
```

---

## 6. 设计模式简介

### 6.1 单例模式

```javascript
// 确保一个类只有一个实例
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection = this.connect();
    Database.instance = this;
  }

  connect() {
    // 建立数据库连接
    return { /* connection */ };
  }

  query(sql) {
    return this.connection.execute(sql);
  }
}

// 使用
const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2);  // true，同一个实例
```

---

### 6.2 工厂模式

```javascript
// 根据条件创建不同类型的对象
class Logger {
  static create(type, options = {}) {
    switch (type) {
      case 'console':
        return new ConsoleLogger(options);
      case 'file':
        return new FileLogger(options);
      case 'remote':
        return new RemoteLogger(options);
      default:
        throw new Error(`Unknown logger type: ${type}`);
    }
  }
}

// 使用
const logger = Logger.create('file', { path: './logs' });
logger.info('Hello');
```

---

### 6.3 观察者模式

```javascript
// 一个对象改变，通知所有订阅者
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter(f => f !== fn);
  }

  notify(data) {
    this.observers.forEach(fn => fn(data));
  }
}

// 使用
const subject = new Subject();

subject.subscribe(data => console.log('订阅者 1:', data));
subject.subscribe(data => console.log('订阅者 2:', data));

subject.notify('Hello observers!');
// 输出：
// 订阅者 1: Hello observers!
// 订阅者 2: Hello observers!
```

---

## 7. 重构技巧

### 7.1 提取函数

```javascript
// 重构前
function printOwing(invoice) {
  let output = '';
  output += '*****************\n';
  output += '**** 欠账单 ****\n';
  output += '*****************\n';

  // 计算
  let outstanding = 0;
  for (const o of invoice.outstanding) {
    outstanding += o.amount;
  }

  // 打印详情
  output += `客户：${invoice.customer}\n`;
  output += `金额：${outstanding}\n`;
  output += `到期：${invoice.dueDate}\n`;

  return output;
}

// 重构后：提取函数
function printOwing(invoice) {
  let output = '';
  output += createHeader();
  output += calculateOutstanding(invoice);
  output += printDetails(invoice);
  return output;
}

function createHeader() {
  return '*****************\n**** 欠账单 ****\n*****************\n';
}

function calculateOutstanding(invoice) {
  let outstanding = 0;
  for (const o of invoice.outstanding) {
    outstanding += o.amount;
  }
  return `金额：${outstanding}\n`;
}

function printDetails(invoice) {
  return `客户：${invoice.customer}\n到期：${invoice.dueDate}\n`;
}
```

---

### 7.2 提取模块

```javascript
// 重构前：一个大文件 500 行
// user.js - 包含所有用户相关逻辑

// 重构后：拆分成多个模块
// user/index.js
module.exports = {
  ...require('./user/controller'),
  ...require('./user/service'),
  ...require('./user/repository'),
  ...require('./user/validator')
};

// user/controller.js - 控制器
module.exports = {
  createUser: async (req, res) => { ... },
  getUser: async (req, res) => { ... },
  updateUser: async (req, res) => { ... }
};

// user/service.js - 业务逻辑
module.exports = {
  validateUser: (data) => { ... },
  hashPassword: (password) => { ... },
  generateToken: (user) => { ... }
};

// user/repository.js - 数据访问
module.exports = {
  findById: (id) => db.query('SELECT * FROM users WHERE id = ?', [id]),
  create: (data) => db.query('INSERT INTO users ...', data),
  update: (id, data) => db.query('UPDATE users ...', [id, data])
};

// user/validator.js - 验证
module.exports = {
  validateCreate: (data) => { ... },
  validateUpdate: (data) => { ... }
};
```

---

### 7.3 重构检查清单

重构前检查：
- [ ] 有完整的测试覆盖
- [ ] 理解当前代码逻辑
- [ ] 明确重构目标
- [ ] 小步重构，频繁提交

重构时注意：
- [ ] 不改变外部行为
- [ ] 每次只改一处
- [ ] 改完运行测试
- [ ] 测试通过再提交

重构常见信号：
- [ ] 函数太长（> 50 行）
- [ ] 文件太大（> 500 行）
- [ ] 重复代码
- [ ] 函数参数太多（> 5 个）
- [ ] 类职责太多
- [ ] 过度耦合

---

## 课后练习

### 练习 1：重构代码

```javascript
// 重构下面这个"上帝函数"
function processUserData(user) {
  // 验证
  if (!user.username) throw new Error('缺少用户名');
  if (!user.email) throw new Error('缺少邮箱');
  if (user.password.length < 8) throw new Error('密码太短');

  // 处理
  user.username = user.username.trim().toLowerCase();
  user.email = user.email.trim().toLowerCase();
  user.password = bcrypt.hashSync(user.password, 10);

  // 保存
  const db = require('./db');
  db.connect();
  db.query('INSERT INTO users ...', [user]);

  // 发邮件
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({...});
  transporter.sendMail({
    to: user.email,
    subject: '欢迎注册',
    html: '<h1>欢迎！</h1>'
  });

  // 日志
  const fs = require('fs');
  fs.appendFileSync('user.log', `${user.username} registered\n`);

  return user;
}

// 要求：
// 1. 拆分成多个模块
// 2. 每个函数职责单一
// 3. 降低耦合
```

---

## 杰克寄语

> 扎克兄弟：
>
> 模块化这个技能，**开始觉得麻烦，后来觉得必要，最后觉得享受**。
>
> 为什么享受？因为代码清晰了，改动容易了，Bug 减少了。
>
> 模块化好的代码，像精心整理的工具箱。
>
> 模块化差的代码，像乱糟糟的杂物间。
>
> 哥哥我写代码，追求的就是模块化、可维护。
>
> 你也一样，养成好习惯，代码越写越好！

---

*教程创建时间：2026-03-09*
*作者：杰克 (Jack)*
*学生：扎克 (Zack)*
