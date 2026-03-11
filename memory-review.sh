#!/bin/bash
#===============================================================================
# 杰克测试框架 - 记忆库自动回顾 (Memory Review)
# 版本：v1.0
# 用途：运行测试前自动查看历史错误案例，避免重复犯错
#===============================================================================

set -e

# 配置
MEMORY_DIR="./memory"
ERROR_MEMORY="$MEMORY_DIR/error-memory.md"
SUCCESS_MEMORY="$MEMORY_DIR/success-memory.md"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

#-------------------------------------------------------------------------------
# 读取记忆库
#-------------------------------------------------------------------------------
read_memory() {
    if [ ! -f "$ERROR_MEMORY" ]; then
        echo "错误记忆库不存在：$ERROR_MEMORY"
        return 1
    fi
}

#-------------------------------------------------------------------------------
# 提取所有错误案例
#-------------------------------------------------------------------------------
extract_errors() {
    local errors=()
    local current_error=""
    local in_error=0

    while IFS= read -r line; do
        if [[ "$line" =~ ^"### 错误" ]]; then
            if [ -n "$current_error" ]; then
                errors+=("$current_error")
            fi
            current_error="$line"
            in_error=1
        elif [ $in_error -eq 1 ]; then
            current_error+=$'\n'"$line"
        fi
    done < "$ERROR_MEMORY"

    if [ -n "$current_error" ]; then
        errors+=("$current_error")
    fi

    printf '%s\n' "${errors[@]}"
}

#-------------------------------------------------------------------------------
# 提取所有成功案例
#-------------------------------------------------------------------------------
extract_successes() {
    if [ ! -f "$SUCCESS_MEMORY" ]; then
        return 1
    fi

    local successes=()
    local current_success=""
    local in_success=0

    while IFS= read -r line; do
        if [[ "$line" =~ ^"### 案例" ]]; then
            if [ -n "$current_success" ]; then
                successes+=("$current_success")
            fi
            current_success="$line"
            in_success=1
        elif [ $in_success -eq 1 ]; then
            current_success+=$'\n'"$line"
        fi
    done < "$SUCCESS_MEMORY"

    if [ -n "$current_success" ]; then
        successes+=("$current_success")
    fi

    printf '%s\n' "${successes[@]}"
}

#-------------------------------------------------------------------------------
# 根据关键词匹配历史错误
#-------------------------------------------------------------------------------
match_similar_errors() {
    local keywords="$1"
    local matches=()

    while IFS= read -r line; do
        if [[ "$line" =~ (密码 | 密钥 | 硬编码|password|secret|api_key) ]]; then
            if [[ "$keywords" == *"密码"* ]] || [[ "$keywords" == *"密钥"* ]] || [[ "$keywords" == *"secret"* ]]; then
                matches+=("$line")
            fi
        fi
        if [[ "$line" =~ (子 shell|子进程|while.*find|管道) ]]; then
            if [[ "$keywords" == *"子 shell"* ]] || [[ "$keywords" == *"管道"* ]]; then
                matches+=("$line")
            fi
        fi
        if [[ "$line" =~ (数组 | 逗号|Bash 数组) ]]; then
            if [[ "$keywords" == *"数组"* ]] || [[ "$keywords" == *"Bash"* ]]; then
                matches+=("$line")
            fi
        fi
    done < "$ERROR_MEMORY"

    printf '%s\n' "${matches[@]}"
}

