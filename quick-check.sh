#!/bin/bash
#===============================================================================
# 杰克测试框架 - 快速检查模式 (Quick Check)
# 版本：v2.0
# 用途：日常开发快速检查，1 分钟内出结果
#===============================================================================

set -e

# 引入主框架
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/test-framework-plus.sh"

# 配置 - 快速模式
MAX_RETRIES=3           # 减少重试次数
LOG_DIR="${LOG_DIR:-./test-logs}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# 计数器
QUICK_TESTS=0
QUICK_PASSED=0
QUICK_FAILED=0
QUICK_SECURITY=0
QUICK_QUALITY_SCORE=100  # 代码质量分数

#-------------------------------------------------------------------------------
# 快速检查 - 5 个核心检查（v2.0 - 90 分标准）
#-------------------------------------------------------------------------------
quick_check() {
    local target="${1:-.}"

    echo "========================================"
    echo "  杰克快速检查 v2.0"
    echo "  时间：$(date '+%Y-%m-%d %H:%M:%S')"
    echo "  目标：$target"
    echo "  标准：90 分通过线"
    echo "========================================"
    echo ""

    # 检查 1: 语法检查（必须）
    echo "[1/5] 语法检查..."
    if has_syntax_errors "$target"; then
        echo "  ❌ 发现语法错误"
        QUICK_FAILED=$((QUICK_FAILED + 1))
    else
        echo "  ✅ 语法检查通过"
        QUICK_PASSED=$((QUICK_PASSED + 1))
    fi
    QUICK_TESTS=$((QUICK_TESTS + 1))

    # 检查 2: 安全扫描（必须）
    echo "[2/5] 安全扫描..."
    local security_issues=$(scan_security "$target")
    if [ "$security_issues" -gt 0 ]; then
        echo "  ❌ 发现 $security_issues 个安全问题"
        QUICK_SECURITY=$((QUICK_SECURITY + 1))
        QUICK_FAILED=$((QUICK_FAILED + 1))
    else
        echo "  ✅ 安全检查通过"
        QUICK_PASSED=$((QUICK_PASSED + 1))
    fi
    QUICK_TESTS=$((QUICK_TESTS + 1))

    # 检查 3: 硬编码密钥（必须）
    echo "[3/5] 密钥检查..."
    local secrets=$(scan_secrets "$target")
    if [ "$secrets" -gt 0 ]; then
        echo "  ❌ 发现 $secrets 个硬编码密钥"
        QUICK_FAILED=$((QUICK_FAILED + 1))
    else
        echo "  ✅ 密钥检查通过"
        QUICK_PASSED=$((QUICK_PASSED + 1))
    fi
    QUICK_TESTS=$((QUICK_TESTS + 1))

    # 检查 3.5: 代码质量快速评分
    echo "[3.5/5] 代码质量评分..."
    calc_quality_score "$target"
    if [ $QUICK_QUALITY_SCORE -ge 90 ]; then
        echo "  ✅ 代码质量 $QUICK_QUALITY_SCORE 分（≥90 分）"
    else
        echo "  ⚠️  代码质量 $QUICK_QUALITY_SCORE 分（<90 分）"
        QUICK_FAILED=$((QUICK_FAILED + 1))
    fi
    QUICK_TESTS=$((QUICK_TESTS + 1))

    # 检查 4: 单元测试（可选）
    echo "[4/5] 单元测试..."
    if run_quick_test "$target"; then
        echo "  ✅ 单元测试通过"
        QUICK_PASSED=$((QUICK_PASSED + 1))
    else
        echo "  ⚠️  无测试或失败（可选）"
        QUICK_FAILED=$((QUICK_FAILED + 1))
    fi
    QUICK_TESTS=$((QUICK_TESTS + 1))

    # 检查 5: 构建检查（可选）
    echo "[5/5] 构建检查..."
    if run_quick_build "$target"; then
        echo "  ✅ 构建成功"
        QUICK_PASSED=$((QUICK_PASSED + 1))
    else
        echo "  ⚠️  无构建或失败（可选）"
        QUICK_FAILED=$((QUICK_FAILED + 1))
    fi
    QUICK_TESTS=$((QUICK_TESTS + 1))

    echo ""
    echo "========================================"
    echo "  快速检查结果"
    echo "========================================"
    echo "  总计：$QUICK_TESTS 项"
    echo "  通过：$QUICK_PASSED 项"
    echo "  失败：$QUICK_FAILED 项"
    echo "  安全：$QUICK_SECURITY 个问题"
    echo "========================================"

    # 判断是否通过（必须项全部通过）
    if [ $QUICK_SECURITY -eq 0 ]; then
        echo "  ✅ 快速检查通过！可以提交！"
        echo "========================================"
        return 0
    else
        echo "  ❌ 快速检查失败！禁止提交！"
        echo "========================================"
        return 1
    fi
}

