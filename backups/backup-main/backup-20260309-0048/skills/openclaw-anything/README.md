# OpenClaw Anything

多功能工具集，为OpenClaw提供各种实用工具和功能。

## 功能概述

OpenClaw Anything 是一个综合工具集，包含以下主要功能：

### 核心模块
1. **文件处理工具** - 文件操作、格式转换、批量处理
2. **系统管理工具** - 系统监控、资源管理、进程控制
3. **网络工具** - 网络检查、API测试、数据抓取
4. **数据处理工具** - 数据转换、分析、可视化

## 快速开始

### 安装依赖
```bash
cd skills/openclaw-anything
npm install
```

### 基本使用
```bash
# 运行系统诊断
npm start
# 或
node tools-example.js --diagnose

# 监控系统资源（10秒）
npm run monitor
# 或
node tools-example.js --monitor

# 列出当前目录文件
npm run list-files
# 或
node tools-example.js --list-files [目录路径]
```

### 在代码中使用
```javascript
const { OpenClawAnything } = require('./tools-example.js');

// 创建工具实例
const tools = new OpenClawAnything();

// 运行系统诊断
async function checkSystem() {
  const diagnostics = await tools.runDiagnostics();
  console.log('系统诊断完成:', diagnostics);
}

// 使用文件工具
async function processFiles() {
  const files = await tools.fileTools.listFiles('.', {
    recursive: true,
    sortBy: 'size'
  });
  console.log(`找到 ${files.length} 个文件/目录`);
}

// 监控系统资源
function monitorSystem() {
  const monitor = tools.systemTools.monitorResources(5000);
  monitor.start();
  
  // 30秒后停止
  setTimeout(() => {
    monitor.stop();
    const report = monitor.getReport();
    console.log('监控报告:', report);
  }, 30000);
}
```

## 工具函数详解

### FileTools (文件工具)
- `getFileInfo(filePath)` - 获取文件详细信息
- `listFiles(directory, options)` - 列出目录文件
- `batchRename(directory, pattern, startIndex)` - 批量重命名

### SystemTools (系统工具)
- `getSystemInfo()` - 获取系统信息
- `monitorResources(interval)` - 监控系统资源
- 实时监控CPU、内存使用情况

### NetworkTools (网络工具)
- `checkConnectivity(host, port)` - 检查网络连接
- `getPublicIP()` - 获取公共IP地址

## 使用示例

### 示例1：系统健康检查
```javascript
const tools = new OpenClawAnything();

// 定期检查系统健康
setInterval(async () => {
  const diagnostics = await tools.runDiagnostics();
  
  // 检查是否有问题
  if (diagnostics.systemInfo.freeMemory < 500) { // 内存不足500MB
    console.warn('警告: 系统内存不足!');
  }
  
  if (!diagnostics.connectivity.connected) {
    console.warn('警告: 网络连接异常!');
  }
}, 60000); // 每分钟检查一次
```

### 示例2：自动化文件整理
```javascript
const { FileTools } = require('./tools-example.js');

// 整理下载文件夹
async function organizeDownloads() {
  const downloadsPath = '~/Downloads';
  const files = await FileTools.listFiles(downloadsPath, {
    recursive: false,
    filter: file => file.isFile
  });
  
  // 按文件类型分类
  const byExtension = {};
  files.forEach(file => {
    const ext = path.extname(file.path).toLowerCase() || '.other';
    if (!byExtension[ext]) byExtension[ext] = [];
    byExtension[ext].push(file);
  });
  
  console.log('文件分类统计:');
  Object.entries(byExtension).forEach(([ext, files]) => {
    console.log(`${ext}: ${files.length} 个文件`);
  });
}
```

### 示例3：网络监控
```javascript
const { NetworkTools } = require('./tools-example.js');

// 监控网络连接状态
async function monitorNetwork() {
  const hosts = ['8.8.8.8', '1.1.1.1', 'baidu.com'];
  
  for (const host of hosts) {
    const result = await NetworkTools.checkConnectivity(host);
    console.log(`${host}: ${result.connected ? '✓ 连接正常' : '✗ 连接失败'}`);
    if (result.latency) {
      console.log(`  延迟: ${result.latency}ms`);
    }
  }
}
```

## 配置选项

可以通过修改代码中的常量来配置工具行为：

```javascript
// 在 tools-example.js 中修改这些配置
const CONFIG = {
  fileTools: {
    defaultEncoding: 'utf-8',
    maxFileSize: 100 * 1024 * 1024 // 100MB
  },
  systemTools: {
    monitorInterval: 5000, // 5秒
    alertThresholds: {
      cpu: 80,    // CPU使用率超过80%报警
      memory: 85  // 内存使用率超过85%报警
    }
  },
  networkTools: {
    timeout: 10000, // 10秒超时
    retryAttempts: 3 // 重试次数
  }
};
```

## 扩展开发

要添加新功能：

1. **创建新工具模块**
```javascript
// tools/new-tool.js
class NewTool {
  static async newFunction(param) {
    // 实现功能
  }
}

module.exports = NewTool;
```

2. **集成到主工具集**
```javascript
// 在 tools-example.js 中
const NewTool = require('./tools/new-tool');

class OpenClawAnything {
  constructor() {
    // ... 现有工具
    this.newTool = NewTool;
  }
}
```

3. **更新文档**
    - 在 README.md 中添加说明
    - 在 SKILL.md 中更新功能列表

## 注意事项

1. **权限要求**：某些系统功能可能需要管理员权限
2. **资源消耗**：监控工具会占用一定系统资源
3. **网络访问**：网络工具需要互联网连接
4. **错误处理**：所有操作都应包含适当的错误处理

## 故障排除

### 常见问题

1. **文件操作权限错误**
   - 检查文件/目录权限
   - 以管理员身份运行（如果需要）

2. **网络连接失败**
   - 检查网络设置
   - 验证防火墙规则
   - 确认目标主机可达

3. **内存使用过高**
   - 减少监控频率
   - 限制处理文件大小
   - 优化数据处理逻辑

### 获取帮助

如有问题，请：
1. 检查控制台错误信息
2. 验证依赖是否安装正确
3. 查看示例代码是否正确使用

## 许可证

MIT License - 自由使用和修改