@echo off
echo ========================================
echo        OpenClaw PATH修复工具
echo ========================================
echo.

echo 1. 检查当前PATH...
echo %PATH% | find "npm" >nul
if %errorlevel% equ 0 (
    echo ✅ npm已在PATH中
) else (
    echo ❌ npm不在PATH中
)

echo.
echo 2. 检查OpenClaw命令...
where openclaw-cn >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ 找到openclaw-cn命令
) else (
    echo ❌ 未找到openclaw-cn命令
)

echo.
echo 3. 临时添加PATH...
set "NPM_PATH=%APPDATA%\npm"
echo 临时添加: %NPM_PATH%
set PATH=%NPM_PATH%;%PATH%

echo.
echo 4. 测试OpenClaw命令...
openclaw-cn --version >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ OpenClaw命令测试成功
    openclaw-cn --version
) else (
    echo ❌ OpenClaw命令测试失败
)

echo.
echo 5. 永久修复建议:
echo    手动将 %APPDATA%\npm 添加到系统PATH环境变量
echo.
echo ========================================
echo 按任意键退出...
pause >nul