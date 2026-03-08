// Node.js 高级特性学习项目
// 1. 异步编程进阶
// 2. 模块系统深入
// 3. 性能优化技巧

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

// 1. Promise 链式调用和错误处理
async function promiseChainExample() {
    console.log('=== Promise 链式调用示例 ===');
    
    try {
        // 创建目录
        await fs.mkdir('./test-data', { recursive: true });
        console.log('✓ 目录创建成功');
        
        // 写入文件
        await fs.writeFile('./test-data/sample.txt', 'Hello, Node.js Advanced Features!\n');
        console.log('✓ 文件写入成功');
        
        // 读取文件
        const content = await fs.readFile('./test-data/sample.txt', 'utf-8');
        console.log('✓ 文件读取成功:', content.trim());
        
        // 获取文件信息
        const stats = await fs.stat('./test-data/sample.txt');
        console.log('✓ 文件信息:', {
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
        });
        
        // 清理
        await fs.unlink('./test-data/sample.txt');
        await fs.rmdir('./test-data');
        console.log('✓ 清理完成');
        
    } catch (error) {
        console.error('❌ 错误:', error.message);
    }
}

// 2. EventEmitter 事件驱动编程
class DataProcessor extends EventEmitter {
    constructor() {
        super();
        this.data = [];
    }
    
    async processData(data) {
        console.log('\n=== EventEmitter 事件驱动示例 ===');
        
        this.emit('processingStart', { timestamp: new Date() });
        
        // 模拟数据处理
        for (let i = 0; i < data.length; i++) {
            const processed = await this.processItem(data[i]);
            this.data.push(processed);
            this.emit('itemProcessed', { 
                index: i, 
                item: processed,
                progress: ((i + 1) / data.length * 100).toFixed(1) + '%'
            });
        }
        
        this.emit('processingComplete', { 
            total: this.data.length,
            timestamp: new Date()
        });
        
        return this.data;
    }
    
    async processItem(item) {
        // 模拟异步处理
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    ...item,
                    processed: true,
                    timestamp: new Date().toISOString()
                });
            }, 100);
        });
    }
}

// 3. 流式处理示例
async function streamExample() {
    console.log('\n=== 流式处理示例 ===');
    
    const { Readable, Writable } = require('stream');
    
    // 创建可读流
    const readableStream = new Readable({
        read(size) {
            const data = ['数据块1', '数据块2', '数据块3', '数据块4'];
            data.forEach(chunk => {
                this.push(chunk);
            });
            this.push(null); // 结束流
        }
    });
    
    // 创建可写流
    const writableStream = new Writable({
        write(chunk, encoding, callback) {
            console.log('  处理数据块:', chunk.toString());
            callback();
        }
    });
    
    // 管道连接
    readableStream.pipe(writableStream);
    
    return new Promise(resolve => {
        writableStream.on('finish', () => {
            console.log('✓ 流式处理完成');
            resolve();
        });
    });
}

// 4. Worker Threads 多线程示例
async function workerThreadExample() {
    console.log('\n=== Worker Threads 多线程示例 ===');
    
    if (require('worker_threads').isMainThread) {
        const { Worker } = require('worker_threads');
        
        return new Promise((resolve, reject) => {
            const worker = new Worker(`
                const { parentPort } = require('worker_threads');
                
                // 模拟CPU密集型任务
                function fibonacci(n) {
                    if (n <= 1) return n;
                    return fibonacci(n - 1) + fibonacci(n - 2);
                }
                
                const result = fibonacci(35); // 计算斐波那契数列
                parentPort.postMessage({ result, threadId: require('worker_threads').threadId });
            `);
            
            worker.on('message', (message) => {
                console.log(`  工作线程 ${message.threadId} 计算结果: ${message.result}`);
                resolve();
            });
            
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        });
    }
}

// 主函数
async function main() {
    console.log('🚀 Node.js 高级特性学习开始\n');
    
    // 执行各个示例
    await promiseChainExample();
    
    const processor = new DataProcessor();
    
    // 监听事件
    processor.on('processingStart', (data) => {
        console.log(`  处理开始: ${data.timestamp.toLocaleTimeString()}`);
    });
    
    processor.on('itemProcessed', (data) => {
        console.log(`  处理进度: ${data.progress} - 项目 ${data.index + 1}`);
    });
    
    processor.on('processingComplete', (data) => {
        console.log(`  处理完成: 共处理 ${data.total} 个项目`);
    });
    
    const testData = [
        { id: 1, name: '项目A' },
        { id: 2, name: '项目B' },
        { id: 3, name: '项目C' },
        { id: 4, name: '项目D' },
        { id: 5, name: '项目E' }
    ];
    
    await processor.processData(testData);
    await streamExample();
    await workerThreadExample();
    
    console.log('\n🎉 Node.js 高级特性学习完成！');
}

// 运行主函数
main().catch(console.error);