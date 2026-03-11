#!/bin/bash
#===============================================================================
# 杰克测试框架 - 实装决策树 (Decision Tree)
# 版本：v2.0
# 用途：根据检查结果自动判断能否实装，带权重评分
#===============================================================================
# v2.0 更新:
# - 代码质量通过线：80 → 90 分
# - 单元测试通过线：80% → 90%
# - 构建检查：增加测试环节
#===============================================================================

set -e

# 引入主框架
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/test-framework-plus.sh"

#-------------------------------------------------------------------------------
# 配置 - 权重和通过线
#-------------------------------------------------------------------------------
declare -A WEIGHTS=(
    ["base_test"]=30      # 基础测试（必须 100%）
    ["security"]=30       # 安全检查（必须 0 问题）
    ["code_quality"]=15   # 代码质量
    ["unit_test"]=15      # 单元测试
    ["build"]=10          # 构建检查
)

declare -A THRESHOLDS=(
    ["base_test"]=100     # 基础测试必须 100% 通过
    ["security"]=0        # 安全必须 0 问题
    ["code_quality"]=90   # 代码质量≥90 分（提高标准）
    ["unit_test"]=90      # 单元测试≥90%（提高标准）
    ["build"]=100         # 构建必须成功
)

# 总分
TOTAL_SCORE=0
MAX_SCORE=100
PASSING_SCORE=80

# 关键项（必须通过）
CRITICAL_ITEMS=("base_test" "security")

#-------------------------------------------------------------------------------
# 评分记录
#-------------------------------------------------------------------------------
declare -A SCORES
declare -A DETAILS
declare -A STATUS

#-------------------------------------------------------------------------------
# 基础测试评分
#-------------------------------------------------------------------------------
score_base_test() {
    local target="${1:-.}"
    local passed=0
    local total=0

    # 环境检查
    total=$((total + 1))
    if node --version >/dev/null 2>&1; then
        passed=$((passed + 1))
    fi

    total=$((total + 1))
    if git --version >/dev/null 2>&1; then
        passed=$((passed + 1))
    fi

    # 语法检查
    total=$((total + 1))
    local syntax_errors=0
    for file in $(find "$target" -maxdepth 3 -name "*.sh" 2>/dev/null); do
        if ! bash -n "$file" 2>/dev/null; then
            syntax_errors=$((syntax_errors + 1))
        fi
    done
    if [ $syntax_errors -eq 0 ]; then
        passed=$((passed + 1))
    fi

    local rate=0
    if [ $total -gt 0 ]; then
        rate=$((passed * 100 / total))
    fi

    SCORES["base_test"]=$rate
    DETAILS["base_test"]="$passed/$total 通过"

    if [ $rate -ge ${THRESHOLDS["base_test"]} ]; then
        STATUS["base_test"]="✅"
        TOTAL_SCORE=$((TOTAL_SCORE + ${WEIGHTS["base_test"]}))
    else
        STATUS["base_test"]="❌"
    fi
}

#-------------------------------------------------------------------------------
# 安全检查评分
#-------------------------------------------------------------------------------
score_security() {
    local target="${1:-.}"
    local issues=0

    # 敏感文件
    local sensitive=$(find "$target" -maxdepth 3 \( -name ".env" -o -name "*.pem" -o -name "*.key" \) 2>/dev/null | grep -v "node_modules" | wc -l)
    issues=$((issues + sensitive))

    # SQL 注入风险
    local sql_risk=$(grep -r -E "(SELECT|INSERT|UPDATE|DELETE).*(\+|\\\$\{)" --include="*.js" --include="*.ts" "$target" 2>/dev/null | grep -v "node_modules" | wc -l)
    issues=$((issues + sql_risk))

    # eval 执行
    local eval_risk=$(grep -r -E "\b(eval|exec)\s*\(" --include="*.js" --include="*.ts" "$target" 2>/dev/null | grep -v "node_modules" | wc -l)
    issues=$((issues + eval_risk))

    # 硬编码密钥
    local secrets=$(grep -r -i -E "(password|secret|api_key)\s*=\s*['\"][a-zA-Z0-9]+['\"]" --exclude-dir=node_modules --include="*.js" --include="*.ts" --include="*.sh" "$target" 2>/dev/null | wc -l)
    issues=$((issues + secrets))

    SCORES["security"]=$((100 - issues * 10))
    if [ ${SCORES["security"]} -lt 0 ]; then
        SCORES["security"]=0
    fi

    DETAILS["security"]="$issues 个问题"

    if [ $issues -eq 0 ]; then
        STATUS["security"]="✅"
        TOTAL_SCORE=$((TOTAL_SCORE + ${WEIGHTS["security"]}))
    else
        STATUS["security"]="❌"
    fi
}

