#!/usr/bin/env node
/**
 * 记忆完整性检查脚本
 * 检查主备记忆系统的数据完整性
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const MEMORY_BACKUP_DIR = path.join(WORKSPACE, 'memory-backup');
const MEMORY_MD = path.join(WORKSPACE, 'MEMORY.md');

console.log('════════════════════════════════════════════════════════');
console.log('          记忆系统完整性检查报告');
console.log('════════════════════════════════════════════════════════\n');

// 1. 检查 MEMORY.md
console.log('📄 MEMORY.md 检查:');
console.log(`   存在：${fs.existsSync(MEMORY_MD) ? '✅' : '❌'}`);
if (fs.existsSync(MEMORY_MD)) {
  const stats = fs.statSync(MEMORY_MD);
  console.log(`   大小：${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`   最后修改：${stats.mtime.toLocaleString('zh-CN')}`);
}

// 2. 检查主记忆目录
console.log('\n📂 主记忆目录 (memory/):');
console.log(`   存在：${fs.existsSync(MEMORY_DIR) ? '✅' : '❌'}`);
if (fs.existsSync(MEMORY_DIR)) {
  const files = fs.readdirSync(MEMORY_DIR);
  console.log(`   文件/目录数：${files.length}`);
  
  // 检查子目录
  const dirs = files.filter(f => fs.statSync(path.join(MEMORY_DIR, f)).isDirectory());
  console.log(`   子目录：${dirs.join(', ') || '无'}`);
  
  // 检查日常记忆
  const dailyDir = path.join(MEMORY_DIR, 'daily');
  if (fs.existsSync(dailyDir)) {
    const dailyFiles = fs.readdirSync(dailyDir).filter(f => f.endsWith('.md'));
    console.log(`   日常记忆文件：${dailyFiles.length} 个`);
    console.log(`   日期范围：${dailyFiles[0]} 至 ${dailyFiles[dailyFiles.length - 1]}`);
  }
}

// 3. 检查备记忆目录
console.log('\n📂 备记忆目录 (memory-backup/):');
console.log(`   存在：${fs.existsSync(MEMORY_BACKUP_DIR) ? '✅' : '❌'}`);
if (fs.existsSync(MEMORY_BACKUP_DIR)) {
  const files = fs.readdirSync(MEMORY_BACKUP_DIR);
  console.log(`   文件/目录数：${files.length}`);
  
  // 检查子目录
  const dirs = files.filter(f => fs.statSync(path.join(MEMORY_BACKUP_DIR, f)).isDirectory());
  console.log(`   子目录：${dirs.join(', ') || '无'}`);
  
  // 检查日常记忆
  const dailyDir = path.join(MEMORY_BACKUP_DIR, 'daily');
  if (fs.existsSync(dailyDir)) {
    const dailyFiles = fs.readdirSync(dailyDir).filter(f => f.endsWith('.md'));
    console.log(`   日常记忆文件：${dailyFiles.length} 个`);
  } else {
    console.log(`   日常记忆目录：❌ 不存在`);
  }
}

// 4. 递归统计文件数
function countFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      count += countFiles(fullPath);
    } else if (item.endsWith('.md') || item.endsWith('.json')) {
      count++;
    }
  }
  return count;
}

console.log('\n📊 文件统计:');
const mainCount = countFiles(MEMORY_DIR);
const backupCount = countFiles(MEMORY_BACKUP_DIR);
console.log(`   主记忆：${mainCount} 个文件 (.md + .json)`);
console.log(`   备记忆：${backupCount} 个文件 (.md + .json)`);
console.log(`   差异：${mainCount - backupCount} 个文件`);

// 5. 检查关键文件
console.log('\n🔑 关键文件检查:');
const criticalFiles = [
  'MEMORY.md',
  'memory/memory-state.json',
  'memory/mirror-switcher.js',
  'memory/memory-maintenance.js'
];

for (const file of criticalFiles) {
  const fullPath = path.join(WORKSPACE, file);
  const exists = fs.existsSync(fullPath);
  console.log(`   ${file}: ${exists ? '✅' : '❌'}`);
}

// 6. 检查镜像系统
console.log('\n🪞 镜像系统检查:');
const mirrorPaths = [
  'C:\\Users\\17589\\.openclaw\\workspace\\backups\\knowledge-main\\memory',
  'C:\\Users\\17589\\.openclaw\\workspace\\backups\\knowledge-backup\\memory',
  'D:\\AAAAAA\\openclaw-backup\\memory'
];

for (const mirrorPath of mirrorPaths) {
  const exists = fs.existsSync(mirrorPath);
  const fileCount = exists ? fs.readdirSync(mirrorPath).length : 0;
  console.log(`   ${mirrorPath}: ${exists ? `✅ ${fileCount} 个文件` : '❌ 不存在'}`);
}

console.log('\n════════════════════════════════════════════════════════');
console.log('检查完成！');
console.log('════════════════════════════════════════════════════════\n');
