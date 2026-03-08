# 设置自动维护任务

## 方法1：使用Windows任务计划程序（推荐）

### 步骤1：打开任务计划程序
1. 按 `Win + R` 键
2. 输入 `taskschd.msc`
3. 按回车

### 步骤2：创建基本任务
1. 右侧点击"创建基本任务"
2. 名称：`Elite Memory Maintenance`
3. 描述：`每日自动维护 Elite Longterm Memory 系统`

### 步骤3：设置触发器
1. 选择"每日"
2. 开始时间：`03:00:00`（凌晨3点，网络空闲时）
3. 重复任务间隔：`1天`

### 步骤4：设置操作
1. 选择"启动程序"
2. 程序/脚本：`powershell.exe`
3. 添加参数：
   ```
   -ExecutionPolicy Bypass -File "C:\Users\17589\.openclaw\workspace\skills\elite-longterm-memory\memory-maintenance.ps1"
   ```
4. 起始于：
   ```
   C:\Users\17589\.openclaw\workspace\skills\elite-longterm-memory
   ```

### 步骤5：完成设置
1. 点击"完成"
2. 任务将每天凌晨3点自动运行

## 方法2：使用PowerShell命令（管理员权限）

```powershell
# 以管理员身份运行PowerShell

# 创建任务动作
$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -File `"C:\Users\17589\.openclaw\workspace\skills\elite-longterm-memory\memory-maintenance.ps1`""

# 创建任务触发器（每天凌晨3点）
$trigger = New-ScheduledTaskTrigger `
    -Daily `
    -At 3am

# 创建任务主体
$principal = New-ScheduledTaskPrincipal `
    -UserId "$env:USERDOMAIN\$env:USERNAME" `
    -LogonType S4U `
    -RunLevel Limited

# 注册任务
Register-ScheduledTask `
    -TaskName "Elite Memory Maintenance" `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Description "每日自动维护 Elite Longterm Memory 系统"
```

## 方法3：创建快捷方式到启动文件夹（每次登录时运行）

1. 创建快捷方式：
   - 目标：`powershell.exe -ExecutionPolicy Bypass -File "C:\Users\17589\.openclaw\workspace\skills\elite-longterm-memory\memory-maintenance.ps1"`
   - 起始位置：`C:\Users\17589\.openclaw\workspace\skills\elite-longterm-memory`

2. 将快捷方式放到：
   ```
   C:\Users\17589\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
   ```

## 方法4：使用批处理文件手动运行

创建 `run-maintenance.bat`：
```batch
@echo off
echo 运行 Elite Memory 维护...
cd /d "C:\Users\17589\.openclaw\workspace\skills\elite-longterm-memory"
powershell -ExecutionPolicy Bypass -File "memory-maintenance.ps1"
pause
```

## 维护计划建议

### 推荐的时间安排：
- **每日 03:00**：主要维护（清理、备份）
- **每周日 04:00**：完整备份和优化
- **每月1日 05:00**：深度清理和统计

### 创建多个任务：
```powershell
# 每日维护
Register-ScheduledTask -TaskName "Memory Daily Maintenance" -Trigger (New-ScheduledTaskTrigger -Daily -At 3am) ...

# 每周维护  
Register-ScheduledTask -TaskName "Memory Weekly Maintenance" -Trigger (New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 4am) ...

# 每月维护
Register-ScheduledTask -TaskName "Memory Monthly Maintenance" -Trigger (New-ScheduledTaskTrigger -Monthly -DaysOfMonth 1 -At 5am) ...
```

## 测试维护任务

### 1. 先测试脚本
```powershell
# 模拟运行（不实际修改文件）
powershell -ExecutionPolicy Bypass -File "memory-maintenance.ps1" -DryRun -Verbose

# 实际测试运行
powershell -ExecutionPolicy Bypass -File "memory-maintenance.ps1" -Verbose
```

### 2. 手动触发任务
```powershell
# 立即运行任务
Start-ScheduledTask -TaskName "Elite Memory Maintenance"

# 查看任务状态
Get-ScheduledTask -TaskName "Elite Memory Maintenance" | Get-ScheduledTaskInfo
```

### 3. 检查日志
维护日志保存在：
```
C:\Users\17589\.openclaw\workspace\skills\elite-longterm-memory\memory\logs\
```

## 故障排除

### 常见问题：

1. **任务没有运行**
   - 检查任务计划程序中的"上次运行结果"
   - 确保电脑在预定时间开机
   - 检查电源设置（允许唤醒计算机）

2. **权限问题**
   - 以管理员身份创建任务
   - 检查文件访问权限
   - 确保用户有执行PowerShell脚本的权限

3. **脚本错误**
   - 查看维护日志文件
   - 手动运行脚本测试
   - 检查路径是否正确

4. **备份失败**
   - 检查磁盘空间
   - 确保备份目录可写
   - 检查文件是否被其他程序占用

### 诊断命令：
```powershell
# 查看所有计划任务
Get-ScheduledTask | Where-Object {$_.TaskName -like "*Memory*"}

# 查看任务历史
Get-ScheduledTask -TaskName "Elite Memory Maintenance" | Get-ScheduledTaskInfo

# 查看任务XML定义
Export-ScheduledTask -TaskName "Elite Memory Maintenance"
```

## 监控和维护

### 设置邮件通知（可选）：
修改 `memory-maintenance.ps1` 添加邮件发送功能，在维护完成后发送报告。

### 集成到系统监控：
将维护任务状态集成到现有的监控系统中。

### 定期审查：
- 每月检查维护日志
- 每季度调整维护策略
- 每年评估系统性能

---

**建议使用"方法1：Windows任务计划程序"设置每日凌晨3点的自动维护。**