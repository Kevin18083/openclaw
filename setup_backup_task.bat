@echo off
echo ========================================
echo    OpenClaw自动备份任务计划配置
echo ========================================
echo.
echo 此脚本将创建Windows任务计划，每天自动备份OpenClaw数据。
echo.
echo 注意：需要管理员权限运行！
echo.

echo 1. 检查管理员权限...
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 请以管理员身份运行此脚本！
    echo    右键点击 -> 以管理员身份运行
    pause
    exit /b 1
)
echo ✅ 管理员权限确认

echo.
echo 2. 创建任务计划...
echo   任务名称: OpenClaw_Auto_Backup
echo   触发器: 每天 02:00
echo   操作: 运行 auto_backup.bat
echo.

schtasks /create /tn "OpenClaw_Auto_Backup" ^
    /tr "\"%~dp0auto_backup.bat\"" ^
    /sc daily /st 02:00 ^
    /ru "%USERNAME%" ^
    /rl highest ^
    /f

if %errorlevel% equ 0 (
    echo ✅ 任务计划创建成功！
) else (
    echo ❌ 任务计划创建失败
    echo    可能需要手动创建
)

echo.
echo 3. 验证任务计划...
schtasks /query /tn "OpenClaw_Auto_Backup" /fo list | findstr "任务名"
if %errorlevel% equ 0 (
    echo ✅ 任务计划验证成功
) else (
    echo ❌ 任务计划验证失败
)

echo.
echo 4. 手动运行测试...
echo   是否现在运行一次备份测试？(Y/N)
set /p test_run=请输入: 
if /i "%test_run%"=="Y" (
    echo 正在运行备份测试...
    call "%~dp0auto_backup.bat"
)

echo.
echo ========================================
echo 配置完成！
echo.
echo 任务计划信息:
echo   名称: OpenClaw_Auto_Backup
echo   时间: 每天 02:00
echo   备份位置: %%USERPROFILE%%\OpenClaw_Backups
echo.
echo 管理命令:
echo   查看任务: schtasks /query /tn "OpenClaw_Auto_Backup"
echo   运行任务: schtasks /run /tn "OpenClaw_Auto_Backup"
echo   删除任务: schtasks /delete /tn "OpenClaw_Auto_Backup" /f
echo ========================================
echo.
echo 按任意键退出...
pause >nul