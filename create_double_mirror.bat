@echo off
echo ========================================
echo CREATE DOUBLE MIRROR - Zack Backup System
echo ========================================
echo.

echo Creating first complete mirror...
echo.

set BACKUP_DIR=%USERPROFILE%\OpenClaw_Mirrors
set TIMESTAMP1=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set MIRROR1=Zack_Mirror_%TIMESTAMP1%
set PATH1=%BACKUP_DIR%\%MIRROR1%

echo Directory: %PATH1%
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
mkdir "%PATH1%"

echo.
echo [Mirror 1] Backing up memory files...
if exist "%USERPROFILE%\.openclaw\workspace\memory" (
    xcopy "%USERPROFILE%\.openclaw\workspace\memory" "%PATH1%\memory\" /E /I /Y >nul
    echo [OK] Memory files backed up
) else (
    echo [WARN] Memory directory not found
)

echo.
echo [Mirror 1] Backing up config file...
if exist "%USERPROFILE%\.openclaw\config.yaml" (
    copy "%USERPROFILE%\.openclaw\config.yaml" "%PATH1%\" >nul
    echo [OK] Config file backed up
) else (
    echo [WARN] Config file not found
)

echo.
echo [Mirror 1] Backing up workspace documents...
if exist "%USERPROFILE%\.openclaw\workspace\*.md" (
    copy "%USERPROFILE%\.openclaw\workspace\*.md" "%PATH1%\" >nul
    echo [OK] Workspace documents backed up
)

echo.
echo [Mirror 1] Creating restore script...
echo @echo off > "%PATH1%\restore.bat"
echo echo Restoring Zack system... >> "%PATH1%\restore.bat"
echo if exist "memory" xcopy "memory" "%%USERPROFILE%%\.openclaw\workspace\memory\" /E /I /Y >> "%PATH1%\restore.bat"
echo if exist "config.yaml" copy "config.yaml" "%%USERPROFILE%%\.openclaw\" >> "%PATH1%\restore.bat"
echo if exist "*.md" copy "*.md" "%%USERPROFILE%%\.openclaw\workspace\" >> "%PATH1%\restore.bat"
echo echo Restore complete! Restart OpenClaw service. >> "%PATH1%\restore.bat"
echo pause >> "%PATH1%\restore.bat"
echo [OK] Restore script created

echo.
echo ========================================
echo First mirror created successfully!
echo Location: %PATH1%
echo.

timeout /t 2 /nobreak >nul

echo Creating second complete mirror...
echo.

set TIMESTAMP2=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set MIRROR2=Zack_Mirror_Backup_%TIMESTAMP2%
set PATH2=%BACKUP_DIR%\%MIRROR2%

echo Directory: %PATH2%
mkdir "%PATH2%"

echo.
echo [Mirror 2] Backing up memory files...
if exist "%USERPROFILE%\.openclaw\workspace\memory" (
    xcopy "%USERPROFILE%\.openclaw\workspace\memory" "%PATH2%\memory\" /E /I /Y >nul
    echo [OK] Memory files backed up
)

echo.
echo [Mirror 2] Backing up config file...
if exist "%USERPROFILE%\.openclaw\config.yaml" (
    copy "%USERPROFILE%\.openclaw\config.yaml" "%PATH2%\" >nul
    echo [OK] Config file backed up
)

echo.
echo [Mirror 2] Backing up workspace documents...
if exist "%USERPROFILE%\.openclaw\workspace\*.md" (
    copy "%USERPROFILE%\.openclaw\workspace\*.md" "%PATH2%\" >nul
    echo [OK] Workspace documents backed up
)

echo.
echo [Mirror 2] Creating restore script...
echo @echo off > "%PATH2%\restore.bat"
echo echo Restoring Zack system (Backup Mirror)... >> "%PATH2%\restore.bat"
echo if exist "memory" xcopy "memory" "%%USERPROFILE%%\.openclaw\workspace\memory\" /E /I /Y >> "%PATH2%\restore.bat"
echo if exist "config.yaml" copy "config.yaml" "%%USERPROFILE%%\.openclaw\" >> "%PATH2%\restore.bat"
echo if exist "*.md" copy "*.md" "%%USERPROFILE%%\.openclaw\workspace\" >> "%PATH2%\restore.bat"
echo echo Restore complete! Restart OpenClaw service. >> "%PATH2%\restore.bat"
echo pause >> "%PATH2%\restore.bat"
echo [OK] Restore script created

echo.
echo ========================================
echo DOUBLE MIRROR CREATION COMPLETE!
echo ========================================
echo.
echo Two complete mirrors created:
echo.
echo [Mirror 1 - Primary]
echo Name: %MIRROR1%
echo Path: %PATH1%
echo Time: %TIMESTAMP1%
echo.
echo [Mirror 2 - Backup]
echo Name: %MIRROR2%
echo Path: %PATH2%
echo Time: %TIMESTAMP2%
echo.
echo Contents:
echo - Memory files (Most important!)
echo - Configuration file
echo - Workspace documents
echo - Restore script
echo.
echo Recommended actions:
echo 1. Copy both mirror folders to external storage
echo 2. Test restore function to ensure it works
echo 3. Update mirrors monthly
echo.
echo ========================================
echo Completion time: %date% %time%
echo ========================================
echo.
pause