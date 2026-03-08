#!/usr/bin/env node

/**
 * Skill Vetter 命令行工具
 * 快速审查技能的命令行界面
 */

const SkillVetter = require('./skill-vetter-core.js');
const fs = require('fs');
const path = require('path');

// 命令行参数解析
const args = process.argv.slice(2);
const skillPath = args[0] || '.';
const outputFormat = args.includes('--json') ? 'json' : 
                    args.includes('--text') ? 'text' : 'text';
const outputFile = args.find(arg => arg.startsWith('--output='))?.split('=')[1];
const fullCheck = args.includes('--full');

async function main() {
    console.log('🔍 Skill Vetter 命令行工具');
    console.log('='.repeat(50));
    
    // 检查路径是否存在
    if (!fs.existsSync(skillPath)) {
        console.error(`❌ 路径不存在: ${skillPath}`);
        process.exit(1);
    }
    
    // 创建审查器
    const vetter = new SkillVetter({
        security: true,
        codeQuality: true,
        dependencies: true,
        documentation: true
    });
    
    try {
        console.log(`审查目标: ${skillPath}`);
        console.log('开始审查...\n');
        
        // 执行审查
        const report = await vetter.analyze(skillPath);
        
        // 输出结果
        if (outputFormat === 'json') {
            outputJson(report);
        } else {
            outputText(report);
        }
        
        // 保存报告
        if (outputFile) {
            vetter.saveReport(outputFile);
        } else if (args.includes('--save')) {
            const defaultFile = `vetting-report-${path.basename(skillPath)}-${Date.now()}.json`;
            vetter.saveReport(defaultFile);
        }
        
        // 根据结果退出代码
        if (!report.summary.passed) {
            console.log('\n⚠️ 技能未通过审查');
            process.exit(1);
        } else {
            console.log('\n✅ 技能通过审查');
            process.exit(0);
        }
        
    } catch (error) {
        console.error('❌ 审查过程出错:', error.message);
        process.exit(1);
    }
}

function outputJson(report) {
    console.log(JSON.stringify(report, null, 2));
}

