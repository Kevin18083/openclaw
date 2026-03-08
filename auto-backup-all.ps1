# auto-backup-all.ps1 - 自动备份所有关键文件
# 用法：.\auto-backup-all.ps1

Write-Host "========================================"
Write-Host "  Auto Backup All Critical Files"
Write-Host "  $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host "========================================"
Write-Host ""

# 设置路径
$USER_HOME = $env:USERPROFILE
$MEMORY_FILE = "$USER_HOME\.claude\memory\MEMORY.md"
$MEMORY_BACKUP = "$USER_HOME\.claude\memory-backup\MEMORY.md"
$SKILLS_DIR = "$USER_HOME\.openclaw\workspace\skills"
$SKILLS_BACKUP = "$USER_HOME\.openclaw\workspace\skills-backup"
$LOG_FILE = "$USER_HOME\.backup-log.txt"

# 创建备份目录
if (!(Test-Path "$USER_HOME\.claude\memory-backup")) {
    New-Item -ItemType Directory -Force -Path "$USER_HOME\.claude\memory-backup" | Out-Null
}
if (!(Test-Path "$SKILLS_BACKUP")) {
    New-Item -ItemType Directory -Force -Path "$SKILLS_BACKUP" | Out-Null
}

# [1/3] 备份记忆文件
Write-Host "[1/3] Backup memory file..."
if (Test-Path $MEMORY_FILE) {
    Copy-Item -Path $MEMORY_FILE -Destination $MEMORY_BACKUP -Force
    Write-Host "  [OK] Memory file backed up" -ForegroundColor Green
    "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Memory file backed up" | Out-File $LOG_FILE -Append
} else {
    Write-Host "  [WARN] Memory file not found" -ForegroundColor Yellow
}

# [2/3] 备份技能库
Write-Host ""
Write-Host "[2/3] Backup skills directory..."
if (Test-Path $SKILLS_DIR) {
    if (Test-Path $SKILLS_BACKUP) {
        Remove-Item -Path $SKILLS_BACKUP -Recurse -Force
    }
    Copy-Item -Path $SKILLS_DIR -Destination $SKILLS_BACKUP -Recurse -Force
    Write-Host "  [OK] Skills directory backed up" -ForegroundColor Green
    "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Skills directory backed up" | Out-File $LOG_FILE -Append
} else {
    Write-Host "  [WARN] Skills directory not found" -ForegroundColor Yellow
}

# [3/3] 备份配置文件
Write-Host ""
Write-Host "[3/3] Backup config file..."
$CLAUDE_CONFIG = "$USER_HOME\CLAUDE.md"
if (Test-Path $CLAUDE_CONFIG) {
    Copy-Item -Path $CLAUDE_CONFIG -Destination "$CLAUDE_CONFIG.backup" -Force
    Write-Host "  [OK] Config file backed up" -ForegroundColor Green
    "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Config file backed up" | Out-File $LOG_FILE -Append
} else {
    Write-Host "  [WARN] CLAUDE.md not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================"
Write-Host "  Backup Complete!"
Write-Host "========================================"
Write-Host ""
