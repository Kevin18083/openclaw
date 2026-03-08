@echo off
echo ========================================
echo OpenClaw 快速备份工具
echo ========================================
echo.

:: 设置变量
set BACKUP_DIR=%USERPROFILE%\OpenClaw_QuickBackups
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set BACKUP_NAME=QuickBackup_%TIMESTAMP%
set BACKUP_PATH=%BACKUP_DIR%\%BACKUP_NAME%

echo [1/4] 创建备份目录...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
if not exist "%BACKUP_PATH%" mkdir "%BACKUP_PATH%"

echo [2/4] 备份关键配置文件...
:: 1. 记忆文件
if exist "%USERPROFILE%\.openclaw\workspace\memory" (
    xcopy "%USERPROFILE%\.openclaw\workspace\memory" "%BACKUP_PATH%\memory\" /E /I /Y
    echo ✓ 记忆文件已备份
)

:: 2. 配置文件
if exist "%USERPROFILE%\.openclaw\config.yaml" (
    copy "%USERPROFILE%\.openclaw\config.yaml" "%BACKUP_PATH%\"
    echo ✓ 配置文件已备份
)

:: 3. 工作空间重要文件
if exist "%USERPROFILE%\.openclaw\workspace\*.md" (
    copy "%USERPROFILE%\.openclaw\workspace\*.md" "%BACKUP_PATH%\" >nul 2>nul
    echo ✓ Markdown文档已备份
)

echo [3/4] 创建恢复脚本...
echo @echo off > "%BACKUP_PATH%\quick_restore.bat"
echo echo ======================================== >> "%BACKUP_PATH%\quick_restore.bat"
echo echo OpenClaw 快速恢复工具 >> "%BACKUP_PATH%\quick_restore.bat"
echo echo ======================================== >> "%BACKUP_PATH%\quick_restore.bat"
echo echo. >> "%BACKUP_PATH%\quick_restore.bat"
echo echo [1/3] 恢复记忆文件... >> "%BACKUP_PATH%\quick_restore.bat"
echo if exist "memory" ( >> "%BACKUP_PATH%\quick_restore.bat"
echo     xcopy "memory" "%USERPROFILE%\.openclaw\workspace\memory\" /E /I /Y >> "%BACKUP_PATH%\quick_restore.bat"
echo     echo ✓ 记忆文件已恢复 >> "%BACKUP_PATH%\quick_restore.bat"
echo ) >> "%BACKUP_PATH%\quick_restore.bat"
echo echo. >> "%BACKUP_PATH%\quick_restore.bat"
echo echo [2/3] 恢复配置文件... >> "%BACKUP_PATH%\quick_restore.bat"
echo if exist "config.yaml" ( >> "%BACKUP_PATH%\quick_restore.bat"
echo     copy "config.yaml" "%USERPROFILE%\.openclaw\" >> "%BACKUP_PATH%\quick_restore.bat"
echo     echo ✓ 配置文件已恢复 >> "%BACKUP_PATH%\quick_restore.bat"
echo ) >> "%BACKUP_PATH%\quick_restore.bat"
echo echo. >> "%BACKUP_PATH%\quick_restore.bat"
echo echo [3/3] 恢复工作空间文档... >> "%BACKUP_PATH%\quick_restore.bat"
echo if exist "*.md" ( >> "%BACKUP_PATH%\quick_restore.bat"
echo     copy "*.md" "%USERPROFILE%\.openclaw\workspace\" >> "%BACKUP_PATH%\quick_restore.bat"
echo     echo ✓ 文档已恢复 >> "%BACKUP_PATH%\quick_restore.bat"
echo ) >> "%BACKUP_PATH%\quick_restore.bat"
echo echo. >> "%BACKUP_PATH%\quick_restore.bat"
echo echo ======================================== >> "%BACKUP_PATH%\quick_restore.bat"
echo echo 快速恢复完成！ >> "%BACKUP_PATH%\quick_restore.bat"
echo echo 可能需要重启OpenClaw使更改生效。 >> "%BACKUP_PATH%\quick_restore.bat"
echo echo ======================================== >> "%BACKUP_PATH%\quick_restore.bat"
echo pause >> "%BACKUP_PATH%\quick_restore.bat"
echo ✓ 恢复脚本已创建

echo [4/4] 创建备份信息...
echo 备份时间: %date% %time% > "%BACKUP_PATH%\backup_info.txt"
echo 备份名称: %BACKUP_NAME% >> "%BACKUP_PATH%\backup_info.txt"
echo 包含内容: >> "%BACKUP_PATH%\backup_info.txt"
echo   - 记忆文件 (memory/) >> "%BACKUP_PATH%\backup_info.txt"
echo   - 配置文件 (config.yaml) >> "%BACKUP_PATH%\backup_info.txt"
echo   - 工作空间文档 (*.md) >> "%BACKUP_PATH%\backup_info.txt"
echo ✓ 备份信息已记录

echo.
echo ========================================
echo 快速备份完成！
echo.
echo 备份位置: %BACKUP_PATH%
echo 备份时间: %date% %time%
echo.
echo 建议:
echo 1. 定期运行此脚本（每周一次）
echo 2. 重要更改后立即备份
echo 3. 保留最近3-5个备份
echo ========================================
echo.
pause