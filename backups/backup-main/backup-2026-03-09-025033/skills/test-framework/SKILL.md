# 测试框架技能文档

> 创建日期：2026-03-09 | 版本：v1.0

---

## 📋 概述

**名称**：杰克测试框架 (Jack Test Framework)

**用途**：测试所有脚本、代码、框架，确保能用在生产环境

**核心理念**：测试通过才实装！

---

## 🎯 为什么需要测试框架

### 问题

- ❌ 写了代码直接用，出问题才修复
- ❌ 不知道哪里坏了，靠猜
- ❌ 修复后不知道有没有引入新问题
- ❌ 没有日志，出问题无法追溯

### 解决

- ✅ 先测试，再实装
- ✅ 多轮测试，自动重试
- ✅ 详细日志，问题可追溯
- ✅ 测试报告，一目了然

---

## 🚀 快速开始

### 1. 创建测试脚本

```bash
#!/bin/bash
source ./test-framework.sh

run_all_tests() {
    # 测试你的代码
    run_test "测试我的脚本" "./my-script.sh"
}

main "$@"
```

### 2. 运行测试

```bash
chmod +x test-my-script.sh
./test-my-script.sh
```

### 3. 查看结果

```
测试报告
========
总测试数：5
通过：4
失败：1
通过率：80%
```

---

## 📖 核心函数

### run_test - 测试命令

```bash
# 用法
run_test "测试名称" "测试命令"

# 示例
run_test "测试 Node.js" "node --version"
run_test "测试 Git" "git --version"
run_test "测试备份脚本" "./auto-backup-all.ps1"
```

**特点**：
- 自动重试（默认 5 轮）
- 记录日志
- 错误追踪

---

### test_file_exists - 测试文件存在

```bash
# 用法
test_file_exists "测试名称" "文件路径"

# 示例
test_file_exists "CLAUDE.md" "$HOME/CLAUDE.md"
test_file_exists "MEMORY.md" "$HOME/.claude/memory/MEMORY.md"
```

---

### test_dir_exists - 测试目录存在

```bash
# 用法
test_dir_exists "测试名称" "目录路径"

# 示例
test_dir_exists ".claude 目录" "$HOME/.claude"
test_dir_exists "skills 目录" "./skills"
```

---

### test_command_output - 测试命令输出

```bash
# 用法
test_command_output "测试名称" "命令" "期望输出"

# 示例
test_command_output "Node 版本" "node --version" "v"
test_command_output "Echo 测试" "echo hello" "hello"
```

---

### test_http_endpoint - 测试 HTTP 端点

```bash
# 用法
test_http_endpoint "测试名称" "URL" "期望状态码"

# 示例
test_http_endpoint "GitHub" "https://github.com" "200"
test_http_endpoint "API 健康检查" "http://api.example.com/health" "200"
```

---

### test_script - 测试脚本

```bash
# 用法
test_script "脚本路径"

# 示例
test_script "./auto-backup-all.ps1"
test_script "./install-daily-backup-task.ps1"
```

---

## 🔧 配置

### 环境变量

```bash
# 最大测试轮数
export MAX_RETRIES=10  # 默认 5 轮

# 日志目录
export LOG_DIR="./my-logs"  # 默认 ./test-logs
```

### 在脚本中配置

```bash
#!/bin/bash
source ./test-framework.sh

# 覆盖默认配置
MAX_RETRIES=3
LOG_DIR="./custom-logs"

run_all_tests() {
    run_test "我的测试" "./my-script.sh"
}

main "$@"
```

---

## 📖 测试流程

```
1. 初始化
   ↓
2. 运行测试
   ↓
3. 第 1 轮测试
   ↓
   通过？──是──→ 记录成功
   ↓否
   等待 2 秒
   ↓
4. 第 2 轮测试
   ↓
   通过？──是──→ 记录成功
   ↓否
   ...
   ↓
5. 第 5 轮（最后一轮）
   ↓
   通过？──是──→ 记录成功
   ↓否
   记录失败，写入错误日志
   ↓
6. 下一个测试
   ↓
7. 生成测试报告
```

---

## 📖 日志文件

### 目录结构

```
test-logs/
├── main-20260309-143022.log    # 主日志
├── error-20260309-143022.log   # 错误日志
└── summary-20260309-143022.log # 摘要日志
```

### 主日志示例

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

[INFO] 测试：测试 Git
[INFO] 命令：git --version
----------------------------------------
[INFO] >>> 第 1 轮测试 (最大 5 轮)
[WARN] 第 1 轮失败，准备重试...
[INFO] 等待 2 秒后重试...
[INFO] >>> 第 2 轮测试
[PASS] 测试 Git - 通过 (第 2 轮)
```

---

## 💡 使用场景

### 场景 1: 测试新脚本

```bash
#!/bin/bash
source ./test-framework.sh

# 在实装前测试
test_script "./new-feature.sh"
test_command_output "输出检查" "./new-feature.sh --help" "Usage:"

generate_report
```

### 场景 2: 测试环境

```bash
#!/bin/bash
source ./test-framework.sh

run_all_tests() {
    # 测试必要工具
    run_test "Node.js" "node --version"
    run_test "Git" "git --version"
    run_test "Python" "python --version"

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

PORT=18789

run_all_tests() {
    # 测试服务启动
    run_test "端口监听" "netstat -ano | grep $PORT"

    # 测试 HTTP 端点
    test_http_endpoint "健康检查" "http://127.0.0.1:$PORT/health" "200"
    test_http_endpoint "Dashboard" "http://127.0.0.1:$PORT" "200"
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
          chmod +x ./test-runner.sh
          ./test-runner.sh

      - name: Upload Test Logs
        uses: actions/upload-artifact@v4
        with:
          name: test-logs
          path: ./test-logs/
```

---

## 📖 最佳实践

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
    run_test "函数 A" "test_function_a"
    run_test "函数 B" "test_function_b"
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
    local timeout="${3:-30}"

    run_test "$test_name" "timeout $timeout $cmd"
}
```

---

## 📖 相关文件

| 文件 | 用途 |
|------|------|
| `test-framework.sh` | 测试框架主文件 |
| `test-examples.sh` | 使用示例 |
| `test-runner.sh` | 测试运行器 |
| `TEST-FRAMEWORK.md` | 完整文档 |

---

## 🔗 命令参考

### 运行测试

```bash
# 运行默认测试
./test-runner.sh

# 运行指定测试
./test-runner.sh ./test-my-script.sh

# 列出可用测试
./test-runner.sh --list

# 清理日志
./test-runner.sh --clean

# 显示帮助
./test-runner.sh --help
```

---

## 📖 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-03-09 | 初始版本 |

---

*杰克测试框架 - 测试通过才实装！*
