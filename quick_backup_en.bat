@echo off
echo ========================================
echo     OpenClaw Quick Backup Tool
echo ========================================
echo.
echo Backup time: %date% %time%
echo.

set BACKUP_DIR=C:\Users\17589\OpenClaw_QuickBackups
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set BACKUP_NAME=QuickBackup_%TIMESTAMP%
set BACKUP_PATH=%BACKUP_DIR%\%BACKUP_NAME%

echo [1/4] Creating backup directory...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
if not exist "%BACKUP_PATH%" mkdir "%BACKUP_PATH%"

echo [2/4] Backing up critical config files...
:: 1. Memory files
if exist "C:\Users\17589\.openclaw\workspace\memory" (
    xcopy "C:\Users\17589\.openclaw\workspace\memory" "%BACKUP_PATH%\memory\" /E /I /Y >nul
    echo   Memory files backed up
) else (
    echo   Memory directory not found
)

:: 2. Config file
if exist "C:\Users\17589\.openclaw\config.json" (
    copy "C:\Users\17589\.openclaw\config.json" "%BACKUP_PATH%\" >nul
    echo   Config file backed up
) else (
    echo   Config file not found
)

:: 3. Workspace files
if exist "C:\Users\17589\.openclaw\workspace" (
    xcopy "C:\Users\17589\.openclaw\workspace\*.md" "%BACKUP_PATH%\" /Y >nul
    xcopy "C:\Users\17589\.openclaw\workspace\*.bat" "%BACKUP_PATH%\" /Y >nul
    echo   Workspace files backed up
) else (
    echo   Workspace not found
)

echo [3/4] Creating restore script...
echo @echo off > "%BACKUP_PATH%\restore.bat"
echo echo Restoring OpenClaw from backup... >> "%BACKUP_PATH%\restore.bat"
echo echo. >> "%BACKUP_PATH%\restore.bat"
echo echo 1. Restoring memory files... >> "%BACKUP_PATH%\restore.bat"
echo xcopy "%%~dp0memory" "C:\Users\17589\.openclaw\workspace\memory\" /E /I /Y >> "%BACKUP_PATH%\restore.bat"
echo echo 2. Restoring config file... >> "%BACKUP_PATH%\restore.bat"
echo copy "%%~dp0config.json" "C:\Users\17589\.openclaw\" /Y >> "%BACKUP_PATH%\restore.bat"
echo echo 3. Restoring workspace files... >> "%BACKUP_PATH%\restore.bat"
echo xcopy "%%~dp0*.md" "C:\Users\17589\.openclaw\workspace\" /Y >> "%BACKUP_PATH%\restore.bat"
echo xcopy "%%~dp0*.bat" "C:\Users\17589\.openclaw\workspace\" /Y >> "%BACKUP_PATH%\restore.bat"
echo echo. >> "%BACKUP_PATH%\restore.bat"
echo echo [SUCCESS] Restore completed! Restart OpenClaw service. >> "%BACKUP_PATH%\restore.bat"
echo pause >> "%BACKUP_PATH%\restore.bat"
echo   Restore script created

echo [4/4] Cleaning old backups (keep last 3)...
for /f "skip=3 delims=" %%i in ('dir "%BACKUP_DIR%" /b /ad /o-d') do (
    rmdir "%BACKUP_DIR%\%%i" /s /q >nul 2>nul
)

echo.
echo ========================================
echo Backup completed successfully!
echo Backup location: %BACKUP_PATH%
echo Backup time: %date% %time%
echo ========================================
echo.
echo Press any key to exit...
pause >nul