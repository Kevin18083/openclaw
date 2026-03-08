@echo off
chcp 65001 >nul
echo ========================================
echo       脚本编码修复工具
echo ========================================
echo.

echo 正在修复脚本编码为UTF-8...
echo.

:: 使用PowerShell转换编码
powershell -Command ^
    "$files = @('扎克管理面板.bat','fix_openclaw_path.bat','manage_openclaw.bat','auto_backup.bat','setup_backup_task.bat','health_check.bat','quick_backup.bat','create_openclaw_image.bat','test_restore_demo.bat');" ^
    "foreach ($f in $files) {" ^
    "  $path = 'C:\Users\17589\.openclaw\workspace\' + $f;" ^
    "  if (Test-Path $path) {" ^
    "    $content = Get-Content $path -Encoding Default -Raw;" ^
    "    [System.IO.File]::WriteAllText($path, $content, [System.Text.Encoding]::UTF8);" ^
    "    Write-Host '  ' $f '-> UTF-8' -ForegroundColor Green;" ^
    "  }" ^
    "}"

echo.
echo 修复完成！
echo.
pause