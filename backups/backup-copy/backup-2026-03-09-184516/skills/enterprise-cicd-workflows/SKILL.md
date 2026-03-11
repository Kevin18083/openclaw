# 企业级 CI/CD 工作流学习

> 来源：用户桌面文件 | 日期：2026-03-09

---

## 📋 概述

**项目**：Coze Studio

**CI/CD 平台**：GitHub Actions

**工作流文件**：`.github/workflows/`

---

## 🔧 工作流清单

| 工作流 | 文件 | 用途 |
|--------|------|------|
| 增量 CI | `ci.yml` | PR 增量构建/测试/Lint |
| 全量 CI | `ci@main.yml` | main 分支完整构建 |
| 后端测试 | `ci@backend.yml` | Go 后端单元测试 |
| License 检查 | `license-check.yml` | 许可证头检查 |
| Semantic PR | `semantic-pr.yml` | PR 标题语义检查 |
| Thrift 验证 | `idl.yaml` | IDL 语法验证 |
| PR 通用检查 | `pr-common-checks.yml` | PR 格式检查 |
| Claude 助手 | `claude-pr-assistant.yml` | @claude 自动回复 |

---

## 1️⃣ 文件体积检查脚本

**文件**：`check-file-size.sh`

### 用途

检查提交的文件体积是否超过 512KB 限制

### 核心配置

```bash
# 体积限制 (KB)
size_limit=$((512))

# 排除模式
EXCLUDE_PATTERNS=(
  '**/pnpm-lock.yaml'
  '**/lib/**'
  '**/__tests__/**'
  '**/*.test.*/**'
  '**/*.snap'
  '**/e2e/**'
  'common/changes/**'
)
```

### 检查逻辑

```bash
# 获取变更文件
files=$(git diff --name-only --diff-filter=AM "origin/$TARGET_BRANCH...")

# 检查每个文件
for file in $files; do
  file_size_kb=$((file_size / 1024))
  if [ "$file_size_kb" -gt "$size_limit" ]; then
    large_files_info+="- \`$file\` ($file_size_kb KB)\n"
  fi
done
```

### CI 模式输出

```bash
CONCLUSION="{
  \"name\": \"文件体积\",
  \"conclusion\": \"failed\",
  \"output\": {
    \"summary\": \"以下文件体积超过限制 (${size_limit}KB): $large_files_info\"
  }
}"
```

---

## 2️⃣ 增量 CI 工作流

**文件**：`ci.yml`

### 触发条件

```yaml
on:
  pull_request:
    branches: ['main']
    paths:
      - 'github/**'
      - 'idl/**'
      - 'frontend/**'
      - 'common/**'
      - 'rush.json'
  workflow_dispatch:
```

### Jobs 架构

```
setup → build → test → lint → ts-check → package-audit
         ↓        ↓       ↓       ↓
      (都依赖 setup 输出的缓存文件)
```

### 核心特性

**1. 变更文件检测**
```yaml
- uses: tj-actions/changed-files@v45
  id: changed-files

- name: Process changed files
  run: |
    # 过滤掉 common/changes 目录
    filtered_files=$(echo $all_files | sed 's/common\/changes/.*//')
    echo "[$(echo "$filtered_files" | sed 's/ /", "/g')]" > changed-files-cache.json
```

**2. Rush 增量构建**
```bash
# 安装依赖
rush install --to tag:core

# 增量构建
rush increment --action build -p changed-files-cache.json

# 增量测试
rush increment --action test:cov -p changed-files-cache.json

# 增量 Lint
rush increment --action lint -p changed-files-cache.json

# 增量 TS 检查
rush increment --action ts-check -p changed-files-cache.json
```

**3. 缓存策略**
```yaml
- uses: actions/cache@v4
  with:
    path: |
      common/temp/pnpm-local
      common/temp/pnpm-store
      common/temp/install-run
    key: ${{ runner.os }}-rush-store-${{ hashFiles('pnpm-lock.yaml') }}
```

---

## 3️⃣ 全量 CI 工作流

**文件**：`ci@main.yml`

### 触发条件

```yaml
on:
  push:
    branches: ['main', 'chore/setup-ci']
    paths:
      - 'github/**'
      - 'idl/**'
      - 'frontend/**'
      - 'common/**'
      - 'rush.json'
  workflow_dispatch:
```

### 完整流程

```bash
# 1. 安装依赖
rush install

# 2. 完整构建
rush build --verbose

# 3. 测试覆盖率
rush test:cov --verbose

# 4. 上传覆盖率报告
uses: codecov/codecov-action@v4

# 5. Lint 检查
rush lint --verbose
```

---

## 4️⃣ 后端测试 CI

**文件**：`ci@backend.yml`

### 配置

```yaml
env:
  DEFAULT_GO_VERSION: "1.24"

jobs:
  backend-unit-test:
    runs-on: ubuntu-latest
```

### MySQL 容器设置

```yaml
- uses: mirromutth/mysql-action@v1.1
  with:
    host port: 3306
    container port: 3306
    character set server: 'utf8mb4'
    collation server: 'utf8mb4_general_ci'
    mysql version: '8.4.5'
    mysql database: 'opencoze'
    mysql root password: 'root'
```

### 等待 MySQL 就绪

```bash
echo "Waiting for MySQL to be ready..."
for i in {1..60}; do
  if cat /proc/net/tcp | grep 0CEA; then
    echo "MySQL port 3306 is listening!"
    break
  fi
  echo "Waiting for MySQL port... ($i/60)"
  sleep 1
done
```

