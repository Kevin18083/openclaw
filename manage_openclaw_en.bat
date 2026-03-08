@echo off
echo ========================================
echo     OpenClaw Service Manager
echo ========================================
echo.
echo Select operation:
echo 1. Start OpenClaw service
echo 2. Stop OpenClaw service
echo 3. Restart OpenClaw service
echo 4. Check service status
echo 5. View version info
echo 6. Exit
echo.
set /p choice=Enter choice (1-6): 

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto restart
if "%choice%"=="4" goto status
if "%choice%"=="5" goto version
if "%choice%"=="6" goto exit

:start
echo Starting OpenClaw service...
"%APPDATA%\npm\openclaw-cn" gateway start
echo Start completed
pause
goto menu

:stop
echo Stopping OpenClaw service...
"%APPDATA%\npm\openclaw-cn" gateway stop
echo Stop completed
pause
goto menu

:restart
echo Restarting OpenClaw service...
"%APPDATA%\npm\openclaw-cn" gateway restart
echo Restart completed
pause
goto menu

:status
echo Checking OpenClaw service status...
"%APPDATA%\npm\openclaw-cn" gateway status
echo.
pause
goto menu

:version
echo OpenClaw version info:
"%APPDATA%\npm\openclaw-cn" --version
echo.
pause
goto menu

:exit
echo Exiting manager
exit

:menu
cls
goto :eof