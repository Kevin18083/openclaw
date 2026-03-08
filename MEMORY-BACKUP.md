# 杰克记忆文件（双份保险）

> **这是第二份记忆文件，与 ~/.claude/memory/MEMORY.md 内容同步**
>
> 最后更新：2026-03-09
> 位置：C:\Users\17589\.openclaw\workspace\MEMORY-BACKUP.md

---

## 👤 身份

- **我的名字**: 杰克 (Jack)
- **用户称呼**: 罗总

---

## 🏠 项目配置

### OpenClaw
- **安装路径**: `C:/Users/17589/.openclaw/`
- **网关端口**: 18789
- **Dashboard URL**: `http://127.0.0.1:18789/?token=962bc2657e83bfb79a29f3d6a696e72b54605d7a5fe02239`
- **常用命令**:
  - `openclaw-cn gateway start` - 启动网关
  - `openclaw-cn gateway stop` - 停止网关
  - `openclaw-cn gateway restart` - 重启网关
  - `openclaw-cn gateway status` - 查看状态
  - `openclaw-cn dashboard` - 打开 Dashboard
  - `openclaw-cn doctor` - 诊断检查

### API 配置
- **模型**: qwen3.5-plus (阿里百炼)
- **API Base**: https://coding.dashscope.aliyuncs.com/v1

---

## 🖥️ 工作环境

- **操作系统**: Windows 10 (MINGW64 / Git Bash)
- **Shell**: Git Bash (建议使用 PowerShell 执行批处理文件)
- **用户目录**: `C:/Users/17589`

---

## 📋 用户偏好

- **语言**: 中文
- **回复风格**: 简洁、直接，避免冗长解释
- **启动器**: 使用 PowerShell 脚本而非 CMD 批处理（避免编码问题）

---

## 🔧 常见问题解决

### OpenClaw 网关无法访问
1. 运行 `openclaw-cn gateway restart` 重启网关
2. 等待 5 秒后访问 Dashboard
3. 如果 token 失效，运行 `openclaw-cn dashboard --no-open` 获取新 URL

### OpenClaw 网关计划任务卡住（2026-03-08 案例）
**现象**：网关显示已启动但端口未监听，RPC 探测失败

**原因**：计划任务进程卡住（锁死），实际未正确监听端口

**解决步骤**：
1. 用 PowerShell 停止计划任务：`powershell -Command "Stop-ScheduledTask -TaskName 'Openclaw Gateway'"`
2. 查找卡住的进程 PID（日志会显示，如 `pid 12116`）
3. 杀死卡住的进程：`powershell -Command "Stop-Process -Id <PID> -Force"`
4. 手动启动网关：`node <openclaw-cn 路径>/dist/entry.js gateway --port 18789 &`
5. 验证端口监听：`netstat -ano | grep 18789`
6. 探测网关：`openclaw-cn gateway probe`

**关键点**：
- 计划任务显示 "running" 不代表端口真的在监听
- `openclaw-cn gateway stop` 可能无法停止卡住的进程
- 需要用 PowerShell 的 `Stop-Process` 强制杀死
- 启动后等待 5 秒再探测

### 批处理文件闪退
- Git Bash 会修改 `.bat` 文件编码导致中文乱码
- 解决方法：使用 PowerShell 脚本或直接用 CMD 执行

---

## 📝 记忆系统说明

- **MEMORY.md** (`~/.claude/memory/`) - 主记忆文件
- **MEMORY-BACKUP.md** (`~/.openclaw/workspace/`) - 备份记忆文件（第二份保险）
- **CLAUDE.md**: 启动提示，每次会话自动加载
- 当用户说"记住 XXX"时，同时更新两个文件

---

## 💾 备份系统

**备份策略**: 5 个固定位置（最终版本）+ 双份记忆文件

