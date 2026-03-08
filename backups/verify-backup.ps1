# 备份验证脚本
# 用途：验证备份完整性和可用性

param(
    [string]$BackupType = "main",  # main 或 backup
    [string]$Version = "latest"    # latest 或具体时间戳
)

$ErrorActionPreference = "Stop"
$workspaceRoot = "C:\Users\17589\.openclaw\workspace"
$backupRoot = "$workspaceRoot\backups\knowledge-$BackupType"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  知识备份验证系统" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 获取最新备份版本
if ($Version -eq "latest") {
    $latestBackup = Get-ChildItem -Path $backupRoot -Directory | Sort-Object Name -Descending | Select-Object -First 1
    if (-not $latestBackup) {
        Write-Host "[错误] 未找到备份版本" -ForegroundColor Red
        exit 1
    }
    $backupPath = $latestBackup.FullName
    $versionName = $latestBackup.Name
} else {
    $backupPath = "$backupRoot\$Version"
    $versionName = $Version
    if (-not (Test-Path $backupPath)) {
        Write-Host "[错误] 指定版本不存在：$Version" -ForegroundColor Red
        exit 1
    }
}

Write-Host "[信息] 验证备份版本：$versionName" -ForegroundColor Yellow
Write-Host "[信息] 备份路径：$backupPath" -ForegroundColor Yellow
Write-Host ""

# 验证关键文件
$criticalFiles = @(
    "MEMORY.md",
    "SOUL.md",
    "USER.md",
    "IDENTITY.md",
    "BACKUP-MANIFEST.md"
)

$memoryFiles = @(
    "2026-02-28.md",
    "2026-03-01.md",
    "2026-03-02.md",
    "2026-03-03.md",
    "2026-03-04.md",
    "2026-03-05.md",
    "2026-03-06.md"
)

$skillsDirs = @(
    "elite-longterm-memory",
    "multi-search-engine",
    "openclaw-anything",
    "proactive-agent",
    "save-money",
    "self-improving-agent",
    "skill-vetter",
    "tavily-search"
)

$allPassed = $true

# 验证核心文件
Write-Host "[检查] 核心文件..." -ForegroundColor Cyan
foreach ($file in $criticalFiles) {
    $filePath = "$backupPath\$file"
    if (Test-Path $filePath) {
        $size = (Get-Item $filePath).Length
        Write-Host "  ✓ $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file [缺失]" -ForegroundColor Red
        $allPassed = $false
    }
}
Write-Host ""

# 验证记忆文件
Write-Host "[检查] 记忆文件..." -ForegroundColor Cyan
foreach ($file in $memoryFiles) {
    $filePath = "$backupPath\memory\$file"
    if (Test-Path $filePath) {
        $size = (Get-Item $filePath).Length
        Write-Host "  ✓ memory\$file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ memory\$file [缺失]" -ForegroundColor Red
        $allPassed = $false
    }
}
Write-Host ""

# 验证技能目录
Write-Host "[检查] 技能文件..." -ForegroundColor Cyan
foreach ($dir in $skillsDirs) {
    $dirPath = "$backupPath\skills\$dir"
    if (Test-Path $dirPath) {
        $fileCount = (Get-ChildItem -Path $dirPath -Recurse -File).Count
        Write-Host "  ✓ skills\$dir ($fileCount 文件)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ skills\$dir [缺失]" -ForegroundColor Red
        $allPassed = $false
    }
}
Write-Host ""

# 总结
Write-Host "========================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "  验证结果：✓ 通过" -ForegroundColor Green
    Write-Host "  备份状态：可用" -ForegroundColor Green
} else {
    Write-Host "  验证结果：✗ 失败" -ForegroundColor Red
    Write-Host "  备份状态：需要修复" -ForegroundColor Red
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 返回结果
if (-not $allPassed) {
    exit 1
}
