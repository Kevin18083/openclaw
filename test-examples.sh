#!/bin/bash
#
# 测试框架使用示例
# 用法：./test-examples.sh
#

# 引入测试框架
source ./test-framework.sh

#-------------------------------------------------------------------------------
# 示例 1: 测试基础命令
#-------------------------------------------------------------------------------
test_basic_commands() {
    log_info "=== 测试基础命令 ==="

    run_test "测试 Node.js" "node --version"
    run_test "测试 Git" "git --version"
    run_test "测试 PowerShell" "powershell --version"
}

#-------------------------------------------------------------------------------
# 示例 2: 测试文件存在
#-------------------------------------------------------------------------------
test_file_existence() {
    log_info "=== 测试文件存在 ==="

    test_file_exists "CLAUDE.md" "$HOME/CLAUDE.md"
    test_file_exists "MEMORY.md" "$HOME/.claude/memory/MEMORY.md"
    test_file_exists "OpenClaw 配置" "$HOME/.openclaw/config.json"
}

#-------------------------------------------------------------------------------
# 示例 3: 测试目录存在
#-------------------------------------------------------------------------------
test_directory_existence() {
    log_info "=== 测试目录存在 ==="

    test_dir_exists ".claude 目录" "$HOME/.claude"
    test_dir_exists ".openclaw 目录" "$HOME/.openclaw"
    test_dir_exists "skills 目录" "./skills"
}

#-------------------------------------------------------------------------------
# 示例 4: 测试命令输出
#-------------------------------------------------------------------------------
test_command_output() {
    log_info "=== 测试命令输出 ==="

    test_command_output "Node 版本输出" "node --version" "v"
    test_command_output "Git 版本输出" "git --version" "git version"
    test_command_output "当前目录" "pwd" "workspace"
}

#-------------------------------------------------------------------------------
# 示例 5: 测试脚本
#-------------------------------------------------------------------------------
test_scripts() {
    log_info "=== 测试脚本 ==="

    # 测试备份脚本
    if [ -f "./auto-backup-all.ps1" ]; then
        run_test "备份脚本语法检查" "pwsh -Command \"Get-Content ./auto-backup-all.ps1\""
    fi

    # 测试安装脚本
    if [ -f "./install-daily-backup-task.ps1" ]; then
        run_test "安装脚本语法检查" "pwsh -Command \"Get-Content ./install-daily-backup-task.ps1\""
    fi
}

#-------------------------------------------------------------------------------
# 示例 6: 自定义测试
#-------------------------------------------------------------------------------
test_custom() {
    log_info "=== 自定义测试 ==="

    # 测试磁盘空间
    run_test "磁盘空间检查" "df -h / | tail -1"

    # 测试内存
    run_test "内存使用检查" "free -h | grep Mem"
}

#-------------------------------------------------------------------------------
# 主函数
#-------------------------------------------------------------------------------
main() {
    init

    # 选择要运行的测试
    echo "选择要运行的测试："
    echo "1) 基础命令测试"
    echo "2) 文件存在测试"
    echo "3) 目录存在测试"
    echo "4) 命令输出测试"
    echo "5) 脚本测试"
    echo "6) 自定义测试"
    echo "7) 运行所有测试"
    echo ""

    read -p "请输入选项 (1-7): " choice

    case $choice in
        1) test_basic_commands ;;
        2) test_file_existence ;;
        3) test_directory_existence ;;
        4) test_command_output ;;
        5) test_scripts ;;
        6) test_custom ;;
        7)
            test_basic_commands
            test_file_existence
            test_directory_existence
            test_command_output
            test_scripts
            test_custom
            ;;
        *) echo "无效选项" ;;
    esac

    generate_report
    cleanup

    if [ $FAILED_TESTS -gt 0 ]; then
        exit 1
    fi
}

# 运行
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
