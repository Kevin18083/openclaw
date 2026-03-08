@echo off
echo ========================================
echo 扎克镜像系统 - 维护工具
echo ========================================
echo.

echo 维护功能：
echo 1. 清理旧备份（保留最近5个）
echo 2. 检查备份完整性
echo 3. 查看备份统计信息
echo 4. 设置自动备份计划
echo.

set /p choice=请选择维护操作 (1-4): 

if "%choice%"=="1" goto cleanup
if "%choice%"=="2" goto check
if "%choice%"=="3" goto stats
if "%choice%"=="4" goto schedule
echo 无效选择
pause
exit /b

:cleanup
echo.
echo ========================================
echo 清理旧备份文件
echo ========================================
echo.

echo 正在扫描备份目录...
set BACKUP_ROOT=%USERPROFILE%\OpenClaw_Mirrors
set QUICK_ROOT=%USERPROFILE%\OpenClaw_QuickBackups

echo.
echo [1/3] 检查完整镜像备份...
if exist "%BACKUP_ROOT%" (
    echo 找到完整镜像目录：%BACKUP_ROOT%
    dir "%BACKUP_ROOT%" /b /ad | find /c /v "" >nul
    echo 建议：保留最近3-5个完整镜像
) else (
    echo ⚠ 未找到完整镜像目录
)

echo.
echo [2/3] 检查快速备份...
if exist "%QUICK_ROOT%" (
    echo 找到快速备份目录：%QUICK_ROOT%
    dir "%QUICK_ROOT%" /b /ad | find /c /v "" >nul
    echo 建议：保留最近10-15个快速备份
) else (
    echo ⚠ 未找到快速备份目录
)

echo.
echo [3/3] 手动清理说明：
echo.
echo 要清理旧备份，请：
echo 1. 打开资源管理器
echo 2. 导航到上述目录
echo 3. 按日期排序文件夹
echo 4. 删除最旧的备份
echo.
echo 注意：请勿删除所有备份，保留最近的几个。
echo.
pause
exit /b

:check
echo.
echo ========================================
echo 检查备份完整性
echo ========================================
echo.

echo 请选择要检查的备份类型：
echo 1. 检查完整镜像
echo 2. 检查快速备份
echo.
set /p check_type=请选择 (1-2): 

if "%check_type%"=="1" (
    set CHECK_DIR=%USERPROFILE%\OpenClaw_Mirrors
    set CHECK_NAME=完整镜像
) else if "%check_type%"=="2" (
    set CHECK_DIR=%USERPROFILE%\OpenClaw_QuickBackups
    set CHECK_NAME=快速备份
) else (
    echo 无效选择
    pause
    exit /b
)

if not exist "%CHECK_DIR%" (
    echo.
    echo ❌ 未找到%CHECK_NAME%目录：%CHECK_DIR%
    pause
    exit /b
)

echo.
echo 正在检查%CHECK_NAME%...
echo 目录：%CHECK_DIR%
echo.

set /p specific_dir=请输入要检查的具体备份文件夹名称（留空检查最新）： 

if "%specific_dir%"=="" (
    echo 查找最新备份...
    for /f "delims=" %%i in ('dir "%CHECK_DIR%" /b /ad /od') do set LATEST=%%i
    set CHECK_PATH=%CHECK_DIR%\!LATEST!
) else (
    set CHECK_PATH=%CHECK_DIR%\%specific_dir%
)

if not exist "%CHECK_PATH%" (
    echo.
    echo ❌ 未找到备份文件夹：%CHECK_PATH%
    pause
    exit /b
)

echo.
echo 检查备份：%CHECK_PATH%
echo.

echo [1/3] 检查文件结构...
if exist "%CHECK_PATH%\memory" (
    echo ✓ 找到记忆文件目录
) else (
    echo ⚠ 未找到记忆文件目录
)

if exist "%CHECK_PATH%\*.md" (
    dir "%CHECK_PATH%\*.md" | find "File(s)" >nul
    echo ✓ 找到文档文件
) else (
    echo ⚠ 未找到文档文件
)

echo.
echo [2/3] 检查恢复脚本...
if exist "%CHECK_PATH%\恢复_扎克.bat" (
    echo ✓ 找到恢复脚本
) else (
    echo ❌ 未找到恢复脚本
)

echo.
echo [3/3] 检查文件大小...
for /f "tokens=3" %%a in ('dir "%CHECK_PATH%" ^| find "bytes"') do set TOTAL_SIZE=%%a
echo 备份总大小：%TOTAL_SIZE%

echo.
echo ========================================
echo 检查完成
echo ========================================
echo.
echo 建议：
if exist "%CHECK_PATH%\恢复_扎克.bat" (
    echo 1. 可以测试恢复功能
) else (
    echo 1. ❌ 此备份缺少恢复脚本
)
echo 2. 确保备份存储在安全位置
echo 3. 定期检查备份完整性
echo.
pause
exit /b

:stats
echo.
echo ========================================
echo 备份统计信息
echo ========================================
echo.

echo 正在收集统计信息...
echo.

set FULL_DIR=%USERPROFILE%\OpenClaw_Mirrors
set QUICK_DIR=%USERPROFILE%\OpenClaw_QuickBackups

echo [完整镜像统计]
if exist "%FULL_DIR%" (
    dir "%FULL_DIR%" /b /ad | find /c /v "" >nul
    echo 备份数量：获取中...
    echo 最新备份：获取中...
) else (
    echo ⚠ 无完整镜像备份
)

echo.
echo [快速备份统计]
if exist "%QUICK_DIR%" (
    dir "%QUICK_DIR%" /b /ad | find /c /v "" >nul
    echo 备份数量：获取中...
    echo 最新备份：获取中...
) else (
    echo ⚠ 无快速备份
)

echo.
echo [磁盘空间使用]
echo 完整镜像目录：%FULL_DIR%
echo 快速备份目录：%QUICK_DIR%
echo.
echo 注意：实际统计需要手动检查目录。
echo.
pause
exit /b

:schedule
echo.
echo ========================================
echo 设置自动备份计划
echo ========================================
echo.

echo 自动备份可以通过Windows任务计划程序设置：
echo.
echo 建议计划：
echo 1. 每周一快速备份记忆文件
echo 2. 每月1号创建完整镜像
echo.
echo 设置步骤：
echo 1. 打开"任务计划程序"
echo 2. 创建基本任务
echo 3. 设置触发时间
echo 4. 设置操作为运行脚本
echo 5. 选择"扎克镜像_正式版.bat"
echo.
echo 脚本路径：
echo C:\Users\17589\.openclaw\workspace\扎克镜像_正式版.bat
echo.
echo 参数说明：
echo 快速备份：运行后选择2
echo 完整镜像：运行后选择1
echo.
pause
exit /b