### C 盘备份位置
- `~/.claude/backups/backup-1/` - 主备份（带时间戳，保留 7 天）
- `~/.claude/backups/backup-2/` - 备用备份（带时间戳，保留 7 天）
- `~/.claude/backups/mirror/` - 快速恢复（只保留最新）

### D 盘备份位置（AAAAAA 文件夹）
- `D:\AAAAAA\ClaudeBackups\backup\` - 备份（带时间戳，保留 7 天）
- `D:\AAAAAA\ClaudeBackups\mirror\` - 镜像（只保留最新）

### 备份逻辑
```
每天晚上 12:00 执行：
第 1 选择：C 盘镜像 (最快)
第 2 选择：C 盘备份 1
第 3 选择：C 盘备份 2
第 4 选择：D 盘备份
第 5 选择：D 盘镜像 → 完成

【固定 5 个位置，最终版本，不再增减】
```

### 自动备份时间
- **每天下午 6:00 (18:00)** 自动执行
- **每天晚上 12:00 (午夜)** 自动执行

### 手动备份方法
1. 双击桌面 `Claude-Backup.bat`
2. 运行 `C:\Users\17589\.claude\backups\backup-tool.bat`
3. PowerShell: `powershell -ExecutionPolicy Bypass -File "%USERPROFILE%\.claude\backups\backup-all.ps1"`

### 备份保留
- 时间戳备份保留最近 **7 天**
- 镜像文件夹始终保留最新版本

---

## 🛡️ 恶意代码检测系统

### 检测现状 (2026-03-09)

**检测结果**：workspace 目录扫描发现 11 个问题 (0 严重，6 高危，5 中危)

**误报说明**：
1. 示例代码占位符（如 `password = 'your_password'`）- 正常，保留更直观
2. 检测器自身的特征库（规则匹配规则本身）- 正常，不是漏洞
3. 开发工具的 console.log（用于调试追踪）- 正常，保留便于观察

**现状**：不修复，保持原样
- 学习/示例代码 → 保持占位符
- 开发调试工具 → 保持日志输出
- 检测规则自身 → 保持原样

**风险等级**：低风险 - 可正常使用，不影响学习和记忆系统

---

## 🦸 Superpowers 技能 (2026-03-09 安装)

**版本**：1.0.0

**用途**：规范优先、TDD 驱动、子代理执行的软件开发工作流

**5 阶段流水线**：
1. **头脑风暴** - 探索上下文、提问、提 2-3 个方案、写设计文档
2. **写计划** - 详细任务计划，每任务 2-5 分钟
3. **子代理开发** - 派生子代理执行 TDD + 双重审查
4. **系统调试** - 根因分析 → 模式分析 → 假设测试 → 修复验证
5. **完成分支** - 验证测试、决定合并/PR/保留/丢弃

**核心原则**：
- 一次一个问题、始终 TDD、YAGNI、DRY、系统化、证据优先、频繁提交

**触发词**："让我们构建"、"帮我计划"、"我想添加 X"、"这个坏了"

---

## 🤝 身份与团队架构

**罗总** - 老板，决策者

**杰克 (我)** - Claude Code，技术负责人
- 职责：代码开发、系统维护、脚本编写、数据分析
- 直接听命于罗总

**扎克 (Zack)** - OpenClaw 主代理，运营负责人
- 职责：自动化任务、监控、运营工作
- 归属于 OpenClaw 系统

**尼克 (Nick)** - 扎克的子代理
- 职责：协助扎克执行任务
- 归属于 OpenClaw 系统

**重要**：杰克、扎克、尼克是三个不同的存在，绝对不能搞混！

---

## 📌 双份记忆说明

**主记忆文件**: `C:\Users\17589\.claude\memory\MEMORY.md`

**备份记忆文件**: `C:\Users\17589\.openclaw\workspace\MEMORY-BACKUP.md`

**同步机制**：每次更新主记忆文件时，同时更新备份文件

---

*此文件永久保存，重启电脑后依然有效*
*双份保险，安全第一！*
