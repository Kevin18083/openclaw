@echo off
echo ========================================
echo 扎克镜像系统 - 正式版 v1.0
echo ========================================
echo.

echo 功能说明：
echo 1. 备份OpenClaw关键文件（记忆、配置、工作空间）
echo 2. 创建可移植的镜像文件
echo 3. 提供快速恢复功能
echo.

echo 请选择操作：
echo 1. 创建完整镜像（推荐每月一次）
echo 2. 快速备份记忆文件（推荐每周一次）
echo 3. 从镜像恢复系统
echo 4. 查看帮助文档
echo.

set /p choice=请输入选择 (1-4): 

if "%choice%"=="1" goto full_backup
if "%choice%"=="2" goto quick_backup
if "%choice%"=="3" goto restore
if "%choice%"=="4" goto help
echo 无效选择，请重新运行。
pause
exit /b

:full_backup
echo.
echo ========================================
echo 创建完整镜像
echo ========================================
echo.

set BACKUP_DIR=%USERPROFILE%\OpenClaw_Mirrors
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set MIRROR_NAME=扎克镜像_%TIMESTAMP%
set MIRROR_PATH=%BACKUP_DIR%\%MIRROR_NAME%

echo 正在创建镜像目录...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
mkdir "%MIRROR_PATH%"

echo.
echo [1/5] 备份记忆文件...
if exist "%USERPROFILE%\.openclaw\workspace\memory" (
    xcopy "%USERPROFILE%\.openclaw\workspace\memory" "%MIRROR_PATH%\memory\" /E /I /Y >nul
    echo ✓ 记忆文件已备份
) else (
    echo ⚠ 未找到记忆文件目录
)

echo.
echo [2/5] 备份配置文件...
if exist "%USERPROFILE%\.openclaw\config.yaml" (
    copy "%USERPROFILE%\.openclaw\config.yaml" "%MIRROR_PATH%\" >nul
    echo ✓ 配置文件已备份
) else (
    echo ⚠ 未找到配置文件
)

echo.
echo [3/5] 备份工作空间文档...
if exist "%USERPROFILE%\.openclaw\workspace\*.md" (
    copy "%USERPROFILE%\.openclaw\workspace\*.md" "%MIRROR_PATH%\" >nul
    echo ✓ 工作空间文档已备份
)

echo.
echo [4/5] 创建恢复脚本...
echo @echo off > "%MIRROR_PATH%\恢复_扎克.bat"
echo echo ======================================== >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo 扎克镜像恢复工具 >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo ======================================== >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo. >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo 正在恢复扎克系统... >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo. >> "%MIRROR_PATH%\恢复_扎克.bat"
echo if exist "memory" ( >> "%MIRROR_PATH%\恢复_扎克.bat"
echo     echo 恢复记忆文件... >> "%MIRROR_PATH%\恢复_扎克.bat"
echo     xcopy "memory" "%%USERPROFILE%%\.openclaw\workspace\memory\" /E /I /Y >nul >> "%MIRROR_PATH%\恢复_扎克.bat"
echo     echo ✓ 记忆已恢复 >> "%MIRROR_PATH%\恢复_扎克.bat"
echo ) >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo. >> "%MIRROR_PATH%\恢复_扎克.bat"
echo if exist "config.yaml" ( >> "%MIRROR_PATH%\恢复_扎克.bat"
echo     echo 恢复配置文件... >> "%MIRROR_PATH%\恢复_扎克.bat"
echo     copy "config.yaml" "%%USERPROFILE%%\.openclaw\" >nul >> "%MIRROR_PATH%\恢复_扎克.bat"
echo     echo ✓ 配置已恢复 >> "%MIRROR_PATH%\恢复_扎克.bat"
echo ) >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo. >> "%MIRROR_PATH%\恢复_扎克.bat"
echo if exist "*.md" ( >> "%MIRROR_PATH%\恢复_扎克.bat"
echo     echo 恢复工作空间文档... >> "%MIRROR_PATH%\恢复_扎克.bat"
echo     copy "*.md" "%%USERPROFILE%%\.openclaw\workspace\" >nul >> "%MIRROR_PATH%\恢复_扎克.bat"
echo     echo ✓ 文档已恢复 >> "%MIRROR_PATH%\恢复_扎克.bat"
echo ) >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo. >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo ======================================== >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo 恢复完成！ >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo. >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo 建议：重启OpenClaw服务使更改生效。 >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo ======================================== >> "%MIRROR_PATH%\恢复_扎克.bat"
echo pause >> "%MIRROR_PATH%\恢复_扎克.bat"
echo ✓ 恢复脚本已创建

