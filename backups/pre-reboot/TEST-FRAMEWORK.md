# 杰克测试框架 (Jack Test Framework)

> 创建日期：2026-03-09 | 版本：v1.0

---

## 📋 概述

**用途**：测试所有脚本、代码、框架，确保能用在生产环境

**特点**：
- ✅ 多轮测试（默认 5 轮，可配置）
- ✅ 自动日志记录
- ✅ 错误追踪
- ✅ 测试报告生成
- ✅ 直到通过才实装

---

## 🚀 快速开始

### 1. 引入测试框架

```bash
source ./test-framework.sh
```

### 2. 编写测试

```bash
#!/bin/bash
source ./test-framework.sh

run_all_tests() {
    # 测试基础命令
    run_test "测试 Node.js" "node --version"

    # 测试文件存在
    test_file_exists "配置文件" "$HOME/CLAUDE.md"

    # 测试命令输出
    test_command_output "测试输出" "echo hello" "hello"

    # 测试脚本
    test_script "./your-script.sh"
}

main "$@"
```

### 3. 运行测试

```bash
chmod +x test-your-feature.sh
./test-your-feature.sh
```

---

## 📖 API 参考

### 基础测试函数

| 函数 | 用途 | 示例 |
|------|------|------|
| `run_test` | 测试命令 | `run_test "测试 Node" "node --version"` |
| `test_file_exists` | 测试文件存在 | `test_file_exists "配置" "$HOME/CLAUDE.md"` |
| `test_dir_exists` | 测试目录存在 | `test_dir_exists ".claude" "$HOME/.claude"` |
| `test_command_output` | 测试命令输出 | `test_command_output "输出" "echo hi" "hi"` |
| `test_http_endpoint` | 测试 HTTP 端点 | `test_http_endpoint "GitHub" "https://github.com" "200"` |
| `test_script` | 测试脚本 | `test_script "./script.sh"` |

### 日志函数

| 函数 | 用途 | 颜色 |
|------|------|------|
| `log_info` | 信息日志 | 蓝色 |
| `log_success` | 成功日志 | 绿色 |
| `log_warning` | 警告日志 | 黄色 |
| `log_error` | 错误日志 | 红色 |

---

## 🔧 配置

### 环境变量

```bash
# 最大测试轮数（默认 5 轮）
export MAX_RETRIES=5

# 日志目录（默认 ./test-logs）
export LOG_DIR="./my-test-logs"
```

### 在脚本中配置

```bash
#!/bin/bash
source ./test-framework.sh

# 覆盖配置
MAX_RETRIES=10
LOG_DIR="./custom-logs"

run_all_tests() {
    run_test "我的测试" "my-command"
}

main "$@"
```

---

## 📖 使用场景

### 场景 1: 测试新脚本

```bash
#!/bin/bash
source ./test-framework.sh

# 在实装前测试脚本
test_script "./new-feature.sh"

# 测试脚本输出
test_command_output "脚本输出检查" "./new-feature.sh --help" "Usage:"

generate_report
```

### 场景 2: 测试环境配置

```bash
#!/bin/bash
source ./test-framework.sh

run_all_tests() {
    # 测试必要工具
    run_test "Node.js 已安装" "node --version"
    run_test "Git 已安装" "git --version"
    run_test "Python 已安装" "python --version"

    # 测试必要文件
    test_file_exists "CLAUDE.md" "$HOME/CLAUDE.md"
    test_file_exists "MEMORY.md" "$HOME/.claude/memory/MEMORY.md"

    # 测试必要目录
    test_dir_exists ".claude" "$HOME/.claude"
    test_dir_exists ".openclaw" "$HOME/.openclaw"
}

main "$@"
```

### 场景 3: 测试 Web 服务

```bash
#!/bin/bash
source ./test-framework.sh

run_all_tests() {
    # 测试服务是否启动
    test_http_endpoint "OpenClaw 网关" "http://127.0.0.1:18789" "200"
    test_http_endpoint "Dashboard" "http://127.0.0.1:18789/?token=xxx" "200"

    # 测试 API 端点
    test_http_endpoint "API 健康检查" "http://api.example.com/health" "200"
}

main "$@"
```

### 场景 4: CI/CD 集成

```yaml
# .github/workflows/test.yml
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Test Framework
        run: |
          chmod +x ./run-tests.sh
          ./run-tests.sh

      - name: Upload Test Logs
        uses: actions/upload-artifact@v4
        with:
          name: test-logs
          path: ./test-logs/
```

---

