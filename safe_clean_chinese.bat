@echo off
echo 安全清理中文文件 - 稳定操作
echo 开始时间: %date% %time%
echo.

set BACKUP_DIR=C:\Users\17589\OpenClaw_Chinese_Backup_20260306
set WORKSPACE=C:\Users\17589\.openclaw\workspace

echo [1/4] 验证备份...
if exist "%BACKUP_DIR%" (
    echo ✅ 备份目录存在: %BACKUP_DIR%
) else (
    echo ❌ 备份目录不存在，停止操作
    pause
    exit /b 1
)

echo [2/4] 列出中文文件...
echo.
echo Markdown文件:
dir "%WORKSPACE%\*.md" /b | findstr /i "[^a-zA-Z0-9._-]"
echo.
echo Batch文件:
dir "%WORKSPACE%\*.bat" /b | findstr /i "[^a-zA-Z0-9._-]"

echo [3/4] 安全删除（仅删除有拼音版本的文件）...
echo.
echo 删除有拼音版本的重复文件:
if exist "%WORKSPACE%\����˫�ؾ���.bat" (
    if exist "%WORKSPACE%\create_double_mirror.bat" (
        echo 删除: ����˫�ؾ���.bat (已有create_double_mirror.bat)
        del "%WORKSPACE%\����˫�ؾ���.bat"
    )
)

if exist "%WORKSPACE%\���˹������.bat" (
    if exist "%WORKSPACE%\zack_admin_panel.bat" (
        echo 删除: ���˹������.bat (已有zack_admin_panel.bat)
        del "%WORKSPACE%\���˹������.bat"
    )
)

if exist "%WORKSPACE%\����ϵͳά��.bat" (
    if exist "%WORKSPACE%\zhake_xitong_weihu.bat" (
        echo 删除: ����ϵͳά��.bat (已有zhake_xitong_weihu.bat)
        del "%WORKSPACE%\����ϵͳά��.bat"
    )
)

echo.
echo [4/4] 验证清理结果...
echo.
echo 剩余文件统计:
dir "%WORKSPACE%\*.md" /b | find /c /v ""
dir "%WORKSPACE%\*.bat" /b | find /c /v ""

echo.
echo 清理完成: %date% %time%
echo 按任意键退出...
pause >nul