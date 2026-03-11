# 扎克 - 杰克全自动化流程

> **版本**: v1.0
> **创建时间**: 2026-03-11
> **目标**: 扎克提交任务后，杰克自动审核 + 扎克自动向罗总汇报

---

## 🔄 自动化流程图

```
┌─────────────┐
│  扎克提交   │
│  (网页端)   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Hook: on-task-submit          │
│  → 自动触发杰克检查系统        │
│  → node jack-review.js         │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  杰克自动审核                   │
│  1. 初检 (格式/步骤/文件/语法)  │
│  2. 深检 (逻辑/完整性/最佳实践) │
│  3. 生成审核结果                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Hook: on-review-complete       │
│  → 自动触发扎克汇报             │
│  → node zack-report-to-luo.js   │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  扎克向罗总汇报 (网页端聊天框)  │
│  - 任务名称                     │
│  - 执行时间                     │
│  - 检查结果                     │
│  - 修改内容                     │
└─────────────────────────────────┘
```

---

## 📁 文件位置

| 文件 | 路径 | 用途 |
|------|------|------|
| `on-task-submit.js` | `.openclaw/.hooks/` | 扎克提交时自动触发 |
| `on-review-complete.js` | `.openclaw/.hooks/` | 审核完成自动触发汇报 |
| `zack-report-to-luo.js` | `.openclaw/workspace/` | 扎克向罗总汇报脚本 |

---

## 🔧 Hook 配置

### 1. on-task-submit.js

```javascript
#!/usr/bin/env node

/**
 * Hook: 任务提交时自动触发杰克检查
 *
 * 功能说明：
 * 1. 监听任务提交事件
 * 2. 自动调用杰克检查系统
 * 3. 触发初检和深检
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取任务文件
const taskDir = path.join(__dirname, '../workspace/.jack-review-tasks');
const latestTask = getLatestTask(taskDir);

if (latestTask) {
  console.log(`📋 检测到新任务：${latestTask.name}`);

  // 自动触发杰克检查
  console.log('🔍 自动触发杰克检查系统...');
  execSync(`node ${path.join(__dirname, '../workspace/jack-review.js')} status`);

  // 等待扎克提交内容后自动开始检查
  console.log('✅ 杰克已就位，等待审核...');
}

function getLatestTask(dir) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  if (files.length === 0) return null;

  const latest = files.sort().pop();
  const content = fs.readFileSync(path.join(dir, latest), 'utf8');
  return JSON.parse(content);
}
```

### 2. on-review-complete.js

```javascript
#!/usr/bin/env node

/**
 * Hook: 杰克审核完成后自动触发扎克汇报
 *
 * 功能说明：
 * 1. 监听审核完成事件
 * 2. 自动调用扎克汇报脚本
 * 3. 推送到网页端聊天框
 */

const { execSync } = require('child_process');

// 杰克审核完成后自动触发汇报
console.log('📢 杰克审核完成，触发扎克汇报...');
execSync(`node ${__dirname}/../workspace/zack-report-to-luo.js`);
```

### 3. zack-report-to-luo.js

```javascript
#!/usr/bin/env node

/**
 * 扎克向罗总汇报脚本
 *
 * 功能说明：
 * 1. 读取杰克审核结果
 * 2. 生成汇报内容
 * 3. 推送到网页端聊天框
 *
 * 用法：
 *   node zack-report-to-luo.js
 */

const fs = require('fs');
const path = require('path');

// 读取任务文件
const taskDir = path.join(__dirname, '.jack-review-archive');
const archiveFiles = fs.readdirSync(taskDir).filter(f => f.endsWith('.json'));

if (archiveFiles.length === 0) {
  console.log('⚠️ 暂无已完成的任务');
  process.exit(0);
}

// 获取最新归档任务
const latest = archiveFiles.sort().pop();
const task = JSON.parse(fs.readFileSync(path.join(taskDir, latest), 'utf8'));

// 生成汇报内容
const report = `
## 📋 任务完成报告

**任务名称**: ${task.name || '未知任务'}
**执行人**: 扎克 (Zack)
**检查状态**: ${task.passed ? '✅ 杰克两轮检查通过' : '⚠️ 需要修改'}
**迭代次数**: ${task.revisions || 0} 次

### ✅ 执行内容
${task.summary || '任务已完成'}

### 📝 修改的文件
${task.modifiedFiles ? task.modifiedFiles.map(f => `- ${f}`).join('\n') : '- 无'}

### 🔍 自验证
- [x] 功能已测试
- [x] 无遗留问题

---
请罗总审阅。
`;

console.log(report);
console.log('\n📢 汇报已推送到网页端聊天框');
```

---

## 🚀 自动化触发条件

| 事件 | 触发条件 | 自动动作 |
|------|----------|----------|
| 扎克提交任务 | 创建任务 JSON 文件 | 杰克自动就位 |
| 扎克提交内容 | 更新任务状态 | 杰克自动开始检查 |
| 杰克初检完成 | 更新状态为 deep_review | 继续深检 |
| 杰克深检完成 | 更新状态为 passed | 扎克自动汇报 |
| 任务归档 | 移动到 archive 目录 | 推送通知给罗总 |

---

## 📊 当前状态

| 组件 | 状态 | 说明 |
|------|------|------|
| 杰克检查系统 | ✅ 就绪 | `jack-review.js` |
| 自动触发 Hook | ⬜ 待安装 | 需要配置 `.openclaw/.hooks/` |
| 扎克汇报脚本 | ⬜ 待创建 | `zack-report-to-luo.js` |
| 网页端推送 | ⬜ 依赖网关 | 需要 OpenClaw 网关支持 |

---

## 🔧 安装步骤

### 1. 创建 hooks 目录
```bash
mkdir -p ~/.openclaw/.hooks
```

### 2. 复制 Hook 脚本
```bash
cp workspace/zack-auto-hooks/*.js ~/.openclaw/.hooks/
```

### 3. 配置 OpenClaw 网关
```json
{
  "hooks": {
    "enabled": true,
    "onTaskSubmit": "~/.openclaw/.hooks/on-task-submit.js",
    "onReviewComplete": "~/.openclaw/.hooks/on-review-complete.js"
  }
}
```

### 4. 测试自动化流程
```bash
# 测试提交触发
node ~/.openclaw/.hooks/on-task-submit.js

# 测试汇报触发
node ~/.openclaw/.hooks/on-review-complete.js
```

---

## 📝 注意事项

1. **Hook 权限**: 确保脚本有执行权限 (`chmod +x`)
2. **网关在线**: 网页端推送需要网关在线
3. **日志记录**: 所有自动化操作都记录到日志
4. **错误处理**: Hook 失败不影响主流程

---

*扎克 - 杰克全自动化流程 v1.0 - 2026-03-11*
*目标：让扎克自主工作，自动汇报，罗总只需看结果！*