#-------------------------------------------------------------------------------
# 代码质量评分（v2.0 - 90 分标准）
#-------------------------------------------------------------------------------
score_code_quality() {
    local target="${1:-.}"
    local score=100

    # TODO/FIXME/HACK 标记（每个扣 3 分，提高扣分）
    local todos=$(grep -r -E "(TODO|FIXME|HACK)" --exclude-dir=node_modules --include="*.js" --include="*.ts" --include="*.go" "$target" 2>/dev/null | wc -l)
    score=$((score - todos * 3))

    # 调试语句（每个扣 8 分，提高扣分）
    local debugs=$(grep -r -E "(console\.log|debugger|print\s*\()" --exclude-dir=node_modules --include="*.js" --include="*.ts" --include="*.py" "$target" 2>/dev/null | wc -l)
    score=$((score - debugs * 8))

    # 大文件（>800 行就开始扣分，每个扣 10 分）
    local large_files=$(find "$target" -name "*.js" -o -name "*.ts" -o -name "*.go" -o -name "*.py" 2>/dev/null | xargs wc -l 2>/dev/null | awk '$1 > 800 {print}' | wc -l)
    score=$((score - large_files * 10))

    # 硬编码密钥/密码（每个扣 15 分，严重问题）
    local secrets=$(grep -r -i -E "(password|passwd|secret|api_key|apikey)\s*=\s*['\"][a-zA-Z0-9]+['\"]" --exclude-dir=node_modules --include="*.js" --include="*.ts" --include="*.py" --include="*.sh" "$target" 2>/dev/null | wc -l)
    score=$((score - secrets * 15))

    # 空 catch 块（每个扣 5 分）
    local empty_catches=$(grep -r -E "catch\s*\(\s*\)\s*\{\s*\}" --include="*.js" --include="*.ts" "$target" 2>/dev/null | wc -l)
    score=$((score - empty_catches * 5))

    # 嵌套循环（每个扣 5 分）
    local nested_loops=$(grep -r -B2 -A2 "for.*{.*for" --include="*.js" --include="*.ts" --include="*.go" "$target" 2>/dev/null | wc -l)
    score=$((score - nested_loops * 5))

    # 最低 0 分
    if [ $score -lt 0 ]; then
        score=0
    fi

    SCORES["code_quality"]=$score
    DETAILS["code_quality"]="得分 $score (TODO:$todos 调试:$debugs 大文件:$large_files)"

    if [ $score -ge ${THRESHOLDS["code_quality"]} ]; then
        STATUS["code_quality"]="✅"
        TOTAL_SCORE=$((TOTAL_SCORE + ${WEIGHTS["code_quality"]}))
    else
        STATUS["code_quality"]="⚠️"
    fi
}

#-------------------------------------------------------------------------------
# 单元测试评分（v2.0 - 90% 标准，含覆盖率检测）
#-------------------------------------------------------------------------------
score_unit_test() {
    local target="${1:-.}"
    local passed=0
    local total=0
    local coverage=0
    local has_coverage=false

    if [ -f "$target/package.json" ]; then
        # 检查是否有测试脚本
        if grep -q '"test"' "$target/package.json" 2>/dev/null; then
            total=$((total + 1))

            # 运行测试并捕获覆盖率
            local test_output
            if test_output=$(timeout 120 npm test --prefix "$target" -- --coverage 2>&1); then
                passed=$((passed + 1))

                # 尝试提取覆盖率（jest/vitest 格式）
                if echo "$test_output" | grep -q "All files"; then
                    coverage=$(echo "$test_output" | grep -A1 "All files" | tail -1 | awk '{print $1}' | sed 's/%//')
                    has_coverage=true
                fi

                # 或者检查覆盖率文件
                if [ -f "$target/coverage/coverage-final.json" ]; then
                    has_coverage=true
                fi
            elif test_output=$(timeout 120 npm test --prefix "$target" 2>&1); then
                # 不带覆盖率测试
                passed=$((passed + 1))
            fi
        fi

        # 检查是否有测试文件
        local test_files=$(find "$target" -maxdepth 5 \( -name "*.test.js" -o -name "*.test.ts" -o -name "*.spec.js" -o -name "*.spec.ts" -o -name "__tests__" -type d \) 2>/dev/null | wc -l)
        if [ $test_files -gt 0 ]; then
            total=$((total + 1))
            passed=$((passed + 1))  # 有测试文件
        fi

    elif [ -f "$target/go.mod" ]; then
        total=$((total + 1))

        # 运行 Go 测试并获取覆盖率
        if timeout 120 go test -cover "$target/..." >/dev/null 2>&1; then
            passed=$((passed + 1))

            # 获取覆盖率
            coverage=$(go test -cover "$target/..." 2>&1 | grep -oE "[0-9]+\.[0-9]+" | head -1)
            if [ -n "$coverage" ]; then
                has_coverage=true
            fi
        fi
    fi

    if [ $total -eq 0 ]; then
        SCORES["unit_test"]=0  # 无测试配置，给 0 分（要求必须有测试）
        DETAILS["unit_test"]="⚠️ 无测试配置（必须添加）"
        STATUS["unit_test"]="❌"
    else
        local rate=$((passed * 100 / total))

        # 如果有覆盖率，根据覆盖率调整分数
        if [ "$has_coverage" = true ] && [ -n "$coverage" ]; then
            local cov_int=${coverage%.*}
            if [ $cov_int -lt 90 ]; then
                # 覆盖率低于 90%，按比例扣分
                rate=$((rate * cov_int / 100))
            fi
            DETAILS["unit_test"]="$passed/$total 通过，覆盖率 ${coverage}%"
        else
            DETAILS["unit_test"]="$passed/$total 通过（无覆盖率数据）"
        fi

        SCORES["unit_test"]=$rate

        if [ $rate -ge ${THRESHOLDS["unit_test"]} ]; then
            STATUS["unit_test"]="✅"
            TOTAL_SCORE=$((TOTAL_SCORE + ${WEIGHTS["unit_test"]}))
        else
            STATUS["unit_test"]="❌"
        fi
    fi
}

