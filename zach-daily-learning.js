#!/usr/bin/env node

/**
 * 扎克每日学习系统
 *
 * 功能：每天自动学习一个主题，保存到扎克的记忆库
 * 位置：C:/Users/17589/.openclaw/workspace/
 *
 * 用法：
 *   node zach-daily-learning.js          # 运行今日学习
 *   node zach-daily-learning.js status   # 查看状态
 */

const fs = require('fs');
const path = require('path');

// 配置
const WORKSPACE = path.join('C:', 'Users', '17589', '.openclaw', 'workspace');
const LEARNING_DIR = path.join(WORKSPACE, 'knowledge', 'daily-learning');
const MEMORY_FILE = path.join(WORKSPACE, 'MEMORY.md');

// 扎克的学习主题（和杰克不同）
const ZACH_TOPICS = [
  { category: 'OpenClaw', topic: 'RPC 通信协议', keywords: ['rpc', 'json-rpc', 'protocol'] },
  { category: 'OpenClaw', topic: '网关配置', keywords: ['gateway', 'port', 'token'] },
  { category: 'Node.js', topic: '文件系统操作', keywords: ['fs', 'path', 'stream'] },
  { category: 'Node.js', topic: '进程管理', keywords: ['child_process', 'spawn', 'exec'] },
  { category: '数据库', topic: 'SQLite 基础', keywords: ['sqlite', 'query', 'database'] },
  { category: '数据库', topic: 'MongoDB 基础', keywords: ['mongodb', 'document', 'collection'] },
  { category: 'API', topic: 'HTTP 请求处理', keywords: ['http', 'request', 'response'] },
  { category: 'API', topic: 'RESTful 设计', keywords: ['rest', 'resource', 'method'] },
  { category: '安全', topic: 'Token 认证', keywords: ['token', 'auth', 'verify'] },
  { category: '安全', topic: '输入验证', keywords: ['validation', 'sanitize', 'input'] },
  { category: '测试', topic: '单元测试', keywords: ['unit-test', 'assert', 'mock'] },
  { category: '测试', topic: '集成测试', keywords: ['integration', 'e2e', 'scenario'] },
  { category: '工具', topic: 'CLI 开发', keywords: ['cli', 'command', 'argv'] },
  { category: '工具', topic: '日志系统', keywords: ['log', 'level', 'format'] },
  { category: '架构', topic: '模块化设计', keywords: ['module', 'export', 'import'] },
  { category: '架构', topic: '配置管理', keywords: ['config', 'env', 'default'] },
];

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 获取今日主题
function getTodayTopic() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const topicIndex = dayOfYear % ZACH_TOPICS.length;
  return ZACH_TOPICS[topicIndex];
}

// 生成学习内容
function generateLearningContent(topic) {
  const today = new Date().toISOString().split('T')[0];
  return `# ${topic.topic}

> 学习日期：${today}
> 分类：${topic.category}
> 关键词：${topic.keywords.join(', ')}

---

## 📚 核心概念

<!-- 扎克的学习笔记 -->

## 🔑 关键要点

-

## 💡 实践应用

<!-- 如何在 OpenClaw 中应用 -->

---

*扎克每日学习系统自动生成*
`;
}

// 保存学习
function saveLearning(topic) {
  ensureDir(LEARNING_DIR);

  const today = new Date().toISOString().split('T')[0];
  const safeTopic = topic.topic.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-');
  const fileName = `${today}-${safeTopic}.md`;
  const filePath = path.join(LEARNING_DIR, fileName);

  const content = generateLearningContent(topic);
  fs.writeFileSync(filePath, content, 'utf8');

  console.log(`✅ 今日学习已保存：${fileName}`);
  console.log(`   主题：${topic.topic}`);
  console.log(`   分类：${topic.category}`);

  return filePath;
}

// 更新 MEMORY.md
function updateMemory(filePath) {
  if (!fs.existsSync(MEMORY_FILE)) {
    console.log('⚠️ MEMORY.md 不存在，跳过更新');
    return;
  }

  let content = fs.readFileSync(MEMORY_FILE, 'utf8');
  const today = new Date().toISOString().split('T')[0];

  // 检查是否已有今日学习记录
  if (content.includes(`## Daily Learning`) && content.includes(today)) {
    console.log('✅ MEMORY.md 已包含今日学习记录');
    return;
  }

  // 添加学习记录
  const learningSection = `\n## Daily Learning\n\n- **${today}**: ${filePath.split(path.sep).pop()}\n`;

  if (!content.includes('## Daily Learning')) {
    content += learningSection;
  }

  fs.writeFileSync(MEMORY_FILE, content, 'utf8');
  console.log('✅ MEMORY.md 已更新');
}

// 主程序
console.log('🧠 扎克每日学习系统启动...\n');

const topic = getTodayTopic();
console.log(`📖 今日主题：${topic.topic} (${topic.category})\n`);

const filePath = saveLearning(topic);
updateMemory(filePath);

console.log('\n✅ 学习完成！');
