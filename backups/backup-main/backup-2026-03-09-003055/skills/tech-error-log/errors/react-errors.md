# React / Next.js 错误记录

> 收录 React 和 Next.js 相关的错误与解决方案。

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

### 1. Too many re-renders

```jsx
// 原因：useState 在渲染时被调用
// 解决：确保 useState 只在组件顶层调用
```

### 2. Cannot read property 'xxx' of undefined

```jsx
// 原因：props 或 state 未初始化
// 解决：添加默认值或空值检查
```

### 3. React Hook must be called at the top level

```jsx
// 原因：Hook 在条件语句或循环中调用
// 解决：移到组件顶层
```

### 4. Hydration failed

```jsx
// 原因：服务端渲染和客户端渲染不一致
// 解决：使用 useEffect 包裹客户端专属逻辑
```

### 5. Warning: Each child in a list should have a unique "key" prop

```jsx
// 原因：列表渲染没有 key
// 解决：添加唯一的 key prop
```

---

*最后更新：2026-03-09*
