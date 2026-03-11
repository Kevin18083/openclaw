#!/bin/bash
#
# 测试运行器 - 用于运行自定义测试套件
# 用法：./test-runner.sh [测试脚本路径]
#

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

#-------------------------------------------------------------------------------
# 帮助信息
#-------------------------------------------------------------------------------
show_help() {
    echo "杰克测试运行器 v1.0"
    echo ""
    echo "用法：$0 [选项] [测试脚本]"
    echo ""
    echo "选项:"
    echo "  -h, --help      显示帮助信息"
    echo "  -l, --list      列出可用测试"
    echo "  -c, --clean     清理测试日志"
    echo "  -v, --verbose   详细输出模式"
    echo ""
    echo "示例:"
    echo "  $0                          # 运行默认测试套件"
    echo "  $0 ./test-examples.sh       # 运行指定测试脚本"
    echo "  $0 --list                   # 列出所有可用测试"
    echo "  $0 --clean                  # 清理测试日志"
}

#-------------------------------------------------------------------------------
# 列出可用测试
#-------------------------------------------------------------------------------
list_tests() {
    echo "可用的测试脚本:"
    echo ""

    local count=0
    for script in ./test-*.sh; do
        if [ -f "$script" ]; then
            echo "  - $script"
            count=$((count + 1))
        fi
    done

    echo ""
    echo "共 $count 个测试脚本"
}

#-------------------------------------------------------------------------------
# 清理日志
#-------------------------------------------------------------------------------
clean_logs() {
    echo "清理测试日志..."
    rm -rf ./test-logs/
    echo "清理完成"
}

#-------------------------------------------------------------------------------
# 运行测试
#-------------------------------------------------------------------------------
run_tests() {
    local test_script="$1"

    if [ -n "$test_script" ]; then
        # 运行指定测试
        if [ ! -f "$test_script" ]; then
            echo -e "${RED}错误：测试脚本不存在：$test_script${NC}"
            exit 1
        fi

        echo -e "${BLUE}运行测试：$test_script${NC}"
        chmod +x "$test_script"
        bash "$test_script"
    else
        # 运行默认测试套件
        echo -e "${BLUE}运行默认测试套件...${NC}"

        # 检查是否有 test-examples.sh
        if [ -f "./test-examples.sh" ]; then
            chmod +x "./test-examples.sh"
            bash "./test-examples.sh"
        else
            echo -e "${YELLOW}未找到 test-examples.sh，创建基础测试..."

            # 创建基础测试
            cat > ./test-basic.sh << 'EOF'
#!/bin/bash
source ./test-framework.sh

run_all_tests() {
    log_info "=== 基础测试 ==="

    # 测试环境
    run_test "测试 Shell" "bash --version"
    run_test "测试当前目录" "pwd"
    test_dir_exists "workspace 目录" "."
    test_file_exists "测试框架" "./test-framework.sh"
}

main "$@"
EOF

            chmod +x ./test-basic.sh
            bash ./test-basic.sh
        fi
    fi
}

#-------------------------------------------------------------------------------
# 主函数
#-------------------------------------------------------------------------------
main() {
    case "${1:-}" in
        -h|--help)
            show_help
            ;;
        -l|--list)
            list_tests
            ;;
        -c|--clean)
            clean_logs
            ;;
        *)
            run_tests "$1"
            ;;
    esac
}

# 运行
main "$@"
