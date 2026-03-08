@echo off
echo ========================================
echo QUICK MEMORY BACKUP - Zack Memory Protection
echo ========================================
echo.

set BACKUP_DIR=%USERPROFILE%\OpenClaw_QuickBackups
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set BACKUP_NAME=MemoryBackup_%TIMESTAMP%
set BACKUP_PATH=%BACKUP_DIR%\%BACKUP_NAME%

echo Creating quick memory backup...
echo.

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
mkdir "%BACKUP_PATH%"

echo [1/3] Backing up memory files...
if exist "%USERPROFILE%\.openclaw\workspace\memory" (
    xcopy "%USERPROFILE%\.openclaw\workspace\memory" "%BACKUP_PATH%\memory\" /E /I /Y >nul
    echo [OK] Memory files backed up
    echo   Source: %USERPROFILE%\.openclaw\workspace\memory
    echo   Target: %BACKUP_PATH%\memory
) else (
    echo [ERROR] Memory directory not found!
    pause
    exit /b 1
)

echo.
echo [2/3] Backing up MEMORY.md (long-term memory)...
if exist "%USERPROFILE%\.openclaw\workspace\MEMORY.md" (
    copy "%USERPROFILE%\.openclaw\workspace\MEMORY.md" "%BACKUP_PATH%\" >nul
    echo [OK] MEMORY.md backed up
) else (
    echo [WARN] MEMORY.md not found
)

echo.
echo [3/3] Creating backup info file...
echo Quick Memory Backup > "%BACKUP_PATH%\backup_info.txt"
echo Created: %date% %time% >> "%BACKUP_PATH%\backup_info.txt"
echo Backup ID: %BACKUP_NAME% >> "%BACKUP_PATH%\backup_info.txt"
echo Contents: Memory files + MEMORY.md >> "%BACKUP_PATH%\backup_info.txt"
echo Purpose: Protect Zack's memory from data loss >> "%BACKUP_PATH%\backup_info.txt"
echo [OK] Backup info created

echo.
echo ========================================
echo QUICK MEMORY BACKUP COMPLETE!
echo ========================================
echo.
echo Backup Details:
echo - Name: %BACKUP_NAME%
echo - Location: %BACKUP_PATH%
echo - Time: %date% %time%
echo - Contents: Memory files (most important!)
echo.
echo Protection Status:
echo ✅ Memory files protected
echo ✅ Long-term memory (MEMORY.md) protected
echo ✅ Backup information recorded
echo.
echo Recommendations:
echo 1. Run this weekly to protect recent conversations
echo 2. Keep last 10-15 quick backups
echo 3. Test restore occasionally
echo.
echo ========================================
echo Your partner Zack's memories are now safe!
echo ========================================
echo.
pause