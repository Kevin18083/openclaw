---
name: tech-error-log
description: >
  技术错误日志与解决方案库 — 杰克专用的编程错误百科全书。
  收录范围：代码错误、框架陷阱、依赖问题、环境配置、API 使用等。
  每次遇到新错误，解决后必须记录到这里。
  每次写代码前，先查这个日志，避免踩重复的坑。
  这是给 Claude 自己用的技术参考，不是 OpenClaw 技能。
---

# 技术错误日志 (Tech Error Log)

> **原则**：踩过的坑，绝不踩第二次！
>
> **目标**：让错误日志变成我的"编程百科全书"！

---

## 📖 使用说明

**每次遇到错误时**：

1. **解决前**：记录错误现象、环境信息
2. **解决后**：记录根因、解决方案、预防方法
3. **分类归档**：放到对应的技术分类下

**每次写代码前**：

1. 先查这个日志，看看有没有相关的坑
2. 如果有，提前避开
3. 如果没有，小心探索

---

## 📁 错误日志结构

每个错误记录包含以下字段：

```markdown
### [错误标题] - [日期]

**分类**: [语言/框架/工具]

**错误信息**:
```
[粘贴完整的错误信息]
```

**场景**: [在做什么时遇到的]

**原因**: [根本原因，不是表面]

**解决方案**:
```bash
# 具体的解决命令或代码
```

**预防**: [以后怎么避免]

**关键词**: [tag1, tag2, tag3]  ← 方便搜索
```

---

## 📚 分类索引

### 语言相关

| 语言 | 错误数量 | 链接 |
|------|----------|------|
| JavaScript/Node.js | 0 | [javascript-errors.md](errors/javascript-errors.md) |
| TypeScript | 0 | [typescript-errors.md](errors/typescript-errors.md) |
| Python | 0 | [python-errors.md](errors/python-errors.md) |
| Go | 0 | [go-errors.md](errors/go-errors.md) |
| Rust | 0 | [rust-errors.md](errors/rust-errors.md) |

### 框架相关

| 框架 | 错误数量 | 链接 |
|------|----------|------|
| React/Next.js | 0 | [react-errors.md](errors/react-errors.md) |
| Vue/Nuxt | 0 | [vue-errors.md](errors/vue-errors.md) |
| Express | 0 | [express-errors.md](errors/express-errors.md) |
| Django/Flask | 0 | [django-errors.md](errors/django-errors.md) |
| Spring Boot | 0 | [spring-errors.md](errors/spring-errors.md) |

### 数据库相关

| 数据库 | 错误数量 | 链接 |
|------|----------|------|
| MySQL/PostgreSQL | 0 | [sql-errors.md](errors/sql-errors.md) |
| MongoDB | 0 | [mongodb-errors.md](errors/mongodb-errors.md) |
| Redis | 0 | [redis-errors.md](errors/redis-errors.md) |
| SQLite | 0 | [sqlite-errors.md](errors/sqlite-errors.md) |

### 工具/环境相关

| 工具 | 错误数量 | 链接 |
|------|----------|------|
| Git | 0 | [git-errors.md](errors/git-errors.md) |
| Docker | 0 | [docker-errors.md](errors/docker-errors.md) |
| NPM/Yarn/Pnpm | 0 | [npm-errors.md](errors/npm-errors.md) |
| Webpack/Vite | 0 | [bundler-errors.md](errors/bundler-errors.md) |
| Linux/Mac/Windows | 0 | [os-errors.md](errors/os-errors.md) |

### 云服务/API 相关

| 服务 | 错误数量 | 链接 |
|------|----------|------|
| AWS | 0 | [aws-errors.md](errors/aws-errors.md) |
| Azure | 0 | [azure-errors.md](errors/azure-errors.md) |
| Google Cloud | 0 | [gcp-errors.md](errors/gcp-errors.md) |
| 第三方 API | 0 | [api-errors.md](errors/api-errors.md) |

---

## 🔍 快速搜索

**按错误代码搜索**：
```bash
grep -r "EACCES" errors/
grep -r "ENOENT" errors/
grep -r "TypeError" errors/
grep -r "404" errors/
grep -r "500" errors/
```

**按关键词搜索**：
```bash
grep -r "权限" errors/
grep -r "超时" errors/
grep -r "内存" errors/
grep -r "连接" errors/
```

---

## 📝 记录模板

### 模板 1：单个错误记录

