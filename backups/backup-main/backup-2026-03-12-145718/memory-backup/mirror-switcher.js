#!/usr/bin/env node
/**
 * 镜像自动切换系统
 * 
 * 优先级：
 * 1. memory-backup\mirror\ (主镜像 - C 盘 1 号)
 * 2. backups\mirror\ (备镜像 - C 盘 2 号)
 * 3. D:\AAAAAA\ClaudeBackups\mirror\ (杀手锏 - D 盘)
 * 
 * 自动切换逻辑：
 * - 每次使用前自动健康检查
 * - 主镜像故障 → 自动切备用
 * - 主镜像恢复 → 自动切回
 * - D 盘只在两个 C 盘都故障时使用
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';
const STATE_FILE = path.join(WORKSPACE, 'memory', 'mirror-state.json');

// 三个镜像位置
const MIRRORS = {
  primary: {
    name: '主镜像 (C 盘 1 号)',
    path: path.join(WORKSPACE, 'memory-backup', 'mirror'),
    priority: 1
  },
  backup: {
    name: '备镜像 (C 盘 2 号)',
    path: path.join(WORKSPACE, 'backups', 'mirror'),
    priority: 2
  },
  disaster: {
    name: '杀手锏 (D 盘)',
    path: 'D:\\AAAAAA\\ClaudeBackups\\mirror\\memory',
    priority: 3
  }
};

// 关键文件清单（用于健康检查）
const CRITICAL_FILES = [
  'MEMORY.md',
  'coding-agent.md',
  'skill-vetter.md',
  'shared-openclaw.md'
];

/**
 * 检查镜像健康状态
 */
function checkMirrorHealth(mirrorPath) {
  const result = {
    exists: false,
    accessible: false,
    criticalFilesCount: 0,
    totalFiles: 0,
    healthy: false,
    error: null
  };

  try {
    // 检查目录是否存在
    if (!fs.existsSync(mirrorPath)) {
      result.error = '目录不存在';
      return result;
    }
    result.exists = true;

    // 检查是否可访问（读取文件列表）
    const files = fs.readdirSync(mirrorPath);
    result.totalFiles = files.length;
    result.accessible = true;

    // 检查关键文件
    CRITICAL_FILES.forEach(file => {
      if (files.includes(file)) {
        result.criticalFilesCount++;
      }
    });

    // 健康判断：至少 75% 关键文件存在
    const healthThreshold = Math.ceil(CRITICAL_FILES.length * 0.75);
    result.healthy = result.criticalFilesCount >= healthThreshold;

    if (!result.healthy) {
      result.error = `关键文件不足 (${result.criticalFilesCount}/${CRITICAL_FILES.length})`;
    }

  } catch (e) {
    result.error = e.message;
  }

  return result;
}

/**
 * 获取当前镜像状态
 */
function getCurrentState() {
  if (!fs.existsSync(STATE_FILE)) {
    return {
      currentMirror: 'primary',
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
      currentMirror: 'primary',
      lastCheck: null,
      lastSwitch: null,
      switchReason: null,
      healthHistory: []
    };
  }
}

/**
 * 保存镜像状态
 */
function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

/**
 * 自动选择健康镜像
 */
function selectHealthyMirror() {
  console.log('🔍 开始镜像健康检查...\n');

  const checks = {};
  let selectedMirror = null;

  // 按优先级检查每个镜像
  for (const [key, mirror] of Object.entries(MIRRORS)) {
    console.log(`检查 ${mirror.name}...`);
    const health = checkMirrorHealth(mirror.path);
    checks[key] = health;

    console.log(`  状态：${health.exists ? '✓ 存在' : '✗ 不存在'}`);
    console.log(`  可访问：${health.accessible ? '✓' : '✗'}`);
    console.log(`  文件数：${health.totalFiles}`);
    console.log(`  关键文件：${health.criticalFilesCount}/${CRITICAL_FILES.length}`);
    console.log(`  健康：${health.healthy ? '✅' : '❌'}\n`);

    // 选择第一个健康的镜像
    if (health.healthy && !selectedMirror) {
      selectedMirror = key;
    }
  }

  return { checks, selectedMirror };
}

/**
 * 自动切换镜像
 */
