/**
 * OpenClaw 完整知识备份系统 - 三重镜像 + 自动故障转移
 * 
 * 备份策略：
 * - C盘主镜像：C:\Users\17589\.openclaw\backups\knowledge-main\
 * - C盘备用镜像：C:\Users\17589\.openclaw\backups\knowledge-backup\
 * - D盘异地镜像：D:\AAAAAA\openclaw-backup\
 * 
 * 自动故障转移：
 * - 如果C盘备份失败，自动使用D盘备份恢复
 * - 每次备份后验证完整性
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// ==================== 配置 ====================
const WORKSPACE_ROOT = 'C:\\Users\\17589\\.openclaw';
const BACKUP_PATHS = {
  main: 'C:\\Users\\17589\\.openclaw\\backups\\knowledge-main',
  backup: 'C:\\Users\\17589\\.openclaw\\backups\\knowledge-backup',
  offsite: 'D:\\AAAAAA\\openclaw-backup'
};

// 需要备份的目录和文件
const BACKUP_ITEMS = [
  // 工作区核心文件
  'workspace/MEMORY.md',
  'workspace/SOUL.md',
  'workspace/USER.md',
  'workspace/IDENTITY.md',
  'workspace/AGENTS.md',
  'workspace/TOOLS.md',
  'workspace/HEARTBEAT.md',
  'workspace/BOOTSTRAP.md',
  
  // 记忆文件
  'workspace/memory',
  
  // 配置文件
  'openclaw.json',
  
  // 技能文件（已安装的）
  'workspace/skills',
  
  // 自动切换系统
  'workspace/auto-switch-model.js',
  'workspace/auto-switch-model-test.js',
  'workspace/model-switch-test-runner.js',
  'workspace/model-switch-state.json',
  'workspace/模型切换测试计划.md',
  'workspace/full-backup-system.js',
  'workspace/backup-log.md'
];

// 排除的目录（避免递归备份）
const EXCLUDE_DIRS = ['backups', 'node_modules', '.git'];

const LOG_FILE = path.join(WORKSPACE_ROOT, 'workspace', 'backup-log.md');

// ==================== 工具函数 ====================
function log(message, level = 'INFO') {
  const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const logLine = `[${timestamp}] [${level}] ${message}\n`;
  console.log(logLine.trim());
  
  // 追加到日志文件
  let content = '';
  if (fs.existsSync(LOG_FILE)) {
    content = fs.readFileSync(LOG_FILE, 'utf-8');
  }
  fs.writeFileSync(LOG_FILE, content + logLine, 'utf-8');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFile(src, dst) {
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
}

function copyDir(src, dst) {
  if (!fs.existsSync(src)) {
    log(`源目录不存在：${src}`, 'WARN');
    return 0;
  }
  
  ensureDir(dst);
  let fileCount = 0;
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    // 跳过排除的目录
    if (entry.isDirectory() && EXCLUDE_DIRS.includes(entry.name)) {
      log(`跳过排除目录：${entry.name}`, 'DEBUG');
      continue;
    }
    
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    
    if (entry.isDirectory()) {
      fileCount += copyDir(srcPath, dstPath);
    } else {
      copyFile(srcPath, dstPath);
      fileCount++;
    }
  }
  
  return fileCount;
}

// ==================== 备份核心逻辑 ====================
function backupToPath(targetPath, backupName) {
  log(`═══════════════════════════════════════════════════════`);
  log(`开始备份到 ${backupName}: ${targetPath}`);
  log(`═══════════════════════════════════════════════════════`);
  
  ensureDir(targetPath);
  
  let totalFiles = 0;
  
  // 直接备份到镜像目录（覆盖旧版本）
  const mirrorDir = targetPath;
  
  // 备份每个项目
  for (const item of BACKUP_ITEMS) {
    const srcPath = path.join(WORKSPACE_ROOT, item);
    const dstPath = path.join(mirrorDir, item);
    
    if (!fs.existsSync(srcPath)) {
      log(`跳过（不存在）: ${item}`, 'WARN');
      continue;
    }
    
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      const count = copyDir(srcPath, dstPath);
      log(`✓ 目录：${item} (${count} 文件)`);
      totalFiles += count;
    } else {
      copyFile(srcPath, dstPath);
      log(`✓ 文件：${item}`);
      totalFiles++;
    }
  }
  
  // 创建备份清单
  const manifest = {
    backupTime: new Date().toISOString(),
    backupName: backupName,
    backupPath: mirrorDir,
    totalFiles: totalFiles,
    items: BACKUP_ITEMS,
    version: '1.0',
    type: 'mirror' // 镜像模式，非版本模式
  };
  
  fs.writeFileSync(
    path.join(mirrorDir, 'BACKUP_MANIFEST.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
  
  log(`═══════════════════════════════════════════════════════`);
  log(`${backupName} 镜像完成：${totalFiles} 文件`);
  log(`镜像位置：${mirrorDir}`);
  log(`═══════════════════════════════════════════════════════`);
  
  return { success: true, files: totalFiles, path: mirrorDir };
}

function verifyBackup(backupPath) {
  log(`验证备份完整性：${backupPath}`);
  
  const manifestPath = path.join(backupPath, 'BACKUP_MANIFEST.json');
  if (!fs.existsSync(manifestPath)) {
    log(`❌ 备份清单不存在`, 'ERROR');
    return false;
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  let validFiles = 0;
  
  for (const item of manifest.items) {
    const itemPath = path.join(backupPath, item);
    if (fs.existsSync(itemPath)) {
      validFiles++;
    }
  }
  
  const successRate = (validFiles / manifest.items.length * 100).toFixed(1);
  log(`验证结果：${validFiles}/${manifest.items.length} 项目存在 (${successRate}%)`);
  
  return successRate >= 80; // 80% 以上算成功
}

// ==================== 故障转移恢复 ====================
function restoreFromBackup(sourceBackup, targetPath) {
  log(`═══════════════════════════════════════════════════════`);
  log(`🚨 故障转移：从 ${sourceBackup} 恢复到 ${targetPath}`);
  log(`═══════════════════════════════════════════════════════`);
  
  // 找到最新的备份
  const backups = fs.readdirSync(sourceBackup)
    .filter(name => name.startsWith('backup-'))
    .sort()
    .reverse();
  
  if (backups.length === 0) {
    log(`❌ 没有找到可用的备份`, 'ERROR');
    return false;
  }
  
  const latestBackup = backups[0];
  const sourcePath = path.join(sourceBackup, latestBackup);
  
  log(`使用最新备份：${latestBackup}`);
  
  // 恢复文件
  let restoredFiles = 0;
  for (const item of BACKUP_ITEMS) {
    const srcPath = path.join(sourcePath, item);
    const dstPath = path.join(WORKSPACE_ROOT, item);
    
    if (!fs.existsSync(srcPath)) continue;
    
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      restoredFiles += copyDir(srcPath, dstPath);
    } else {
      ensureDir(path.dirname(dstPath));
      copyFile(srcPath, dstPath);
      restoredFiles++;
    }
  }
  
  log(`✅ 恢复完成：${restoredFiles} 文件`);
  return true;
}

// ==================== 主流程 ====================
async function main() {
  log(`\n${'═'.repeat(60)}`);
  log(`🛡️ OpenClaw 完整知识备份系统启动`);
  log(`时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  log(`${'═'.repeat(60)}\n`);
  
  const results = {
    main: null,
    backup: null,
    offsite: null
  };
  
  // 1. 备份到 C 盘主镜像
  try {
    results.main = backupToPath(BACKUP_PATHS.main, 'C 盘主镜像');
    const valid = verifyBackup(results.main.path);
    if (!valid) throw new Error('C 盘主镜像验证失败');
  } catch (err) {
    log(`❌ C 盘主镜像失败：${err.message}`, 'ERROR');
    results.main = { success: false, error: err.message };
  }
  
  // 2. 备份到 C 盘备用镜像
  try {
    results.backup = backupToPath(BACKUP_PATHS.backup, 'C 盘备用镜像');
    const valid = verifyBackup(results.backup.path);
    if (!valid) throw new Error('C 盘备用镜像验证失败');
  } catch (err) {
    log(`❌ C 盘备用镜像失败：${err.message}`, 'ERROR');
    results.backup = { success: false, error: err.message };
  }
  
  // 3. 备份到 D 盘异地镜像
  try {
    results.offsite = backupToPath(BACKUP_PATHS.offsite, 'D 盘异地镜像');
    const valid = verifyBackup(results.offsite.path);
    if (!valid) throw new Error('D 盘异地镜像验证失败');
  } catch (err) {
    log(`❌ D 盘异地镜像失败：${err.message}`, 'ERROR');
    results.offsite = { success: false, error: err.message };
  }
  
  // 4. 故障转移逻辑
  log(`\n${'═'.repeat(60)}`);
  log(`📊 备份结果汇总`);
  log(`${'═'.repeat(60)}`);
  
  const successCount = Object.values(results).filter(r => r && r.success).length;
  log(`成功：${successCount}/3`);
  
  if (successCount === 0) {
    log(`🚨 所有备份失败！系统处于危险状态！`, 'CRITICAL');
    return;
  }
  
  if (successCount < 3) {
    log(`⚠️ 部分备份失败，检查故障转移...`, 'WARN');
    
    // 如果 C 盘主镜像失败，尝试从 D 盘恢复
    if (!results.main?.success && results.offsite?.success) {
      log(`🔄 C 盘主镜像失败，从 D 盘异地镜像恢复...`);
      restoreFromBackup(BACKUP_PATHS.offsite, WORKSPACE_ROOT);
    }
    
    // 如果 C 盘都失败，从 D 盘恢复
    if (!results.main?.success && !results.backup?.success && results.offsite?.success) {
      log(`🔄 C 盘全部失败，从 D 盘异地镜像恢复...`);
      restoreFromBackup(BACKUP_PATHS.offsite, WORKSPACE_ROOT);
    }
  }
  
  // 5. 不需要清理旧备份（镜像模式，直接覆盖）
  log(`\n镜像模式：每个位置保留一份最新完整副本`);
  
  log(`\n${'═'.repeat(60)}`);
  log(`✅ 备份系统完成`);
  log(`${'═'.repeat(60)}\n`);
}

// 执行
main().catch(err => {
  log(`💥 致命错误：${err.message}`, 'CRITICAL');
  console.error(err);
  process.exit(1);
});