## 📖 测试流程

```
开始测试
    ↓
初始化 (创建日志目录)
    ↓
运行测试 1
    ↓
┌───────────────┐
│ 第 1 轮测试     │
│ 失败 → 等待 2 秒  │
│ 第 2 轮测试     │
│ 失败 → 等待 2 秒  │
│ ...           │
│ 第 5 轮测试     │
└───────────────┘
    ↓
通过 ✅ / 失败 ❌
    ↓
运行测试 2
    ↓
...
    ↓
生成测试报告
    ↓
完成
```

---

## 📖 日志文件

### 目录结构

```
test-logs/
├── main-20260309-143022.log      # 主日志（所有输出）
├── error-20260309-143022.log     # 错误日志（失败详情）
└── summary-20260309-143022.log   # 摘要日志（测试结果）
```

### 主日志内容

```
========================================
  杰克测试框架 v1.0
  开始时间：2026-03-09 14:30:22
========================================

[INFO] 测试：测试 Node.js
[INFO] 命令：node --version
----------------------------------------
[INFO] >>> 第 1 轮测试 (最大 5 轮)
[PASS] 测试 Node.js - 通过 (第 1 轮)

========================================
  测试报告
========================================
  总测试数：10
  通过：8
  失败：2
```

### 错误日志内容

```
=== 测试失败详情 ===
测试名称：测试某脚本
测试轮次：5
测试命令：./failing-script.sh
失败时间：2026-03-09 14:30:25
```

---

## 💡 最佳实践

### 1. 测试前置条件

```bash
run_all_tests() {
    # 先测试环境
    run_test "环境检查" "node --version"

    # 再测试功能
    run_test "功能测试" "./feature.sh"
}
```

### 2. 分组测试

```bash
test_unit() {
    log_info "=== 单元测试 ==="
    run_test "测试函数 A" "test_function_a"
    run_test "测试函数 B" "test_function_b"
}

test_integration() {
    log_info "=== 集成测试 ==="
    test_http_endpoint "API" "http://api/health" "200"
}

test_e2e() {
    log_info "=== 端到端测试 ==="
    run_test "完整流程" "./e2e-test.sh"
}

main() {
    init
    test_unit
    test_integration
    test_e2e
    generate_report
}
```

### 3. 条件测试

```bash
test_conditional() {
    # 只在文件存在时测试
    if [ -f "./optional-feature.sh" ]; then
        run_test "可选功能" "./optional-feature.sh"
    else
        log_warning "可选功能脚本不存在，跳过测试"
    fi
}
```

### 4. 测试超时

```bash
run_test_with_timeout() {
    local test_name="$1"
    local cmd="$2"
    local timeout="${3:-30}"  # 默认 30 秒超时

    run_test "$test_name" "timeout $timeout $cmd"
}
```

---

## 📖 示例测试脚本

### 示例 1: 测试备份脚本

```bash
#!/bin/bash
source ./test-framework.sh

run_all_tests() {
    log_info "=== 测试备份脚本 ==="

    # 测试脚本存在
    test_file_exists "备份脚本" "./auto-backup-all.ps1"

    # 测试语法
    run_test "PowerShell 语法检查" "pwsh -Command \"Get-Content ./auto-backup-all.ps1\""

    # 测试备份目录存在
    test_dir_exists "备份目录" "$HOME/.claude/memory-backup"

    # 测试实际备份（会创建备份）
    # run_test "执行备份" "./auto-backup-all.ps1"
}

main "$@"
```

### 示例 2: 测试 Web 服务

```bash
#!/bin/bash
source ./test-framework.sh

PORT=18789

run_all_tests() {
    log_info "=== 测试 Web 服务 ==="

    # 测试端口监听
    run_test "端口监听检查" "netstat -ano | grep $PORT"

    # 测试 HTTP 端点
    test_http_endpoint "健康检查" "http://127.0.0.1:$PORT/health" "200"
    test_http_endpoint "API 端点" "http://127.0.0.1:$PORT/api" "200"

    # 测试响应内容
    test_command_output "响应内容检查" "curl -s http://127.0.0.1:$PORT" "success"
}

main "$@"
```

---

## 🔗 相关文件

| 文件 | 用途 |
|------|------|
| `test-framework.sh` | 测试框架主文件 |
| `test-examples.sh` | 使用示例 |
| `test-runner.sh` | 测试运行器（自定义测试） |

---

## 📖 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-03-09 | 初始版本 |

---

*杰克测试框架 - 测试通过才实装！*