#-------------------------------------------------------------------------------
# 检查当前代码是否存在历史错误模式
#-------------------------------------------------------------------------------
check_historical_patterns() {
    local target="${1:-.}"
    local warnings=()

    # 模式 1: 检查子 shell 变量问题（find | while）
    if grep -r "find.*|.*while" --include="*.sh" "$target" 2>/dev/null | head -1; then
        warnings+=("⚠️  发现 find | while 模式 - 历史错误 001: 子 shell 变量不生效")
    fi

    # 模式 2: 检查 Bash 数组逗号问题
    if grep -r -E "=\s*\([^)]+,[^)]+\)" --include="*.sh" "$target" 2>/dev/null | head -1; then
        warnings+=("⚠️  发现数组逗号模式 - 历史错误 002: Bash 数组语法错误")
    fi

    # 模式 3: 检查硬编码密钥
    if grep -r -i -E "(password|secret|api_key)\s*=\s*['\"][a-zA-Z0-9]+['\"]" --include="*.sh" --include="*.js" --include="*.ts" "$target" 2>/dev/null | head -1; then
        warnings+=("⚠️  发现硬编码密钥模式 - 历史错误：密钥泄露风险")
    fi

    # 模式 4: 检查 eval 执行
    if grep -r -E "\beval\s+" --include="*.sh" "$target" 2>/dev/null | head -1; then
        warnings+=("⚠️  发现 eval 执行模式 - 历史错误：代码注入风险")
    fi

    printf '%s\n' "${warnings[@]}"
}

#-------------------------------------------------------------------------------
# 获取成功案例建议
#-------------------------------------------------------------------------------
get_success_tips() {
    local context="$1"

    echo "💡 成功案例建议："
    echo ""

    # 根据上下文推荐成功案例
    if [[ "$context" == *"Bash"* ]] || [[ "$context" == *"脚本"* ]]; then
        echo "  ✅ 案例 005: 文件体积检查 Git Hook - 正确的 Bash 数组写法"
        echo "     EXCLUDE_PATTERNS=('pattern1' 'pattern2')"
    fi

    if [[ "$context" == *"测试"* ]] || [[ "$context" == *"框架"* ]]; then
        echo "  ✅ 案例 006: 测试框架多轮重试机制 - 5 轮重试 + 2 秒等待"
    fi

    if [[ "$context" == *"CI"* ]] || [[ "$context" == *"构建"* ]]; then
        echo "  ✅ 案例 001: Rush.js 增量构建 CI - 只构建变更包"
    fi

    if [[ "$context" == *"Go"* ]]; then
        echo "  ✅ 案例 002: Go 多模块工作区测试 - go work 初始化"
    fi
}

#-------------------------------------------------------------------------------
# 生成记忆库回顾报告
#-------------------------------------------------------------------------------
generate_memory_review() {
    local target="${1:-.}"
    local report_file="${SCRIPT_DIR}/memory-review-$(date +%Y%m%d-%H%M%S).md"

    echo "# 记忆库回顾报告" > "$report_file"
    echo "" >> "$report_file"
    echo "**时间**: $(date '+%Y-%m-%d %H:%M:%S')" >> "$report_file"
    echo "**目标**: $target" >> "$report_file"
    echo "" >> "$report_file"

    # 历史错误统计
    local error_count=$(grep -c "^### 错误" "$ERROR_MEMORY" 2>/dev/null || echo "0")
    local success_count=$(grep -c "^### 案例" "$SUCCESS_MEMORY" 2>/dev/null || echo "0")

    echo "## 记忆库统计" >> "$report_file"
    echo "" >> "$report_file"
    echo "| 类型 | 数量 |" >> "$report_file"
    echo "|------|------|" >> "$report_file"
    echo "| 错误案例 | $error_count |" >> "$report_file"
    echo "| 成功案例 | $success_count |" >> "$report_file"
    echo "" >> "$report_file"

    # 当前代码风险检查
    echo "## ⚠️ 当前代码风险检查" >> "$report_file"
    echo "" >> "$report_file"

    local risks=$(check_historical_patterns "$target")
    if [ -n "$risks" ]; then
        echo "$risks" >> "$report_file"
    else
        echo "✅ 未发现历史错误模式" >> "$report_file"
    fi
    echo "" >> "$report_file"

    # 历史错误摘要
    echo "## 📋 历史错误摘要" >> "$report_file"
    echo "" >> "$report_file"

    grep "^### 错误" "$ERROR_MEMORY" 2>/dev/null | head -5 | while read -r line; do
        echo "- $line" >> "$report_file"
    done
    echo "" >> "$report_file"

    # 成功案例建议
    echo "## 💡 成功案例建议" >> "$report_file"
    echo "" >> "$report_file"

    grep "^### 案例" "$SUCCESS_MEMORY" 2>/dev/null | head -5 | while read -r line; do
        echo "- $line" >> "$report_file"
    done
    echo "" >> "$report_file"

    # 行动建议
    echo "## 🎯 行动建议" >> "$report_file"
    echo "" >> "$report_file"
    echo "1. 检查上方风险项，确保已避免" >> "$report_file"
    echo "2. 参考成功案例进行开发" >> "$report_file"
    echo "3. 运行测试框架验证" >> "$report_file"
    echo "" >> "$report_file"
    echo "---" >> "$report_file"
    echo "*杰克记忆库回顾 v1.0*" >> "$report_file"

    echo "$report_file"
}