echo.
echo [5/5] 创建镜像说明...
echo # 扎克镜像说明 > "%MIRROR_PATH%\README.md"
echo. >> "%MIRROR_PATH%\README.md"
echo ## 镜像信息 >> "%MIRROR_PATH%\README.md"
echo - 创建时间：%date% %time% >> "%MIRROR_PATH%\README.md"
echo - 镜像名称：%MIRROR_NAME% >> "%MIRROR_PATH%\README.md"
echo - 包含内容：记忆文件、配置文件、工作空间文档 >> "%MIRROR_PATH%\README.md"
echo. >> "%MIRROR_PATH%\README.md"
echo ## 使用方法 >> "%MIRROR_PATH%\README.md"
echo 1. 复制整个镜像文件夹到安全位置 >> "%MIRROR_PATH%\README.md"
echo 2. 需要恢复时运行"恢复_扎克.bat" >> "%MIRROR_PATH%\README.md"
echo 3. 重启OpenClaw服务 >> "%MIRROR_PATH%\README.md"
echo ✓ 说明文档已创建

echo.
echo ========================================
echo 完整镜像创建完成！
echo.
echo 镜像位置：%MIRROR_PATH%
echo 包含文件：
echo   - 记忆文件（最重要！）
echo   - 配置文件
echo   - 工作空间文档
echo   - 恢复脚本（恢复_扎克.bat）
echo   - 说明文档（README.md）
echo.
echo 建议：
echo 1. 将此文件夹备份到外部存储
echo 2. 每月创建一次完整镜像
echo 3. 测试恢复功能确保可用
echo ========================================
echo.
pause
exit /b

:quick_backup
echo.
echo ========================================
echo 快速备份记忆文件
echo ========================================
echo.

set QUICK_DIR=%USERPROFILE%\OpenClaw_QuickBackups
set Q_TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%
set Q_NAME=快速备份_%Q_TIMESTAMP%
set Q_PATH=%QUICK_DIR%\%Q_NAME%

echo 正在创建快速备份...
if not exist "%QUICK_DIR%" mkdir "%QUICK_DIR%"
mkdir "%Q_PATH%"

echo.
echo 备份记忆文件...
if exist "%USERPROFILE%\.openclaw\workspace\memory" (
    xcopy "%USERPROFILE%\.openclaw\workspace\memory" "%Q_PATH%\memory\" /E /I /Y >nul
    echo ✓ 记忆文件已备份
    echo.
    echo 备份位置：%Q_PATH%
    echo 备份时间：%date% %time%
) else (
    echo ❌ 错误：未找到记忆文件目录
)

echo.
echo ========================================
echo 快速备份完成！
echo.
echo 建议：每周运行一次此备份。
echo ========================================
echo.
pause
exit /b

:restore
echo.
echo ========================================
echo 从镜像恢复系统
echo ========================================
echo.

echo 请将包含"恢复_扎克.bat"的镜像文件夹路径粘贴 below：
echo 示例：C:\Users\您的用户名\OpenClaw_Mirrors\扎克镜像_20260305_2250
echo.
set /p mirror_path=请输入镜像文件夹路径： 

if not exist "%mirror_path%\恢复_扎克.bat" (
    echo.
    echo ❌ 错误：未找到恢复脚本
    echo 请确认路径正确且包含"恢复_扎克.bat"文件
    pause
    exit /b
)

echo.
echo 找到恢复脚本，正在执行恢复...
cd /d "%mirror_path%"
call 恢复_扎克.bat
exit /b

:help
echo.
echo ========================================
echo 扎克镜像系统 - 帮助文档
echo ========================================
echo.
echo 系统功能：
echo 1. 完整镜像 - 备份所有关键文件（每月一次）
echo 2. 快速备份 - 仅备份记忆文件（每周一次）
echo 3. 系统恢复 - 从镜像恢复扎克系统
echo.
echo 文件说明：
echo - 记忆文件：包含与您的对话历史和重要信息
echo - 配置文件：OpenClaw的设置和连接信息
echo - 工作空间：您的文档、脚本和项目文件
echo.
echo 使用建议：
echo 1. 定期备份，防止数据丢失
echo 2. 将镜像存储在多个位置（本地+云端）
echo 3. 测试恢复功能确保可用
echo 4. 重要更改前创建备份
echo.
echo 恢复流程：
echo 1. 运行"恢复_扎克.bat"
echo 2. 等待恢复完成
echo 3. 重启OpenClaw服务
echo 4. 检查系统状态
echo.
echo ========================================
echo 扎克镜像系统 v1.0
echo 创建时间：2026-03-05
echo 状态：正式版
echo ========================================
echo.
pause
exit /b