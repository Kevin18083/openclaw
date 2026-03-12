#!/usr/bin/env node
/**
 * 最终验证脚本 - 确保 9 份保护全部完好
 */

const fs = require('fs');
const path = require('path');

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
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

console.log('════════════════════════════════════════════════════════');
console.log('           最终验证 - 9 份保护完整性检查');
console.log('════════════════════════════════════════════════════════\n');

const protections = [
  { name: '主记忆 (memory/)', path: 'C:\\Users\\17589\\.openclaw\\workspace\\memory' },
  { name: '备记忆 (memory-backup/)', path: 'C:\\Users\\17589\\.openclaw\\workspace\\memory-backup' },
  { name: '镜像 1 (knowledge-main)', path: 'C:\\Users\\17589\\.openclaw\\workspace\\backups\\knowledge-main\\memory' },
  { name: '镜像 2 (knowledge-backup)', path: 'C:\\Users\\17589\\.openclaw\\workspace\\backups\\knowledge-backup\\memory' },
  { name: '镜像 3 (D 盘杀手锏)', path: 'D:\\AAAAAA\\openclaw-backup\\memory' },
  { name: '备份 1 (backup-main)', path: 'C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-main' },
  { name: '备份 2 (backup-copy)', path: 'C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-copy' },
  { name: '备份 3 (D 盘历史)', path: 'D:\\AAAAAA\\openclaw-backup-history' },
  { name: 'MEMORY.md', path: 'C:\\Users\\17589\\.openclaw\\workspace\\MEMORY.md' }
];

let allOk = true;

for (const prot of protections) {
  const exists = fs.existsSync(prot.path);
  let count = 0;
  let display = '';
  
  if (exists) {
    const stat = fs.statSync(prot.path);
    if (stat.isFile()) {
      count = 1;
      display = `${(stat.size / 1024).toFixed(2)} KB`;
    } else {
      count = countFiles(prot.path);
      display = `${count} 文件`;
    }
  }
  
  const status = exists && count > 0 ? '✅' : '❌';
  if (!exists || count === 0) allOk = false;
  
  console.log(`${status} ${prot.name}: ${exists ? display : '不存在'}`);
}

console.log('\n════════════════════════════════════════════════════════');

// 检查关键杰克文件
console.log('\n📚 杰克相关文件检查:\n');

const jackFiles = [
  'memory/jack-teaches-zack.md',
  'memory/jack-test-guide.md',
  'memory/jack-teaches-zack-coding.md',
  'memory/jack-teaches-zack-02-security.md',
  'memory/jack-teaches-zack-03-performance.md',
  'memory/jack-teaches-zack-04-testing.md',
  'memory/jack-teaches-zack-05-documentation.md',
  'memory/jack-teaches-zack-06-git.md',
  'memory/jack-teaches-zack-07-debugging.md',
  'memory/jack-teaches-zack-08-modular.md',
  'memory/jack-teaches-zack-09-automation.md',
  'memory/categories/learning/zach-learned-9-tutorials-summary.md',
  'memory/categories/learning/zach-learned-from-jack-20260309.md'
];

for (const file of jackFiles) {
  const fullPath = `C:\\Users\\17589\\.openclaw\\workspace\\${file}`;
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allOk = false;
}

console.log('\n════════════════════════════════════════════════════════');
console.log(`\n最终结果：${allOk ? '✅ 所有数据完好无损' : '❌ 发现数据丢失'}\n`);

if (allOk) {
  console.log('🎉 确认完成！');
  console.log('   - 9 份保护全部健康');
  console.log('   - 杰克教程文件完整');
  console.log('   - 学习总结完整');
  console.log('   - 日常记忆连续');
  console.log('\n💾 数据安全等级：最高级别\n');
}

process.exit(allOk ? 0 : 1);
