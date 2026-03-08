/**
 * Skill Vetter 核心审查工具
 * 快速实现基础审查功能
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SkillVetter {
    constructor(options = {}) {
        this.options = {
            security: true,
            codeQuality: true,
            dependencies: true,
            documentation: true,
            ...options
        };
        
        this.report = {
            skill: {},
            summary: {},
            details: {},
            timestamp: new Date().toISOString()
        };
    }
    
    async analyze(skillPath) {
        console.log(`🔍 审查技能: ${skillPath}`);
        
        // 1. 收集技能信息
        this.report.skill = this.collectSkillInfo(skillPath);
        
        // 2. 安全检查
        if (this.options.security) {
            this.report.details.security = await this.checkSecurity(skillPath);
        }
        
        // 3. 代码质量检查
        if (this.options.codeQuality) {
            this.report.details.codeQuality = await this.checkCodeQuality(skillPath);
        }
        
        // 4. 依赖检查
        if (this.options.dependencies) {
            this.report.details.dependencies = await this.checkDependencies(skillPath);
        }
        
        // 5. 文档检查
        if (this.options.documentation) {
            this.report.details.documentation = await this.checkDocumentation(skillPath);
        }
        
        // 6. 生成总结
        this.report.summary = this.generateSummary();
        
        return this.report;
    }
    
    collectSkillInfo(skillPath) {
        const info = {
            path: skillPath,
            name: path.basename(skillPath),
            exists: fs.existsSync(skillPath)
        };
        
        // 检查SKILL.md文件
        const skillMdPath = path.join(skillPath, 'SKILL.md');
        if (fs.existsSync(skillMdPath)) {
            const content = fs.readFileSync(skillMdPath, 'utf8');
            
            // 提取基本信息
            const nameMatch = content.match(/name:\s*(.+)/i);
            const descMatch = content.match(/description:\s*(.+)/i);
            
            if (nameMatch) info.name = nameMatch[1].trim();
            if (descMatch) info.description = descMatch[1].trim();
            
            info.hasSkillMd = true;
            info.skillMdSize = content.length;
        } else {
            info.hasSkillMd = false;
        }
        
        // 检查package.json
        const packagePath = path.join(skillPath, 'package.json');
        if (fs.existsSync(packagePath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                info.version = pkg.version;
                info.dependencies = Object.keys(pkg.dependencies || {}).length;
                info.devDependencies = Object.keys(pkg.devDependencies || {}).length;
            } catch (e) {
                info.packageError = e.message;
            }
        }
        
        return info;
    }
    
    async checkSecurity(skillPath) {
        const issues = [];
        const warnings = [];
        
        console.log('  🔒 安全检查...');
        
        // 1. 检查危险文件操作
        const dangerousPatterns = [
            /rm\s+-rf/,
            /del\s+\/s/,
            /format\s+/,
            /shutdown/,
            /eval\(/,
            /Function\(/,
            /execSync\(/,
            /spawnSync\(/
        ];
        
        // 扫描JS文件
        const jsFiles = this.findFiles(skillPath, '.js');
        jsFiles.forEach(file => {
            try {
                const content = fs.readFileSync(file, 'utf8');
                dangerousPatterns.forEach((pattern, index) => {
                    if (pattern.test(content)) {
                        issues.push({
                            level: 'high',
                            message: `发现危险操作: ${pattern.toString()}`,
                            file: path.relative(skillPath, file),
                            suggestion: '避免使用危险的系统操作'
                        });
                    }
                });
            } catch (e) {
                // 忽略读取错误
            }
        });
        
        // 2. 检查权限声明
        const skillMdPath = path.join(skillPath, 'SKILL.md');
        if (fs.existsSync(skillMdPath)) {
            const content = fs.readFileSync(skillMdPath, 'utf8');
            if (!content.includes('permissions') && !content.includes('权限')) {
                warnings.push({
                    level: 'medium',
                    message: '技能文档中未明确声明权限需求',
                    suggestion: '在SKILL.md中添加权限声明部分'
                });
            }
        }
        
        // 计算安全评分
        const securityScore = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 20));
        
        return {
            issues,
            warnings,
            score: securityScore,
            filesScanned: jsFiles.length
        };
    }
    
    async checkCodeQuality(skillPath) {
        const issues = [];
        const warnings = [];
        const metrics = {};
        
        console.log('  📝 代码质量检查...');
        
        // 1. 检查文件结构
        const files = this.findFiles(skillPath);
        metrics.totalFiles = files.length;
        
        const jsFiles = files.filter(f => f.endsWith('.js'));
        metrics.jsFiles = jsFiles.length;
        
        const mdFiles = files.filter(f => f.endsWith('.md'));
        metrics.mdFiles = mdFiles.length;
        
        // 2. 检查是否有测试文件
        const testFiles = files.filter(f => 
            f.includes('test') || f.includes('spec') || f.includes('__tests__')
        );
        metrics.testFiles = testFiles.length;
        
        if (testFiles.length === 0) {
            warnings.push({
                level: 'low',
                message: '未发现测试文件',
                suggestion: '添加单元测试确保代码质量'
            });
        }
        
        // 3. 简单的代码复杂度检查（行数）
        let totalLines = 0;
        let maxFileLines = 0;
        let maxFileName = '';
        
        jsFiles.forEach(file => {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const lines = content.split('\n').length;
                totalLines += lines;
                
                if (lines > maxFileLines) {
                    maxFileLines = lines;
                    maxFileName = path.relative(skillPath, file);
                }
                
                // 检查大文件
                if (lines > 500) {
                    issues.push({
                        level: 'medium',
                        message: `文件过大: ${lines} 行`,
                        file: path.relative(skillPath, file),
                        suggestion: '考虑拆分为多个小文件'
                    });
                }
            } catch (e) {
                // 忽略读取错误
            }
        });
        
        metrics.totalLines = totalLines;
        metrics.avgLinesPerFile = jsFiles.length > 0 ? Math.round(totalLines / jsFiles.length) : 0;
        metrics.maxFileLines = maxFileLines;
        metrics.maxFileName = maxFileName;
        
        // 计算代码质量评分
        let qualityScore = 80; // 基础分
        
        // 有测试文件加分
        if (testFiles.length > 0) qualityScore += 10;
        
        // 文件过大扣分
        if (issues.length > 0) qualityScore -= issues.length * 5;
        
        // 平均行数合理加分
        if (metrics.avgLinesPerFile > 0 && metrics.avgLinesPerFile < 200) {
            qualityScore += 5;
        }
        
        qualityScore = Math.max(0, Math.min(100, qualityScore));
        
        return {
            issues,
            warnings,
            metrics,
            score: qualityScore
        };
    }
    
    async checkDependencies(skillPath) {
        const vulnerabilities = [];
        const outdated = [];
        const licenses = [];
        
        console.log('  📦 依赖检查...');
        
        const packagePath = path.join(skillPath, 'package.json');
        
        if (fs.existsSync(packagePath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                const deps = pkg.dependencies || {};
                const devDeps = pkg.devDependencies || {};
                
                // 检查依赖数量
                const totalDeps = Object.keys(deps).length + Object.keys(devDeps).length;
                
                // 简单检查：是否有常见的安全包
                const securityPackages = ['helmet', 'cors', 'bcrypt', 'jsonwebtoken'];
                const hasSecurityPackages = securityPackages.some(pkg => 
                    deps[pkg] || devDeps[pkg]
                );
                
                if (!hasSecurityPackages && totalDeps > 0) {
                    warnings.push({
                        level: 'low',
                        message: '未发现常见的安全相关依赖包',
                        suggestion: '考虑添加安全相关的依赖'
                    });
                }
                
                return {
                    totalDependencies: totalDeps,
                    productionDeps: Object.keys(deps).length,
                    devDeps: Object.keys(devDeps).length,
                    vulnerabilities: vulnerabilities,
                    outdated: outdated,
                    licenses: licenses,
                    score: totalDeps === 0 ? 100 : 90 // 简单评分
                };
                
            } catch (e) {
                return {
                    error: e.message,
                    score: 50
                };
            }
        }
        
        return {
            totalDependencies: 0,
            score: 100 // 没有依赖，完美
        };
    }
    
    async checkDocumentation(skillPath) {
        const issues = [];
        
        console.log('  📚 文档检查...');
        
        // 1. 检查SKILL.md
        const skillMdPath = path.join(skillPath, 'SKILL.md');
        let hasSkillMd = false;
        let skillMdScore = 0;
        
        if (fs.existsSync(skillMdPath)) {
            hasSkillMd = true;
            const content = fs.readFileSync(skillMdPath, 'utf8');
            
            // 检查必要部分
            const requiredSections = [
                'name',
                'description',
                'usage',
                'installation'
            ];
            
            let foundSections = 0;
            requiredSections.forEach(section => {
                if (content.toLowerCase().includes(section)) {
                    foundSections++;
                }
            });
            
            skillMdScore = Math.round((foundSections / requiredSections.length) * 100);
            
            if (skillMdScore < 80) {
                issues.push({
                    level: 'medium',
                    message: `SKILL.md文档不完整 (${skillMdScore}分)`,
                    suggestion: '补充缺失的部分: name, description, usage, installation'
                });
            }
        } else {
            issues.push({
                level: 'high',
                message: '缺少SKILL.md文件',
                suggestion: '创建SKILL.md文档，描述技能功能和使用方法'
            });
        }
        
        // 2. 检查README
        const readmePath = path.join(skillPath, 'README.md');
        const hasReadme = fs.existsSync(readmePath);
        
        // 3. 检查示例代码
        const exampleFiles = this.findFiles(skillPath).filter(f => 
            f.includes('example') || f.includes('demo') || f.includes('sample')
        );
        
        const documentationScore = hasSkillMd ? skillMdScore : 0;
        
        return {
            hasSkillMd,
            skillMdScore,
            hasReadme,
            exampleFiles: exampleFiles.length,
            issues,
            score: documentationScore
        };
    }
    
    generateSummary() {
        const details = this.report.details;
        
        // 计算各项分数
        const securityScore = details.security?.score || 0;
        const qualityScore = details.codeQuality?.score || 0;
        const dependenciesScore = details.dependencies?.score || 0;
        const documentationScore = details.documentation?.score || 0;
        
        // 权重计算
        const weights = {
            security: 0.4,
            quality: 0.3,
            dependencies: 0.2,
            documentation: 0.1
        };
        
        const overallScore = Math.round(
            securityScore * weights.security +
            qualityScore * weights.quality +
            dependenciesScore * weights.dependencies +
            documentationScore * weights.documentation
        );
        
        // 确定风险等级
        let riskLevel = '低风险';
        if (overallScore < 60) riskLevel = '危险';
        else if (overallScore < 70) riskLevel = '高风险';
        else if (overallScore < 80) riskLevel = '中风险';
        
        // 统计问题数量
        const totalIssues = [
            ...(details.security?.issues || []),
            ...(details.codeQuality?.issues || []),
            ...(details.documentation?.issues || [])
        ].length;
        
        const totalWarnings = [
            ...(details.security?.warnings || []),
            ...(details.codeQuality?.warnings || [])
        ].length;
        
        return {
            overallScore,
            securityScore,
            qualityScore,
            dependenciesScore,
            documentationScore,
            riskLevel,
            totalIssues,
            totalWarnings,
            passed: overallScore >= 70
        };
    }
    
    findFiles(dir, extension = '') {
        const files = [];
        
        function scan(currentPath) {
            if (!fs.existsSync(currentPath)) return;
            
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // 跳过node_modules和.git
                    if (!item.includes('node_modules') && !item.includes('.git')) {
                        scan(fullPath);
                    }
                } else if (stat.isFile()) {
                    if (!extension || item.endsWith(extension)) {
                        files.push(fullPath);
                    }
                }
            }
        }
        
        scan(dir);
        return files;
    }
    
    saveReport(outputPath) {
        const report = {
            ...this.report,
            generatedBy: 'Skill Vetter Core',
            version: '1.0.0'
        };
        
        fs.writeFileSync(
            outputPath,
            JSON.stringify(report, null, 2),
            'utf8'
        );
        
        console.log(`✅ 审查报告已保存: ${outputPath}`);
        return outputPath;
    }
}

// 使用示例
if (require.main === module) {
    console.log('🚀 Skill Vetter 核心工具测试');
    console.log('='.repeat(50));
    
    const vetter = new SkillVetter();
    
    // 测试当前目录
    (async () => {
        try {
            const report = await vetter.analyze('.');
            
            console.log('\n📋 审查结果摘要:');
            console.log(`   总体评分: ${report.summary.overallScore}/100`);
            console.log(`   安全评分: ${report.summary.securityScore}/100`);
            console.log(`   质量评分: ${report.summary.qualityScore}/100`);
            console.log(`   风险等级: ${report.summary.riskLevel}`);
            console.log(`   问题数量: ${report.summary.totalIssues}`);
            console.log(`   警告数量: ${report.summary.totalWarnings}`);
            
            if (report.summary.passed) {
                console.log('   ✅ 通过审查');
            } else {
                console.log('   ❌ 未通过审查');
            }
            
            // 保存报告
            const reportFile = `vetting-report-${Date.now()}.json`;
            vetter.saveReport(reportFile);
            
        } catch (error) {
            console.error('❌ 审查失败:', error.message);
        }
    })();
}

module.exports = SkillVetter;