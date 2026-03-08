# API / HTTP 错误记录

> 收录 HTTP 请求、REST API、GraphQL 等相关的错误与解决方案。

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

### HTTP 状态码

| 状态码 | 含义 | 常见原因 |
|--------|------|----------|
| 400 Bad Request | 请求格式错误 | 参数缺失、JSON 格式错误 |
| 401 Unauthorized | 未授权 | Token 缺失或过期 |
| 403 Forbidden | 禁止访问 | 权限不足 |
| 404 Not Found | 资源不存在 | URL 错误或资源已删除 |
| 429 Too Many Requests | 请求过多 | 触发限流 |
| 500 Internal Server Error | 服务器错误 | 代码异常 |
| 502 Bad Gateway | 网关错误 | 上游服务失败 |
| 503 Service Unavailable | 服务不可用 | 服务过载或维护 |

### 1. CORS Error

```javascript
// 原因：跨域请求被浏览器拦截
// 解决：服务端配置 CORS 头或使用代理
```

### 2. Timeout Error

```javascript
// 原因：请求超时
// 解决：增加超时时间或优化接口性能
```

### 3. Network Error

```javascript
// 原因：网络连接失败
// 解决：检查网络状态和服务端是否可达
```

### 4. Invalid JSON Response

```javascript
// 原因：服务端返回的 JSON 格式错误
// 解决：检查服务端响应或使用 try-catch 解析
```

### 5. SSL/TLS Certificate Error

```bash
# 原因：证书过期或域名不匹配
# 解决：更新证书或检查请求 URL
```

---

*最后更新：2026-03-09*
