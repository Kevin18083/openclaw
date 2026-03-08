@echo off
chcp 65001 >nul
echo ========================================
echo     安全清理中文文件工具
echo ========================================
echo.
echo 注意：此操作将删除中文文件名文件
echo       拼音版本已创建，内容已保留
echo.
echo 开始时间: %date% %time%
echo.

set WORKSPACE=C:\Users\17589\.openclaw\workspace
set BACKUP_DIR=C:\Users\17589\OpenClaw_Chinese_Backup_%date:~0,4%%date:~5,2%%date:~8,2%

echo [1/4] 验证备份存在...
if exist "%BACKUP_DIR%" (
    echo ✅ 备份目录存在: %BACKUP_DIR%
) else (
    echo ❌ 备份目录不存在，停止操作
    pause
    exit /b 1
)

echo.
echo [2/4] 列出要删除的中文文件...
echo.
echo === Markdown文件 ===
dir "%WORKSPACE%\*.md" /b | findstr /c:"��"
echo.
echo === Batch文件 ===
dir "%WORKSPACE%\*.bat" /b | findstr /c:"��"

echo.
echo [3/4] 确认删除操作...
echo.
echo 是否删除以上中文文件？(Y/N)
echo 注意：拼音版本已创建，内容完整
set /p confirm=请输入: 

if /i not "%confirm%"=="Y" (
    echo 操作取消
    pause
    exit /b 0
)

echo.
echo [4/4] 安全删除中文文件...
echo.

:: 删除中文markdown文件
for /f "delims=" %%i in ('dir "%WORKSPACE%\*.md" /b ^| findstr /c:"��"') do (
    echo 删除: %%i
    del "%WORKSPACE%\%%i" 2>nul
)

:: 删除中文batch文件（保留必要的）
echo.
echo 删除重复的中文batch文件...
if exist "%WORKSPACE%\����˫�ؾ���.bat" (
    echo 删除: ����˫�ؾ���.bat (已有create_double_mirror.bat)
    del "%WORKSPACE%\����˫�ؾ���.bat" 2>nul
)

if exist "%WORKSPACE%\���˹������.bat" (
    echo 删除: ���˹������.bat (已有zack_admin_panel.bat)
    del "%WORKSPACE%\���˹������.bat" 2>nul
)

if exist "%WORKSPACE%\���˾���_��ʽ��.bat" (
    echo 保留: ���˾���_��ʽ��.bat (已重命名为zhake_jingxiang_chakanban.bat)
    echo 建议手动检查后删除
)

if exist "%WORKSPACE%\����ϵͳά��.bat" (
    echo 删除: ����ϵͳά��.bat (已有zhake_xitong_weihu.bat)
    del "%WORKSPACE%\����ϵͳά��.bat" 2>nul
)

echo.
echo ========================================
echo 清理完成！
echo 结束时间: %date% %time%
echo ========================================
echo.
echo 清理结果:
echo.
echo === 剩余Markdown文件 ===
dir "%WORKSPACE%\*.md" /b
echo.
echo === 剩余Batch文件 ===
dir "%WORKSPACE%\*.bat" /b
echo.
echo 按任意键退出...
pause >nul