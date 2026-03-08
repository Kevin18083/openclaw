# remove-daily-backup-task.ps1 - 删除每日自动备份任务
# 用法：.\remove-daily-backup-task.ps1

Write-Host "========================================"
Write-Host "  删除每日自动备份任务"
Write-Host "========================================"
Write-Host ""

$taskName1 = "Claude-Auto-Backup-Daily-18"
$taskName2 = "Claude-Auto-Backup-Daily-00"

# 检查任务 1
$existingTask1 = Get-ScheduledTask -TaskName $taskName1 -ErrorAction SilentlyContinue

if ($existingTask1) {
    Write-Host "[INFO] 找到任务：$taskName1"
    Unregister-ScheduledTask -TaskName $taskName1 -Confirm:$false
    Write-Host "  - 已删除任务 1 (下午 6 点)" -ForegroundColor Green
}

# 检查任务 2
$existingTask2 = Get-ScheduledTask -TaskName $taskName2 -ErrorAction SilentlyContinue

if ($existingTask2) {
    Write-Host "[INFO] 找到任务：$taskName2"
    Unregister-ScheduledTask -TaskName $taskName2 -Confirm:$false
    Write-Host "  - 已删除任务 2 (凌晨 12 点)" -ForegroundColor Green
}

if ($existingTask1 -or $existingTask2) {
    Write-Host ""
    Write-Host "========================================"
    Write-Host "  任务已删除！" -ForegroundColor Green
    Write-Host "========================================"
} else {
    Write-Host ""
    Write-Host "[INFO] 任务不存在" -ForegroundColor Yellow
}
