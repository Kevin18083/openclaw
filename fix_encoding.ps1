# 编码修复工具 - PowerShell版本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "       脚本编码修复工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置工作目录
$workspace = "C:\Users\17589\.openclaw\workspace"
Set-Location $workspace

# 要修复的文件列表
$filesToFix = @(
    "扎克管理面板.bat",
    "fix_openclaw_path.bat", 
    "manage_openclaw.bat",
    "auto_backup.bat",
    "setup_backup_task.bat",
    "health_check.bat",
    "quick_backup.bat",
    "create_openclaw_image.bat",
    "test_restore_demo.bat"
)

Write-Host "正在修复脚本编码..." -ForegroundColor Yellow

$fixedCount = 0
foreach ($file in $filesToFix) {
    $filePath = Join-Path $workspace $file
    
    if (Test-Path $filePath) {
        try {
            # 读取原始内容（ANSI/GBK）
            $content = Get-Content $filePath -Encoding Default -Raw
            
            # 写入UTF-8 with BOM
            [System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
            
            Write-Host "  ✅ $file 编码已修复 (UTF-8 with BOM)" -ForegroundColor Green
            $fixedCount++
        }
        catch {
            Write-Host "  ❌ $file 修复失败: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "  ⚠️ $file 文件不存在" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "修复完成！" -ForegroundColor Cyan
Write-Host "已修复 $fixedCount 个文件" -ForegroundColor Cyan
Write-Host ""

# 测试修复效果
Write-Host "测试修复效果..." -ForegroundColor Yellow
if (Test-Path "扎克管理面板.bat") {
    $testContent = Get-Content "扎克管理面板.bat" -Encoding UTF8 -TotalCount 5
    Write-Host "前5行内容:" -ForegroundColor Gray
    $testContent | ForEach-Object { Write-Host "  $_" }
}

Write-Host ""
Write-Host "按任意键继续..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")