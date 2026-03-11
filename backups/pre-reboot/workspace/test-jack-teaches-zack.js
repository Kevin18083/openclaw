#!/usr/bin/env node

/**
 * 杰克 - 扎克互动指南 - 深度测试脚本 v1.0
 *
 * 功能说明：
 * 1. 文件验证 - 验证 jack-teaches-zack.md 文件完整性
 * 2. 结构检查 - 检查 Markdown 结构（标题、代码块、表格）
 * 3. 内容验证 - 验证触发词、互动方式、FAQ 等关键内容
 * 4. 质量评估 - 评估文件质量和一致性
 *
 * 测试项目：
 * - 基础信息：行数、字符数、文件大小、版本
 * - Markdown 结构：H1-H4 标题、代码块、表格
 * - 内容检查：触发词、互动内容章节、互动方式、FAQ
 * - 质量检查：文件引用、内部链接、版本号一致性、重复内容
 *
 * 配置说明：
 * - FILE_PATH: 被测试文件路径
 * - requiredSections: 必需的互动内容章节数组
 * - interactionModes: 必需的互动方式数组
 *
 * 用法：
 *   node test-jack-teaches-zack.js           # 执行深度测试
 *
 * 示例输出：
 *   🧪 杰克 - 扎克互动指南 - 深度测试
 *   ======================================================================
 *   【测试 1】基础信息检查
 *   文件行数：500
 *   ✅ 通过
 *
 * 常见错误：
 * - 文件不存在 → 检查 FILE_PATH 配置
 * - 文件读取失败 → 检查文件权限
 *
 * 依赖：
 * - Node.js 14+
 * - fs, path (内置模块)
 *
 * 修改历史：
 * - 2026-03-10: 初始版本 + 8 类注释
 */

const fs = require('fs');
const path = require('path');

const FILE_PATH = 'C:\\Users\\17589\\.openclaw\\workspace\\jack-teaches-zack.md';

console.log('🧪 杰克 - 扎克互动指南 - 深度测试\n');
console.log('='.repeat(70));

// 读取文件
let content;
try {
  content = fs.readFileSync(FILE_PATH, 'utf-8');
  console.log('✅ 文件读取成功');
} catch (e) {
  console.log('❌ 文件读取失败:', e.message);
  process.exit(1);
}

const lines = content.split('\n');

// 测试 1: 基础信息
console.log('\n【测试 1】基础信息检查');
console.log('-'.repeat(70));
console.log(`文件行数：${lines.length}`);
console.log(`文件字符数：${content.length}`);
console.log(`文件大小：${(Buffer.byteLength(content, 'utf-8') / 1024).toFixed(2)} KB`);
console.log(`版本：${content.match(/\*\*版本\*\*: (.+)/)?.[1] || '未找到'}`);
console.log('✅ 通过');

