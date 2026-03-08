# remove-daily-backup-task.ps1 - 删除每日自动备份任务
# 用法：.\remove-daily-backup-task.ps1

Write-Host "========================================"
Write-Host "  删除每日自动备份任务"
Write-Host "========================================"
Write-Host ""

$taskName = "Claude-Auto-Backup-Daily"

# 检查任务是否存在
$existingTask = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

if ($existingTask) {
    Write-Host "[INFO] 找到任务：$taskName"
    Write-Host ""

    $confirm = Read-Host "确定要删除此任务吗？(y/n)"

    if ($confirm -eq "y") {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        Write-Host ""
        Write-Host "========================================"
        Write-Host "  任务已删除！" -ForegroundColor Green
        Write-Host "========================================"
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "[INFO] 操作已取消" -ForegroundColor Yellow
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "[INFO] 任务不存在" -ForegroundColor Yellow
    Write-Host ""
}
