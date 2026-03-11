#!/usr/bin/env node
/**
 * 性能监控脚本
 * 功能：
 * 1. 监控系统资源（CPU、内存、磁盘）
 * 2. 监控 OpenClaw 网关状态
 * 3. 监控记忆系统健康
 * 4. 记录性能指标
 * 5. 异常告警
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';
const MONITOR_DIR = path.join(WORKSPACE, 'monitoring');
const LOG_FILE = path.join(MONITOR_DIR, 'performance-log.md');
const STATE_FILE = path.join(MONITOR_DIR, 'monitor-state.json');
const ALERT_FILE = path.join(MONITOR_DIR, 'alerts.md');

// 监控阈值
const THRESHOLDS = {
  cpu: 80,        // CPU 使用率超过 80% 告警
  memory: 85,     // 内存使用率超过 85% 告警
  disk: 90,       // 磁盘使用率超过 90% 告警
  responseTime: 5000, // 响应时间超过 5 秒告警
  memoryFiles: 50 // 记忆文件超过 50 个告警
};

/**
 * 确保监控目录存在
 */
function ensureMonitorDir() {
  if (!fs.existsSync(MONITOR_DIR)) {
    fs.mkdirSync(MONITOR_DIR, { recursive: true });
  }
}

/**
 * 获取系统资源使用情况（Windows）
 */
function getSystemResources() {
  try {
    // CPU 使用率
    const cpuOutput = execSync('wmic cpu get loadpercentage /value', { encoding: 'utf8' });
    const cpuMatch = cpuOutput.match(/LoadPercentage=(\d+)/);
    const cpuUsage = cpuMatch ? parseInt(cpuMatch[1]) : 0;
    
    // 内存使用情况
    const memOutput = execSync('wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /value', { encoding: 'utf8' });
    const freeMatch = memOutput.match(/FreePhysicalMemory=(\d+)/);
    const totalMatch = memOutput.match(/TotalVisibleMemorySize=(\d+)/);
    const freeMem = freeMatch ? parseInt(freeMatch[1]) : 0;
    const totalMem = totalMatch ? parseInt(totalMatch[1]) : 0;
    const memoryUsage = totalMem > 0 ? Math.round((1 - freeMem / totalMem) * 100) : 0;
    
    // 磁盘使用情况（C 盘）
    const diskOutput = execSync('wmic logicaldisk where "DeviceID=\'C:\'" get Size,FreeSpace /value', { encoding: 'utf8' });
    const sizeMatch = diskOutput.match(/Size=(\d+)/);
    const freeSpaceMatch = diskOutput.match(/FreeSpace=(\d+)/);
    const diskSize = sizeMatch ? parseInt(sizeMatch[1]) : 0;
    const diskFree = freeSpaceMatch ? parseInt(freeSpaceMatch[1]) : 0;
    const diskUsage = diskSize > 0 ? Math.round((1 - diskFree / diskSize) * 100) : 0;
    
    return {
      cpu: cpuUsage,
      memory: memoryUsage,
      disk: diskUsage,
      diskFreeGB: diskFree > 0 ? (diskFree / (1024 ** 3)).toFixed(2) : 0,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('获取系统资源失败:', error.message);
    return { cpu: 0, memory: 0, disk: 0, error: error.message };
  }
}

/**
 * 检查 OpenClaw 网关状态
 */
function checkGatewayStatus() {
  try {
    const startTime = Date.now();
    const output = execSync('openclaw status', { encoding: 'utf8', timeout: 10000 });
    const responseTime = Date.now() - startTime;
    
    const isRunning = output.includes('running') || output.includes('active');
    
    return {
      running: isRunning,
      responseTime,
      output: output.substring(0, 500) // 限制输出长度
    };
  } catch (error) {
    return {
      running: false,
      responseTime: 0,
      error: error.message
    };
  }
}

/**
 * 检查记忆系统健康
 */
function checkMemoryHealth() {
  const memoryDir = path.join(WORKSPACE, 'memory');
  const memoryBackupDir = path.join(WORKSPACE, 'memory-backup');
  const memoryMd = path.join(WORKSPACE, 'MEMORY.md');
  
  const checks = {
    memoryDirExists: fs.existsSync(memoryDir),
    memoryBackupDirExists: fs.existsSync(memoryBackupDir),
    memoryMdExists: fs.existsSync(memoryMd),
    dailyFileCount: 0,
    syncStatus: false
  };
  
  if (checks.memoryDirExists) {
    const dailyFiles = fs.readdirSync(memoryDir).filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f));
    checks.dailyFileCount = dailyFiles.length;
  }
  
  if (checks.memoryDirExists && checks.memoryBackupDirExists) {
    const mainFiles = fs.readdirSync(memoryDir).sort();
    const backupFiles = fs.readdirSync(memoryBackupDir).sort();
    checks.syncStatus = JSON.stringify(mainFiles) === JSON.stringify(backupFiles);
  }
  
  checks.healthy = checks.memoryDirExists && checks.memoryBackupDirExists && checks.memoryMdExists && checks.syncStatus;
  
  return checks;
}

/**
 * 检查性能指标是否超过阈值
 */
