#!/usr/bin/env node
/**
 * 自动备份脚本
 * 功能：
 * 1. 三重镜像备份（实时同步）
 * 2. 三重历史备份（保留 7 天）
 * 3. 验证备份完整性
 * 4. 清理过期备份
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';

// 备份切换系统
const BackupSwitcher = require('./backup-switcher.js');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '-' + 
                  new Date().toTimeString().split(' ')[0].replace(/:/g, '');

// 备份目录配置
const BACKUP_CONFIG = {
  // 三重镜像（实时同步，覆盖旧的）
  mirrors: [
    path.join(WORKSPACE, 'backups', 'knowledge-main'),
    path.join(WORKSPACE, 'backups', 'knowledge-backup'),
    'D:\\AAAAAA\\openclaw-backup'
  ],
  
  // 三重历史备份（保留 7 天）
  backups: [
    path.join(WORKSPACE, 'backups', 'backup-main', `backup-${TIMESTAMP}`),
    path.join(WORKSPACE, 'backups', 'backup-copy', `backup-${TIMESTAMP}`),
    'D:\\AAAAAA\\openclaw-backup-history\\' + `backup-${TIMESTAMP}`
  ]
};

// 要备份的目录和文件
const ITEMS_TO_BACKUP = [
  'memory',
  'memory-backup',
  'MEMORY.md',
  'SOUL.md',
  'USER.md',
  'IDENTITY.md',
  'HEARTBEAT.md',
  'AGENTS.md',
  'TOOLS.md',
  'scripts',
  'skills'
];

/**
 * 确保目录存在
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 创建目录：${dirPath}`);
  }
}

/**
 * 复制文件或目录
 */
function copyItem(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    // 复制整个目录
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    items.forEach(item => {
      copyItem(path.join(src, item), path.join(dest, item));
    });
  } else {
    // 复制文件
    fs.copyFileSync(src, dest);
  }
}

/**
 * 执行镜像备份（覆盖旧的）
 */
function performMirrors() {
  console.log('\n🔄 执行三重镜像备份...\n');
  
  const results = [];
  
  BACKUP_CONFIG.mirrors.forEach((mirrorDir, index) => {
    try {
      ensureDir(mirrorDir);
      
      // 清理旧的镜像内容
      if (fs.existsSync(mirrorDir)) {
        const oldItems = fs.readdirSync(mirrorDir);
        oldItems.forEach(item => {
          const itemPath = path.join(mirrorDir, item);
          if (fs.statSync(itemPath).isDirectory()) {
            fs.rmSync(itemPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(itemPath);
          }
        });
      }
      
      // 复制新内容
      let itemCount = 0;
      ITEMS_TO_BACKUP.forEach(item => {
        const srcPath = path.join(WORKSPACE, item);
        const destPath = path.join(mirrorDir, item);
        
        if (fs.existsSync(srcPath)) {
          copyItem(srcPath, destPath);
          itemCount++;
        }
      });
      
      results.push({ mirror: index + 1, status: 'success', items: itemCount });
      console.log(`✅ 镜像${index + 1} 完成：${mirrorDir} (${itemCount} 项)`);
      
    } catch (error) {
      results.push({ mirror: index + 1, status: 'failed', error: error.message });
      console.error(`❌ 镜像${index + 1} 失败：`, error.message);
    }
  });
  
  return results;
}

/**
 * 执行历史备份（保留多版本）
 */
function performBackups() {
  console.log('\n📦 执行三重历史备份...\n');
  
  const results = [];
  
  BACKUP_CONFIG.backups.forEach((backupDir, index) => {
    try {
      ensureDir(backupDir);
      
      // 复制内容
      let itemCount = 0;
      ITEMS_TO_BACKUP.forEach(item => {
        const srcPath = path.join(WORKSPACE, item);
        const destPath = path.join(backupDir, item);
        
        if (fs.existsSync(srcPath)) {
          copyItem(srcPath, destPath);
          itemCount++;
        }
      });
      
      results.push({ backup: index + 1, status: 'success', items: itemCount, path: backupDir });
      console.log(`✅ 备份${index + 1} 完成：${backupDir} (${itemCount} 项)`);
      
    } catch (error) {
      results.push({ backup: index + 1, status: 'failed', error: error.message });
      console.error(`❌ 备份${index + 1} 失败：`, error.message);
    }
  });
  
  return results;
}

/**
 * 验证备份完整性
 */
function verifyBackups() {
  console.log('\n🔍 验证备份完整性...\n');
  
  const allDirs = [...BACKUP_CONFIG.mirrors, ...BACKUP_CONFIG.backups];
  const results = [];
  
  allDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const itemCount = fs.readdirSync(dir).length;
      const isValid = itemCount > 0;
      results.push({ dir, valid: isValid, items: itemCount });
      console.log(`${isValid ? '✅' : '❌'} ${dir}: ${itemCount} 项`);
    } else {
      results.push({ dir, valid: false, items: 0 });
      console.log(`❌ ${dir}: 不存在`);
    }
  });
  
  const passRate = results.filter(r => r.valid).length / results.length * 100;
  console.log(`\n📊 验证通过率：${passRate.toFixed(0)}% (${results.filter(r => r.valid).length}/${results.length})`);
  
  return { passRate, results };
}

