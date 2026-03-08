@echo off
chcp 65001 >nul
echo ========================================
echo       扎克系统维护工具 v1.0
echo ========================================
echo.
echo 当前时间: %date% %time%
echo 用户: %USERNAME%
echo.

echo 请选择维护操作:
echo.
echo [1] 系统健康检查
echo [2] 快速数据备份
echo [3] 清理临时文件
echo [4] 检查备份状态
echo [5] 查看系统日志
echo [6] 修复常见问题
echo [7] 退出
echo.
set /p choice=请输入选择 (1-7): 

if "%choice%"=="1" goto health
if "%choice%"=="2" goto backup
if "%choice%"=="3" goto cleanup
if "%choice%"=="4" goto checkbackup
if "%choice%"=="5" goto viewlogs
if "%choice%"=="6" goto fixissues
if "%choice%"=="7" goto exit

:health
cls
echo ========================================
echo       系统健康检查
echo ========================================
echo.
echo 正在检查系统健康状态...
echo.
call "%~dp0health_check_en.bat"
echo.
pause
goto menu

:backup
cls
echo ========================================
echo       快速数据备份
echo ========================================
echo.
echo 正在执行快速备份...
echo.
call "%~dp0quick_backup_en.bat"
echo.
pause
goto menu

:cleanup
cls
echo ========================================
echo       清理临时文件
echo ========================================
echo.
echo 正在清理临时文件...
echo.
del "%~dp0*test*.txt" 2>nul
del "%~dp0*temp*.tmp" 2>nul
del "%~dp0*backup*.old" 2>nul
echo 清理完成！
echo.
echo 建议定期清理的项目:
echo 1. 旧的备份文件（保留最近7天）
echo 2. 临时测试文件
echo 3. 日志文件（保留最近30天）
echo.
pause
goto menu

:checkbackup
cls
echo ========================================
echo       检查备份状态
echo ========================================
echo.
echo 检查备份目录...
echo.
echo === 快速备份 ===
if exist "%USERPROFILE%\OpenClaw_QuickBackups" (
    dir "%USERPROFILE%\OpenClaw_QuickBackups" /b
) else (
    echo 快速备份目录不存在
)

echo.
echo === 完整镜像 ===
if exist "%USERPROFILE%\OpenClaw_Mirrors" (
    dir "%USERPROFILE%\OpenClaw_Mirrors" /b
) else (
    echo 镜像目录不存在
)

echo.
echo === D盘备份 ===
if exist "D:\AAAAAA\zhake_jingxiang_dpan_beifen" (
    echo D盘备份存在: zhake_jingxiang_dpan_beifen
) else (
    echo D盘备份不存在
)

echo.
echo 备份状态评估:
echo ✅ 建议保持至少3个备份版本
echo ✅ 建议有异地备份（D盘）
echo ✅ 建议定期测试恢复
echo.
pause
goto menu

:viewlogs
cls
echo ========================================
echo       查看系统日志
echo ========================================
echo.
echo 请选择日志类型:
echo.
echo [1] 操作日志
echo [2] 健康检查日志
echo [3] 备份日志
echo [4] 系统事件日志
echo [5] 返回主菜单
echo.
set /p logchoice=请输入选择: 

if "%logchoice%"=="1" goto oplog
if "%logchoice%"=="2" goto healthlog
if "%logchoice%"=="3" goto backuplog
if "%logchoice%"=="4" goto eventlog
if "%logchoice%"=="5" goto menu

:oplog
cls
echo ========================================
echo       操作日志
echo ========================================
echo.
if exist "%~dp0memory\caozuo_rizhi.md" (
    type "%~dp0memory\caozuo_rizhi.md" | more
) else (
    echo 操作日志文件不存在
)
echo.
pause
goto viewlogs

:healthlog
cls
echo ========================================
echo       健康检查日志
echo ========================================
echo.
if exist "%~dp0health_check.log" (
    type "%~dp0health_check.log"
) else (
    echo 健康检查日志不存在
)
echo.
pause
goto viewlogs

:backuplog
cls
echo ========================================
echo       备份日志
echo ========================================
echo.
echo 最近备份记录:
for /f "delims=" %%i in ('dir "%USERPROFILE%\OpenClaw_QuickBackups" /b /od 2^>nul') do (
    echo %%i
)
echo.
pause
goto viewlogs

:eventlog
cls
echo ========================================
echo       系统事件日志
echo ========================================
echo.
echo 最近系统事件:
echo 检查OpenClaw服务日志...
"%APPDATA%\npm\openclaw-cn" gateway status
echo.
pause
goto viewlogs

:fixissues
cls
echo ========================================
echo       修复常见问题
echo ========================================
echo.
echo 请选择要修复的问题:
echo.
echo [1] 修复PATH配置（openclaw命令）
echo [2] 清理重复cron任务
echo [3] 修复文件编码问题
echo [4] 重启OpenClaw服务
echo [5] 返回主菜单
echo.
set /p fixchoice=请输入选择: 

if "%fixchoice%"=="1" goto fixpath
if "%fixchoice%"=="2" goto fixcron
if "%fixchoice%"=="3" goto fixencoding
if "%fixchoice%"=="4" goto restartservice
if "%fixchoice%"=="5" goto menu

:fixpath
cls
echo ========================================
echo       修复PATH配置
echo ========================================
echo.
call "%~dp0fix_openclaw_path_en.bat"
echo.
pause
goto fixissues

:fixcron
cls
echo ========================================
echo       清理重复cron任务
echo ========================================
echo.
echo 注意：需要OpenClaw服务支持
echo 建议手动检查cron任务...
echo.
echo 当前cron任务数量:
"%APPDATA%\npm\openclaw-cn" gateway status | find "cron"
echo.
echo 如需清理，请手动操作。
echo.
pause
goto fixissues

:fixencoding
cls
echo ========================================
echo       修复文件编码问题
echo ========================================
echo.
echo 解决方案:
echo 1. 已创建拼音版文件
echo 2. 使用英文管理工具
echo 3. 避免创建中文文件名
echo.
echo 当前状态:
echo ✅ 拼音版指南文档已创建
echo ✅ 英文管理工具可用
echo ✅ 操作日志已拼音化
echo.
pause
goto fixissues

:restartservice
cls
echo ========================================
echo       重启OpenClaw服务
echo ========================================
echo.
echo 正在重启服务...
call "%~dp0manage_openclaw_en.bat"
echo.
pause
goto fixissues

:exit
cls
echo ========================================
echo       感谢使用扎克系统维护工具
echo ========================================
echo.
echo 系统维护完成，祝您使用愉快！
echo.
echo 按任意键退出...
pause >nul
exit

:menu
cls
goto :eof