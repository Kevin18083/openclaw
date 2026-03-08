# Elite Longterm Memory 自动维护脚本
# 建议每日凌晨3点运行

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Continue"
$startTime = Get-Date
$scriptVersion = "1.0"

# 颜色定义
$successColor = "Green"
$warningColor = "Yellow"
$errorColor = "Red"
$infoColor = "Cyan"

function Write-Status {
    param([string]$Message, [string]$Level = "INFO")
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "$timestamp [$Level] $Message"
    
    # 输出到控制台
    switch ($Level) {
        "SUCCESS" { Write-Host $logEntry -ForegroundColor $successColor }
        "WARNING" { Write-Host $logEntry -ForegroundColor $warningColor }
        "ERROR"   { Write-Host $logEntry -ForegroundColor $errorColor }
        default   { Write-Host $logEntry -ForegroundColor $infoColor }
    }
    
    # 记录到日志文件
    $logEntry | Out-File -Append -FilePath $logFile
}

# 初始化
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Elite Longterm Memory 维护脚本 v$scriptVersion" -ForegroundColor Cyan
Write-Host "开始时间: $startTime" -ForegroundColor Cyan
Write-Host "模式: $(if ($DryRun) {'DRY RUN (模拟)'} else {'实际执行'})" -ForegroundColor Cyan
Write-Host "详细模式: $(if ($Verbose) {'开启'} else {'关闭'})" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置日志文件
$logDir = "C:\Users\17589\.openclaw\workspace\skills\elite-longterm-memory\memory\logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    Write-Status "创建日志目录: $logDir" "INFO"
}
$logFile = "$logDir\maintenance-$(Get-Date -Format 'yyyyMMdd').log"

Write-Status "=== 维护开始 ===" "INFO"
Write-Status "脚本版本: $scriptVersion" "INFO"
Write-Status "用户: $env:USERNAME" "INFO"
Write-Status "计算机: $env:COMPUTERNAME" "INFO"

# 1. 检查记忆目录
Write-Host "1. 检查记忆目录结构" -ForegroundColor Yellow
Write-Host "=" * 40 -ForegroundColor Yellow

$memoryRoot = "C:\Users\17589\.openclaw\workspace\skills\elite-longterm-memory\memory"
$requiredDirs = @("short-term", "medium-term", "long-term", "archived", "tags", "indexes", "backups", "logs")

foreach ($dir in $requiredDirs) {
    $fullPath = Join-Path $memoryRoot $dir
    if (Test-Path $fullPath) {
        $itemCount = (Get-ChildItem -Path $fullPath -File | Measure-Object).Count
        Write-Status "✓ $dir 目录存在 ($itemCount 个文件)" "SUCCESS"
    } else {
        Write-Status "✗ $dir 目录不存在" "ERROR"
        if (-not $DryRun) {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
            Write-Status "  已创建目录: $dir" "INFO"
        }
    }
}

# 2. 清理过期短期记忆（超过24小时）
Write-Host ""
Write-Host "2. 清理短期记忆" -ForegroundColor Yellow
Write-Host "=" * 40 -ForegroundColor Yellow

$shortTermPath = Join-Path $memoryRoot "short-term"
$oldFiles = Get-ChildItem -Path $shortTermPath -Filter *.md -File | Where-Object { 
    $_.LastWriteTime -lt (Get-Date).AddDays(-1) 
}

if ($oldFiles.Count -gt 0) {
    Write-Status "找到 $($oldFiles.Count) 个过期短期记忆文件" "INFO"
    
    foreach ($file in $oldFiles) {
        $archivePath = Join-Path (Join-Path $memoryRoot "archived") $file.Name
        
        if ($DryRun) {
            Write-Status "[DRY RUN] 将归档: $($file.Name) (修改于: $($file.LastWriteTime))" "INFO"
        } else {
            try {
                Move-Item -Path $file.FullName -Destination $archivePath -Force
                Write-Status "✓ 已归档: $($file.Name)" "SUCCESS"
            } catch {
                Write-Status "✗ 归档失败: $($file.Name) - $_" "ERROR"
            }
        }
    }
} else {
    Write-Status "没有找到过期短期记忆" "INFO"
}

# 3. 检查中期记忆（即将过期）
Write-Host ""
Write-Host "3. 检查中期记忆" -ForegroundColor Yellow
Write-Host "=" * 40 -ForegroundColor Yellow

$mediumTermPath = Join-Path $memoryRoot "medium-term"
$expiringSoon = Get-ChildItem -Path $mediumTermPath -Filter *.md -File | Where-Object { 
    $_.LastWriteTime -lt (Get-Date).AddDays(-25) -and $_.LastWriteTime -gt (Get-Date).AddDays(-30)
}

