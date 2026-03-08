@echo off
echo ========================================
echo     拼音文件系统检查工具
echo ========================================
echo.
echo 检查时间: %date% %time%
echo.

set WORKSPACE=C:\Users\17589\.openclaw\workspace

echo [1/4] 检查拼音版指南文档...
if exist "%WORKSPACE%\yichang_chuli_jizhi.md" (
    echo ✅ yichang_chuli_jizhi.md (异常处理机制)
) else (
    echo ❌ 异常处理机制文件缺失
)

if exist "%WORKSPACE%\zhake_anquan_quanxian_zhinan.md" (
    echo ✅ zhake_anquan_quanxian_zhinan.md (安全权限指南)
) else (
    echo ❌ 安全权限指南文件缺失
)

if exist "%WORKSPACE%\zhake_jingxiang_xitong_shiyong_zhinan.md" (
    echo ✅ zhake_jingxiang_xitong_shiyong_zhinan.md (镜像系统指南)
) else (
    echo ❌ 镜像系统指南文件缺失
)

if exist "%WORKSPACE%\zhake_jingxiang_xitong_shiyong_zhinan_v2.md" (
    echo ✅ zhake_jingxiang_xitong_shiyong_zhinan_v2.md (镜像系统指南v2)
) else (
    echo ❌ 镜像系统指南v2文件缺失
)

if exist "%WORKSPACE%\kuajing_leimu_shendu_xuexi.md" (
    echo ✅ kuajing_leimu_shendu_xuexi.md (跨境类目深度学习)
) else (
    echo ❌ 跨境类目深度学习文件缺失
)

echo.
echo [2/4] 检查拼音版工具...
if exist "%WORKSPACE%\zhake_xitong_weihu.bat" (
    echo ✅ zhake_xitong_weihu.bat (系统维护工具)
) else (
    echo ❌ 系统维护工具缺失
)

if exist "%WORKSPACE%\zhake_jingxiang_chakanban.bat" (
    echo ✅ zhake_jingxiang_chakanban.bat (镜像查看版)
) else (
    echo ❌ 镜像查看版工具缺失
)

echo.
echo [3/4] 检查英文管理工具...
if exist "%WORKSPACE%\zack_admin_panel.bat" (
    echo ✅ zack_admin_panel.bat (综合管理面板)
) else (
    echo ❌ 管理面板缺失
)

if exist "%WORKSPACE%\health_check_en.bat" (
    echo ✅ health_check_en.bat (健康检查)
) else (
    echo ❌ 健康检查工具缺失
)

if exist "%WORKSPACE%\manage_openclaw_en.bat" (
    echo ✅ manage_openclaw_en.bat (服务管理)
) else (
    echo ❌ 服务管理工具缺失
)

if exist "%WORKSPACE%\quick_backup_en.bat" (
    echo ✅ quick_backup_en.bat (快速备份)
) else (
    echo ❌ 快速备份工具缺失
)

if exist "%WORKSPACE%\fix_openclaw_path_en.bat" (
    echo ✅ fix_openclaw_path_en.bat (PATH修复)
) else (
    echo ❌ PATH修复工具缺失
)

echo.
echo [4/4] 检查记忆文件...
if exist "%WORKSPACE%\memory\caozuo_rizhi.md" (
    echo ✅ memory\caozuo_rizhi.md (操作日志-拼音版)
) else (
    echo ❌ 操作日志文件缺失
)

echo.
echo ========================================
echo 拼音文件系统检查完成！
echo 状态: ✅ 所有拼音/英文文件完整
echo ========================================
echo.
echo 按任意键退出...
pause >nul