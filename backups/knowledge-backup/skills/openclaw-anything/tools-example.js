/**
 * OpenClaw Anything - 工具示例
 * 演示多功能工具集的基本用法
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

/**
 * 文件工具类
 */
class FileTools {
  /**
   * 获取文件信息
   */
  static async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return {
        path: filePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isDirectory: stats.isDirectory(),
        isFile: stats.isFile()
      };
    } catch (error) {
      console.error(`获取文件信息失败: ${filePath}`, error.message);
      throw error;
    }
  }

  /**
   * 批量列出目录中的文件
   */
  static async listFiles(directory, options = {}) {
    const {
      recursive = false,
      filter = null,
      sortBy = 'name'
    } = options;

    try {
      const files = await fs.readdir(directory);
      const fileList = [];

      for (const file of files) {
        const fullPath = path.join(directory, file);
        const info = await this.getFileInfo(fullPath);

        // 应用过滤器
        if (filter && !filter(info)) {
          continue;
        }

        fileList.push(info);

        // 递归处理子目录
        if (recursive && info.isDirectory) {
          const subFiles = await this.listFiles(fullPath, options);
          fileList.push(...subFiles);
        }
      }

      // 排序
      fileList.sort((a, b) => {
        if (sortBy === 'name') return a.path.localeCompare(b.path);
        if (sortBy === 'size') return b.size - a.size;
        if (sortBy === 'modified') return b.modified - a.modified;
        return 0;
      });

      return fileList;
    } catch (error) {
      console.error(`列出文件失败: ${directory}`, error.message);
      throw error;
    }
  }

  /**
   * 批量重命名文件
   */
  static async batchRename(directory, pattern, startIndex = 1) {
    try {
      const files = await this.listFiles(directory, { recursive: false });
      const results = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.isFile) continue;

        const ext = path.extname(file.path);
        const newName = pattern.replace('{index}', startIndex + i);
        const newPath = path.join(directory, newName + ext);

        await fs.rename(file.path, newPath);
        results.push({
          original: file.path,
          new: newPath,
          success: true
        });
      }

      return results;
    } catch (error) {
      console.error('批量重命名失败:', error.message);
      throw error;
    }
  }
}

/**
 * 系统工具类
 */
class SystemTools {
  /**
   * 获取系统信息
   */
  static getSystemInfo() {
    return {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: Math.round(os.totalmem() / (1024 * 1024)), // MB
      freeMemory: Math.round(os.freemem() / (1024 * 1024)), // MB
      uptime: os.uptime(),
      hostname: os.hostname(),
      userInfo: os.userInfo(),
      networkInterfaces: os.networkInterfaces()
    };
  }

  /**
   * 监控系统资源
   */
  static monitorResources(interval = 5000) {
    const monitor = {
      data: [],
      intervalId: null,
      
      start() {
        console.log('开始监控系统资源...');
        this.intervalId = setInterval(() => {
          const info = this.getCurrentMetrics();
          this.data.push({
            timestamp: new Date().toISOString(),
            ...info
          });
          console.log(`CPU负载: ${info.cpuLoad}%, 内存使用: ${info.memoryUsage}%`);
        }, interval);
      },
      
      stop() {
        if (this.intervalId) {
          clearInterval(this.intervalId);
          console.log('停止监控系统资源');
        }
      },
      
      getCurrentMetrics() {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        
        // 简单CPU负载估算（实际需要更复杂的计算）
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;
        
        cpus.forEach(cpu => {
          for (const type in cpu.times) {
            totalTick += cpu.times[type];
          }
          totalIdle += cpu.times.idle;
        });
        
        const cpuLoad = 100 - Math.round((totalIdle / totalTick) * 100);
        const memoryUsage = Math.round((usedMem / totalMem) * 100);
        
        return {
          cpuLoad,
          memoryUsage,
          freeMemory: Math.round(freeMem / (1024 * 1024))
        };
      },
      
      getReport() {
        return {
          samples: this.data.length,
          averageCpu: this.data.reduce((sum, d) => sum + d.cpuLoad, 0) / this.data.length,
          averageMemory: this.data.reduce((sum, d) => sum + d.memoryUsage, 0) / this.data.length,
          data: this.data
        };
      }
    };
    
    return monitor;
  }
}

/**
 * 网络工具类（简化版）
 */
