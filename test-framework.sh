#!/bin/bash
#
# Copyright 2025 coze-dev Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#===============================================================================
# 杰克测试框架 (Jack Test Framework)
#===============================================================================
# 用途：测试所有脚本、代码、框架
# 特点：多轮测试、自动日志、错误追踪、直到通过
#===============================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
MAX_RETRIES=${MAX_RETRIES:-5}           # 最大测试轮数
VERIFY_RETRIES=${VERIFY_RETRIES:-3}     # 复查验证轮数
LOG_DIR="${LOG_DIR:-./test-logs}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# 日志文件
MAIN_LOG="$LOG_DIR/main-$TIMESTAMP.log"
ERROR_LOG="$LOG_DIR/error-$TIMESTAMP.log"
SUMMARY_LOG="$LOG_DIR/summary-$TIMESTAMP.log"
ERROR_MEMORY="./memory/error-memory.md"  # 错误记忆库

# 计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

#-------------------------------------------------------------------------------
# 记录错误到记忆库
#-------------------------------------------------------------------------------
record_error_to_memory() {
    local test_name="$1"
    local test_cmd="$2"
    local error_msg="$3"
    local error_id="错误 $(printf '%03d' $((FAILED_TESTS + 1)))"

    # 追加到错误记忆库
    cat >> "$ERROR_MEMORY" << EOF

---

### $error_id：$test_name

**发现日期**：$(date '+%Y-%m-%d %H:%M:%S')

**测试命令**：$test_cmd

**错误信息**：
\`\`\`
$error_msg
\`\`\`

**根本原因**：
<!-- 待分析 -->

**解决方案**：
<!-- 待填写 -->

**学习收获**：
<!-- 待填写 -->

**如何避免**：
<!-- 待填写 -->

EOF

    log_info "错误已记录到：$ERROR_MEMORY"
}

#-------------------------------------------------------------------------------
# 记录成功到记忆库
#-------------------------------------------------------------------------------
record_success_to_memory() {
    local test_name="$1"
    local test_cmd="$2"
    local success_id="案例 $(printf '%03d' $((PASSED_TESTS + 1)))"

    # 追加到成功案例记忆库
    cat >> "./memory/success-memory.md" << EOF

---

### $success_id：$test_name

**成功日期**：$(date '+%Y-%m-%d %H:%M:%S')

**测试命令**：$test_cmd

**成功内容**：
\`\`\`bash
# 测试通过的命令
$test_cmd
\`\`\`

**成功关键**：
1. <!-- 待填写 -->
2. <!-- 待填写 -->

**使用场景**：
- <!-- 待填写 -->

**复用建议**：
- ✅ 直接用：<!-- 待填写 -->
- ⚠️ 调整：<!-- 待填写 -->

EOF

    log_info "成功已记录到：./memory/success-memory.md"
}

#-------------------------------------------------------------------------------
# 初始化
#-------------------------------------------------------------------------------
init() {
    mkdir -p "$LOG_DIR"
    echo "========================================" | tee -a "$MAIN_LOG"
    echo "  杰克测试框架 v1.0" | tee -a "$MAIN_LOG"
    echo "  开始时间：$(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$MAIN_LOG"
    echo "========================================" | tee -a "$MAIN_LOG"
    echo "" | tee -a "$MAIN_LOG"
}

#-------------------------------------------------------------------------------
# 日志函数
#-------------------------------------------------------------------------------
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$MAIN_LOG"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1" | tee -a "$MAIN_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$MAIN_LOG"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1" | tee -a "$MAIN_LOG"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$ERROR_LOG"
}

#-------------------------------------------------------------------------------
# 测试执行函数
#-------------------------------------------------------------------------------
# 用法：run_test "测试名称" "测试命令"
run_test() {
    local test_name="$1"
    local test_cmd="$2"
    local retry=1

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo "" | tee -a "$MAIN_LOG"
    log_info "测试：$test_name"
    log_info "命令：$test_cmd"
    echo "----------------------------------------" | tee -a "$MAIN_LOG"

    while [ $retry -le $MAX_RETRIES ]; do
        log_info ">>> 第 $retry 轮测试 (最大 $MAX_RETRIES 轮)"

        # 执行测试
        if eval "$test_cmd" >> "$MAIN_LOG" 2>&1; then
            log_success "$test_name - 通过 (第 $retry 轮)"
            PASSED_TESTS=$((PASSED_TESTS + 1))

            # 记录成功到记忆库（仅首次通过时）
            if [ $retry -eq 1 ]; then
                record_success_to_memory "$test_name" "$test_cmd"
            fi

            return 0
        else
            log_warning "第 $retry 轮失败，准备重试..."

            # 记录失败详情
            echo "" >> "$ERROR_LOG"
            echo "=== 测试失败详情 ===" >> "$ERROR_LOG"
            echo "测试名称：$test_name" >> "$ERROR_LOG"
            echo "测试轮次：$retry" >> "$ERROR_LOG"
            echo "测试命令：$test_cmd" >> "$ERROR_LOG"
            echo "失败时间：$(date '+%Y-%m-%d %H:%M:%S')" >> "$ERROR_LOG"
            echo "" >> "$ERROR_LOG"

            retry=$((retry + 1))

            if [ $retry -le $MAX_RETRIES ]; then
                log_info "等待 2 秒后重试..."
                sleep 2
            fi
        fi
    done

    # 所有轮次都失败
    log_error "$test_name - 失败 (已完成 $MAX_RETRIES 轮测试)"
    FAILED_TESTS=$((FAILED_TESTS + 1))

    # 自动记录错误到记忆库
    record_error_to_memory "$test_name" "$test_cmd" "测试失败，已完成 $MAX_RETRIES 轮测试"

    return 1
}

#-------------------------------------------------------------------------------
# 复查验证函数（罗总要求：成功后必须复查）
#-------------------------------------------------------------------------------
# 用法：verify_test "测试名称" "测试命令"
verify_test() {
    local test_name="$1"
    local test_cmd="$2"
    local verify_retry=1

    echo "" | tee -a "$MAIN_LOG"
    log_info "========================================"
    log_info "  复查验证：$test_name"
    log_info "  命令：$test_cmd"
    log_info "========================================"
    echo "----------------------------------------" | tee -a "$MAIN_LOG"

    while [ $verify_retry -le $VERIFY_RETRIES ]; do
        log_info ">>> 第 $verify_retry 轮复查 (最大 $VERIFY_RETRIES 轮)"

        # 执行复查测试
        if eval "$test_cmd" >> "$MAIN_LOG" 2>&1; then
            log_success "$test_name - 复查通过 (第 $verify_retry 轮)"
        else
            log_error "$test_name - 复查失败 (第 $verify_retry 轮)"
            log_warning "复查失败，需要重新检查代码！"

            # 记录复查失败到错误日志
            echo "" >> "$ERROR_LOG"
            echo "=== 复查失败详情 ===" >> "$ERROR_LOG"
            echo "测试名称：$test_name (复查)" >> "$ERROR_LOG"
            echo "复查轮次：$verify_retry" >> "$ERROR_LOG"
            echo "复查时间：$(date '+%Y-%m-%d %H:%M:%S')" >> "$ERROR_LOG"
            echo "" >> "$ERROR_LOG"

            return 1
        fi

        verify_retry=$((verify_retry + 1))

        if [ $verify_retry -le $VERIFY_RETRIES ]; then
            log_info "等待 1 秒后进行下次复查..."
            sleep 1
        fi
    done

    # 所有复查轮次都通过
    log_success "========================================"
    log_success "  $test_name - 复查验证完成！"
    log_success "  连续 $VERIFY_RETRIES 次测试通过"
    log_success "========================================"

    return 0
}

#-------------------------------------------------------------------------------
# 实装前最终检查（罗总要求：复查后再检查，最后实装）
#-------------------------------------------------------------------------------
# 用法：final_check "项目名称" "检查命令列表（换行分隔）"
final_check() {
    local project_name="$1"
    local check_commands="$2"

    echo "" | tee -a "$MAIN_LOG"
    log_info "========================================"
    log_info "  实装前最终检查：$project_name"
    log_info "========================================"

    local check_count=0
    local pass_count=0

    while IFS= read -r cmd; do
        [ -z "$cmd" ] && continue
        check_count=$((check_count + 1))

        log_info "检查项 $check_count: $cmd"

        if eval "$cmd" >> "$MAIN_LOG" 2>&1; then
            log_success "检查项 $check_count - 通过"
            pass_count=$((pass_count + 1))
        else
            log_error "检查项 $check_count - 失败"
            log_warning "实装前检查失败，请修复后重新测试！"
            return 1
        fi
    done <<< "$check_commands"

    log_success "========================================"
    log_success "  实装前最终检查完成！"
    log_success "  检查项：$check_count, 通过：$pass_count"
    log_success "========================================"

    return 0
}

#-------------------------------------------------------------------------------
# 测试脚本文件
#-------------------------------------------------------------------------------
# 用法：test_script "脚本路径"
test_script() {
    local script_path="$1"
    local script_name=$(basename "$script_path")

    if [ ! -f "$script_path" ]; then
        log_error "脚本不存在：$script_path"
        return 1
    fi

    if [ ! -x "$script_path" ]; then
        log_warning "脚本不可执行，尝试添加执行权限"
        chmod +x "$script_path"
    fi

    run_test "脚本测试：$script_name" "$script_path"
}

#-------------------------------------------------------------------------------
# 测试命令输出
#-------------------------------------------------------------------------------
# 用法：test_command_output "测试名称" "命令" "期望包含的输出"
test_command_output() {
    local test_name="$1"
    local cmd="$2"
    local expected="$3"
    local retry=1

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    log_info "测试：$test_name"
    log_info "命令：$cmd"
    log_info "期望输出：$expected"
    echo "----------------------------------------" | tee -a "$MAIN_LOG"

    while [ $retry -le $MAX_RETRIES ]; do
        log_info ">>> 第 $retry 轮测试"

        local output
        output=$(eval "$cmd" 2>&1)
        local exit_code=$?

        if [ $exit_code -eq 0 ] && echo "$output" | grep -q "$expected"; then
            log_success "$test_name - 通过 (第 $retry 轮)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            log_warning "第 $retry 轮失败"
            log_warning "退出码：$exit_code"
            log_warning "输出：$output"

            retry=$((retry + 1))

            if [ $retry -le $MAX_RETRIES ]; then
                sleep 2
            fi
        fi
    done

    log_error "$test_name - 失败 (已完成 $MAX_RETRIES 轮测试)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    return 1
}

#-------------------------------------------------------------------------------
# 测试文件存在
#-------------------------------------------------------------------------------
# 用法：test_file_exists "测试名称" "文件路径"
test_file_exists() {
    local test_name="$1"
    local file_path="$2"

    run_test "文件存在测试：$test_name" "test -f $file_path"
}

#-------------------------------------------------------------------------------
# 测试目录存在
#-------------------------------------------------------------------------------
# 用法：test_dir_exists "测试名称" "目录路径"
test_dir_exists() {
    local test_name="$1"
    local dir_path="$2"

    run_test "目录存在测试：$test_name" "test -d $dir_path"
}

#-------------------------------------------------------------------------------
# 测试 HTTP 端点
#-------------------------------------------------------------------------------
# 用法：test_http_endpoint "测试名称" "URL" "期望状态码"
test_http_endpoint() {
    local test_name="$1"
    local url="$2"
    local expected_status="${3:-200}"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    log_info "测试：$test_name"
    log_info "URL: $url"
    log_info "期望状态码：$expected_status"
    echo "----------------------------------------" | tee -a "$MAIN_LOG"

    local retry=1
    while [ $retry -le $MAX_RETRIES ]; do
        log_info ">>> 第 $retry 轮测试"

        local status
        status=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>&1)

        if [ "$status" = "$expected_status" ]; then
            log_success "$test_name - 通过 (第 $retry 轮)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            log_warning "第 $retry 轮失败 - 状态码：$status (期望：$expected_status)"
            retry=$((retry + 1))

            if [ $retry -le $MAX_RETRIES ]; then
                sleep 2
            fi
        fi
    done

    log_error "$test_name - 失败 (已完成 $MAX_RETRIES 轮测试)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    return 1
}

#-------------------------------------------------------------------------------
# 生成测试报告
#-------------------------------------------------------------------------------
generate_report() {
    echo "" | tee -a "$MAIN_LOG"
    echo "========================================" | tee -a "$MAIN_LOG"
    echo "  测试报告" | tee -a "$MAIN_LOG"
    echo "========================================" | tee -a "$MAIN_LOG"
    echo "" | tee -a "$MAIN_LOG"
    echo "  总测试数：$TOTAL_TESTS" | tee -a "$MAIN_LOG"
    echo "  通过：$PASSED_TESTS" | tee -a "$MAIN_LOG"
    echo "  失败：$FAILED_TESTS" | tee -a "$MAIN_LOG"
    echo "" | tee -a "$MAIN_LOG"

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}  所有测试通过！${NC}" | tee -a "$MAIN_LOG"
    else
        echo -e "${RED}  有测试失败，请查看错误日志${NC}" | tee -a "$MAIN_LOG"
        echo "  错误日志：$ERROR_LOG" | tee -a "$MAIN_LOG"
    fi

    echo "" | tee -a "$MAIN_LOG"
    echo "  结束时间：$(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$MAIN_LOG"
    echo "========================================" | tee -a "$MAIN_LOG"

    # 生成摘要日志
    {
        echo "测试摘要"
        echo "========"
        echo "总测试数：$TOTAL_TESTS"
        echo "通过：$PASSED_TESTS"
        echo "失败：$FAILED_TESTS"
        echo "通过率：$(( (PASSED_TESTS * 100) / (TOTAL_TESTS > 0 ? TOTAL_TESTS : 1) ))%"
    } > "$SUMMARY_LOG"
}

#-------------------------------------------------------------------------------
# 清理
#-------------------------------------------------------------------------------
cleanup() {
    log_info "测试完成"
    log_info "主日志：$MAIN_LOG"
    log_info "错误日志：$ERROR_LOG"
    log_info "摘要日志：$SUMMARY_LOG"
}

#-------------------------------------------------------------------------------
# 主函数（示例）
#-------------------------------------------------------------------------------
main() {
    init

    # 示例测试
    # run_test "测试 Node.js" "node --version"
    # run_test "测试 Git" "git --version"
    # test_file_exists "测试 CLAUDE.md" "$HOME/CLAUDE.md"
    # test_dir_exists "测试 .claude 目录" "$HOME/.claude"
    # test_http_endpoint "测试 GitHub" "https://github.com" "200"

    # 运行所有测试
    run_all_tests

    generate_report
    cleanup

    # 如果有失败，返回错误码
    if [ $FAILED_TESTS -gt 0 ]; then
        exit 1
    fi
}

#-------------------------------------------------------------------------------
# 运行所有测试（自定义）
#-------------------------------------------------------------------------------
run_all_tests() {
    log_info "开始运行测试套件..."

    # 这里添加你的测试
    # 例如：
    # run_test "测试环境" "echo '测试环境正常'"
    # test_script "./scripts/your-script.sh"
    # test_command_output "测试输出" "echo hello" "hello"

    log_info "测试套件结束"
}

# 如果直接执行此脚本
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
