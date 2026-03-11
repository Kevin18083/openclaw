#!/usr/bin/env node

/**
 * 12 类注释验证测试脚本 v1.0
 *
 * 功能：批量检查所有 JS 文件是否包含完整的 12 类注释
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = 'C:\\Users\\17589\\.openclaw\\workspace';

// 12 类注释的必需关键词
const REQUIRED_CLASSES = [
  { key: '功能说明', name: '功能说明' },
  { key: '配置说明', name: '配置说明' },
  { key: '用法', name: '用法示例' },
  { key: '输入输出', name: '输入输出' },
  { key: '依赖', name: '依赖关系' },
  { key: '常见问题', name: '常见问题' },
  { key: '设计思路', name: '设计思路' },      // 新增
  { key: '修改历史', name: '修改历史' },
  { key: '状态标记', name: '状态标记' },
  { key: '业务含义', name: '业务含义' },      // 新增
  { key: '性能特征', name: '性能特征' },
  { key: '安全考虑', name: '安全考虑' }
];

// 颜色定义
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}  12 类注释验证测试${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

// 获取所有 JS 文件（只扫描根目录，排除子目录）
function getJsFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    // 只处理根目录的 JS 文件
    if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

// 检查单个文件的注释
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const missingClasses = [];

  for (const cls of REQUIRED_CLASSES) {
    if (!content.includes(cls.key)) {
      missingClasses.push(cls.name);
    }
  }

  return {
    path: filePath,
    hasAll: missingClasses.length === 0,
    missing: missingClasses,
    lineCount: content.split('\n').length,
    commentLength: (content.match(/\/\*\*([\s\S]*?)\*\//)?.[0]?.length || 0)
  };
}

// 主测试
function runTest() {
  const jsFiles = getJsFiles(WORKSPACE);
  const results = [];
  let passed = 0;
  let failed = 0;

  console.log(`扫描文件数：${jsFiles.length}\n`);

  for (const file of jsFiles) {
    const result = checkFile(file);
    results.push(result);

    if (result.hasAll) {
      passed++;
    } else {
      failed++;
    }
  }

  // 输出结果
  console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  测试结果${colors.reset}`);
  console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}\n`);

  console.log(`总文件数：${results.length}`);
  console.log(`${colors.green}✅ 通过：${passed}${colors.reset}`);
  console.log(`${colors.red}❌ 失败：${failed}${colors.reset}`);
  console.log(`通过率：${((passed / results.length) * 100).toFixed(1)}%\n`);

  // 显示失败的文件
  if (failed > 0) {
    console.log(`${colors.yellow}⚠️  缺失注释的文件：${colors.reset}\n`);
    results.filter(r => !r.hasAll).forEach(r => {
      const relPath = path.relative(WORKSPACE, r.path);
      console.log(`  ❌ ${relPath}`);
      console.log(`     缺失：${r.missing.join(', ')}\n`);
    });
  } else {
    console.log(`${colors.green}🎉 所有文件都包含完整的 12 类注释！${colors.reset}\n`);
  }

  // 显示注释统计
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}  注释统计${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  const totalCommentChars = results.reduce((sum, r) => sum + r.commentLength, 0);
  const avgCommentLength = Math.round(totalCommentChars / results.length);
  const maxComment = results.reduce((max, r) => r.commentLength > max ? r.commentLength : max, 0);
  const minComment = results.reduce((min, r) => r.commentLength < min ? r.commentLength : min, maxComment);

  console.log(`总注释字符：${totalCommentChars.toLocaleString()}`);
  console.log(`平均注释长度：${avgCommentLength} 字符`);
  console.log(`最长注释：${maxComment} 字符`);
  console.log(`最短注释：${minComment} 字符\n`);

  // 前 5 名最长注释
  console.log(`${colors.yellow}📊 注释最长的 5 个文件：${colors.reset}\n`);
  results
    .sort((a, b) => b.commentLength - a.commentLength)
    .slice(0, 5)
    .forEach((r, i) => {
      const relPath = path.relative(WORKSPACE, r.path);
      console.log(`  ${i + 1}. ${relPath} (${r.commentLength} 字符)`);
    });

  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

  // 生成报告
  const report = `# 12 类注释验证测试报告

**测试时间**: ${new Date().toLocaleString('zh-CN')}
**测试范围**: ${WORKSPACE}

## 测试结果

| 指标 | 数值 |
|------|------|
| 总文件数 | ${results.length} |
| ✅ 通过 | ${passed} |
| ❌ 失败 | ${failed} |
| 通过率 | ${((passed / results.length) * 100).toFixed(1)}% |

## 注释统计

| 统计项 | 数值 |
|--------|------|
| 总注释字符 | ${totalCommentChars.toLocaleString()} |
| 平均注释长度 | ${avgCommentLength} 字符 |
| 最长注释 | ${maxComment} 字符 |
| 最短注释 | ${minComment} 字符 |

## 12 类注释清单

1. 功能说明
2. 配置说明
3. 用法示例
4. 输入输出
5. 依赖关系
6. 常见问题
7. 设计思路（新增）
8. 修改历史
9. 状态标记
10. 业务含义（新增）
11. 性能特征
12. 安全考虑

---
*报告生成：12 类注释验证测试脚本*
`;

  const reportPath = path.join(WORKSPACE, '12class-comments-test-report.md');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`${colors.green}📄 测试报告已保存：${reportPath}${colors.reset}\n`);

  return failed === 0;
}

// 执行
const success = runTest();
process.exit(success ? 0 : 1);
