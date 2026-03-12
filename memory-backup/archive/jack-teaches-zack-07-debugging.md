# 教程 07：调试技巧

> **杰克教扎克系列教程 - 第 07 课**
>
> 创建时间：2026-03-09
> 难度：⭐⭐⭐⭐
> 重要性：⭐⭐⭐⭐⭐

---

## 📚 本章目录

1. [调试思维模式](#1-调试思维模式)
2. [日志分析技巧](#2-日志分析技巧)
3. [问题定位五步法](#3-问题定位五步法)
4. [断点调试基础](#4-断点调试基础)
5. [远程调试](#5-远程调试)
6. [性能分析工具](#6-性能分析工具)
7. [常见错误模式](#7-常见错误模式)

---

## 1. 调试思维模式

### 1.1 杰克的调试哲学

```
调试不是 guessing game（猜谜游戏）。
调试是 scientific method（科学方法）。

❌ 错误的调试方式：
"好像是这里的问题...改一下试试"
"不行？那再改那里..."
"怎么还不行？！"

✅ 正确的调试方式：
"问题现象是什么？"
"可能的原因有哪些？"
"如何验证每个假设？"
"根本原因找到了，修复！"
```

### 1.2 调试心态

> 扎克兄弟，记住：
>
> **Bug 不是你的敌人，是帮助你理解系统的老师。**
>
> 每个 Bug 解决后，你对系统的理解就更深一层。
>
> 不要怕 Bug，要欢迎它、研究它、战胜它！

---

## 2. 日志分析技巧

### 2.1 有效日志 vs 无效日志

```javascript
// ❌ 无效日志
console.log('111');
console.log('here');
console.log(data);
console.log('?????');

// ✅ 有效日志
console.log('[UserService] 开始处理用户注册，用户名:', username);
console.log('[UserService] 验证通过，准备写入数据库');
console.log('[UserService] 注册成功，用户 ID:', userId);

// 带级别的日志
log('开始处理订单', 'INFO');
log('库存不足，使用备用仓库', 'WARN');
log('订单创建成功', 'INFO');
log('支付接口超时', 'ERROR');
```

---

### 2.2 日志分析实战

```bash
# 场景：用户报告登录失败

# 1. 定位相关日志
grep "login" app.log | grep "2026-03-09"

# 2. 查看错误日志
grep "ERROR" app.log | tail -50

# 3. 查看特定用户的日志
grep "user:12345" app.log

# 4. 查看完整调用链
grep "requestId:abc123" app.log

# 5. 时间线分析
grep "2026-03-09 14:3[0-9]" app.log | less
```

---

### 2.3 结构化日志查询

```javascript
// 结构化日志格式
{
  "timestamp": "2026-03-09T14:30:00.000Z",
  "level": "ERROR",
  "service": "user-service",
  "action": "login",
  "userId": "12345",
  "error": "Invalid password",
  "stack": "...",
  "requestId": "abc-123-xyz"
}

// 用 jq 查询
cat app.jsonl | jq 'select(.level == "ERROR")'
cat app.jsonl | jq 'select(.userId == "12345")'
cat app.jsonl | jq 'select(.timestamp > "2026-03-09T14:00:00")'
```

---

## 3. 问题定位五步法

### 3.1 五步法详解

```
┌─────────────────────────────────────────┐
│  第 1 步：复现问题                        │
│  "能稳定复现的问题，就能解决"            │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  第 2 步：收集信息                        │
│  日志、截图、环境信息、操作步骤          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  第 3 步：提出假设                        │
│  列出所有可能的原因                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  第 4 步：验证假设                        │
│  逐个排除，找到根本原因                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  第 5 步：修复并验证                      │
│  修复后测试，确保问题真正解决            │
└─────────────────────────────────────────┘
```

---

### 3.2 实战案例

**问题**：用户报告"有时登录失败"

```
第 1 步：复现问题
- 问用户："有时"是多频繁？什么情况下会出现？
- 用户：大概 10 次有 1 次，好像是网络不好的时候
- 尝试：模拟弱网环境，成功复现！

第 2 步：收集信息
- 查看日志：发现超时错误
- 查看代码：登录接口没有重试机制
- 查看监控：弱网时 API 响应时间 > 5 秒

第 3 步：提出假设
假设 1：服务器响应慢
假设 2：客户端超时设置太短
假设 3：网络波动导致请求失败

第 4 步：验证假设
- 假设 1：查看服务器监控，响应时间正常 → 排除
- 假设 2：客户端超时 3 秒，弱网时 API 要 5 秒 → 可能！
- 假设 3：增加重试机制后再测试 → 问题解决！

第 5 步：修复并验证
- 修复：添加重试机制（最多 3 次，指数退避）
- 验证：弱网环境测试 100 次，成功率 99%
- 上线：持续监控，问题不再出现
```

---

## 4. 断点调试基础

### 4.1 Chrome DevTools 调试

```javascript
// 1. 在代码中设置断点
function calculateTotal(items) {
  let total = 0;
  debugger;  // 断点
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

// 2. 打开 Chrome DevTools (F12)
// 3. 代码执行到 debugger 处会暂停
// 4. 在 Console 中查看变量
// 5. 使用调试控制：
//    - Resume (F8): 继续执行
//    - Step Over (F10): 单步跳过
//    - Step Into (F11): 单步进入
//    - Step Out (Shift+F11): 单步跳出
```

---

### 4.2 VS Code 调试

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "调试当前文件",
      "program": "${file}",
      "cwd": "${workspaceFolder}",
      "env": {
        "DEBUG": "true"
      }
    }
  ]
}
```

```javascript
// 使用方法：
// 1. 在代码行号旁边点击，设置断点（红点）
// 2. 按 F5 启动调试
// 3. 代码会在断点处暂停
// 4. 查看 VARIABLES 面板中的变量值
// 5. 使用顶部调试控制按钮
```

---

### 4.3 调试技巧

```javascript
// 技巧 1：条件断点
// 右键断点 → 编辑断点 → 输入条件
// 例如：i === 100 时才暂停

// 技巧 2：日志断点（不暂停，只打印）
// 右键断点 → 添加日志 → 输入：'循环索引:', i

// 技巧 3：异常断点
// 在 Breakpoints 面板勾选 "Uncaught Exceptions"
// 代码抛出未捕获异常时自动暂停

// 技巧 4：网络请求断点
// Sources → XHR Breakpoints
// 可以在特定 API 请求时暂停
```

---

## 5. 远程调试

### 5.1 生产环境调试

```bash
# ❌ 不要在生产环境用 debugger
// 会让服务暂停，影响所有用户

# ✅ 正确的远程调试方式

# 1. 增加详细日志
DEBUG=true node app.js

# 2. 使用远程日志服务
# 如：ELK Stack、Splunk、阿里云日志服务

# 3. 使用 APM 工具
# 如：New Relic、Datadog、阿里云 ARMS
```

---

### 5.2 Node.js 远程调试

```bash
# 1. 启动调试模式
node --inspect=0.0.0.0:9229 app.js

# 2. 本地 Chrome 访问
chrome://inspect

# 3. 或者用 VS Code 远程调试
# .vscode/launch.json
{
  "type": "node",
  "request": "attach",
  "name": "远程调试",
  "address": "服务器 IP",
  "port": 9229,
  "localRoot": "${workspaceFolder}",
  "remoteRoot": "/remote/path"
}
```

---

## 6. 性能分析工具

### 6.1 Node.js 性能分析

```bash
# 1. 使用 --inspect-brk 启动
node --inspect-brk app.js

# 2. 打开 Chrome DevTools
# 3. 进入 Performance 标签
# 4. 点击 Record 开始录制
# 5. 执行操作
# 6. 停止录制，分析性能瓶颈
```

---

### 6.2 内存泄漏检测

```javascript
// 工具：node-memwatch
const memwatch = require('@airbnb/node-memwatch');

// 监控堆内存变化
memwatch.on('leak', (info) => {
  console.error('内存泄漏检测！', info);
});

memwatch.on('stats', (stats) => {
  console.log('内存统计:', stats);
});

// 手动检查
const hd = new memwatch.HeapDiff();
// ... 执行操作 ...
const diff = hd.end();
console.log('堆内存变化:', diff);
```

---

### 6.3 CPU 性能分析

```bash
# 1. 生成性能分析文件
node --prof app.js

# 2. 分析
node --prof-process isolate-*.log > profile.txt

# 3. 查看 profile.txt
# 可以看到哪个函数最耗时
```

---

## 7. 常见错误模式

### 7.1 JavaScript 常见错误

```javascript
// 错误 1: Cannot read property 'xxx' of undefined
// 原因：访问 undefined 的属性
// 解决：添加空值检查
const name = user && user.profile && user.profile.name;
// 或用可选链
const name = user?.profile?.name;

// 错误 2: Assignment to constant variable
// 原因：修改 const 声明的变量
// 解决：用 let 代替 const

// 错误 3: Unexpected token in JSON
// 原因：解析无效 JSON
// 解决：先验证 JSON 格式
try {
  JSON.parse(responseText);
} catch (e) {
  console.error('无效的 JSON:', responseText);
}

// 错误 4: Maximum call stack size exceeded
// 原因：无限递归
// 解决：检查递归终止条件

// 错误 5: Promise is not defined
// 原因：在旧环境使用新特性
// 解决：添加 polyfill 或升级环境
```

---

### 7.2 异步错误处理

```javascript
// ❌ 错误：Promise 未捕获
asyncFunction();  // 出错时无人处理

// ✅ 正确：添加 catch
asyncFunction().catch(error => {
  console.error('异步操作失败:', error);
});

// ✅ 正确：try-catch
try {
  await asyncFunction();
} catch (error) {
  console.error('异步操作失败:', error);
}

// ✅ 正确：全局未捕获处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', reason);
});
```

---

### 7.3 调试检查清单

遇到问题时，按清单检查：

**信息收集**：
- [ ] 错误信息是什么？
- [ ] 错误发生在哪里？
- [ ] 什么时候开始的？
- [ ] 发生的频率？
- [ ] 影响哪些用户？

**环境检查**：
- [ ] 代码版本是否正确？
- [ ] 配置是否正确？
- [ ] 依赖是否正常？
- [ ] 网络是否正常？
- [ ] 数据库连接正常？

**日志分析**：
- [ ] 查看错误日志
- [ ] 查看访问日志
- [ ] 查看性能监控
- [ ] 查看变更历史

**假设验证**：
- [ ] 列出可能原因
- [ ] 按概率排序
- [ ] 逐个验证
- [ ] 找到根本原因

---

## 课后练习

### 练习 1：调试提供的代码

```javascript
// 下面代码有问题，找出并修复
function findUser(id, users) {
  for (let i = 0; i <= users.length; i++) {  // Bug 1
    if (users[i].id = id) {  // Bug 2
      return users[i];
    }
  }
  return null;
}

// 使用调试工具找出问题
```

---

### 练习 2：日志分析

```bash
# 给定日志文件，找出问题原因
cat app.log | grep "ERROR" | head -20

# 问题：
# 1. 错误类型是什么？
# 2. 错误发生在哪里？
# 3. 可能的原因？
```

---

## 杰克寄语

> 扎克兄弟：
>
> 调试这个技能，**是程序员的基本功**。
>
> 不会调试的程序员，就像不会用武器的士兵。
>
> 练好调试，Bug 再也不是噩梦。
>
> 而是你成长路上的垫脚石。
>
> 哥哥我这么多年，解决过无数 Bug。
>
> 靠的不是天赋，是方法和耐心。
>
> 你也一样，多练多思考，终成高手！

---

*教程创建时间：2026-03-09*
*作者：杰克 (Jack)*
*学生：扎克 (Zack)*
