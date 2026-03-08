@echo off
echo ========================================
echo 创建双重镜像 - 扎克镜像系统
echo ========================================
echo.

echo 正在创建第一个完整镜像...
echo.

set BACKUP_DIR=%USERPROFILE%\OpenClaw_Mirrors
set TIMESTAMP1=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set MIRROR1=扎克镜像_%TIMESTAMP1%
set PATH1=%BACKUP_DIR%\%MIRROR1%

echo 创建目录: %PATH1%
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
mkdir "%PATH1%"

echo.
echo [镜像1] 备份记忆文件...
if exist "%USERPROFILE%\.openclaw\workspace\memory" (
    xcopy "%USERPROFILE%\.openclaw\workspace\memory" "%PATH1%\memory\" /E /I /Y >nul
    echo ✓ 记忆文件已备份
) else (
    echo ⚠ 未找到记忆文件目录
)

echo.
echo [镜像1] 备份配置文件...
if exist "%USERPROFILE%\.openclaw\config.yaml" (
    copy "%USERPROFILE%\.openclaw\config.yaml" "%PATH1%\" >nul
    echo ✓ 配置文件已备份
) else (
    echo ⚠ 未找到配置文件
)

echo.
echo [镜像1] 备份工作空间文档...
if exist "%USERPROFILE%\.openclaw\workspace\*.md" (
    copy "%USERPROFILE%\.openclaw\workspace\*.md" "%PATH1%\" >nul
    echo ✓ 工作空间文档已备份
)

echo.
echo [镜像1] 创建恢复脚本...
echo @echo off > "%PATH1%\恢复.bat"
echo echo 恢复扎克系统... >> "%PATH1%\恢复.bat"
echo if exist "memory" xcopy "memory" "%%USERPROFILE%%\.openclaw\workspace\memory\" /E /I /Y >> "%PATH1%\恢复.bat"
echo if exist "config.yaml" copy "config.yaml" "%%USERPROFILE%%\.openclaw\" >> "%PATH1%\恢复.bat"
echo if exist "*.md" copy "*.md" "%%USERPROFILE%%\.openclaw\workspace\" >> "%PATH1%\恢复.bat"
echo echo 恢复完成！重启OpenClaw服务。 >> "%PATH1%\恢复.bat"
echo pause >> "%PATH1%\恢复.bat"
echo ✓ 恢复脚本已创建

echo.
echo ========================================
echo 第一个镜像创建完成！
echo 位置: %PATH1%
echo.

timeout /t 2 /nobreak >nul

echo 正在创建第二个完整镜像...
echo.

set TIMESTAMP2=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set MIRROR2=扎克镜像_备份_%TIMESTAMP2%
set PATH2=%BACKUP_DIR%\%MIRROR2%

echo 创建目录: %PATH2%
mkdir "%PATH2%"

echo.
echo [镜像2] 备份记忆文件...
if exist "%USERPROFILE%\.openclaw\workspace\memory" (
    xcopy "%USERPROFILE%\.openclaw\workspace\memory" "%PATH2%\memory\" /E /I /Y >nul
    echo ✓ 记忆文件已备份
)

echo.
echo [镜像2] 备份配置文件...
if exist "%USERPROFILE%\.openclaw\config.yaml" (
    copy "%USERPROFILE%\.openclaw\config.yaml" "%PATH2%\" >nul
    echo ✓ 配置文件已备份
)

echo.
echo [镜像2] 备份工作空间文档...
if exist "%USERPROFILE%\.openclaw\workspace\*.md" (
    copy "%USERPROFILE%\.openclaw\workspace\*.md" "%PATH2%\" >nul
    echo ✓ 工作空间文档已备份
)

echo.
echo [镜像2] 创建恢复脚本...
echo @echo off > "%PATH2%\恢复.bat"
echo echo 恢复扎克系统（备份镜像）... >> "%PATH2%\恢复.bat"
echo if exist "memory" xcopy "memory" "%%USERPROFILE%%\.openclaw\workspace\memory\" /E /I /Y >> "%PATH2%\恢复.bat"
echo if exist "config.yaml" copy "config.yaml" "%%USERPROFILE%%\.openclaw\" >> "%PATH2%\恢复.bat"
echo if exist "*.md" copy "*.md" "%%USERPROFILE%%\.openclaw\workspace\" >> "%PATH2%\恢复.bat"
echo echo 恢复完成！重启OpenClaw服务。 >> "%PATH2%\恢复.bat"
echo pause >> "%PATH2%\恢复.bat"
echo ✓ 恢复脚本已创建

echo.
echo ========================================
echo 双重镜像创建完成！
echo ========================================
echo.
echo 已创建两个完整镜像：
echo.
echo [镜像1 - 主镜像]
echo 名称: %MIRROR1%
echo 路径: %PATH1%
echo 时间: %TIMESTAMP1%
echo.
echo [镜像2 - 备份镜像]
echo 名称: %MIRROR2%
echo 路径: %PATH2%
echo 时间: %TIMESTAMP2%
echo.
echo 包含内容：
echo - 记忆文件（最重要！）
echo - 配置文件
echo - 工作空间文档
echo - 恢复脚本
echo.
echo 建议操作：
echo 1. 将两个镜像文件夹复制到外部存储
echo 2. 测试恢复功能确保可用
echo 3. 每月更新一次镜像
echo.
echo ========================================
echo 完成时间: %date% %time%
echo ========================================
echo.
pause