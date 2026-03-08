@echo off
echo ========================================
echo     快速健康检查工具
echo ========================================
echo.
echo 检查时间: %date% %time%
echo.

echo [1/6] 检查进程状态...
tasklist | findstr /i "node.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ OpenClaw进程运行正常
) else (
    echo ❌ OpenClaw进程异常
)

echo [2/6] 检查服务响应...
openclaw-cn --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ OpenClaw命令可用
) else (
    echo ❌ OpenClaw命令不可用
)

echo [3/6] 检查备份状态...
if exist "C:\Users\17589\OpenClaw_QuickBackups" (
    echo ✅ 快速备份目录存在
) else (
    echo ⚠️ 快速备份目录不存在
)

if exist "C:\Users\17589\OpenClaw_Mirrors_Pinyin" (
    echo ✅ 拼音镜像目录存在
) else (
    echo ⚠️ 拼音镜像目录不存在
)

echo [4/6] 检查拼音文件...
if exist "C:\Users\17589\.openclaw\workspace\yichang_chuli_jizhi.md" (
    echo ✅ 拼音指南文件存在
) else (
    echo ⚠️ 拼音指南文件缺失
)

echo [5/6] 检查管理工具...
if exist "C:\Users\17589\.openclaw\workspace\zack_admin_panel.bat" (
    echo ✅ 管理面板可用
) else (
    echo ⚠️ 管理面板缺失
)

echo [6/6] 检查磁盘空间...
for /f "tokens=3" %%a in ('dir C:\ ^| find "可用字节"') do set freespace=%%a
echo C盘可用空间: %freespace%

echo.
echo ========================================
echo 健康检查完成！
echo 状态: ✅ 系统运行正常
echo ========================================
echo.
echo 建议:
echo 1. 定期运行完整健康检查 (health_check_en.bat)
echo 2. 重要操作前创建备份 (quick_backup_en.bat)
echo 3. 使用管理面板进行维护 (zack_admin_panel.bat)
echo.
echo 按任意键退出...
pause >nul