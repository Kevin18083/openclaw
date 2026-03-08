@echo off
echo [%date% %time%] Starting OpenClaw update...
echo.

REM 更新OpenClaw核心
echo Updating OpenClaw core...
npm update -g openclaw-cn
echo.

REM 更新技能（如果clawdhub可用）
echo Updating skills...
if exist "%APPDATA%\npm\clawdhub.cmd" (
    echo Checking for skill updates...
    clawdhub update --all
) else (
    echo ClawdHub not found, skipping skill updates
)
echo.

REM 重启OpenClaw网关服务（如果运行中）
echo Restarting OpenClaw gateway...
net stop OpenClawGateway 2>nul
net start OpenClawGateway 2>nul
echo.

echo [%date% %time%] Update completed.
pause