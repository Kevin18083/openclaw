#!/usr/bin/env node
/**
 * 备份自动切换系统
 * 
 * 优先级：
 * 1. backups\knowledge-main\ (主备份 - C 盘 1 号)
 * 2. backups\knowledge-backup\ (备备份 - C 盘 2 号)
 * 3. D:\AAAAAA\ClaudeBackups\backup\ (杀手锏 - D 盘)
 * 
 * 自动切换逻辑：
 * - 每次备份前自动健康检查
 * - 主备份故障 → 自动切备用
 * - 主备份恢复 → 自动切回
 * - D 盘只在两个 C 盘都故障时使用
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';
const STATE_FILE = path.join(WORKSPACE, 'scripts', 'backup-state.json');

// 三个备份位置
const BACKUPS = {
  primary: {
    name: '主备份 (C 盘 1 号)',
    path: path.join(WORKSPACE, 'backups', 'knowledge-main'),
    priority: 1
  },
  backup: {
    name: '备备份 (C 盘 2 号)',
    path: path.join(WORKSPACE, 'backups', 'knowledge-backup'),
    priority: 2
  },
  disaster: {
    name: '杀手锏 (D 盘)',
    path: 'D:\\AAAAAA\\ClaudeBackups\\backup',
    priority: 3
  }
};

// 关键目录/文件清单（用于健康检查）
const CRITICAL_ITEMS = [
  'memory',
  'skills',
  'AGENTS.md',
  'MEMORY.md'
];

/**
 * 检查目录是否包含关键项目（支持嵌套结构）
 */
function hasCriticalItems(backupPath, items) {
  let foundCount = 0;
  
  try {
    const topItems = fs.readdirSync(backupPath);
    
    // 直接检查顶层
    items.forEach(item => {
      if (topItems.includes(item)) {
        foundCount++;
      }
    });
    
    // 如果是 D 盘结构（带时间戳子目录），检查子目录
    if (foundCount === 0) {
      const subDirs = topItems.filter(i => {
        try {
          return fs.statSync(path.join(backupPath, i)).isDirectory();
        } catch {
          return false;
        }
      });
      
      // 检查最新子目录
      if (subDirs.length > 0) {
        const latestSubDir = subDirs.sort().reverse()[0];
        const subPath = path.join(backupPath, latestSubDir);
        const subItems = fs.readdirSync(subPath);
        
        items.forEach(item => {
          if (subItems.includes(item)) {
            foundCount++;
          }
        });
      }
    }
  } catch (e) {
    console.warn(`检查 ${backupPath} 失败：`, e.message);
  }
  
  return foundCount;
}

/**
 * 检查备份健康状态
 */
function checkBackupHealth(backupPath) {
  const result = {
    exists: false,
    accessible: false,
    criticalItemsCount: 0,
    totalDirs: 0,
    totalFiles: 0,
    healthy: false,
    error: null
  };

  try {
    // 检查目录是否存在
    if (!fs.existsSync(backupPath)) {
      result.error = '目录不存在';
      return result;
    }
    result.exists = true;

    // 检查是否可访问（读取目录列表）
    const items = fs.readdirSync(backupPath);
    result.totalDirs = items.filter(i => {
      try {
        return fs.statSync(path.join(backupPath, i)).isDirectory();
      } catch {
        return false;
      }
    }).length;
    result.totalFiles = items.filter(i => {
      try {
        return fs.statSync(path.join(backupPath, i)).isFile();
      } catch {
        return false;
      }
    }).length;
    result.accessible = true;

    // 检查关键项目（支持嵌套结构）
    result.criticalItemsCount = hasCriticalItems(backupPath, CRITICAL_ITEMS);

    // 健康判断：至少 25% 关键项目存在（D 盘可能只有部分备份，作为最后防线）
    const healthThreshold = Math.max(1, Math.floor(CRITICAL_ITEMS.length * 0.25));
    result.healthy = result.criticalItemsCount >= healthThreshold;

    if (!result.healthy) {
      result.error = `关键项目不足 (${result.criticalItemsCount}/${CRITICAL_ITEMS.length})`;
    }

  } catch (e) {
    result.error = e.message;
  }

  return result;
}

/**
 * 获取当前备份状态
 */
function getCurrentState() {
  if (!fs.existsSync(STATE_FILE)) {
    return {
      currentBackup: 'primary',
      lastCheck: null,
      lastSwitch: null,
      switchReason: null,
      healthHistory: []
    };
  }

  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  } catch (e) {
    console.warn('⚠️ 状态文件读取失败，使用默认状态');
    return {
      currentBackup: 'primary',
      lastCheck: null,
      lastSwitch: null,
      switchReason: null,
      healthHistory: []
    };
  }
}

/**
 * 保存备份状态
 */
function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * 自动选择健康备份
 */
function selectHealthyBackup() {
  console.log('🔍 开始备份健康检查...\n');

  const checks = {};
  let selectedBackup = null;

  // 按优先级检查每个备份
  for (const [key, backup] of Object.entries(BACKUPS)) {
    console.log(`检查 ${backup.name}...`);
    const health = checkBackupHealth(backup.path);
    checks[key] = health;

    console.log(`  状态：${health.exists ? '✓ 存在' : '✗ 不存在'}`);
    console.log(`  可访问：${health.accessible ? '✓' : '✗'}`);
    console.log(`  目录数：${health.totalDirs}`);
    console.log(`  文件数：${health.totalFiles}`);
    console.log(`  关键项目：${health.criticalItemsCount}/${CRITICAL_ITEMS.length}`);
    console.log(`  健康：${health.healthy ? '✅' : '❌'}\n`);

    // 选择第一个健康的备份
    if (health.healthy && !selectedBackup) {
      selectedBackup = key;
    }
  }

  return { checks, selectedBackup };
}

