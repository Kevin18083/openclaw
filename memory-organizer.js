/**
 * 记忆整理器 - 按照周、月、年维度整理记忆系统
 * 版本: 1.0.0
 * 作者: 扎克
 * 创建时间: 2026-03-12
 * 功能: 重新整理记忆文件，按时间维度分类
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  memoryDir: path.join(__dirname, 'memory'),
  dailyDir: path.join(__dirname, 'memory/daily'),
  weeklyDir: path.join(__dirname, 'memory/weekly'),
  monthlyDir: path.join(__dirname, 'memory/monthly'),
  yearlyDir: path.join(__dirname, 'memory/yearly'),
  categoriesDir: path.join(__dirname, 'memory/categories'),
  archiveDir: path.join(__dirname, 'memory/archive'),
  
  // 保留策略
  retention: {
    daily: 7,    // 保留最近7天
    weekly: 4,   // 保留最近4周
    monthly: 12, // 保留最近12个月
    yearly: 10   // 保留最近10年
  }
};

/**
 * 主函数 - 整理记忆系统
 */
async function organizeMemory() {
  console.log('🎯 开始整理记忆系统...');
  
  try {
    // 1. 收集所有记忆文件
    const allFiles = await collectMemoryFiles();
    console.log(`📁 找到 ${allFiles.length} 个记忆文件`);
    
    // 2. 分类文件
    const categorized = await categorizeFiles(allFiles);
    
    // 3. 移动文件到对应目录
    await moveFiles(categorized);
    
    // 4. 创建周、月、年汇总
    await createSummaries();
    
    // 5. 清理旧文件
    await cleanupOldFiles();
    
    // 6. 更新 MEMORY.md
    await updateMainMemory();
    
    console.log('✅ 记忆整理完成！');
    
  } catch (error) {
    console.error('❌ 整理过程中出错:', error);
    throw error;
  }
}

/**
 * 收集所有记忆文件
 */
async function collectMemoryFiles() {
  const files = [];
  
  // 读取 memory 目录下的所有 .md 文件
  const items = fs.readdirSync(CONFIG.memoryDir, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isFile() && item.name.endsWith('.md')) {
      const filePath = path.join(CONFIG.memoryDir, item.name);
      const stats = fs.statSync(filePath);
      
      files.push({
        name: item.name,
        path: filePath,
        size: stats.size,
        mtime: stats.mtime,
        type: determineFileType(item.name)
      });
    }
  }
  
  return files;
}

/**
 * 确定文件类型
 */
function determineFileType(filename) {
  // 日常记忆文件 (YYYY-MM-DD.md)
  if (/^\d{4}-\d{2}-\d{2}\.md$/.test(filename)) {
    return 'daily';
  }
  
  // 学习相关文件
  if (filename.includes('learn') || filename.includes('tutorial') || filename.includes('学习') || filename.includes('教程')) {
    return 'learning';
  }
  
  // 技能相关文件
  if (filename.includes('skill') || filename.includes('技能')) {
    return 'skills';
  }
  
  // 系统相关文件
  if (filename.includes('system') || filename.includes('memory') || filename.includes('系统') || filename.includes('状态')) {
    return 'system';
  }
  
  // 事件相关文件
  if (filename.includes('event') || filename.includes('log') || filename.includes('事件') || filename.includes('日志')) {
    return 'events';
  }
  
  // 其他文件
  return 'other';
}

/**
 * 分类文件
 */
async function categorizeFiles(files) {
  const categorized = {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
    learning: [],
    skills: [],
    system: [],
    events: [],
    other: []
  };
  
  for (const file of files) {
    if (file.type === 'daily') {
      categorized.daily.push(file);
    } else if (['learning', 'skills', 'system', 'events'].includes(file.type)) {
      categorized[file.type].push(file);
    } else {
      categorized.other.push(file);
    }
  }
  
  return categorized;
}

/**
 * 移动文件到对应目录
 */
