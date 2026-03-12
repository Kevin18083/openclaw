// 学习成果自动保存机制
// 在每次学习完成后自动保存到记忆系统

const fs = require('fs').promises;
const path = require('path');

class LearningAutoSave {
    constructor() {
        this.learningDir = path.join(__dirname, '..', 'learning');
        this.memoryDir = path.join(__dirname, '..', 'memory');
        this.longTermMemory = path.join(__dirname, '..', 'MEMORY.md');
    }
    
    // 保存学习阶段成果
    async saveLearningStage(stageName, content, summary) {
        console.log(`💾 保存学习阶段: ${stageName}`);
        
        const timestamp = new Date().toISOString();
        const todayFile = this.getTodayFile();
        
        // 1. 保存到今日记忆
        const memoryEntry = `
## 学习阶段: ${stageName}
- **时间**: ${new Date().toLocaleString('zh-CN')}
- **内容**: ${content}
- **总结**: ${summary}
- **状态**: ✅ 完成

`;
        
        await this.appendToFile(path.join(this.memoryDir, todayFile), memoryEntry);
        
        // 2. 更新长期记忆
        const longTermEntry = `
### ${timestamp.split('T')[0]} - ${stageName}
${summary}

`;
        
        await this.appendToSection(this.longTermMemory, '学习记录', longTermEntry);
        
        // 3. 创建学习成果备份
        await this.createLearningBackup(stageName, { content, summary, timestamp });
        
        console.log(`✅ 学习阶段 "${stageName}" 已保存到记忆系统`);
    }
    
    // 获取今日文件名
    getTodayFile() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.md`;
    }
    
    // 追加内容到文件
    async appendToFile(filePath, content) {
        try {
            await fs.appendFile(filePath, content, 'utf8');
        } catch (error) {
            // 如果文件不存在，先创建
            await fs.writeFile(filePath, `# ${path.basename(filePath, '.md')} 记忆记录\n\n${content}`, 'utf8');
        }
    }
    
    // 追加内容到特定章节
    async appendToSection(filePath, sectionName, content) {
        try {
            let fileContent = await fs.readFile(filePath, 'utf8');
            
            // 查找章节位置
            const sectionIndex = fileContent.indexOf(`## ${sectionName}`);
            if (sectionIndex === -1) {
                // 如果章节不存在，添加到文件末尾
                fileContent += `\n## ${sectionName}\n${content}`;
            } else {
                // 找到章节结束位置（下一个##或文件结束）
                let endIndex = fileContent.indexOf('\n## ', sectionIndex + 1);
                if (endIndex === -1) {
                    endIndex = fileContent.length;
                }
                
                // 在章节内容后插入
                const before = fileContent.substring(0, endIndex);
                const after = fileContent.substring(endIndex);
                fileContent = before + content + after;
            }
            
            await fs.writeFile(filePath, fileContent, 'utf8');
        } catch (error) {
            console.error(`❌ 更新章节失败: ${error.message}`);
        }
    }
    
    // 创建学习备份
    async createLearningBackup(stageName, data) {
        const backupDir = path.join(this.learningDir, 'backups');
        const safeName = stageName.replace(/[^a-zA-Z0-9]/g, '-');
        const backupFile = path.join(backupDir, `${safeName}-${Date.now()}.json`);
        
        try {
            await fs.mkdir(backupDir, { recursive: true });
            await fs.writeFile(backupFile, JSON.stringify(data, null, 2), 'utf8');
            console.log(`📦 学习备份已创建: ${backupFile}`);
        } catch (error) {
            console.error(`❌ 创建备份失败: ${error.message}`);
        }
    }
    
    // 扫描学习目录，确保所有学习内容都有记录
    async scanLearningDirectory() {
        console.log('🔍 扫描学习目录...');
        
        try {
            const items = await fs.readdir(this.learningDir, { withFileTypes: true });
            const learningItems = items.filter(item => 
                item.isDirectory() || 
                (item.isFile() && (item.name.endsWith('.js') || item.name.endsWith('.jsx') || item.name.endsWith('.md')))
            );
            
            console.log(`📁 发现 ${learningItems.length} 个学习项目`);
            
            // 创建学习目录索引
            const index = {
                scanTime: new Date().toISOString(),
                totalItems: learningItems.length,
                items: []
            };
            
            for (const item of learningItems) {
                const itemPath = path.join(this.learningDir, item.name);
                const stats = await fs.stat(itemPath);
                
                index.items.push({
                    name: item.name,
                    type: item.isDirectory() ? 'directory' : 'file',
                    size: stats.size,
                    modified: stats.mtime,
                    path: itemPath
                });
            }
            
            // 保存索引
            const indexFile = path.join(this.learningDir, 'learning-index.json');
            await fs.writeFile(indexFile, JSON.stringify(index, null, 2), 'utf8');
            
            console.log(`✅ 学习目录扫描完成，索引已保存`);
            
        } catch (error) {
            console.error(`❌ 扫描学习目录失败: ${error.message}`);
        }
    }
}

// 使用示例
if (require.main === module) {
    const autoSave = new LearningAutoSave();
    
    // 示例：保存一个学习阶段
    autoSave.saveLearningStage(
        'React基础学习',
        '学习了React组件化、状态管理、Hooks、生命周期等核心概念',
        '掌握了React框架的核心思想，能够构建组件化的前端应用'
    ).then(() => {
        console.log('🎉 示例保存完成');
        return autoSave.scanLearningDirectory();
    }).catch(console.error);
}

module.exports = LearningAutoSave;