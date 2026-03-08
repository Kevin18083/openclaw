# 杰克自动学习系统

## 📋 系统说明

杰克 (Claude Code) 的自动学习系统，自动记录学习内容和知识积累。

## 📍 文件位置

| 文件 | 路径 | 说明 |
|------|------|------|
| 学习脚本 | `workspace/jack-auto-learn.js` | 核心学习模块 |
| 学习日志 | `workspace/memory/jack/learn-log.md` | 学习内容详细记录 |
| 知识库 | `workspace/memory/jack/knowledge.md` | 积累的知识 |
| 每日记录 | `workspace/memory/jack/YYYY-MM-DD.md` | 每日学习记录 |

## 🚀 使用方法

### 方法 1：在代码中调用

```javascript
const JackAutoLearn = require('./jack-auto-learn');
const learner = new JackAutoLearn();

// 记录学习内容
learner.learn(
  'React 基础',           // 主题
  '掌握了组件化开发...',   // 内容
  'auto'                 // 来源：auto/manual/cli
);
```

### 方法 2：命令行学习

```bash
# 学习新内容
node workspace/jack-auto-learn.js "主题" "内容"
```

### 方法 3：查看学习报告

```bash
node workspace/jack-auto-learn.js
```

## 📊 学习内容示例

### 技术学习
- 编程语言（Python、JavaScript）
- 框架（React、Vue、Express）
- 工具（Git、Docker）

### 系统知识
- 配置变更
- 脚本开发
- 问题解决

### 用户偏好
- 罗总的习惯
- 沟通风格
- 特殊要求

## 🔄 自动学习时机

| 时机 | 学习内容 |
|------|---------|
| 完成新任务后 | 任务类型、解决方法 |
| 遇到新问题时 | 问题描述、解决方案 |
| 学习新技能后 | 技能名称、核心要点 |
| 配置文件变更后 | 变更内容、影响范围 |

## 📈 查看学习历史

```bash
node workspace/jack-auto-learn.js
```

---

*最后更新：2026-03-09*
*版本：Jack Auto Learn v1.0*
