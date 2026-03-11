# NPM / Yarn / Pnpm 错误记录

> 收录包管理器相关的错误与解决方案。

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

### 1. EACCES: permission denied

```bash
# 原因：权限不足（全局安装时）
# 解决：配置 npm 用户目录或使用 nvm
```

### 2. ENOENT: no such file or directory

```bash
# 原因：依赖包未下载或路径错误
# 解决：rm -rf node_modules && npm install
```

### 3. Peer dependency warning

```bash
# 原因：依赖版本不兼容
# 解决：检查 package.json 或安装指定版本
```

### 4. npm ERR! code ERESOLVE

```bash
# 原因：依赖冲突无法解决
# 解决：npm install --legacy-peer-deps 或手动解决冲突
```

### 5. ERR_PNPM_OUTDATED_LOCKFILE

```bash
# 原因：lock 文件与 package.json 不一致
# 解决：pnpm install --force 重新生成
```

---

*最后更新：2026-03-09*
