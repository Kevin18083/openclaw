# GitHub Actions CI/CD 配置学习

> 来源：用户桌面文件 | 日期：2026-03-09

---

## 📋 概述

**项目**：Coze Studio

**CI/CD 平台**：GitHub Actions

**配置位置**：`.github/workflows/`

---

## 🔧 工作流 1：License Check

**文件**：`.github/workflows/license-check.yml`

### 用途

自动检查代码文件的许可证头和依赖许可证

### 配置

```yaml
name: License Check
on:
  push:
    branches: ['main']
  pull_request:
  workflow_dispatch:
```

### Jobs

```yaml
license-check:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/setup-go@v5
      with: go-version: 1.23

    - run: go install github.com/apache/skywalking-eyes/cmd/license-eye@v0.4.0
    - uses: actions/checkout@v4

    - run: license-eye header check -c .github/.licenserc.yaml
    - run: license-eye dependency check -c .github/.licenserc.yaml
```

### 工具

- **license-eye** - Apache SkyWalking 的许可证检查工具
- **检查项**：
  - 源代码文件是否有许可证头
  - 第三方依赖的许可证兼容性

---

## 🔧 工作流 2：Semantic Pull Request

**文件**：`.github/workflows/semantic-pr.yml`

### 用途

检查 PR 标题是否符合约定式提交规范

### 配置

```yaml
name: Semantic Pull Request
on:
  pull_request:
    types: [opened, reopened, edited]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}-${{ github.event.number }}
  cancel-in-progress: true
```

### 接受的类型 (types)

| 类型 | 用途 |
|------|------|
| `build` | 构建系统变更 |
| `ci` | CI 配置变更 |
| `docs` | 文档变更 |
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `perf` | 性能优化 |
| `refactor` | 重构 |
| `style` | 代码格式 |
| `test` | 测试 |
| `chore` | 其他杂项 |

### 接受的 scope

```
idl          - 接口定义语言
frontend     - 前端代码
backend      - 后端代码
infra        - 基础设施
app          - 应用层
singleagent  - 单代理
memory       - 记忆系统
search       - 搜索
workflow     - 工作流
prompt       - 提示词
knowledge    - 知识库
plugin       - 插件
middleware   - 中间件
model        - 模型
database     - 数据库
foundation   - 基础层
comment      - 注释
ci           - CI 配置
```

### PR 标题格式

```
[<type>][<scope>] <description>

示例：
[feat][workflow] add new agent orchestration flow
[fix][frontend] resolve memory leak in chat component
[refactor][backend] simplify domain service interface
```

---

## 📄 License 配置文件

**文件**：`.github/.licenserc.yaml`

### 配置

```yaml
header:
  license:
    spdx-id: Apache-2.0
    copyright-owner: coze-dev

  paths:
    - '**/*.go'
    - frontend/apps/**/*.{ts,tsx}
    - frontend/packages/**/*.{ts,tsx}

  paths-ignore:
    - 'dist'
    - 'licenses'
    - '**/*.md'
    - '**/testdata/**'
    - '**/go.mod'
    - '**/go.sum'
    - '**/*.gen.go'      # 生成代码
    - '**/kitex_gen/**'  # RPC 生成代码
    - '**/mock/**'       # Mock 文件
    - 'backend/api/**'   # API 层
```

### 说明

- **spdx-id**: Apache-2.0 许可证标准标识符
- **paths**: 需要检查的文件类型
- **paths-ignore**: 忽略的路径（生成的代码、测试数据等）

---

## 💡 学习收获

### 1. CI/CD 最佳实践

- **并发控制**：同 PR 的重复检查自动取消
- **触发条件**：push + PR + 手动触发
- **工具选择**：使用成熟工具（license-eye）

### 2. 约定式提交

- **类型明确**：10 种标准类型
- **Scope 分类**：按业务模块划分
- **自动化检查**：CI 自动验证

### 3. 许可证管理

- **自动生成**：CI 自动添加许可证头
- **忽略生成代码**：`.gen.go`、`mock` 等
- **依赖检查**：确保第三方库许可证兼容

### 4. GitHub Actions 语法

```yaml
# 并发控制
concurrency:
  group: workflow-ref-pr
  cancel-in-progress: true

# 条件判断
if: ${{ github.event_name == 'pull_request' }}

# 输出变量
${{ secrets.GITHUB_TOKEN }}
```

---

## 🔗 相关资源

| 工具 | 用途 |
|------|------|
| [license-eye](https://github.com/apache/skywalking-eyes) | 许可证检查 |
| [action-semantic-pull-request](https://github.com/amannn/action-semantic-pull-request) | PR 标题检查 |
| [Conventional Commits](https://www.conventionalcommits.org/) | 约定式提交规范 |

---

*版本：1.0 | 学习时间：2026-03-09*
