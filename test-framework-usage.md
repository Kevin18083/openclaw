# 杰克测试框架 v3.0 - 使用指南

> 版本：v3.0 | 流程数：14 个 | 创建日期：2026-03-09

---

## 📋 概述

**杰克测试框架 v3.0** 是一个功能完整的测试流水线，包含 14 个独立流程，涵盖：
- ✅ 基础测试（环境、复查）
- ✅ 代码质量（TODO、硬编码密钥、调试语句）
- ✅ 安全检查（敏感文件、SQL 注入、eval 执行）
- ✅ 性能检查（嵌套循环、内存泄漏）
- ✅ 文档兼容性（README、LICENSE、跨平台）
- ✅ Git 规范（提交信息、工作区状态）
- ✅ 环境配置（.env、NODE_ENV）
- ✅ 依赖健康（package-lock、go.sum）
- ✅ 单元测试（自动检测运行）
- ✅ 构建检查（npm build、go build）

---

## 🚀 快速开始

### 方式 1：直接运行完整流水线

```bash
# 运行完整测试流水线（14 个流程）
bash test-framework-plus.sh

# 或者指定项目和目标
bash test-framework-plus.sh "my-project" "./src"
```

### 方式 2：在脚本中引入使用

```bash
#!/bin/bash
source ./test-framework-plus.sh

# 初始化
init

# 使用单个流程
run_test "Node.js 环境" "node --version"
verify_test "环境复查" "node --version && git --version"
code_quality_check "./src"
security_check "./src"

# 生成报告
generate_report
```

### 方式 3：运行部分流程（快速模式）

```bash
# 只运行基础 5 个流程，跳过高级检查
source ./test-framework-plus.sh
init
full_pipeline "my-project" "./src" "true"  # 第三个参数为 true 表示跳过高级检查
```

---

## 📦 14 个流程详解

### 流程 1：初步测试（run_test）
**用途**：运行基础测试，支持最多 5 轮重试

```bash
run_test "测试名称" "测试命令"

# 示例
run_test "Node.js 环境" "node --version"
run_test "单元测试" "npm test"
run_test "Git 检查" "git --version"
```

**特点**：
- 默认 5 轮重试，可配置 `MAX_RETRIES`
- 失败自动记录到错误记忆库
- 首次通过记录到成功案例记忆库

---

### 流程 2：复查验证（verify_test）
**用途**：成功后复查，要求连续 3 次通过

```bash
verify_test "测试名称" "测试命令"

# 示例
verify_test "构建复查" "npm run build"
verify_test "测试复查" "npm test"
```

**特点**：
- 默认 3 轮复查，可配置 `VERIFY_RETRIES`
- 任何一次失败立即返回错误
- 罗总要求：成功后必须复查！

---

### 流程 3：代码质量检查（code_quality_check）
**用途**：检查代码规范和质量

```bash
code_quality_check "./src"
```

**检查项**：
- TODO/FIXME/HACK 标记
- 硬编码密码/密钥
- console.log/debug 调试语句
- 大文件（>1000 行）

**自动排除**：node_modules、.git、dist、build 等目录

---

### 流程 4：安全检查（security_check）
**用途**：检测安全漏洞

```bash
security_check "./src"
```

**检查项**：
- 敏感文件暴露（.env、*.pem、*.key）
- SQL 注入风险
- eval/exec 执行风险
- 路径遍历风险

---

### 流程 5：性能检查（performance_check）
**用途**：检测性能问题

```bash
performance_check "./src"
```

**检查项**：
- 嵌套循环（可能需要优化）
- 依赖包大小（node_modules >500MB 告警）
- 内存泄漏风险（全局变量）

---

### 流程 6：文档检查（documentation_check）
**用途**：检查文档完整性

```bash
documentation_check "./src"
```

**检查项**：
- README.md 存在
- CHANGELOG.md 存在
- LICENSE 存在
- 函数注释

---

### 流程 7：兼容性检查（compatibility_check）
**用途**：检查跨平台兼容性

```bash
compatibility_check "./src"
```

**检查项**：
- Node.js 版本要求
- Python 版本要求
- 跨平台路径（Windows 反斜杠）

---

### 流程 8：Git 提交规范检查（git_commit_check）
**用途**：检查 Git 提交规范

```bash
git_commit_check "./src"
```

**检查项**：
- 最近提交信息格式（conventional commits）
- 未提交的文件
- 工作区状态

---

### 流程 9：环境变量检查（env_check）
**用途**：检查环境配置

```bash
env_check "./src"
```

**检查项**：
- .env 文件存在
- .env.example 模板
- NODE_ENV 设置
- 敏感信息检测

---

### 流程 10：依赖健康检查（dependency_check）
**用途**：检查依赖管理

