#!/usr/bin/env node

/**
 * 扎克记忆系统 - AB 轮换保护
 *
 * 功能：检查 MEMORY.md 健康状态，异常时自动切换到 MEMORY-B.md
 * 位置：C:/Users/17589/.openclaw/workspace/
 *
 * 用法：
 *   node memory-ab-switcher.js          # 自动检查并切换
 *   node memory-ab-switcher.js status   # 查看状态
 *   node memory-ab-switcher.js switch   # 手动切换
 *   node memory-ab-switcher.js sync     # 强制同步 A/B
 */

const fs = require('fs');
const path = require('path');

// 配置
const WORKSPACE = path.join('C:', 'Users', '17589', '.openclaw', 'workspace');
const MEMORY_A = path.join(WORKSPACE, 'MEMORY.md');
const MEMORY_B = path.join(WORKSPACE, 'MEMORY-B.md');
const STATE_FILE = path.join(WORKSPACE, 'memory-ab-state.json');

// 最小文件大小（字节）
const MIN_SIZE = 1000;

// 必需章节
const REQUIRED_SECTIONS = [
  'System Status',
  'Important Event',
  '## Memory'
];

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 读取状态
function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  }
  return { active: 'A', lastCheck: null, switches: 0 };
}

// 保存状态
function saveState(state) {
  ensureDir(path.dirname(STATE_FILE));
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

// 检查文件健康
function checkHealth(filePath) {
  if (!fs.existsSync(filePath)) {
    return { ok: false, reason: '文件不存在' };
  }

  const stats = fs.statSync(filePath);
  if (stats.size < MIN_SIZE) {
    return { ok: false, reason: `文件太小 (${stats.size} 字节 < ${MIN_SIZE})` };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const missingSections = REQUIRED_SECTIONS.filter(section => !content.includes(section));
  if (missingSections.length > 0) {
    return { ok: false, reason: `缺少章节：${missingSections.join(', ')}` };
  }

  return { ok: true, size: stats.size };
}

// 同步 A 和 B
function syncAB() {
  const content = fs.readFileSync(MEMORY_A, 'utf8');
  fs.writeFileSync(MEMORY_B, content, 'utf8');
  console.log('✅ A/B 已同步');
}

// 切换
function switchTo(target) {
  const state = loadState();
  state.active = target;
  state.lastCheck = new Date().toISOString();
  state.switches++;
  saveState(state);
  console.log(`✅ 已切换到 ${target} 本`);
}

// 自动检查
function autoCheck() {
  console.log('🔍 扎克记忆系统 - AB 轮换检查\n');

  const state = loadState();
  const healthA = checkHealth(MEMORY_A);
  const healthB = checkHealth(MEMORY_B);

  console.log(`A 本 (MEMORY.md):     ${healthA.ok ? '✅ 健康' : '❌ 异常'} - ${healthA.size || healthA.reason}`);
  console.log(`B 本 (MEMORY-B.md):   ${healthB.ok ? '✅ 健康' : '❌ 异常'} - ${healthB.size || healthB.reason}`);
  console.log(`当前活跃：${state.active} 本`);
  console.log(`切换次数：${state.switches}`);
  console.log(`最后检查：${state.lastCheck || '从未'}`);

  // 决定是否需要切换
  if (state.active === 'A' && !healthA.ok) {
    if (healthB.ok) {
      console.log('\n⚠️ A 本异常，B 本正常，切换到 B 本...');
      switchTo('B');
    } else {
      console.log('\n❌ A 本和 B 本都异常，需要手动修复！');
    }
  } else if (state.active === 'B' && healthA.ok) {
    console.log('\n✅ A 本已恢复，建议切回 A 本');
    switchTo('A');
  } else {
    console.log('\n✅ 系统状态正常');
  }
}

// 主程序
const command = process.argv[2] || 'auto';

switch (command) {
  case 'status':
  case 'auto':
    autoCheck();
    break;
  case 'switch':
    const state = loadState();
    const target = state.active === 'A' ? 'B' : 'A';
    switchTo(target);
    break;
  case 'sync':
    syncAB();
    break;
  default:
    console.log('用法：node memory-ab-switcher.js [auto|status|switch|sync]');
}
