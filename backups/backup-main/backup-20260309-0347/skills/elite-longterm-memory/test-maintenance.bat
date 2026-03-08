@echo off
echo 测试 Elite Longterm Memory 维护脚本
echo ======================================
echo.

echo 1. 先创建一些测试记忆文件...
echo.

REM 创建测试短期记忆（模拟旧的）
echo # 测试短期记忆1 > memory\short-term\test-old1.md
echo 创建时间: 2026-03-03 > memory\short-term\test-old1.md

echo # 测试短期记忆2 > memory\short-term\test-old2.md
echo 创建时间: 2026-03-02 > memory\short-term\test-old2.md

REM 创建测试中期记忆
echo # 测试中期记忆 > memory\medium-term\test-medium.md
echo 这是一个测试中期记忆文件 > memory\medium-term\test-medium.md

REM 创建测试长期记忆
echo # 测试长期记忆 > memory\long-term\test-longterm.md
echo 这是一个重要的长期记忆 > memory\long-term\test-longterm.md

echo ✓ 测试文件创建完成
echo.

echo 2. 运行维护脚本（模拟模式）...
echo.
powershell -ExecutionPolicy Bypass -File "memory-maintenance.ps1" -DryRun -Verbose
echo.

echo 3. 检查结果...
echo.
echo 当前文件统计:
dir memory\short-term /B
echo.
echo 按 Enter 键清理测试文件并退出...
pause >nul

REM 清理测试文件
del memory\short-term\test-*.md 2>nul
del memory\medium-term\test-*.md 2>nul
del memory\long-term\test-*.md 2>nul

echo.
echo 测试完成!