// 记忆维护脚本
// 功能：自动整理、备份、验证记忆系统

const fs = require('fs').promises;
const path = require('path');

class MemoryMaintenance {
    constructor() {
        this.memoryDir = path.join(__dirname, '..', 'memory');
        this.longTermMemory = path.join(__dirname, '..', 'MEMORY.md');
    }
    
    // 1. 检查记忆文件完整性
    async checkMemoryIntegrity() {
        console.log('🔍 检查记忆文件完整性...');
        
        const checks = [
            { file: this.longTermMemory, required: true, desc: '长期记忆文件' },
            { file: path.join(this.memoryDir, this.getTodayFile()), required: true, desc: '今日记忆文件' }
        ];
        
        for (const check of checks) {
            try {
                await fs.access(check.file);
                console.log(`✅ ${check.desc} 存在`);
            } catch (error) {
                if (check.required) {
                    console.log(`⚠️ ${check.desc} 缺失，正在创建...`);
                    await this.createMemoryFile(check.file, check.desc);
                } else {
                    console.log(`ℹ️ ${check.desc} 不存在（非必需）`);
                }
            }
        }
        
        // 检查最近7天的记忆文件
        await this.checkRecentMemoryFiles(7);
    }
    
    // 2. 创建记忆文件
    async createMemoryFile(filePath, description) {
        const defaultContent = description.includes('长期') 
            ? '# MEMORY.md - 长期记忆\n\n## 系统状态\n- **创建时间**: ' + new Date().toISOString() + '\n- **维护者**: 扎克\n\n## 重要事件时间线\n\n## 学习记录\n\n## 用户偏好\n\n---\n*长期记忆文件，记录重要信息和学习内容*'
            : `# ${path.basename(filePath, '.md')} 记忆记录\n\n## 日期: ${new Date().toLocaleDateString('zh-CN')}\n## 时间: ${new Date().toLocaleTimeString('zh-CN')}\n\n## 重要对话\n\n## 学习记录\n\n## 待办事项\n\n---\n*日常记忆记录*`;
        
        await fs.writeFile(filePath, defaultContent, 'utf8');
        console.log(`✅ 已创建 ${description}`);
    }
    
    // 3. 获取今日文件名
    getTodayFile() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.md`;
    }
    
    // 4. 检查近期记忆文件
    async checkRecentMemoryFiles(days) {
        console.log(`📅 检查最近${days}天的记忆文件...`);
        
        const files = await fs.readdir(this.memoryDir);
        const memoryFiles = files.filter(f => f.endsWith('.md') && f !== 'memory-maintenance.js');
        
        // 检查最近days天是否有缺失
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const expectedFile = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.md`;
            
            if (!memoryFiles.includes(expectedFile)) {
                console.log(`⚠️ 缺失记忆文件: ${expectedFile}`);
                // 可以选择自动创建，但暂时只记录
            }
        }
        
        console.log(`✅ 近期记忆文件检查完成，共发现 ${memoryFiles.length} 个记忆文件`);
    }
    
    // 5. 整理长期记忆
    async organizeLongTermMemory() {
        console.log('📚 整理长期记忆...');
        
        try {
            const content = await fs.readFile(this.longTermMemory, 'utf8');
            const lines = content.split('\n');
            
            // 简单的整理：确保结构完整
            const sections = ['系统状态', '重要事件时间线', '学习记录', '用户偏好'];
            let missingSections = [];
            
            for (const section of sections) {
                if (!content.includes(`## ${section}`)) {
                    missingSections.push(section);
                }
            }
            
            if (missingSections.length > 0) {
                console.log(`⚠️ 长期记忆缺少章节: ${missingSections.join(', ')}`);
                // 可以自动添加缺失章节
            } else {
                console.log('✅ 长期记忆结构完整');
            }
            
            // 检查文件大小
            const stats = await fs.stat(this.longTermMemory);
            console.log(`📊 长期记忆文件大小: ${(stats.size / 1024).toFixed(2)} KB`);
            
            if (stats.size > 100 * 1024) { // 超过100KB
                console.log('⚠️ 长期记忆文件较大，建议整理');
            }
            
        } catch (error) {
            console.error('❌ 整理长期记忆失败:', error.message);
        }
    }
    
    // 6. 备份记忆系统
    async backupMemory() {
        console.log('💾 备份记忆系统...');
        
        const backupDir = path.join(__dirname, '..', 'memory-backup');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `backup-${timestamp}`);
        
        try {
            await fs.mkdir(backupPath, { recursive: true });
            
            // 备份记忆目录
            const memoryFiles = await fs.readdir(this.memoryDir);
            for (const file of memoryFiles) {
                if (file.endsWith('.md') || file === 'memory-maintenance.js') {
                    const source = path.join(this.memoryDir, file);
                    const target = path.join(backupPath, file);
                    await fs.copyFile(source, target);
                }
            }
            
            // 备份长期记忆
            await fs.copyFile(this.longTermMemory, path.join(backupPath, 'MEMORY.md'));
            
            console.log(`✅ 记忆备份完成: ${backupPath}`);
            
            // 清理旧备份（保留最近7个）
            await this.cleanOldBackups(backupDir, 7);
            
        } catch (error) {
            console.error('❌ 备份失败:', error.message);
        }
    }
    
    // 7. 清理旧备份
    async cleanOldBackups(backupDir, keepCount) {
        try {
            const items = await fs.readdir(backupDir);
            const backups = items.filter(item => item.startsWith('backup-'));
            
            if (backups.length > keepCount) {
                backups.sort().reverse(); // 最新的在前面
                const toDelete = backups.slice(keepCount);
                
                for (const backup of toDelete) {
                    const backupPath = path.join(backupDir, backup);
                    await fs.rm(backupPath, { recursive: true, force: true });
                    console.log(`🗑️ 删除旧备份: ${backup}`);
                }
            }
        } catch (error) {
            console.error('清理备份失败:', error.message);
        }
    }
    
    // 8. 运行完整维护流程
    async runMaintenance() {
        console.log('🚀 开始记忆系统维护\n');
        console.log('='.repeat(50));
        
        await this.checkMemoryIntegrity();
        console.log('\n' + '-'.repeat(50));
        
        await this.organizeLongTermMemory();
        console.log('\n' + '-'.repeat(50));
        
        await this.backupMemory();
        console.log('\n' + '-'.repeat(50));
        
        console.log('\n🎉 记忆系统维护完成！');
        console.log('='.repeat(50));
    }
}

// 立即运行维护
if (require.main === module) {
    const maintenance = new MemoryMaintenance();
    maintenance.runMaintenance().catch(console.error);
}

module.exports = MemoryMaintenance;