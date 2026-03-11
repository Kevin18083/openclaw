# Jack Activity Log

## Purpose
Record all activities of Jack (Claude Code) so Zack (Zack) can understand backend execution

## Log Locations
- **Activity Log**: `~/.openclaw/logs/jack-activity.jsonl`
- **Urgent Notification**: `~/.openclaw/logs/jack-urgent.json`

## Log Format (JSONL)

```json
{"timestamp":"2026-03-07T14:30:00Z","type":"file_created","path":"C:/xxx/xxx.md","description":"File created"}
```

## Event Types

| Type | Description | Example |
|------|-------------|---------|
| `file_created` | File created | Create script/document |
| `file_modified` | File modified | Modify config file |
| `file_deleted` | File deleted | Clean up temp files |
| `config_changed` | Config changed | Modify openclaw.json |
| `system_event` | System event | Restart gateway/service |
| `task_complete` | Task complete | Complete task from Zack |
| `error_occurred` | Error occurred | Encounter noteworthy error |

## Zack Check Frequency
- **Regular Check**: Hourly (via scheduled task)
- **Urgent Check**: Process immediately when `jack-urgent.json` detected

---
*Last updated: 2026-03-07*
