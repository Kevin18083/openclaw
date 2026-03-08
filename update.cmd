@echo off
echo OpenClaw Daily Update
echo =====================
echo Date: %date%
echo Time: %time%
echo.

echo Step 1: Update OpenClaw core
npm update -g openclaw-cn
if errorlevel 1 (
    echo ERROR: Failed to update OpenClaw
) else (
    echo SUCCESS: OpenClaw updated
)
echo.

echo Step 2: Update skills
clawdhub update --all
if errorlevel 1 (
    echo WARNING: Failed to update skills
) else (
    echo SUCCESS: Skills updated
)
echo.

echo Step 3: Check if update was successful
echo Update process completed!
echo.
pause