function outputText(report) {
    const summary = report.summary;
    const skill = report.skill;
    
    console.log('📋 审查报告');
    console.log('='.repeat(50));
    
    // 技能信息
    console.log('\n🎯 技能信息:');
    console.log(`   名称: ${skill.name}`);
    console.log(`   路径: ${skill.path}`);
    console.log(`   SKILL.md: ${skill.hasSkillMd ? '✅ 存在' : '❌ 缺失'}`);
    if (skill.version) console.log(`   版本: ${skill.version}`);
    
    // 评分摘要
    console.log('\n📊 评分摘要:');
    console.log(`   总体评分: ${summary.overallScore}/100`);
    console.log(`   安全评分: ${summary.securityScore}/100`);
    console.log(`   质量评分: ${summary.qualityScore}/100`);
    console.log(`   依赖评分: ${summary.dependenciesScore}/100`);
    console.log(`   文档评分: ${summary.documentationScore}/100`);
    
    // 风险等级
    console.log(`\n⚠️  风险等级: ${summary.riskLevel}`);
    console.log(`   问题数量: ${summary.totalIssues}`);
    console.log(`   警告数量: ${summary.totalWarnings}`);
    
    // 详细问题
    if (summary.totalIssues > 0 || summary.totalWarnings > 0) {
        console.log('\n🔍 详细问题:');
        
        // 安全问题
        if (report.details.security?.issues?.length > 0) {
            console.log('\n  🔒 安全问题:');
            report.details.security.issues.forEach((issue, index) => {
                console.log(`    ${index + 1}. [${issue.level}] ${issue.message}`);
                if (issue.file) console.log(`       文件: ${issue.file}`);
                if (issue.suggestion) console.log(`       建议: ${issue.suggestion}`);
            });
        }
        
        // 代码质量问题
        if (report.details.codeQuality?.issues?.length > 0) {
            console.log('\n  📝 代码质量问题:');
            report.details.codeQuality.issues.forEach((issue, index) => {
                console.log(`    ${index + 1}. [${issue.level}] ${issue.message}`);
                if (issue.file) console.log(`       文件: ${issue.file}`);
                if (issue.suggestion) console.log(`       建议: ${issue.suggestion}`);
            });
        }
        
        // 文档问题
        if (report.details.documentation?.issues?.length > 0) {
            console.log('\n  📚 文档问题:');
            report.details.documentation.issues.forEach((issue, index) => {
                console.log(`    ${index + 1}. [${issue.level}] ${issue.message}`);
                if (issue.suggestion) console.log(`       建议: ${issue.suggestion}`);
            });
        }
        
        // 警告
        const allWarnings = [
            ...(report.details.security?.warnings || []),
            ...(report.details.codeQuality?.warnings || [])
        ];
        
        if (allWarnings.length > 0) {
            console.log('\n  ⚠️  警告:');
            allWarnings.forEach((warning, index) => {
                console.log(`    ${index + 1}. [${warning.level}] ${warning.message}`);
                if (warning.suggestion) console.log(`       建议: ${warning.suggestion}`);
            });
        }
    }
    
    // 指标数据
    console.log('\n📈 技术指标:');
    
    if (report.details.codeQuality?.metrics) {
        const metrics = report.details.codeQuality.metrics;
        console.log(`   文件总数: ${metrics.totalFiles}`);
        console.log(`   JS文件数: ${metrics.jsFiles}`);
        console.log(`   文档文件: ${metrics.mdFiles}`);
        console.log(`   测试文件: ${metrics.testFiles}`);
        console.log(`   代码行数: ${metrics.totalLines}`);
        console.log(`   平均行数: ${metrics.avgLinesPerFile}`);
        
        if (metrics.maxFileLines > 500) {
            console.log(`   ⚠️  最大文件: ${metrics.maxFileName} (${metrics.maxFileLines}行)`);
        }
    }
    
    if (report.details.dependencies) {
        const deps = report.details.dependencies;
        console.log(`   总依赖数: ${deps.totalDependencies}`);
        console.log(`   生产依赖: ${deps.productionDeps}`);
        console.log(`   开发依赖: ${deps.devDeps}`);
    }
    
    // 建议
    console.log('\n💡 改进建议:');
    
    if (summary.overallScore < 80) {
        console.log('   1. 提高安全评分: 检查危险操作和权限声明');
        console.log('   2. 提高代码质量: 添加测试，拆分大文件');
        console.log('   3. 完善文档: 确保SKILL.md包含所有必要部分');
    } else if (summary.overallScore < 90) {
        console.log('   1. 优化代码结构');
        console.log('   2. 增加测试覆盖率');
        console.log('   3. 完善使用示例');
    } else {
        console.log('   ✅ 技能质量优秀，继续保持！');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`审查时间: ${report.timestamp}`);
}

// 显示帮助
function showHelp() {
    console.log('🔍 Skill Vetter 命令行工具');
    console.log('='.repeat(50));
    console.log('\n使用方法:');
    console.log('  node vetter-cli.js [技能路径] [选项]');
    console.log('\n选项:');
    console.log('  --json             输出JSON格式');
    console.log('  --text             输出文本格式（默认）');
    console.log('  --output=文件路径  保存报告到文件');
    console.log('  --save             自动保存报告');
    console.log('  --full             完整审查（包含所有检查）');
    console.log('  --help             显示帮助');
    console.log('\n示例:');
    console.log('  node vetter-cli.js ./skills/my-skill');
    console.log('  node vetter-cli.js . --json --save');
    console.log('  node vetter-cli.js ./skills --output=report.json');
    console.log('\n退出代码:');
    console.log('  0 - 技能通过审查');
    console.log('  1 - 技能未通过审查或出错');
}

// 检查是否需要显示帮助
if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
}

// 运行主程序
main().catch(error => {
    console.error('❌ 程序出错:', error);
    process.exit(1);
});