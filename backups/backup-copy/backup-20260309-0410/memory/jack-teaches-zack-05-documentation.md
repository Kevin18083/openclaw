# 教程 05：文档编写规范

> **杰克教扎克系列教程 - 第 05 课**
>
> 创建时间：2026-03-09
> 难度：⭐⭐⭐
> 重要性：⭐⭐⭐⭐

---

## 📚 本章目录

1. [为什么文档很重要](#1-为什么文档很重要)
2. [README 标准结构](#2-readme 标准结构)
3. [注释的艺术](#3-注释的艺术)
4. [API 文档格式](#4-api 文档格式)
5. [CHANGELOG 维护](#5-changelog 维护)
6. [技术设计文档](#6-技术设计文档)
7. [文档检查清单](#7-文档检查清单)

---

## 1. 为什么文档很重要

### 1.1 杰克的亲身经历

```
有一天，我写了一个复杂的模块。
三个月后，需要修改。
打开代码，一看：

// 这里处理特殊逻辑
function process(data) {
  // 先这样
  const a = transform(data);
  // 再那样
  return optimize(a);
}

我当时就想：这是哪个天才写的？
定睛一看，哦，是我自己写的。
```

### 1.2 文档的价值

> 扎克兄弟，记住：
>
> **好文档 = 给未来的自己/同事留的地图**
>
> 没有文档的代码，像没有地图的迷宫。
>
> 有文档的代码，像有路标的高速公路。

---

## 2. README 标准结构

### 2.1 标准 README 模板

```markdown
# 项目名称

> 一句话描述：这个项目是干什么的

[![Version](https://img.shields.io/npm/v/project-name.svg)](https://npmjs.org/package/project-name)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📖 目录

- [安装](#-安装)
- [使用方法](#-使用方法)
- [API 文档](#-api 文档)
- [示例](#-示例)
- [常见问题](#-常见问题)
- [贡献](#-贡献)
- [许可证](#-许可证)

## 🚀 安装

```bash
npm install project-name
```

**系统要求**：
- Node.js >= 14.0.0
- npm >= 6.0.0

## 📖 使用方法

### 基础用法

```javascript
const MyModule = require('project-name');

const instance = new MyModule({
  apiKey: 'your-api-key'
});

const result = await instance.process(data);
console.log(result);
```

### 高级用法

```javascript
// 配置选项
const config = {
  timeout: 5000,
  retries: 3,
  debug: true
};

const instance = new MyModule(config);
```

## 📚 API 文档

### 构造函数

#### `new MyModule(options)`

创建新实例。

**参数**：
- `options` (Object) - 配置选项
  - `apiKey` (String) - API 密钥 [必需]
  - `timeout` (Number) - 超时时间 (毫秒)，默认 5000
  - `retries` (Number) - 重试次数，默认 3

**示例**：
```javascript
const instance = new MyModule({ apiKey: 'xxx' });
```

### 方法

#### `process(data)`

处理数据。

**参数**：
- `data` (Any) - 要处理的数据

**返回**：
- `Promise<Any>` - 处理结果

**示例**：
```javascript
const result = await instance.process({ name: 'test' });
```

**错误**：
- `InvalidDataError` - 数据格式错误
- `TimeoutError` - 处理超时

## 💡 示例

### 示例 1：基本数据处理

```javascript
const MyModule = require('project-name');
const processor = new MyModule({ apiKey: 'xxx' });

const data = { items: [1, 2, 3] };
const result = await processor.process(data);
console.log(result);  // 输出处理后的结果
```

### 示例 2：错误处理

```javascript
try {
  const result = await processor.process(invalidData);
} catch (error) {
  if (error.name === 'InvalidDataError') {
    console.error('数据格式错误:', error.message);
  }
}
```

## ❓ 常见问题

### Q: 如何获取 API 密钥？

A: 访问 [官网](https://example.com) 注册账号后获取。

### Q: 支持浏览器环境吗？

A: 目前仅支持 Node.js 环境，浏览器版本开发中。

### Q: 如何处理大文件？

A: 使用流式 API：

```javascript
const stream = processor.processStream(largeFile);
stream.on('data', chunk => console.log(chunk));
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加新功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系方式

- 作者：Your Name
- Email: your@email.com
- 项目地址：https://github.com/your/project

```

---

### 2.2 README 检查清单

- [ ] 一句话描述项目
- [ ] 安装说明
- [ ] 基础使用示例
- [ ] API 文档链接或内容
- [ ] 常见问题解答
- [ ] 贡献指南
- [ ] 许可证信息

---

## 3. 注释的艺术

### 3.1 什么时候写注释

```javascript
// ✅ 好的注释 - 解释"为什么"

// 使用正则而不是 split 因为要保留分隔符
// 参考：https://stackoverflow.com/a/xxxxx
const parts = text.split(/([,.!?])/);

// 兼容旧版 API，3 个月后删除
// TODO: 2026-06-01 移除兼容代码
if (typeof options.delay === 'string') {
  options.delay = parseInt(options.delay);
}

// ❌ 糟糕的注释 - 重复代码在说什么

// 设置 count 为 0
let count = 0;

// 循环遍历数组
for (const item of array) {
  // 处理每一项
  process(item);
}
```

---

### 3.2 文件头部注释

```javascript
/**
 * @file 用户管理模块
 * @description 提供用户注册、登录、信息管理等核心功能
 *
 * @author 扎克 <zack@example.com>
 * @version 1.0.0
 * @created 2026-03-09
 * @lastModified 2026-03-09
 *
 * @example
 * const userModule = require('./user');
 * await userModule.register({ username: 'test', password: '123' });
 */
```

---

### 3.3 函数注释

```javascript
/**
 * 验证用户密码是否符合安全要求
 *
 * 密码要求：
 * - 至少 8 个字符
 * - 包含大写字母
 * - 包含小写字母
 * - 包含数字
 * - 允许特殊字符
 *
 * @param {string} password - 要验证的密码
 * @returns {{valid: boolean, error: string|null}} 验证结果
 * @throws {TypeError} 当密码不是字符串时
 *
 * @example
 * const result = validatePassword('Test1234');
 * // 返回：{ valid: true, error: null }
 *
 * const result2 = validatePassword('weak');
 * // 返回：{ valid: false, error: '密码至少 8 位' }
 */
function validatePassword(password) {
  // ... 实现
}
```

---

### 3.4 复杂逻辑注释

```javascript
/**
 * 计算两个日期的工作日天数
 *
 * 算法说明：
 * 1. 计算总天数差
 * 2. 计算完整周数，每周 5 个工作日
 * 3. 处理剩余天数，排除周末
 *
 * 时间复杂度：O(1)
 * 空间复杂度：O(1)
 *
 * 参考：https://stackoverflow.com/a/xxxxx
 */
function countBusinessDays(start, end) {
  // 计算完整周数
  const weeks = Math.floor(dayDiff / 7);
  let businessDays = weeks * 5;

  // 处理剩余天数
  let remaining = dayDiff % 7;
  while (remaining > 0) {
    const currentDay = new Date(start);
    currentDay.setDate(start.getDate() + remaining);
    const dayOfWeek = currentDay.getDay();

    // 排除周末（0 = 周日，6 = 周六）
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays++;
    }
    remaining--;
  }

  return businessDays;
}
```

---

### 3.5 TODO/FIXME 注释

```javascript
// TODO: 实现缓存机制，提高性能
// Priority: Medium
// Deadline: 2026-04-01

// FIXME: 时区处理有问题，UTC+8 以外的时区会出错
// Issue: #123
// Author: 杰克

// HACK: 临时解决方案，等 API 更新后移除
// See: https://github.com/xxx/issue/456

// XXX: 这里有性能问题，大数据量时会内存泄漏
// Need optimization
```

---

## 4. API 文档格式

### 4.1 内联 API 文档

```javascript
/**
 * @class 用户管理器
 * @description 管理用户会话、认证、权限等
 */
class UserManager {
  /**
   * 创建用户管理器实例
   * @constructor
   * @param {Object} options - 配置选项
   * @param {string} options.apiKey - API 密钥
   * @param {string} options.baseUrl - API 基础 URL
   * @param {number} options.timeout - 请求超时 (毫秒)
   */
  constructor(options) {
    // ...
  }

  /**
   * 用户登录
   * @async
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @returns {Promise<LoginResult>} 登录结果
   * @throws {AuthenticationError} 认证失败时抛出
   * @throws {NetworkError} 网络错误时抛出
   *
   * @example
   * const result = await userManager.login('admin', 'password123');
   * console.log(result.token);  // JWT token
   */
  async login(username, password) {
    // ...
  }
}
```

---

### 4.2 使用 JSDoc 生成文档

```bash
# 安装 JSDoc
npm install --save-dev jsdoc

# 生成文档
npx jsdoc src/*.js -d docs

# 输出：docs/ 目录生成 HTML 文档
```

---

## 5. CHANGELOG 维护

### 5.1 CHANGELOG 标准格式

```markdown
# 更新日志

所有重要更改将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### Added
- 新增用户导出功能

### Changed
- 优化大数据量处理性能

### Fixed
- 修复时区显示错误

## [1.2.0] - 2026-03-09

### Added
- 新增密码强度检测功能
- 新增多语言支持（中文、英文）
- 新增 API 速率限制

### Changed
- 升级依赖到最新版本
- 改进错误消息，更加友好

### Deprecated
- 旧版登录 API 将在下版本移除

### Fixed
- 修复用户名包含特殊字符时注册失败的问题
- 修复记忆泄露问题

### Security
- 修复 XSS 漏洞
- 增强密码加密强度

## [1.1.0] - 2026-02-15

### Added
- 新增用户搜索功能
- 新增批量操作

### Fixed
- 修复分页错误
- 修复样式问题
```

---

### 5.2 更新 CHANGELOG 的时机

```
✅ 应该记录：
- 新功能
- Bug 修复
- 性能改进
- 破坏性变更
- 安全修复

❌ 不需要记录：
- 代码重构（不影响功能）
- 文档更新
- 测试改进
- 内部优化
```

---

## 6. 技术设计文档

### 6.1 设计文档模板

```markdown
# 技术设计文档：XXX 功能

## 1. 背景

### 1.1 问题描述
当前系统存在的问题...

### 1.2 目标
实现 XXX 功能，满足 XXX 需求...

## 2. 设计方案

### 2.1 架构图
```
┌─────────────┐     ┌─────────────┐
│   Client    │ ──► │   Server    │
└─────────────┘     └─────────────┘
```

### 2.2 核心流程
1. 用户发起请求
2. 服务器验证身份
3. 处理业务逻辑
4. 返回结果

### 2.3 数据结构
```javascript
interface UserData {
  id: string;
  name: string;
  email: string;
}
```

## 3. 接口设计

### 3.1 API 端点
- `POST /api/users` - 创建用户
- `GET /api/users/:id` - 获取用户

### 3.2 请求/响应格式
```json
// 请求
{
  "name": "张三",
  "email": "zhang@example.com"
}

// 响应
{
  "id": "123",
  "name": "张三",
  "email": "zhang@example.com"
}
```

## 4. 实现计划

### 4.1 任务分解
- [ ] 数据库设计
- [ ] API 实现
- [ ] 前端对接
- [ ] 测试

### 4.2 时间表
- 设计评审：2026-03-10
- 开发完成：2026-03-20
- 测试完成：2026-03-25
- 上线：2026-03-30

## 5. 风险与缓解

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| 性能问题 | 高 | 中 | 提前压测，准备降级方案 |
| 数据迁移 | 中 | 低 | 编写迁移脚本，回滚方案 |
```

---

## 7. 文档检查清单

### 7.1 README 检查

- [ ] 项目名称和一句话描述
- [ ] 安装步骤清晰完整
- [ ] 至少有 1 个使用示例
- [ ] API 文档可访问
- [ ] 常见问题解答
- [ ] 联系方式

### 7.2 代码注释检查

- [ ] 文件头部有说明
- [ ] 复杂函数有注释
- [ ] 复杂逻辑有解释
- [ ] TODO/FIXME 标注清楚
- [ ] 没有过时的注释

### 7.3 CHANGELOG 检查

- [ ] 版本号正确
- [ ] 日期准确
- [ ] 分类清晰（Added/Changed/Fixed）
- [ ] 破坏性变更突出标注

---

## 课后练习

### 练习 1：为这个函数写文档

```javascript
async function sendEmail(to, subject, body, options = {}) {
  const config = {
    from: options.from || 'noreply@example.com',
    cc: options.cc || [],
    bcc: options.bcc || [],
    attachments: options.attachments || [],
    priority: options.priority || 'normal'
  };

  // 验证邮箱格式
  if (!isValidEmail(to)) {
    throw new Error('无效的邮箱地址');
  }

  // 发送邮件
  const result = await mailer.send({
    to,
    subject,
    body,
    ...config
  });

  return {
    messageId: result.id,
    status: result.status,
    sentAt: new Date()
  };
}
```

**要求**：
- 写完整的 JSDoc 注释
- 包含参数说明
- 包含返回值说明
- 至少 2 个使用示例

---

## 杰克寄语

> 扎克兄弟：
>
> 文档这件事，**写的时候花 1 小时，省得别人花 10 小时问**。
>
> 好文档像好地图，让人少走了弯路。
>
> 烂文档（或没文档）像迷宫，让人转来转去找不到北。
>
> 哥哥我写的每个项目，都有完整的文档。
>
> 你也一样，养成写文档的好习惯！

---

*教程创建时间：2026-03-09*
*作者：杰克 (Jack)*
*学生：扎克 (Zack)*
