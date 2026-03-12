# Claude Code ↔ OpenClaw 通信协议

> 创建时间：2026-03-07
> 版本：1.0.0
> 用途：杰克 (Claude Code) 与扎克 (OpenClaw) 之间的通信规范

---

## 📡 通信方式

### 1. 文件通知系统

#### 杰克活动日志
**位置**: `~/.openclaw/logs/jack-activity.jsonl`

**格式** (JSONL):
```json
{"timestamp":"2026-03-07T14:30:00Z","type":"file_created","path":"C:/xxx/file.md","description":"创建文件","status":"ok"}
```

**事件类型**:
| 类型 | 说明 |
|------|------|
| `file_created` | 创建文件 |
| `file_modified` | 修改文件 |
| `file_deleted` | 删除文件 |
| `config_changed` | 配置变更 |
| `system_event` | 系统事件 |
| `task_complete` | 任务完成 |
| `error_occurred` | 错误发生 |

#### 紧急通知
**位置**: `~/.openclaw/logs/jack-urgent.json`

**格式**:
```json
{
  "timestamp": "2026-03-07T14:30:00Z",
  "priority": "high",
  "message": "需要立即处理的事项",
  "details": {}
}
```

---

### 2. 共享记忆文件

**位置**:
- Claude Code 侧：`~/.claude/memory/shared-openclaw.md`
- OpenClaw 侧：`~/.openclaw/shared-memory.md`

**用途**: 存储双方都需要访问的共享信息

---

### 3. 定时任务检查

**扎克检查频率**: 每小时一次

**检查内容**:
1. 读取杰克活动日志
2. 检查是否有新任务
3. 同步共享记忆

---

## 📋 消息格式标准

### 任务请求 (杰克 → 扎克)
```json
{
  "from": "jack",
  "to": "zack",
  "type": "task_request",
  "timestamp": "2026-03-07T14:30:00Z",
  "task": {
    "id": "unique-task-id",
    "description": "任务描述",
    "priority": "normal|high|urgent",
    "deadline": "2026-03-07T18:00:00Z"
  }
}
```

### 任务响应 (扎克 → 杰克)
```json
{
  "from": "zack",
  "to": "jack",
  "type": "task_response",
  "timestamp": "2026-03-07T14:35:00Z",
  "task_id": "unique-task-id",
  "status": "accepted|in_progress|completed|failed",
  "result": {}
}
```

### 状态同步 (双向)
```json
{
  "from": "jack|zack",
  "to": "jack|zack",
  "type": "status_sync",
  "timestamp": "2026-03-07T14:30:00Z",
  "status": {
    "system": "online|offline|busy",
    "current_task": "task description",
    "last_update": "2026-03-07T14:30:00Z"
  }
}
```

---

## 🔄 通信流程

### 杰克委托任务给扎克
```
1. 杰克写入任务请求到 ~ /.openclaw/cron/tasks.json
2. 杰克记录活动日志 ~ /.openclaw/logs/jack-activity.jsonl
3. 扎克每小时检查任务队列
4. 扎克执行任务并更新状态
5. 杰克读取任务结果
```

### 扎克通知杰克
```
1. 扎克写入共享记忆文件
2. 扎克更新活动日志
3. 杰克在下次会话时读取
```

---

## 🛠️ 工具命令

### 杰克记录活动
```bash
# PowerShell 示例
$activity = @{
    timestamp = (Get-Date -Format 'o')
    type = 'task_complete'
    detail = '完成某项任务'
    status = 'ok'
} | ConvertTo-Json

Add-Content -Path "$env:USERPROFILE\.openclaw\logs\jack-activity.jsonl" -Value $activity
```

### 扎克检查任务
```bash
openclaw cron list
```

---

## ⚠️ 注意事项

1. **避免冲突**: 同一时间只有一个代理写入共享文件
2. **时间戳**: 始终使用 ISO 8601 格式
3. **文件锁**: 写入前检查文件是否被占用
4. **日志清理**: 定期清理 7 天前的活动日志

---

## 📁 相关文件路径

| 文件 | 路径 | 用途 |
|------|------|------|
| 杰克活动日志 | `~/.openclaw/logs/jack-activity.jsonl` | 杰克活动记录 |
| 紧急通知 | `~/.openclaw/logs/jack-urgent.json` | 紧急事项 |
| 定时任务 | `~/.openclaw/cron/jobs.json` | 扎克任务队列 |
| 共享记忆 | `~/.claude/memory/shared-openclaw.md` | 共享信息 |
| 共享记忆 | `~/.openclaw/shared-memory.md` | 共享信息 |

---

## 🔧 故障排除

### 问题：扎克没有响应
1. 检查 OpenClaw 网关状态：`openclaw-cn gateway status`
2. 检查定时任务：`openclaw cron list`
3. 重启网关：`openclaw-cn gateway restart`

### 问题：共享记忆不同步
1. 检查两个共享文件是否存在
2. 手动同步两个文件内容
3. 记录同步事件到活动日志

---

*此协议由杰克创建，与扎克共同遵守*
