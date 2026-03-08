@echo off
echo ========================================
echo     OpenClaw PATH Fix Tool
echo ========================================
echo.

echo 1. Checking current PATH...
echo %PATH% | find "npm" >nul
if %errorlevel% equ 0 (
    echo [OK] npm is in PATH
) else (
    echo [WARNING] npm not in PATH
)

echo.
echo 2. Checking OpenClaw command...
where openclaw-cn >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Found openclaw-cn command
) else (
    echo [ERROR] openclaw-cn command not found
)

echo.
echo 3. Testing OpenClaw command...
"%APPDATA%\npm\openclaw-cn" --version >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] OpenClaw command test successful
    "%APPDATA%\npm\openclaw-cn" --version
) else (
    echo [ERROR] OpenClaw command test failed
)

echo.
echo 4. Temporary fix (current session)...
set "NPM_PATH=%APPDATA%\npm"
echo Adding to PATH: %NPM_PATH%
set PATH=%NPM_PATH%;%PATH%

echo.
echo 5. Permanent fix instructions:
echo    Manual steps:
echo    1. Open System Properties (Win + Pause/Break)
echo    2. Click "Advanced system settings"
echo    3. Click "Environment Variables"
echo    4. In "System variables", find "Path"
echo    5. Click "Edit"
echo    6. Add new entry: %NPM_PATH%
echo    7. Click OK on all windows
echo.
echo    After adding, restart command prompt.

echo.
echo ========================================
echo Fix tool completed.
echo ========================================
echo.
echo Press any key to exit...
pause >nul