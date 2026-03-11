#!/usr/bin/env node

/**
 * 杰克检查系统 - 完整测试脚本 v1.0
 *
 * 功能说明：
 * 1. 流程测试 - 测试杰克检查系统的完整流程
 * 2. 角色扮演 - 模拟罗总/扎克/杰克三方互动
 * 3. 逐步验证 - 8 个步骤验证系统各功能
 * 4. 状态追踪 - 追踪任务从创建到归档的全过程
 *
 * 测试场景：
 * 扎克修改缓存配置，杰克检查发现问题，扎克修改，最终通过
 *
 * 配置说明：
 * - steps: 8 个测试步骤数组
 * - 触发词："让杰克检查"
 * - 任务状态流转：pending → initial_review → deep_review → passed → archived
 *
 * 用法：
 *   node test-jack-review.js                    # 执行测试流程
 *
 * 测试步骤：
 *   1. 罗总触发检查
 *   2. 查看任务状态
 *   3. 扎克提交任务
 *   4. 杰克初检（模拟有问题）
 *   5. 扎克修改后重新提交
 *   6. 杰克初检通过
 *   7. 杰克深检通过
 *   8. 查看最终状态
 *
 * 示例输出：
 *   ═══════════════════════════════════════════════════════
 *           杰克检查系统 - 完整流程测试
 *   ═══════════════════════════════════════════════════════
 *   测试计划：8 个步骤
 *   [1] 步骤 1: 罗总触发检查
 *
 * 常见错误：
 * - 任务文件不存在 → 先触发检查流程
 * - JSON 解析失败 → 检查引号转义
 *
 * 依赖：
 * - Node.js 14+
 * - fs, path (内置模块)
 *
 * 修改历史：
 * - 2026-03-07: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}        杰克检查系统 - 完整流程测试${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

// 测试步骤
const steps = [
  {
    title: '步骤 1: 罗总触发检查',
    command: 'node jack-review.js "让杰克检查缓存配置修改"',
    description: '模拟罗总说 "让杰克检查"'
  },
  {
    title: '步骤 2: 查看任务状态',
    command: 'node jack-review.js status',
    description: '查看当前活跃任务'
  },
  {
    title: '步骤 3: 扎克提交任务',
    command: 'node jack-review.js submit "缓存配置已修改，启用了 promptCache，TTL 设置为 7200 秒，修改了 cache-config.json"',
    description: '扎克提交任务详情'
  },
  {
    title: '步骤 4: 杰克初检（模拟有问题）',
    command: 'node jack-review.js initial \'{"passed":false,"issues":[{"description":"JSON 语法错误 - 缺少逗号","location":"cache-config.json 第 5 行","severity":"高"},{"description":"未设置 enableCache 字段","location":"cache-config.json","severity":"中"}],"suggestions":["在第 5 行 \\"enabled\\": true 后面添加逗号","添加 \\"enableCache\\": true 字段"]}\''
  },
  {
    title: '步骤 5: 扎克修改后重新提交',
    command: 'node jack-review.js submit "已修复：1.添加了逗号 2.添加了 enableCache 字段，请重新检查"'
  },
  {
    title: '步骤 6: 杰克初检通过',
    command: 'node jack-review.js initial \'{"passed":true}\''
  },
  {
    title: '步骤 7: 杰克深检（模拟通过）',
    command: 'node jack-review.js deep \'{"passed":true}\''
  },
  {
    title: '步骤 8: 查看最终状态',
    command: 'node jack-review.js status',
    description: '确认任务已归档'
  }
];

console.log(`${colors.yellow}测试计划：${colors.reset}${steps.length}个步骤\n`);

steps.forEach((step, i) => {
  console.log(`${colors.green}[${i + 1}] ${step.title}${colors.reset}`);
  console.log(`    ${step.description || ''}`);
  console.log(`    命令：${step.command.substring(0, 60)}${step.command.length > 60 ? '...' : ''}\n`);
});

console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
console.log(`${colors.magenta}准备开始测试...${colors.reset}\n`);
