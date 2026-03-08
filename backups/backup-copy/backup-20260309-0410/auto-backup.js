/**
 * 自动备份脚本 - 三重备份保护
 * 功能：将工作区文件备份到 3 个位置，保留最近 7 天版本
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 源目录
const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';

// 备份目标（3 个位置）
const BACKUP_TARGETS = [
  'C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-main',
  'C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-copy',
  'D:\\AAAAAA\\openclaw-backup-history'
];

// 保留天数
const KEEP_DAYS = 7;

// 获取日期字符串
function getDateStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
  return `${year}${month}${day}-${time}`;
}

// 获取 N 天前的日期字符串
function getDateBefore(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 复制目录
function copyDir(src, dest) {
  try {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    execSync(`xcopy "${src}" "${dest}" /E /I /Y`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    console.error(`复制失败：${src} -> ${dest}`, e.message);
    return false;
  }
}

// 清理旧备份
function cleanupOldBackups(targetDir) {
  console.log(`清理 ${targetDir} 的旧备份...`);
  try {
    const dirs = fs.readdirSync(targetDir);
    const cutoffDate = getDateBefore(KEEP_DAYS);
    
    dirs.forEach(dir => {
      // 匹配日期格式 YYYYMMDD-HHMM
      const match = dir.match(/^(\d{8})-\d{4}$/);
      if (match && match[1] < cutoffDate) {
        const oldPath = path.join(targetDir, dir);
        console.log(`  删除旧备份：${dir}`);
        execSync(`rmdir "${oldPath}" /S /Q`, { stdio: 'pipe' });
      }
    });
  } catch (e) {
    console.error(`清理失败：`, e.message);
  }
}

// 主函数
function main() {
  console.log('========================================');
  console.log('自动备份系统 - 三重备份保护');
  console.log('========================================');
  
  const dateStr = getDateStr();
  const backupName = `backup-${dateStr}`;
  
  // 要备份的目录
  const itemsToBackup = [
    { name: 'memory', src: path.join(WORKSPACE, 'memory') },
    { name: 'MEMORY.md', src: path.join(WORKSPACE, 'MEMORY.md') },
    { name: 'HEARTBEAT.md', src: path.join(WORKSPACE, 'HEARTBEAT.md') },
    { name: 'SOUL.md', src: path.join(WORKSPACE, 'SOUL.md') },
    { name: 'USER.md', src: path.join(WORKSPACE, 'USER.md') },
    { name: 'AGENTS.md', src: path.join(WORKSPACE, 'AGENTS.md') },
    { name: 'TOOLS.md', src: path.join(WORKSPACE, 'TOOLS.md') },
    { name: 'IDENTITY.md', src: path.join(WORKSPACE, 'IDENTITY.md') },
    { name: 'skills', src: path.join(WORKSPACE, 'skills') },
    { name: '*.js', src: path.join(WORKSPACE, '*.js') },
    { name: '*.bat', src: path.join(WORKSPACE, '*.bat') },
    { name: '*.md', src: path.join(WORKSPACE, '*.md') },
    { name: '*.json', src: path.join(WORKSPACE, '*.json') },
  ];
  
  // 备份到 3 个位置
  let successCount = 0;
  
  BACKUP_TARGETS.forEach((target, index) => {
    console.log(`\n[${index + 1}/3] 备份到：${target}`);
    
    const backupDir = path.join(target, backupName);
    
    // 确保目标目录存在
    if (!fs.existsSync(target)) {
      try {
        fs.mkdirSync(target, { recursive: true });
      } catch (e) {
        console.error(`创建目录失败：${target}`);
        return;
      }
    }
    
    // 复制文件
    let copied = 0;
    itemsToBackup.forEach(item => {
      const dest = path.join(backupDir, item.name);
      if (fs.existsSync(item.src)) {
        if (copyDir(item.src, dest)) {
          copied++;
        }
      }
    });
    
    if (copied > 0) {
      console.log(`  ✅ 完成：复制了 ${copied} 个项目`);
      successCount++;
    }
    
    // 清理旧备份
    cleanupOldBackups(target);
  });
  
  // 写入备份日志
  const logPath = path.join(WORKSPACE, 'backup-log.md');
  const logContent = `# 备份日志

## 最近备份
- **时间**: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
- **备份名称**: ${backupName}
- **成功**: ${successCount}/3

## 备份位置
1. C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-main\\${backupName}
2. C:\\Users\\17589\\.openclaw\\workspace\\backups\\backup-copy\\${backupName}
3. D:\\AAAAAA\\openclaw-backup-history\\${backupName}

## 保留策略
- 保留最近 ${KEEP_DAYS} 天
- 自动清理旧备份
`;
  fs.writeFileSync(logPath, logContent, 'utf-8');
  
  console.log('\n========================================');
  console.log(`备份完成！成功：${successCount}/3`);
  console.log(`备份日志：${logPath}`);
  console.log('========================================');
}

// 运行
main();
