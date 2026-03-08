@echo off
echo ========================================
echo OpenClaw Daily Update
echo Start: %date% %time%
echo ========================================
echo.

REM 设置日志目录
set LOGDIR=%USERPROFILE%\.openclaw\logs
if not exist "%LOGDIR%" mkdir "%LOGDIR%"
set LOGFILE=%LOGDIR%\updates.log

echo [%date% %time%] Update started >> "%LOGFILE%"
echo User: %USERNAME% >> "%LOGFILE%"
echo Computer: %COMPUTERNAME% >> "%LOGFILE%"

echo 1. UPDATING OPENCLAW CORE
echo ==========================
echo [%date% %time%] Updating OpenClaw core... >> "%LOGFILE%"
npm update -g openclaw-cn
if %errorlevel% equ 0 (
    echo [%date% %time%] OpenClaw core updated successfully >> "%LOGFILE%"
    echo ✓ OpenClaw core updated
) else (
    echo [%date% %time%] ERROR: Failed to update OpenClaw core >> "%LOGFILE%"
    echo ✗ Failed to update OpenClaw core
)
echo.

echo 2. UPDATING SKILLS
echo ==================
echo [%date% %time%] Updating skills... >> "%LOGFILE%"
where clawdhub >nul 2>nul
if %errorlevel% equ 0 (
    clawdhub update --all
    if %errorlevel% equ 0 (
        echo [%date% %time%] Skills updated successfully >> "%LOGFILE%"
        echo ✓ Skills updated
    ) else (
        echo [%date% %time%] ERROR: Failed to update skills >> "%LOGFILE%"
        echo ✗ Failed to update skills
    )
) else (
    echo [%date% %time%] WARNING: Clawdhub not found, skipping skill updates >> "%LOGFILE%"
    echo ⚠ Clawdhub not found, skipping skill updates
)
echo.

echo 3. CHECKING OPENCLAW PROCESSES
echo ===============================
echo [%date% %time%] Checking OpenClaw processes... >> "%LOGFILE%"
tasklist | findstr /i "openclaw" >nul
if %errorlevel% equ 0 (
    echo [%date% %time%] OpenClaw processes found >> "%LOGFILE%"
    echo ⚠ OpenClaw processes are running
    echo   Note: You may need to restart OpenClaw manually
) else (
    echo [%date% %time%] No OpenClaw processes found >> "%LOGFILE%"
    echo ✓ No OpenClaw processes running
)
echo.

echo 4. UPDATE COMPLETED
echo ===================
echo [%date% %time%] Update completed >> "%LOGFILE%"
echo ========================================
echo Update completed!
echo Log file: %LOGFILE%
echo ========================================

REM 保持窗口打开以便查看结果
pause