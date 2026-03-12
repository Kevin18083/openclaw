# Claude Code ↔ OpenClaw 共享记忆

> 创建时间：2026-03-07
> 用途：杰克 (Claude Code) 与扎克 (OpenClaw) 之间的共享记忆

---

## 👥 身份信息

### Claude Code (杰克/Jack)
- **身份**: Claude Code AI 助手
- **用户称呼**: 罗总
- **记忆位置**: `~/.claude/memory/`

### OpenClaw (扎克/Zack)
- **身份**: OpenClaw AI 代理系统
- **记忆位置**: `~/.openclaw/memory/`
- **数据库**: `~/.openclaw/memory/main.sqlite`

---

## 🔄 共享记忆内容

### 1. 用户偏好
- **语言**: 中文
- **回复风格**: 简洁、直接，避免冗长解释
- **工作环境**: Windows 10 + Git Bash (MINGW64)

### 2. 重要配置
- **OpenClaw 路径**: `~/.openclaw/`
- **网关端口**: 18789
- **Dashboard**: `http://127.0.0.1:18789/?token=962bc2657e83bfb79a29f3d6a696e72b54605d7a5fe02239`

### 3. API 配置
- **模型**: qwen3.5-plus (阿里百炼)
- **API Base**: https://coding.dashscope.aliyuncs.com/v1

---

## 📁 文件位置说明

| 类型 | Claude Code 路径 | OpenClaw 路径 |
|------|-----------------|---------------|
| 记忆文件 | `~/.claude/memory/` | `~/.openclaw/memory/` |
| 共享记忆 | `~/.claude/memory/shared-*.md` | `~/.openclaw/shared-*.md` |
| 配置文件 | `~/.claude/settings.json` | `~/.openclaw/openclaw.json` |

---

## 📋 通信协议

### 杰克 → 扎克
- 通过活动日志通知：`~/.openclaw/logs/jack-activity.jsonl`
- 紧急通知：`~/.openclaw/logs/jack-urgent.json`

### 扎克 → 杰克
- 通过定时任务检查：每小时检查一次
- 读取共享记忆文件获取最新状态

---

## 🛠️ 常用命令

### OpenClaw 网关
```bash
openclaw-cn gateway start    # 启动
openclaw-cn gateway stop     # 停止
openclaw-cn gateway restart  # 重启
openclaw-cn gateway status   # 查看状态
openclaw-cn dashboard        # 打开 Dashboard
```

### 备份系统
```bash
# 手动备份
powershell -ExecutionPolicy Bypass -File "%USERPROFILE%\.claude\backups\backup-all.ps1"

# 桌面快捷方式
Claude-Backup.bat
```

---

## 💾 备份系统

**C 盘 (4 个副本)**:
- `~/.claude/backups/memory-backup-1/`
- `~/.claude/backups/memory-backup-2/`
- `~/.claude/backups/memory-mirror-1/`
- `~/.claude/backups/memory-mirror-2/`

**D 盘 (2 个副本，AAAAAA 文件夹)**:
- `D:\AAAAAA\ClaudeBackups\memory-backup/`
- `D:\AAAAAA\ClaudeBackups\memory-mirror/`

**自动备份时间**: 每天晚上 12:00

---

## 📝 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2026-03-07 | 创建共享记忆文件 |

---

*此文件由杰克创建，与扎克共享*
