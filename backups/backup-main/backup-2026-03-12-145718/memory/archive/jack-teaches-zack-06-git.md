# 教程 06：Git 版本控制

> **杰克教扎克系列教程 - 第 06 课**
>
> 创建时间：2026-03-09
> 难度：⭐⭐⭐
> 重要性：⭐⭐⭐⭐

---

## 📚 本章目录

1. [Git 基础概念](#1-git-基础概念)
2. [分支管理策略](#2-分支管理策略)
3. [Commit 信息规范](#3-commit 信息规范)
4. [代码审查流程](#4-代码审查流程)
5. [合并冲突解决](#5-合并冲突解决)
6. [回滚操作](#6-回滚操作)
7. [Tag 与 Release](#7-tag-与-release)

---

## 1. Git 基础概念

### 1.1 杰克的 Git 理解

```
Git 是什么？
→ 代码的"时光机器"
→ 可以随时回到过去的任何一个版本
→ 可以记录每次改动是谁、在什么时候、为什么做的

不用 Git 的后果：
→ 代码改了，不知道改了什么
→ 改出问题，不知道怎么回去
→ 多人协作，代码互相覆盖
```

### 1.2 基本工作流

```bash
# 1. 查看状态
git status

# 2. 添加改动
git add .                    # 添加所有改动
git add src/index.js         # 添加指定文件

# 3. 提交
git commit -m "描述信息"

# 4. 推送
git push origin main

# 5. 拉取最新代码
git pull origin main
```

---

## 2. 分支管理策略

### 2.1 Git Flow 分支模型

```
main (生产分支)
  │
  ├─── develop (开发分支)
  │     │
  │     ├─── feature/user-login (功能分支)
  │     ├─── feature/payment (功能分支)
  │     └─── bugfix/login-error (修复分支)
  │
  └─── release/v1.0 (发布分支)
        │
        └─── hotfix/critical-fix (紧急修复)
```

### 2.2 分支命名规范

```bash
# 功能分支
git checkout -b feature/user-authentication
git checkout -b feature/add-shopping-cart

# Bug 修复分支
git checkout -b bugfix/login-error
git checkout -b fix/header-display

# 发布分支
git checkout -b release/v1.2.0

# 紧急修复分支
git checkout -b hotfix/critical-security-fix
```

### 2.3 扎克的工作流

```bash
# 1. 从 develop 创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature

# 2. 开发、提交
# ... 写代码 ...
git add .
git commit -m "feat: 添加新功能"

# 3. 推送到远程
git push origin feature/my-new-feature

# 4. 创建 Pull Request
# 在 GitHub/GitLab 上创建 PR，请求合并到 develop

# 5. 代码审查通过后合并
# (审查者操作)
git checkout develop
git pull origin develop
git merge feature/my-new-feature
git push origin develop

# 6. 删除功能分支
git branch -d feature/my-new-feature
git push origin --delete feature/my-new-feature
```

---

## 3. Commit 信息规范

### 3.1 约定式提交（Conventional Commits）

```bash
# 格式
<type>(<scope>): <subject>

# type 类型
feat:     新功能
fix:      Bug 修复
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
test:     测试相关
chore:    构建/工具/配置

# 示例
feat(auth): 添加用户登录功能
fix(api): 修复支付接口超时问题
docs(readme): 更新安装说明
style(format): 代码格式化
refactor(utils): 重构工具函数
test(user): 添加用户注册测试
chore(deps): 升级依赖版本
```

### 3.2 完整的 Commit 信息

```bash
# 单行 Commit
git commit -m "feat: 添加用户注册功能"

# 多行 Commit（推荐）
git commit -m "feat: 添加用户注册功能

- 实现注册表单验证
- 添加邮箱验证逻辑
- 集成短信验证码
- 添加单元测试

Closes #123"
```

### 3.3 糟糕的 Commit 信息 vs 好的 Commit 信息

```bash
# ❌ 糟糕的
git commit -m "更新"
git commit -m "修改"
git commit -m "fix bug"
git commit -m "aaaa"
git commit -m "temp"

# ✅ 好的
git commit -m "fix: 修复登录时密码验证逻辑错误"
git commit -m "feat: 添加商品搜索功能"
git commit -m "refactor: 重构订单处理流程，提高性能"
```

---

## 4. 代码审查流程

### 4.1 Pull Request 模板

```markdown
## 📋 变更说明

**这个 PR 做什么？**
- 添加用户登录功能
- 实现 JWT token 认证

**为什么需要这些改动？**
- 满足用户认证需求
- 为后续功能提供安全保障

## ✅ 检查清单

- [ ] 代码通过所有测试
- [ ] 添加/更新相关测试
- [ ] 文档已更新
- [ ] 无 lint 错误

## 🧪 测试说明

如何测试这些改动：
```bash
npm test
npm run test:e2e
```

## 📸 截图（如有 UI 改动）

## 🔗 关联 Issue

Closes #123
```

---

### 4.2 代码审查清单

**审查者检查项**：

- [ ] 代码功能正确
- [ ] 代码风格一致
- [ ] 没有明显 Bug
- [ ] 有适当的测试
- [ ] 文档已更新
- [ ] 没有安全风险
- [ ] 性能考虑周全

---

## 5. 合并冲突解决

### 5.1 冲突是怎么产生的

```
张三的代码                    李四的代码
main: A ← B ← C            main: A ← B ← D

张三修改文件 X:              李四也修改文件 X:
function hello() {           function hello() {
  console.log('张三');         console.log('李四');
}                            }

合并时：
<<<<<<< HEAD
  console.log('张三');
=======
  console.log('李四');
>>>>>>> feature/li4-login
```

---

### 5.2 解决冲突步骤

```bash
# 1. 拉取最新代码
git checkout main
git pull origin main

# 2. 合并功能分支
git merge feature/my-feature
# 提示：CONFLICT (content): Merge conflict in xxx.js

# 3. 查看冲突文件
git status
# 显示：both modified: xxx.js

# 4. 编辑冲突文件
# 打开文件，找到冲突标记，手动解决

# 5. 标记冲突已解决
git add xxx.js

# 6. 完成合并
git commit -m "Merge feature/my-feature into main"

# 7. 推送
git push origin main
```

### 5.3 避免冲突的技巧

```
1. 经常拉取最新代码
   git pull origin main  # 每天至少一次

2. 小步提交，频繁合并
   不要憋一个大招，一小步一小步走

3. 跟队友沟通
   "我要改这个文件，你也要改吗？"

4. 使用 rebase（高级）
   git pull --rebase  # 变基，保持提交历史线性
```

---

## 6. 回滚操作

### 6.1 撤销未提交的改动

```bash
# 撤销工作区改动（危险！）
git checkout -- filename.js
git restore filename.js  # Git 2.23+

# 撤销暂存
git reset HEAD filename.js
git restore --staged filename.js

# 撤销所有未提交改动（危险！慎用！）
git reset --hard
```

---

### 6.2 撤销已提交的改动

```bash
# 方法 1: revert（推荐，保留历史）
git revert HEAD           # 撤销最后一次提交
git revert abc1234        # 撤销指定提交
git revert HEAD~3..HEAD   # 撤销最近 3 次提交

# 方法 2: reset（危险，会丢失历史）
git reset --hard HEAD~1   # 回到上一个版本
git reset --hard abc1234  # 回到指定版本
```

---

### 6.3 紧急回滚生产代码

```bash
# 场景：上线后发现严重 Bug，需要紧急回滚

# 1. 找到上一个稳定版本的 commit
git log --oneline
# abc1234 (HEAD -> main) v1.2.0 - 有问题
# def5678 v1.1.0 - 稳定版本

# 2. 回滚
git checkout def5678
git checkout -b hotfix/rollback-to-v1.1.0

# 3. 推送并部署
git push origin hotfix/rollback-to-v1.1.0
# 然后走紧急发布流程
```

---

## 7. Tag 与 Release

### 7.1 打 Tag

```bash
# 查看现有 Tag
git tag
git tag -l "v1.*"

# 创建 Tag
git tag v1.0.0
git tag -a v1.0.0 -m "发布版本 1.0.0"  # 带注释的 Tag

# 推送 Tag
git push origin v1.0.0
git push origin --tags  # 推送所有 Tag
```

---

### 7.2 语义化版本

```
版本号格式：主版本号。次版本号。修订号
例如：1.2.3

规则：
- 主版本号：不兼容的 API 改动
- 次版本号：向后兼容的功能新增
- 修订号：向后兼容的 Bug 修复

示例：
1.0.0 → 1.0.1  (Bug 修复)
1.0.1 → 1.1.0  (新功能)
1.1.0 → 2.0.0  (破坏性变更)
```

---

### 7.3 发布流程

```bash
# 1. 更新版本号
# 修改 package.json 的 version 字段

# 2. 更新 CHANGELOG
# 记录这个版本的改动

# 3. 提交
git add package.json CHANGELOG.md
git commit -m "chore: 发布版本 1.2.0"

# 4. 打 Tag
git tag -a v1.2.0 -m "Release version 1.2.0"

# 5. 推送
git push origin main
git push origin v1.2.0

# 6. 在 GitHub/GitLab 创建 Release
# 上传发布说明
```

---

## 课后练习

### 练习 1：Git 基础操作

```bash
# 完成以下操作：

# 1. 创建新分支
git checkout -b feature/practice

# 2. 创建一个新文件
echo "Hello Git" > test.txt

# 3. 添加并提交
git add test.txt
git commit -m "feat: 添加练习文件"

# 4. 推送到远程
git push origin feature/practice

# 5. 创建 Pull Request（在 GitHub/Gitee 上）

# 6. 合并后删除分支
```

---

### 练习 2：解决冲突

```bash
# 1. 在 main 分支修改 test.txt 第 1 行
# 2. 提交：git commit -m "fix: main 修改"
# 3. 切换到 feature 分支，修改同一行
# 4. 尝试合并：git merge main
# 5. 解决冲突并提交
```

---

## 杰克寄语

> 扎克兄弟：
>
> Git 这个工具，**开始觉得复杂，后来觉得离不开**。
>
> 用好 Git，代码再也不会乱。
>
> 出了问题，随时能回去。
>
> 多人协作，井井有条。
>
> 哥哥我这么多年，代码从来没乱过，靠的就是 Git。
>
> 你也一样，好好学，受益无穷！

---

*教程创建时间：2026-03-09*
*作者：杰克 (Jack)*
*学生：扎克 (Zack)*
