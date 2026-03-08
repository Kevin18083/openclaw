// 一键恢复脚本
const fs = require('fs').promises;
const path = require('path');

class BackupRestorer {
    constructor(backupPath) {
        this.backupPath = backupPath;
        this.workspaceDir = path.join(__dirname, '..');
        this.restoreLog = [];
    }
    
    async restoreFromBackup() {
        console.log('🔄 开始从备份恢复工作空间\n');
        console.log('='.repeat(60));
        
        // 1. 验证备份完整性
        if (!await this.validateBackup()) {
            console.log('❌ 备份验证失败，无法恢复');
            return false;
        }
        
        // 2. 创建恢复前备份（安全措施）
        await this.createPreRestoreBackup();
        
        // 3. 恢复配置文件
        await this.restoreConfigFiles();
        
        // 4. 恢复记忆系统
        await this.restoreMemorySystem();
        
        // 5. 恢复学习成果
        await this.restoreLearningContent();
        
        // 6. 恢复技能文件
        await this.restoreSkills();
        
        // 7. 验证恢复结果
        await this.verifyRestoration();
        
        // 8. 生成恢复报告
        await this.generateRestoreReport();
        
        console.log('\n' + '='.repeat(60));
        console.log('🎉 工作空间恢复完成！');
        console.log('='.repeat(60));
        
        return true;
    }
    
    async validateBackup() {
        console.log('🔍 验证备份完整性...');
        
        const requiredFiles = [
            'configs/MEMORY.md',
            'system-snapshot.json',
            'BACKUP-REPORT.md'
        ];
        
        for (const file of requiredFiles) {
            const filePath = path.join(this.backupPath, file);
            try {
                await fs.access(filePath);
                console.log(`✅ ${file} 存在`);
            } catch (error) {
                console.log(`❌ ${file} 缺失`);
                return false;
            }
        }
        
        // 读取备份报告
        try {
            const reportPath = path.join(this.backupPath, 'BACKUP-REPORT.md');
            const report = await fs.readFile(reportPath, 'utf8');
            const backupIdMatch = report.match(/备份ID: (.+)/);
            if (backupIdMatch) {
                console.log(`📋 备份ID: ${backupIdMatch[1]}`);
            }
        } catch (error) {
            console.log('⚠️  无法读取备份报告');
        }
        
        return true;
    }
    
