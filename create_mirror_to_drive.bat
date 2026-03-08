@echo off
echo ========================================
echo 扎克镜像创建 - D盘存储版
echo ========================================
echo.

echo 新的存储策略：镜像直接存储到 D:\AAAAAA
echo.

set MIRROR_ROOT=D:\AAAAAA\OpenClaw_Mirrors
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set MIRROR_NAME=扎克镜像_%TIMESTAMP%
set MIRROR_PATH=%MIRROR_ROOT%\%MIRROR_NAME%

echo 正在创建镜像到D盘...
echo 目标路径: %MIRROR_PATH%
echo.

if not exist "%MIRROR_ROOT%" mkdir "%MIRROR_ROOT%"
mkdir "%MIRROR_PATH%"

echo [1/4] 备份记忆文件...
if exist "%USERPROFILE%\.openclaw\workspace\memory" (
    xcopy "%USERPROFILE%\.openclaw\workspace\memory" "%MIRROR_PATH%\memory\" /E /I /Y >nul
    echo ✓ 记忆文件已备份
) else (
    echo ⚠ 未找到记忆文件目录
)

echo.
echo [2/4] 备份配置文件...
if exist "%USERPROFILE%\.openclaw\config.yaml" (
    copy "%USERPROFILE%\.openclaw\config.yaml" "%MIRROR_PATH%\" >nul
    echo ✓ 配置文件已备份
) else (
    echo ⚠ 未找到配置文件
)

echo.
echo [3/4] 备份工作空间文档...
if exist "%USERPROFILE%\.openclaw\workspace\*.md" (
    copy "%USERPROFILE%\.openclaw\workspace\*.md" "%MIRROR_PATH%\" >nul
    echo ✓ 工作空间文档已备份
)

echo.
echo [4/4] 创建恢复脚本...
echo @echo off > "%MIRROR_PATH%\恢复_扎克.bat"
echo echo ======================================== >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo 扎克镜像恢复工具 >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo ======================================== >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo. >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo 正在从D盘恢复扎克系统... >> "%MIRROR_PATH%\恢复_扎克.bat"
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
echo echo 建议：重启OpenClaw服务使更改生效。 >> "%MIRROR_PATH%\恢复_扎克.bat"
echo echo ======================================== >> "%MIRROR_PATH%\恢复_扎克.bat"
echo pause >> "%MIRROR_PATH%\恢复_扎克.bat"
echo ✓ 恢复脚本已创建

echo.
echo ========================================
echo 镜像创建完成！
echo ========================================
echo.
echo 镜像信息：
echo - 名称: %MIRROR_NAME%
echo - 位置: %MIRROR_PATH%
echo - 时间: %TIMESTAMP%
echo.
echo 包含内容：
echo - 记忆文件（最重要！）
echo - 配置文件
echo - 工作空间文档
echo - 恢复脚本
echo.
echo 恢复方法：
echo 1. 导航到: %MIRROR_PATH%
echo 2. 运行: 恢复_扎克.bat
echo 3. 重启OpenClaw服务
echo.
echo ========================================
echo 完成时间: %date% %time%
echo ========================================
echo.
pause