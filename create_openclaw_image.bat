@echo off
echo ========================================
echo OpenClaw 镜像创建工具
echo ========================================
echo.

:: 检查管理员权限
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo 建议以管理员身份运行此脚本！
    echo.
)

:: 设置变量
set BACKUP_DIR=%USERPROFILE%\OpenClaw_Backups
set TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%
set IMAGE_NAME=OpenClaw_Image_%TIMESTAMP%
set IMAGE_PATH=%BACKUP_DIR%\%IMAGE_NAME%

echo [1/6] 创建备份目录...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
if not exist "%IMAGE_PATH%" mkdir "%IMAGE_PATH%"

echo [2/6] 备份OpenClaw配置文件...
xcopy "%USERPROFILE%\.openclaw\*" "%IMAGE_PATH%\config\" /E /I /Y
echo ✓ 配置文件已备份

echo [3/6] 备份npm全局包列表...
npm list -g --depth=0 > "%IMAGE_PATH%\npm_global_packages.txt" 2>nul
echo ✓ npm包列表已备份

echo [4/6] 备份系统信息...
systeminfo > "%IMAGE_PATH%\system_info.txt" 2>nul
echo %COMPUTERNAME% > "%IMAGE_PATH%\computer_name.txt"
echo ✓ 系统信息已备份

echo [5/6] 创建恢复脚本...
echo @echo off > "%IMAGE_PATH%\restore_openclaw.bat"
echo echo ======================================== >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo OpenClaw 镜像恢复工具 >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo ======================================== >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo. >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo [1/4] 恢复OpenClaw配置文件... >> "%IMAGE_PATH%\restore_openclaw.bat"
echo xcopy "config\*" "%USERPROFILE%\.openclaw\" /E /I /Y >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo ✓ 配置文件已恢复 >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo. >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo [2/4] 重新安装OpenClaw核心... >> "%IMAGE_PATH%\restore_openclaw.bat"
echo npm install -g openclaw-cn >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo ✓ OpenClaw核心已安装 >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo. >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo [3/4] 安装技能（如果clawdhub可用）... >> "%IMAGE_PATH%\restore_openclaw.bat"
echo if exist "%%APPDATA%%\npm\clawdhub.cmd" ( >> "%IMAGE_PATH%\restore_openclaw.bat"
echo     for /f "tokens=*" %%i in ('type "npm_global_packages.txt" ^| findstr "openclaw"') do ( >> "%IMAGE_PATH%\restore_openclaw.bat"
echo         echo Installing skills... >> "%IMAGE_PATH%\restore_openclaw.bat"
echo         clawdhub update --all >> "%IMAGE_PATH%\restore_openclaw.bat"
echo     ) >> "%IMAGE_PATH%\restore_openclaw.bat"
echo ) >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo ✓ 技能安装完成 >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo. >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo [4/4] 重启OpenClaw服务... >> "%IMAGE_PATH%\restore_openclaw.bat"
echo net stop OpenClawGateway 2>nul >> "%IMAGE_PATH%\restore_openclaw.bat"
echo net start OpenClawGateway 2>nul >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo ✓ OpenClaw服务已重启 >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo. >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo ======================================== >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo 恢复完成！请检查OpenClaw运行状态。 >> "%IMAGE_PATH%\restore_openclaw.bat"
echo echo ======================================== >> "%IMAGE_PATH%\restore_openclaw.bat"
echo pause >> "%IMAGE_PATH%\restore_openclaw.bat"
echo ✓ 恢复脚本已创建

echo [6/6] 创建镜像说明文档...
echo # OpenClaw 镜像说明 > "%IMAGE_PATH%\README.md"
echo. >> "%IMAGE_PATH%\README.md"
echo ## 镜像信息 >> "%IMAGE_PATH%\README.md"
echo - **创建时间**: %date% %time% >> "%IMAGE_PATH%\README.md"
echo - **计算机名**: %COMPUTERNAME% >> "%IMAGE_PATH%\README.md"
echo - **用户**: %USERNAME% >> "%IMAGE_PATH%\README.md"
echo - **镜像名称**: %IMAGE_NAME% >> "%IMAGE_PATH%\README.md"
echo. >> "%IMAGE_PATH%\README.md"
echo ## 包含内容 >> "%IMAGE_PATH%\README.md"
echo 1. OpenClaw配置文件 >> "%IMAGE_PATH%\README.md"
echo 2. npm全局包列表 >> "%IMAGE_PATH%\README.md"
echo 3. 系统信息 >> "%IMAGE_PATH%\README.md"
echo 4. 恢复脚本 >> "%IMAGE_PATH%\README.md"
echo. >> "%IMAGE_PATH%\README.md"
echo ## 使用方法 >> "%IMAGE_PATH%\README.md"
echo 1. 将整个镜像文件夹复制到新电脑 >> "%IMAGE_PATH%\README.md"
echo 2. 运行 `restore_openclaw.bat` >> "%IMAGE_PATH%\README.md"
echo 3. 按照提示操作 >> "%IMAGE_PATH%\README.md"
echo ✓ 说明文档已创建

echo.
echo ========================================
echo 镜像创建完成！
echo.
echo 镜像位置: %IMAGE_PATH%
echo 包含文件:
echo   - OpenClaw配置文件
echo   - npm包列表
echo   - 系统信息
echo   - 恢复脚本 (restore_openclaw.bat)
echo   - 说明文档 (README.md)
echo.
echo 使用方法:
echo 1. 备份此文件夹
echo 2. 需要恢复时运行 restore_openclaw.bat
echo 3. 或复制到其他电脑部署
echo ========================================
echo.
pause