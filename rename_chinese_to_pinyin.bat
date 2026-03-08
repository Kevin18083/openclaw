@echo off
chcp 65001 >nul
echo ========================================
echo     中文文件拼音重命名工具
echo ========================================
echo.
echo 开始时间: %date% %time%
echo.

set WORKSPACE=C:\Users\17589\.openclaw\workspace
set MEMORY_DIR=%WORKSPACE%\memory

echo [1/3] 备份原始文件...
set BACKUP_DIR=%USERPROFILE%\OpenClaw_Chinese_Backup_%date:~0,4%%date:~5,2%%date:~8,2%
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
xcopy "%WORKSPACE%\*.bat" "%BACKUP_DIR%\" /Y >nul
xcopy "%WORKSPACE%\*.md" "%BACKUP_DIR%\" /Y >nul
xcopy "%MEMORY_DIR%\*.md" "%BACKUP_DIR%\memory\" /Y >nul
echo   备份完成: %BACKUP_DIR%

echo.
echo [2/3] 重命名workspace中的中文文件...
echo.

:: 文件映射表
:: 格式: 原始乱码文件名=拼音文件名

:: 1. 异常处理机制.md
if exist "%WORKSPACE%\�쳣��������.md" (
    ren "%WORKSPACE%\�쳣��������.md" "yichang_chuli_jizhi.md"
    echo   ✅ �쳣��������.md -> yichang_chuli_jizhi.md
) else (
    echo   ⚠️ �쳣��������.md 不存在
)

:: 2. 扎克安全权限指南.md
if exist "%WORKSPACE%\���˰�ȫȨ��ָ��.md" (
    ren "%WORKSPACE%\���˰�ȫȨ��ָ��.md" "zhake_anquan_quanxian_zhinan.md"
    echo   ✅ ���˰�ȫȨ��ָ��.md -> zhake_anquan_quanxian_zhinan.md
) else (
    echo   ⚠️ ���˰�ȫȨ��ָ��.md 不存在
)

:: 3. 扎克管理面板.bat (已有英文版，可删除或保留)
if exist "%WORKSPACE%\���˹������.bat" (
    echo   ℹ️ ���˹������.bat (已有英文版zack_admin_panel.bat)
    echo     建议: del "%WORKSPACE%\���˹������.bat"
)

:: 4. 扎克镜像查看版.bat
if exist "%WORKSPACE%\���˾���_��ʽ��.bat" (
    ren "%WORKSPACE%\���˾���_��ʽ��.bat" "zhake_jingxiang_chakanban.bat"
    echo   ✅ ���˾���_��ʽ��.bat -> zhake_jingxiang_chakanban.bat
) else (
    echo   ⚠️ ���˾���_��ʽ��.bat 不存在
)

:: 5. 扎克镜像系统使用指南.md
if exist "%WORKSPACE%\���˾���ϵͳʹ��ָ��.md" (
    ren "%WORKSPACE%\���˾���ϵͳʹ��ָ��.md" "zhake_jingxiang_xitong_shiyong_zhinan.md"
    echo   ✅ ���˾���ϵͳʹ��ָ��.md -> zhake_jingxiang_xitong_shiyong_zhinan.md
) else (
    echo   ⚠️ ���˾���ϵͳʹ��ָ��.md 不存在
)

:: 6. 扎克镜像系统使用指南_v2.md
if exist "%WORKSPACE%\���˾���ϵͳʹ��ָ��_v2.md" (
    ren "%WORKSPACE%\���˾���ϵͳʹ��ָ��_v2.md" "zhake_jingxiang_xitong_shiyong_zhinan_v2.md"
    echo   ✅ ���˾���ϵͳʹ��ָ��_v2.md -> zhake_jingxiang_xitong_shiyong_zhinan_v2.md
) else (
    echo   ⚠️ ���˾���ϵͳʹ��ָ��_v2.md 不存在
)

:: 7. 扎克系统维护.bat
if exist "%WORKSPACE%\����ϵͳά��.bat" (
    ren "%WORKSPACE%\����ϵͳά��.bat" "zhake_xitong_weihu.bat"
    echo   ✅ ����ϵͳά��.bat -> zhake_xitong_weihu.bat
) else (
    echo   ⚠️ ����ϵͳά��.bat 不存在
)

:: 8. 创建双重镜像.bat (已有英文版，可删除)
if exist "%WORKSPACE%\����˫�ؾ���.bat" (
    echo   ℹ️ ����˫�ؾ���.bat (已有英文版create_double_mirror.bat)
    echo     建议: del "%WORKSPACE%\����˫�ؾ���.bat"
)

echo.
echo [3/3] 重命名memory中的中文文件...
echo.

:: 1. 操作日志.md
if exist "%MEMORY_DIR%\������־.md" (
    ren "%MEMORY_DIR%\������־.md" "caozuo_rizhi.md"
    echo   ✅ ������־.md -> caozuo_rizhi.md
) else (
    echo   ⚠️ ������־.md 不存在
)

:: 2. 跨境类目深度学习.md
if exist "%MEMORY_DIR%\�羳��Ŀ���ѧϰ.md" (
    ren "%MEMORY_DIR%\�羳��Ŀ���ѧϰ.md" "kuajing_leimu_shendu_xuexi.md"
    echo   ✅ �羳��Ŀ���ѧϰ.md -> kuajing_leimu_shendu_xuexi.md
) else (
    echo   ⚠️ �羳��Ŀ���ѧϰ.md 不存在
)

echo.
echo ========================================
echo 重命名完成！
echo 结束时间: %date% %time%
echo ========================================
echo.
echo 清理建议:
echo 1. 删除重复的中文版文件:
echo    del "%WORKSPACE%\���˹������.bat"
echo    del "%WORKSPACE%\����˫�ؾ���.bat"
echo.
echo 2. 更新引用这些文件的脚本
echo.
echo 按任意键查看重命名结果...
pause >nul

echo.
echo 重命名后文件列表:
echo.
echo === Workspace ===
dir "%WORKSPACE%\*.bat" /b
dir "%WORKSPACE%\*.md" /b
echo.
echo === Memory ===
dir "%MEMORY_DIR%\*.md" /b

echo.
echo 按任意键退出...
pause >nul