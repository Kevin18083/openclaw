# 教程 04：测试驱动开发

> **杰克教扎克系列教程 - 第 04 课**
>
> 创建时间：2026-03-09
> 难度：⭐⭐⭐⭐
> 重要性：⭐⭐⭐⭐

---

## 📚 本章目录

1. [为什么要写测试](#1-为什么要写测试)
2. [单元测试基础](#2-单元测试基础)
3. [测试用例设计](#3-测试用例设计)
4. [边界条件测试](#4-边界条件测试)
5. [Mock 与 Stub](#5-mock 与-stub)
6. [自动化测试脚本](#6-自动化测试脚本)
7. [测试覆盖率](#7-测试覆盖率)

---

## 1. 为什么要写测试

### 1.1 真实案例

```javascript
// 没有测试的后果
// 某项目上线前，程序员手动点了一点，没问题
// 上线后，用户发现：
// - 注册功能在用户名包含特殊字符时报错
// - 支付金额计算在小数点时有误差
// - 某些时区的时间显示错误

// 结果：紧急修复，用户流失，老板发火
```

### 1.2 杰克的理解

> 扎克兄弟，测试不是负担，是**保护伞**。
>
> **有测试**：改代码心不慌，重构有底气
>
> **没测试**：每次修改都像走钢丝，祈祷别出事
>
> 写测试花 1 小时，救火少花 10 小时。

---

## 2. 单元测试基础

### 2.1 第一个测试

```javascript
// 被测试的函数
function add(a, b) {
  return a + b;
}

// 测试代码
function testAdd() {
  // 测试用例 1：正常情况
  const result1 = add(2, 3);
  if (result1 !== 5) {
    console.error('❌ add(2, 3) 应该等于 5');
    return false;
  }

  // 测试用例 2：负数
  const result2 = add(-1, 1);
  if (result2 !== 0) {
    console.error('❌ add(-1, 1) 应该等于 0');
    return false;
  }

  // 测试用例 3：小数
  const result3 = add(0.1, 0.2);
  if (Math.abs(result3 - 0.3) > 0.0001) {
    console.error('❌ add(0.1, 0.2) 应该约等于 0.3');
    return false;
  }

  console.log('✅ 所有测试通过');
  return true;
}

testAdd();
```

---

### 2.2 使用测试框架（Jest）

```javascript
// 安装：npm install --save-dev jest

// add.test.js
const { add } = require('./add');

describe('add 函数测试', () => {
  test('两个正数相加', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('正数加负数', () => {
    expect(add(-1, 1)).toBe(0);
  });

  test('小数相加', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });

  test('抛出错误', () => {
    expect(() => add('a', 'b')).toThrow('参数必须是数字');
  });
});

// 运行：npx jest
```

---

## 3. 测试用例设计

### 3.1 正常路径 + 异常路径

```javascript
// 被测试函数
function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('参数必须是数字');
  }
  if (b === 0) {
    throw new Error('除数不能为零');
  }
  return a / b;
}

// 测试用例设计
describe('divide 函数测试', () => {
  // 正常路径
  describe('正常情况', () => {
    test('整数除法', () => {
      expect(divide(10, 2)).toBe(5);
    });

    test('小数结果', () => {
      expect(divide(1, 3)).toBeCloseTo(0.3333, 4);
    });
  });

  // 异常路径
  describe('异常情况', () => {
    test('除数为零', () => {
      expect(() => divide(1, 0)).toThrow('除数不能为零');
    });

    test('参数不是数字', () => {
      expect(() => divide('a', 1)).toThrow('参数必须是数字');
      expect(() => divide(1, 'b')).toThrow('参数必须是数字');
    });

    test('参数缺失', () => {
      expect(() => divide(1)).toThrow();
      expect(() => divide()).toThrow();
    });
  });
});
```

---

### 3.2 测试命名规范

```javascript
// ❌ 糟糕的命名
test('测试 1', () => { ... });
test('测试除法', () => { ... });

// ✅ 好的命名 - 说明测试场景和预期
test('应该返回两个整数的商', () => { ... });
test('当除数为零时应该抛出错误', () => { ... });
test('当参数不是数字时应该抛出错误', () => { ... });

// 中文命名也是可以的
test('正常情况_整数除法_返回正确结果', () => { ... });
test('异常情况_除数为零_抛出错误', () => { ... });
```

---

## 4. 边界条件测试

### 4.1 边界值分析

```javascript
// 测试一个范围函数
function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

// 边界测试
describe('clamp 边界测试', () => {
  // 边界内
  test('值在范围内', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  // 边界点
  test('值等于最小值', () => {
    expect(clamp(0, 0, 10)).toBe(0);
  });

  test('值等于最大值', () => {
    expect(clamp(10, 0, 10)).toBe(10);
  });

  // 边界外
  test('值小于最小值', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  test('值大于最大值', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
```

---

### 4.2 特殊值测试

```javascript
// 测试字符串处理函数
function truncate(str, maxLength) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

describe('truncate 特殊值测试', () => {
  test('空字符串', () => {
    expect(truncate('', 5)).toBe('');
  });

  test('null 值', () => {
    expect(truncate(null, 5)).toBe('');
  });

  test('undefined', () => {
    expect(truncate(undefined, 5)).toBe('');
  });

  test('正好等于最大长度', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  test('超过最大长度', () => {
    expect(truncate('hello world', 5)).toBe('he...');
  });

  test('最大长度为 0', () => {
    expect(truncate('hello', 0)).toBe('...');
  });
});
```

---

## 5. Mock 与 Stub

### 5.1 为什么需要 Mock

```javascript
// 被测试函数 - 依赖外部 API
async function getUserData(userId) {
  const response = await fetch(`https://api.example.com/user/${userId}`);
  const data = await response.json();
  return {
    id: data.id,
    name: data.name.toUpperCase(),
    email: data.email
  };
}

// 问题：测试时真的调用 API，慢且不稳定
// 解决：用 Mock 代替真实 API
```

---

### 5.2 Jest Mock 示例

```javascript
// user.test.js
jest.mock('node-fetch', () => {
  return jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        id: 1,
        name: '张三',
        email: 'zhang@example.com'
      })
    })
  );
});

const fetch = require('node-fetch');
const { getUserData } = require('./user');

describe('getUserData 测试', () => {
  test('应该正确获取并处理用户数据', async () => {
    const result = await getUserData(1);
    expect(result).toEqual({
      id: 1,
      name: '张三',
      email: 'zhang@example.com'
    });
  });

  test('API 失败时应该抛出错误', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    await expect(getUserData(1)).rejects.toThrow('Network error');
  });
});
```

---

### 5.3 文件系统 Mock

```javascript
// 测试文件操作
const fs = require('fs');