/**
 * 清理过期备份（保留最近 3 天，每天最多 1 个最新备份）
 */
function cleanupOldBackups() {
  console.log('\n🧹 清理过期备份（保留最近 3 天，每天最多 1 个）...\n');

  const backupDirs = [
    path.join(WORKSPACE, 'backups', 'backup-main'),
    path.join(WORKSPACE, 'backups', 'backup-copy'),
    'D:\\AAAAAA\\openclaw-backup-history'
  ];

  const today = new Date();
  let deletedCount = 0;

  backupDirs.forEach(baseDir => {
    if (!fs.existsSync(baseDir)) return;

    const backups = fs.readdirSync(baseDir)
      .filter(name => name.startsWith('backup-'));

    // 按日期分组（提取备份名称中的日期部分）
    const backupsByDate = {};
    backups.forEach(backup => {
      const backupPath = path.join(baseDir, backup);
      const stats = fs.statSync(backupPath);
      const mtime = new Date(stats.mtime);
      const dateKey = mtime.toISOString().split('T')[0]; // YYYY-MM-DD
      const daysOld = Math.floor((today - mtime) / (1000 * 60 * 60 * 24));

      // 只处理 3 天内的备份
      if (daysOld <= 3) {
        if (!backupsByDate[dateKey]) {
          backupsByDate[dateKey] = [];
        }
        backupsByDate[dateKey].push({ name: backup, path: backupPath, mtime: stats.mtime });
      } else {
        // 超过 3 天的直接删除
        fs.rmSync(backupPath, { recursive: true, force: true });
        deletedCount++;
        console.log(`  📦 已删除：${backup} (${daysOld} 天前)`);
      }
    });

    // 对每一天的备份，只保留最新的一个
    Object.keys(backupsByDate).forEach(date => {
      const dayBackups = backupsByDate[date];
      if (dayBackups.length > 1) {
        // 按 mtime 排序，最新的在前
        dayBackups.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
        // 删除旧的，保留最新的
        for (let i = 1; i < dayBackups.length; i++) {
          fs.rmSync(dayBackups[i].path, { recursive: true, force: true });
          deletedCount++;
          console.log(`  📦 已删除：${dayBackups[i].name} (保留：${dayBackups[0].name})`);
        }
      }
    });
  });

  console.log(`✅ 清理完成，删除 ${deletedCount} 个冗余备份`);
  return { deleted: deletedCount };
}

/**
 * 生成备份报告
 */
function generateReport(mirrorResults, backupResults, verification) {
  const report = {
    timestamp: TIMESTAMP,
    mirrors: mirrorResults,
    backups: backupResults,
    verification: verification,
    summary: {
      totalMirrors: mirrorResults.filter(r => r.status === 'success').length,
      totalBackups: backupResults.filter(r => r.status === 'success').length,
      passRate: verification.passRate
    }
  };
  
  const reportPath = path.join(WORKSPACE, 'backups', `backup-report-${TIMESTAMP}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📄 备份报告已保存：${reportPath}`);
  
  return report;
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始自动备份系统执行...\n');
  console.log('📅 时间戳:', TIMESTAMP);
  console.log('📂 工作目录:', WORKSPACE);
  
  try {
    // 1. 确保备份基础目录存在
    ensureDir(path.join(WORKSPACE, 'backups'));
    
    // 1.5 备份健康检查与自动切换
    console.log('\n💾 备份系统健康检查...\n');
    const backupState = BackupSwitcher.autoSwitch();
    if (backupState.currentBackup) {
      console.log(`✅ 当前备份：${BackupSwitcher.BACKUPS[backupState.currentBackup].name}`);
    } else {
      console.log('⚠️  警告：所有备份都不健康！');
    }
    
    // 2. 执行镜像备份
    const mirrorResults = performMirrors();
    
    // 3. 执行历史备份
    const backupResults = performBackups();
    
    // 4. 验证备份
    const verification = verifyBackups();
    
    // 5. 清理过期备份
    const cleanup = cleanupOldBackups();
    
    // 6. 生成报告
    const report = generateReport(mirrorResults, backupResults, verification);
    
    console.log('\n✅ 自动备份系统执行完成！');
    console.log('📊 最终统计:', report.summary);
    
    return report;
    
  } catch (error) {
    console.error('❌ 备份失败:', error.message);
    process.exit(1);
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { main, performMirrors, performBackups, verifyBackups, cleanupOldBackups };
