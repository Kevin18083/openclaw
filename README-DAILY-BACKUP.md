# 每日自动备份任务说明

> 每天下午 6 点和凌晨 12 点自动备份所有关键文件

---

## 📋 任务详情

| 项目 | 内容 |
|------|------|
| **任务名称** | Claude-Auto-Backup-Daily-18 和 Claude-Auto-Backup-Daily-00 |
| **执行时间** | 每天下午 6:00 和 凌晨 12:00 |
| **执行脚本** | auto-backup-all.ps1 |
| **备份内容** | MEMORY.md, skills/, CLAUDE.md |

---

## 🔧 安装方法

**以管理员权限运行**：

```powershell
# 右键 PowerShell -> 以管理员身份运行
cd C:\Users\17589\.openclaw\workspace
.\install-daily-backup-task.ps1
```

---

## ❌ 删除方法

```powershell
.\remove-daily-backup-task.ps1
```

---

## 📊 查看任务状态

### 方法 1：任务计划程序 GUI

1. 按 `Win + R`
2. 输入 `taskschd.msc`
3. 找到 `Claude-Auto-Backup-Daily`

### 方法 2：PowerShell

```powershell
Get-ScheduledTask -TaskName "Claude-Auto-Backup-Daily-18"
Get-ScheduledTask -TaskName "Claude-Auto-Backup-Daily-00"
```

### 方法 3：命令行

```cmd
schtasks /query /tn "Claude-Auto-Backup-Daily-18"
schtasks /query /tn "Claude-Auto-Backup-Daily-00"
```

---

## 🧪 手动测试

```powershell
# 立即运行任务（下午 6 点）
schtasks /run /tn "Claude-Auto-Backup-Daily-18"

# 立即运行任务（凌晨 12 点）
schtasks /run /tn "Claude-Auto-Backup-Daily-00"

# 或运行脚本
.\auto-backup-all.ps1
```

---

## 📝 查看备份日志

```powershell
# 查看备份日志
Get-Content ~\.backup-log.txt -Tail 20

# 查看恢复日志
Get-Content ~\.restore-log.txt -Tail 20
```

---

## ⚙️ 任务配置

| 设置 | 值 |
|------|------|
| 运行账户 | 当前用户 |
| 运行级别 | 最高权限 |
| 电池模式 | 使用电池时也运行 |
| 网络要求 | 不要求网络 |
| 执行超时 | 1 小时 |
| 重复策略 | 每天两次（6PM 和 12AM） |

---

## 🔔 故障排除

### 问题 1：任务不运行

**检查**：
- 任务计划程序服务是否运行
- 任务是否已启用
- 用户权限是否正确

**解决**：
```powershell
# 重新安装任务
.\install-daily-backup-task.ps1
```

### 问题 2：备份失败

**检查**：
- 备份日志 `~\.backup-log.txt`
- 磁盘空间是否足够
- 文件是否被占用

**解决**：
```powershell
# 手动运行测试
.\auto-backup-all.ps1
```

### 问题 3：权限错误

**解决**：以管理员身份运行安装脚本

---

## 📅 备份保留策略

| 备份类型 | 保留时间 |
|----------|----------|
| 每日备份 | 覆盖前一天 |
| 备份日志 | 永久保留（可手动清理） |

---

## 💡 最佳实践

1. **每周检查一次日志** - 确保备份正常
2. **每月测试恢复** - 验证备份可用
3. **保留备份日志** - 方便追溯问题

---

*版本：1.0 | 创建日期：2026-03-09*

*最后更新：2026-03-09*
