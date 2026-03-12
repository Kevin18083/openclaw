# TypeScript 错误记录

> 收录 TypeScript 相关的错误与解决方案。

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

### 1. TS2304: Cannot find name 'xxx'

```typescript
// 原因：变量未声明或类型未导入
// 解决：检查导入语句和变量声明
```

### 2. TS2345: Argument of type 'X' is not assignable to parameter of type 'Y'

```typescript
// 原因：类型不匹配
// 解决：检查类型定义，必要时进行类型转换
```

### 3. TS2339: Property 'xxx' does not exist on type 'Y'

```typescript
// 原因：访问不存在的属性或类型定义不完整
// 解决：检查接口定义或使用类型断言
```

### 4. TS7006: Parameter 'xxx' implicitly has an 'any' type

```typescript
// 原因：参数没有类型注解
// 解决：添加类型注解 (param: string)
```

### 5. TS1110: Type expected

```typescript
// 原因：类型语法错误
// 解决：检查泛型、联合类型等语法
```

---

*最后更新：2026-03-09*
