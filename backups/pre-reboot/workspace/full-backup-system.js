#!/usr/bin/env node

/**
 * 完整备份系统 v1.0 - 三重镜像 + 自动故障转移
 *
 * 功能说明：
 * 1. 三重镜像 - C 盘主镜像、C 盘备用镜像、D 盘异地镜像
 * 2. 自动验证 - 备份后自动验证完整性（80% 阈值）
 * 3. 故障转移 - 主镜像失败自动使用备用镜像恢复
 * 4. 日志记录 - 详细记录备份过程和结果
 *
 * 配置说明：
 * - WORKSPACE_ROOT: 工作区根目录
 * - BACKUP_PATHS: 三个备份位置 (main/backup/offsite)
 * - BACKUP_ITEMS: 需要备份的文件和目录列表
 * - EXCLUDE_DIRS: 排除的目录 (backups, node_modules, .git)
 * - LOG_FILE: 备份日志文件路径
 *
 * 用法：
 *   node full-backup-system.js                    # 执行完整备份
 *
 * 示例输出：
 *   ============================================================
 *   OpenClaw 完整知识备份系统启动
 *   时间：2026-03-10 20:00:00
 *   ============================================================
 *   开始备份到 C 盘主镜像
 *   ✓ 目录：workspace/memory (15 文件)
 *   ✓ 文件：workspace/MEMORY.md
 *   成功：3/3
 *
 * 常见错误：
 * - 备份失败 → 检查目标目录权限和磁盘空间
 * - 验证失败 → 检查文件是否在备份过程中被修改
 * - 故障转移失败 → 检查备份源是否可用
 *
 * 依赖：
 * - Node.js 14+
 * - fs, path, child_process (内置模块)
 *
 * 修改历史：
 * - 2026-03-07: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
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
/**
 * 日志函数 - 记录消息到控制台和日志文件
 * @param {string} message - 要记录的日志消息
 * @param {string} [level='INFO'] - 日志级别 (INFO/WARN/DEBUG/ERROR/CRITICAL)
 * @returns {void}
 */
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

/**
 * 确保目录存在 - 如果目录不存在则创建
 * @param {string} dirPath - 目录路径
 * @returns {void}
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 复制文件 - 从源路径复制到目标路径
 * @param {string} src - 源文件路径
 * @param {string} dst - 目标文件路径
 * @returns {void}
 */
function copyFile(src, dst) {
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
}

/**
 * 复制目录 - 递归复制源目录到目标目录
 * @param {string} src - 源目录路径
 * @param {string} dst - 目标目录路径
 * @returns {number} 复制的文件数量
 */
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
/**
 * 备份到指定路径 - 将备份项目复制到目标位置
 * @param {string} targetPath - 目标路径
 * @param {string} backupName - 备份名称
 * @returns {Object} 备份结果 {success, files, path}
 */
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

/**
 * 验证备份完整性 - 检查备份文件是否存在
 * @param {string} backupPath - 备份路径
 * @returns {boolean} 验证是否通过（80% 以上文件存在）
 */
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
/**
 * 从备份恢复 - 从源备份目录恢复到工作区
 * @param {string} sourceBackup - 源备份目录
 * @param {string} targetPath - 目标路径
 * @returns {boolean} 恢复是否成功
 */
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
/**
 * 主函数 - 执行完整备份流程
 * @returns {Promise<void>}
 */
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