if ($expiringSoon.Count -gt 0) {
    Write-Status "有 $($expiringSoon.Count) 个中期记忆将在5天内过期" "WARNING"
    
    foreach ($file in $expiringSoon | Select-Object -First 5) {
        $daysLeft = [math]::Round((30 - ((Get-Date) - $file.LastWriteTime).TotalDays), 1)
        Write-Status "  即将过期: $($file.Name) (剩余: ${daysLeft}天)" "WARNING"
    }
    
    if ($expiringSoon.Count -gt 5) {
        Write-Status "  还有 $($expiringSoon.Count - 5) 个文件即将过期" "INFO"
    }
} else {
    Write-Status "没有即将过期的中期记忆" "INFO"
}

# 4. 执行备份
Write-Host ""
Write-Host "4. 执行系统备份" -ForegroundColor Yellow
Write-Host "=" * 40 -ForegroundColor Yellow

$backupDir = Join-Path $memoryRoot "backups"
$backupFile = Join-Path $backupDir "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"

$backupSources = @(
    (Join-Path $memoryRoot "short-term"),
    (Join-Path $memoryRoot "medium-term"), 
    (Join-Path $memoryRoot "long-term"),
    (Join-Path $memoryRoot "archived"),
    (Join-Path $memoryRoot "config.json")
)

# 检查需要备份的文件数量
$totalFiles = 0
foreach ($source in $backupSources) {
    if (Test-Path $source) {
        if ((Get-Item $source).PSIsContainer) {
            $fileCount = (Get-ChildItem -Path $source -Recurse -File | Measure-Object).Count
            $totalFiles += $fileCount
        } else {
            $totalFiles += 1
        }
    }
}

if ($totalFiles -eq 0) {
    Write-Status "没有需要备份的文件" "WARNING"
} else {
    Write-Status "准备备份 $totalFiles 个文件" "INFO"
    
    if ($DryRun) {
        Write-Status "[DRY RUN] 将创建备份: $backupFile" "INFO"
    } else {
        try {
            Compress-Archive -Path $backupSources -DestinationPath $backupFile -CompressionLevel Optimal -Force
            $backupSize = "{0:N2}" -f ((Get-Item $backupFile).Length / 1MB)
            Write-Status "✓ 备份创建成功: $backupFile (${backupSize} MB)" "SUCCESS"
            
            # 清理旧备份（保留最近7个）
            $oldBackups = Get-ChildItem -Path $backupDir -Filter "backup-*.zip" | 
                         Sort-Object LastWriteTime -Descending | 
                         Select-Object -Skip 7
            if ($oldBackups.Count -gt 0) {
                foreach ($oldBackup in $oldBackups) {
                    Remove-Item -Path $oldBackup.FullName -Force
                    Write-Status "  清理旧备份: $($oldBackup.Name)" "INFO"
                }
            }
        } catch {
            Write-Status "✗ 备份失败: $_" "ERROR"
        }
    }
}

# 5. 生成统计报告
Write-Host ""
Write-Host "5. 系统统计报告" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Cyan

$endTime = Get-Date
$duration = $endTime - $startTime

# 统计各目录文件数量
$stats = @{}
foreach ($dir in @("short-term", "medium-term", "long-term", "archived")) {
    $dirPath = Join-Path $memoryRoot $dir
    if (Test-Path $dirPath) {
        $fileCount = (Get-ChildItem -Path $dirPath -Filter *.md -File | Measure-Object).Count
        $stats[$dir] = $fileCount
    } else {
        $stats[$dir] = 0
    }
}

$totalMemories = $stats.Values | Measure-Object -Sum | Select-Object -ExpandProperty Sum

Write-Status "记忆统计:" "INFO"
Write-Status "  短期记忆: $($stats['short-term']) 个" "INFO"
Write-Status "  中期记忆: $($stats['medium-term']) 个" "INFO"
Write-Status "  长期记忆: $($stats['long-term']) 个" "INFO"
Write-Status "  归档记忆: $($stats['archived']) 个" "INFO"
Write-Status "  总计: $totalMemories 个记忆文件" "INFO"

# 备份统计
$backupCount = (Get-ChildItem -Path $backupDir -Filter "*.zip" -ErrorAction SilentlyContinue | Measure-Object).Count
Write-Status "备份文件: $backupCount 个" "INFO"

Write-Status "维护时长: $($duration.TotalSeconds.ToString('0.00')) 秒" "INFO"
Write-Status "完成时间: $endTime" "INFO"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "模拟运行完成 - 未进行实际更改" -ForegroundColor Green
} else {
    Write-Host "维护任务完成!" -ForegroundColor Green
}
Write-Host "========================================" -ForegroundColor Cyan

# 如果是交互式运行，等待用户确认
if ($Verbose -and -not $DryRun) {
    Write-Host ""
    Write-Host "按 Enter 键继续..." -ForegroundColor Gray -NoNewline
    $null = Read-Host
}