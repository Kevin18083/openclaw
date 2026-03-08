@echo off
REM auto-check-and-restore.bat - 自动检查并恢复关键文件
REM 用法：auto-check-and-restore.bat

echo ========================================
echo   自动检查并恢复关键文件
echo   %DATE% %TIME%
echo ========================================

set USER_HOME=%USERPROFILE%
set MEMORY_FILE=%USER_HOME%\.claude\memory\MEMORY.md
set MEMORY_BACKUP=%USER_HOME%\.claude\memory-backup\MEMORY.md
set SKILLS_DIR=%USER_HOME%\.openclaw\workspace\skills
set SKILLS_BACKUP=%USER_HOME%\.openclaw\workspace\skills-backup
set LOG_FILE=%USER_HOME%\.restore-log.txt

set SWITCHED=0

echo.
echo [1/2] 检查记忆文件...
if exist "%MEMORY_FILE%" (
    echo ✅ 记忆文件存在
) else (
    echo ⚠️  记忆文件不存在！
    if exist "%MEMORY_BACKUP%" (
        echo 🔄 从备份恢复...
        copy /Y "%MEMORY_BACKUP%" "%MEMORY_FILE%" > nul
        echo ✅ 已从备份恢复记忆文件
        echo [%DATE% %TIME%] 记忆文件已从备份恢复 >> "%LOG_FILE%"
        set SWITCHED=1
    ) else (
        echo ❌ 备份文件也不存在！
    )
)

echo.
echo [2/2] 检查技能库...
if exist "%SKILLS_DIR%\code-quality-workflow" (
    echo ✅ 技能库正常
) else (
    echo ⚠️  技能库异常！
    if exist "%SKILLS_BACKUP%\code-quality-workflow" (
        echo 🔄 从备份恢复...
        xcopy /E /I /Y "%SKILLS_BACKUP%" "%SKILLS_DIR%" > nul
        echo ✅ 已从备份恢复技能库
        echo [%DATE% %TIME%] 技能库已从备份恢复 >> "%LOG_FILE%"
        set SWITCHED=1
    ) else (
        echo ❌ 备份技能库也不存在！
    )
)

echo.
echo ========================================
if %SWITCHED%==1 (
    echo ⚠️  已切换/恢复文件，请检查日志
) else (
    echo ✅ 所有文件正常，无需恢复
)
echo ========================================
echo.