#-------------------------------------------------------------------------------
# 构建检查评分（v2.0 - 增加测试环节）
#-------------------------------------------------------------------------------
score_build() {
    local target="${1:-.}"
    local success=0
    local total=0
    local test_passed=0

    if [ -f "$target/package.json" ]; then
        # 检查是否有构建脚本
        if grep -q '"build"' "$target/package.json" 2>/dev/null; then
            total=$((total + 1))

            # 步骤 1: 运行构建
            if timeout 180 npm run build --prefix "$target" >/dev/null 2>&1; then
                success=$((success + 1))

                # 步骤 2: 构建后测试（检查构建产物）
                # 检查 dist/build 目录是否存在
                if [ -d "$target/dist" ] || [ -d "$target/build" ] || [ -d "$target/lib" ]; then
                    total=$((total + 1))
                    success=$((success + 1))

                    # 步骤 3: 运行构建后测试（如果有）
                    if grep -q '"test:build"' "$target/package.json" 2>/dev/null || \
                       grep -q '"test:dist"' "$target/package.json" 2>/dev/null; then
                        total=$((total + 1))
                        if timeout 60 npm run test:build --prefix "$target" >/dev/null 2>&1; then
                            success=$((success + 1))
                            test_passed=1
                        fi
                    else
                        # 没有专门的构建后测试，运行普通测试验证
                        total=$((total + 1))
                        if timeout 60 npm test --prefix "$target" >/dev/null 2>&1; then
                            success=$((success + 1))
                            test_passed=1
                        fi
                    fi
                fi
            fi
        fi

    elif [ -f "$target/go.mod" ]; then
        total=$((total + 1))

        # 步骤 1: 运行构建
        if timeout 120 go build "$target/..." >/dev/null 2>&1; then
            success=$((success + 1))

            # 步骤 2: 构建后测试
            total=$((total + 1))
            if timeout 60 go test "$target/..." >/dev/null 2>&1; then
                success=$((success + 1))
                test_passed=1
            fi
        fi
    fi

    if [ $total -eq 0 ]; then
        SCORES["build"]=100  # 无构建配置，不扣分
        DETAILS["build"]="无构建配置"
        STATUS["build"]="⚠️"
        TOTAL_SCORE=$((TOTAL_SCORE + ${WEIGHTS["build"]}))
    else
        local rate=$((success * 100 / total))
        SCORES["build"]=$rate

        if [ $test_passed -eq 1 ]; then
            DETAILS["build"]="$success/$total 成功 (测试通过 ✅)"
        else
            DETAILS["build"]="$success/$total 成功 (测试未运行)"
        fi

        if [ $rate -ge ${THRESHOLDS["build"]} ]; then
            STATUS["build"]="✅"
            TOTAL_SCORE=$((TOTAL_SCORE + ${WEIGHTS["build"]}))
        else
            STATUS["build"]="❌"
        fi
    fi
}