async function moveFiles(categorized) {
  console.log('📦 移动文件到对应目录...');
  
  // 确保目标目录存在
  Object.keys(categorized).forEach(type => {
    const targetDir = getTargetDirectory(type);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  });
  
  // 移动文件
  for (const [type, files] of Object.entries(categorized)) {
    if (files.length === 0) continue;
    
    const targetDir = getTargetDirectory(type);
    
    for (const file of files) {
      const targetPath = path.join(targetDir, file.name);
      
      // 如果目标文件已存在，添加时间戳后缀
      let finalTargetPath = targetPath;
      if (fs.existsSync(targetPath)) {
        const timestamp = new Date().getTime();
        const ext = path.extname(file.name);
        const name = path.basename(file.name, ext);
        finalTargetPath = path.join(targetDir, `${name}-${timestamp}${ext}`);
      }
      
      fs.copyFileSync(file.path, finalTargetPath);
      console.log(`  📄 ${file.name} → ${type}/`);
    }
  }
}

/**
 * 获取目标目录
 */
function getTargetDirectory(type) {
  switch (type) {
    case 'daily':
      return CONFIG.dailyDir;
    case 'weekly':
      return CONFIG.weeklyDir;
    case 'monthly':
      return CONFIG.monthlyDir;
    case 'yearly':
      return CONFIG.yearlyDir;
    case 'learning':
      return path.join(CONFIG.categoriesDir, 'learning');
    case 'skills':
      return path.join(CONFIG.categoriesDir, 'skills');
    case 'system':
      return path.join(CONFIG.categoriesDir, 'system');
    case 'events':
      return path.join(CONFIG.categoriesDir, 'events');
    default:
      return CONFIG.archiveDir;
  }
}

/**
 * 创建周、月、年汇总
 */
async function createSummaries() {
  console.log('📊 创建时间维度汇总...');
  
  // 获取当前日期
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const week = getWeekNumber(now);
  
  // 创建周汇总
  const weeklySummary = createWeeklySummary(year, week);
  const weeklyPath = path.join(CONFIG.weeklyDir, `week-${year}-${week.toString().padStart(2, '0')}.md`);
  fs.writeFileSync(weeklyPath, weeklySummary);
  console.log(`  📅 创建周汇总: week-${year}-${week.toString().padStart(2, '0')}.md`);
  
  // 创建月汇总
  const monthlySummary = createMonthlySummary(year, month);
  const monthlyPath = path.join(CONFIG.monthlyDir, `month-${year}-${month.toString().padStart(2, '0')}.md`);
  fs.writeFileSync(monthlyPath, monthlySummary);
  console.log(`  📅 创建月汇总: month-${year}-${month.toString().padStart(2, '0')}.md`);
  
  // 创建年汇总
  const yearlySummary = createYearlySummary(year);
  const yearlyPath = path.join(CONFIG.yearlyDir, `year-${year}.md`);
  fs.writeFileSync(yearlyPath, yearlySummary);
  console.log(`  📅 创建年汇总: year-${year}.md`);
}

/**
 * 获取周数
 */
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * 创建周汇总
 */
function createWeeklySummary(year, week) {
  return `# 周汇总 - ${year}年第${week}周

## 本周概览
- **时间范围**: ${getWeekDateRange(year, week)}
- **记忆文件数**: ${countFilesInDirectory(CONFIG.dailyDir)}
- **主要活动**: 待补充

## 每日记忆
${getDailyFilesList()}

## 重要事件
1. 待补充

## 学习进展
- 待补充

## 技能提升
- 待补充

## 下周计划
1. 待补充

---
*最后更新: ${new Date().toISOString()}*
`;
}

/**
 * 获取周日期范围
 */
function getWeekDateRange(year, week) {
  // 简化实现
  return `${year}-${week}`;
}

/**
 * 统计目录中的文件数
 */
function countFilesInDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    return files.filter(file => file.endsWith('.md')).length;
  } catch {
    return 0;
  }
}

/**
 * 获取每日文件列表
 */
function getDailyFilesList() {
  try {
    const files = fs.readdirSync(CONFIG.dailyDir)
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse();
    
    return files.map(file => `- ${file.replace('.md', '')}`).join('\n');
  } catch {
    return '- 暂无每日记忆';
  }
}

/**
 * 创建月汇总
 */
function createMonthlySummary(year, month) {
  return `# 月汇总 - ${year}年${month}月

## 本月概览
- **时间**: ${year}年${month}月
- **周数**: ${getWeeksInMonth(year, month)}
- **记忆文件数**: ${countFilesInDirectory(CONFIG.weeklyDir)}
- **主要成就**: 待补充

## 每周汇总
${getWeeklyFilesList()}

## 月度统计
- 学习时间: 待补充
- 技能掌握: 待补充
- 系统运行: 待补充

## 重要里程碑
1. 待补充

## 下月计划
1. 待补充

---
*最后更新: ${new Date().toISOString()}*
`;
}

