# Coze Studio 项目学习

> 来源：用户电脑记事本文件 | 日期：2026-03-09

---

## 📋 项目概述

**Coze Studio** - 集成一体的人工智能代理开发平台

| 项目 | 配置 |
|------|------|
| **前端** | React 18 + TypeScript |
| **后端** | Go + Hertz |
| **Monorepo** | Rush.js (135+ 包) |
| **构建工具** | Rsbuild (Rspack) |
| **UI 框架** | Semi Design + Tailwind CSS |
| **状态管理** | Zustand |
| **Node 版本** | >=21 |

---

## 🏗️ 前端架构

### 包层级结构（4 级依赖）

```
Level 1: arch/          - 核心基础设施
         - @coze-arch/ts-config
         - @coze-arch/eslint-config
         - @coze-arch/stylelint-config
         - @coze-arch/eslint-plugin

Level 2: common/        - 共享组件与工具
         - 基础组件、工具函数

Level 3: 特征域包       - 业务功能
         - agent-ide/
         - workflow/studio/
         - 各功能模块

Level 4: apps/coze-studio - 主应用
```

### 技术栈

| 类别 | 技术 |
|------|------|
| 构建 | Rsbuild (基于 Rspack) |
| 语言 | TypeScript |
| 框架 | React 18 |
| UI | Semi Design |
| 样式 | Tailwind CSS |
| 状态 | Zustand |
| Hooks | ahooks |
| 请求 | immer |

---

## 🏗️ 后端架构（Go）

### DDD 分层结构

```
backend/
├── domain/         # 业务逻辑与实体
├── application/    # 应用服务与用例
├── api/           # HTTP 处理程序与路由
├── infra/         # 基础设施实施
└── crossdomain/   # 跨领域关注点
```

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Hertz HTTP |
| 架构 | DDD + 微服务 |
| 消息 | NSQ |
| API | OpenAPI 规范 |

---

## 🗄️ 基础设施（Docker）

| 服务 | 版本 | 用途 |
|------|------|------|
| MySQL | 8.4.5 | 主数据库 |
| Redis | 8.0 | 缓存 |
| Elasticsearch | 8.18.0 | 搜索 (SmartCN) |
| Milvus | v2.5.10 | 向量数据库 |
| MinIO | - | 对象存储 |
| NSQ | - | 消息队列 |
| etcd | 3.5 | 配置中心 |

---

## 📦 Rush Monorepo 配置

### rush.json 核心配置

```json
{
  "rushVersion": "5.147.1",
  "pnpmVersion": "8.15.8",
  "nodeSupportedVersionRange": ">=21",
  "projectFolderMinDepth": 3,
  "projectFolderMaxDepth": 6
}
```

### 常用命令

```bash
# 安装依赖
rush update

# 构建所有包
rush build

# 构建指定包
rush rebuild -o @coze-studio/app

# 运行测试
rush test

# 代码检查
rush lint

# 提交
rush commit
```

---

## 🔧 Makefile 命令

| 命令 | 说明 |
|------|------|
| `make debug` | 启动调试环境 |
| `make fe` | 构建前端 |
| `make server` | 构建运行后端 |
| `make middleware` | 启动中间件服务 |
| `make sync_db` | 同步数据库结构 |
| `make web` | 启动 Web 服务 (Docker) |
| `make clean` | 清理 Docker 数据 |

---

## 📖 开发工作流

### 前端开发

```bash
# 1. 克隆项目
git clone https://github.com/coze-dev/coze-studio.git
cd coze-studio

# 2. 安装依赖
rush update

# 3. 启动前端
cd frontend/apps/coze-studio
npm run dev
```

### 后端开发

```bash
# 1. 启动中间件
make middleware

# 2. 启动后端
make server

# 3. 完整环境
make debug
```

### Docker 部署

```bash
# 配置环境变量
cd docker
cp .env.example .env

# 启动服务
docker compose up -d

# 访问 http://localhost:8888
```

---

## 🎯 测试策略

### 覆盖率要求

| 包级别 | 覆盖率 | 增量覆盖率 |
|--------|--------|-----------|
| Level 1 | 80% | 90% |
| Level 2 | 30% | 60% |
| Level 3-4 | 0% (灵活) | - |

### 测试框架

- **前端**：Vitest (单元/集成测试)
- **后端**：Go 内置测试框架
- **E2E**：独立子空间配置

---

## 🧠 架构模式

1. **适配器模式** - 层间松耦合（`-adapter` 后缀）
2. **基础/核心模式** - 共享功能（`-base` 后缀）
3. **接口隔离** - 明确的领域契约
4. **事件驱动** - NSQ 异步通信
5. **工作区引用** - 内部依赖 (`workspace:*`)

---

## 📝 代码规范

### Git 提交

```bash
rush commit           # 提交代码
rush lint-staged      # 预提交检查
```

### 包结构

每个包包含：
- `package.json`
- `tsconfig.json`
- `eslint.config.js`
- `README.md`

---

## 💡 学习收获

1. **Monorepo 规模**：135+ 包，4 级依赖，企业级复杂度
2. **构建工具**：Rsbuild/Rspack 新方案
3. **DDD 实践**：Go 后端的分层架构
4. **基础设施**：完整的微服务栈
5. **测试覆盖**：分级覆盖率要求

---

*版本：1.0 | 学习时间：2026-03-09*
