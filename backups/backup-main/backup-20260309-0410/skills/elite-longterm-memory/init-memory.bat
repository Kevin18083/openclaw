@echo off
echo Elite Longterm Memory 初始化脚本
echo ======================================
echo.

REM 创建目录结构
mkdir memory\short-term 2>nul
mkdir memory\medium-term 2>nul
mkdir memory\long-term 2>nul
mkdir memory\archived 2>nul
mkdir memory\tags 2>nul
mkdir memory\indexes 2>nul
mkdir memory\backups 2>nul

echo ✓ 创建记忆目录结构
echo.

REM 创建配置文件
(
echo {
echo   "system_name": "Elite Longterm Memory",
echo   "version": "1.0",
echo   "initialized": "%date% %time%",
echo   "retention_policies": {
echo     "short_term": "24h",
echo     "medium_term": "30d",
echo     "long_term": "permanent",
echo     "archive_after": "365d"
echo   },
echo   "features": {
echo     "auto_cleanup": true,
echo     "backup_enabled": true,
echo     "compression_enabled": false,
echo     "indexing_enabled": true
echo   },
echo   "paths": {
echo     "short_term": "memory/short-term",
echo     "medium_term": "memory/medium-term",
echo     "long_term": "memory/long-term",
echo     "archived": "memory/archived",
echo     "tags": "memory/tags",
echo     "indexes": "memory/indexes",
echo     "backups": "memory/backups"
echo   }
echo }
) > memory\config.json

echo ✓ 创建配置文件
echo.

REM 创建示例记忆
(
echo # 系统基本原则
echo.
echo ## 核心原则
echo 1. **重要性优先**：重要信息永久保存
echo 2. **自动管理**：系统自动分类和整理
echo 3. **易于检索**：支持多种搜索方式
echo 4. **安全可靠**：定期备份，防止数据丢失
echo.
echo ## 使用指南
echo - 短期记忆：临时想法、待处理事项
echo - 中期记忆：项目文档、会议记录
echo - 长期记忆：核心知识、重要决策
echo - 归档记忆：历史记录、参考资料
echo.
echo 创建时间: %date% %time%
) > memory\long-term\system-principles.md

echo ✓ 创建示例长期记忆
echo.

REM 创建维护脚本
(
echo @echo off
echo echo 执行记忆维护...
echo echo ==================
echo.
echo REM 1. 移动过期短期记忆到归档
echo echo 1. 清理短期记忆...
echo forfiles /P "memory\short-term" /M "*.md" /D -1 /C "cmd /c echo   归档: @file ^& move @path memory\archived\"
echo.
echo REM 2. 检查中期记忆
echo echo 2. 检查中期记忆...
echo forfiles /P "memory\medium-term" /M "*.md" /D -30 /C "cmd /c echo   即将过期: @file"
echo.
echo REM 3. 执行备份
echo echo 3. 执行备份...
echo set backup_file=memory\backups\backup-%%date:~0,4%%%%date:~5,2%%%%date:~8,2%%-%%time:~0,2%%%%time:~3,2%%%%time:~6,2%%.zip
echo powershell -Command "Compress-Archive -Path memory\short-term,memory\medium-term,memory\long-term,memory\archived,memory\tags,memory\config.json -DestinationPath %backup_file% -Force"
echo echo   备份创建: %backup_file%
echo.
echo echo 维护完成!
echo pause
) > memory-maintenance.bat

echo ✓ 创建维护脚本
echo.

REM 创建快速命令参考
(
echo @echo off
echo echo 记忆管理快捷命令参考:
echo echo.
echo echo 添加短期记忆:
echo echo   echo "内容" ^> "memory\short-term\%%date:~0,4%%%%date:~5,2%%%%date:~8,2%%-%%time:~0,2%%%%time:~3,2%%.md"
echo echo.
echo echo 添加长期记忆:
echo echo   (
echo echo   echo # 标题
echo echo   echo.
echo echo   echo 内容
echo echo   echo.
echo echo   echo 创建时间: %%date%% %%time%%
echo echo   ) ^> "memory\long-term\标题.md"
echo echo.
echo echo 搜索记忆:
echo echo   findstr /S /I "关键词" memory\*.md
echo echo.
echo echo 列出最近记忆:
echo echo   dir memory /S /B /O:-D ^| findstr ".md" ^| head -10
echo echo.
echo echo 运行维护:
echo echo   memory-maintenance.bat
echo echo.
echo pause
) > memory-commands.bat

echo ✓ 创建命令参考
echo.
echo ======================================
echo 初始化完成!
echo.
echo 下一步:
echo 1. 阅读 SKILL.md 了解完整功能
echo 2. 查看 memory-commands.bat 获取使用命令
echo 3. 运行 memory-maintenance.bat 执行首次维护
echo 4. 设置定时任务自动维护
echo ======================================
echo.
pause