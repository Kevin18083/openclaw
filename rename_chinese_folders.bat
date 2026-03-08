@echo off
chcp 65001 >nul
echo ========================================
echo     中文文件夹拼音重命名工具
echo ========================================
echo.
echo 开始时间: %date% %time%
echo.

echo [1/3] 检查D盘中文文件夹...
if exist "D:\AAAAAA\扎克镜像_D盘备份" (
    echo   找到: D:\AAAAAA\扎克镜像_D盘备份
    echo   重命名为: zhake_jingxiang_dpan_beifen
    ren "D:\AAAAAA\扎克镜像_D盘备份" "zhake_jingxiang_dpan_beifen"
    echo   ✅ 重命名成功
) else (
    echo   ⚠️ D:\AAAAAA\扎克镜像_D盘备份 不存在
)

echo.
echo [2/3] 检查桌面中文文件夹...
if exist "%USERPROFILE%\Desktop\扎克镜像_查看版" (
    echo   找到: %USERPROFILE%\Desktop\扎克镜像_查看版
    echo   重命名为: zhake_jingxiang_chakanban
    ren "%USERPROFILE%\Desktop\扎克镜像_查看版" "zhake_jingxiang_chakanban"
    echo   ✅ 重命名成功
) else (
    echo   ℹ️ 桌面没有中文文件夹
)

echo.
echo [3/3] 检查其他位置...
if exist "C:\Users\17589\扎克镜像_查看版" (
    echo   找到: C:\Users\17589\扎克镜像_查看版
    echo   重命名为: zhake_jingxiang_chakanban_c
    ren "C:\Users\17589\扎克镜像_查看版" "zhake_jingxiang_chakanban_c"
    echo   ✅ 重命名成功
) else (
    echo   ℹ️ C:\Users\17589\扎克镜像_查看版 不存在
)

echo.
echo ========================================
echo 重命名完成！
echo 结束时间: %date% %time%
echo ========================================
echo.
echo 按任意键验证结果...
pause >nul

echo.
echo 验证重命名结果:
echo.
echo === D:\AAAAAA ===
dir "D:\AAAAAA\zhake*" /ad /b 2>nul || echo 无zhake开头的文件夹
echo.
echo === 桌面 ===
dir "%USERPROFILE%\Desktop\zhake*" /ad /b 2>nul || echo 无zhake开头的文件夹
echo.
echo === C:\Users\17589 ===
dir "C:\Users\17589\zhake*" /ad /b 2>nul || echo 无zhake开头的文件夹

echo.
echo 按任意键退出...
pause >nul