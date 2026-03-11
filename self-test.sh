#!/bin/bash
#===============================================================================
# 杰克测试框架 - 自测脚本 (Self Test)
# 版本：v1.0
# 用途：测试框架本身的每个函数，确保框架没有 bug
#===============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/test-framework-plus.sh"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 计数器
SELF_TOTAL=0
SELF_PASSED=0
SELF_FAILED=0

#-------------------------------------------------------------------------------
# 测试断言函数
#-------------------------------------------------------------------------------
assert_equals() {
    local expected="$1"
    local actual="$2"
    local test_name="$3"

    SELF_TOTAL=$((SELF_TOTAL + 1))

    if [ "$expected" = "$actual" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        SELF_PASSED=$((SELF_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        echo "   期望：$expected"
        echo "   实际：$actual"
        SELF_FAILED=$((SELF_FAILED + 1))
        return 1
    fi
}

assert_not_empty() {
    local value="$1"
    local test_name="$2"

    SELF_TOTAL=$((SELF_TOTAL + 1))

    if [ -n "$value" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        SELF_PASSED=$((SELF_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        echo "   值：为空"
        SELF_FAILED=$((SELF_FAILED + 1))
        return 1
    fi
}

assert_file_exists() {
    local file="$1"
    local test_name="$2"

    SELF_TOTAL=$((SELF_TOTAL + 1))

    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        SELF_PASSED=$((SELF_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        echo "   文件：$file 不存在"
        SELF_FAILED=$((SELF_FAILED + 1))
        return 1
    fi
}

assert_function_exists() {
    local func="$1"
    local test_name="$2"

    SELF_TOTAL=$((SELF_TOTAL + 1))

    if declare -f "$func" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name"
        SELF_PASSED=$((SELF_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}: $test_name"
        echo "   函数：$func 不存在"
        SELF_FAILED=$((SELF_FAILED + 1))
        return 1
    fi
}

#-------------------------------------------------------------------------------
# 测试核心函数
#-------------------------------------------------------------------------------
test_core_functions() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  测试核心函数${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    # 测试函数存在性
    assert_function_exists "init" "函数存在：init"
    assert_function_exists "run_test" "函数存在：run_test"
    assert_function_exists "verify_test" "函数存在：verify_test"
    assert_function_exists "code_quality_check" "函数存在：code_quality_check"
    assert_function_exists "security_check" "函数存在：security_check"
    assert_function_exists "performance_check" "函数存在：performance_check"
    assert_function_exists "documentation_check" "函数存在：documentation_check"
    assert_function_exists "compatibility_check" "函数存在：compatibility_check"
    assert_function_exists "final_check" "函数存在：final_check"
    assert_function_exists "full_pipeline" "函数存在：full_pipeline"
    assert_function_exists "generate_report" "函数存在：generate_report"
    assert_function_exists "log_info" "函数存在：log_info"
    assert_function_exists "log_success" "函数存在：log_success"
    assert_function_exists "log_warning" "函数存在：log_warning"
    assert_function_exists "log_error" "函数存在：log_error"
}

#-------------------------------------------------------------------------------
# 测试日志函数
#-------------------------------------------------------------------------------
test_log_functions() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  测试日志函数${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    # 初始化
    init > /dev/null 2>&1

    # 测试日志输出
    local log_output

    log_output=$(log_info "测试信息" 2>&1)
    assert_not_empty "$log_output" "log_info 输出测试"

    log_output=$(log_success "成功信息" 2>&1)
    assert_not_empty "$log_output" "log_success 输出测试"

    log_output=$(log_warning "警告信息" 2>&1)
    assert_not_empty "$log_output" "log_warning 输出测试"

    log_output=$(log_error "错误信息" 2>&1)
    assert_not_empty "$log_output" "log_error 输出测试"
}

#-------------------------------------------------------------------------------
# 测试 run_test 函数
#-------------------------------------------------------------------------------
test_run_test() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  测试 run_test 函数${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    # 测试成功情况
    run_test "成功测试" "echo 'hello'" > /dev/null 2>&1
    assert_equals "0" "$?" "run_test 成功测试"

    # 测试失败情况（命令不存在）
    run_test "失败测试" "not_exist_command_12345" > /dev/null 2>&1 || true

    # 检查计数器是否正确
    assert_not_empty "$TOTAL_TESTS" "TOTAL_TESTS 计数器"
}

#-------------------------------------------------------------------------------
# 测试代码质量检查
#-------------------------------------------------------------------------------
test_code_quality_check() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  测试 code_quality_check 函数${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    # 创建临时测试目录
    local test_dir=$(mktemp -d)

    # 创建干净的测试文件
    echo 'console.log("hello")' > "$test_dir/test.js"

    # 运行代码质量检查
    code_quality_check "$test_dir" > /dev/null 2>&1
    local result=$?

    # 清理
    rm -rf "$test_dir"

    assert_equals "0" "$result" "code_quality_check 执行测试"
}

#-------------------------------------------------------------------------------
# 测试安全检查
#-------------------------------------------------------------------------------
test_security_check() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  测试 security_check 函数${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    # 创建临时测试目录
    local test_dir=$(mktemp -d)

    # 创建干净的测试文件
    echo 'const x = 1' > "$test_dir/test.js"

    # 运行安全检查
    security_check "$test_dir" > /dev/null 2>&1
    local result=$?

    # 清理
    rm -rf "$test_dir"

    assert_equals "0" "$result" "security_check 执行测试"
}

#-------------------------------------------------------------------------------
# 测试决策树函数
#-------------------------------------------------------------------------------
test_decision_tree() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  测试 decision_tree 相关函数${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    # 检查函数存在性（如果已引入）
    if [ -f "$SCRIPT_DIR/decision-tree.sh" ]; then
        source "$SCRIPT_DIR/decision-tree.sh" > /dev/null 2>&1 || true

        assert_function_exists "score_base_test" "函数存在：score_base_test"
        assert_function_exists "score_security" "函数存在：score_security"
        assert_function_exists "score_code_quality" "函数存在：score_code_quality"
        assert_function_exists "score_unit_test" "函数存在：score_unit_test"
        assert_function_exists "score_build" "函数存在：score_build"
    else
        echo -e "${YELLOW}⚠️  SKIP${NC}: decision-tree.sh 不存在"
    fi
}

#-------------------------------------------------------------------------------
# 测试记忆库功能
#-------------------------------------------------------------------------------
test_memory_functions() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  测试 memory 相关函数${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    assert_function_exists "record_error_to_memory" "函数存在：record_error_to_memory"
    assert_function_exists "record_success_to_memory" "函数存在：record_success_to_memory"

    # 测试记录功能
    local error_mem="$SCRIPT_DIR/memory/error-memory.md"
    local success_mem="$SCRIPT_DIR/memory/success-memory.md"

    # 确保目录存在
    mkdir -p "$SCRIPT_DIR/memory"

    # 测试记录错误
    record_error_to_memory "自测错误" "echo test" "测试错误" > /dev/null 2>&1
    assert_file_exists "$error_mem" "错误记忆库文件存在"

    # 测试记录成功
    record_success_to_memory "自测成功" "echo test" > /dev/null 2>&1
    assert_file_exists "$success_mem" "成功案例记忆库文件存在"
}

#-------------------------------------------------------------------------------
# 测试文件存在性
#-------------------------------------------------------------------------------
test_file_existence() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  测试文件存在性${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    assert_file_exists "$SCRIPT_DIR/test-framework.sh" "test-framework.sh 存在"
    assert_file_exists "$SCRIPT_DIR/test-framework-plus.sh" "test-framework-plus.sh 存在"
    assert_file_exists "$SCRIPT_DIR/quick-check.sh" "quick-check.sh 存在"
    assert_file_exists "$SCRIPT_DIR/decision-tree.sh" "decision-tree.sh 存在"
    assert_file_exists "$SCRIPT_DIR/memory-review.sh" "memory-review.sh 存在"
    assert_file_exists "$SCRIPT_DIR/unified-gateway.sh" "unified-gateway.sh 存在"
}

#-------------------------------------------------------------------------------
# 测试配置文件
#-------------------------------------------------------------------------------
test_config() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  测试配置变量${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"

    assert_not_empty "$MAX_RETRIES" "MAX_RETRIES 配置"
    assert_not_empty "$VERIFY_RETRIES" "VERIFY_RETRIES 配置"
    assert_not_empty "$LOG_DIR" "LOG_DIR 配置"

    assert_equals "2" "$MAX_RETRIES" "MAX_RETRIES 默认值（优化后）"
    assert_equals "1" "$VERIFY_RETRIES" "VERIFY_RETRIES 默认值（优化后）"
}

#-------------------------------------------------------------------------------
# 生成自测报告
#-------------------------------------------------------------------------------
generate_self_test_report() {
    local report_file="$SCRIPT_DIR/test-logs/self-test-$(date +%Y%m%d-%H%M%S).md"

    mkdir -p "$SCRIPT_DIR/test-logs"

    cat > "$report_file" << EOF
# 框架自测报告

**时间**: $(date '+%Y-%m-%d %H:%M:%S')
**版本**: v1.0

## 结果

| 项目 | 数量 |
|------|------|
| 总测试数 | $SELF_TOTAL |
| 通过 | $SELF_PASSED |
| 失败 | $SELF_FAILED |
| 通过率 | $(( SELF_PASSED * 100 / (SELF_TOTAL > 0 ? SELF_TOTAL : 1) ))% |

## 结论

$(if [ $SELF_FAILED -eq 0 ]; then echo "✅ **所有自测通过**"; else echo "❌ **有 $SELF_FAILED 项失败**"; fi)

---
*杰克测试框架自测 v1.0*
EOF

    echo ""
    echo "自测报告：$report_file"
}

#-------------------------------------------------------------------------------
# 主函数
#-------------------------------------------------------------------------------
main() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     杰克测试框架 - 自测脚本 v1.0                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "开始时间：$(date '+%Y-%m-%d %H:%M:%S')"
    echo ""

    # 初始化
    init > /dev/null 2>&1

    # 运行所有测试
    test_file_existence
    test_core_functions
    test_log_functions
    test_run_test
    test_code_quality_check
    test_security_check
    test_memory_functions
    test_config
    test_decision_tree

    # 生成报告
    generate_self_test_report

    # 最终结果
    echo ""
    echo "════════════════════════════════════════════"
    echo "  自测结果"
    echo "════════════════════════════════════════════"
    echo "  总测试：$SELF_TOTAL"
    echo "  通过：$SELF_PASSED"
    echo "  失败：$SELF_FAILED"

    if [ $SELF_FAILED -eq 0 ]; then
        echo ""
        echo -e "${GREEN}  ✅ 所有自测通过！框架可靠！${NC}"
        echo ""
        exit 0
    else
        echo ""
        echo -e "${RED}  ❌ 有 $SELF_FAILED 项失败，请修复！${NC}"
        echo ""
        exit 1
    fi
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