#-------------------------------------------------------------------------------
# 检查关键项
#-------------------------------------------------------------------------------
check_critical() {
    local critical_failed=0

    for item in "${CRITICAL_ITEMS[@]}"; do
        if [ "${STATUS[$item]}" == "❌" ]; then
            critical_failed=$((critical_failed + 1))
        fi
    done

    return $critical_failed
}

#-------------------------------------------------------------------------------
# 生成决策报告
#-------------------------------------------------------------------------------
generate_decision_report() {
    local report_file="${LOG_DIR}/decision-tree-$(date +%Y%m%d-%H%M%S).md"

    cat > "$report_file" << EOF
# 实装决策报告

**时间**: $(date '+%Y-%m-%d %H:%M:%S')
**目标**: ${1:-.}

## 评分详情

| 检查项 | 权重 | 得分 | 状态 | 详情 |
|--------|------|------|------|------|
| 基础测试 | ${WEIGHTS["base_test"]}% | ${SCORES["base_test"]}% | ${STATUS["base_test"]} | ${DETAILS["base_test"]} |
| 安全检查 | ${WEIGHTS["security"]}% | ${SCORES["security"]}% | ${STATUS["security"]} | ${DETAILS["security"]} |
| 代码质量 | ${WEIGHTS["code_quality"]}% | ${SCORES["code_quality"]}% | ${STATUS["code_quality"]} | ${DETAILS["code_quality"]} |
| 单元测试 | ${WEIGHTS["unit_test"]}% | ${SCORES["unit_test"]}% | ${STATUS["unit_test"]} | ${DETAILS["unit_test"]} |
| 构建检查 | ${WEIGHTS["build"]}% | ${SCORES["build"]}% | ${STATUS["build"]} | ${DETAILS["build"]} |

## 总分

**$TOTAL_SCORE / $MAX_SCORE 分**

## 决策结果

EOF

    # 判断能否实装
    local can_deploy=0
    check_critical
    if [ $? -eq 0 ] && [ $TOTAL_SCORE -ge $PASSING_SCORE ]; then
        can_deploy=1
    fi

    if [ $can_deploy -eq 1 ]; then
        cat >> "$report_file" << EOF
### ✅ 可以实装

- 关键项全部通过
- 总分 ≥ $PASSING_SCORE 分

**建议**: 可以执行部署操作

EOF
    else
        cat >> "$report_file" << EOF
### ❌ 禁止实装

EOF
        if [ $? -gt 0 ]; then
            echo "- 关键项未通过（基础测试或安全检查失败）" >> "$report_file"
        fi
        if [ $TOTAL_SCORE -lt $PASSING_SCORE ]; then
            echo "- 总分未达到 $PASSING_SCORE 分要求" >> "$report_file"
        fi
        echo "" >> "$report_file"
        echo "**建议**: 修复问题后重新检查" >> "$report_file"
    fi

    cat >> "$report_file" << EOF

---
*杰克实装决策树 v1.0*
EOF

    echo "决策报告：$report_file"
}

#-------------------------------------------------------------------------------
# 运行决策树检查
#-------------------------------------------------------------------------------
run_decision_tree() {
    local target="${1:-.}"

    echo "========================================"
    echo "  杰克实装决策树 v1.0"
    echo "========================================"
    echo ""

    echo "[1/5] 评分基础测试..."
    score_base_test "$target"
    echo "      ${STATUS["base_test"]} ${DETAILS["base_test"]}"

    echo "[2/5] 评分安全检查..."
    score_security "$target"
    echo "      ${STATUS["security"]} ${DETAILS["security"]}"

    echo "[3/5] 评分代码质量..."
    score_code_quality "$target"
    echo "      ${STATUS["code_quality"]} ${DETAILS["code_quality"]}"

    echo "[4/5] 评分单元测试..."
    score_unit_test "$target"
    echo "      ${STATUS["unit_test"]} ${DETAILS["unit_test"]}"

    echo "[5/5] 评分构建检查..."
    score_build "$target"
    echo "      ${STATUS["build"]} ${DETAILS["build"]}"

    echo ""
    echo "========================================"
    echo "  总分：$TOTAL_SCORE / $MAX_SCORE"
    echo "========================================"

    # 生成报告
    generate_decision_report "$target"

    # 判断结果
    if check_critical && [ $TOTAL_SCORE -ge $PASSING_SCORE ]; then
        echo ""
        echo "  ✅ 可以实装！"
        echo ""
        return 0
    else
        echo ""
        echo "  ❌ 禁止实装！"
        echo ""
        return 1
    fi
}

#-------------------------------------------------------------------------------
# 主函数
#-------------------------------------------------------------------------------
main() {
    init
    run_decision_tree "${1:-.}"
    exit $?
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
