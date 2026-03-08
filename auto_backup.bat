@echo off
echo ========================================
echo        OpenClaw 自动备份工具
echo ========================================
echo.
echo 备份时间: %date% %time%
echo.

set "BACKUP_DIR=%USERPROFILE%\OpenClaw_Backups"
set "BACKUP_NAME=OpenClaw_Backup_%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%"
set "SOURCE_DIR=%USERPROFILE%\.openclaw"

echo 1. 创建备份目录...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
if not exist "%BACKUP_DIR%\%BACKUP_NAME%" mkdir "%BACKUP_DIR%\%BACKUP_NAME%"

echo 2. 备份配置文件...
xcopy "%SOURCE_DIR%\config.json" "%BACKUP_DIR%\%BACKUP_NAME%\" /Y >nul
if %errorlevel% equ 0 echo   ✅ config.json 已备份
if %errorlevel% neq 0 echo   ❌ config.json 备份失败

echo 3. 备份工作空间...
robocopy "%SOURCE_DIR%\workspace" "%BACKUP_DIR%\%BACKUP_NAME%\workspace" /E /NP /NFL /NDL >nul
if %errorlevel% leq 7 echo   ✅ workspace 已备份
if %errorlevel% gtr 7 echo   ❌ workspace 备份失败

echo 4. 备份记忆文件...
robocopy "%SOURCE_DIR%\workspace\memory" "%BACKUP_DIR%\%BACKUP_NAME%\memory" /E /NP /NFL /NDL >nul
if %errorlevel% leq 7 echo   ✅ memory 已备份
if %errorlevel% gtr 7 echo   ❌ memory 备份失败

echo.
echo 5. 创建恢复脚本...
echo @echo off > "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo echo 正在从备份恢复 OpenClaw... >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo echo. >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo echo 1. 恢复配置文件... >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo copy "%~dp0config.json" "%USERPROFILE%\.openclaw\" /Y >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo echo 2. 恢复工作空间... >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo robocopy "%~dp0workspace" "%USERPROFILE%\.openclaw\workspace" /E /NP /NFL /NDL >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo echo 3. 恢复记忆文件... >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo robocopy "%~dp0memory" "%USERPROFILE%\.openclaw\workspace\memory" /E /NP /NFL /NDL >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo echo. >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo echo ✅ 恢复完成！请重启OpenClaw服务。 >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo pause >> "%BACKUP_DIR%\%BACKUP_NAME%\restore.bat"
echo   ✅ restore.bat 已创建

echo.
echo 6. 清理旧备份（保留最近7天）...
forfiles /p "%BACKUP_DIR%" /d -7 /c "cmd /c if @isdir==TRUE echo 保留: @file"
forfiles /p "%BACKUP_DIR%" /d -8 /c "cmd /c if @isdir==TRUE rmdir @path /s /q"

echo.
echo ========================================
echo 备份完成！
echo 备份位置: %BACKUP_DIR%\%BACKUP_NAME%
echo 备份时间: %date% %time%
echo ========================================
echo.
echo 按任意键退出...
pause >nul