# Git 错误记录

> 收录 Git 版本控制相关的错误与解决方案。

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

### 1. error: failed to push some refs

```bash
# 原因：远程分支有本地没有的提交
# 解决：git pull --rebase 后再 push
```

### 2. fatal: refusing to merge unrelated histories

```bash
# 原因：两个不相关的 git 历史
# 解决：git merge --allow-unrelated-histories
```

### 3. error: Your local changes would be overwritten by merge

```bash
# 原因：本地有未提交的改动
# 解决：先 commit 或 stash 改动
```

### 4. fatal: branch already exists

```bash
# 原因：分支名已存在
# 解决：用 git checkout 切换或换个分支名
```

### 5. Please commit your changes or stash them before you switch branches

```bash
# 原因：有未提交改动
# 解决：git stash 保存后再切换
```

---

*最后更新：2026-03-09*
