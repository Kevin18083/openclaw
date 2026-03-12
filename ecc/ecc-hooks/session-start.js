#!/usr/bin/env node

/**
 * ECC 融合版 - 会话启动钩子
 *
 * 功能说明：
 * 1. 加载上次会话状态
 * 2. 检查记忆系统健康
 * 3. 同步 A/B 记忆文件
 * 4. 准备工作环境
 *
 * 来源：ECC session-start.js + 杰克健康检查
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const MEMORY_A = path.join(__dirname, '../../.claude/memory/MEMORY.md');
const MEMORY_B = path.join(__dirname, '../../.claude/memory/MEMORY-B.md');
const WORKSPACE = path.join(__dirname, '../workspace');
const SESSION_STATE = path.join(WORKSPACE, '.session-state.json');

/**
 * 检查记忆文件健康
 */
function checkMemoryHealth() {
  const issues = [];

  // 检查 A 本
  if (!fs.existsSync(MEMORY_A)) {
    issues.push('❌ MEMORY.md 不存在');
  } else {
    const size = fs.statSync(MEMORY_A).size;
    if (size < 1000) {
      issues.push(`⚠️ MEMORY.md 太小 (${size} 字节)`);
    }
  }

  // 检查 B 本
  if (!fs.existsSync(MEMORY_B)) {
    issues.push('❌ MEMORY-B.md 不存在');
  }

  return issues;
}

/**
 * 同步 A/B 记忆文件
 */
function syncMemory() {
  try {
    const contentA = fs.readFileSync(MEMORY_A, 'utf-8');
    fs.writeFileSync(MEMORY_B, contentA);
    return true;
  } catch (e) {
    console.error('⚠️ A/B 同步失败:', e.message);
    return false;
  }
}

/**
 * 加载会话状态
 */
function loadSessionState() {
  if (fs.existsSync(SESSION_STATE)) {
    return JSON.parse(fs.readFileSync(SESSION_STATE, 'utf-8'));
  }
  return { lastSession: new Date().toISOString(), tasks: [] };
}

/**
 * 保存会话状态
 */
function saveSessionState(state) {
  fs.writeFileSync(SESSION_STATE, JSON.stringify(state, null, 2));
}

/**
 * 主函数
 */
function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 ECC 融合版 - 会话启动');
  console.log('═══════════════════════════════════════════════════════');

  // 1. 健康检查
  console.log('\n📋 健康检查...');
  const issues = checkMemoryHealth();
  if (issues.length > 0) {
    issues.forEach(issue => console.log(`  ${issue}`));
  } else {
    console.log('  ✅ 记忆系统健康');
  }

  // 2. 同步 A/B
  console.log('\n🔄 同步 A/B 记忆...');
  if (syncMemory()) {
    console.log('  ✅ 同步完成');
  }

  // 3. 加载状态
  console.log('\n📂 加载会话状态...');
  const state = loadSessionState();
  console.log(`  上次会话：${state.lastSession}`);
  console.log(`  待处理任务：${state.tasks?.length || 0}`);

  // 4. 保存新状态
  state.lastSession = new Date().toISOString();
  saveSessionState(state);

  console.log('\n✅ 准备就绪');
  console.log('═══════════════════════════════════════════════════════\n');
}

main();
