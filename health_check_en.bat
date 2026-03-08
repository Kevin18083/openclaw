@echo off
echo ========================================
echo         OpenClaw Health Check
echo ========================================
echo.
echo Check time: %date% %time%
echo.

echo 1. Checking process status...
tasklist | findstr /i "node.exe" >nul
if %errorlevel% equ 0 (
    echo [OK] OpenClaw processes running
    tasklist | findstr /i "node.exe"
) else (
    echo [ERROR] OpenClaw processes not running
)

echo.
echo 2. Checking service response...
echo    Testing command availability...
"%APPDATA%\npm\openclaw-cn" --version >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] OpenClaw command available
) else (
    echo [ERROR] OpenClaw command not available
)

echo.
echo 3. Checking disk space...
dir "C:\Users\17589\.openclaw" | find "File(s)"
if %errorlevel% equ 0 (
    echo [OK] Workspace accessible
) else (
    echo [WARNING] Workspace check failed
)

echo.
echo 4. Checking backup status...
if exist "C:\Users\17589\OpenClaw_Mirrors" (
    echo [OK] Mirror directory exists
    dir "C:\Users\17589\OpenClaw_Mirrors" /b
) else (
    echo [WARNING] Mirror directory not found
)

echo.
echo 5. Checking memory files...
if exist "C:\Users\17589\.openclaw\workspace\MEMORY.md" (
    echo [OK] MEMORY.md exists
) else (
    echo [ERROR] MEMORY.md missing
)

if exist "C:\Users\17589\.openclaw\workspace\memory\operation_log.md" (
    echo [OK] Operation log exists
) else (
    echo [WARNING] Operation log missing
)

echo.
echo ========================================
echo Health check completed!
echo Time: %date% %time%
echo ========================================
echo.
echo Results saved to: health_check.log
echo %date% %time% - Health check completed >> "health_check.log"

echo Press any key to exit...
pause >nul