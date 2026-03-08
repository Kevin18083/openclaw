# OpenClaw性能监控脚本
# 用法: .\performance-monitor.ps1

param(
    [int]$Duration = 60,  # 监控时长(秒)
    [int]$Interval = 5    # 采样间隔(秒)
)

Write-Host "🔍 OpenClaw性能监控启动..." -ForegroundColor Cyan
Write-Host "监控时长: $Duration 秒 | 采样间隔: $Interval 秒" -ForegroundColor Yellow
Write-Host "=" * 50

$endTime = (Get-Date).AddSeconds($Duration)
$sampleCount = 0

# 性能计数器
$metrics = @{
    "CPU使用率(%)" = 0
    "内存使用(MB)" = 0
    "响应时间(ms)" = 0
    "活动会话" = 0
    "队列长度" = 0
}

while ((Get-Date) -lt $endTime) {
    $sampleCount++
    Write-Host "`n采样 #$sampleCount - $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
    
    # 1. 检查OpenClaw进程
    $openclawProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | 
        Where-Object { $_.ProcessName -eq "node" -and $_.Path -like "*openclaw*" }
    
    if ($openclawProcesses) {
        $totalCPU = 0
        $totalMemory = 0
        
        foreach ($proc in $openclawProcesses) {
            $cpu = [math]::Round($proc.CPU, 2)
            $memory = [math]::Round($proc.WorkingSet / 1MB, 2)
            $totalCPU += $cpu
            $totalMemory += $memory
            
            Write-Host "  PID $($proc.Id): CPU=$cpu% | 内存=${memory}MB" -ForegroundColor Gray
        }
        
        $metrics["CPU使用率(%)"] = [math]::Round($totalCPU, 2)
        $metrics["内存使用(MB)"] = [math]::Round($totalMemory, 2)
    } else {
        Write-Host "  ⚠️ 未找到OpenClaw进程" -ForegroundColor Yellow
    }
    
    # 2. 检查网络连接
    try {
        $pingResult = Test-Connection -ComputerName "www.baidu.com" -Count 1 -ErrorAction Stop
        $metrics["响应时间(ms)"] = $pingResult.ResponseTime
        Write-Host "  🌐 网络延迟: $($pingResult.ResponseTime)ms" -ForegroundColor Gray
    } catch {
        Write-Host "  ❌ 网络连接失败" -ForegroundColor Red
        $metrics["响应时间(ms)"] = -1
    }
    
    # 3. 检查系统负载
    $systemCPU = (Get-Counter '\Processor(_Total)\% Processor Time').CounterSamples.CookedValue
    $systemMemory = (Get-Counter '\Memory\Available MBytes').CounterSamples.CookedValue
    
    Write-Host "  💻 系统CPU: $([math]::Round($systemCPU, 1))% | 可用内存: ${systemMemory}MB" -ForegroundColor Gray
    
    # 4. 显示当前指标
    Write-Host "`n📊 当前性能指标:" -ForegroundColor Cyan
    foreach ($key in $metrics.Keys) {
        $value = $metrics[$key]
        $color = if ($key -eq "响应时间(ms)" -and $value -gt 100) { "Red" }
                elseif ($key -eq "CPU使用率(%)" -and $value -gt 80) { "Red" }
                elseif ($key -eq "内存使用(MB)" -and $value -gt 500) { "Yellow" }
                else { "White" }
        
        Write-Host "  $key : $value" -ForegroundColor $color
    }
    
    # 5. 建议
    if ($metrics["CPU使用率(%)"] -gt 70) {
        Write-Host "  ⚠️ 建议: CPU使用率较高，考虑减少并发任务" -ForegroundColor Yellow
    }
    if ($metrics["内存使用(MB)"] -gt 500) {
        Write-Host "  ⚠️ 建议: 内存使用较高，考虑清理缓存" -ForegroundColor Yellow
    }
    if ($metrics["响应时间(ms)"] -gt 200) {
        Write-Host "  ⚠️ 建议: 网络延迟较高，检查网络连接" -ForegroundColor Yellow
    }
    
    # 等待下一个采样
    if ((Get-Date) -lt $endTime) {
        Start-Sleep -Seconds $Interval
    }
}

Write-Host "`n" + "=" * 50
Write-Host "✅ 性能监控完成" -ForegroundColor Green
Write-Host "总采样数: $sampleCount 次" -ForegroundColor Cyan
Write-Host "监控报告已保存到: performance-report-$((Get-Date).ToString('yyyyMMdd-HHmmss')).txt" -ForegroundColor Cyan

# 生成报告
$report = @"
OpenClaw性能监控报告
生成时间: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
监控时长: $Duration 秒
采样间隔: $Interval 秒
总采样数: $sampleCount 次

最终性能指标:
$(foreach ($key in $metrics.Keys) {
    "  $key : $($metrics[$key])"
})

建议:
$(if ($metrics["CPU使用率(%)"] -gt 70) { "  - 优化CPU使用，减少并发任务" })
$(if ($metrics["内存使用(MB)"] -gt 500) { "  - 清理内存缓存，重启服务" })
$(if ($metrics["响应时间(ms)"] -gt 200) { "  - 检查网络连接质量" })
"@

$reportPath = "C:\Users\17589\.openclaw\workspace\performance-report-$((Get-Date).ToString('yyyyMMdd-HHmmss')).txt"
$report | Out-File -FilePath $reportPath -Encoding UTF8

Write-Host "`n📈 快速性能检查命令:" -ForegroundColor Magenta
Write-Host "  1. 实时监控: .\performance-monitor.ps1 -Duration 30 -Interval 2" -ForegroundColor Gray
Write-Host "  2. 检查进程: Get-Process | Where-Object { `$_.CPU -gt 50 }" -ForegroundColor Gray
Write-Host "  3. 清理缓存: Remove-Item `"C:\Users\17589\.openclaw\temp\*`" -Recurse -Force" -ForegroundColor Gray