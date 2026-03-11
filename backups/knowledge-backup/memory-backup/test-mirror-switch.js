#!/usr/bin/env node
/**
 * 镜像切换系统测试脚本
 * 测试自动切换逻辑
 */

const fs = require('fs');
const path = require('path');
const MirrorSwitcher = require('./mirror-switcher.js');

const STATE_FILE = 'C:\\Users\\17589\\.openclaw\\workspace\\memory\\mirror-state.json';

console.log('🧪 镜像自动切换系统测试\n');
console.log('='.repeat(60));

// 测试 1: 健康检查
console.log('\n【测试 1】健康检查功能');
console.log('-'.repeat(60));
const health = MirrorSwitcher.checkMirrorHealth(MirrorSwitcher.MIRRORS.primary.path);
console.log('主镜像健康状态:', health);
console.log(health.healthy ? '✅ 通过' : '❌ 失败');

// 测试 2: 自动选择
console.log('\n【测试 2】自动选择健康镜像');
console.log('-'.repeat(60));
const { checks, selectedMirror } = MirrorSwitcher.selectHealthyMirror();
console.log('选择的镜像:', selectedMirror);
console.log(selectedMirror ? '✅ 通过' : '❌ 失败');

// 测试 3: 状态读取
console.log('\n【测试 3】状态管理');
console.log('-'.repeat(60));
const state = MirrorSwitcher.autoSwitch();
console.log('当前镜像:', state.currentMirror);
console.log('最后检查:', state.lastCheck);
console.log(state.currentMirror ? '✅ 通过' : '❌ 失败');

// 测试 4: 获取路径
console.log('\n【测试 4】获取当前镜像路径');
console.log('-'.repeat(60));
try {
  const mirrorPath = MirrorSwitcher.getCurrentMirrorPath();
  console.log('当前镜像路径:', mirrorPath);
  console.log('✅ 通过');
} catch (e) {
  console.log('❌ 失败:', e.message);
}

// 测试 5: 显示完整状态
console.log('\n【测试 5】完整状态显示');
console.log('-'.repeat(60));
MirrorSwitcher.showStatus();

// 测试 6: 模拟故障切换
console.log('\n【测试 6】模拟故障切换测试');
console.log('-'.repeat(60));
console.log('临时重命名主镜像目录...');

const primaryPath = MirrorSwitcher.MIRRORS.primary.path;
const backupPath = primaryPath + '.backup-test';

try {
  if (fs.existsSync(primaryPath)) {
    fs.renameSync(primaryPath, backupPath);
    console.log('✓ 主镜像已临时隐藏');

    // 重新检查
    const newState = MirrorSwitcher.autoSwitch();
    console.log('切换后的镜像:', newState.currentMirror);
    
    if (newState.currentMirror === 'backup') {
      console.log('✅ 自动切换到备镜像 - 通过');
    } else {
      console.log('⚠️  未切换到备镜像');
    }

    // 恢复主镜像
    fs.renameSync(backupPath, primaryPath);
    console.log('✓ 主镜像已恢复');

    // 再次检查（应该切回主镜像）
    const finalState = MirrorSwitcher.autoSwitch();
    console.log('恢复后的镜像:', finalState.currentMirror);
    
    if (finalState.currentMirror === 'primary') {
      console.log('✅ 自动切回主镜像 - 通过');
    } else {
      console.log('⚠️  未切回主镜像');
    }

  } else {
    console.log('⚠️  主镜像不存在，跳过测试');
  }
} catch (e) {
  console.log('❌ 测试失败:', e.message);
  // 尝试恢复
  if (fs.existsSync(backupPath) && !fs.existsSync(primaryPath)) {
    fs.renameSync(backupPath, primaryPath);
    console.log('✓ 已恢复主镜像');
  }
}

console.log('\n' + '='.repeat(60));
console.log('🎉 测试完成！\n');
