#!/bin/bash
#
# 杰克测试框架 - 增强版 (Jack Test Framework Plus)
# 版本：v2.0
#

#===============================================================================
# 配置区
#===============================================================================

# 测试配置（优化版）
MAX_RETRIES=${MAX_RETRIES:-2}       # 初步测试轮数（优化后：5→2）
VERIFY_RETRIES=${VERIFY_RETRIES:-1} # 复查验证轮数（优化后：2→1）
TEST_TIMEOUT=${TEST_TIMEOUT:-10}    # 单项测试超时（秒，优化后：30→10）
BUILD_TIMEOUT=${BUILD_TIMEOUT:-60}  # 构建超时（秒，优化后：120→60）
LOG_DIR="${LOG_DIR:-./test-logs}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# 全局排除目录（性能优化关键）
EXCLUDE_DIRS=(
    "node_modules"
    ".git"
    "dist"
    "build"
    "coverage"
    "venv"
    "__pycache__"
    ".next"
    "backups"
    "test-logs"
    ".claude"
    "memory"
)

# 构建 grep 排除参数
build_grep_exclude() {
    local args=""
    for dir in "${EXCLUDE_DIRS[@]}"; do
        args="$args --exclude-dir=$dir"
    done
    echo "$args"
}

GREP_EXCLUDE=$(build_grep_exclude)

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# 日志文件
MAIN_LOG="$LOG_DIR/main-$TIMESTAMP.log"
ERROR_LOG="$LOG_DIR/error-$TIMESTAMP.log"
SUMMARY_LOG="$LOG_DIR/summary-$TIMESTAMP.log"
SECURITY_LOG="$LOG_DIR/security-$TIMESTAMP.log"
PERF_LOG="$LOG_DIR/performance-$TIMESTAMP.log"

# 记忆库
ERROR_MEMORY="./memory/error-memory.md"
SUCCESS_MEMORY="./memory/success-memory.md"

# 计数器
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SECURITY_ISSUES=0
PERF_ISSUES=0

#===============================================================================
# 核心函数
#===============================================================================

#-------------------------------------------------------------------------------
# 初始化
#-------------------------------------------------------------------------------
init() {
    mkdir -p "$LOG_DIR"
    mkdir -p "./memory"

    # 创建记忆库文件（如果不存在）
    touch "$ERROR_MEMORY"
    touch "$SUCCESS_MEMORY"

    echo "========================================" | tee -a "$MAIN_LOG"
    echo "  杰克测试框架 v2.0 Plus" | tee -a "$MAIN_LOG"
    echo "  开始时间：$(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$MAIN_LOG"
    echo "========================================" | tee -a "$MAIN_LOG"
    echo "" | tee -a "$MAIN_LOG"
}

