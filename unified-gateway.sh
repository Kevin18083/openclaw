#!/bin/bash
#===============================================================================
# 杰克测试框架 - 统一入口 (Unified Gateway)
# 版本：v9.0（优化版）
# 用途：一键运行完整测试流程（15 个流程）
#===============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/test-framework-plus.sh"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

#-------------------------------------------------------------------------------
# 帮助信息
#-------------------------------------------------------------------------------
show_help() {
    echo "杰克测试框架 - 统一入口 v9.0（优化版）"
    echo ""
    echo "用法：bash unified-gateway.sh [选项] [目标路径]"
    echo ""
    echo "选项:"
    echo "  --full      运行完整流程（优化后约 5-8 分钟）"
    echo "  --decision  只运行决策树评估"
    echo "  --memory    只运行记忆库回顾"
    echo "  --help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  bash unified-gateway.sh --full .      # 运行完整检查"
    echo "  bash unified-gateway.sh --decision .  # 只运行决策树"
    echo ""
    echo "优化内容:"
    echo "  • MAX_RETRIES: 5→2（减少重试次数）"
    echo "  • VERIFY_RETRIES: 2→1（减少复查轮数）"
    echo "  • TEST_TIMEOUT: 30→10（缩短超时）"
    echo "  • BUILD_TIMEOUT: 120→60（缩短构建超时）"
    echo "  • 全局排除目录：排除 backups、test-logs 等大目录"
    echo "  • grep 限制深度：--max-depth=3 加快搜索"
    echo ""
}

#-------------------------------------------------------------------------------
# 单独运行某个功能
#-------------------------------------------------------------------------------
run_single() {
    local func="$1"
    local target="${2:-.}"

    case "$func" in
        --memory)
            if [ -f "$SCRIPT_DIR/memory-review.sh" ]; then
                source "$SCRIPT_DIR/memory-review.sh"
                run_memory_review "$target"
            else
                echo "错误：记忆库回顾脚本不存在"
                exit 1
            fi
            ;;
        --full)
            # 完整模式：运行完整流水线
            source "$SCRIPT_DIR/test-framework-plus.sh"
            full_pipeline "完整检查" "$target" "false"
            ;;
        --decision)
            if [ -f "$SCRIPT_DIR/decision-tree.sh" ]; then
                source "$SCRIPT_DIR/decision-tree.sh"
                run_decision_tree "$target"
            else
                echo "错误：决策树脚本不存在"
                exit 1
            fi
            ;;
        *)
            echo "未知选项：$func"
            show_help
            exit 1
            ;;
    esac
}

#-------------------------------------------------------------------------------
# 主函数
#-------------------------------------------------------------------------------
main() {
    if [ $# -eq 0 ]; then
        show_help
        exit 0
    fi

    local mode="--full"  # 默认完整模式
    local target="."

    # 解析参数
    while [ $# -gt 0 ]; do
        case "$1" in
            --full|--decision|--memory)
                mode="$1"
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                target="$1"
                shift
                ;;
        esac
    done

    # 运行
    run_single "$mode" "$target"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