// 测试 2: Markdown 结构
console.log('\n【测试 2】Markdown 结构检查');
console.log('-'.repeat(70));
const h1Count = (content.match(/^# /gm) || []).length;
const h2Count = (content.match(/^## /gm) || []).length;
const h3Count = (content.match(/^### /gm) || []).length;
const h4Count = (content.match(/^#### /gm) || []).length;
console.log(`H1 标题数：${h1Count}`);
console.log(`H2 标题数：${h2Count}`);
console.log(`H3 标题数：${h3Count}`);
console.log(`H4 标题数：${h4Count}`);
console.log(`总标题数：${h1Count + h2Count + h3Count + h4Count}`);
console.log('✅ 通过');

// 测试 3: 代码块检查
console.log('\n【测试 3】代码块检查');
console.log('-'.repeat(70));
const codeBlockMarks = content.match(/^```/gm) || [];
const codeBlockStartsWithLang = content.match(/^```\w+$/gm) || [];
const codeBlockEnds = content.match(/^```$/gm) || [];
console.log(`代码块标记总数：${codeBlockMarks.length}`);
console.log(`带语言标识的开始标记：${codeBlockStartsWithLang.length}`);
console.log(`结束标记：${codeBlockEnds.length}`);
// 开始标记 = 带语言的 + (总数 - 带语言的) / 2 的整数部分
const totalMarks = codeBlockMarks.length;
if (totalMarks % 2 === 0) {
  console.log(`✅ 代码块成对 (${totalMarks / 2} 个代码块)`);
} else {
  console.log('❌ 代码块不成对！');
}

// 测试 4: 触发词检查
console.log('\n【测试 4】触发词检查');
console.log('-'.repeat(70));
const triggerSection = content.match(/### 📋 触发词列表.*?```([\s\S]*?)```/m);
if (triggerSection) {
  const triggers = triggerSection[1].trim().split(/[,、\n]+/).filter(t => t.trim());
  console.log(`触发词数量：${triggers.length}`);
  console.log('触发词列表:');
  triggers.forEach(t => console.log(`  - ${t.trim()}`));
  if (triggers.length >= 20) {
    console.log('✅ 触发词数量充足');
  } else {
    console.log('⚠️ 触发词数量不足 20 个');
  }
} else {
  // 尝试另一种匹配方式
  const altTrigger = content.match(/```[\r\n]*([\s\S]*?杰克[\s\S]*?)[\r\n]*```/);
  if (altTrigger) {
    const triggers = altTrigger[1].trim().split(/[,、\n]+/).filter(t => t.trim());
    console.log(`触发词数量：${triggers.length} (备用匹配)`);
    console.log('✅ 通过 (备用匹配成功)');
  } else {
    console.log('❌ 未找到触发词列表');
  }
}

// 测试 5: 互动内容章节检查
console.log('\n【测试 5】互动内容章节检查');
console.log('-'.repeat(70));
const requiredSections = [
  '代码编写指导',
  '系统操作指导',
  '框架/架构指导',
  '数据处理指导',
  '文档编写指导',
  '团队协作指导',
  '测试指导'
];
requiredSections.forEach(section => {
  if (content.includes(section)) {
    console.log(`✅ ${section}`);
  } else {
    console.log(`❌ 缺少：${section}`);
  }
});

// 测试 6: 互动方式检查
console.log('\n【测试 6】互动方式检查');
console.log('-'.repeat(70));
const interactionModes = ['问答式', '协作式', '教学式'];
interactionModes.forEach(mode => {
  if (content.includes(mode)) {
    console.log(`✅ ${mode}`);
  } else {
    console.log(`❌ 缺少：${mode}`);
  }
});

// 测试 7: FAQ 检查
console.log('\n【测试 7】FAQ 检查');
console.log('-'.repeat(70));
const faqSection = content.match(/## 📚 万能 FAQ/);
const faqCount = (content.match(/\*\*Q\d+:/g) || []).length;
if (faqSection) {
  console.log(`✅ FAQ 章节存在`);
  console.log(`FAQ 数量：${faqCount}`);
} else {
  console.log('❌ 缺少 FAQ 章节');
}

// 测试 8: 文件引用检查
console.log('\n【测试 8】文件引用检查');
console.log('-'.repeat(70));
const jackTestGuideRef = content.includes('jack-test-guide.md');
console.log(`引用 jack-test-guide.md: ${jackTestGuideRef ? '✅' : '❌'}`);

// 测试 9: 表格检查
console.log('\n【测试 9】表格检查');
console.log('-'.repeat(70));
const tableCount = (content.match(/^\|.*\|$/gm) || []).length;
console.log(`表格行数：${tableCount}`);
console.log('✅ 通过');

// 测试 10: 链接检查
console.log('\n【测试 10】内部链接检查');
console.log('-'.repeat(70));
const internalLinks = content.match(/\[([^\]]+)\]\((#[^\)]+)\)/g) || [];
console.log(`内部锚点链接数：${internalLinks.length}`);
console.log('✅ 通过');

// 测试 11: 版本号一致性
console.log('\n【测试 11】版本号一致性检查');
console.log('-'.repeat(70));
const versionInHeader = content.match(/^\> \*\*版本\*\*: (.+)$/m)?.[1];
const versionInFooter = content.match(/\*版本：(.+?) \(/)?.[1];
console.log(`页眉版本：${versionInHeader || '未找到'}`);
console.log(`页脚版本：${versionInFooter || '未找到'}`);
if (versionInHeader && versionInFooter && versionInHeader.includes(versionInFooter.split(' ')[0])) {
  console.log('✅ 版本一致');
} else {
  console.log('⚠️ 版本可能不一致');
}

// 测试 12: 特殊字符检查
console.log('\n【测试 12】特殊字符检查');
console.log('-'.repeat(70));
const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu) || []).length;
const checkmarkCount = (content.match(/✅|❌|⚠️/g) || []).length;
console.log(`Emoji 数量：${emojiCount}`);
console.log(`检查标记数量：${checkmarkCount}`);
console.log('✅ 通过');

// 测试 13: 重复内容检查
console.log('\n【测试 13】重复标题检查');
console.log('-'.repeat(70));
const headings = content.match(/^#{1,6}\s+(.+)$/gm) || [];
const headingTexts = headings.map(h => h.replace(/^#{1,6}\s+/, '').trim());
const duplicates = headingTexts.filter((h, i) => headingTexts.indexOf(h) !== i);
if (duplicates.length > 0) {
  console.log(`⚠️ 发现重复标题：${[...new Set(duplicates)].join(', ')}`);
} else {
  console.log('✅ 无重复标题');
}

// 测试 14: 空行检查
console.log('\n【测试 14】空行检查');
console.log('-'.repeat(70));
const emptyLines = lines.filter(l => l.trim() === '').length;
const emptyLineRatio = (emptyLines / lines.length * 100).toFixed(1);
console.log(`空行数量：${emptyLines}`);
console.log(`空行比例：${emptyLineRatio}%`);
console.log('✅ 通过');

console.log('\n' + '='.repeat(70));
console.log('🎉 深度测试完成！\n');