### ⚠️ 发现问题

**问题**：`/proc/net/tcp` 是 16 进制检测，可能有误判；没检查 MySQL 是否真能连接

**修正方案**：
```bash
for i in {1..60}; do
  if mysql -h 127.0.0.1 -P 3306 -u root -proot -e "SELECT 1" &>/dev/null; then
    echo "MySQL is ready!"
    break
  fi
  echo "Waiting for MySQL... ($i/60)"
  sleep 1
done
```

### Go 测试命令

```bash
# 初始化 go work
if [[ ! -f "go.work" ]]; then go work init; fi

# 找到所有 go.mod 目录
modules=$(find . -name "go.mod" -exec dirname {} \;)

# 添加到 workspace
for module in $modules; do
  go work use $module
  list=$module"/... "$list
  coverpkg=$module"/...,"$coverpkg
done

# 运行测试（带覆盖率）
go test -race -v -coverprofile=coverage.out \
  -gcflags="all=-l -N" -coverpkg=$coverpkg $list

# Benchmark
go test -race -v -bench=. -benchmem -run=none $list
```

### ⚠️ 发现问题

**问题**：`coverpkg` 累加后末尾可能多一个逗号

**修正方案**：
```bash
# 去掉末尾逗号
coverpkg=${coverpkg%,}
go test -coverpkg="$coverpkg" ...
```

---

## 6️⃣ PR 通用检查

**文件**：`idl.yaml`

### 工具安装

```bash
go install github.com/cloudwego/thriftgo@v0.4.1
go install github.com/cloudwego/kitex/tool/cmd/kitex@v0.13.1
go install github.com/cloudwego/thrift-gen-validator@v0.2.6
```

### 验证逻辑

```bash
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"
go mod init dummy

# 遍历所有 thrift 文件
find "$GITHUB_WORKSPACE/idl" -name '*.thrift' -print0 | while read -d '' file; do
  if ! kitex -streamx -thrift ignore_initialisms=false -module=dummy "$file"; then
    echo "IDL gen code error in file: $file"
    ERROR_FOUND=1  # ⚠️ BUG: 子 shell 中变量修改不生效
  fi
done

rm -rf "$TEMP_DIR"
```

### ⚠️ 发现问题

**Bug**: `while` 循环在子 shell 中运行，`ERROR_FOUND` 变量修改不影响父 shell！

**修正方案**：
```bash
# 方法 1：用临时文件记录错误
ERROR_FILE=$(mktemp)
find "$GITHUB_WORKSPACE/idl" -name '*.thrift' -print0 | while read -d '' file; do
  if ! kitex ... "$file"; then
    echo "error" > "$ERROR_FILE"
  fi
done
if [ -s "$ERROR_FILE" ]; then exit 1; fi

# 方法 2：直接退出
find "$GITHUB_WORKSPACE/idl" -name '*.thrift' -print0 | while read -d '' file; do
  if ! kitex ... "$file"; then
    echo "IDL gen code error in file: $file"
    rm -rf "$TEMP_DIR"
    exit 1  # 直接退出整个脚本
  fi
done
```

---

## 6️⃣ PR 通用检查

**文件**：`pr-common-checks.yml`

### PR 标题检查

```bash
node common/scripts/install-run-rush.js update-autoinstaller --name rush-commitlint

pushd common/autoinstallers/rush-commitlint
echo "$PR_TITLE" | npx commitlint --config commitlint.config.js
popd
```

---

## 7️⃣ Claude PR Assistant

**文件**：`claude-pr-assistant.yml`

### 触发条件

```yaml
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

# 当评论包含 @claude 时触发
if: |
  contains(github.event.comment.body, '@claude') ||
  contains(github.event.review.body, '@claude')
```

### 配置

```yaml
- uses: anthropics/claude-code-action@beta
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    timeout_minutes: '60'
    # 可选：限制网络访问
    experimental_allowed_domains: |
      .anthropic.com
      .github.com
      api.github.com
```

---

## 💡 学习收获

### 1. Rush 增量构建

```bash
# 核心命令
rush increment --action <build|test:cov|lint|ts-check> -p <changed-files-cache.json>
```

**优势**：
- 只构建变更的包
- 缓存依赖安装
- CI 时间大幅缩短

### 2. Go 多模块测试

```bash
# 自动发现所有 go.mod
modules=$(find . -name "go.mod" -exec dirname {} \;)

# 初始化 workspace
go work init
for module in $modules; do go work use $module; done

# 统一测试
go test -coverprofile=coverage.out $modules/...
```

### 3. CI 缓存策略

```yaml
# Rush 项目标准缓存
key: ${{ runner.os }}-rush-store-${{ hashFiles('pnpm-lock.yaml') }}
restore-keys: |
  ${{ runner.os }}-rush-store-main
  ${{ runner.os }}-rush-store
```

### 4. 文件体积限制

- **限制**：512KB
- **排除**：测试文件、快照、锁文件
- **输出**：CI 检查结论格式

### 5. MySQL CI 配置

- 使用 Docker 容器
- 端口检测确保就绪
- 测试完成后清理

---

## 🔗 相关资源

| 工具 | 用途 |
|------|------|
| Rush.js | Monorepo 管理 |
| pnpm | 包管理器 |
| GitHub Actions | CI/CD 平台 |
| Codecov | 测试覆盖率报告 |
| kitex | Thrift 代码生成 |
| Claude Code | AI 编程助手 |

---

*版本：1.0 | 学习时间：2026-03-09*
