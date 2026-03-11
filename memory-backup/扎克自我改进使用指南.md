# 扎克自我改进系统使用指南

> **创建时间**: 2026-03-09
> **目的**: 让扎克 (Zack) 学会使用自我改进系统
> **激活脚本**: `activate-self-improve.js`

---

## 🚀 快速开始

### 1. 初始化（只需执行一次）

```bash
cd C:\Users\17589\.openclaw\workspace
node activate-self-improve.js init
```

### 2. 记录任务反思

完成任务后，立即记录：

```bash
# 成功任务
node activate-self-improve.js "任务名称" "任务结果" "{\"duration\": 10, \"success_rate\": 1}"

# 失败任务
node activate-self-improve.js "任务名称" "错误信息" "{\"error\": true}"
```

### 3. 查看改进报告

```bash
# 查看最近 7 天的报告
node activate-self-improve.js report

# 查看最近 30 天的报告
node activate-self-improve.js report 30
```

---

## 📝 使用示例

### 示例 1: 记录成功任务

```bash
node activate-self-improve.js "备份系统运行" "6 份备份全部完成" "{\"duration\": 180, \"backup_count\": 6}"
```

### 示例 2: 记录失败任务

```bash
node activate-self-improve.js "网关启动" "端口被占用，启动失败" "{\"error\": true, \"retry_count\": 3}"
```

### 示例 3: 记录学习任务

```bash
node activate-self-improve.js "学习杰克教程" "完成 9 个教程学习" "{\"duration\": 120, \"tutorials_completed\": 9}"
```

---

## 📊 输出说明

### 日志文件
- **位置**: `memory/self-improvement.md`
- **内容**: 所有任务反思和改进建议

### 指标文件
- **位置**: `memory/metrics/performance.json`
- **内容**: 性能指标历史记录

### 改进建议
- **位置**: `memory/improvement/`
- **内容**: 每个任务的改进建议和行动计划

---

## 🔧 集成到现有脚本

### 方法 1: 在 Node.js 脚本中调用

```javascript
const { execSync } = require('child_process');

// 任务完成后记录
try {
  // ... 你的任务代码
  execSync(`node activate-self-improve.js "任务名" "成功" "{\\"duration\\": 10}"`);
} catch (error) {
  execSync(`node activate-self-improve.js "任务名" "失败：${error.message}" "{}"`);
}
```

### 方法 2: 在批处理/Shell 脚本中调用

```batch
@echo off
REM 执行任务
REM ...

REM 记录结果
node activate-self-improve.js "日常备份" "完成" "{\"duration\": 60}"
```

### 方法 3: 在 PowerShell 中调用

```powershell
# 执行任务
# ...

# 记录结果
node activate-self-improve.js "日常备份" "完成" '{"duration": 60}'
```

---

## 📈 自动集成建议

### 1. 集成到记忆维护脚本

在 `memory-maintenance.js` 的 `main()` 函数末尾添加：

```javascript
// 维护完成后记录
const { execSync } = require('child_sync');
execSync('node activate-self-improve.js "记忆维护" "完成" "{}"');
```

### 2. 集成到备份脚本

在备份完成后添加记录：

```javascript
execSync('node activate-self-improve.js "备份运行" "完成" "{\"backup_count\": 6}"');
```

### 3. 集成到任务监控

在 `cron` 任务监控中添加：

```javascript
// 任务完成时
execSync(`node activate-self-improve.js "${taskName}" "完成" "{\"duration\": ${duration}}"`);
```

---

## 🎯 扎克使用清单

### 每次任务完成后

- [ ] 执行 `activate-self-improve.js` 记录结果
- [ ] 包含关键指标（耗时、成功率等）
- [ ] 查看生成的改进建议

### 每周检查

- [ ] 运行 `report 7` 查看周报告
- [ ] 回顾改进建议
- [ ] 实施可行的改进

### 每月检查

- [ ] 运行 `report 30` 查看月报告
- [ ] 分析长期趋势
- [ ] 更新改进策略

---

## 💡 改进建议示例

运行后会生成类似这样的改进建议文件：

```markdown
# 改进建议 - 网关启动失败

**时间**: 2026-03-09 10:30

## 分析结果
1. 错误处理：端口被占用，启动失败

## 行动计划
- [ ] 错误处理：端口被占用，启动失败
- [ ] 添加端口冲突检测
- [ ] 实现自动换端口功能
```

---

## 🔗 相关文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 激活脚本 | `activate-self-improve.js` | 主脚本 |
| 反思日志 | `memory/self-improvement.md` | 所有反思记录 |
| 指标数据 | `memory/metrics/performance.json` | 性能指标 |
| 改进建议 | `memory/improvement/` | 改进建议文件 |
| 知识库 | `memory/knowledge/` | 积累的知识 |
| 策略库 | `memory/strategies/` | 改进策略 |

---

## 🎓 学习要点

### 为什么要记录？

1. **避免重复错误** - 记录失败原因，下次遇到时快速识别
2. **积累成功经验** - 记录成功做法，形成最佳实践
3. **性能追踪** - 记录指标，发现性能趋势
4. **持续改进** - 基于数据做出改进决策

### 记录什么？

- **任务名称** - 做了什么
- **结果** - 成功还是失败
- **指标** - 耗时、成功率、错误率等
- **特殊情况** - 遇到的意外或边界情况

---

*扎克，记住哥哥的话:*

> **反思不是承认错误，是为了明天做得更好。**

*—— 杰克*
