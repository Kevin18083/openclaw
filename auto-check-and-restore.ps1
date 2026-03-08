# auto-check-and-restore.ps1 - 自动检查并恢复关键文件
# 用法：.\auto-check-and-restore.ps1

Write-Host "========================================"
Write-Host "  Auto Check & Restore Critical Files"
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "========================================"
Write-Host ""

# 设置路径
$USER_HOME = $env:USERPROFILE
$MEMORY_FILE = "$USER_HOME\.claude\memory\MEMORY.md"
$MEMORY_BACKUP = "$USER_HOME\.claude\memory-backup\MEMORY.md"
$SKILLS_DIR = "$USER_HOME\.openclaw\workspace\skills"
$SKILLS_BACKUP = "$USER_HOME\.openclaw\workspace\skills-backup"
$LOG_FILE = "$USER_HOME\.restore-log.txt"

$SWITCHED = $false

# [1/2] 检查记忆文件
Write-Host "[1/2] Check memory file..."
if (Test-Path $MEMORY_FILE) {
    Write-Host "  [OK] Memory file exists" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Memory file not found!" -ForegroundColor Yellow
    if (Test-Path $MEMORY_BACKUP) {
        Write-Host "  [RESTORE] Recovering from backup..." -ForegroundColor Cyan
        Copy-Item -Path $MEMORY_BACKUP -Destination $MEMORY_FILE -Force
        Write-Host "  [OK] Memory file restored from backup" -ForegroundColor Green
        "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Memory file restored from backup" | Out-File $LOG_FILE -Append
        $SWITCHED = $true
    } else {
        Write-Host "  [ERROR] Backup file also not found!" -ForegroundColor Red
    }
}

# [2/2] 检查技能库
Write-Host ""
Write-Host "[2/2] Check skills directory..."
if (Test-Path "$SKILLS_DIR\code-quality-workflow") {
    Write-Host "  [OK] Skills directory OK" -ForegroundColor Green
} else {
    Write-Host "  [WARN] Skills directory abnormal!" -ForegroundColor Yellow
    if (Test-Path "$SKILLS_BACKUP\code-quality-workflow") {
        Write-Host "  [RESTORE] Recovering from backup..." -ForegroundColor Cyan
        Copy-Item -Path $SKILLS_BACKUP -Destination $SKILLS_DIR -Recurse -Force
        Write-Host "  [OK] Skills directory restored from backup" -ForegroundColor Green
        "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Skills directory restored" | Out-File $LOG_FILE -Append
        $SWITCHED = $true
    } else {
        Write-Host "  [ERROR] Backup skills directory also not found!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================"
if ($SWITCHED) {
    Write-Host "  [WARN] Files switched/restored, check logs" -ForegroundColor Yellow
} else {
    Write-Host "  [OK] All files normal, no restore needed" -ForegroundColor Green
}
Write-Host "========================================"
Write-Host ""
