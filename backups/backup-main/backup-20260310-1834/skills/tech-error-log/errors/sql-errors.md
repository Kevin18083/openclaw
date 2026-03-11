# SQL / 数据库错误记录

> 收录 MySQL、PostgreSQL、SQLite 等数据库相关的错误与解决方案。

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

### 1. ER_DUP_ENTRY: Duplicate entry for key

```sql
-- 原因：插入重复的主键或唯一索引
-- 解决：检查数据是否已存在或使用 INSERT IGNORE
```

### 2. ER_BAD_FIELD_ERROR: Unknown column

```sql
-- 原因：列名不存在或拼写错误
-- 解决：检查表结构和列名
```

### 3. Connection refused

```bash
# 原因：数据库服务未启动或连接信息错误
# 解决：检查服务状态和连接配置
```

### 4. Too many connections

```sql
-- 原因：连接数超过最大限制
-- 解决：关闭空闲连接或增加 max_connections
```

### 5. Lock wait timeout exceeded

```sql
-- 原因：事务锁等待超时
-- 解决：检查长事务或优化查询
```

---

*最后更新：2026-03-09*
