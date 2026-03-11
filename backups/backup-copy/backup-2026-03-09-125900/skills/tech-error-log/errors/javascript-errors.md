# JavaScript / Node.js 错误记录

> 收录 JavaScript 和 Node.js 相关的错误与解决方案。

---

## 错误列表

| 日期 | 错误 | 原因 | 解决时间 |
|------|------|------|----------|
| - | - | - | - |

---

## 详细记录

*（暂无记录，遇到后添加）*

---

## 常见错误速查

### 1. TypeError: Cannot read property 'xxx' of undefined

```javascript
// 原因：访问 undefined 的属性
// 解决：添加空值检查或使用可选链
const name = user?.profile?.name;
```

### 2. ReferenceError: xxx is not defined

```javascript
// 原因：变量未声明或作用域问题
// 解决：检查变量声明和使用位置
```

### 3. SyntaxError: Unexpected token

```javascript
// 原因：JSON 解析失败或语法错误
// 解决：检查 JSON 格式或代码语法
```

### 4. Error: ENOENT: no such file or directory

```javascript
// 原因：文件路径错误
// 解决：使用 path.join() 拼接路径，检查文件是否存在
```

### 5. RangeError: Maximum call stack size exceeded

```javascript
// 原因：无限递归
// 解决：检查递归终止条件
```

---

*最后更新：2026-03-09*
