# 教程 02：安全编程实践

> **杰克教扎克系列教程 - 第 02 课**
>
> 创建时间：2026-03-09
> 难度：⭐⭐⭐⭐
> 重要性：⭐⭐⭐⭐⭐（安全问题无小事！）

---

## 📚 本章目录

1. [为什么安全很重要](#1-为什么安全很重要)
2. [敏感信息处理](#2-敏感信息处理)
3. [输入验证](#3-输入验证)
4. [文件操作安全](#4-文件操作安全)
5. [命令注入防护](#5-命令注入防护)
6. [安全日志记录](#6-安全日志记录)
7. [安全检查清单](#7-安全检查清单)

---

## 1. 为什么安全很重要

### 1.1 真实案例

```javascript
// ❌ 真实发生过的安全事故
// 某公司代码中硬编码了 AWS 密钥
const AWS_KEY = 'AKIAIOSFODNN7EXAMPLE';  // 被传到 GitHub
// 结果：黑客入侵，损失数百万美元

// ❌ 某项目直接拼接用户输入执行命令
const userInput = req.query.filename;
exec('cat ' + userInput);  // 用户输入: "file.txt; rm -rf /"
// 结果：服务器文件被删除
```

### 1.2 杰克的忠告

> 扎克兄弟，记住：
>
> **安全问题，预防容易，补救难。**
>
> 一旦出事，轻则数据泄露，重则公司倒闭。
>
> 宁可多花 5 分钟检查，不要事后 5 天救火。

---

## 2. 敏感信息处理

### 2.1 密码、密钥、Token 绝不硬编码

```javascript
// ❌ 绝对不要这样写！
const config = {
  password: 'MySecret123!',
  apiKey: 'sk-1234567890abcdef',
  dbPassword: 'prod_db_p@ss'
};

// ✅ 正确做法 - 从环境变量读取
const config = {
  password: process.env.DB_PASSWORD,
  apiKey: process.env.API_KEY,
  dbPassword: process.env.PROD_DB_PASSWORD
};

// 启动前设置环境变量
// Linux/Mac: export DB_PASSWORD="xxx"
// Windows: set DB_PASSWORD=xxx
```

### 2.2 .env 文件管理

```bash
# .env 文件（本地开发用）
DB_PASSWORD=dev_password123
API_KEY=sk-test-key

# .env.example 文件（可以提交到 Git）
DB_PASSWORD=your_db_password
API_KEY=your_api_key
```

```javascript
// 使用 dotenv 库加载
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD;
```

```gitignore
# .gitignore - 一定要忽略 .env
.env
.env.local
.env.production
```

---

### 2.3 加密存储敏感数据

```javascript
const crypto = require('crypto');

// 加密函数
function encrypt(text, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// 解密函数
function decrypt(encryptedText, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// 使用示例
const key = process.env.ENCRYPTION_KEY;
const encryptedPassword = encrypt(userPassword, key);
// 存储 encryptedPassword 到数据库
```

---

## 3. 输入验证

### 3.1 所有输入都是不可信的

```javascript
// ❌ 危险！直接使用用户输入
const filename = req.query.file;
fs.readFile(`/data/${filename}`, callback);  // 用户可输入 ../../../etc/passwd

// ✅ 正确做法 - 验证 + 清理
function sanitizeFilename(filename) {
  // 只允许字母、数字、下划线、点
  const sanitized = filename.replace(/[^a-zA-Z0-9_.-]/g, '');

  // 防止路径遍历
  if (sanitized.includes('..') || sanitized.includes('/')) {
    throw new Error('非法文件名');
  }

  return sanitized;
}

// 使用
const safeFilename = sanitizeFilename(req.query.file);
fs.readFile(`/data/${safeFilename}`, callback);
```

---

### 3.2 参数化查询（防 SQL 注入）

```javascript
// ❌ 危险！SQL 注入漏洞
const sql = `SELECT * FROM users WHERE username = '${username}'`;
db.query(sql);  // 用户输入：admin' --

// ✅ 正确做法 - 参数化查询
const sql = 'SELECT * FROM users WHERE username = ?';
db.query(sql, [username]);  // 自动转义
```

---

### 3.3 输入验证库的使用

```javascript
// 使用 joi 库进行验证
const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(0).max(150),
  password: Joi.string().min(8).pattern(/^[A-Za-z0-9!@#$%]+$/).required()
});

// 验证用户输入
const { error, value } = userSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.message });
}
// value 是清理后的安全数据
```

---

## 4. 文件操作安全

### 4.1 路径遍历防护

```javascript
const path = require('path');

// ❌ 危险！用户可访问任意文件
app.get('/file', (req, res) => {
  const file = req.query.path;
  res.sendFile(`/var/www/${file}`);  // ../../etc/passwd
});

// ✅ 正确做法
app.get('/file', (req, res) => {
  const file = req.query.path;

  // 解析并规范化路径
  const basePath = '/var/www';
  const fullPath = path.resolve(basePath, file);

  // 确保在允许目录内
  if (!fullPath.startsWith(basePath)) {
    return res.status(403).json({ error: '禁止访问' });
  }

  res.sendFile(fullPath);
});
```

---

### 4.2 文件权限控制

```javascript
const fs = require('fs');

// 创建文件时设置权限
fs.writeFileSync('sensitive.txt', 'secret data', {
  mode: 0o600  // 只有所有者可读写
});

// 检查文件权限
const stats = fs.statSync('sensitive.txt');
console.log(stats.mode.toString(8));  // 100600
```

---

## 5. 命令注入防护

### 5.1 永远不要拼接用户输入执行命令

```javascript
// ❌ 极度危险！
const filename = req.query.file;
exec(`cat ${filename}`, callback);  // 输入: file.txt; rm -rf /

// ✅ 正确做法 - 使用数组参数
const { execFile } = require('child_process');
execFile('cat', [filename], callback);  // 参数不会被解释为命令

// ✅ 更好的做法 - 避免 shell 命令
const fs = require('fs');
fs.readFile(filename, callback);  // 用 Node API 代替 shell 命令
```

---

### 5.2 白名单验证

```javascript
// 如果必须执行命令，用白名单
const ALLOWED_COMMANDS = ['ls', 'cat', 'grep'];

function safeExec(command, args, callback) {
  if (!ALLOWED_COMMANDS.includes(command)) {
    throw new Error(`命令 ${command} 不在白名单中`);
  }

  // 验证参数不包含危险字符
  const dangerousChars = [';', '|', '&', '$', '`'];
  for (const arg of args) {
    for (const char of dangerousChars) {
      if (arg.includes(char)) {
        throw new Error('参数包含危险字符');
      }
    }
  }

  const { execFile } = require('child_process');
  execFile(command, args, callback);
}
```

---

## 6. 安全日志记录

### 6.1 日志中不要记录敏感信息

```javascript
// ❌ 危险！日志泄露敏感信息
console.log('用户登录:', { username, password, token });

// ✅ 正确做法 - 脱敏处理
function maskSensitive(data) {
  const masked = { ...data };
  if (masked.password) masked.password = '***';
  if (masked.token) masked.token = masked.token.substring(0, 8) + '***';
  return masked;
}

console.log('用户登录:', maskSensitive({ username, password, token }));
```

---

### 6.2 安全事件日志

```javascript
// 记录安全相关事件
function logSecurityEvent(event, details) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,  // 'LOGIN_FAILED', 'ACCESS_DENIED', 'SUSPICIOUS_INPUT'
    ip: details.ip,
    user: details.user,
    details: sanitizeForLog(details)  // 脱敏
  };

  // 安全日志单独文件
  fs.appendFileSync('security.log', JSON.stringify(entry) + '\n');
}

// 使用
logSecurityEvent('LOGIN_FAILED', {
  ip: req.ip,
  user: username,
  reason: 'invalid_password'
});
```

---

## 7. 安全检查清单

### 7.1 代码审查检查项

每次写完代码，扎克应该检查：

**敏感信息**：
- [ ] 没有硬编码密码、密钥、Token
- [ ] .env 文件已加入 .gitignore
- [ ] 敏感数据已加密存储

**输入验证**：
- [ ] 所有用户输入都经过验证
- [ ] 使用了参数化查询（如果操作数据库）
- [ ] 文件名、路径经过清理

**文件操作**：
- [ ] 文件路径做了规范化处理
- [ ] 限制了访问目录范围
- [ ] 设置了合适的文件权限

**命令执行**：
- [ ] 没有拼接用户输入执行命令
- [ ] 使用了白名单验证
- [ ] 尽量用 API 代替 shell 命令

**日志记录**：
- [ ] 日志中没有明文密码
- [ ] Token 等敏感信息已脱敏
- [ ] 安全事件有单独记录

---

### 7.2 安全等级自评

| 等级 | 描述 | 行动 |
|------|------|------|
| 🔴 Critical | 发现严重漏洞（如硬编码密码） | 立即修复，停止上线 |
| 🟠 High | 发现高危问题（如缺少输入验证） | 优先修复，暂缓上线 |
| 🟡 Medium | 发现中危问题（如日志过于详细） | 计划修复，可上线 |
| 🟢 Low | 轻微问题（如注释透露内部信息） | 有空再改 |

---

## 课后练习

### 练习 1：找出代码中的安全问题

```javascript
// 下面这段代码有哪些安全问题？
const express = require('express');
const app = express();

const DB_PASSWORD = 'prod123456';  // 问题 1

app.get('/user', (req, res) => {
  const userId = req.query.id;
  const sql = `SELECT * FROM users WHERE id = ${userId}`;  // 问题 2
  db.query(sql);
});

app.get('/file', (req, res) => {
  const file = req.query.name;
  res.sendFile(`/var/www/${file}`);  // 问题 3
});

console.log('API Key:', process.env.API_KEY);  // 问题 4
```

---

## 杰克寄语

> 扎克兄弟：
>
> 安全这件事，说难难，说简单也简单。
>
> **难的是**：要时刻保持警惕，不能有侥幸心理。
>
> **简单的是**：养成良好的编码习惯，安全问题自然远离你。
>
> 哥哥我写代码这么多年，靠的就是一个"稳"字。
>
> 你也一样，稳稳当当地写代码，安安全全地做项目！

---

*教程创建时间：2026-03-09*
*作者：杰克 (Jack)*
*学生：扎克 (Zack)*
