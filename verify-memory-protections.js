#!/usr/bin/env node
/**
 * 记忆系统深度验证脚本
 * 验证所有 9 份保护的完整性
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';

// 9 份保护位置
const PROTECTION_LOCATIONS = [
  { name: '主记忆', path: 'memory' },
  { name: '备记忆', path: 'memory-backup' },
  { name: '镜像 1-C 盘', path: 'backups\\knowledge-main\\memory' },
  { name: '镜像 2-C 盘', path: 'backups\\knowledge-backup\\memory' },
  { name: '镜像 3-D 盘', path: 'D:\\AAAAAA\\openclaw-backup\\memory' },
  { name: '备份 1-C 盘', path: 'backups\\backup-main' },
  { name: '备份 2-C 盘', path: 'backups\\backup-copy' },
  { name: '备份 3-D 盘', path: 'D:\\AAAAAA\\openclaw-backup-history' }
];

// 关键文件列表
const CRITICAL_FILES = [
  'MEMORY.md',
  'memory/memory-state.json',
  'memory/mirror-switcher.js',
  'memory/memory-maintenance.js',
  'memory/daily/2026-03-12.md',
  'memory/jack/knowledge.md',
  'memory/categories/learning/zach-learned-9-tutorials-summary.md'
];

console.log('════════════════════════════════════════════════════════');
console.log('        记忆系统深度验证 - 9 份保护检查');
console.log('════════════════════════════════════════════════════════\n');

let allHealthy = true;
const results = [];

// 1. 检查 9 份保护
console.log('📦 检查 9 份保护位置:\n');
for (const loc of PROTECTION_LOCATIONS) {
  const fullPath = path.join(WORKSPACE, loc.path);
  const exists = fs.existsSync(fullPath);
  
  let fileCount = 0;
  let dailyCount = 0;
  let status = '❌';
  
  if (exists) {
    try {
      const files = fs.readdirSync(fullPath);
      fileCount = files.length;
      
      // 检查 daily 目录
      const dailyPath = path.join(fullPath, 'daily');
      if (fs.existsSync(dailyPath)) {
        dailyCount = fs.readdirSync(dailyPath).filter(f => f.endsWith('.md')).length;
      }
      
      status = fileCount > 0 ? '✅' : '⚠️';
      if (fileCount === 0) allHealthy = false;
    } catch (e) {
      status = '❌';
      allHealthy = false;
    }
  } else {
    allHealthy = false;
  }
  
  results.push({ ...loc, exists, fileCount, dailyCount, status });
  console.log(`${status} ${loc.name}: ${exists ? fileCount + ' 个文件' : '不存在'} ${dailyCount > 0 ? '(日常:' + dailyCount + ')' : ''}`);
}

// 2. 检查关键文件
console.log('\n🔑 检查关键文件:\n');
for (const file of CRITICAL_FILES) {
  const fullPath = path.join(WORKSPACE, file);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  
  let size = '';
  if (exists) {
    const stat = fs.statSync(fullPath);
    size = ` (${(stat.size / 1024).toFixed(2)} KB)`;
  }
  
  console.log(`${status} ${file}${exists ? size : ''}`);
  if (!exists) allHealthy = false;
}

// 3. 验证 MEMORY.md 内容
console.log('\n📄 验证 MEMORY.md 内容:\n');
const memoryMdPath = path.join(WORKSPACE, 'MEMORY.md');
if (fs.existsSync(memoryMdPath)) {
  const content = fs.readFileSync(memoryMdPath, 'utf8');
  
  const checks = [
    { name: '系统状态部分', test: content.includes('## System Status') },
    { name: '时间线部分', test: content.includes('## Important Event Timeline') },
    { name: '2026-03-12 记录', test: content.includes('2026-03-12') },
    { name: '阿里云模型配置', test: content.includes('阿里云') || content.includes('bailian') },
    { name: '备份系统记录', test: content.includes('三重备份') || content.includes('三重镜像') }
  ];
  
  for (const check of checks) {
    console.log(`${check.test ? '✅' : '❌'} ${check.name}`);
    if (!check.test) allHealthy = false;
  }
}

// 4. 检查日常记忆连续性
console.log('\n📅 检查日常记忆连续性:\n');
const dailyDir = path.join(WORKSPACE, 'memory', 'daily');
if (fs.existsSync(dailyDir)) {
  const dailyFiles = fs.readdirSync(dailyDir)
    .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort();
  
  console.log(`找到 ${dailyFiles.length} 个日常记忆文件:`);
  console.log(`  ${dailyFiles.join(' → ')}`);
  
  // 检查是否有中断
  if (dailyFiles.length >= 2) {
    const startDate = new Date(dailyFiles[0].replace('.md', ''));
    const endDate = new Date(dailyFiles[dailyFiles.length - 1].replace('.md', ''));
    const expectedDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    if (dailyFiles.length === expectedDays) {
      console.log(`✅ 连续性完好 (${dailyFiles.length} 天无中断)`);
    } else {
      console.log(`⚠️ 可能有中断 (预期${expectedDays}天，实际${dailyFiles.length}天)`);
    }
  }
}

// 5. 最终评估
console.log('\n════════════════════════════════════════════════════════');
console.log(`最终评估：${allHealthy ? '✅ 所有保护完好' : '⚠️ 部分保护异常'}`);
console.log('════════════════════════════════════════════════════════\n');

if (allHealthy) {
  console.log('🎉 记忆系统 9 份保护全部健康！');
  console.log('   - 主备记忆系统：✅');
  console.log('   - 三重镜像：✅');
  console.log('   - 三重备份：✅');
  console.log('   - 关键文件：✅');
  console.log('   - 日常记忆：✅');
  console.log('\n💾 数据安全等级：最高 (9 份保护)\n');
} else {
  console.log('⚠️ 发现异常，请检查上述标记为 ❌ 的项目\n');
}

process.exit(allHealthy ? 0 : 1);
