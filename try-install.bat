@echo off
echo Trying to install memory-setup skill...
echo.

echo Attempt 1: Full slug
clawdhub install jrbobbyhansen-pixel/memory-setup
if %errorlevel% equ 0 goto success

echo.
echo Waiting 30 seconds before next attempt...
timeout /t 30 /nobreak >nul

echo.
echo Attempt 2: Short name
clawdhub install memory-setup
if %errorlevel% equ 0 goto success

echo.
echo Both attempts failed due to rate limiting.
echo Please wait 30-60 minutes and try again.
goto end

:success
echo.
echo Installation successful!

:end
pause