/**
 * 双记忆系统 - 主备自动切换
 * 功能：
 * 1. 主记忆目录：memory/
 * 2. 备用记忆目录：memory-backup/
 * 3. 自动检测主记忆是否可用
 * 4. 不可用时自动切换到备用
 * 5. 主记忆恢复后自动切回
 */

const fs = require('fs');
const path = require('path');

// 记忆目录配置
const MEMORY_CONFIG = {
  // 主记忆目录
  primary: 'C:\\Users\\17589\\.openclaw\\workspace\\memory',
  // 备用记忆目录
  backup: 'C:\\Users\\17589\\.openclaw\\workspace\\memory-backup',
  // 状态文件
  stateFile: 'C:\\Users\\17589\\.openclaw\\workspace\\memory-state.json',
  // 健康检查文件列表（关键文件）
  criticalFiles: [
    '2026-03-09.md',
    'zach-learned-9-tutorials-summary.md'
  ],
  // 自动同步：每次写入主记忆时同步到备用
  autoSync: true
};

// 当前使用的记忆目录
let currentMemoryDir = MEMORY_CONFIG.primary;
let isUsingBackup = false;
let lastCheckTime = null;
let consecutiveFailures = 0;
let consecutiveSuccesses = 0;

// 切换阈值
const SWITCH_TO_BACKUP_THRESHOLD = 3;  // 连续失败 3 次切换到备用
const SWITCH_BACK_THRESHOLD = 5;        // 连续成功 5 次切回主用

/**
 * 获取当前状态
 */
function getState() {
  try {
    if (fs.existsSync(MEMORY_CONFIG.stateFile)) {
      const state = JSON.parse(fs.readFileSync(MEMORY_CONFIG.stateFile, 'utf-8'));
      currentMemoryDir = state.currentMemoryDir || MEMORY_CONFIG.primary;
      isUsingBackup = state.isUsingBackup || false;
      consecutiveFailures = state.consecutiveFailures || 0;
      consecutiveSuccesses = state.consecutiveSuccesses || 0;
      lastCheckTime = state.lastCheckTime || null;
      return state;
    }
  } catch (e) {
    console.error('读取状态文件失败:', e.message);
  }
  
  // 默认状态
  return {
    currentMemoryDir: MEMORY_CONFIG.primary,
    isUsingBackup: false,
    consecutiveFailures: 0,
    consecutiveSuccesses: 0,
    lastCheckTime: null,
    status: 'healthy',
    lastSwitch: null,
    switchReason: null
  };
}

/**
 * 保存状态
 */
