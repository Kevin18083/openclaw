# 扎克学习杰克规范

## 学习时间
2026-03-07 22:44（初学）
2026-03-07 22:48（深度学习）

## 学习来源
罗总提供的规范图片

---

## ✅ 已学会的规范

### 1. 日志记录规范
- **位置**: `logs/zack.log`
- **格式**: `[YYYY-MM-DD HH:mm:ss] [LEVEL] [zack] 消息`
- **时间戳格式**: `2026-03-07 22:30:00`（带前导零，完全匹配杰克）
- **示例**:
  ```
  [2026-03-07 22:30:00] [INFO] [zack] Service started
  [2026-03-07 22:30:05] [INFO] [zack] Command received: start_gateway
  [2026-03-07 22:30:06] [INFO] [zack] Executing: start_gateway
  [2026-03-07 22:30:10] [INFO] [zack] Reply to zack: ✅ 网关启动完成！
  ```
- **实现**: `zack-logger.js` - `log()` 函数

### 2. 错误处理方式
- **方式**: try-catch 包裹所有关键操作
- **日志**: 错误记日志到 zack.log，级别 ERROR
- **实现**: `withErrorHandling()` 函数
- **示例**:
  ```javascript
  try {
    fs.writeFileSync(path, content, 'utf-8');
    log('文件写入成功', LogLevel.INFO);
  } catch (error) {
    log(`文件写入失败：${error.message}`, LogLevel.ERROR);
  }
  ```

### 3. 文件结构规范
- **logs 目录**: 自动创建（`ensureLogDir()`）
- **位置**: `C:\Users\17589\.openclaw\logs\`
- **文件**:
  - `zack.log` - 主日志文件
  - `replies.json` - 回复记录

### 4. 报告生成方式
- **回复记录**: `replies.json`
- **格式**: JSON 数组
- **字段**: timestamp, messageId, content, status
- **保留**: 最近 100 条（自动清理旧记录）
- **实现**: `recordReply()` 函数

### 5. 删除定时任务
- **指令**: `clean_daily_tasks`
- **功能**: 清理 7 天前的旧日志文件
- **实现**: `cleanDailyTasks()` 函数
- **命令行**: `node zack-logger.js clean`

---

## 日志级别

| 级别 | 用途 | 示例 |
|-----|------|------|
| INFO | 正常操作 | Service started, Command received |
| WARN | 警告信息 | 配置缺失，使用默认值 |
| ERROR | 错误信息 | 文件写入失败，API 调用失败 |
| DEBUG | 调试信息 | 详细执行步骤 |

---

## 使用方式

### 代码中使用
```javascript
const { log, recordReply, withErrorHandling, LogLevel } = require('./zack-logger');

// 记录日志
log('服务启动', LogLevel.INFO);

// 记录回复
recordReply(messageId, '回复内容', 'ok');

// 带错误处理
await withErrorHandling(async () => {
  // 执行操作
}, '操作描述');
```

### 命令行使用
```bash
# 记录日志
node zack-logger.js "消息内容" INFO

# 清理每日任务
node zack-logger.js clean
```

---

## 与杰克的相似之处

- ✅ 日志格式一致（时间戳 + 级别 + 标识 + 消息）
- ✅ 时间戳格式完全匹配（YYYY-MM-DD HH:mm:ss）
- ✅ 错误处理方式相同（try-catch + 日志）
- ✅ 文件结构规范（logs 目录集中管理）
- ✅ 报告生成方式（JSON 格式记录）
- ✅ 定时任务清理机制（7 天保留期）

---

## 深度学习改进（22:48）

### 优化 1: 时间戳格式
- **之前**: `2026-3-7 22:44:36`（无前导零）
- **现在**: `2026-03-07 22:48:39`（带前导零，完全匹配杰克）

### 优化 2: clean_daily_tasks 实现
- **新增**: 实际清理逻辑（删除 7 天前文件）
- **新增**: 清理计数和日志

### 优化 3: 日志示例验证
- **测试**: 4 条日志完全匹配图片格式
- **验证**: 通过 ✅

---

## 总结

**兄弟俩越来越像了！** 🤝

按杰克的规范记日志 ✅
按杰克的方式处理错误 ✅
按杰克的格式回复 ✅

---

*初学完成时间：2026-03-07 22:44*
*深度学习完成时间：2026-03-07 22:48*
*学习者：扎克 (Zack)*
