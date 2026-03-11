# 实装前检查清单

> 创建日期：2026-03-09 | 版本：v1.0

---

## 📋 概述

**罗总要求**：成功后必须要再复查、检查、检测、测试，最后再实装！

**流程**：
```
测试 → 复查 → 检查 → 检测 → 最终测试 → 实装
```

---

## 🔄 完整流程

### 阶段 1: 初步测试

```bash
# 用测试框架运行初步测试
run_test "功能测试" "./feature.sh"

# 结果处理
# - 通过 → 进入复查阶段
# - 失败 → 修复，记录错误记忆库
```

### 阶段 2: 复查验证

```bash
# 连续 3 轮复查（可配置）
verify_test "功能复查" "./feature.sh"

# 要求
# - 连续 3 次通过（可配置）
# - 任何一次失败 → 重新修复
```

### 阶段 3: 实装前检查

```bash
# 实装前最终检查清单
final_check "项目名称" "
./test-lint.sh
./test-security.sh
./test-performance.sh
"
```

### 阶段 4: 实装

```bash
# 只有所有检查通过，才能实装
if [ 所有测试通过 ] && [ 复查通过 ] && [ 最终检查通过 ]; then
    echo "可以实装！"
    ./deploy.sh
else
    echo "禁止实装！"
    exit 1
fi
```

---

## 📖 详细步骤

### 步骤 1: 初步测试（5 轮重试）

```bash
#!/bin/bash
source ./test-framework.sh

# 初步测试
run_test "脚本语法检查" "bash -n ./script.sh"
run_test "脚本功能测试" "./script.sh --test"
run_test "依赖检查" "node --version && git --version"

# 检查通过率
if [ $FAILED_TESTS -gt 0 ]; then
    log_error "初步测试失败，修复中..."
    exit 1
fi
```

### 步骤 2: 复查验证（3 轮连续通过）

```bash
#!/bin/bash
source ./test-framework.sh

# 复查验证
verify_test "脚本复查" "./script.sh"

# 复查失败处理
if [ $? -ne 0 ]; then
    log_error "复查失败，需要重新检查代码！"
    exit 1
fi
```

### 步骤 3: 实装前检查

```bash
#!/bin/bash
source ./test-framework.sh

# 定义检查项
CHECK_COMMANDS="
bash -n ./script.sh           # 语法检查
./script.sh --security-check  # 安全检查
./script.sh --performance     # 性能测试
./script.sh --lint            # 代码规范
"

# 运行最终检查
final_check "实装前检查" "$CHECK_COMMANDS"

if [ $? -ne 0 ]; then
    log_error "实装前检查失败，禁止实装！"
    exit 1
fi
```

### 步骤 4: 实装部署

```bash
#!/bin/bash
source ./test-framework.sh

# 完整流程
main() {
    init

    # 阶段 1: 初步测试
    log_info "=== 阶段 1: 初步测试 ==="
    run_test "语法检查" "bash -n ./script.sh"
    run_test "功能测试" "./script.sh --test"

    if [ $FAILED_TESTS -gt 0 ]; then
        log_error "初步测试失败"
        generate_report
        exit 1
    fi

    # 阶段 2: 复查验证
    log_info "=== 阶段 2: 复查验证 ==="
    verify_test "功能复查" "./script.sh"

    if [ $? -ne 0 ]; then
        log_error "复查失败"
        generate_report
        exit 1
    fi

    # 阶段 3: 实装前检查
    log_info "=== 阶段 3: 实装前检查 ==="
    final_check "实装前检查" "
        bash -n ./script.sh
        ./script.sh --security-check
        ./script.sh --lint
    "

    if [ $? -ne 0 ]; then
        log_error "实装前检查失败"
        generate_report
        exit 1
    fi

    # 阶段 4: 实装部署
    log_info "=== 阶段 4: 实装部署 ==="
    log_success "所有检查通过，可以实装！"

    # 这里执行实装命令
    # ./deploy.sh
    # git push
    # npm publish

    generate_report
}

main "$@"
```

---

## 📊 检查清单

### 代码检查

- [ ] 语法检查通过
- [ ] 代码规范检查通过
- [ ] 无安全漏洞
- [ ] 无性能问题

### 功能检查

- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] 边界测试通过
- [ ] 异常处理测试通过

### 复查检查

- [ ] 连续 3 次复查通过
- [ ] 测试结果稳定
- [ ] 无随机失败

### 实装检查

- [ ] 所有测试通过
- [ ] 复查验证完成
- [ ] 实装前检查完成
- [ ] 记忆库已更新

---

## 🎯 实例：部署脚本