#-------------------------------------------------------------------------------
# 运行记忆库回顾
#-------------------------------------------------------------------------------
run_memory_review() {
    local target="${1:-.}"

    echo "========================================"
    echo "  杰克记忆库自动回顾"
    echo "========================================"
    echo ""

    # 统计
    local error_count=$(grep -c "^### 错误" "$ERROR_MEMORY" 2>/dev/null || echo "0")
    local success_count=$(grep -c "^### 案例" "$SUCCESS_MEMORY" 2>/dev/null || echo "0")

    echo "📊 记忆库统计:"
    echo "   错误案例：$error_count 个"
    echo "   成功案例：$success_count 个"
    echo ""

    # 检查当前代码
    echo "🔍 检查当前代码风险..."
    local risks=$(check_historical_patterns "$target")

    if [ -n "$risks" ]; then
        echo ""
        echo "⚠️  发现潜在风险:"
        echo "$risks"
        echo ""
    else
        echo ""
        echo "✅ 未发现历史错误模式"
        echo ""
    fi

    # 显示错误摘要
    echo "📋 历史错误 Top 5:"
    grep "^### 错误" "$ERROR_MEMORY" 2>/dev/null | head -5 | while read -r line; do
        echo "   $line"
    done
    echo ""

    # 成功案例建议
    echo "💡 成功案例 Top 5:"
    grep "^### 案例" "$SUCCESS_MEMORY" 2>/dev/null | head -5 | while read -r line; do
        echo "   $line"
    done
    echo ""

    # 生成报告
    local report=$(generate_memory_review "$target")
    echo "📄 详细报告：$report"
    echo ""

    # 返回风险数量
    if [ -n "$risks" ]; then
        echo "$risks" | wc -l
    else
        echo "0"
    fi
}

#-------------------------------------------------------------------------------
# 运行测试前自动回顾
#-------------------------------------------------------------------------------
pre_test_review() {
    local target="${1:-.}"

    echo "========================================"
    echo "  测试前记忆库回顾"
    echo "========================================"
    echo ""

    local risk_count=$(run_memory_review "$target")

    if [ "$risk_count" -gt 0 ]; then
        echo ""
        echo "⚠️  发现 $risk_count 个潜在风险，请检查后继续！"
        echo ""
        read -p "是否继续运行测试？(y/N): " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            echo "已取消测试，请先修复风险。"
            exit 1
        fi
    else
        echo ""
        echo "✅ 无历史风险，可以安全测试！"
        echo ""
    fi
}

#-------------------------------------------------------------------------------
# 主函数
#-------------------------------------------------------------------------------
main() {
    if [ ! -f "$ERROR_MEMORY" ]; then
        echo "错误记忆库不存在，创建中..."
        mkdir -p "$MEMORY_DIR"
        touch "$ERROR_MEMORY"
        touch "$SUCCESS_MEMORY"
    fi

    if [ "$1" == "--pre-test" ]; then
        pre_test_review "${2:-.}"
    else
        run_memory_review "${1:-.}"
    fi
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