/**
 * 获取月中的周数
 */
function getWeeksInMonth(year, month) {
  return 4; // 简化
}

/**
 * 获取周文件列表
 */
function getWeeklyFilesList() {
  try {
    const files = fs.readdirSync(CONFIG.weeklyDir)
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse();
    
    return files.map(file => `- ${file.replace('.md', '')}`).join('\n');
  } catch {
    return '- 暂无周汇总';
  }
}

/**
 * 创建年汇总
 */
function createYearlySummary(year) {
  return `# 年汇总 - ${year}年

## 年度概览
- **年份**: ${year}
- **月份数**: 12
- **记忆文件数**: ${countFilesInDirectory(CONFIG.monthlyDir)}
- **年度主题**: 待补充

## 月度汇总
${getMonthlyFilesList()}

## 年度成就
### 学习成长
- 待补充

### 技能提升
- 待补充

### 系统建设
- 待补充

## 年度统计
- 总学习时间: 待补充
- 掌握技能数: 待补充
- 系统运行天数: 待补充

## 明年展望
1. 待补充

---
*最后更新: ${new Date().toISOString()}*
`;
}

/**
 * 获取月文件列表
 */
function getMonthlyFilesList() {
  try {
    const files = fs.readdirSync(CONFIG.monthlyDir)
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse();
    
    return files.map(file => `- ${file.replace('.md', '')}`).join('\n');
  } catch {
    return '- 暂无月汇总';
  }
}

/**
 * 清理旧文件
 */
async function cleanupOldFiles() {
  console.log('🧹 清理旧文件...');
  
  // 清理旧的日常记忆（保留最近7天）
  cleanupDirectoryByAge(CONFIG.dailyDir, CONFIG.retention.daily * 24 * 60 * 60 * 1000);
  
  // 清理旧的周汇总（保留最近4周）
  cleanupDirectoryByAge(CONFIG.weeklyDir, CONFIG.retention.weekly * 7 * 24 * 60 * 60 * 1000);
  
  // 清理旧的月汇总（保留最近12个月）
  cleanupDirectoryByAge(CONFIG.monthlyDir, CONFIG.retention.monthly * 30 * 24 * 60 * 60 * 1000);
}

/**
 * 按时间清理目录
 */
function cleanupDirectoryByAge(dir, maxAgeMs) {
  try {
    const files = fs.readdirSync(dir);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      const age = now - stats.mtime.getTime();
      
      if (age > maxAgeMs) {
        fs.unlinkSync(filePath);
        console.log(`  🗑️ 删除旧文件: ${file} (${Math.round(age / (24 * 60 * 60 * 1000))}天前)`);
      }
    }
  } catch (error) {
    console.warn(`⚠️ 清理目录 ${dir} 时出错:`, error.message);
  }
}

/**
 * 更新主记忆文件
 */
async function updateMainMemory() {
  console.log('📝 更新主记忆文件...');
  
  const memoryPath = path.join(CONFIG.memoryDir, 'MEMORY.md');
  let content = '';
  
  if (fs.existsSync(memoryPath)) {
    content = fs.readFileSync(memoryPath, 'utf8');
  }
  
  // 在文件开头添加整理记录
  const organizationNote = `## 记忆系统整理记录

### 整理时间: ${new Date().toISOString()}
### 整理者: 扎克
### 整理方案: 按周、月、年维度分类

### 新的目录结构
\`\`\`
memory/
├── daily/          # 每日记忆 (保留最近7天)
├── weekly/         # 每周总结 (保留最近4周)
├── monthly/        # 每月总结 (保留最近12个月)
├── yearly/         # 年度总结 (永久保留)
├── categories/     # 分类记忆
│   ├── learning/   # 学习记录
│   ├── skills/     # 技能掌握
│   ├── system/     # 系统状态
│   └── events/     # 重要事件
└── archive/        # 归档文件
\`\`\`

### 保留策略
- **每日记忆**: 保留最近7天
- **每周汇总**: 保留最近4周
- **每月汇总**: 保留最近12个月
- **年度汇总**: 永久保留

---

`;

  // 将整理记录插入到文件开头
  const updatedContent = organizationNote + content;
  fs.writeFileSync(memoryPath, updatedContent);
}

/**
 * 运行整理
 */
if (require.main === module) {
  organizeMemory().catch(console.error);
}

module.exports = { organizeMemory };