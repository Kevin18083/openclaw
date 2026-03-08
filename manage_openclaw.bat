@echo off
echo ========================================
echo        OpenClaw 管理工具
echo ========================================
echo.
echo 请选择操作:
echo 1. 启动OpenClaw服务
echo 2. 停止OpenClaw服务
echo 3. 重启OpenClaw服务
echo 4. 检查服务状态
echo 5. 查看版本信息
echo 6. 退出
echo.
set /p choice=请输入选择 (1-6): 

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto status
if "%choice%"=="5" goto version
if "%choice%"=="6" goto exit

:start
echo 正在启动OpenClaw服务...
openclaw-cn gateway start
echo 启动完成
pause
goto menu

:stop
echo 正在停止OpenClaw服务...
openclaw-cn gateway stop
echo 停止完成
pause
goto menu

:restart
echo 正在重启OpenClaw服务...
openclaw-cn gateway restart
echo 重启完成
pause
goto menu

:status
echo 检查OpenClaw服务状态...
openclaw-cn gateway status
echo.
pause
goto menu

:version
echo OpenClaw版本信息:
openclaw-cn --version
echo.
pause
goto menu

:exit
echo 退出管理工具
exit

:menu
cls
goto :eof