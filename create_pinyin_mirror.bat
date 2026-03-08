@echo off
echo ========================================
echo     拼音版完整镜像创建工具
echo ========================================
echo.
echo 开始时间: %date% %time%
echo.

set "MIRROR_DIR=C:\Users\17589\OpenClaw_Mirrors_Pinyin"
set "TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%"
set "MIRROR_NAME=Zack_Mirror_Pinyin_%TIMESTAMP%"
set "MIRROR_PATH=%MIRROR_DIR%\%MIRROR_NAME%"

echo [1/6] 创建镜像目录...
if not exist "%MIRROR_DIR%" mkdir "%MIRROR_DIR%"
if not exist "%MIRROR_PATH%" mkdir "%MIRROR_PATH%"
echo   镜像位置: %MIRROR_PATH%

echo [2/6] 备份配置文件...
if exist "C:\Users\17589\.openclaw\config.json" (
    copy "C:\Users\17589\.openclaw\config.json" "%MIRROR_PATH%\" >nul
    echo   ✅ config.json 已备份
) else (
    echo   ⚠️ config.json 不存在
)

echo [3/6] 备份工作空间文件...
xcopy "C:\Users\17589\.openclaw\workspace\*.md" "%MIRROR_PATH%\" /Y >nul
xcopy "C:\Users\17589\.openclaw\workspace\*.bat" "%MIRROR_PATH%\" /Y >nul
echo   ✅ workspace 文件已备份

echo [4/6] 备份记忆文件...
if exist "C:\Users\17589\.openclaw\workspace\memory" (
    xcopy "C:\Users\17589\.openclaw\workspace\memory" "%MIRROR_PATH%\memory\" /E /I /Y >nul
    echo   ✅ memory 文件已备份
) else (
    echo   ⚠️ memory 目录不存在
)

echo [5/6] 创建恢复脚本...
echo @echo off > "%MIRROR_PATH%\restore.bat"
echo echo ======================================== >> "%MIRROR_PATH%\restore.bat"
echo echo     从拼音镜像恢复 OpenClaw >> "%MIRROR_PATH%\restore.bat"
echo echo ======================================== >> "%MIRROR_PATH%\restore.bat"
echo echo. >> "%MIRROR_PATH%\restore.bat"
echo echo 恢复时间: %%date%% %%time%% >> "%MIRROR_PATH%\restore.bat"
echo echo. >> "%MIRROR_PATH%\restore.bat"
echo echo [1/3] 恢复配置文件... >> "%MIRROR_PATH%\restore.bat"
echo if exist "%%~dp0config.json" ( >> "%MIRROR_PATH%\restore.bat"
echo   copy "%%~dp0config.json" "%%USERPROFILE%%\.openclaw\" /Y >> "%MIRROR_PATH%\restore.bat"
echo   echo   ✅ config.json 已恢复 >> "%MIRROR_PATH%\restore.bat"
echo ) else ( >> "%MIRROR_PATH%\restore.bat"
echo   echo   ⚠️ config.json 不存在 >> "%MIRROR_PATH%\restore.bat"
echo ) >> "%MIRROR_PATH%\restore.bat"
echo echo. >> "%MIRROR_PATH%\restore.bat"
echo echo [2/3] 恢复工作空间文件... >> "%MIRROR_PATH%\restore.bat"
echo xcopy "%%~dp0*.md" "%%USERPROFILE%%\.openclaw\workspace\" /Y >> "%MIRROR_PATH%\restore.bat"
echo xcopy "%%~dp0*.bat" "%%USERPROFILE%%\.openclaw\workspace\" /Y >> "%MIRROR_PATH%\restore.bat"
echo echo   ✅ workspace 文件已恢复 >> "%MIRROR_PATH%\restore.bat"
echo echo. >> "%MIRROR_PATH%\restore.bat"
echo echo [3/3] 恢复记忆文件... >> "%MIRROR_PATH%\restore.bat"
echo if exist "%%~dp0memory" ( >> "%MIRROR_PATH%\restore.bat"
echo   xcopy "%%~dp0memory" "%%USERPROFILE%%\.openclaw\workspace\memory\" /E /I /Y >> "%MIRROR_PATH%\restore.bat"
echo   echo   ✅ memory 文件已恢复 >> "%MIRROR_PATH%\restore.bat"
echo ) else ( >> "%MIRROR_PATH%\restore.bat"
echo   echo   ⚠️ memory 目录不存在 >> "%MIRROR_PATH%\restore.bat"
echo ) >> "%MIRROR_PATH%\restore.bat"
echo echo. >> "%MIRROR_PATH%\restore.bat"
echo echo ======================================== >> "%MIRROR_PATH%\restore.bat"
echo echo 恢复完成！请重启OpenClaw服务。 >> "%MIRROR_PATH%\restore.bat"
echo echo ======================================== >> "%MIRROR_PATH%\restore.bat"
echo pause >> "%MIRROR_PATH%\restore.bat"
echo   ✅ restore.bat 已创建

echo [6/6] 创建镜像信息文件...
echo 镜像名称: %MIRROR_NAME% > "%MIRROR_PATH%\mirror_info.txt"
echo 创建时间: %date% %time% >> "%MIRROR_PATH%\mirror_info.txt"
echo 包含内容: config.json + workspace文件 + memory文件 >> "%MIRROR_PATH%\mirror_info.txt"
echo 恢复脚本: restore.bat >> "%MIRROR_PATH%\mirror_info.txt"
echo 编码类型: 拼音/英文（无中文编码问题） >> "%MIRROR_PATH%\mirror_info.txt"
echo   ✅ mirror_info.txt 已创建

echo.
echo ========================================
echo 拼音版完整镜像创建完成！
echo 镜像位置: %MIRROR_PATH%
echo 创建时间: %date% %time%
echo ========================================
echo.
echo 镜像包含:
echo ✅ 配置文件 (config.json)
echo ✅ 工作空间文件 (*.md, *.bat)
echo ✅ 记忆文件 (memory目录)
echo ✅ 恢复脚本 (restore.bat)
echo ✅ 镜像信息 (mirror_info.txt)
echo.
echo 按任意键验证镜像...
pause >nul

echo.
echo 验证镜像内容:
dir "%MIRROR_PATH%" /b
echo.
echo 按任意键退出...
pause >nul