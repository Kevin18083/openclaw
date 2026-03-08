/**
 * 杰克自动学习系统
 * 功能：自动学习内容并记录到记忆文件
 */

const fs = require('fs');
const path = require('path');

class JackAutoLearn {
  constructor() {
    this.memoryPath = 'C:\\Users\\17589\\.openclaw\\workspace\\memory\\jack';
    this.learnLogPath = 'C:\\Users\\17589\\.openclaw\\workspace\\memory\\jack\\learn-log.md';
    this.knowledgePath = 'C:\\Users\\17589\\.openclaw\\workspace\\memory\\jack\\knowledge.md';

    // 确保目录存在
    if (!fs.existsSync(this.memoryPath)) {
      fs.mkdirSync(this.memoryPath, { recursive: true });
      console.log('[JackAutoLearn] 创建学习目录');
    }

    // 初始化文件
    this.initFiles();
  }

  // 初始化文件
  initFiles() {
    // 学习日志
    if (!fs.existsSync(this.learnLogPath)) {
      const initContent = `# 杰克学习日志\n\n*自动记录学习内容*\n\n`;
      fs.writeFileSync(this.learnLogPath, initContent, 'utf-8');
    }

    // 知识库
    if (!fs.existsSync(this.knowledgePath)) {
      const initContent = `# 杰克知识库\n\n## 学习内容\n\n*自动学习积累的知识*\n\n`;
      fs.writeFileSync(this.knowledgePath, 'utf-8');
    }
  }

  // 记录学习内容
  learn(topic, content, source = 'auto') {
    const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    const date = new Date().toISOString().split('T')[0];

    // 更新学习日志
    this.appendLog(timestamp, topic, content, source);

    // 更新知识库
    this.updateKnowledge(topic, content);

    // 更新记忆文件
    this.updateMemory(date, topic);

    console.log(`[JackAutoLearn] 已学习：${topic}`);
  }

  // 追加日志
  appendLog(timestamp, topic, content, source) {
    let log = fs.readFileSync(this.learnLogPath, 'utf-8');
    log += `### ${timestamp} - ${topic}\n\n`;
    log += `来源：${source}\n\n`;
    log += `${content}\n\n`;
    log += `---\n\n`;

    fs.writeFileSync(this.learnLogPath, log, 'utf-8');
  }

  // 更新知识库
  updateKnowledge(topic, content) {
    let knowledge = fs.readFileSync(this.knowledgePath, 'utf-8');

    // 检查是否已存在该主题
    if (knowledge.includes(`## ${topic}`)) {
      // 更新已有主题
      const regex = new RegExp(`(## ${topic}\\n\\n)[\\s\\S]*?(?=## |$)`);
      const newSection = `$1${content}\n\n`;
      knowledge = knowledge.replace(regex, newSection);
    } else {
      // 添加新主题
      knowledge += `## ${topic}\n\n${content}\n\n---\n\n`;
    }

    fs.writeFileSync(this.knowledgePath, knowledge, 'utf-8');
  }

  // 更新记忆文件
  updateMemory(date, topic) {
    const memoryFile = path.join(this.memoryPath, `${date}.md`);
    let memory = '';

    if (fs.existsSync(memoryFile)) {
      memory = fs.readFileSync(memoryFile, 'utf-8');
    } else {
      memory = `# ${date} 学习记录\n\n`;
    }

    const timestamp = new Date().toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai' });
    memory += `- [x] ${timestamp} 学习：${topic}\n`;

    fs.writeFileSync(memoryFile, memory, 'utf-8');
  }

  // 获取学习历史
  getLearnHistory() {
    if (!fs.existsSync(this.learnLogPath)) {
      return [];
    }

    const log = fs.readFileSync(this.learnLogPath, 'utf-8');
    const topics = log.match(/### .+ - (.+)/g) || [];
    return topics.map(t => t.replace('### ', ''));
  }

  // 打印学习报告
  printReport() {
    console.log('\n========== 杰克学习报告 ==========');

    const history = this.getLearnHistory();
    console.log(`\n学习次数：${history.length}`);

    if (history.length > 0) {
      console.log('\n最近学习：');
      history.slice(-10).forEach(item => console.log(`  - ${item}`));
    } else {
      console.log('暂无学习记录');
    }

    console.log('\n====================================\n');
  }
}

// 导出
module.exports = JackAutoLearn;

// 命令行运行
if (require.main === module) {
  const learner = new JackAutoLearn();
  learner.printReport();

  // 测试学习
  if (process.argv[2]) {
    learner.learn(process.argv[2], process.argv[3] || '无详细内容', 'cli');
  }
}
