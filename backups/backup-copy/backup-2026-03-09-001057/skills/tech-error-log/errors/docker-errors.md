# Docker 错误记录

> 收录 Docker 容器化相关的错误与解决方案。

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

### 1. Cannot connect to the Docker daemon

```bash
# 原因：Docker 服务未启动或权限问题
# 解决：sudo systemctl start docker 或检查用户权限
```

### 2. Error: no matching manifest for linux/amd64

```bash
# 原因：镜像不支持当前架构
# 解决：docker pull --platform linux/amd64 或找替代镜像
```

### 3. Container exited with code 1

```bash
# 原因：容器内进程执行失败
# 解决：docker logs 查看日志，检查启动命令
```

### 4. Port already in use

```bash
# 原因：端口被占用
# 解决：换端口或停止占用进程
```

### 5. No space left on device

```bash
# 原因：磁盘空间不足
# 解决：docker system prune 清理空间
```

---

*最后更新：2026-03-09*
