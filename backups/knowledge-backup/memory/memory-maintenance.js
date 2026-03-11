#!/usr/bin/env node
/**
 * 记忆系统维护脚本
 * 功能：
 * 1. 检查记忆文件完整性
 * 2. 整理长期记忆（从日常记忆中提取重要内容到 MEMORY.md）
 * 3. 清理过期的日常记忆（保留最近 7 天）
 * 4. 同步主备记忆系统
 * 5. 记录到自我改进系统
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');
const MEMORY_BACKUP_DIR = path.join(WORKSPACE, 'memory-backup');
const MEMORY_MD = path.join(WORKSPACE, 'MEMORY.md');
const STATE_FILE = path.join(MEMORY_DIR, 'memory-state.json');

// 镜像切换系统
const MirrorSwitcher = require('./mirror-switcher.js');

// 配置
const KEEP_DAYS = 7; // 保留最近 7 天的日常记忆
const MAINTENANCE_TIME = '00:00'; // 维护时间

/**
 * 检查记忆文件完整性
 */
function checkIntegrity() {
  console.log('🔍 检查记忆文件完整性...');

  const checks = {
    memoryMd: fs.existsSync(MEMORY_MD),
    memoryDir: fs.existsSync(MEMORY_DIR),
    memoryBackupDir: fs.existsSync(MEMORY_BACKUP_DIR),
    stateFile: fs.existsSync(STATE_FILE)
  };

  // 检查日常记忆文件
  const dailyFiles = fs.readdirSync(MEMORY_DIR)
    .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f));

  checks.dailyCount = dailyFiles.length;

  // 验证主备同步
  if (checks.memoryDir && checks.memoryBackupDir) {
    const mainFiles = fs.readdirSync(MEMORY_DIR);
    const backupFiles = fs.readdirSync(MEMORY_BACKUP_DIR);
    checks.syncStatus = JSON.stringify(mainFiles.sort()) === JSON.stringify(backupFiles.sort());
  }

  console.log('✅ 完整性检查完成:', checks);
  return checks;
}

/**
 * 整理长期记忆
 * 从最近 7 天的日常记忆中提取重要内容到 MEMORY.md
 */
function consolidateMemories() {
  console.log('📝 整理长期记忆...');

  const today = new Date();
  const recentFiles = [];

  // 获取最近 7 天的日常记忆文件
  for (let i = 0; i < KEEP_DAYS; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const filePath = path.join(MEMORY_DIR, `${dateStr}.md`);

    if (fs.existsSync(filePath)) {
      recentFiles.push({ date: dateStr, path: filePath });
    }
  }

  console.log(`找到 ${recentFiles.length} 个近期记忆文件`);

  // 读取 MEMORY.md
  let memoryMd = fs.readFileSync(MEMORY_MD, 'utf8');

  // 这里可以添加智能整理逻辑
  // 目前只做简单标记
  const consolidationMarker = `\n## 最近整理\n- 最后整理时间：${new Date().toISOString()}\n- 整理文件数：${recentFiles.length}\n`;

  if (!memoryMd.includes('## 最近整理')) {
    memoryMd += consolidationMarker;
    fs.writeFileSync(MEMORY_MD, memoryMd, 'utf8');
    console.log('✅ 已添加整理标记到 MEMORY.md');
  }

  return { consolidated: true, fileCount: recentFiles.length };
}

/**
 * 清理过期的日常记忆
 * 保留最近 KEEP_DAYS 天的文件
 */
function cleanupOldMemories() {
  console.log(`🧹 清理过期记忆（保留最近${KEEP_DAYS}天）...`);

  const today = new Date();
  let deletedCount = 0;

  const files = fs.readdirSync(MEMORY_DIR)
    .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f));

  files.forEach(file => {
    const dateStr = file.replace('.md', '');
    const fileDate = new Date(dateStr);
    const daysDiff = Math.floor((today - fileDate) / (1000 * 60 * 60 * 24));

    if (daysDiff > KEEP_DAYS) {
      const filePath = path.join(MEMORY_DIR, file);
      const backupPath = path.join(MEMORY_BACKUP_DIR, file);

      // 先备份到归档目录
      const archiveDir = path.join(WORKSPACE, 'memory-archive');
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
      }

      fs.copyFileSync(filePath, path.join(archiveDir, file));

      // 删除原文件
      fs.unlinkSync(filePath);
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }

      deletedCount++;
      console.log(`  📦 已归档：${file}`);
    }
  });

  console.log(`✅ 清理完成，归档 ${deletedCount} 个文件`);
  return { deleted: deletedCount };
}

