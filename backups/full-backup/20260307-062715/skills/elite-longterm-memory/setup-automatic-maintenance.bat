@echo off
echo Elite Longterm Memory 自动维护设置工具
echo ============================================
echo.

echo 请选择操作：
echo.
echo 1. 测试维护脚本（模拟运行）
echo 2. 测试维护脚本（实际运行）
echo 3. 创建Windows计划任务（推荐）
echo 4. 创建快捷方式到启动文件夹
echo 5. 查看维护日志
echo 6. 退出
echo.

set /p choice="请输入选项 (1-6): "

if "%choice%"=="1" goto test_dryrun
if "%choice%"=="2" goto test_real
if "%choice%"=="3" goto create_task
if "%choice%"=="4" goto create_shortcut
if "%choice%"=="5" goto view_logs
if "%choice%"=="6" goto exit
echo 无效选项
goto exit

:test_dryrun
echo.
echo 运行模拟测试（不实际修改文件）...
echo.
powershell -ExecutionPolicy Bypass -File "memory-maintenance.ps1" -DryRun -Verbose
echo.
echo 模拟测试完成！
pause
goto exit

:test_real
echo.
echo 运行实际测试...
echo.
powershell -ExecutionPolicy Bypass -File "memory-maintenance.ps1" -Verbose
echo.
echo 实际测试完成！
pause
goto exit

:create_task
echo.
echo 创建Windows计划任务...
echo.
echo 这将创建一个每天凌晨3点运行的自动维护任务。
echo.
set /p confirm="确定要创建计划任务吗？(y/n): "
if /i not "%confirm%"=="y" goto exit

echo 正在创建计划任务...
powershell -Command "
    # 创建任务动作
    `$action = New-ScheduledTaskAction `
        -Execute 'powershell.exe' `
        -Argument '-ExecutionPolicy Bypass -File \"%~dp0memory-maintenance.ps1\"'

    # 创建任务触发器（每天凌晨3点）
    `$trigger = New-ScheduledTaskTrigger `
        -Daily `
        -At 3am

    # 创建任务主体
    `$principal = New-ScheduledTaskPrincipal `
        -UserId '$env:USERDOMAIN\$env:USERNAME' `
        -LogonType S4U `
        -RunLevel Limited

    # 注册任务
    try {
        Register-ScheduledTask `
            -TaskName 'Elite Memory Maintenance' `
            -Action `$action `
            -Trigger `$trigger `
            -Principal `$principal `
            -Description '每日自动维护 Elite Longterm Memory 系统' `
            -Force
        
        Write-Host '✓ 计划任务创建成功！' -ForegroundColor Green
        Write-Host '任务名称: Elite Memory Maintenance' -ForegroundColor White
        Write-Host '运行时间: 每天 03:00' -ForegroundColor White
        Write-Host ''
        Write-Host '要立即测试任务，请运行:' -ForegroundColor Yellow
        Write-Host 'Start-ScheduledTask -TaskName \"Elite Memory Maintenance\"' -ForegroundColor White
    } catch {
        Write-Host '✗ 创建任务失败: ' `$_ -ForegroundColor Red
        Write-Host ''
        Write-Host '可能需要以管理员身份运行此脚本。' -ForegroundColor Yellow
    }
"
pause
goto exit

:create_shortcut
echo.
echo 创建启动文件夹快捷方式...
echo.
echo 这将在每次登录时运行维护脚本。
echo.
set /p confirm="确定要创建快捷方式吗？(y/n): "
if /i not "%confirm%"=="y" goto exit

echo 正在创建快捷方式...
powershell -Command "
    `$shortcutPath = [System.IO.Path]::Combine(
        [Environment]::GetFolderPath('Startup'),
        'Elite Memory Maintenance.lnk'
    )
    
    `$shell = New-Object -ComObject WScript.Shell
    `$shortcut = `$shell.CreateShortcut(`$shortcutPath)
    `$shortcut.TargetPath = 'powershell.exe'
    `$shortcut.Arguments = '-ExecutionPolicy Bypass -File \"%~dp0memory-maintenance.ps1\" -WindowStyle Hidden'
    `$shortcut.WorkingDirectory = '%~dp0'
    `$shortcut.Description = 'Elite Memory Maintenance'
    `$shortcut.Save()
    
    Write-Host '✓ 快捷方式创建成功！' -ForegroundColor Green
    Write-Host '位置: ' `$shortcutPath -ForegroundColor White
"
pause
goto exit

:view_logs
echo.
echo 查看维护日志...
echo.
if not exist "memory\logs" (
    echo 日志目录不存在
    echo 请先运行一次维护脚本
) else (
    echo 最近的日志文件:
    dir memory\logs\*.log /B /O:-N
    echo.
    set /p logfile="输入要查看的日志文件名（直接回车查看最新）: "
    
    if "%logfile%"=="" (
        for /f "delims=" %%i in ('dir memory\logs\*.log /B /O:-N') do set latestlog=%%i & goto showlog
    ) else (
        set latestlog=%logfile%
    )
    
    :showlog
    if exist "memory\logs\%latestlog%" (
        echo.
        echo ===== 日志内容: %latestlog% =====
        type "memory\logs\%latestlog%"
    ) else (
        echo 日志文件不存在: %latestlog%
    )
)
pause
goto exit

:exit
echo.
echo 设置工具结束
echo 详细说明请查看 SCHEDULE-TASK.md
echo.
pause