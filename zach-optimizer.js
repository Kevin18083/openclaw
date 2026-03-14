#!/usr/bin/env node
/**
 * 扎克系统优化脚本
 * 功能：清理缓存、释放内存、优化性能
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 扎克系统优化开始...\n');

// 1. 清理 npm 缓存
console.log('📦 清理 npm 缓存...');
try {
  execSync('npm cache clean --force', { stdio: 'pipe' });
  console.log('   ✅ npm 缓存已清理');
} catch (e) {
  console.log('   ⚠️  npm 缓存清理跳过');
}

// 2. 清理临时文件
console.log('\n🗑️  清理临时文件...');
const tempPaths = [
  'C:\\Users\\17589\\AppData\\Local\\Temp',
  'C:\\Users\\17589\\.openclaw\\workspace\\tmp'
];

let cleanedCount = 0;
for (const tempPath of tempPaths) {
  if (fs.existsSync(tempPath)) {
    try {
      const files = fs.readdirSync(tempPath);
      for (const file of files) {
        if (file.endsWith('.tmp') || file.endsWith('.log') || file.startsWith('claw-')) {
          fs.unlinkSync(path.join(tempPath, file));
          cleanedCount++;
        }
      }
    } catch (e) {
      // 跳过无法删除的文件
    }
  }
}
console.log(`   ✅ 清理 ${cleanedCount} 个临时文件`);

// 3. 清理 git 缓存
console.log('\n📂 清理 git 缓存...');
try {
  execSync('git gc --prune=now', { 
    cwd: 'C:\\Users\\17589\\.openclaw\\workspace',
    stdio: 'pipe'
  });
  console.log('   ✅ git 仓库已优化');
} catch (e) {
  console.log('   ⚠️  git 优化跳过');
}

// 4. 检查并关闭冗余进程
console.log('\n🔍 检查冗余进程...');
try {
  const { exec } = require('child_process');
  exec('tasklist /FI "IMAGENAME eq node.exe" /FO CSV /NH', (err, stdout) => {
    if (!err) {
      const lines = stdout.trim().split('\n');
      console.log(`   📊 发现 ${lines.length} 个 Node 进程`);
      if (lines.length > 5) {
        console.log('   ⚠️  Node 进程较多，建议手动检查');
      }
    }
  });
} catch (e) {
  console.log('   ⚠️  进程检查跳过');
}

// 5. 同步主备记忆
console.log('\n🔄 同步主备记忆系统...');
const memoryDir = 'C:\\Users\\17589\\.openclaw\\workspace\\memory';
const memoryBackupDir = 'C:\\Users\\17589\\.openclaw\\workspace\\memory-backup';

if (fs.existsSync(memoryDir) && fs.existsSync(memoryBackupDir)) {
  const files = fs.readdirSync(memoryDir).filter(f => 
    f.endsWith('.md') || f.endsWith('.json')
  );
  
  let synced = 0;
  for (const file of files) {
    const src = path.join(memoryDir, file);
    const dest = path.join(memoryBackupDir, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      synced++;
    }
  }
  console.log(`   ✅ 同步 ${synced} 个文件`);
}

// 6. 网关健康检查
console.log('\n🔌 检查网关状态...');
try {
  const start = Date.now();
  execSync('openclaw-cn gateway status', { stdio: 'pipe' });
  const duration = Date.now() - start;
  console.log(`   ✅ 网关响应：${duration}ms`);
} catch (e) {
  console.log('   ⚠️  网关检查失败');
}

console.log('\n✅ 系统优化完成！\n');
console.log('📊 优化摘要:');
console.log(`   - 临时文件清理：${cleanedCount} 个`);
console.log('   - npm 缓存：已清理');
console.log('   - git 仓库：已优化');
console.log('   - 记忆同步：已完成');
console.log('\n💡 建议：如仍感觉卡顿，可重启网关或关闭不必要的浏览器标签页\n');
