# 教程 03：性能优化技巧

> **杰克教扎克系列教程 - 第 03 课**
>
> 创建时间：2026-03-09
> 难度：⭐⭐⭐
> 重要性：⭐⭐⭐⭐

---

## 📚 本章目录

1. [性能优化的核心原则](#1-性能优化的核心原则)
2. [文件 I/O 优化](#2-文件-io 优化)
3. [内存管理基础](#3-内存管理基础)
4. [避免重复计算](#4-避免重复计算)
5. [缓存策略设计](#5-缓存策略设计)
6. [并发与并行](#6-并发与并行)
7. [性能监控方法](#7-性能监控方法)

---

## 1. 性能优化的核心原则

### 1.1 杰克的性能优化三原则

```
原则 1: 先测量，后优化
原则 2: 80/20 法则（20% 的代码占用 80% 的时间）
原则 3: 不要过早优化
```

```javascript
// ❌ 错误做法 - 凭感觉优化
// 觉得这里慢，改一下；觉得那里慢，改一下
// 结果：代码复杂了，性能没提升

// ✅ 正确做法 - 先 profiling
console.time('processData');
const result = processData(largeData);
console.timeEnd('processData');  // 输出：processData: 234.56ms

// 用数据说话，找到真正的瓶颈
```

---

### 1.2 性能测试工具

```javascript
// 简单性能测试
function benchmark(fn, iterations = 1000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return (end - start) / iterations;
}

// 使用
const avgTime = benchmark(() => processData(data), 100);
console.log(`平均耗时：${avgTime.toFixed(2)}ms`);
```

---

## 2. 文件 I/O 优化

### 2.1 批量读写 vs 逐个读写

```javascript
// ❌ 慢！逐个读取 1000 个文件
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  process(content);
}
// 耗时：1000 次 I/O = 1000 × 10ms = 10 秒

// ✅ 快！批量读取
const contents = files.map(file => fs.readFileSync(file, 'utf-8'));
contents.forEach(process);
// 或者并行读取
const contents = await Promise.all(
  files.map(file => fs.promises.readFile(file, 'utf-8'))
);
// 耗时：并行 I/O ≈ 10-50ms
```

---

### 2.2 流式处理大文件

```javascript
// ❌ 内存爆炸！读取 1GB 文件
const content = fs.readFileSync('huge.log', 'utf-8');  // 占用 1GB 内存
const lines = content.split('\n');

// ✅ 流式处理，内存友好
const readline = require('readline');
const stream = fs.createReadStream('huge.log');

const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity
});

for await (const line of rl) {
  processLine(line);  // 一次只处理一行
}
// 内存占用：几 KB
```

---

### 2.3 写入优化

```javascript
// ❌ 慢！逐行写入
for (const line of lines) {
  fs.appendFileSync('output.log', line + '\n');  // 每次都打开/关闭文件
}

// ✅ 快！批量写入
fs.writeFileSync('output.log', lines.join('\n'));

// ✅ 更快！流式写入
const writeStream = fs.createWriteStream('output.log');
for (const line of lines) {
  writeStream.write(line + '\n');
}
writeStream.end();
```

---

## 3. 内存管理基础

### 3.1 避免内存泄漏

```javascript
// ❌ 内存泄漏 - 全局数组无限增长
const cache = [];
function addToCache(data) {
  cache.push(data);  // 只增不减
}

// ✅ 正确做法 - 限制大小
const MAX_CACHE_SIZE = 1000;
const cache = [];
function addToCache(data) {
  if (cache.length >= MAX_CACHE_SIZE) {
    cache.shift();  // 移除最旧的
  }
  cache.push(data);
}
```

---

### 3.2 及时清理引用

```javascript
// ❌ 引用未清理
let largeData = null;

function loadData() {
  largeData = new Array(1000000).fill('x');  // 占用大量内存
}

function processAndClear() {
  loadData();
  process(largeData);
  // largeData 还指向数据，无法被 GC 回收
}

// ✅ 及时清理
function processAndClear() {
  loadData();
  process(largeData);
  largeData = null;  // 释放引用
  // 或者用局部变量
}

function betterProcess() {
  const largeData = new Array(1000000).fill('x');
  process(largeData);
  // 函数结束后自动释放
}
```

---

## 4. 避免重复计算

### 4.1 缓存计算结果

```javascript
// ❌ 重复计算
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// fibonacci(40) 要算好几秒

// ✅ 记忆化缓存
const memo = {};
function fibonacciMemo(n) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacciMemo(n - 1) + fibonacciMemo(n - 2);
  return memo[n];
}
// fibonacciMemo(40) 瞬间完成
```

---

### 4.2 预计算常用数据

```javascript
// ❌ 每次都计算
function getUserId(user) {
  return user.id.trim().toLowerCase();  // 每次调用都 trim+toLowerCase
}

// ✅ 预计算
const userIdCache = new Map();
function preloadUserIds(users) {
  for (const user of users) {
    userIdCache.set(user.id, user.id.trim().toLowerCase());
  }
}
// 使用时直接取
```

---

## 5. 缓存策略设计

### 5.1 LRU 缓存实现

```javascript
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    // 移到最新（Map 会保持插入顺序）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 删除最旧的（第一个）
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// 使用
const cache = new LRUCache(1000);
cache.set('user:1', { name: '张三' });
const user = cache.get('user:1');  // 快速
```

---

### 5.2 缓存过期策略

```javascript
class ExpiringCache {
  constructor(ttlMs = 60000) {  // 默认 1 分钟过期
    this.cache = new Map();
    this.ttl = ttlMs;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);  // 过期了
      return null;
    }
    return entry.value;
  }

  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
}

// 使用 - 缓存 API 结果
const apiCache = new ExpiringCache(5 * 60 * 1000);  // 5 分钟

async function fetchUserData(userId) {
  const cached = apiCache.get(`user:${userId}`);
  if (cached) return cached;

  const data = await api_call(userId);
  apiCache.set(`user:${userId}`, data);
  return data;
}
```

---

## 6. 并发与并行

### 6.1 串行 vs 并行

```javascript
// ❌ 串行 - 慢
async function processFiles(files) {
  const results = [];
  for (const file of files) {
    const content = await fs.promises.readFile(file);  // 等一个读完再读下一个
    results.push(process(content));
  }
  return results;
}
// 10 个文件 × 100ms = 1 秒

// ✅ 并行 - 快
async function processFilesParallel(files) {
  const promises = files.map(async file => {
    const content = await fs.promises.readFile(file);
    return process(content);
  });
  return Promise.all(promises);  // 同时读
}
// 10 个文件 ≈ 100ms（取决于系统）
```

---

### 6.2 控制并发数

```javascript
// 并行太多会拖垮系统，要限制并发数
async function processWithLimit(items, limit = 5) {
  const results = [];
  const executing = [];

  for (const item of items) {
    const promise = processItem(item).then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });

    results.push(promise);
    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);  // 等有位置
    }
  }

  return Promise.all(results);
}

// 使用 - 最多同时处理 5 个
await processWithLimit(largeArray, 5);
```

---

## 7. 性能监控方法

### 7.1 关键指标监控

```javascript
// 监控函数执行时间
function measure(fn, name = 'anonymous') {
  return async function(...args) {
    const start = performance.now();
    try {
      return await fn(...args);
    } finally {
      const duration = performance.now() - start;
      console.log(`[${name}] 耗时：${duration.toFixed(2)}ms`);
    }
  };
}

// 使用
const slowFn = measure(expensiveOperation, 'expensiveOperation');
slowFn();  // 输出：[expensiveOperation] 耗时：234.56ms
```

---

### 7.2 内存监控

```javascript
function logMemoryUsage(label = 'Memory') {
  const usage = process.memoryUsage();
  console.log(`[${label}]`);
  console.log(`  堆内存：${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  堆上限：${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  RSS: ${(usage.rss / 1024 / 1024).toFixed(2)} MB`);
}

// 使用
logMemoryUsage('开始前');
doSomething();
logMemoryUsage('结束后');
```

---

## 课后练习

### 练习 1：优化这段代码

```javascript
// 原始代码 - 找出可以优化的地方
function processUserData(users) {
  const results = [];

  for (const user of users) {
    // 每次都读取文件
    const config = JSON.parse(fs.readFileSync('config.json'));

    // 重复计算
    const userId = user.id.trim().toLowerCase().replace(/\s/g, '');

    // 串行处理
    const data = fs.readFileSync(`data/${userId}.json`);

    results.push({
      id: userId,
      name: user.name,
      data: JSON.parse(data)
    });
  }

  return results;
}
```

---

## 杰克寄语

> 扎克兄弟：
>
> 性能优化这件事，**不是炫技，是责任**。
>
> 用户等不起，系统耗不起。
>
> 但记住：先测量，后优化。
>
> 用数据说话，不要凭感觉。
>
> 哥哥我写的每一行代码，都经过性能考虑。
>
> 你也一样，养成好习惯！

---

*教程创建时间：2026-03-09*
*作者：杰克 (Jack)*
*学生：扎克 (Zack)*