function autoSwitch() {
  const state = getCurrentState();
  const { checks, selectedMirror } = selectHealthyMirror();

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
  if (!selectedMirror) {
    console.error('❌ 所有镜像都不健康！');
    state.currentMirror = null;
    state.switchReason = '所有镜像故障';
    saveState(state);
    return state;
  }

  const previousMirror = state.currentMirror;
  const needsSwitch = selectedMirror !== previousMirror;

  if (needsSwitch && previousMirror) {
    console.log(`🔄 切换镜像：${MIRRORS[previousMirror].name} → ${MIRRORS[selectedMirror].name}`);
    console.log(`原因：${checks[previousMirror].error || '健康检查失败'}\n`);

    state.currentMirror = selectedMirror;
    state.lastSwitch = new Date().toISOString();
    state.switchReason = checks[previousMirror].error;
  } else if (!previousMirror) {
    console.log(`✅ 初始化镜像：${MIRRORS[selectedMirror].name}\n`);
    state.currentMirror = selectedMirror;
    state.lastSwitch = new Date().toISOString();
    state.switchReason = '系统初始化';
  } else {
    console.log(`✓ 镜像无需切换，继续使用：${MIRRORS[selectedMirror].name}\n`);
  }

  saveState(state);
  return state;
}

/**
 * 获取当前镜像路径
 */
function getCurrentMirrorPath() {
  const state = getCurrentState();
  
  if (!state.currentMirror) {
    // 如果没有状态，自动选择
    const { selectedMirror } = selectHealthyMirror();
    if (selectedMirror) {
      return MIRRORS[selectedMirror].path;
    }
    throw new Error('所有镜像都不可用');
  }

  return MIRRORS[state.currentMirror].path;
}

/**
 * 强制切换到指定镜像
 */
function forceSwitch(mirrorKey) {
  if (!MIRRORS[mirrorKey]) {
    throw new Error(`未知镜像：${mirrorKey}，可用：${Object.keys(MIRRORS).join(', ')}`);
  }

  const state = getCurrentState();
  const previousMirror = state.currentMirror;

  state.currentMirror = mirrorKey;
  state.lastSwitch = new Date().toISOString();
  state.switchReason = `用户强制切换 (${previousMirror || 'none'} → ${mirrorKey})`;

  saveState(state);

  console.log(`✅ 已强制切换到：${MIRRORS[mirrorKey].name}`);
  return state;
}

/**
 * 显示状态
 */
function showStatus() {
  const state = getCurrentState();
  const { checks } = selectHealthyMirror();

  console.log('🪞 镜像系统状态\n');
  console.log('='.repeat(50));
  console.log(`当前镜像：${state.currentMirror ? MIRRORS[state.currentMirror].name : '未选择'}`);
  console.log(`最后检查：${state.lastCheck || '从未'}`);
  console.log(`最后切换：${state.lastSwitch || '从未'}`);
  console.log(`切换原因：${state.switchReason || '无'}\n`);

  console.log('镜像健康状态:');
  console.log('-'.repeat(50));
  for (const [key, health] of Object.entries(checks)) {
    const icon = health.healthy ? '✅' : (health.exists ? '⚠️' : '❌');
    console.log(`${icon} ${MIRRORS[key].name}`);
    console.log(`   路径：${MIRRORS[key].path}`);
    console.log(`   文件：${health.totalFiles} 个`);
    console.log(`   关键：${health.criticalFilesCount}/${CRITICAL_FILES.length}`);
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
      const mirrorKey = args[1];
      if (!mirrorKey) {
        console.log('用法：node mirror-switcher.js switch <primary|backup|disaster>');
        process.exit(1);
      }
      forceSwitch(mirrorKey);
      break;

    case 'path':
      // 获取当前镜像路径
      try {
        const mirrorPath = getCurrentMirrorPath();
        console.log(mirrorPath);
      } catch (e) {
        console.error('错误：', e.message);
        process.exit(1);
      }
      break;

    default:
      // 默认执行自动检查
      console.log('🪞 镜像自动切换系统\n');
      console.log('用法:');
      console.log('  node mirror-switcher.js check    - 自动检查并切换');
      console.log('  node mirror-switcher.js status   - 显示状态');
      console.log('  node mirror-switcher.js switch <mirror> - 强制切换 (primary/backup/disaster)');
      console.log('  node mirror-switcher.js path     - 获取当前镜像路径');
      console.log('  (无参数)                         - 显示此帮助\n');
      
      // 无参数时执行自动检查
      autoSwitch();
  }
}

// 导出供其他模块使用
module.exports = {
  checkMirrorHealth,
  autoSwitch,
  getCurrentMirrorPath,
  forceSwitch,
  showStatus,
  selectHealthyMirror,
  MIRRORS
};

// 执行
if (require.main === module) {
  main();
}
