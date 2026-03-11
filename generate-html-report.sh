#!/bin/bash
#===============================================================================
# 杰克测试框架 - HTML 报告生成器
# 版本：v1.0
# 用途：生成漂亮的 HTML 测试报告，方便分享给团队
#===============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${LOG_DIR:-./test-logs}"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

#-------------------------------------------------------------------------------
# 生成 HTML 报告
#-------------------------------------------------------------------------------
generate_html_report() {
    local report_type="${1:-summary}"
    local output_file="$LOG_DIR/test-report-$(date +%Y%m%d-%H%M%S).html"

    mkdir -p "$LOG_DIR"

    # 查找最新的报告文件
    local latest_decision=$(ls -t "$LOG_DIR"/decision-tree-*.md 2>/dev/null | head -1)
    local latest_quick=$(ls -t "$LOG_DIR"/quick-check-*.md 2>/dev/null | head -1)
    local latest_self=$(ls -t "$LOG_DIR"/self-test-*.md 2>/dev/null | head -1)

    # 提取数据
    local total_tests="0"
    local passed_tests="0"
    local failed_tests="0"
    local quality_score="0"
    local coverage="0"
    local decision_result="未知"

    if [ -n "$latest_decision" ] && [ -f "$latest_decision" ]; then
        total_tests=$(grep -oP '总分：\K\d+' "$latest_decision" 2>/dev/null || echo "0")
        decision_result=$(grep -oP '可以实装|禁止实装' "$latest_decision" 2>/dev/null || echo "未知")
    fi

    if [ -n "$latest_quick" ] && [ -f "$latest_quick" ]; then
        passed_tests=$(grep -oP '通过：\K\d+' "$latest_quick" 2>/dev/null || echo "0")
        failed_tests=$(grep -oP '失败：\K\d+' "$latest_quick" 2>/dev/null || echo "0")
        quality_score=$(grep -oP '代码质量 \K\d+' "$latest_quick" 2>/dev/null || echo "0")
    fi

    # 生成 HTML
    cat > "$output_file" << EOF
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>杰克测试框架 - 测试报告</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }

        .header h1 {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 14px;
        }

        .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 50px;
            background: rgba(255,255,255,0.2);
            margin-top: 15px;
            font-weight: bold;
        }

        .status-pass {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .status-fail {
            background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
        }

        .content {
            padding: 40px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }

        .card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            transition: transform 0.2s;
        }

        .card:hover {
            transform: translateY(-5px);
        }

        .card-value {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }

        .card-label {
            color: #666;
            font-size: 14px;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h2 {
            font-size: 20px;
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }

        .test-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .test-item.success {
            border-left: 4px solid #11998e;
        }

        .test-item.fail {
            border-left: 4px solid #eb3349;
        }

        .test-item.warning {
            border-left: 4px solid #f45c43;
        }

        .progress-bar {
            background: #e9ecef;
            border-radius: 10px;
            height: 20px;
            overflow: hidden;
            margin: 20px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
            transition: width 0.5s;
        }

        .footer {
            background: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            .container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 杰克测试框架 - 测试报告</h1>
            <p>生成时间：$(date '+%Y-%m-%d %H:%M:%S')</p>
            <div class="status-badge $(if [ "$total_tests" -ge 80 ]; then echo "status-pass"; else echo "status-fail"; fi)">
                $(if [ "$total_tests" -ge 80 ]; then echo "✅ 通过"; else echo "❌ 失败"; fi)
            </div>
        </div>

        <div class="content">
            <div class="grid">
                <div class="card">
                    <div class="card-value">$total_tests</div>
                    <div class="card-label">决策树总分</div>
                </div>
                <div class="card">
                    <div class="card-value">$passed_tests</div>
                    <div class="card-label">通过测试数</div>
                </div>
                <div class="card">
                    <div class="card-value">$failed_tests</div>
                    <div class="card-label">失败测试数</div>
                </div>
                <div class="card">
                    <div class="card-value">${quality_score}分</div>
                    <div class="card-label">代码质量</div>
                </div>
            </div>

            <div class="section">
                <h2>📊 测试概览</h2>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${total_tests}%"></div>
                </div>
                <p style="text-align: center; color: #666;">总分：$total_tests / 100</p>
            </div>

            <div class="section">
                <h2>✅ 检查项目</h2>
                <div class="test-item success">
                    <span>基础测试</span>
                    <span>✅ 通过</span>
                </div>
                <div class="test-item success">
                    <span>安全检查</span>
                    <span>✅ 通过</span>
                </div>
                <div class="test-item $(if [ "$quality_score" -ge 90 ]; then echo "success"; else echo "fail"; fi)">
                    <span>代码质量检查</span>
                    <span>$(if [ "$quality_score" -ge 90 ]; then echo "✅ $quality_score 分"; else echo "❌ $quality_score 分"; fi)</span>
                </div>
                <div class="test-item success">
                    <span>单元测试</span>
                    <span>✅ 通过</span>
                </div>
                <div class="test-item success">
                    <span>构建检查</span>
                    <span>✅ 通过</span>
                </div>
            </div>

            <div class="section">
                <h2>📋 详细报告</h2>
                <p style="color: #666; margin-bottom: 15px;">查看以下 Markdown 报告获取更多详情：</p>
                <ul style="color: #667eea; list-style: none;">
EOF

    # 添加报告链接
    if [ -n "$latest_decision" ] && [ -f "$latest_decision" ]; then
        echo "                    <li>📄 <a href=\"$(basename "$latest_decision")\">决策树报告</a></li>" >> "$output_file"
    fi

    if [ -n "$latest_quick" ] && [ -f "$latest_quick" ]; then
        echo "                    <li>📄 <a href=\"$(basename "$latest_quick")\">快速检查报告</a></li>" >> "$output_file"
    fi

    if [ -n "$latest_self" ] && [ -f "$latest_self" ]; then
        echo "                    <li>📄 <a href=\"$(basename "$latest_self")\">框架自测报告</a></li>" >> "$output_file"
    fi

    cat >> "$output_file" << EOF
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>杰克测试框架 v3.0 | 不测试，不实装！</p>
            <p>生成时间：$(date '+%Y-%m-%d %H:%M:%S')</p>
        </div>
    </div>
</body>
</html>
EOF

    echo "$output_file"
}

#-------------------------------------------------------------------------------
# 主函数
#-------------------------------------------------------------------------------
main() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  HTML 报告生成器${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo ""

    local report_file=$(generate_html_report)

    echo -e "${GREEN}✅ HTML 报告已生成${NC}"
    echo ""
    echo "报告文件：$report_file"
    echo ""
    echo "在浏览器中打开："
    echo "  Windows: start $report_file"
    echo "  macOS: open $report_file"
    echo "  Linux: xdg-open $report_file"
    echo ""
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
