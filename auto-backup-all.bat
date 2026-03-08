@echo off
REM auto-backup-all.bat - 自动备份所有关键文件
REM 用法：auto-backup-all.bat

echo ========================================
echo   自动备份所有关键文件
echo   %DATE% %TIME%
echo ========================================

REM 设置路径
set USER_HOME=%USERPROFILE%
set MEMORY_FILE=%USER_HOME%\.claude\memory\MEMORY.md
set MEMORY_BACKUP=%USER_HOME%\.claude\memory-backup\MEMORY.md
set SKILLS_DIR=%USER_HOME%\.openclaw\workspace\skills
set SKILLS_BACKUP=%USER_HOME%\.openclaw\workspace\skills-backup
set LOG_FILE=%USER_HOME%\.backup-log.txt

REM 创建备份目录
if not exist "%USER_HOME%\.claude\memory-backup" mkdir "%USER_HOME%\.claude\memory-backup"
if not exist "%SKILLS_BACKUP" mkdir "%SKILLS_BACKUP"

echo.
echo [1/3] 备份记忆文件...
if exist "%MEMORY_FILE%" (
    copy /Y "%MEMORY_FILE%" "%MEMORY_BACKUP%" > nul
    echo ✅ 记忆文件已备份
    echo [%DATE% %TIME%] 记忆文件已备份 >> "%LOG_FILE%"
) else (
    echo ⚠️  警告：记忆文件不存在
    echo [%DATE% %TIME%] 警告：记忆文件不存在 >> "%LOG_FILE%"
)

echo.
echo [2/3] 备份技能库...
if exist "%SKILLS_DIR%" (
    rmdir /S /Q "%SKILLS_BACKUP%" 2>nul
    xcopy /E /I /Y "%SKILLS_DIR%" "%SKILLS_BACKUP%" > nul
    echo ✅ 技能库已备份
    echo [%DATE% %TIME%] 技能库已备份 >> "%LOG_FILE%"
) else (
    echo ⚠️  警告：技能库不存在
    echo [%DATE% %TIME%] 警告：技能库不存在 >> "%LOG_FILE%"
)

echo.
echo [3/3] 备份配置文件...
if exist "%USER_HOME%\CLAUDE.md" (
    copy /Y "%USER_HOME%\CLAUDE.md" "%USER_HOME%\CLAUDE.md.backup" > nul
    echo ✅ 配置文件已备份
    echo [%DATE% %TIME%] 配置文件已备份 >> "%LOG_FILE%"
) else (
    echo ⚠️  警告：CLAUDE.md 不存在
)

echo.
echo ========================================
echo   备份完成！
echo ========================================
echo [%DATE% %TIME%] === 备份完成 === >> "%LOG_FILE%"
echo.
