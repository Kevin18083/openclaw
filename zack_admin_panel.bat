@echo off
chcp 65001 >nul
title Zack Admin Panel v1.0

:menu
cls
echo ========================================
echo         Zack Admin Panel v1.0
echo ========================================
echo.
echo Current time: %date% %time%
echo User: %USERNAME%
echo.
echo Please select operation:
echo.
echo [1] System Status Check
echo [2] Quick Backup Data
echo [3] Health Check
echo [4] Manage OpenClaw Service
echo [5] View Operation Logs
echo [6] Fix PATH Configuration
echo [7] Setup Auto Backup
echo [8] Clean Temporary Files
echo [9] Exit
echo.
set /p choice=Enter choice (1-9): 

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
echo         System Status Check
echo ========================================
echo.
echo 1. Checking processes...
tasklist | findstr /i "node.exe"
echo.
echo 2. Checking disk usage...
dir "C:\Users\17589\.openclaw"
echo.
echo 3. Checking backups...
if exist "C:\Users\17589\OpenClaw_Mirrors" (
    echo Mirrors found:
    dir "C:\Users\17589\OpenClaw_Mirrors" /b
) else (
    echo No mirror directory found
)
echo.
echo 4. Checking memory files...
if exist "C:\Users\17589\.openclaw\workspace\MEMORY.md" (
    echo MEMORY.md exists
) else (
    echo MEMORY.md missing
)
echo.
pause
goto menu

:backup
cls
echo ========================================
echo         Quick Backup Data
echo ========================================
echo.
echo Running quick backup...
call "%~dp0quick_backup_en.bat"
echo.
pause
goto menu

:health
cls
echo ========================================
echo         Health Check
echo ========================================
echo.
call "%~dp0health_check_en.bat"
echo.
pause
goto menu

:manage
cls
echo ========================================
echo         Manage OpenClaw Service
echo ========================================
echo.
call "%~dp0manage_openclaw_en.bat"
echo.
pause
goto menu

:logs
cls
echo ========================================
echo         View Operation Logs
echo ========================================
echo.
if exist "C:\Users\17589\.openclaw\workspace\memory\operation_log.md" (
    type "C:\Users\17589\.openclaw\workspace\memory\operation_log.md" | more
) else (
    echo Operation log file not found
)
echo.
pause
goto menu

:fixpath
cls
echo ========================================
echo         Fix PATH Configuration
echo ========================================
echo.
call "%~dp0fix_openclaw_path_en.bat"
echo.
pause
goto menu

:autobackup
cls
echo ========================================
echo         Setup Auto Backup
echo ========================================
echo.
echo Note: Requires administrator privileges!
echo.
echo Create daily auto backup task? (Y/N)
set /p confirm=Enter: 
if /i "%confirm%"=="Y" (
    call "%~dp0setup_backup_task_en.bat"
)
echo.
pause
goto menu

:cleanup
cls
echo ========================================
echo         Clean Temporary Files
echo ========================================
echo.
echo Cleaning test files...
del "%~dp0*test*.txt" 2>nul
del "%~dp0*backup*.tmp" 2>nul
echo Cleanup complete
echo.
pause
goto menu

:exit
cls
echo ========================================
echo         Thank you for using Zack Admin
echo ========================================
echo.
echo System optimization completed.
echo.
echo Press any key to exit...
pause >nul
exit