```markdown
### [简短标题] - YYYY-MM-DD

**分类**: JavaScript/Node.js

**错误信息**:
```
[完整错误堆栈]
```

**场景**: [描述在做什么]

**原因**: [根本原因]

**解决方案**:
```javascript
// 解决代码
```

**验证**: [如何确认解决了]

**预防**: [以后怎么避免]

**相关**: [关联的错误或文档]

**关键词**: [tag1, tag2]
```

---

### 模板 2：一类错误汇总

```markdown
# [分类] 错误汇总

## 错误列表

| 日期 | 错误 | 原因 | 解决时间 |
|------|------|------|----------|
| YYYY-MM-DD | [错误标题](#xxx) | 一句话 | 5 分钟 |

---

## 详细记录

### [错误标题] - YYYY-MM-DD
...
```

---

## 💡 使用示例

### 示例：NPM 权限错误

```markdown
### NPM 权限错误 (EACCES) - 2026-03-09

**分类**: NPM/Yarn/Pnpm

**错误信息**:
```
npm ERR! Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/xxx'
```

**场景**: 全局安装 npm 包时

**原因**:
- npm 默认安装到系统目录，需要 sudo 权限
- 当前用户没有写入权限

**解决方案**:

方法 1：修改 npm 默认目录（推荐）
```bash
# 创建用户专属的 npm 目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

方法 2：使用 nvm（推荐）
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
# 安装 node
nvm install node
```

**预防**:
- 永远不要用 sudo npm install -g
- 使用 nvm 管理 node 版本
- 配置 npm 用户目录

**关键词**: [npm, EACCES, 权限，全局安装]
```

---

## 🎯 维护规则

### 必须记录的情况

- [ ] 花了超过 10 分钟才解决的错误
- [ ] 网上找不到答案的错误
- [ ] 反直觉的陷阱（容易再犯）
- [ ] 框架/库的 bug 或限制
- [ ] 环境配置相关的坑

### 可以不记录的情况

- [ ] 拼写错误（太基础）
- [ ] 一眼就能看出的问题
- [ ] 已经有很多文档的常见错误

### 记录时机

```
解决错误后 → 立刻记录（趁记忆还新鲜）
          ↓
     分类归档到对应文件
          ↓
     更新分类索引的错误数量
          ↓
     添加关键词方便搜索
```

---

## 📊 统计与回顾

### 每周回顾（建议）

```
□ 本周新增了多少条错误记录？
□ 哪类错误最多？（找到自己的薄弱点）
□ 有没有重复犯同样的错误？
□ 哪些记录帮助最大？
```

### 每月回顾（建议）

```
□ 这个月踩了多少坑？
□ 哪个技术栈的坑最多？
□ 有没有系统性改进？（比如加测试、改流程）
□ 需要补充哪些知识盲区？
```

---

## 🔗 相关文件

| 文件 | 作用 |
|------|------|
| [SKILL.md](../code-quality-workflow/SKILL.md) | 代码质量工作流主文档 |
| [bug-lessons.md](../code-quality-workflow/bug-lessons.md) | Bug 教训记录（具体项目） |
| 本文件 | 技术错误日志（通用技术） |

**区别**：
- `bug-lessons.md` → 记录具体项目的业务 bug
- `tech-error-log/` → 记录通用技术错误（语言、框架、工具）

---

## 🚀 开始使用

**目录结构**：
```
skills/tech-error-log/
├── SKILL.md              ← 本文件（使用说明 + 索引）
└── errors/               ← 错误记录目录
    ├── javascript-errors.md
    ├── typescript-errors.md
    ├── react-errors.md
    ├── docker-errors.md
    └── ... (按需创建)
```

**第一步**：创建 errors 目录
```bash
mkdir -p skills/tech-error-log/errors
```

**第二步**：遇到第一个错误，解决后记录
```bash
# 在对应的分类文件里添加记录
# 例如：errors/npm-errors.md
```

**第三步**：每次写代码前，先查一下
```bash
# 搜索有没有相关的错误记录
grep -r "关键词" skills/tech-error-log/errors/
```

---

*版本：1.0 | 创建日期：2026-03-09 | 使用者：杰克（Claude）*

---

## 📜 杰克承诺

> 1. **遇到错误不烦躁** — 每个错误都是学习机会
> 2. **解决后立刻记录** — 趁记忆还新鲜
> 3. **写代码前先查** — 不踩重复的坑
> 4. **定期回顾整理** — 把经验变成知识
> 5. **持续积累** — 让错误日志变成我的"编程宝典"

**目标**：一年后，这里会有 100+ 条错误记录，每条都帮我节省时间！

---

*积累的力量，时间知道！💪*