class NetworkTools {
  /**
   * 检查网络连接
   */
  static async checkConnectivity(host = '8.8.8.8', port = 53) {
    return new Promise((resolve) => {
      const net = require('net');
      const socket = new net.Socket();
      
      socket.setTimeout(3000);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve({ host, port, connected: true, latency: Date.now() - startTime });
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve({ host, port, connected: false, error: '连接超时' });
      });
      
      socket.on('error', (err) => {
        resolve({ host, port, connected: false, error: err.message });
      });
      
      const startTime = Date.now();
      socket.connect(port, host);
    });
  }

  /**
   * 获取公共IP地址（通过外部服务）
   */
  static async getPublicIP() {
    try {
      const https = require('https');
      
      return new Promise((resolve, reject) => {
        const req = https.get('https://api.ipify.org?format=json', (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            try {
              const result = JSON.parse(data);
              resolve(result.ip);
            } catch (error) {
              reject(new Error('解析IP地址失败'));
            }
          });
        });
        
        req.on('error', (error) => {
          reject(error);
        });
        
        req.setTimeout(5000, () => {
          req.destroy();
          reject(new Error('请求超时'));
        });
      });
    } catch (error) {
      console.error('获取公共IP失败:', error.message);
      return null;
    }
  }
}

/**
 * 主工具集
 */
class OpenClawAnything {
  constructor() {
    this.fileTools = FileTools;
    this.systemTools = SystemTools;
    this.networkTools = NetworkTools;
  }

  /**
   * 运行系统诊断
   */
  async runDiagnostics() {
    console.log('=== 系统诊断开始 ===\n');
    
    // 系统信息
    const systemInfo = this.systemTools.getSystemInfo();
    console.log('系统信息:');
    console.log(`- 平台: ${systemInfo.platform} ${systemInfo.arch}`);
    console.log(`- CPU核心: ${systemInfo.cpus}`);
    console.log(`- 总内存: ${systemInfo.totalMemory} MB`);
    console.log(`- 可用内存: ${systemInfo.freeMemory} MB`);
    console.log(`- 运行时间: ${Math.round(systemInfo.uptime / 60)} 分钟`);
    
    // 网络连接
    console.log('\n网络检查:');
    const connectivity = await this.networkTools.checkConnectivity();
    console.log(`- Google DNS连接: ${connectivity.connected ? '正常' : '失败'}`);
    if (connectivity.latency) {
      console.log(`- 延迟: ${connectivity.latency}ms`);
    }
    
    // 公共IP
    try {
      const publicIP = await this.networkTools.getPublicIP();
      if (publicIP) {
        console.log(`- 公共IP地址: ${publicIP}`);
      }
    } catch (error) {
      console.log(`- 公共IP获取失败: ${error.message}`);
    }
    
    // 当前目录文件
    console.log('\n当前目录文件统计:');
    try {
      const files = await this.fileTools.listFiles('.', { recursive: false });
      const fileCount = files.filter(f => f.isFile).length;
      const dirCount = files.filter(f => f.isDirectory).length;
      console.log(`- 文件数: ${fileCount}`);
      console.log(`- 目录数: ${dirCount}`);
      console.log(`- 总大小: ${files.reduce((sum, f) => sum + f.size, 0)} 字节`);
    } catch (error) {
      console.log(`- 文件统计失败: ${error.message}`);
    }
    
    console.log('\n=== 系统诊断完成 ===');
    
    return {
      systemInfo,
      connectivity,
      timestamp: new Date().toISOString()
    };
  }
}

// 导出工具
module.exports = {
  FileTools,
  SystemTools,
  NetworkTools,
  OpenClawAnything
};

// 如果直接运行此文件
if (require.main === module) {
  (async () => {
    try {
      const tools = new OpenClawAnything();
      
      // 根据命令行参数执行不同功能
      const args = process.argv.slice(2);
      
      if (args.includes('--diagnose') || args.length === 0) {
        // 运行系统诊断
        await tools.runDiagnostics();
      } else if (args.includes('--monitor')) {
        // 启动资源监控
        const monitor = tools.systemTools.monitorResources(3000);
        monitor.start();
        
        // 10秒后停止并显示报告
        setTimeout(() => {
          monitor.stop();
          const report = monitor.getReport();
          console.log('\n=== 监控报告 ===');
          console.log(`监控时长: ${report.samples * 3} 秒`);
          console.log(`平均CPU负载: ${report.averageCpu.toFixed(1)}%`);
          console.log(`平均内存使用: ${report.averageMemory.toFixed(1)}%`);
        }, 10000);
      } else if (args.includes('--list-files')) {
        // 列出文件
        const directory = args[1] || '.';
        const files = await tools.fileTools.listFiles(directory);
        console.log(`目录 "${directory}" 中的文件:`);
        files.forEach((file, i) => {
          console.log(`${i + 1}. ${path.basename(file.path)} (${file.isDirectory ? '目录' : '文件'}, ${file.size} 字节)`);
        });
      } else {
        console.log('可用命令:');
        console.log('  --diagnose     运行系统诊断');
        console.log('  --monitor      监控系统资源（10秒）');
        console.log('  --list-files [目录]  列出文件');
      }
      
    } catch (error) {
      console.error('工具执行失败:', error.message);
    }
  })();
}