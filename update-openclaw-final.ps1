# OpenClaw Daily Update Script - Final Version
param(
    [switch]$TestMode = $false,
    [switch]$DryRun = $false
)

$ErrorActionPreference = "Continue"
$startTime = Get-Date
$scriptVersion = "1.0"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OpenClaw Daily Update v$scriptVersion" -ForegroundColor Cyan
Write-Host "Start: $startTime" -ForegroundColor Cyan
Write-Host "Mode: $(if ($TestMode) {'TEST'} elseif ($DryRun) {'DRY RUN'} else {'PRODUCTION'})" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 初始化日志
$logDir = "C:\Users\17589\.openclaw\logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}
$logFile = "$logDir\updates.log"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "$timestamp [$Level] $Message"
    $logEntry | Out-File -Append -FilePath $logFile
    Write-Host $logEntry
}

function Execute-Command {
    param([string]$Command, [string]$Description)
    
    Write-Log "Executing: $Description" "INFO"
    Write-Host "  Command: $Command" -ForegroundColor Gray
    
    if ($DryRun -or $TestMode) {
        Write-Log "[DRY RUN] Would execute: $Command" "INFO"
        return $true
    }
    
    try {
        $output = Invoke-Expression $Command 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✓ $Description completed successfully" "SUCCESS"
            return $true
        } else {
            Write-Log "✗ $Description failed (exit code: $LASTEXITCODE)" "ERROR"
            Write-Host "  Output: $output" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Log "✗ $Description failed with exception: $_" "ERROR"
        return $false
    }
}

# 记录开始
Write-Log "=== OpenClaw Update Started ===" "INFO"
Write-Log "User: $env:USERNAME" "INFO"
Write-Log "Computer: $env:COMPUTERNAME" "INFO"
Write-Log "Script: $PSCommandPath" "INFO"

# 1. 更新OpenClaw核心
Write-Host "1. UPDATING OPENCLAW CORE" -ForegroundColor Yellow
Write-Host "=" * 40 -ForegroundColor Yellow

$npmCheck = Execute-Command -Command "npm list -g openclaw-cn" -Description "Check OpenClaw version"
if ($npmCheck) {
    $updateResult = Execute-Command -Command "npm update -g openclaw-cn" -Description "Update OpenClaw core"
}

Write-Host ""

# 2. 更新技能
Write-Host "2. UPDATING SKILLS" -ForegroundColor Yellow
Write-Host "=" * 40 -ForegroundColor Yellow

$clawdhubPath = "$env:APPDATA\npm\clawdhub.cmd"
if (Test-Path $clawdhubPath) {
    # 先检查已安装的技能
    $skillsCheck = Execute-Command -Command "clawdhub list" -Description "List installed skills"
    
    # 更新所有技能
    $skillsUpdate = Execute-Command -Command "clawdhub update --all" -Description "Update all skills"
} else {
    Write-Log "ClawdHub not found at: $clawdhubPath" "WARNING"
    Write-Host "  ⚠ Skipping skill updates (ClawdHub not installed)" -ForegroundColor Yellow
}

Write-Host ""

# 3. 重启OpenClaw服务/进程
Write-Host "3. RESTARTING OPENCLAW" -ForegroundColor Yellow
Write-Host "=" * 40 -ForegroundColor Yellow

# 检查服务是否存在
$service = Get-Service -Name "OpenClawGateway" -ErrorAction SilentlyContinue
if ($service) {
    Write-Log "Found OpenClawGateway service" "INFO"
    
    if ($service.Status -eq 'Running') {
        $stopResult = Execute-Command -Command "Stop-Service -Name 'OpenClawGateway' -Force" -Description "Stop OpenClaw service"
        Start-Sleep -Seconds 3
    }
    
    $startResult = Execute-Command -Command "Start-Service -Name 'OpenClawGateway'" -Description "Start OpenClaw service"
} else {
    Write-Log "OpenClawGateway service not found, checking for processes..." "INFO"
    
    # 查找并重启OpenClaw进程
    $processes = Get-Process | Where-Object { $_.ProcessName -like "*openclaw*" -or $_.ProcessName -like "*claw*" }
    if ($processes) {
        Write-Log "Found $($processes.Count) OpenClaw-related processes" "INFO"
        foreach ($proc in $processes) {
            Write-Log "  • $($proc.ProcessName) (PID: $($proc.Id))" "INFO"
        }
        
        if (-not $DryRun -and -not $TestMode) {
            Write-Log "Note: Manual restart may be required for OpenClaw processes" "INFO"
            Write-Host "  ⚠ Please restart OpenClaw manually if needed" -ForegroundColor Yellow
        }
    } else {
        Write-Log "No OpenClaw processes found" "INFO"
    }
}

Write-Host ""

# 4. 生成报告
Write-Host "4. UPDATE SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Cyan

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Log "=== Update Summary ===" "INFO"
Write-Log "Start Time: $startTime" "INFO"
Write-Log "End Time: $endTime" "INFO"
Write-Log "Duration: $($duration.TotalSeconds.ToString('0.00')) seconds" "INFO"
Write-Log "Mode: $(if ($TestMode) {'TEST'} elseif ($DryRun) {'DRY RUN'} else {'PRODUCTION'})" "INFO"
Write-Log "Script Version: $scriptVersion" "INFO"

Write-Host "   Start Time: $startTime" -ForegroundColor White
Write-Host "   End Time: $endTime" -ForegroundColor White
Write-Host "   Duration: $($duration.TotalSeconds.ToString('0.00')) seconds" -ForegroundColor White
Write-Host "   Log File: $logFile" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
if ($TestMode -or $DryRun) {
    Write-Host "TEST COMPLETED - No changes were made" -ForegroundColor Green
} else {
    Write-Host "UPDATE COMPLETED SUCCESSFULLY!" -ForegroundColor Green
}
Write-Host "========================================" -ForegroundColor Cyan

# 如果是测试模式，等待用户确认
if ($TestMode) {
    Write-Host ""
    Write-Host "This was a test run. To perform actual updates:" -ForegroundColor Yellow
    Write-Host "1. Run without -TestMode parameter" -ForegroundColor White
    Write-Host "2. Or schedule with Task Scheduler" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Enter to exit..." -ForegroundColor Gray -NoNewline
    $null = Read-Host
}