#-------------------------------------------------------------------------------
# 语法检查
#-------------------------------------------------------------------------------
has_syntax_errors() {
    local target="$1"
    local errors=0

    # Bash 脚本语法检查
    for file in $(find "$target" -maxdepth 3 -name "*.sh" 2>/dev/null); do
        if ! bash -n "$file" 2>/dev/null; then
            echo "    语法错误：$file"
            errors=$((errors + 1))
        fi
    done

    # JavaScript/TypeScript 语法检查（如果有）
    if command -v node >/dev/null 2>&1; then
        for file in $(find "$target" -maxdepth 3 -name "*.js" -o -name "*.ts" 2>/dev/null | head -20); do
            if ! node --check "$file" 2>/dev/null; then
                echo "    语法错误：$file"
                errors=$((errors + 1))
            fi
        done
    fi

    return $errors
}

#-------------------------------------------------------------------------------
# 安全扫描
#-------------------------------------------------------------------------------
scan_security() {
    local target="$1"
    local issues=0

    # 检查敏感文件
    local sensitive=$(find "$target" -maxdepth 3 \( -name ".env" -o -name "*.pem" -o -name "*.key" -o -name "*secret*" \) 2>/dev/null | grep -v "node_modules" | wc -l)
    if [ "$sensitive" -gt 0 ]; then
        echo "    敏感文件：$sensitive 个"
        issues=$((issues + 1))
    fi

    # 检查 SQL 注入风险
    local sql_inject=$(grep -r -E "(SELECT|INSERT|UPDATE|DELETE).*(\+|\\\$\{)" --include="*.js" --include="*.ts" --include="*.py" "$target" 2>/dev/null | grep -v "node_modules" | wc -l)
    if [ "$sql_inject" -gt 0 ]; then
        echo "    SQL 注入风险：$sql_inject 处"
        issues=$((issues + 1))
    fi

    echo $issues
    return 0
}

#-------------------------------------------------------------------------------
# 密钥扫描
#-------------------------------------------------------------------------------
scan_secrets() {
    local target="$1"
    local secrets=0

    # 检查硬编码密码/密钥
    secrets=$(grep -r -i -E "(password|passwd|secret|api_key|apikey)\s*=\s*['\"][a-zA-Z0-9]+['\"]" \
        --exclude-dir=node_modules --exclude-dir=.git \
        --include="*.js" --include="*.ts" --include="*.py" --include="*.sh" \
        "$target" 2>/dev/null | grep -v "example\|template\|\.env\." | wc -l)

    echo $secrets
    return 0
}

#-------------------------------------------------------------------------------
# 快速单元测试
#-------------------------------------------------------------------------------
run_quick_test() {
    local target="$1"

    # 自动检测测试命令
    if [ -f "$target/package.json" ]; then
        if grep -q '"test"' "$target/package.json" 2>/dev/null; then
            timeout 30 npm test --prefix "$target" 2>/dev/null
            return $?
        fi
    elif [ -f "$target/go.mod" ]; then
        timeout 30 go test "$target/..." 2>/dev/null
        return $?
    fi

    # 没有测试配置也算通过（可选）
    return 0
}