```bash
#!/bin/bash
# deploy-with-check.sh

source ./test-framework.sh

PROJECT_NAME="my-feature"
DEPLOY_TARGET="production"

main() {
    init

    log_info "项目名称：$PROJECT_NAME"
    log_info "部署目标：$DEPLOY_TARGET"

    # ========== 阶段 1: 初步测试 ==========
    log_info "========================================"
    log_info "  阶段 1: 初步测试"
    log_info "========================================"

    run_test "Node.js 环境" "node --version"
    run_test "Git 环境" "git --version"
    run_test "依赖安装" "npm list --depth=0"
    run_test "单元测试" "npm test"
    run_test "构建检查" "npm run build"

    if [ $FAILED_TESTS -gt 0 ]; then
        log_error "初步测试失败，停止部署"
        generate_report
        exit 1
    fi

    # ========== 阶段 2: 复查验证 ==========
    log_info "========================================"
    log_info "  阶段 2: 复查验证"
    log_info "========================================"

    verify_test "构建复查" "npm run build"
    verify_test "测试复查" "npm test"

    if [ $? -ne 0 ]; then
        log_error "复查失败，停止部署"
        generate_report
        exit 1
    fi

    # ========== 阶段 3: 实装前检查 ==========
    log_info "========================================"
    log_info "  阶段 3: 实装前检查"
    log_info "========================================"

    final_check "实装前检查" "
        npm run lint
        npm run security-check
        npm run performance-test
    "

    if [ $? -ne 0 ]; then
        log_error "实装前检查失败，停止部署"
        generate_report
        exit 1
    fi

    # ========== 阶段 4: 实装部署 ==========
    log_info "========================================"
    log_info "  阶段 4: 实装部署"
    log_info "========================================"

    log_success "所有检查通过！"
    log_info "开始部署..."

    # 执行部署命令
    # git push origin main
    # npm publish
    # docker build && docker push

    log_success "部署完成！"

    generate_report
}

main "$@"
```

---

## 📖 输出示例

```
========================================
  杰克测试框架 v1.0
  开始时间：2026-03-09 15:00:00
========================================

[INFO] ========================================
[INFO]   阶段 1: 初步测试
[INFO] ========================================

[INFO] 测试：Node.js 环境
[INFO] 命令：node --version
----------------------------------------
[INFO] >>> 第 1 轮测试 (最大 5 轮)
[PASS] Node.js 环境 - 通过 (第 1 轮)
[INFO] 成功已记录到：./memory/success-memory.md

... (其他测试)

[INFO] ========================================
[INFO]   阶段 2: 复查验证
[INFO] ========================================

[INFO] 复查验证：构建复查
[INFO] 命令：npm run build
----------------------------------------
[INFO] >>> 第 1 轮复查 (最大 3 轮)
[PASS] 构建复查 - 通过 (第 1 轮)
[INFO] 等待 1 秒后进行下次复查...
[INFO] >>> 第 2 轮复查 (最大 3 轮)
[PASS] 构建复查 - 通过 (第 2 轮)
[INFO] 等待 1 秒后进行下次复查...
[INFO] >>> 第 3 轮复查 (最大 3 轮)
[PASS] 构建复查 - 通过 (第 3 轮)
[SUCCESS] ========================================
[SUCCESS]   构建复查 - 复查验证完成！
[SUCCESS]   连续 3 次测试通过
[SUCCESS] ========================================

[INFO] ========================================
[INFO]   阶段 3: 实装前检查
[INFO] ========================================

[INFO] 检查项 1: npm run lint
[SUCCESS] 检查项 1 - 通过
[INFO] 检查项 2: npm run security-check
[SUCCESS] 检查项 2 - 通过
[INFO] 检查项 3: npm run performance-test
[SUCCESS] 检查项 3 - 通过
[SUCCESS] ========================================
[SUCCESS]   实装前最终检查完成！
[SUCCESS]   检查项：3, 通过：3
[SUCCESS] ========================================

[INFO] ========================================
[INFO]   阶段 4: 实装部署
[INFO] ========================================

[SUCCESS] 所有检查通过，可以实装！
[INFO] 开始部署...
[SUCCESS] 部署完成！

========================================
  测试报告
========================================
  总测试数：15
  通过：15
  失败：0
  通过率：100%
========================================
```

---

## 🔗 相关文件

| 文件 | 用途 |
|------|------|
| `test-framework.sh` | 测试框架（含复查功能） |
| `memory/error-memory.md` | 错误记忆库 |
| `memory/success-memory.md` | 成功案例记忆库 |
| `memory/DUAL-MEMORY-GUIDE.md` | 双记忆库使用指南 |

---

## 📖 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-03-09 | 初始版本 |

---

*实装前检查清单 - 不检查，不实装！*