```bash
dependency_check "./src"
```

**检查项**：
- package-lock.json 存在
- node_modules 完整性
- go.sum 存在
- requirements.txt 检查

---

### 流程 11：单元测试运行（run_unit_tests）
**用途**：自动运行单元测试

```bash
run_unit_tests "./src"
run_unit_tests "./src" "npm test"  # 指定测试命令
```

**自动检测**：
- Node.js: npm test / npx jest / npx vitest
- Go: go test ./...
- Python: pytest

---

### 流程 12：构建检查（build_check）
**用途**：验证项目能否成功构建

```bash
build_check "./src"
```

**自动检测**：
- Node.js: npm run build
- Go: go build ./...
- Rust: cargo build
- Java: mvn compile

---

### 流程 13：端口/服务检查（port_check）
**用途**：检测端口是否监听

```bash
port_check "3000 8080 443"
```

**检测方式**：
- netstat（Windows/Linux）
- /proc/net/tcp（Linux）
- curl HTTP 检测

---

### 流程 14：完整测试流水线（full_pipeline）
**用途**：一键运行所有流程

```bash
# 运行完整流程
full_pipeline "项目名称" "./目标路径"

# 跳过高级检查（快速模式）
full_pipeline "项目名称" "./目标路径" "true"
```

**流水线阶段**：
```
阶段 1/10: 初步测试
阶段 2/10: 复查验证
阶段 3/10: 代码质量检查
阶段 4/10: 安全检查
阶段 5/10: 性能检查
阶段 6/10: 文档和兼容性检查
阶段 7/10: Git 提交规范检查
阶段 8/10: 环境变量检查
阶段 9/10: 依赖健康检查
阶段 10/10: 单元测试和构建检查
```

---

## 🎯 实际使用示例

### 示例 1：部署前完整检查

```bash
#!/bin/bash
# deploy-check.sh

source ./test-framework-plus.sh

main() {
    init

    # 运行完整流水线
    full_pipeline "生产部署" "." "false"

    if [ $? -eq 0 ]; then
        echo "可以部署！"
        # ./deploy.sh
    else
        echo "禁止部署！"
        exit 1
    fi
}

main "$@"
```

### 示例 2：仅运行特定检查

```bash
#!/bin/bash
# quick-check.sh

source ./test-framework-plus.sh

init

# 只运行基础测试和安全检查
run_test "环境检查" "node --version"
run_test "Git 检查" "git --version"
security_check "./src"
code_quality_check "./src"

generate_report
```

### 示例 3：CI/CD 集成

```yaml
# .github/workflows/test.yml
name: Test Framework

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Test Framework
        run: |
          bash test-framework-plus.sh
```

---

## ⚙️ 配置选项

```bash
# 在脚本开头配置
export MAX_RETRIES=5           # 初步测试轮数（默认 5）
export VERIFY_RETRIES=3        # 复查验证轮数（默认 3）
export LOG_DIR="./test-logs"   # 日志目录

# 然后引入框架
source ./test-framework-plus.sh
```

---

## 📊 输出示例

```
╔════════════════════════════════════════╗
║   杰克测试框架 v3.0 - 完整测试流水线   ║
╚════════════════════════════════════════╝
项目：my-project
目标：./src
版本：增强版 (14 个流程)

════════════════════════════════════════
  阶段 1/10: 初步测试
════════════════════════════════════════
[INFO] 测试：环境检查
[INFO] 命令：node --version
[PASS] 环境检查 - 通过 (第 1 轮)

...

========================================
  测试报告
========================================
  总测试数：15
  通过：15
  失败：0
  安全问题：0
  性能问题：0
  通过率：100%

  结束时间：2026-03-09 10:30:00
========================================
[SUCCESS]  所有检查通过！可以实装！
```

---

## 🔗 相关文件

| 文件 | 用途 |
|------|------|
| `test-framework-plus.sh` | 测试框架 v3.0（14 个流程） |
| `test-framework.sh` | 测试框架 v1.0（基础版） |
| `memory/error-memory.md` | 错误记忆库 |
| `memory/success-memory.md` | 成功案例记忆库 |
| `DEPLOYMENT-CHECKLIST.md` | 实装前检查清单 |

---

## 📖 版本历史

| 版本 | 日期 | 流程数 | 变更 |
|------|------|--------|------|
| v1.0 | 2026-03-09 | 3 | 初始版本（run_test、verify_test、final_check） |
| v2.0 | 2026-03-09 | 9 | 新增代码质量、安全、性能、文档、兼容性检查 |
| v3.0 | 2026-03-09 | 14 | 新增 Git、环境、依赖、单元测试、构建、端口检查 |

---

*杰克测试框架 - 测试通过再实装，不测试不实装！*
