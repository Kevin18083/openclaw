# install-daily-backup-task.ps1 - 安装每天凌晨 3 点自动备份任务
# 用法：以管理员权限运行 .\install-daily-backup-task.ps1

Write-Host "========================================"
Write-Host "  安装每日自动备份任务"
Write-Host "========================================"
Write-Host ""

$taskName = "Claude-Auto-Backup-Daily"
$scriptPath = "$PSScriptRoot\auto-backup-all.ps1"
$triggerTime1 = "6:00 PM"
$triggerTime2 = "12:00 AM"

Write-Host "任务名称：$taskName"
Write-Host "备份脚本：$scriptPath"
Write-Host "执行时间：每天 $triggerTime1 和 $triggerTime2"
Write-Host ""

# 检查是否已存在
$existingTask1 = Get-ScheduledTask -TaskName "$taskName-18" -ErrorAction SilentlyContinue
$existingTask2 = Get-ScheduledTask -TaskName "$taskName-00" -ErrorAction SilentlyContinue

if ($existingTask1) {
    Write-Host "[INFO] 任务 1 已存在，正在更新..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName "$taskName-18" -Confirm:$false
}
if ($existingTask2) {
    Write-Host "[INFO] 任务 2 已存在，正在更新..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName "$taskName-00" -Confirm:$false
}

# 创建任务设置
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType S4U -RunLevel Highest

# 任务 1：下午 6 点
$trigger1 = New-ScheduledTaskTrigger -Daily -At 6pm
$action1 = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`"" `
    -WorkingDirectory "$PSScriptRoot"

# 任务 2：凌晨 12 点
$trigger2 = New-ScheduledTaskTrigger -Daily -At 12am
$action2 = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`"" `
    -WorkingDirectory "$PSScriptRoot"

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable:$false `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1)

# 注册任务
try {
    Register-ScheduledTask `
        -TaskName "$taskName-18" `
        -Principal $principal `
        -Trigger $trigger1 `
        -Action $action1 `
        -Settings $settings `
        -Description "每天下午 6 点自动备份 Claude 关键文件" `
        -ErrorAction Stop

    Register-ScheduledTask `
        -TaskName "$taskName-00" `
        -Principal $principal `
        -Trigger $trigger2 `
        -Action $action2 `
        -Settings $settings `
        -Description "每天凌晨 12 点自动备份 Claude 关键文件" `
        -ErrorAction Stop

    Write-Host ""
    Write-Host "========================================"
    Write-Host "  任务安装成功！" -ForegroundColor Green
    Write-Host "========================================"
    Write-Host ""
    Write-Host "任务详情:"
    Write-Host "  - 名称：$taskName-18 和 $taskName-00"
    Write-Host "  - 时间：每天下午 6:00 和 凌晨 12:00"
    Write-Host "  - 操作：运行 auto-backup-all.ps1"
    Write-Host ""
    Write-Host "查看任务：打开 '任务计划程序' -> '任务计划程序库'"
    Write-Host "手动运行：右键任务 -> '运行'"
    Write-Host "删除任务：.\remove-daily-backup-task.ps1"
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "========================================"
    Write-Host "  任务安装失败！" -ForegroundColor Red
    Write-Host "========================================"
    Write-Host ""
    Write-Host "错误信息：$($_.Exception.Message)"
    Write-Host ""
    Write-Host "请确保以管理员权限运行此脚本"
    Write-Host ""
}
