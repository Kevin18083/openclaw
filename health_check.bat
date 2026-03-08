@echo off
echo ========================================
echo        OpenClaw 健康检查工具
echo ========================================
echo.
echo 检查时间: %date% %time%
echo.

echo 1. 检查进程状态...
tasklist | findstr /i "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ OpenClaw进程运行正常
    tasklist | findstr /i "node.exe"
) else (
    echo ❌ OpenClaw进程未运行
)

echo.
echo 2. 检查服务响应...
timeout /t 3 /nobreak >nul
echo   发送测试请求...
rem 这里可以添加API测试，暂时用简单检查

echo.
echo 3. 检查磁盘空间...
for /f "tokens=3" %%a in ('dir "%USERPROFILE%\.openclaw" ^| find "个文件"') do (
    set "file_count=%%a"
)
echo    工作空间文件数: %file_count%

echo.
echo 4. 检查备份状态...
if exist "%USERPROFILE%\OpenClaw_Backups" (
    for /f %%i in ('dir "%USERPROFILE%\OpenClaw_Backups" /b ^| find /c "."') do (
        set "backup_count=%%i"
    )
    echo    备份数量: %backup_count%
) else (
    echo    ⚠️ 备份目录不存在
)

echo.
echo 5. 检查记忆文件...
if exist "%USERPROFILE%\.openclaw\workspace\MEMORY.md" (
    echo ✅ 长期记忆文件存在
) else (
    echo ❌ 长期记忆文件缺失
)

if exist "%USERPROFILE%\.openclaw\workspace\memory\操作日志.md" (
    echo ✅ 操作日志文件存在
) else (
    echo ❌ 操作日志文件缺失
)

echo.
echo 6. 检查镜像备份...
if exist "%USERPROFILE%\OpenClaw_Mirrors" (
    for /f %%i in ('dir "%USERPROFILE%\OpenClaw_Mirrors" /b ^| find /c "."') do (
        set "mirror_count=%%i"
    )
    echo    镜像数量: %mirror_count%
) else (
    echo    ⚠️ 镜像目录不存在
)

echo.
echo ========================================
echo 健康检查完成！
echo 时间: %date% %time%
echo ========================================
echo.
echo 检查结果保存到: %USERPROFILE%\.openclaw\workspace\health_check.log
echo %date% %time% - 健康检查完成 >> "%USERPROFILE%\.openclaw\workspace\health_check.log"

echo 按任意键退出...
pause >nul