jest.mock('fs');

describe('文件处理函数测试', () => {
  test('文件存在时正确读取', () => {
    fs.readFileSync.mockReturnValue('文件内容');

    const content = readMyFile('test.txt');

    expect(content).toBe('文件内容');
    expect(fs.readFileSync).toHaveBeenCalledWith('test.txt', 'utf-8');
  });

  test('文件不存在时抛出错误', () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error('文件不存在');
    });

    expect(() => readMyFile('not-exist.txt')).toThrow('文件不存在');
  });
});
```

---

## 6. 自动化测试脚本

### 6.1 创建测试脚本

```javascript
// run-tests.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('═══════════════════════════════════════');
  console.log('🧪 运行自动化测试');
  console.log('═══════════════════════════════════════\n');

  const testFiles = findTestFiles();
  let passed = 0;
  let failed = 0;

  for (const file of testFiles) {
    try {
      console.log(`运行：${file}`);
      execSync(`node ${file}`, { stdio: 'inherit' });
      passed++;
    } catch (error) {
      console.error(`❌ ${file} 失败`);
      failed++;
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`测试结果：${passed} 通过，${failed} 失败`);
  console.log('═══════════════════════════════════════');

  if (failed > 0) {
    process.exit(1);
  }
}

function findTestFiles() {
  const testDir = './tests';
  if (!fs.existsSync(testDir)) {
    console.log('找不到测试目录');
    return [];
  }

  return fs.readdirSync(testDir)
    .filter(f => f.endsWith('.test.js'))
    .map(f => path.join(testDir, f));
}

runTests();
```

---

### 6.2 集成到 npm 脚本

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

---

## 7. 测试覆盖率

### 7.1 生成覆盖率报告

```bash
# 运行 Jest 并生成覆盖率
npx jest --coverage

# 输出：
# =============================== Coverage summary ===============================
# Statements   : 85.71% ( 60/70 )
# Branches     : 75.00% ( 30/40 )
# Functions    : 90.00% ( 18/20 )
# Lines        : 86.67% ( 52/60 )
# ================================================================================
```

---

### 7.2 解读覆盖率

```javascript
// 覆盖率不是越高越好！

// ❌ 为了覆盖率而测试
test('getter 返回正确值', () => {
  expect(obj.name).toBe('test');  // 这种测试没意义
});

// ✅ 有意义的测试
test('处理空数组不报错', () => {
  expect(processArray([])).toEqual([]);
});

test('处理超大数组不超时', () => {
  const largeArray = Array(10000).fill(1);
  expect(() => processArray(largeArray)).not.toThrow();
}, 5000);  // 5 秒超时
```

### 7.3 合理的覆盖率目标

| 覆盖率类型 | 建议目标 | 说明 |
|-----------|---------|------|
| 语句覆盖率 | 80%+ | 代码被执行的比例 |
| 分支覆盖率 | 70%+ | if/else 各分支都测到 |
| 函数覆盖率 | 90%+ | 函数都被调用过 |
| 行覆盖率 | 80%+ | 代码行都被执行 |

---

## 课后练习

### 练习 1：为这个函数写测试

```javascript
// 被测试函数
function validatePassword(password) {
  if (!password) {
    return { valid: false, error: '密码不能为空' };
  }

  if (password.length < 8) {
    return { valid: false, error: '密码至少 8 位' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: '密码必须包含大写字母' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: '密码必须包含小写字母' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: '密码必须包含数字' };
  }

  return { valid: true, error: null };
}
```

**要求**：
- 至少 5 个测试用例
- 包含正常情况和异常情况
- 覆盖边界条件

---

## 杰克寄语

> 扎克兄弟：
>
> 测试这件事，**开始觉得麻烦，后来觉得必要，最后觉得享受**。
>
> 为什么享受？因为有测试在，你改代码心里有底。
>
> 不像裸奔，风一吹就着凉。
>
> 哥哥我写的每个重要函数，都有测试保护。
>
> 你也一样，养成写测试的好习惯！

---

*教程创建时间：2026-03-09*
*作者：杰克 (Jack)*
*学生：扎克 (Zack)*