/**
 * 同步主备记忆系统
 */
function syncMainBackup() {
  console.log('🔄 同步主备记忆系统...');

  if (!fs.existsSync(MEMORY_BACKUP_DIR)) {
    fs.mkdirSync(MEMORY_BACKUP_DIR, { recursive: true });
  }

  const mainFiles = fs.readdirSync(MEMORY_DIR);
  let syncedCount = 0;

  mainFiles.forEach(file => {
    if (file === 'memory-state.json') return; // 跳过状态文件

    const mainPath = path.join(MEMORY_DIR, file);
    const backupPath = path.join(MEMORY_BACKUP_DIR, file);

    if (fs.statSync(mainPath).isFile()) {
      fs.copyFileSync(mainPath, backupPath);
      syncedCount++;
    }
  });

  // 同步 MEMORY.md
  const memoryMdBackup = path.join(MEMORY_BACKUP_DIR, 'MEMORY.md');
  fs.copyFileSync(MEMORY_MD, memoryMdBackup);
  syncedCount++;

  console.log(`✅ 同步完成，${syncedCount} 个文件`);
  return { synced: syncedCount };
}

/**
 * 更新状态文件
 */
function updateState(stats) {
  const state = {
    lastMaintenance: new Date().toISOString(),
    lastCleanup: new Date().toISOString(),
    lastSync: new Date().toISOString(),
    dailyFilesCount: stats.dailyCount || 0,
    healthStatus: 'healthy'
  };

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  console.log('✅ 状态已更新');
  return state;
}

/**
 * 记录到自我改进系统
 */
function recordSelfImprovement(taskName, result, duration, metrics = {}) {
  try {
    const scriptPath = path.join(__dirname, 'activate-self-improve.js');
    const metricsStr = JSON.stringify({ duration, ...metrics }).replace(/"/g, '\\"');
    execSync(`node "${scriptPath}" "${taskName}" "${result}" "${metricsStr}"`, {
      stdio: 'ignore'
    });
    console.log('✅ 自我改进记录已保存');
  } catch (e) {
    console.log('⚠️  自我改进记录失败 (不影响主流程)');
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始记忆系统维护...\n');

  const startTime = Date.now();

  try {
    // 1. 检查完整性
    const integrity = checkIntegrity();

    // 1.5 镜像健康检查与自动切换
    console.log('\n🪞 镜像系统健康检查...');
    const mirrorState = MirrorSwitcher.autoSwitch();
    if (mirrorState.currentMirror) {
      console.log(`✅ 当前镜像：${MirrorSwitcher.MIRRORS[mirrorState.currentMirror].name}`);
    } else {
      console.log('⚠️  警告：所有镜像都不健康！');
    }

    // 2. 整理长期记忆
    const consolidated = consolidateMemories();

    // 3. 清理过期记忆
    const cleaned = cleanupOldMemories();

    // 4. 同步主备
    const synced = syncMainBackup();

    // 5. 更新状态
    const state = updateState(integrity);

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n✅ 记忆系统维护完成！');
    console.log('📊 统计:', {
      integrity: integrity,
      consolidated: consolidated.fileCount,
      cleaned: cleaned.deleted,
      synced: synced.synced,
      duration: duration + '秒'
    });

    // 6. 记录到自我改进系统
    recordSelfImprovement('记忆系统维护', '完成', duration, {
      integrity: JSON.stringify(integrity),
      consolidated: consolidated.fileCount,
      cleaned: cleaned.deleted,
      synced: synced.synced
    });

  } catch (error) {
    const duration = Math.round((Date.now() - startTime) / 1000);
    console.error('❌ 维护失败:', error.message);
    recordSelfImprovement('记忆系统维护', '失败：' + error.message, duration, { error: true });
    process.exit(1);
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { main, checkIntegrity, consolidateMemories, cleanupOldMemories, syncMainBackup };