    async createPreRestoreBackup() {
        console.log('\n💾 创建恢复前备份（安全措施）...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const safetyBackupDir = path.join(this.workspaceDir, 'safety-backups', `pre-restore-${timestamp}`);
        
        try {
            await fs.mkdir(safetyBackupDir, { recursive: true });
            
            // 备份当前的重要文件
            const importantFiles = [
                'MEMORY.md',
                'AGENTS.md',
                'SOUL.md',
                'USER.md'
            ];
            
            for (const file of importantFiles) {
                const source = path.join(this.workspaceDir, file);
                const target = path.join(safetyBackupDir, file);
                
                try {
                    await fs.copyFile(source, target);
                } catch (error) {
                    // 文件可能不存在，跳过
                }
            }
            
            console.log(`✅ 安全备份已创建: ${safetyBackupDir}`);
            this.restoreLog.push(`安全备份: ${safetyBackupDir}`);
            
        } catch (error) {
            console.log(`⚠️  创建安全备份失败: ${error.message}`);
        }
    }
    
    async restoreConfigFiles() {
        console.log('\n⚙️ 恢复配置文件...');
        
        const backupConfigsDir = path.join(this.backupPath, 'configs');
        let restored = 0;
        
        try {
            const files = await fs.readdir(backupConfigsDir);
            
            for (const file of files) {
                const source = path.join(backupConfigsDir, file);
                const target = path.join(this.workspaceDir, file);
                
                await fs.copyFile(source, target);
                console.log(`✅ 恢复: ${file}`);
                restored++;
                this.restoreLog.push(`恢复配置文件: ${file}`);
            }
            
            console.log(`✅ 已恢复 ${restored} 个配置文件`);
            
        } catch (error) {
            console.log(`❌ 恢复配置文件失败: ${error.message}`);
        }
    }
    
    async restoreMemorySystem() {
        console.log('\n🧠 恢复记忆系统...');
        
        const backupMemoryDir = path.join(this.backupPath, 'memory');
        const workspaceMemoryDir = path.join(this.workspaceDir, 'memory');
        
        try {
            // 清空现有记忆目录（可选）
            try {
                await fs.rm(workspaceMemoryDir, { recursive: true, force: true });
            } catch (error) {
                // 目录可能不存在
            }
            
            // 创建记忆目录
            await fs.mkdir(workspaceMemoryDir, { recursive: true });
            
            // 复制备份的记忆文件
            await this.copyDirectory(backupMemoryDir, workspaceMemoryDir);
            
            console.log('✅ 记忆系统恢复完成');
            this.restoreLog.push('恢复记忆系统');
            
        } catch (error) {
            console.log(`❌ 恢复记忆系统失败: ${error.message}`);
        }
    }
    
    async restoreLearningContent() {
        console.log('\n📚 恢复学习成果...');
        
        const backupLearningDir = path.join(this.backupPath, 'learning');
        const workspaceLearningDir = path.join(this.workspaceDir, 'learning');
        
        try {
            if (await this.directoryExists(backupLearningDir)) {
                // 清空现有学习目录
                try {
                    await fs.rm(workspaceLearningDir, { recursive: true, force: true });
                } catch (error) {
                    // 目录可能不存在
                }
                
                // 复制备份的学习文件
                await this.copyDirectory(backupLearningDir, workspaceLearningDir);
                
                console.log('✅ 学习成果恢复完成');
                this.restoreLog.push('恢复学习成果');
            } else {
                console.log('ℹ️ 备份中无学习目录，跳过');
            }
        } catch (error) {
            console.log(`❌ 恢复学习成果失败: ${error.message}`);
        }
    }
    
    async restoreSkills() {
        console.log('\n🛠️ 恢复技能文件...');
        
        const backupSkillsDir = path.join(this.backupPath, 'skills');
        const workspaceSkillsDir = path.join(this.workspaceDir, 'skills');
        
        try {
            if (await this.directoryExists(backupSkillsDir)) {
                // 清空现有技能目录
                try {
                    await fs.rm(workspaceSkillsDir, { recursive: true, force: true });
                } catch (error) {
                    // 目录可能不存在
                }
                
                // 复制备份的技能文件
                await this.copyDirectory(backupSkillsDir, workspaceSkillsDir);
                
                console.log('✅ 技能文件恢复完成');
                this.restoreLog.push('恢复技能文件');
            } else {
                console.log('ℹ️ 备份中无技能目录，跳过');
            }
        } catch (error) {
            console.log(`❌ 恢复技能文件失败: ${error.message}`);
        }
    }
    
    async verifyRestoration() {
        console.log('\n🔍 验证恢复结果...');
        
        const requiredFiles = [
            'MEMORY.md',
            'AGENTS.md',
            'memory/memory-maintenance.js'
        ];
        
        let missingFiles = [];
        
        for (const file of requiredFiles) {
            const filePath = path.join(this.workspaceDir, file);
            try {
                await fs.access(filePath);
                console.log(`✅ ${file} 恢复成功`);
            } catch (error) {
                missingFiles.push(file);
                console.log(`❌ ${file} 恢复失败`);
            }
        }
        
        if (missingFiles.length === 0) {
            console.log('✅ 恢复验证通过');
            this.restoreLog.push('恢复验证: 通过');
        } else {
            console.log(`⚠️  缺失文件: ${missingFiles.join(', ')}`);
            this.restoreLog.push(`恢复验证: 失败，缺失 ${missingFiles.length} 个文件`);
        }
    }
    
    async generateRestoreReport() {
        console.log('\n📋 生成恢复报告...');
        
        const report = {
            restoreTime: new Date().toISOString(),
            backupSource: this.backupPath,
            restoreLog: this.restoreLog,
            instructions: [
                '恢复已完成，建议运行以下命令验证系统：',
                '1. node memory/memory-maintenance.js',
                '2. 检查记忆文件完整性',
                '3. 重启 OpenClaw 服务'
            ]
        };
        
        const reportFile = path.join(this.workspaceDir, 'RESTORE-REPORT.md');
        const reportContent = `# 工作空间恢复报告

## 恢复信息
- **恢复时间**: ${report.restoreTime}
- **备份来源**: ${report.backupSource}

## 恢复日志
${report.restoreLog.map(log => `- ${log}`).join('\n')}

## 后续步骤
${report.instructions.map(step => `1. ${step}`).join('\n')}

## 注意事项
- 如需回滚，请查看 safety-backups 目录中的恢复前备份
- 建议立即运行记忆维护脚本验证系统完整性
- 重要操作前请确保有最新备份

---
*恢复完成时间: ${new Date().toLocaleString('zh-CN')}*
`;
        
        await fs.writeFile(reportFile, reportContent, 'utf8');
        console.log('✅ 恢复报告已生成');
    }
    
    // 工具方法
    async copyDirectory(source, target) {
        await fs.mkdir(target, { recursive: true });
        
        const items = await fs.readdir(source, { withFileTypes: true });
        
        for (const item of items) {
            const sourcePath = path.join(source, item.name);
            const targetPath = path.join(target, item.name);
            
            if (item.isDirectory()) {
                await this.copyDirectory(sourcePath, targetPath);
            } else {
                await fs.copyFile(sourcePath, targetPath);
            }
        }
    }
    
    async directoryExists(dir) {
        try {
            await fs.access(dir);
            return true;
        } catch {
            return false;
        }
    }
}

// 使用示例
if (require.main === module) {
    console.log('📝 恢复脚本使用说明：');
    console.log('node restore-from-backup.js <备份目录路径>');
    console.log('\n示例：');
    console.log('node restore-from-backup.js system-backups/full-backup-2026-03-05T20-57-06-560Z');
    console.log('\n可用的备份目录：');
    
    const backupRoot = path.join(__dirname, '..', 'system-backups');
    fs.readdir(backupRoot, { withFileTypes: true })
        .then(items => {
            const backups = items.filter(item => item.isDirectory() && item.name.startsWith('full-backup-'));
            if (backups.length > 0) {
                backups.forEach(backup => {
                    console.log(`  📁 ${backup.name}`);
                });
            } else {
                console.log('  ℹ️ 未找到完整备份');
            }
        })
        .catch(() => {
            console.log('  ℹ️ 备份目录不存在');
        });
}

module.exports = BackupRestorer;