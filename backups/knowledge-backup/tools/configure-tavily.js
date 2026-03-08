/**
 * Tavily API 配置向导
 * 帮助用户快速配置Tavily搜索API
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class TavilyConfigWizard {
    constructor() {
        this.configFile = path.join(__dirname, '../config/tavily-config.json');
        this.envFile = path.join(__dirname, '../.env');
        this.setupDirectories();
    }
    
    setupDirectories() {
        const dirs = [
            path.join(__dirname, '../config'),
            path.join(__dirname, '../tools'),
            path.join(__dirname, '../logs')
        ];
        
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`✅ 创建目录: ${dir}`);
            }
        });
    }
    
    async startWizard() {
        console.log('🚀 Tavily API 配置向导');
        console.log('='.repeat(50));
        
        // 检查当前配置
        const currentConfig = this.loadCurrentConfig();
        
        if (currentConfig.apiKey) {
            console.log(`📋 当前配置:`);
            console.log(`   API密钥: ${this.maskApiKey(currentConfig.apiKey)}`);
            console.log(`   配置文件: ${this.configFile}`);
            
            const { action } = await this.askQuestion(
                '检测到已有配置，要做什么？\n' +
                '1. 查看当前配置\n' +
                '2. 更新API密钥\n' +
                '3. 测试连接\n' +
                '4. 退出\n' +
                '请选择 (1-4): '
            );
            
            switch (action) {
                case '1':
                    await this.showCurrentConfig();
                    break;
                case '2':
                    await this.updateApiKey();
                    break;
                case '3':
                    await this.testConnection();
                    break;
                default:
                    console.log('👋 退出配置向导');
                    return;
            }
        } else {
            console.log('⚠️ 未检测到Tavily API配置');
            await this.setupNewConfig();
        }
    }
    
    loadCurrentConfig() {
        if (fs.existsSync(this.configFile)) {
            try {
                return JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
            } catch (error) {
                console.error('❌ 配置文件读取失败:', error.message);
            }
        }
        
        // 检查环境变量
        const envKey = process.env.TAVILY_API_KEY;
        if (envKey) {
            console.log('✅ 检测到环境变量中的API密钥');
            return { apiKey: envKey, source: 'environment' };
        }
        
        return {};
    }
    
    maskApiKey(apiKey) {
        if (!apiKey || apiKey.length < 8) return '***';
        return apiKey.substring(0, 4) + '***' + apiKey.substring(apiKey.length - 4);
    }
    
    async askQuestion(question) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                resolve({ action: answer.trim() });
            });
        });
    }
    
    async askForApiKey() {
        console.log('\n📝 请输入Tavily API密钥:');
        console.log('   (获取地址: https://tavily.com)');
        console.log('   (输入"skip"跳过，输入"exit"退出)');
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        return new Promise((resolve) => {
            rl.question('API密钥: ', (apiKey) => {
                rl.close();
                resolve(apiKey.trim());
            });
        });
    }
    
    async setupNewConfig() {
        console.log('\n🎯 开始新配置');
        
        // 询问API密钥
        const apiKey = await this.askForApiKey();
        
        if (apiKey.toLowerCase() === 'exit') {
            console.log('👋 退出配置');
            return;
        }
        
        if (apiKey.toLowerCase() === 'skip') {
            console.log('⏭️ 跳过API密钥配置，使用模拟模式');
            this.saveConfig({ apiKey: '', useMock: true });
            return;
        }
        
        if (!apiKey) {
            console.log('❌ API密钥不能为空');
            return await this.setupNewConfig();
        }
        
        // 验证API密钥格式（简单验证）
        if (apiKey.length < 20) {
            console.log('⚠️ API密钥格式可能不正确，请确认');
            const confirm = await this.askQuestion('是否继续？(y/n): ');
            if (confirm.action.toLowerCase() !== 'y') {
                return await this.setupNewConfig();
            }
        }
        
        // 选择存储方式
        console.log('\n💾 选择存储方式:');
        console.log('1. 配置文件 (推荐)');
        console.log('2. 环境变量');
        console.log('3. 两者都保存');
        
        const storageChoice = await this.askQuestion('请选择 (1-3): ');
        
        const config = {
            apiKey: apiKey,
            timeout: 30000,
            maxRetries: 3,
            cacheEnabled: true,
            maxResults: 10
        };
        
        switch (storageChoice.action) {
            case '1':
                this.saveConfig(config);
                break;
            case '2':
                this.saveToEnvironment(apiKey);
                break;
            case '3':
                this.saveConfig(config);
                this.saveToEnvironment(apiKey);
                break;
            default:
                console.log('⚠️ 无效选择，使用配置文件');
                this.saveConfig(config);
        }
        
        // 测试连接
        console.log('\n🔗 测试API连接...');
        await this.testConnectionWithKey(apiKey);
    }
    
    async updateApiKey() {
        console.log('\n🔄 更新API密钥');
        
        const newApiKey = await this.askForApiKey();
        
        if (newApiKey.toLowerCase() === 'exit') {
            console.log('👋 退出');
            return;
        }
        
        if (newApiKey.toLowerCase() === 'skip') {
            console.log('⏭️ 跳过更新');
            return;
        }
        
        // 加载现有配置
        const currentConfig = this.loadCurrentConfig();
        currentConfig.apiKey = newApiKey;
        
        this.saveConfig(currentConfig);
        
        console.log('✅ API密钥已更新');
        console.log(`   新密钥: ${this.maskApiKey(newApiKey)}`);
        
        // 测试新密钥
        await this.testConnectionWithKey(newApiKey);
    }
    
    saveConfig(config) {
        try {
            fs.writeFileSync(
                this.configFile,
                JSON.stringify(config, null, 2),
                'utf8'
            );
            console.log(`✅ 配置已保存到: ${this.configFile}`);
            
            // 创建备份
            const backupFile = this.configFile + '.backup-' + 
                new Date().toISOString().replace(/[:.]/g, '-');
            fs.writeFileSync(backupFile, JSON.stringify(config, null, 2), 'utf8');
            console.log(`📦 配置备份: ${backupFile}`);
            
        } catch (error) {
            console.error('❌ 配置保存失败:', error.message);
        }
    }
    
    saveToEnvironment(apiKey) {
        try {
            // 更新 .env 文件
            let envContent = '';
            if (fs.existsSync(this.envFile)) {
                envContent = fs.readFileSync(this.envFile, 'utf8');
                
                // 移除旧的TAVILY_API_KEY设置
                const lines = envContent.split('\n').filter(line => {
                    return !line.trim().startsWith('TAVILY_API_KEY=');
                });
                envContent = lines.join('\n');
            }
            
            // 添加新的设置
            envContent += `\nTAVILY_API_KEY=${apiKey}\n`;
            
            fs.writeFileSync(this.envFile, envContent.trim() + '\n', 'utf8');
            console.log(`✅ 环境变量已保存到: ${this.envFile}`);
            
            console.log('\n⚠️ 注意: 环境变量需要重新启动终端或应用才能生效');
            console.log('   或者运行:');
            console.log(`   set TAVILY_API_KEY=${this.maskApiKey(apiKey)} (CMD)`);
            console.log(`   $env:TAVILY_API_KEY="${apiKey}" (PowerShell)`);
            
        } catch (error) {
            console.error('❌ 环境变量保存失败:', error.message);
        }
    }
    
    async testConnection() {
        const currentConfig = this.loadCurrentConfig();
        
        if (!currentConfig.apiKey) {
            console.log('❌ 未配置API密钥，无法测试');
            return;
        }
        
        await this.testConnectionWithKey(currentConfig.apiKey);
    }
    
    async testConnectionWithKey(apiKey) {
        console.log('\n🔗 测试Tavily API连接...');
        
        try {
            // 检查是否安装了 @tavily/core
            let tavily;
            try {
                tavily = require('@tavily/core');
                console.log('✅ @tavily/core 包已安装');
            } catch (error) {
                console.log('❌ @tavily/core 包未安装');
                console.log('   请运行: npm install @tavily/core');
                return;
            }
            
            // 创建客户端
            const client = new tavily.TavilyClient({ apiKey });
            
            // 简单测试查询
            console.log('📡 发送测试查询...');
            const result = await client.search({
                query: 'test',
                maxResults: 1,
                searchDepth: 'basic'
            });
            
            console.log('✅ API连接成功!');
            console.log(`   响应时间: ${result.responseTime}ms`);
            console.log(`   结果数量: ${result.results.length}`);
            
            if (result.results.length > 0) {
                console.log(`   示例结果: ${result.results[0].title.substring(0, 50)}...`);
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ API连接测试失败:', error.message);
            
            if (error.message.includes('API key')) {
                console.log('⚠️ 可能原因:');
                console.log('   1. API密钥无效或已过期');
                console.log('   2. 账户未激活或额度不足');
                console.log('   3. 网络连接问题');
                console.log('   建议: 检查Tavily账户状态');
            }
            
            return false;
        }
    }
    
    async showCurrentConfig() {
        const config = this.loadCurrentConfig();
        
        console.log('\n📋 当前配置详情:');
        console.log('='.repeat(40));
        
        if (config.apiKey) {
            console.log(`🔑 API密钥: ${this.maskApiKey(config.apiKey)}`);
            console.log(`📁 来源: ${config.source || '配置文件'}`);
        } else {
            console.log('🔑 API密钥: 未配置');
        }
        
        console.log(`⏱️  超时时间: ${config.timeout || 30000}ms`);
        console.log(`🔄 最大重试: ${config.maxRetries || 3}`);
        console.log(`💾 缓存启用: ${config.cacheEnabled !== false ? '是' : '否'}`);
        console.log(`📊 最大结果: ${config.maxResults || 10}`);
        
        // 检查环境变量
        if (process.env.TAVILY_API_KEY) {
            console.log(`🌐 环境变量: 已设置 (${this.maskApiKey(process.env.TAVILY_API_KEY)})`);
        } else {
            console.log('🌐 环境变量: 未设置');
        }
        
        console.log('='.repeat(40));
        
        // 检查文件权限
        console.log('\n📁 文件状态:');
        console.log(`   配置文件: ${fs.existsSync(this.configFile) ? '✅ 存在' : '❌ 不存在'}`);
        console.log(`   环境文件: ${fs.existsSync(this.envFile) ? '✅ 存在' : '❌ 不存在'}`);
        
        // 检查npm包
        try {
            require.resolve('@tavily/core');
            console.log('📦 @tavily/core: ✅ 已安装');
        } catch {
            console.log('📦 @tavily/core: ❌ 未安装');
        }
    }
    
    showHelp() {
        console.log('\n📚 帮助信息:');
        console.log('='.repeat(40));
        console.log('Tavily API 配置说明:');
        console.log('1. 注册账户: https://tavily.com');
        console.log('2. 获取API密钥');
        console.log('3. 运行此向导完成配置');
        console.log('4. 安装依赖: npm install @tavily/core');
        console.log('5. 测试连接');
        console.log('');
        console.log('💡 提示:');
        console.log('• 配置完成后，工具会自动使用真实搜索数据');
        console.log('• 未配置时使用模拟数据，功能受限');
        console.log('• 建议定期检查API使用量和额度');
        console.log('='.repeat(40));
    }
}

// 主程序
if (require.main === module) {
    const wizard = new TavilyConfigWizard();
    
    console.log('🚀 Tavily API 配置向导');
    console.log('='.repeat(50));
    
    // 显示帮助
    wizard.showHelp();
    
    // 开始配置
    wizard.startWizard().then(() => {
        console.log('\n🎉 配置向导完成');
        console.log('\n🚀 下一步:');
        console.log('   1. 如果未安装依赖: npm install @tavily/core');
        console.log('   2. 测试搜索工具: node tools/tavily-search-tool.js');
        console.log('   3. 开始使用Tavily搜索!');
        
        process.exit(0);
    }).catch(error => {
        console.error('❌ 配置过程出错:', error);
        process.exit(1);
    });
}

module.exports = TavilyConfigWizard;