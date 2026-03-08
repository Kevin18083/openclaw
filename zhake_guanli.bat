@echo off
chcp 65001 >nul
title 扎克管理面板 v1.0

:menu
cls
echo ========================================
echo           扎克管理面板 v1.0
echo ========================================
echo.
echo 当前时间: %date% %time%
echo 用户: %USERNAME%
echo.
echo 请选择操作:
echo.
echo [1] 系统状态检查
echo [2] 快速备份数据
echo [3] 健康检查
echo [4] 管理OpenClaw服务
echo [5] 查看操作日志
echo [6] 修复PATH配置
echo [7] 设置自动备份
echo [8] 清理临时文件
echo [9] 退出
echo.
set /p choice=请输入选择 (1-9): 

if "%choice%"=="1" goto status
if "%choice%"=="2" goto backup
if "%choice%"=="3" goto health
if "%choice%"=="4" goto manage
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto fixpath
if "%choice%"=="7" goto autobackup
if "%choice%"=="8" goto cleanup
if "%choice%"=="9" goto exit

goto menu

:status
cls
echo ========================================
echo           系统状态检查
echo ========================================
echo.
echo 1. 检查进程...
tasklist | findstr /i "node.exe"
echo.
echo 2. 检查磁盘...
dir "%USERPROFILE%\.openclaw" | find "个文件"
echo.
echo 3. 检查备份...
if exist "%USERPROFILE%\OpenClaw_Backups" (
    dir "%USERPROFILE%\OpenClaw_Backups" /b
) else (
    echo 备份目录不存在
)
echo.
echo 4. 检查镜像...
if exist "%USERPROFILE%\OpenClaw_Mirrors" (
    dir "%USERPROFILE%\OpenClaw_Mirrors" /b
) else (
    echo 镜像目录不存在
)
echo.
pause
goto menu

:backup
cls
echo ========================================
echo           快速备份数据
echo ========================================
echo.
echo 正在执行快速备份...
call "%~dp0quick_backup.bat"
echo.
pause
goto menu

:health
cls
echo ========================================
echo           健康检查
echo ========================================
echo.
call "%~dp0health_check.bat"
echo.
pause
goto menu

:manage
cls
echo ========================================
echo           管理OpenClaw服务
echo ========================================
echo.
call "%~dp0manage_openclaw.bat"
echo.
pause
goto menu

:logs
cls
echo ========================================
echo           查看操作日志
echo ========================================
echo.
if exist "%USERPROFILE%\.openclaw\workspace\memory\操作日志.md" (
    type "%USERPROFILE%\.openclaw\workspace\memory\操作日志.md" | more
) else (
    echo 操作日志文件不存在
)
echo.
pause
goto menu

:fixpath
cls
echo ========================================
echo           修复PATH配置
echo ========================================
echo.
call "%~dp0fix_openclaw_path.bat"
echo.
pause
goto menu

:autobackup
cls
echo ========================================
echo           设置自动备份
echo ========================================
echo.
echo 注意：需要管理员权限！
echo.
echo 是否创建每天自动备份任务？(Y/N)
set /p confirm=请输入: 
if /i "%confirm%"=="Y" (
    call "%~dp0setup_backup_task.bat"
)
echo.
pause
goto menu

:cleanup
cls
echo ========================================
echo           清理临时文件
echo ========================================
echo.
echo 正在清理测试文件...
del "%~dp0*测试*.txt" 2>nul
del "%~dp0*test*.txt" 2>nul
echo 清理完成
echo.
pause
goto menu

:exit
cls
echo ========================================
echo           感谢使用扎克管理面板
echo ========================================
echo.
echo 系统已优化完成，祝您使用愉快！
echo.
echo 按任意键退出...
pause >nul
exit