function checkThresholds(metrics) {
  const alerts = [];
  
  if (metrics.system.cpu > THRESHOLDS.cpu) {
    alerts.push({ type: 'CPU', value: metrics.system.cpu, threshold: THRESHOLDS.cpu, severity: 'warning' });
  }
  
  if (metrics.system.memory > THRESHOLDS.memory) {
    alerts.push({ type: 'Memory', value: metrics.system.memory, threshold: THRESHOLDS.memory, severity: 'warning' });
  }
  
  if (metrics.system.disk > THRESHOLDS.disk) {
    alerts.push({ type: 'Disk', value: metrics.system.disk, threshold: THRESHOLDS.disk, severity: 'critical' });
  }
  
  if (metrics.gateway.responseTime > THRESHOLDS.responseTime) {
    alerts.push({ type: 'Gateway Response', value: metrics.gateway.responseTime, threshold: THRESHOLDS.responseTime, severity: 'warning' });
  }
  
  if (metrics.memory.dailyFileCount > THRESHOLDS.memoryFiles) {
    alerts.push({ type: 'Memory Files', value: metrics.memory.dailyFileCount, threshold: THRESHOLDS.memoryFiles, severity: 'info' });
  }
  
  return alerts;
}

/**
 * 记录性能日志
 */
function logPerformance(metrics, alerts) {
  const timestamp = new Date().toISOString();
  const date = new Date().toISOString().split('T')[0];
  
  const logEntry = `## ${timestamp}\n\n### 系统资源\n- CPU: ${metrics.system.cpu}%\n- 内存：${metrics.system.memory}%\n- 磁盘：${metrics.system.disk}% (剩余 ${metrics.system.diskFreeGB} GB)\n\n### 网关状态\n- 运行状态：${metrics.gateway.running ? '✅' : '❌'}\n- 响应时间：${metrics.gateway.responseTime}ms\n\n### 记忆系统\n- 健康状态：${metrics.memory.healthy ? '✅' : '❌'}\n- 日常文件：${metrics.memory.dailyFileCount}\n- 主备同步：${metrics.memory.syncStatus ? '✅' : '❌'}\n\n### 告警\n${alerts.length > 0 ? alerts.map(a => `- ⚠️ ${a.type}: ${a.value}% (阈值：${a.threshold}%)`).join('\n') : '- 无告警'}\n\n---\n\n`;
  
  // 追加到日志文件
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, `# 性能监控日志\n\n创建时间：${new Date().toISOString()}\n\n---\n\n`, 'utf8');
  }
  
  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
}

/**
 * 记录告警
 */
function logAlerts(alerts) {
  if (alerts.length === 0) return;
  
  const timestamp = new Date().toISOString();
  const alertText = `## ${timestamp}\n\n${alerts.map(a => `- **${a.severity.toUpperCase()}** ${a.type}: ${a.value} (阈值：${a.threshold})`).join('\n')}\n\n---\n\n`;
  
  if (!fs.existsSync(ALERT_FILE)) {
    fs.writeFileSync(ALERT_FILE, `# 告警日志\n\n创建时间：${new Date().toISOString()}\n\n---\n\n`, 'utf8');
  }
  
  fs.appendFileSync(ALERT_FILE, alertText, 'utf8');
}

/**
 * 更新监控状态
 */
function updateState(metrics, alerts) {
  const state = {
    lastCheck: new Date().toISOString(),
    system: metrics.system,
    gateway: metrics.gateway,
    memory: metrics.memory,
    alertCount: alerts.length,
    healthScore: calculateHealthScore(metrics, alerts)
  };
  
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  return state;
}

/**
 * 计算健康分数（0-100）
 */
function calculateHealthScore(metrics, alerts) {
  let score = 100;
  
  // 系统资源扣分
  if (metrics.system.cpu > 90) score -= 20;
  else if (metrics.system.cpu > 80) score -= 10;
  
  if (metrics.system.memory > 90) score -= 20;
  else if (metrics.system.memory > 85) score -= 10;
  
  if (metrics.system.disk > 95) score -= 30;
  else if (metrics.system.disk > 90) score -= 15;
  
  // 网关状态扣分
  if (!metrics.gateway.running) score -= 30;
  else if (metrics.gateway.responseTime > 5000) score -= 10;
  
  // 记忆系统扣分
  if (!metrics.memory.healthy) score -= 20;
  if (!metrics.memory.syncStatus) score -= 10;
  
  // 告警扣分
  score -= alerts.length * 5;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始性能监控...\n');
  
  ensureMonitorDir();
  
  try {
    // 1. 获取系统资源
    console.log('📊 获取系统资源...');
    const system = getSystemResources();
    console.log(`  CPU: ${system.cpu}%, 内存：${system.memory}%, 磁盘：${system.disk}%`);
    
    // 2. 检查网关状态
    console.log('\n🔌 检查网关状态...');
    const gateway = checkGatewayStatus();
    console.log(`  运行：${gateway.running ? '✅' : '❌'}, 响应：${gateway.responseTime}ms`);
    
    // 3. 检查记忆系统
    console.log('\n🧠 检查记忆系统...');
    const memory = checkMemoryHealth();
    console.log(`  健康：${memory.healthy ? '✅' : '❌'}, 文件：${memory.dailyFileCount}, 同步：${memory.syncStatus ? '✅' : '❌'}`);
    
    // 4. 检查阈值
    const metrics = { system, gateway, memory };
    const alerts = checkThresholds(metrics);
    
    if (alerts.length > 0) {
      console.log('\n⚠️ 发现告警:');
      alerts.forEach(a => console.log(`  - ${a.type}: ${a.value} (阈值：${a.threshold})`));
    } else {
      console.log('\n✅ 无告警');
    }
    
    // 5. 记录日志
    console.log('\n📝 记录日志...');
    logPerformance(metrics, alerts);
    logAlerts(alerts);
    
    // 6. 更新状态
    const state = updateState(metrics, alerts);
    console.log(`  健康分数：${state.healthScore}/100`);
    
    console.log('\n✅ 性能监控完成！');
    
    return { metrics, alerts, state };
    
  } catch (error) {
    console.error('❌ 监控失败:', error.message);
    process.exit(1);
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { main, getSystemResources, checkGatewayStatus, checkMemoryHealth, checkThresholds };
