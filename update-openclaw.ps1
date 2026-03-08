# OpenClaw Daily Update Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OpenClaw Daily Update - $(Get-Date)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 更新OpenClaw核心
Write-Host "1. Updating OpenClaw core..." -ForegroundColor Yellow
try {
    npm update -g openclaw-cn
    Write-Host "   ✓ OpenClaw core updated" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed to update OpenClaw core: $_" -ForegroundColor Red
}
Write-Host ""

# 2. 更新技能
Write-Host "2. Updating skills..." -ForegroundColor Yellow
$clawdhubPath = "$env:APPDATA\npm\clawdhub.cmd"
if (Test-Path $clawdhubPath) {
    try {
        & clawdhub update --all
        Write-Host "   ✓ Skills updated" -ForegroundColor Green
    } catch {
        Write-Host "   ✗ Failed to update skills: $_" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠ ClawdHub not found, skipping skill updates" -ForegroundColor Yellow
}
Write-Host ""

# 3. 重启服务
Write-Host "3. Restarting OpenClaw gateway..." -ForegroundColor Yellow
try {
    # 停止服务
    $service = Get-Service -Name "OpenClawGateway" -ErrorAction SilentlyContinue
    if ($service) {
        if ($service.Status -eq 'Running') {
            Stop-Service -Name "OpenClawGateway" -Force
            Write-Host "   ✓ Service stopped" -ForegroundColor Green
            Start-Sleep -Seconds 2
        }
        
        Start-Service -Name "OpenClawGateway"
        Write-Host "   ✓ Service started" -ForegroundColor Green
    } else {
        Write-Host "   ⚠ OpenClawGateway service not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Failed to restart service: $_" -ForegroundColor Red
}
Write-Host ""

# 4. 生成报告
Write-Host "4. Update Summary:" -ForegroundColor Cyan
Write-Host "   • Time: $(Get-Date)" -ForegroundColor White
Write-Host "   • Script: $PSCommandPath" -ForegroundColor White
Write-Host "   • User: $env:USERNAME" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# 记录到日志文件
$logDir = "C:\Users\17589\.openclaw\logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}
$logFile = "$logDir\updates.log"
"$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Update script executed" | Out-File -Append -FilePath $logFile

# 保持窗口打开（仅用于测试）
if ($args -contains "--test") {
    Write-Host "Press any key to continue..." -ForegroundColor Gray
    $null = Read-Host
}