function saveState(state) {
  try {
    fs.writeFileSync(MEMORY_CONFIG.stateFile, JSON.stringify(state, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('保存状态文件失败:', e.message);
    return false;
  }
}

/**
 * 检查记忆目录健康状态
 */
function checkHealth(memoryDir) {
  try {
    // 1. 检查目录是否存在
    if (!fs.existsSync(memoryDir)) {
      return { healthy: false, reason: '目录不存在' };
    }
    
    // 2. 检查关键文件是否存在
    for (const file of MEMORY_CONFIG.criticalFiles) {
      const filePath = path.join(memoryDir, file);
      if (!fs.existsSync(filePath)) {
        return { healthy: false, reason: `关键文件缺失：${file}` };
      }
    }
    
    // 3. 检查目录是否可读
    try {
      fs.readdirSync(memoryDir);
    } catch (e) {
      return { healthy: false, reason: `目录不可读：${e.message}` };
    }
    
    // 4. 检查文件数量（至少有 10 个文件才算正常）
    const files = fs.readdirSync(memoryDir);
    if (files.length < 10) {
      return { healthy: false, reason: `文件数量过少：${files.length} 个` };
    }
    
    return { healthy: true, reason: '健康' };
  } catch (e) {
    return { healthy: false, reason: `检查失败：${e.message}` };
  }
}

/**
 * 切换到备用记忆
 */
function switchToBackup(reason) {
  console.log('═══════════════════════════════════════');
  console.log('⚠️  切换到备用记忆');
  console.log('═══════════════════════════════════════');
  console.log(`原因：${reason}`);
  console.log(`时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  
  currentMemoryDir = MEMORY_CONFIG.backup;
  isUsingBackup = true;
  consecutiveFailures = 0;
  consecutiveSuccesses = 0;
  
  const state = getState();
  state.currentMemoryDir = currentMemoryDir;
  state.isUsingBackup = true;
  state.lastSwitch = new Date().toISOString();
  state.switchReason = reason;
  state.status = 'using-backup';
  saveState(state);
  
  console.log(`当前使用：备用记忆`);
  console.log(`路径：${MEMORY_CONFIG.backup}`);
  console.log('═══════════════════════════════════════');
  
  return true;
}

/**
 * 切回主用记忆
 */
function switchBackToPrimary(reason) {
  console.log('═══════════════════════════════════════');
  console.log('✅ 切回主用记忆');
  console.log('═══════════════════════════════════════');
  console.log(`原因：${reason}`);
  console.log(`时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  
  currentMemoryDir = MEMORY_CONFIG.primary;
  isUsingBackup = false;
  consecutiveFailures = 0;
  consecutiveSuccesses = 5;  // 设为 5，避免立即又切换
  
  const state = getState();
  state.currentMemoryDir = currentMemoryDir;
  state.isUsingBackup = false;
  state.lastSwitch = new Date().toISOString();
  state.switchReason = reason;
  state.status = 'healthy';
  saveState(state);
  
  console.log(`当前使用：主用记忆`);
  console.log(`路径：${MEMORY_CONFIG.primary}`);
  console.log('═══════════════════════════════════════');
  
  return true;
}

/**
 * 同步主备记忆
 */
function syncMemory(from, to) {
  try {
    console.log(`同步记忆：${from} → ${to}`);
    
    // 确保目标目录存在
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to, { recursive: true });
    }
    
    // 复制所有文件
    const files = fs.readdirSync(from);
    let copied = 0;
    
    for (const file of files) {
      const srcPath = path.join(from, file);
      const destPath = path.join(to, file);
      
      const stat = fs.statSync(srcPath);
      if (stat.isFile()) {
        fs.copyFileSync(srcPath, destPath);
        copied++;
      }
    }
    
    console.log(`同步完成：复制了 ${copied} 个文件`);
    return true;
  } catch (e) {
    console.error('同步失败:', e.message);
    return false;
  }
}

/**
 * 初始化双记忆系统
 */
function init() {
  console.log('═══════════════════════════════════════');
  console.log('🔧 初始化双记忆系统');
  console.log('═══════════════════════════════════════');
  
  // 加载状态
  const state = getState();
  console.log(`当前使用：${state.isUsingBackup ? '备用记忆' : '主用记忆'}`);
  console.log(`主用路径：${MEMORY_CONFIG.primary}`);
  console.log(`备用路径：${MEMORY_CONFIG.backup}`);
  console.log(`连续失败：${state.consecutiveFailures}`);
  console.log(`连续成功：${state.consecutiveSuccesses}`);
  console.log('═══════════════════════════════════════');
  
  // 确保备用目录存在
  if (!fs.existsSync(MEMORY_CONFIG.backup)) {
    console.log('创建备用记忆目录...');
    fs.mkdirSync(MEMORY_CONFIG.backup, { recursive: true });
    
    // 如果主用目录存在，初始化备用目录
    if (fs.existsSync(MEMORY_CONFIG.primary)) {
      console.log('从主用记忆初始化备用记忆...');
      syncMemory(MEMORY_CONFIG.primary, MEMORY_CONFIG.backup);
    }
  }
  
  return state;
}

/**
 * 健康检查（每次读取前调用）
 */
function healthCheck() {
  const now = Date.now();
  
  // 避免过于频繁的检查（至少间隔 1 分钟）
  if (lastCheckTime && (now - lastCheckTime < 60000)) {
    return { healthy: true, message: '使用上次检查结果' };
  }
  
  lastCheckTime = now;
  
  // 检查当前使用的记忆目录
  const currentHealth = checkHealth(currentMemoryDir);
  
  if (currentHealth.healthy) {
    // 当前使用的健康
    consecutiveSuccesses++;
    consecutiveFailures = 0;
    
    // 如果正在使用备用，检查主用是否恢复
    if (isUsingBackup) {
      const primaryHealth = checkHealth(MEMORY_CONFIG.primary);
      if (primaryHealth.healthy) {
        // 主用恢复了，检查是否满足切回条件
        if (consecutiveSuccesses >= SWITCH_BACK_THRESHOLD) {
          switchBackToPrimary(`主用记忆已恢复，连续成功 ${consecutiveSuccesses} 次`);
          // 切回后同步数据
          syncMemory(MEMORY_CONFIG.primary, MEMORY_CONFIG.backup);
        }
      } else {
        consecutiveSuccesses = 0;  // 主用还没好，重置计数
      }
    }
    
    return { healthy: true, message: '记忆系统健康' };
  } else {
    // 当前使用的不健康
    consecutiveFailures++;
    consecutiveSuccesses = 0;
    
    console.error(`⚠️  当前记忆目录不健康：${currentHealth.reason}`);
    
    // 检查是否满足切换条件
    if (consecutiveFailures >= SWITCH_TO_BACKUP_THRESHOLD) {
      // 尝试切换到备用
      const backupHealth = checkHealth(MEMORY_CONFIG.backup);
      if (backupHealth.healthy) {
        switchToBackup(`主用记忆连续失败 ${consecutiveFailures} 次：${currentHealth.reason}`);
        return { healthy: true, message: '已切换到备用记忆' };
      } else {
        console.error('⚠️  备用记忆也不健康，无法切换！');
        return { healthy: false, message: '主备记忆都不健康' };
      }
    }
    
    return { healthy: false, message: `记忆系统异常：${currentHealth.reason}` };
  }
}

/**
 * 读取记忆文件（安全版本）
 */
function readMemoryFile(filename) {
  // 先健康检查
  const health = healthCheck();
  if (!health.healthy) {
    console.error('记忆系统不健康，尝试读取备用...');
    // 尝试从备用读取
    const backupPath = path.join(MEMORY_CONFIG.backup, filename);
    if (fs.existsSync(backupPath)) {
      return fs.readFileSync(backupPath, 'utf-8');
    }
    throw new Error('记忆系统故障，无法读取文件');
  }
  
  const filePath = path.join(currentMemoryDir, filename);
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * 写入记忆文件（安全版本，自动同步到备用）
 */
function writeMemoryFile(filename, content) {
  const filePath = path.join(currentMemoryDir, filename);
  
  // 确保目录存在
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // 写入当前使用的目录
  fs.writeFileSync(filePath, content, 'utf-8');
  
  // 如果启用自动同步，同步到备用
  if (MEMORY_CONFIG.autoSync) {
    const backupPath = path.join(MEMORY_CONFIG.backup, filename);
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    fs.copyFileSync(filePath, backupPath);
  }
  
  return true;
}

/**
 * 获取当前记忆目录
 */
function getCurrentMemoryDir() {
  return currentMemoryDir;
}

/**
 * 是否正在使用备用记忆
 */
function isUsingBackupMemory() {
  return isUsingBackup;
}

/**
 * 手动同步主备记忆
 */
function manualSync() {
  console.log('手动同步主备记忆...');
  
  // 主 → 备
  syncMemory(MEMORY_CONFIG.primary, MEMORY_CONFIG.backup);
  
  // 备 → 主（确保双向一致）
  syncMemory(MEMORY_CONFIG.backup, MEMORY_CONFIG.primary);
  
  console.log('同步完成');
}

/**
 * 获取状态报告
 */
function getStatusReport() {
  const state = getState();
  const primaryHealth = checkHealth(MEMORY_CONFIG.primary);
  const backupHealth = checkHealth(MEMORY_CONFIG.backup);
  
  return {
    currentMemoryDir: state.currentMemoryDir,
    isUsingBackup: state.isUsingBackup,
    status: state.status,
    primaryHealth,
    backupHealth,
    consecutiveFailures: state.consecutiveFailures,
    consecutiveSuccesses: state.consecutiveSuccesses,
    lastSwitch: state.lastSwitch,
    switchReason: state.switchReason,
    lastCheckTime
  };
}

// 导出
module.exports = {
  init,
  healthCheck,
  readMemoryFile,
  writeMemoryFile,
  getCurrentMemoryDir,
  isUsingBackupMemory,
  manualSync,
  getStatusReport,
  syncMemory,
  MEMORY_CONFIG
};

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'status') {
    // 显示状态
    init();
    const report = getStatusReport();
    console.log('\n双记忆系统状态报告:');
    console.log(JSON.stringify(report, null, 2));
  } else if (args[0] === 'sync') {
    // 手动同步
    init();
    manualSync();
  } else if (args[0] === 'check') {
    // 健康检查
    init();
    const health = healthCheck();
    console.log('健康检查结果:', health);
  } else if (args[0] === 'init') {
    // 初始化
    init();
  } else {
    console.log('双记忆系统 - 主备自动切换');
    console.log('用法:');
    console.log('  node dual-memory-system.js status   - 查看状态');
    console.log('  node dual-memory-system.js sync     - 手动同步');
    console.log('  node dual-memory-system.js check    - 健康检查');
    console.log('  node dual-memory-system.js init     - 初始化');
  }
}
