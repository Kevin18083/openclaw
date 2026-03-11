#!/usr/bin/env node
/**
 * 备份切换系统测试脚本
 */

const fs = require('fs');
const path = require('path');
const BackupSwitcher = require('./backup-switcher.js');

const STATE_FILE = 'C:\\Users\\17589\\.openclaw\\workspace\\scripts\\backup-state.json';

console.log('🧪 备份自动切换系统测试\n');
console.log('='.repeat(60));

// 测试 1: 健康检查
console.log('\n【测试 1】健康检查功能');
console.log('-'.repeat(60));
const health = BackupSwitcher.checkBackupHealth(BackupSwitcher.BACKUPS.primary.path);
console.log('主备份健康状态:', health);
console.log(health.healthy ? '✅ 通过' : '❌ 失败');

// 测试 2: 自动选择
console.log('\n【测试 2】自动选择健康备份');
console.log('-'.repeat(60));
const { checks, selectedBackup } = BackupSwitcher.selectHealthyBackup();
console.log('选择的备份:', selectedBackup);
console.log(selectedBackup ? '✅ 通过' : '❌ 失败');

// 测试 3: 状态读取
console.log('\n【测试 3】状态管理');
console.log('-'.repeat(60));
const state = BackupSwitcher.autoSwitch();
console.log('当前备份:', state.currentBackup);
console.log('最后检查:', state.lastCheck);
console.log(state.currentBackup ? '✅ 通过' : '❌ 失败');

// 测试 4: 获取路径
console.log('\n【测试 4】获取当前备份路径');
console.log('-'.repeat(60));
try {
  const backupPath = BackupSwitcher.getCurrentBackupPath();
  console.log('当前备份路径:', backupPath);
  console.log('✅ 通过');
} catch (e) {
  console.log('❌ 失败:', e.message);
}

// 测试 5: 显示完整状态
console.log('\n【测试 5】完整状态显示');
console.log('-'.repeat(60));
BackupSwitcher.showStatus();

// 测试 6: 模拟故障切换
console.log('\n【测试 6】模拟故障切换测试');
console.log('-'.repeat(60));
console.log('临时重命名主备份目录...');

const primaryPath = BackupSwitcher.BACKUPS.primary.path;
const backupPath = primaryPath + '.backup-test';

try {
  if (fs.existsSync(primaryPath)) {
    fs.renameSync(primaryPath, backupPath);
    console.log('✓ 主备份已临时隐藏');

    // 重新检查
    const newState = BackupSwitcher.autoSwitch();
    console.log('切换后的备份:', newState.currentBackup);
    
    if (newState.currentBackup === 'backup') {
      console.log('✅ 自动切换到备备份 - 通过');
    } else {
      console.log('⚠️  未切换到备备份');
    }

    // 恢复主备份
    fs.renameSync(backupPath, primaryPath);
    console.log('✓ 主备份已恢复');

    // 再次检查（应该切回主备份）
    const finalState = BackupSwitcher.autoSwitch();
    console.log('恢复后的备份:', finalState.currentBackup);
    
    if (finalState.currentBackup === 'primary') {
      console.log('✅ 自动切回主备份 - 通过');
    } else {
      console.log('⚠️  未切回主备份');
    }

  } else {
    console.log('⚠️  主备份不存在，跳过测试');
  }
} catch (e) {
  console.log('❌ 测试失败:', e.message);
  // 尝试恢复
  if (fs.existsSync(backupPath) && !fs.existsSync(primaryPath)) {
    fs.renameSync(backupPath, primaryPath);
    console.log('✓ 已恢复主备份');
  }
}

console.log('\n' + '='.repeat(60));
console.log('🎉 测试完成！\n');
