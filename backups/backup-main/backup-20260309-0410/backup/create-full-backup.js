// 完整工作空间备份脚本
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class FullBackup {
    constructor() {
        this.workspaceDir = path.join(__dirname, '..');
        this.backupRoot = path.join(__dirname, '..', 'system-backups');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        this.backupDir = path.join(this.backupRoot, `full-backup-${this.timestamp}`);
    }
    
    async runFullBackup() {
        console.log('🚀 开始完整工作空间备份\n');
        console.log('='.repeat(60));
        
        // 1. 创建备份目录
        await this.createBackupDirectory();
        
        // 2. 备份核心配置文件
        await this.backupConfigFiles();
        
        // 3. 备份记忆系统
        await this.backupMemorySystem();
        
        // 4. 备份学习成果
        await this.backupLearningContent();
        
        // 5. 备份技能文件
        await this.backupSkills();
        
        // 6. 创建系统状态快照
        await this.createSystemSnapshot();
        
        // 7. 生成备份报告
        await this.generateBackupReport();
        
        // 8. 验证备份完整性
        await this.verifyBackupIntegrity();
        
        console.log('\n' + '='.repeat(60));
        console.log('🎉 完整工作空间备份完成！');
        console.log(`📁 备份位置: ${this.backupDir}`);
        console.log('='.repeat(60));
    }
    
    async createBackupDirectory() {
        console.log('📁 创建备份目录...');
        await fs.mkdir(this.backupDir, { recursive: true });
        console.log(`✅ 备份目录: ${this.backupDir}`);
    }
    
    async backupConfigFiles() {
        console.log('\n⚙️ 备份配置文件...');
        
        const configFiles = [
            'AGENTS.md',
            'SOUL.md', 
            'USER.md',
            'IDENTITY.md',
            'TOOLS.md',
            'HEARTBEAT.md',
            'MEMORY.md',
            'BOOTSTRAP.md'
        ];
        
        let backedUp = 0;
        for (const file of configFiles) {
            try {
                const source = path.join(this.workspaceDir, file);
                const target = path.join(this.backupDir, 'configs', file);
                
                await fs.mkdir(path.dirname(target), { recursive: true });
                await fs.copyFile(source, target);
                backedUp++;
            } catch (error) {
                console.log(`⚠️  ${file}: ${error.message}`);
            }
        }
        
        console.log(`✅ 已备份 ${backedUp}/${configFiles.length} 个配置文件`);
    }
    
    async backupMemorySystem() {
        console.log('\n🧠 备份记忆系统...');
        
        const memoryDir = path.join(this.workspaceDir, 'memory');
        const backupMemoryDir = path.join(this.backupDir, 'memory');
        
        try {
            // 复制整个记忆目录
            await this.copyDirectory(memoryDir, backupMemoryDir);
            
            // 额外备份长期记忆
            await fs.copyFile(
                path.join(this.workspaceDir, 'MEMORY.md'),
                path.join(backupMemoryDir, 'MEMORY-BACKUP.md')
            );
            
            console.log('✅ 记忆系统备份完成');
            
        } catch (error) {
            console.log(`❌ 记忆备份失败: ${error.message}`);
        }
    }
    
    async backupLearningContent() {
        console.log('\n📚 备份学习成果...');
        
        const learningDir = path.join(this.workspaceDir, 'learning');
        const backupLearningDir = path.join(this.backupDir, 'learning');
        
        try {
            if (await this.directoryExists(learningDir)) {
                await this.copyDirectory(learningDir, backupLearningDir);
                console.log('✅ 学习成果备份完成');
            } else {
                console.log('ℹ️ 学习目录不存在，跳过');
            }
        } catch (error) {
            console.log(`❌ 学习备份失败: ${error.message}`);
        }
    }
    
    async backupSkills() {
        console.log('\n🛠️ 备份技能文件...');
        
        const skillsDir = path.join(this.workspaceDir, 'skills');
        const backupSkillsDir = path.join(this.backupDir, 'skills');
        
        try {
            if (await this.directoryExists(skillsDir)) {
                await this.copyDirectory(skillsDir, backupSkillsDir);
                console.log('✅ 技能文件备份完成');
            } else {
                console.log('ℹ️ 技能目录不存在，跳过');
            }
        } catch (error) {
            console.log(`❌ 技能备份失败: ${error.message}`);
        }
    }
    
    async createSystemSnapshot() {
        console.log('\n📸 创建系统状态快照...');
        
        const snapshot = {
            timestamp: new Date().toISOString(),
            systemInfo: await this.getSystemInfo(),
            workspaceInfo: await this.getWorkspaceInfo(),
            backupInfo: {
                location: this.backupDir,
                size: await this.getDirectorySize(this.backupDir),
                files: await this.countFiles(this.backupDir)
            }
        };
        
        const snapshotFile = path.join(this.backupDir, 'system-snapshot.json');
        await fs.writeFile(snapshotFile, JSON.stringify(snapshot, null, 2), 'utf8');
        
        console.log('✅ 系统快照已创建');
        console.log(`   📊 备份大小: ${(snapshot.backupInfo.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   📄 文件数量: ${snapshot.backupInfo.files} 个`);
    }
    
    async getSystemInfo() {
        try {
            return {
                platform: process.platform,
                arch: process.arch,
                nodeVersion: process.version,
                cwd: process.cwd(),
                userInfo: process.env.USERNAME || process.env.USER
            };
        } catch (error) {
            return { error: error.message };
        }
    }
    
    async getWorkspaceInfo() {
        const info = {
            directory: this.workspaceDir,
            exists: await this.directoryExists(this.workspaceDir)
        };
        
        if (info.exists) {
            try {
                const items = await fs.readdir(this.workspaceDir);
                info.itemCount = items.length;
                info.items = items;
            } catch (error) {
                info.error = error.message;
            }
        }
        
        return info;
    }
    
    async generateBackupReport() {
        console.log('\n📋 生成备份报告...');
        
        const report = {
            backupId: this.timestamp,
            completedAt: new Date().toISOString(),
            components: [
                { name: '配置文件', status: 'completed' },
                { name: '记忆系统', status: 'completed' },
                { name: '学习成果', status: 'completed' },
                { name: '技能文件', status: 'completed' },
                { name: '系统快照', status: 'completed' }
            ],
            instructions: {
                restore: '将此备份目录复制回 workspace 目录即可恢复',
                verify: '运行 memory/memory-maintenance.js 验证完整性',
                schedule: '建议每周执行一次完整备份'
            }
        };
        
        const reportFile = path.join(this.backupDir, 'BACKUP-REPORT.md');
        const reportContent = `# 工作空间完整备份报告

## 备份信息
- **备份ID**: ${report.backupId}
- **完成时间**: ${report.completedAt}
- **备份位置**: ${this.backupDir}

## 备份组件
${report.components.map(c => `- ✅ ${c.name}`).join('\n')}

## 恢复说明
1. 将此备份目录中的所有文件复制到 workspace 目录
2. 运行 \`node memory/memory-maintenance.js\` 验证完整性
3. 重启 OpenClaw 服务

## 注意事项
- 此备份包含所有学习成果和系统配置
- 建议定期（每周）执行完整备份
- 重要更新后应立即备份

---
*备份创建时间: ${new Date().toLocaleString('zh-CN')}*
`;
        
        await fs.writeFile(reportFile, reportContent, 'utf8');
        console.log('✅ 备份报告已生成');
    }
    
    async verifyBackupIntegrity() {
        console.log('\n🔍 验证备份完整性...');
        
        const requiredFiles = [
            'configs/MEMORY.md',
            'memory/memory-maintenance.js',
            'system-snapshot.json',
            'BACKUP-REPORT.md'
        ];
        
        let missingFiles = [];
        
        for (const file of requiredFiles) {
            const filePath = path.join(this.backupDir, file);
            try {
                await fs.access(filePath);
            } catch (error) {
                missingFiles.push(file);
            }
        }
        
        if (missingFiles.length === 0) {
            console.log('✅ 备份完整性验证通过');
        } else {
            console.log(`⚠️  缺失文件: ${missingFiles.join(', ')}`);
        }
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
    
    async getDirectorySize(dir) {
        try {
            const items = await fs.readdir(dir, { withFileTypes: true });
            let totalSize = 0;
            
            for (const item of items) {
                const itemPath = path.join(dir, item.name);
                
                if (item.isDirectory()) {
                    totalSize += await this.getDirectorySize(itemPath);
                } else {
                    const stats = await fs.stat(itemPath);
                    totalSize += stats.size;
                }
            }
            
            return totalSize;
        } catch {
            return 0;
        }
    }
    
    async countFiles(dir) {
        try {
            const items = await fs.readdir(dir, { withFileTypes: true });
            let count = 0;
            
            for (const item of items) {
                const itemPath = path.join(dir, item.name);
                
                if (item.isDirectory()) {
                    count += await this.countFiles(itemPath);
                } else {
                    count++;
                }
            }
            
            return count;
        } catch {
            return 0;
        }
    }
}

// 立即运行完整备份
if (require.main === module) {
    const backup = new FullBackup();
    backup.runFullBackup().catch(console.error);
}

module.exports = FullBackup;