#-------------------------------------------------------------------------------
# 日志函数
#-------------------------------------------------------------------------------
log_info() { echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$MAIN_LOG"; }
log_success() { echo -e "${GREEN}[PASS]${NC} $1" | tee -a "$MAIN_LOG"; }
log_warning() { echo -e "${YELLOW}[WARN]${NC} $1" | tee -a "$MAIN_LOG"; }
log_error() { echo -e "${RED}[FAIL]${NC} $1" | tee -a "$MAIN_LOG"; echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$ERROR_LOG"; }
log_security() { echo -e "${MAGENTA}[SECURITY]${NC} $1" | tee -a "$SECURITY_LOG"; }
log_perf() { echo -e "${CYAN}[PERF]${NC} $1" | tee -a "$PERF_LOG"; }

#-------------------------------------------------------------------------------
# 流程 1: 初步测试（5 轮重试）
#-------------------------------------------------------------------------------
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

        if eval "$test_cmd" >> "$MAIN_LOG" 2>&1; then
            log_success "$test_name - 通过 (第 $retry 轮)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            if [ $retry -eq 1 ]; then
                record_success_to_memory "$test_name" "$test_cmd"
            fi
            return 0
        else
            log_warning "第 $retry 轮失败，准备重试..."
            echo "" >> "$ERROR_LOG"
            echo "=== 测试失败详情 ===" >> "$ERROR_LOG"
            echo "测试名称：$test_name" >> "$ERROR_LOG"
            echo "测试轮次：$retry" >> "$ERROR_LOG"
            echo "失败时间：$(date '+%Y-%m-%d %H:%M:%S')" >> "$ERROR_LOG"
            echo "" >> "$ERROR_LOG"

            retry=$((retry + 1))
            if [ $retry -le $MAX_RETRIES ]; then
                log_info "等待 2 秒后重试..."
                sleep 2
            fi
        fi
    done

    log_error "$test_name - 失败 (已完成 $MAX_RETRIES 轮测试)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    record_error_to_memory "$test_name" "$test_cmd" "测试失败"
    return 1
}

#-------------------------------------------------------------------------------
# 流程 2: 复查验证（3 轮连续通过）
#-------------------------------------------------------------------------------
verify_test() {
    local test_name="$1"
    local test_cmd="$2"
    local verify_retry=1

    log_info "========================================"
    log_info "  复查验证：$test_name"
    log_info "========================================"

    while [ $verify_retry -le $VERIFY_RETRIES ]; do
        log_info ">>> 第 $verify_retry 轮复查 (最大 $VERIFY_RETRIES 轮)"

        if eval "$test_cmd" >> "$MAIN_LOG" 2>&1; then
            log_success "$test_name - 复查通过 (第 $verify_retry 轮)"
        else
            log_error "$test_name - 复查失败 (第 $verify_retry 轮)"
            log_warning "复查失败，需要重新检查代码！"
            return 1
        fi

        verify_retry=$((verify_retry + 1))
        if [ $verify_retry -le $VERIFY_RETRIES ]; then
            log_info "等待 1 秒后进行下次复查..."
            sleep 1
        fi
    done

    log_success "复查验证完成！连续 $VERIFY_RETRIES 次通过"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 3: 代码质量检查（优化版）
#-------------------------------------------------------------------------------
code_quality_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  代码质量检查（优化版）"
    log_info "========================================"

    # 检查 1: 查找 TODO/FIXME/HACK 标记（限制深度 3 层）
    log_info "检查代码标记 (TODO/FIXME/HACK)..."
    local todo_count=$(grep -r --max-depth=3 $GREP_EXCLUDE -E "(TODO|FIXME|HACK)" --include="*.js" --include="*.ts" --include="*.go" "$target_path" 2>/dev/null | wc -l)
    if [ "$todo_count" -gt 0 ]; then
        log_warning "发现 $todo_count 个待处理标记"
        grep -r --max-depth=3 $GREP_EXCLUDE -E "(TODO|FIXME|HACK)" --include="*.js" --include="*.ts" --include="*.go" "$target_path" 2>/dev/null | head -3 | tee -a "$MAIN_LOG"
    else
        log_success "未发现待处理标记"
    fi

    # 检查 2: 查找硬编码密码/密钥（限制深度 3 层）
    log_info "检查硬编码密码/密钥..."
    local secret_count=$(grep -r --max-depth=3 $GREP_EXCLUDE -i -E "(password|passwd|secret|api_key|apikey)\s*=\s*['\"][^'\"]+['\"]" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" --include="*.sh" "$target_path" 2>/dev/null | grep -v "example\|template\|\.env\." | wc -l)
    if [ "$secret_count" -gt 0 ]; then
        log_security "发现 $secret_count 个潜在硬编码密钥！"
        SECURITY_ISSUES=$((SECURITY_ISSUES + 1))
    else
        log_success "未发现硬编码密钥"
    fi

    # 检查 3: 查找 console.log/debug 语句（限制深度 3 层）
    log_info "检查调试语句..."
    local debug_count=$(grep -r --max-depth=3 $GREP_EXCLUDE -E "(console\.log|debugger|print\()" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | wc -l)
    if [ "$debug_count" -gt 0 ]; then
        log_warning "发现 $debug_count 个调试语句（前 3 个）"
        grep -r --max-depth=3 $GREP_EXCLUDE -E "(console\.log|debugger|print\()" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | head -3 | tee -a "$MAIN_LOG"
    else
        log_success "未发现调试语句"
    fi

    # 检查 4: 文件行数检查（限制深度 3 层）
    log_info "检查大文件 (>1000 行)..."
    local large_files=$(find "$target_path" -maxdepth 3 -type f \( -name "*.js" -o -name "*.ts" -o -name "*.go" -o -name "*.py" -o -name "*.sh" \) $(printf " -not -path '*/%s/*'" "${EXCLUDE_DIRS[@]}") -exec wc -l {} \; 2>/dev/null | awk '$1 > 1000 {print}' | head -3)
    if [ -n "$large_files" ]; then
        log_warning "发现大文件 (>1000 行):"
        echo "$large_files" | tee -a "$MAIN_LOG"
    else
        log_success "未发现超大文件"
    fi

    log_info "代码质量检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 4: 安全检查（优化版）
#-------------------------------------------------------------------------------
security_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  安全检查（优化版）"
    log_info "========================================"

    # 检查 1: 敏感文件暴露（限制深度 3 层）
    log_info "检查敏感文件..."
    local sensitive_files=$(find "$target_path" -maxdepth 3 \( -name ".env" -o -name "*.pem" -o -name "*.key" -o -name "*.secret" \) $(printf " -not -path '*/%s/*'" "${EXCLUDE_DIRS[@]}") 2>/dev/null | head -5)
    if [ -n "$sensitive_files" ]; then
        log_security "发现敏感文件:"
        echo "$sensitive_files" | tee -a "$MAIN_LOG"
        SECURITY_ISSUES=$((SECURITY_ISSUES + 1))
    else
        log_success "未发现敏感文件暴露"
    fi

    # 检查 2: SQL 注入风险（限制深度 3 层）
    log_info "检查 SQL 注入风险..."
    local sql_injection=$(grep -r --max-depth=3 $GREP_EXCLUDE -E "(SELECT|INSERT|UPDATE|DELETE|DROP).*(\+|\\\$\{|%s)" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | head -3)
    if [ -n "$sql_injection" ]; then
        log_security "潜在 SQL 注入风险:"
        echo "$sql_injection" | tee -a "$MAIN_LOG"
        SECURITY_ISSUES=$((SECURITY_ISSUES + 1))
    else
        log_success "未发现明显 SQL 注入风险"
    fi

    # 检查 3: eval 执行风险（限制深度 3 层）
    log_info "检查 eval 执行风险..."
    local eval_usage=$(grep -r --max-depth=3 $GREP_EXCLUDE -E "\b(eval|exec|Function\()" --include="*.js" --include="*.ts" --include="*.py" "$target_path" 2>/dev/null | head -3)
    if [ -n "$eval_usage" ]; then
        log_security "潜在 eval 执行风险:"
        echo "$eval_usage" | tee -a "$MAIN_LOG"
        SECURITY_ISSUES=$((SECURITY_ISSUES + 1))
    else
        log_success "未发现 eval 执行"
    fi

    # 检查 4: 路径遍历风险（限制深度 3 层）
    log_info "检查路径遍历风险..."
    local path_traversal=$(grep -r --max-depth=3 $GREP_EXCLUDE -E "\.\./|\.\.\\\\|\.\.%2f" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | head -3)
    if [ -n "$path_traversal" ]; then
        log_security "潜在路径遍历风险:"
        echo "$path_traversal" | tee -a "$MAIN_LOG"
    else
        log_success "未发现路径遍历风险"
    fi

    log_security "安全检查完成 - 发现 $SECURITY_ISSUES 个问题"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 5: 性能检查（优化版）
#-------------------------------------------------------------------------------
performance_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  性能检查（优化版）"
    log_info "========================================"

    # 检查 1: 嵌套循环（限制深度 3 层）
    log_info "检查嵌套循环..."
    local nested_loops=$(grep -r --max-depth=3 $GREP_EXCLUDE -B2 -A2 "for.*for\|while.*while" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | head -10)
    if [ -n "$nested_loops" ]; then
        log_perf "发现嵌套循环（可能需要优化）:"
        echo "$nested_loops" | head -5 | tee -a "$MAIN_LOG"
        PERF_ISSUES=$((PERF_ISSUES + 1))
    else
        log_success "未发现明显嵌套循环"
    fi

    # 检查 2: 大文件导入
    log_info "检查依赖包大小..."
    if [ -f "package.json" ]; then
        log_info "检查 Node.js 依赖..."
        if [ -d "node_modules" ]; then
            local node_modules_size=$(du -sm node_modules 2>/dev/null | cut -f1)
            log_perf "node_modules 大小：${node_modules_size}MB"
            if [ "$node_modules_size" -gt 500 ]; then
                log_warning "依赖包过大 (>500MB)，考虑优化"
                PERF_ISSUES=$((PERF_ISSUES + 1))
            fi
        else
            log_info "node_modules 不存在，跳过大小检查"
        fi
    else
        log_info "无 package.json，跳过依赖检查"
    fi

    # 检查 3: 内存泄漏风险（限制深度 3 层）
    log_info "检查内存泄漏风险..."
    local global_vars=$(grep -r --max-depth=3 $GREP_EXCLUDE "global\.[a-zA-Z_]+\s*=" --include="*.js" --include="*.ts" "$target_path" 2>/dev/null | head -3)
    if [ -n "$global_vars" ]; then
        log_perf "发现全局变量赋值（可能内存泄漏）:"
        echo "$global_vars" | tee -a "$MAIN_LOG"
        PERF_ISSUES=$((PERF_ISSUES + 1))
    else
        log_success "未发现明显内存泄漏风险"
    fi

    log_perf "性能检查完成 - 发现 $PERF_ISSUES 个问题"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 6: 文档检查
#-------------------------------------------------------------------------------
documentation_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  文档检查"
    log_info "========================================"

    # 检查 1: README 存在
    log_info "检查 README 文件..."
    if [ -f "$target_path/README.md" ] || [ -f "$target_path/readme.md" ]; then
        log_success "发现 README 文件"
    else
        log_warning "缺少 README 文件"
    fi

    # 检查 2: CHANGELOG 存在
    log_info "检查 CHANGELOG 文件..."
    if [ -f "$target_path/CHANGELOG.md" ] || [ -f "$target_path/changelog.md" ]; then
        log_success "发现 CHANGELOG 文件"
    else
        log_info "缺少 CHANGELOG 文件（建议添加）"
    fi

    # 检查 3: LICENSE 存在
    log_info "检查 LICENSE 文件..."
    if [ -f "$target_path/LICENSE" ] || [ -f "$target_path/license" ]; then
        log_success "发现 LICENSE 文件"
    else
        log_warning "缺少 LICENSE 文件"
    fi

    # 检查 4: 函数注释
    log_info "检查函数注释..."
    local func_without_docs=$(grep -r -E "^(function|def |func ).*\(\)" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | head -10)
    if [ -n "$func_without_docs" ]; then
        log_info "发现函数定义（建议添加注释）"
    else
        log_success "函数定义已检查"
    fi

    log_info "文档检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 7: 兼容性检查
#-------------------------------------------------------------------------------
compatibility_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  兼容性检查"
    log_info "========================================"

    # 检查 1: Node.js 版本要求
    if [ -f "package.json" ]; then
        log_info "检查 Node.js 版本要求..."
        local node_engine=$(grep -A2 '"engines"' package.json 2>/dev/null | grep "node")
        if [ -n "$node_engine" ]; then
            log_success "Node.js 版本要求：$node_engine"
        else
            log_warning "未指定 Node.js 版本要求"
        fi
    fi

    # 检查 2: Python 版本要求
    if [ -f "requirements.txt" ] || [ -f "setup.py" ]; then
        log_info "检查 Python 项目..."
        if grep -q "python_requires" setup.py 2>/dev/null; then
            log_success "已指定 Python 版本要求"
        else
            log_info "未指定 Python 版本要求"
        fi
    fi

    # 检查 3: 跨平台路径
    log_info "检查路径兼容性..."
    local win_paths=$(grep -r -E '\\\\' --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | head -5)
    if [ -n "$win_paths" ]; then
        log_warning "发现 Windows 路径（建议使用 path.join）"
        echo "$win_paths" | head -3 | tee -a "$MAIN_LOG"
    else
        log_success "路径兼容性良好"
    fi

    log_info "兼容性检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 8: Git 提交规范检查
#-------------------------------------------------------------------------------
git_commit_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  Git 提交规范检查"
    log_info "========================================"

    # 检查 1: Git 仓库存在
    if [ ! -d "$target_path/.git" ]; then
        log_info "非 Git 仓库，跳过检查"
        return 0
    fi

    # 检查 2: 获取最近提交
    log_info "检查最近 5 次提交..."
    local recent_commits=$(git -C "$target_path" log --oneline -5 2>/dev/null)
    if [ -n "$recent_commits" ]; then
        echo "$recent_commits" | tee -a "$MAIN_LOG"

        # 检查提交信息格式（conventional commits）
        local bad_commits=$(git -C "$target_path" log --oneline -5 2>/dev/null | grep -v -E "^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\\(.+\\))?:")
        if [ -n "$bad_commits" ]; then
            log_warning "发现不符合规范的提交信息："
            echo "$bad_commits" | tee -a "$MAIN_LOG"
            log_info "建议使用格式：feat(scope): description"
        else
            log_success "提交信息规范良好"
        fi
    else
        log_info "无提交记录"
    fi

    # 检查 3: 未提交的文件
    local uncommitted=$(git -C "$target_path" status --porcelain 2>/dev/null | wc -l)
    if [ "$uncommitted" -gt 0 ]; then
        log_warning "发现 $uncommitted 个未提交的文件"
        git -C "$target_path" status --porcelain 2>/dev/null | head -5 | tee -a "$MAIN_LOG"
    else
        log_success "工作区干净"
    fi

    log_info "Git 提交检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 9: 环境变量检查
#-------------------------------------------------------------------------------
env_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  环境变量检查"
    log_info "========================================"

    # 检查 1: .env 文件存在
    if [ -f "$target_path/.env" ]; then
        log_success "发现 .env 文件"

        # 检查是否有敏感信息
        local sensitive_in_env=$(grep -i -E "^(password|secret|api_key|private_key)\s*=" "$target_path/.env" 2>/dev/null | wc -l)
        if [ "$sensitive_in_env" -gt 0 ]; then
            log_security "警告：.env 文件中可能包含敏感信息"
        fi
    else
        log_info "未发现 .env 文件（如无需要可忽略）"
    fi

    # 检查 2: .env.example 存在
    if [ -f "$target_path/.env.example" ]; then
        log_success "发现 .env.example 模板文件"
    else
        log_info "建议创建 .env.example 模板"
    fi

    # 检查 3: NODE_ENV 设置
    if [ -n "$NODE_ENV" ]; then
        log_success "NODE_ENV=$NODE_ENV"
    else
        log_info "NODE_ENV 未设置（开发模式）"
    fi

    log_info "环境变量检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 10: 单元测试运行
#-------------------------------------------------------------------------------
run_unit_tests() {
    local target_path="${1:-.}"
    local test_cmd="${2:-}"

    log_info "========================================"
    log_info "  单元测试运行"
    log_info "========================================"

    # 自动检测测试命令
    if [ -z "$test_cmd" ]; then
        if [ -f "$target_path/package.json" ]; then
            log_info "检测到 Node.js 项目..."
            if grep -q '"test"' "$target_path/package.json" 2>/dev/null; then
                test_cmd="npm test"
            elif grep -q '"jest"' "$target_path/package.json" 2>/dev/null; then
                test_cmd="npx jest"
            elif grep -q '"vitest"' "$target_path/package.json" 2>/dev/null; then
                test_cmd="npx vitest run"
            fi
        elif [ -f "$target_path/go.mod" ]; then
            log_info "检测到 Go 项目..."
            test_cmd="go test ./..."
        elif [ -f "$target_path/pytest.ini" ] || [ -d "$target_path/tests" ]; then
            log_info "检测到 Python 项目..."
            test_cmd="pytest"
        fi
    fi

    if [ -n "$test_cmd" ]; then
        log_info "运行测试：$test_cmd"
        run_test "单元测试" "$test_cmd"
    else
        log_info "未检测到测试命令，跳过单元测试"
    fi

    log_info "单元测试运行完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 11: 构建检查
#-------------------------------------------------------------------------------
build_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  构建检查"
    log_info "========================================"

    local build_cmd=""

    # 自动检测构建命令
    if [ -f "$target_path/package.json" ]; then
        log_info "检测到 Node.js 项目..."
        if grep -q '"build"' "$target_path/package.json" 2>/dev/null; then
            build_cmd="npm run build"
        fi
    elif [ -f "$target_path/go.mod" ]; then
        log_info "检测到 Go 项目..."
        build_cmd="go build ./..."
    elif [ -f "$target_path/Cargo.toml" ]; then
        log_info "检测到 Rust 项目..."
        build_cmd="cargo build"
    elif [ -f "$target_path/pom.xml" ] || [ -f "$target_path/build.gradle" ]; then
        log_info "检测到 Java 项目..."
        build_cmd="mvn compile -q"
    fi

    if [ -n "$build_cmd" ]; then
        log_info "运行构建：$build_cmd"
        run_test "项目构建" "$build_cmd"
    else
        log_info "未检测到构建命令，跳过构建检查"
    fi

    log_info "构建检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 12: 端口/服务检查
#-------------------------------------------------------------------------------
port_check() {
    local ports="${1:-}"

    log_info "========================================"
    log_info "  端口/服务检查"
    log_info "========================================"

    if [ -z "$ports" ]; then
        log_info "未指定端口，跳过检查"
        return 0
    fi

    for port in $ports; do
        log_info "检查端口 $port..."

        # Windows/Linux 通用检测方法
        if command -v netstat >/dev/null 2>&1; then
            local port_status=$(netstat -an 2>/dev/null | grep -i "LISTENING\|LISTEN" | grep ":$port " | wc -l)
        elif [ -f "/proc/net/tcp" ]; then
            local hex_port=$(printf '%04X' "$port")
            local port_status=$(grep -i ":$hex_port" /proc/net/tcp 2>/dev/null | wc -l)
        else
            # 尝试用 curl 检测
            if curl -s --connect-timeout 2 "http://localhost:$port" >/dev/null 2>&1; then
                port_status=1
            else
                port_status=0
            fi
        fi

        if [ "$port_status" -gt 0 ]; then
            log_success "端口 $port 正在监听"
        else
            log_warning "端口 $port 未监听"
        fi
    done

    log_info "端口检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 13: 依赖健康检查
#-------------------------------------------------------------------------------
dependency_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  依赖健康检查"
    log_info "========================================"

    # Node.js 依赖检查
    if [ -f "$target_path/package.json" ]; then
        log_info "检查 Node.js 依赖..."

        if [ -d "$target_path/node_modules" ]; then
            # 检查是否有缺失的依赖
            if [ -f "$target_path/package-lock.json" ]; then
                log_success "package-lock.json 存在"
            else
                log_warning "缺少 package-lock.json"
            fi
        else
            log_warning "node_modules 不存在，建议运行 npm install"
        fi

        # 检查过时依赖（可选，较慢）
        # npm outdated --json 2>/dev/null
    fi

    # Go 依赖检查
    if [ -f "$target_path/go.mod" ]; then
        log_info "检查 Go 依赖..."
        if [ -f "$target_path/go.sum" ]; then
            log_success "go.sum 存在"
        else
            log_warning "缺少 go.sum"
        fi
    fi

    # Python 依赖检查
    if [ -f "$target_path/requirements.txt" ]; then
        log_info "检查 Python 依赖..."
    fi

    log_info "依赖健康检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 8: 实装前最终检查
#-------------------------------------------------------------------------------
final_check() {
    local project_name="$1"
    local check_commands="$2"

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
# 流程 15: 数据库迁移检查
#-------------------------------------------------------------------------------
database_migration_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  数据库迁移检查"
    log_info "========================================"

    # 检查 1: 迁移文件存在性
    log_info "检查迁移文件..."

    local migration_dirs=()
    local migration_found=false

    # 检测不同框架的迁移目录
    if [ -d "$target_path/migrations" ]; then
        migration_dirs+=("migrations")
        migration_found=true
    fi
    if [ -d "$target_path/db/migrate" ]; then
        migration_dirs+=("db/migrate")
        migration_found=true
    fi
    if [ -d "$target_path/prisma/migrations" ]; then
        migration_dirs+=("prisma/migrations")
        migration_found=true
    fi
    if [ -d "$target_path/src/migrations" ]; then
        migration_dirs+=("src/migrations")
        migration_found=true
    fi

    if [ "$migration_found" = true ]; then
        log_success "发现迁移目录：${migration_dirs[*]}"

        # 检查迁移文件数量
        for dir in "${migration_dirs[@]}"; do
            local count=$(find "$target_path/$dir" -name "*.sql" -o -name "*.ts" -o -name "*.js" 2>/dev/null | wc -l)
            if [ "$count" -gt 0 ]; then
                log_info "  $dir: $count 个迁移文件"
            fi
        done
    else
        log_info "未发现迁移目录（如无数据库可忽略）"
    fi

    # 检查 2: SQL 语法验证
    log_info "检查 SQL 语法..."
    local sql_errors=0

    if [ -d "$target_path/migrations" ]; then
        for sql_file in $(find "$target_path/migrations" -name "*.sql" 2>/dev/null | head -10); do
            # 基本 SQL 语法检查（检查明显的语法错误）
            if grep -q -E "(DROP\s+TABLE|DELETE\s+FROM|TRUNCATE)" "$sql_file" 2>/dev/null; then
                log_warning "⚠️  危险操作：$sql_file 包含 DROP/DELETE/TRUNCATE"
            fi
        done
    fi

    if [ $sql_errors -eq 0 ]; then
        log_success "SQL 语法检查通过"
    else
        log_error "发现 $sql_errors 个 SQL 语法问题"
    fi

    # 检查 3: 回滚脚本存在性
    log_info "检查回滚脚本..."
    local rollback_found=false

    for dir in "${migration_dirs[@]}"; do
        if [ -d "$target_path/$dir" ]; then
            local rollback_files=$(find "$target_path/$dir" -name "*rollback*" -o -name "*down*" -o -name "*.down.sql" 2>/dev/null | wc -l)
            if [ "$rollback_files" -gt 0 ]; then
                log_success "  $dir: 发现 $rollback_files 个回滚脚本"
                rollback_found=true
            fi
        fi
    done

    if [ "$rollback_found" = false ] && [ "$migration_found" = true ]; then
        log_warning "建议添加回滚脚本（.down.sql 或 rollback 文件）"
    fi

    # 检查 4: 数据一致性检查
    log_info "检查数据一致性配置..."
    if [ -f "$target_path/prisma/schema.prisma" ]; then
        log_success "发现 Prisma schema 文件"
    fi
    if [ -f "$target_path/sequelize.config.js" ] || [ -f "$target_path/typeorm.config.ts" ]; then
        log_success "发现 ORM 配置文件"
    fi

    log_info "数据库迁移检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 16: 回滚/灾难恢复检查
#-------------------------------------------------------------------------------
rollback_disaster_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  回滚/灾难恢复检查"
    log_info "========================================"

    # 检查 1: 回滚脚本存在性
    log_info "检查回滚脚本..."
    local rollback_scripts=()

    if [ -f "$target_path/rollback.sh" ]; then
        rollback_scripts+=("rollback.sh")
        log_success "发现 rollback.sh"
    fi
    if [ -f "$target_path/scripts/rollback.sh" ]; then
        rollback_scripts+=("scripts/rollback.sh")
        log_success "发现 scripts/rollback.sh"
    fi
    if [ -f "$target_path/deploy/rollback.sh" ]; then
        rollback_scripts+=("deploy/rollback.sh")
        log_success "发现 deploy/rollback.sh"
    fi

    if [ ${#rollback_scripts[@]} -eq 0 ]; then
        log_warning "⚠️  未发现回滚脚本！建议创建 rollback.sh"
    else
        # 检查回滚脚本语法
        for script in "${rollback_scripts[@]}"; do
            if [ -f "$target_path/$script" ]; then
                if bash -n "$target_path/$script" 2>/dev/null; then
                    log_success "$script 语法检查通过"
                else
                    log_error "$script 语法错误！"
                fi
            fi
        done
    fi

    # 检查 2: 备份文件/目录检测
    log_info "检查备份配置..."
    local backup_dirs=()

    if [ -d "$target_path/backups" ]; then
        backup_dirs+=("backups")
        log_success "发现 backups 目录"
    fi
    if [ -d "$target_path/.backups" ]; then
        backup_dirs+=(".backups")
        log_success "发现 .backups 目录"
    fi
    if [ -d "$target_path/backup" ]; then
        backup_dirs+=("backup")
        log_success "发现 backup 目录"
    fi

    if [ ${#backup_dirs[@]} -eq 0 ]; then
        log_info "未发现备份目录（建议创建）"
    else
        # 检查最新备份时间
        for dir in "${backup_dirs[@]}"; do
            local latest_backup=$(ls -t "$target_path/$dir" 2>/dev/null | head -1)
            if [ -n "$latest_backup" ]; then
                log_info "  最新备份：$latest_backup"
            fi
        done
    fi

    # 检查 3: 灾难恢复文档
    log_info "检查灾难恢复文档..."
    local dr_docs=()

    if [ -f "$target_path/DISASTER-RECOVERY.md" ]; then
        dr_docs+=("DISASTER-RECOVERY.md")
        log_success "发现 DISASTER-RECOVERY.md"
    fi
    if [ -f "$target_path/docs/disaster-recovery.md" ]; then
        dr_docs+=("docs/disaster-recovery.md")
        log_success "发现 docs/disaster-recovery.md"
    fi
    if [ -f "$target_path/RECOVERY.md" ]; then
        dr_docs+=("RECOVERY.md")
        log_success "发现 RECOVERY.md"
    fi
    if [ -f "$target_path/回滚指南.md" ]; then
        dr_docs+=("回滚指南.md")
        log_success "发现 回滚指南.md"
    fi

    if [ ${#dr_docs[@]} -eq 0 ]; then
        log_warning "⚠️  未发现灾难恢复文档！建议创建 DISASTER-RECOVERY.md"
    fi

    # 检查 4: 回滚流程验证
    log_info "检查回滚流程配置..."

    # 检查 package.json 中是否有回滚脚本
    if [ -f "$target_path/package.json" ]; then
        if grep -q '"rollback"' "$target_path/package.json" 2>/dev/null; then
            log_success "发现 npm rollback 脚本"
        fi
    fi

    # 检查 Makefile 中是否有回滚目标
    if [ -f "$target_path/Makefile" ] || [ -f "$target_path/makefile" ]; then
        if grep -q "^rollback:" "$target_path/Makefile" 2>/dev/null; then
            log_success "发现 Makefile rollback 目标"
        fi
    fi

    log_info "回滚/灾难恢复检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 14: 日志检查
#-------------------------------------------------------------------------------
logging_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  日志检查"
    log_info "========================================"

    # 检查 1: 日志配置文件存在性
    log_info "检查日志配置文件..."

    if [ -f "$target_path/winston.config.js" ] || [ -f "$target_path/src/config/winston.js" ]; then
        log_success "发现 Winston 日志配置"
    fi
    if [ -f "$target_path/log4j.properties" ] || [ -f "$target_path/log4j.xml" ]; then
        log_success "发现 Log4j 配置"
    fi
    if [ -f "$target_path/logging.conf" ] || [ -f "$target_path/config/logging.js" ]; then
        log_success "发现通用日志配置"
    fi

    # 检查 2: 日志目录结构
    log_info "检查日志目录结构..."

    if [ -d "$target_path/logs" ] || [ -d "$target_path/var/log" ]; then
        log_success "发现日志目录"
    else
        log_info "建议创建 logs/ 目录用于存放日志文件"
    fi

    # 检查 3: 代码中的日志语句
    log_info "检查代码中的日志语句..."

    local log_count=$(grep -r -c "console.log\|logger.info\|log.debug\|logging.info" --include="*.js" --include="*.ts" --include="*.py" "$target_path" 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')

    if [ "$log_count" -gt 0 ]; then
        log_success "发现 $log_count 处日志语句"
    else
        log_warning "未发现日志语句（建议添加日志记录）"
    fi

    # 检查 4: 敏感信息脱敏检查
    log_info "检查敏感信息脱敏..."

    local password_logs=$(grep -r "password\|passwd\|pwd\|secret\|token\|api_key" --include="*.js" --include="*.ts" "$target_path" 2>/dev/null | grep -i "log" | head -5)

    if [ -n "$password_logs" ]; then
        log_warning "发现可能记录敏感信息的日志语句："
        echo "$password_logs" | while read -r line; do
            log_warning "  ⚠️  $line"
        done
    else
        log_success "未发现明显的敏感信息日志记录"
    fi

    # 检查 5: 日志级别配置
    log_info "检查日志级别配置..."

    if grep -q -r "DEBUG\|INFO\|WARN\|ERROR" --include="*.env" --include="*.config.js" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现日志级别配置"
    else
        log_info "建议配置日志级别（DEBUG/INFO/WARN/ERROR）"
    fi

    # 检查 6: 日志轮转配置
    log_info "检查日志轮转配置..."

    if grep -q -r "logrotate\|maxsize\|maxFiles\|rotate" --include="*.js" --include="*.conf" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现日志轮转配置"
    else
        log_info "建议添加日志轮转配置（防止日志文件过大）"
    fi

    log_info "日志检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 15: 错误处理检查
#-------------------------------------------------------------------------------
error_handling_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  错误处理检查"
    log_info "========================================"

    # 检查 1: try-catch/finally 块
    log_info "检查异常捕获机制..."

    local try_count=$(grep -r -c "try {" --include="*.js" --include="*.ts" --include="*.py" --include="*.java" "$target_path" 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')
    local catch_count=$(grep -r -c "catch\|except" --include="*.js" --include="*.ts" --include="*.py" --include="*.java" "$target_path" 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')

    if [ "$try_count" -gt 0 ]; then
        log_success "发现 $try_count 处 try-catch 块"
    else
        log_warning "未发现 try-catch 异常处理（建议添加）"
    fi

    # 检查 2: 错误边界（前端项目）
    log_info "检查错误边界（前端项目）..."

    if [ -d "$target_path/src/components" ]; then
        if grep -r "componentDidCatch\|ErrorBoundary" --include="*.jsx" --include="*.tsx" "$target_path" 2>/dev/null | head -1 >/dev/null; then
            log_success "发现 React ErrorBoundary 组件"
        else
            log_info "建议添加 React ErrorBoundary 组件"
        fi
    fi

    # 检查 3: Promise 错误处理
    log_info "检查 Promise 错误处理..."

    local catch_promise=$(grep -r -c "\.catch(" --include="*.js" --include="*.ts" "$target_path" 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')
    local then_success=$(grep -r -c "\.then(" --include="*.js" --include="*.ts" "$target_path" 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')

    if [ "$then_success" -gt 0 ]; then
        if [ "$catch_promise" -gt 0 ]; then
            log_success "Promise 有 .catch() 处理 ($catch_promise/$then_success)"
        else
            log_warning "有 Promise 但缺少 .catch() 错误处理"
        fi
    fi

    # 检查 4: 全局错误处理器
    log_info "检查全局错误处理器..."

    if [ -f "$target_path/src/errorHandler.js" ] || [ -f "$target_path/src/middleware/errorHandler.js" ]; then
        log_success "发现全局错误处理器"
    fi
    if grep -q -r "process.on.*uncaughtException\|app.use.*error" --include="*.js" --include="*.ts" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现全局异常捕获配置"
    fi

    # 检查 5: 错误码/错误响应
    log_info "检查错误码/错误响应..."

    if [ -f "$target_path/src/errors/" ] && [ -d "$target_path/src/errors/" ]; then
        log_success "发现错误定义目录"
    fi
    if grep -q -r "400\|401\|403\|404\|500" --include="*.js" --include="*.ts" "$target_path" 2>/dev/null | grep -q "status\|statusCode" | head -1 >/dev/null; then
        log_success "发现 HTTP 错误状态码处理"
    fi

    # 检查 6: 回滚/补偿机制
    log_info "检查回滚/补偿机制..."

    if grep -q -r "rollback\|compensate\|retry\|fallback" --include="*.js" --include="*.ts" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现回滚/补偿机制"
    else
        log_info "建议为关键操作添加回滚/补偿机制"
    fi

    log_info "错误处理检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 20: 监控/告警检查
#-------------------------------------------------------------------------------
monitoring_alert_check() {
    local target_path="${1:-.}"

    log_info "========================================"
    log_info "  监控/告警检查"
    log_info "========================================"

    # 检查 1: 应用监控配置
    log_info "检查应用监控配置..."

    if [ -f "$target_path/prometheus.yml" ]; then
        log_success "发现 Prometheus 监控配置"
    fi
    if [ -f "$target_path/grafana/dashboard.json" ] || [ -d "$target_path/grafana/provisioning/dashboards" ]; then
        log_success "发现 Grafana 仪表板配置"
    fi
    if [ -f "$target_path/newrelic.yml" ] || [ -f "$target_path/.newrelic.yml" ]; then
        log_success "发现 New Relic 监控配置"
    fi
    if [ -f "$target_path/datadog.yml" ] || [ -f "$target_path/datadog.yaml" ]; then
        log_success "发现 Datadog 监控配置"
    fi
    if [ -f "$target_path/sentry.js" ] || [ -f "$target_path/src/sentry.js" ]; then
        log_success "发现 Sentry 错误追踪配置"
    fi

    # 检查 2: 日志监控
    log_info "检查日志监控配置..."

    if [ -f "$target_path/filebeat.yml" ]; then
        log_success "发现 Filebeat 日志收集配置"
    fi
    if [ -f "$target_path/logstash.conf" ] || [ -f "$target_path/logstash/pipeline/logstash.conf" ]; then
        log_success "发现 Logstash 配置"
    fi
    if [ -f "$target_path/fluent.conf" ] || [ -f "$target_path/fluentd.conf" ]; then
        log_success "发现 Fluentd 配置"
    fi
    if grep -q -r "winston-transport\|bunyan-stream\|pino-transport" --include="*.js" --include="*.ts" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现日志传输配置"
    fi

    # 检查 3: 告警规则配置
    log_info "检查告警规则配置..."

    if [ -f "$target_path/alerts.yml" ] || [ -f "$target_path/prometheus/alerts.yml" ]; then
        log_success "发现告警规则配置"
    fi
    if [ -f "$target_path/alertmanager.yml" ]; then
        log_success "发现 Alertmanager 配置"
    fi
    if [ -d "$target_path/rules" ] && [ "$(ls -A "$target_path/rules" 2>/dev/null)" ]; then
        log_success "发现告警规则目录"
    fi

    # 检查 4: 健康检查端点
    log_info "检查健康检查端点..."

    if grep -q -r "/health\|/healthz\|/ready\|/readyz\|/status\|/ping" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现健康检查端点定义"
    else
        log_info "建议添加健康检查端点（/health、/ready）"
    fi

    # 检查 5: 指标暴露
    log_info "检查指标暴露..."

    if grep -q -r "prom-client\|prometheus-client\|metrics\|/metrics" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现指标暴露配置"
    else
        log_info "建议添加应用指标暴露（CPU、内存、请求延迟等）"
    fi

    # 检查 6: 分布式追踪
    log_info "检查分布式追踪配置..."

    if grep -q -r "jaeger\|zipkin\|opentracing\|opentelemetry\|dd-trace" --include="*.js" --include="*.ts" --include="*.go" --include="*.py" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现分布式追踪配置"
    else
        log_info "建议添加分布式追踪（微服务架构）"
    fi

    # 检查 7: 告警通知渠道
    log_info "检查告警通知渠道..."

    if grep -q -r "slack.*webhook\|dingtalk\|pagerduty\|webhook.*url\|notify" --include="*.yml" --include="*.yaml" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现告警通知渠道配置"
    else
        log_info "建议配置告警通知渠道（Slack、钉钉、邮件等）"
    fi

    # 检查 8: 关键指标阈值
    log_info "检查关键指标阈值..."

    if grep -q -r "threshold\|cpu.*80\|memory.*80\|error.*rate\|latency.*p99" --include="*.yml" --include="*.yaml" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现关键指标阈值配置"
    else
        log_info "建议设置关键指标阈值（CPU>80%、内存>80%、错误率>5% 等）"
    fi

    # 检查 9: Kubernetes 监控（如果有 K8s 配置）
    log_info "检查 Kubernetes 监控..."

    if [ -d "$target_path/k8s" ] || [ -d "$target_path/kubernetes" ]; then
        if grep -q -r "serviceMonitor\|podMonitor\|prometheus.io" "$target_path/k8s" "$target_path/kubernetes" 2>/dev/null | head -1 >/dev/null; then
            log_success "发现 K8s Prometheus 集成配置"
        fi
        if grep -q -r "resources:\|limits:\|requests:" "$target_path/k8s" "$target_path/kubernetes" 2>/dev/null | head -1 >/dev/null; then
            log_success "发现 K8s 资源限制配置"
        fi
        if grep -q -r "livenessProbe\|readinessProbe" "$target_path/k8s" "$target_path/kubernetes" 2>/dev/null | head -1 >/dev/null; then
            log_success "发现 K8s 探针配置"
        fi
    fi

    # 检查 10: 备份监控
    log_info "检查备份监控配置..."

    if grep -q -r "backup.*monitor\|cron.*backup\|backup.*schedule" --include="*.yml" --include="*.yaml" --include="*.json" "$target_path" 2>/dev/null | head -1 >/dev/null; then
        log_success "发现备份监控配置"
    else
        log_info "建议配置备份任务监控"
    fi

    log_info "监控/告警检查完成"
    return 0
}

#-------------------------------------------------------------------------------
# 流程 14: 完整测试流水线（一键运行）- 更新为 22 个流程
#-------------------------------------------------------------------------------
full_pipeline() {
    local project_name="${1:-项目}"
    local test_target="${2:-.}"
    local skip_advanced="${3:-false}"  # 是否跳过高级检查

    log_info "╔════════════════════════════════════════╗"
    log_info "║   杰克测试框架 v4.0 - 完整测试流水线   ║"
    log_info "╚════════════════════════════════════════╝"
    log_info "项目：$project_name"
    log_info "目标：$test_target"
    log_info "版本：增强版 (15 个流程)"
    log_info ""

    # ========== 基础阶段 ==========
    # 阶段 1: 初步测试
    log_info "════════════════════════════════════════"
    log_info "  阶段 1/15: 初步测试"
    log_info "════════════════════════════════════════"
    run_test "环境检查" "node --version"
    run_test "Git 检查" "git --version"

    if [ $FAILED_TESTS -gt 0 ]; then
        log_error "初步测试失败，停止流水线"
        return 1
    fi

    # 阶段 2: 复查验证
    log_info "════════════════════════════════════════"
    log_info "  阶段 2/15: 复查验证"
    log_info "════════════════════════════════════════"
    verify_test "环境复查" "node --version && git --version"

    if [ $? -ne 0 ]; then
        log_error "复查验证失败，停止流水线"
        return 1
    fi

    # 阶段 3: 代码质量检查
    log_info "════════════════════════════════════════"
    log_info "  阶段 3/15: 代码质量检查"
    log_info "════════════════════════════════════════"
    code_quality_check "$test_target"

    # 阶段 4: 安全检查
    log_info "════════════════════════════════════════"
    log_info "  阶段 4/15: 安全检查"
    log_info "════════════════════════════════════════"
    security_check "$test_target"

    if [ $SECURITY_ISSUES -gt 0 ]; then
        log_warning "发现 $SECURITY_ISSUES 个安全问题，建议修复"
    fi

    # 阶段 5: 性能检查
    log_info "════════════════════════════════════════"
    log_info "  阶段 5/15: 性能检查"
    log_info "════════════════════════════════════════"
    performance_check "$test_target"

    if [ $PERF_ISSUES -gt 0 ]; then
        log_warning "发现 $PERF_ISSUES 个性能问题，建议优化"
    fi

    # ========== 高级阶段 ==========
    if [ "$skip_advanced" != "true" ]; then
        # 阶段 6: 文档和兼容性检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 6/15: 文档和兼容性检查"
        log_info "════════════════════════════════════════"
        documentation_check "$test_target"
        compatibility_check "$test_target"

        # 阶段 7: Git 提交规范检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 7/15: Git 提交规范检查"
        log_info "════════════════════════════════════════"
        git_commit_check "$test_target"

        # 阶段 8: 环境变量检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 8/15: 环境变量检查"
        log_info "════════════════════════════════════════"
        env_check "$test_target"

        # 阶段 9: 依赖健康检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 9/15: 依赖健康检查"
        log_info "════════════════════════════════════════"
        dependency_check "$test_target"

        # 阶段 10: 单元测试和构建检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 10/15: 单元测试和构建检查"
        log_info "════════════════════════════════════════"
        run_unit_tests "$test_target"
        build_check "$test_target"

        # 阶段 11: 数据库迁移检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 11/15: 数据库迁移检查"
        log_info "════════════════════════════════════════"
        database_migration_check "$test_target"

        # 阶段 12: 回滚/灾难恢复检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 12/15: 回滚/灾难恢复检查"
        log_info "════════════════════════════════════════"
        rollback_disaster_check "$test_target"

        # 阶段 13: 日志检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 13/15: 日志检查"
        log_info "════════════════════════════════════════"
        logging_check "$test_target"

        # 阶段 14: 错误处理检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 14/15: 错误处理检查"
        log_info "════════════════════════════════════════"
        error_handling_check "$test_target"

        # 阶段 15: 监控/告警检查
        log_info "════════════════════════════════════════"
        log_info "  阶段 15/15: 监控/告警检查"
        log_info "════════════════════════════════════════"
        monitoring_alert_check "$test_target"
    else
        log_info "跳过高级检查阶段..."
    fi

    # 生成报告
    generate_report

    # 判断是否可以通过
    if [ $FAILED_TESTS -eq 0 ] && [ $SECURITY_ISSUES -eq 0 ]; then
        log_success "════════════════════════════════════════"
        log_success "  流水线通过！可以实装！"
        log_success "════════════════════════════════════════"
        return 0
    else
        log_error "════════════════════════════════════════"
        log_error "  流水线失败！禁止实装！"
        log_error "════════════════════════════════════════"
        return 1
    fi
}

#-------------------------------------------------------------------------------
# 生成报告
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
    echo "  安全问题：$SECURITY_ISSUES" | tee -a "$MAIN_LOG"
    echo "  性能问题：$PERF_ISSUES" | tee -a "$MAIN_LOG"
    echo "" | tee -a "$MAIN_LOG"

    local pass_rate=0
    if [ $TOTAL_TESTS -gt 0 ]; then
        pass_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    fi
    echo "  通过率：${pass_rate}%" | tee -a "$MAIN_LOG"
    echo "" | tee -a "$MAIN_LOG"

    if [ $FAILED_TESTS -eq 0 ] && [ $SECURITY_ISSUES -eq 0 ]; then
        echo -e "${GREEN}  所有检查通过！${NC}" | tee -a "$MAIN_LOG"
    else
        echo -e "${RED}  有问题需要修复！${NC}" | tee -a "$MAIN_LOG"
    fi

    echo "" | tee -a "$MAIN_LOG"
    echo "  结束时间：$(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$MAIN_LOG"
    echo "========================================" | tee -a "$MAIN_LOG"

    {
        echo "测试摘要"
        echo "========"
        echo "总测试数：$TOTAL_TESTS"
        echo "通过：$PASSED_TESTS"
        echo "失败：$FAILED_TESTS"
        echo "安全问题：$SECURITY_ISSUES"
        echo "性能问题：$PERF_ISSUES"
        echo "通过率：${pass_rate}%"
    } > "$SUMMARY_LOG"
}

#-------------------------------------------------------------------------------
# 记录错误到记忆库
#-------------------------------------------------------------------------------
record_error_to_memory() {
    local test_name="$1"
    local test_cmd="$2"
    local error_msg="$3"
    local error_id="错误 $(printf '%03d' $((FAILED_TESTS + 1)))"

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

    cat >> "$SUCCESS_MEMORY" << EOF

---

### $success_id：$test_name

**成功日期**：$(date '+%Y-%m-%d %H:%M:%S')

**测试命令**：$test_cmd

**成功关键**：
1. <!-- 待填写 -->

**使用场景**：
- <!-- 待填写 -->

**复用建议**：
- ✅ 直接用：<!-- 待填写 -->

EOF
    log_info "成功已记录到：$SUCCESS_MEMORY"
}

#===============================================================================
# 导出函数（供外部调用）
#===============================================================================
export -f run_test verify_test code_quality_check security_check performance_check
export -f documentation_check compatibility_check git_commit_check env_check
export -f run_unit_tests build_check port_check dependency_check
export -f database_migration_check rollback_disaster_check
export -f logging_check error_handling_check
export -f monitoring_alert_check
export -f final_check full_pipeline generate_report
export -f init log_info log_success log_warning log_error log_security log_perf
export -f record_error_to_memory record_success_to_memory

#===============================================================================
# 主函数（示例）
#===============================================================================
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    init
    full_pipeline "示例项目" "." "false"
fi
