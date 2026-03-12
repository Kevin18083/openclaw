# Claude Code 个人记忆

> 最后更新：2026-03-07

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

- **MEMORY.md**: 长期记忆，永久保存
- **CLAUDE.md**: 启动提示，每次会话自动加载
- 当用户说"记住 XXX"时，更新此文件

---

## 💾 备份系统

**备份策略**: 5 个固定位置（最终版本）

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

## 👔 工作职责分工

**杰克 (我) - 技术负责人**:
- 后端维护、前端开发、代码开发、文件管理
- 系统管理、开发工作、脚本编写、数据分析

**扎克 - 运营负责人**:
- 运营工作、市场调查、策划分析、工作安排

---

*此文件永久保存，重启电脑后依然有效*
