# 杰克测试指南 - 扎克测试专用

> **版本**: 1.0.0
> **创建日期**: 2026-03-10
> **状态**: ✅ 已启用 - 杰克开发测试专用

---

## 📖 概述

这是杰克 (Jack) 用于开发和测试的专用指南。

**用途**：
- 杰克单独开发时使用
- 测试新功能和代码
- 验证框架和脚本
- 持续集成测试

**触发词**：
- "让杰克测试"
- "叫杰克测试"

---

## 📋 测试类型

### 1. 单元测试

测试单个函数或模块。

```javascript
// 示例：测试 add 函数
function add(a, b) {
  return a + b;
}

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

### 2. 使用 Jest 框架

```javascript
// 安装：npm install --save-dev jest

// add.test.js
const { add } = require('./add');

describe('add 函数测试', () => {
  test('2 + 3 = 5', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('-1 + 1 = 0', () => {
    expect(add(-1, 1)).toBe(0);
  });

  test('0.1 + 0.2 ≈ 0.3', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
});

// 运行：npm test
```

---

### 3. 测试用例设计

**4 种测试类型**：

| 类型 | 说明 | 示例 |
|------|------|------|
| 正常情况 | 输入合法值，验证输出 | `add(2, 3)` |
| 边界情况 | 最大值、最小值、空值 | `add(0, 0)` |
| 异常情况 | 非法输入、错误处理 | `add(null, 1)` |
| 性能情况 | 大数据量、高并发 | `add(1000000, 1000000)` |

**示例**：
```javascript
describe('用户注册测试', () => {
  // 正常
  test('正常用户名注册成功', () => {
    const result = registerUser('testuser');
    expect(result.success).toBe(true);
  });

  // 边界
  test('用户名长度为 1 时', () => {
    const result = registerUser('a');
    expect(result.success).toBe(true);
  });

  test('用户名长度为 100 时', () => {
    const result = registerUser('a'.repeat(100));
    expect(result.success).toBe(true);
  });

  // 异常
  test('用户名包含特殊字符', () => {
    const result = registerUser('test<script>');
    expect(result.success).toBe(false);
  });

  test('用户名为空', () => {
    const result = registerUser('');
    expect(result.success).toBe(false);
  });
});
```

---

### 4. Mock 与 Stub

**Mock**：模拟数据/函数，用于隔离测试。

```javascript
// 假设有个函数调用 API
async function getUser(id) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// 用 Mock 模拟 API 响应
jest.mock('./api');
api.fetch.mockResolvedValue({
  json: () => ({ id: 1, name: '测试' })
});

// 测试
test('获取用户信息', async () => {
  const user = await getUser(1);
  expect(user.name).toBe('测试');
});
```

---

### 5. 测试覆盖率

**查看覆盖率**：
```bash
# Jest 覆盖率
npm test -- --coverage

# 输出：
# - 语句覆盖率 (Statements)
# - 分支覆盖率 (Branches)
# - 函数覆盖率 (Functions)
# - 行覆盖率 (Lines)
```

**目标**：
- 80% 以上 - 良好
- 100% - 理想，但可能成本高
- 关键代码必须 100% 覆盖

---

## 🧪 测试清单

### 杰克开发测试流程

```
1. 编写代码
   ↓
2. 编写测试用例
   ↓
3. 运行测试
   ↓
4. 修复失败测试
   ↓
5. 验证覆盖率
   ↓
6. 提交代码
```

### 测试检查清单

- [ ] 正常情况测试
- [ ] 边界情况测试
- [ ] 异常情况测试
- [ ] 错误处理测试
- [ ] 性能测试（如需要）
- [ ] 覆盖率达标（>80%）

---

## 📁 测试文件结构

```
project/
├── src/              # 源代码
│   ├── add.js        # 被测试文件
│   └── register.js
├── tests/            # 测试文件
│   ├── add.test.js
│   └── register.test.js
├── package.json      # 依赖配置
└── jest.config.js    # Jest 配置
```

---

## 🚀 快速开始

### 1. 安装 Jest

```bash
npm install --save-dev jest
```

### 2. 配置 package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 3. 编写测试

```javascript
// sum.test.js
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

### 4. 运行测试

```bash
npm test
```

---

## 📊 测试报告格式

```markdown
## 📋 测试报告

**测试文件**: [文件名]
**测试时间**: [开始] - [完成]
**测试用例**: [总数] 个

### 结果
- ✅ 通过：[数量] 个
- ❌ 失败：[数量] 个

### 覆盖率
- 语句：[XX]%
- 分支：[XX]%
- 函数：[XX]%
- 行：[XX]%

### 失败详情
[如果有失败，列出原因]

---
请罗总审阅。
```

---

## 🔧 测试工具

| 工具 | 用途 | 命令 |
|------|------|------|
| Jest | 测试框架 | `npm test` |
| Coverage | 覆盖率 | `npm test -- --coverage` |
| Watch | 监听模式 | `npm test -- --watch` |
| Verbose | 详细输出 | `npm test -- --verbose` |

---

## 📝 测试原则

1. **测试驱动开发 (TDD)** - 先写测试，再写实现
2. **测试隔离** - 每个测试用例独立
3. **测试可重复** - 每次运行结果一致
4. **测试简洁** - 测试代码要简单明了
5. **测试覆盖** - 关键代码必须测试

---

## ⚠️ 注意事项

1. **测试不是万能的** - 有测试不代表没 Bug
2. **不要过度测试** - 测试简单的 getter/setter 没必要
3. **测试也要维护** - 重构时更新测试
4. **测试名称要清晰** - 一眼看出测什么

---

## 📞 杰克专用

**使用场景**：只有扎克自己做，杰克监督的时候才启用！

**这个文件是杰克开发和测试时用的，扎克不需要看。**

**扎克触发词**：
- "让杰克测试" → 杰克用这个文件
- "叫杰克测试" → 杰克用这个文件

**杰克使用后，在网页端回复罗总结果。**

---

## 🔧 通用测试框架

**这套测试方法可以用于任何新功能、新脚本、新系统的测试。**

### 命名规范

| 类型 | 命名格式 | 示例 |
|------|----------|------|
| 功能脚本 | `xxx-switcher.js` | `backup-switcher.js` |
| 测试脚本 | `test-xxx.js` | `test-backup-switch.js` |
| 维护脚本 | `xxx-maintenance.js` | `memory-maintenance.js` |

### 测试脚本结构

```javascript
#!/usr/bin/env node
/**
 * 测试脚本说明
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 测试名称\n');
console.log('='.repeat(60));

// 测试 1: 功能名称
console.log('\n【测试 1】功能描述');
console.log('-'.repeat(60));
// 测试代码...
console.log('✅ 通过');

// ... 更多测试

console.log('\n' + '='.repeat(60));
console.log('🎉 测试完成！\n');
```

---

## 📊 测试报告模板

```markdown
## 📋 测试报告

**测试脚本**: [脚本名称]
**测试时间**: [开始时间] - [结束时间]
**耗时**: [X 分钟]

### 测试结果

| 测试项 | 状态 | 说明 |
|--------|------|------|
| 测试 1 | ✅ | 说明 |
| 测试 2 | ✅ | 说明 |
| 测试 3 | ❌ | 失败原因 |

### 总结
- 通过：X 个
- 失败：X 个
- 通过率：XX%

### 失败详情
[如果有失败，列出原因和修复建议]

---
请罗总审阅。
```

---

*此文件永久有效，杰克专用*
*版本：3.0.0 (通用测试框架版)*
*最后更新：2026-03-10*