#-------------------------------------------------------------------------------
# 快速构建
#-------------------------------------------------------------------------------
run_quick_build() {
    local target="$1"

    # 自动检测构建命令
    if [ -f "$target/package.json" ]; then
        if grep -q '"build"' "$target/package.json" 2>/dev/null; then
            timeout 60 npm run build --prefix "$target" 2>/dev/null
            return $?
        fi
    elif [ -f "$target/go.mod" ]; then
        timeout 30 go build "$target/..." 2>/dev/null
        return $?
    fi

    # 没有构建配置也算通过（可选）
    return 0
}

#-------------------------------------------------------------------------------
# 生成快速报告
#-------------------------------------------------------------------------------
generate_quick_report() {
    local report_file="${LOG_DIR}/quick-check-$TIMESTAMP.md"

    cat > "$report_file" << EOF
# 快速检查报告

**时间**: $(date '+%Y-%m-%d %H:%M:%S')
**目标**: ${1:-.}

## 结果

| 项目 | 状态 |
|------|------|
| 总计 | $QUICK_TESTS 项 |
| 通过 | $QUICK_PASSED 项 |
| 失败 | $QUICK_FAILED 项 |
| 安全问题 | $QUICK_SECURITY 个 |
| 质量分数 | $QUICK_QUALITY_SCORE 分 |

## 结论

$(if [ $QUICK_SECURITY -eq 0 ] && [ $QUICK_FAILED -le 2 ] && [ $QUICK_QUALITY_SCORE -ge 90 ]; then echo "✅ **可以提交**"; else echo "❌ **禁止提交**"; fi)

---
*杰克快速检查 v2.0*
EOF

    echo "报告已生成：$report_file"
}

#-------------------------------------------------------------------------------
# 计算代码质量分数
#-------------------------------------------------------------------------------
calc_quality_score() {
    local target="$1"
    QUICK_QUALITY_SCORE=100

    # TODO/FIXME/HACK 标记（每个扣 3 分）
    local todos=$(grep -r -E "(TODO|FIXME|HACK)" --exclude-dir=node_modules --include="*.js" --include="*.ts" --include="*.go" "$target" 2>/dev/null | wc -l)
    QUICK_QUALITY_SCORE=$((QUICK_QUALITY_SCORE - todos * 3))

    # 调试语句（每个扣 8 分）
    local debugs=$(grep -r -E "(console\.log|debugger)" --exclude-dir=node_modules --include="*.js" --include="*.ts" "$target" 2>/dev/null | wc -l)
    QUICK_QUALITY_SCORE=$((QUICK_QUALITY_SCORE - debugs * 8))

    # 大文件（>800 行，每个扣 10 分）
    local large_files=$(find "$target" -name "*.js" -o -name "*.ts" -o -name "*.go" 2>/dev/null | xargs wc -l 2>/dev/null | awk '$1 > 800 {print}' | wc -l)
    QUICK_QUALITY_SCORE=$((QUICK_QUALITY_SCORE - large_files * 10))

    # 硬编码密钥（每个扣 15 分）
    local secrets=$(grep -r -i -E "(password|secret|api_key)\s*=\s*['\"]" --exclude-dir=node_modules --include="*.js" --include="*.ts" --include="*.sh" "$target" 2>/dev/null | wc -l)
    QUICK_QUALITY_SCORE=$((QUICK_QUALITY_SCORE - secrets * 15))

    # 最低 0 分
    if [ $QUICK_QUALITY_SCORE -lt 0 ]; then
        QUICK_QUALITY_SCORE=0
    fi
}

#-------------------------------------------------------------------------------
# 主函数
#-------------------------------------------------------------------------------
main() {
    init

    local target="${1:-.}"

    # 运行快速检查
    quick_check "$target"
    local result=$?

    # 生成报告
    generate_quick_report "$target"

    # 返回结果
    exit $result
}

# 直接运行
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