/**
 * 自动切换备份
 */
function autoSwitch() {
  const state = getCurrentState();
  const { checks, selectedBackup } = selectHealthyBackup();

  // 记录健康历史
  state.healthHistory.push({
    timestamp: new Date().toISOString(),
    checks: JSON.parse(JSON.stringify(checks))
  });

  // 只保留最近 100 次记录
  if (state.healthHistory.length > 100) {
    state.healthHistory = state.healthHistory.slice(-100);
  }

  state.lastCheck = new Date().toISOString();

  // 判断是否需要切换
  if (!selectedBackup) {
    console.error('❌ 所有备份都不健康！');
    state.currentBackup = null;
    state.switchReason = '所有备份故障';
    saveState(state);
    return state;
  }

  const previousBackup = state.currentBackup;
  const needsSwitch = selectedBackup !== previousBackup;

  if (needsSwitch && previousBackup) {
    console.log(`🔄 切换备份：${BACKUPS[previousBackup].name} → ${BACKUPS[selectedBackup].name}`);
    console.log(`原因：${checks[previousBackup].error || '健康检查失败'}\n`);

    state.currentBackup = selectedBackup;
    state.lastSwitch = new Date().toISOString();
    state.switchReason = checks[previousBackup].error;
  } else if (!previousBackup) {
    console.log(`✅ 初始化备份：${BACKUPS[selectedBackup].name}\n`);
    state.currentBackup = selectedBackup;
    state.lastSwitch = new Date().toISOString();
    state.switchReason = '系统初始化';
  } else {
    console.log(`✓ 备份无需切换，继续使用：${BACKUPS[selectedBackup].name}\n`);
  }

  saveState(state);
  return state;
}

/**
 * 获取当前备份路径
 */
function getCurrentBackupPath() {
  const state = getCurrentState();
  
  if (!state.currentBackup) {
    // 如果没有状态，自动选择
    const { selectedBackup } = selectHealthyBackup();
    if (selectedBackup) {
      return BACKUPS[selectedBackup].path;
    }
    throw new Error('所有备份都不可用');
  }

  return BACKUPS[state.currentBackup].path;
}

/**
 * 强制切换到指定备份
 */
function forceSwitch(backupKey) {
  if (!BACKUPS[backupKey]) {
    throw new Error(`未知备份：${backupKey}，可用：${Object.keys(BACKUPS).join(', ')}`);
  }

  const state = getCurrentState();
  const previousBackup = state.currentBackup;

  state.currentBackup = backupKey;
  state.lastSwitch = new Date().toISOString();
  state.switchReason = `用户强制切换 (${previousBackup || 'none'} → ${backupKey})`;

  saveState(state);

  console.log(`✅ 已强制切换到：${BACKUPS[backupKey].name}`);
  return state;
}

/**
 * 显示状态
 */
function showStatus() {
  const state = getCurrentState();
  const { checks } = selectHealthyBackup();

  console.log('💾 备份系统状态\n');
  console.log('='.repeat(50));
  console.log(`当前备份：${state.currentBackup ? BACKUPS[state.currentBackup].name : '未选择'}`);
  console.log(`最后检查：${state.lastCheck || '从未'}`);
  console.log(`最后切换：${state.lastSwitch || '从未'}`);
  console.log(`切换原因：${state.switchReason || '无'}\n`);

  console.log('备份健康状态:');
  console.log('-'.repeat(50));
  for (const [key, health] of Object.entries(checks)) {
    const icon = health.healthy ? '✅' : (health.exists ? '⚠️' : '❌');
    console.log(`${icon} ${BACKUPS[key].name}`);
    console.log(`   路径：${BACKUPS[key].path}`);
    console.log(`   目录：${health.totalDirs} 个`);
    console.log(`   文件：${health.totalFiles} 个`);
    console.log(`   关键：${health.criticalItemsCount}/${CRITICAL_ITEMS.length}`);
    if (health.error) {
      console.log(`   错误：${health.error}`);
    }
    console.log();
  }

  console.log('='.repeat(50));
}

/**
 * 主函数 - 命令行接口
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'check':
      // 自动检查并切换
      autoSwitch();
      break;

    case 'status':
      // 显示状态
      showStatus();
      break;

    case 'switch':
      // 强制切换
      const backupKey = args[1];
      if (!backupKey) {
        console.log('用法：node backup-switcher.js switch <primary|backup|disaster>');
        process.exit(1);
      }
      forceSwitch(backupKey);
      break;

    case 'path':
      // 获取当前备份路径
      try {
        const backupPath = getCurrentBackupPath();
        console.log(backupPath);
      } catch (e) {
        console.error('错误：', e.message);
        process.exit(1);
      }
      break;

    default:
      // 默认执行自动检查
      console.log('💾 备份自动切换系统\n');
      console.log('用法:');
      console.log('  node backup-switcher.js check    - 自动检查并切换');
      console.log('  node backup-switcher.js status   - 显示状态');
      console.log('  node backup-switcher.js switch <backup> - 强制切换 (primary/backup/disaster)');
      console.log('  node backup-switcher.js path     - 获取当前备份路径');
      console.log('  (无参数)                         - 显示此帮助\n');
      
      // 无参数时执行自动检查
      autoSwitch();
  }
}

// 导出供其他模块使用
module.exports = {
  checkBackupHealth,
  autoSwitch,
  getCurrentBackupPath,
  forceSwitch,
  showStatus,
  selectHealthyBackup,
  BACKUPS
};

// 执行
if (require.main === module) {
  main();
}
