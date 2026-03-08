# Elite Longterm Memory - 快速开始指南

## 系统已初始化完成！

### ✅ 已创建：
- 记忆目录结构（7个子目录）
- 配置文件 `memory/config.json`
- 示例记忆 `memory/long-term/system-principles.md`

### 📁 目录结构：
```
memory/
├── short-term/      # 短期记忆（24小时）
├── medium-term/     # 中期记忆（30天）
├── long-term/       # 长期记忆（永久）
├── archived/        # 归档记忆
├── tags/           # 标签索引
├── indexes/        # 搜索索引
├── backups/        # 备份文件
└── config.json     # 配置文件
```

## 基本使用命令

### 1. 添加记忆
```bash
# 短期记忆（24小时后自动归档）
echo "临时想法或待办事项" > memory/short-term/20260304-1108.md

# 长期记忆（永久保存）
echo "# 项目重要决策" > memory/long-term/project-decision.md
echo "我们决定采用微服务架构..." >> memory/long-term/project-decision.md
```

### 2. 搜索记忆
```bash
# Windows PowerShell
Get-ChildItem -Path memory -Recurse -Include *.md | Select-String "关键词"

# 或使用 findstr
findstr /S /I "微服务" memory\*.md
```

### 3. 查看记忆
```bash
# 列出所有记忆
Get-ChildItem -Path memory -Recurse -Include *.md

# 按时间排序（最近修改的先显示）
Get-ChildItem -Path memory -Recurse -Include *.md | Sort-Object LastWriteTime -Descending
```

### 4. 维护命令
```bash
# 备份记忆系统
Compress-Archive -Path memory\short-term, memory\medium-term, memory\long-term, memory\archived, memory\config.json -DestinationPath memory\backups\backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip

# 查找过期短期记忆（超过24小时）
Get-ChildItem -Path memory\short-term -Filter *.md | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) }
```

## 使用示例

### 示例1：记录会议要点
```bash
# 创建会议记录（中期记忆）
$meetingFile = "memory/medium-term/meeting-$(Get-Date -Format 'yyyyMMdd').md"
echo "# 项目会议记录 - $(Get-Date -Format 'yyyy-MM-dd')" > $meetingFile
echo "## 参会人员：张三、李四、王五" >> $meetingFile
echo "## 讨论要点：" >> $meetingFile
echo "1. 确定了项目时间线" >> $meetingFile
echo "2. 分配了开发任务" >> $meetingFile
echo "3. 下周进行技术评审" >> $meetingFile
```

### 示例2：保存重要学习笔记
```bash
# 创建学习笔记（长期记忆）
echo "# Docker容器化最佳实践" > memory/long-term/docker-best-practices.md
echo "## 核心原则" >> memory/long-term/docker-best-practices.md
echo "1. 一个容器一个进程" >> memory/long-term/docker-best-practices.md
echo "2. 使用多阶段构建减少镜像大小" >> memory/long-term/docker-best-practices.md
echo "3. 配置健康检查" >> memory/long-term/docker-best-practices.md
```

### 示例3：快速记录灵感
```bash
# 临时想法（短期记忆）
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
echo "产品改进想法：添加夜间模式" > "memory/short-term/idea-$timestamp.md"
```

## 高级功能

### 自动维护脚本
创建 `memory-maintenance.ps1`：
```powershell
# 记忆系统维护脚本
Write-Host "开始记忆维护..." -ForegroundColor Yellow

# 1. 移动过期短期记忆到归档
$oldFiles = Get-ChildItem -Path memory\short-term -Filter *.md | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) }
foreach ($file in $oldFiles) {
    Move-Item -Path $file.FullName -Destination memory\archived\ -Force
    Write-Host "已归档: $($file.Name)" -ForegroundColor Gray
}

# 2. 创建备份
$backupFile = "memory\backups\backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').zip"
Compress-Archive -Path memory\short-term, memory\medium-term, memory\long-term, memory\archived, memory\config.json -DestinationPath $backupFile -Force
Write-Host "备份已创建: $backupFile" -ForegroundColor Green

Write-Host "维护完成!" -ForegroundColor Green
```

### 设置定时维护
使用Windows任务计划程序设置每日自动维护。

## 最佳实践

1. **分类存储**：
   - 短期：临时想法、待办事项
   - 中期：项目文档、会议记录
   - 长期：核心知识、重要决策

2. **命名规范**：
   - 使用有意义的文件名
   - 包含日期信息
   - 使用连字符而不是空格

3. **定期维护**：
   - 每天检查短期记忆
   - 每周整理中期记忆
   - 每月备份整个系统

## 获取帮助

- 查看完整文档：`SKILL.md`
- 查看配置选项：`memory/config.json`
- 运行测试：添加一些示例记忆并搜索

---

**开始使用你的精英长期记忆系统吧！** 🧠