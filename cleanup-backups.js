#!/usr/bin/env node
/**
 * 清理冗余备份脚本
 * 规则：保留最近 3 天的备份，每天最多保留 1 个（最新的）
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';

/**
 * 从备份名称中提取日期
 * backup-2026-03-09-001057 -> 2026-03-09
 * backup-20260309-0048 -> 2026-03-09
 */
function extractDate(backupName) {
  const name = backupName.replace('backup-', '');

  // 格式 1: 2026-03-09-001057
  if (name.match(/^\d{4}-\d{2}-\d{2}/)) {
    return name.substring(0, 10);
  }

  // 格式 2: 20260309-0048
  if (name.match(/^\d{8}/)) {
    const raw = name.substring(0, 8);
    return `${raw.substring(0, 4)}-${raw.substring(4, 6)}-${raw.substring(6, 8)}`;
  }

  return null;
}

/**
 * 从备份名称提取时间（用于排序）
 */
function extractTime(backupName) {
  const name = backupName.replace('backup-', '');

  // 格式 1: 2026-03-09-001057 -> 001057
  const match1 = name.match(/^\d{4}-\d{2}-\d{2}-(\d+)/);
  if (match1) return match1[1];

  // 格式 2: 20260309-0048 -> 0048
  const match2 = name.match(/^\d{8}-(\d+)/);
  if (match2) return match2[1].padEnd(6, '0');

  return '000000';
}

function cleanupBackupDir(baseDir) {
  if (!fs.existsSync(baseDir)) {
    console.log(`  Skip (not exists): ${baseDir}`);
    return 0;
  }

  const backups = fs.readdirSync(baseDir)
    .filter(name => name.startsWith('backup-') && fs.statSync(path.join(baseDir, name)).isDirectory());

  console.log(`\nProcessing: ${baseDir}`);
  console.log(`  Found ${backups.length} backups`);

  // 按日期分组
  const byDate = {};
  backups.forEach(name => {
    const date = extractDate(name);
    if (!date) {
      console.log(`  Warning: Cannot parse date from ${name}`);
      return;
    }
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(name);
  });

  // 排序日期（从新到旧）
  const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));
  console.log(`  Dates found: ${dates.join(', ')}`);

  // 只保留最近 3 天
  const keepDates = dates.slice(0, 3);
  let deleted = 0;

  dates.forEach(date => {
    const dayBackups = byDate[date];

    if (!keepDates.includes(date)) {
      // 超过 3 天，全部删除
      dayBackups.forEach(name => {
        const backupPath = path.join(baseDir, name);
        fs.rmSync(backupPath, { recursive: true, force: true });
        console.log(`  Deleted (old): ${name} (${date})`);
        deleted++;
      });
      return;
    }

    // 3 天内，只保留最新的一个
    if (dayBackups.length > 1) {
      // 按时间排序（最新的在前）
      dayBackups.sort((a, b) => extractTime(b).localeCompare(extractTime(a)));
      const keep = dayBackups[0];

      for (let i = 1; i < dayBackups.length; i++) {
        const backupPath = path.join(baseDir, dayBackups[i]);
        fs.rmSync(backupPath, { recursive: true, force: true });
        console.log(`  Deleted: ${dayBackups[i]} (keeping: ${keep})`);
        deleted++;
      }
    } else {
      console.log(`  Keeping: ${dayBackups[0]} (${date})`);
    }
  });

  return deleted;
}

function main() {
  console.log('🧹 清理冗余备份...\n');
  console.log('规则：保留最近 3 天，每天最多 1 个备份\n');

  const backupDirs = [
    path.join(WORKSPACE, 'backups', 'backup-main'),
    path.join(WORKSPACE, 'backups', 'backup-copy'),
    'D:\\AAAAAA\\openclaw-backup-history'
  ];

  let totalDeleted = 0;

  backupDirs.forEach(dir => {
    totalDeleted += cleanupBackupDir(dir);
  });

  console.log(`\n✅ 清理完成！共删除 ${totalDeleted} 个冗余备份`);

  // 显示清理后的大小
  console.log('\n📊 清理后备份目录大小:');
  backupDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const count = fs.readdirSync(dir).filter(n => n.startsWith('backup-')).length;
      console.log(`  ${dir}: ${count} backups`);
    }
  });
}

main();
