# Elite Longterm Memory

精英长期记忆管理系统 - 专为OpenClaw设计的智能记忆管理解决方案。

## 快速开始

### 1. 初始化系统
```bash
# Linux/macOS
./init-memory.sh

# Windows
init-memory.bat
```

### 2. 基本使用

#### 添加记忆
```bash
# 短期记忆（24小时保留）
echo "临时想法" > memory/short-term/$(date +%Y%m%d-%H%M%S).md

# 长期记忆（永久保存）
echo "# 重要决策" > memory/long-term/important-decision.md
```

#### 搜索记忆
```bash
# 关键词搜索
grep -r "关键词" memory/

# Windows
findstr /S /I "关键词" memory\*.md
```

#### 维护系统
```bash
# 执行维护
./memory-maintenance.sh

# Windows
memory-maintenance.bat
```

## 功能概述

### 🗂️ 四级记忆结构
- **短期记忆**：临时存储，24小时后自动归档
- **中期记忆**：重要信息，保留30天
- **长期记忆**：核心知识，永久保存
- **归档记忆**：历史记录，按需检索

### 🔍 智能检索
- 全文搜索
- 时间线浏览
- 标签过滤
- 语义关联

### 🛠️ 自动管理
- 定期清理过期记忆
- 自动分类和标记
- 智能备份系统
- 存储空间优化

## 目录结构

```
elite-longterm-memory/
├── SKILL.md              # 技能文档
├── README.md             # 说明文件
├── init-memory.sh        # Linux初始化脚本
├── init-memory.bat       # Windows初始化脚本
├── memory-maintenance.sh # 维护脚本
├── memory-commands.bat   # 命令参考
└── memory/              # 记忆存储目录
    ├── short-term/      # 短期记忆
    ├── medium-term/     # 中期记忆
    ├── long-term/       # 长期记忆
    ├── archived/        # 归档记忆
    ├── tags/           # 标签索引
    ├── indexes/        # 搜索索引
    ├── backups/        # 备份文件
    └── config.json     # 配置文件
```

## 配置选项

编辑 `memory/config.json` 自定义设置：

```json
{
  "retention_policies": {
    "short_term": "24h",     // 短期记忆保留时间
    "medium_term": "30d",    // 中期记忆保留时间
    "long_term": "permanent", // 长期记忆永久保存
    "archive_after": "365d"  // 归档时间
  },
  "features": {
    "auto_cleanup": true,    // 自动清理
    "backup_enabled": true,  // 启用备份
    "compression_enabled": false, // 启用压缩
    "indexing_enabled": true // 启用索引
  }
}
```

## 使用场景

### 个人知识管理
- 记录重要想法和灵感
- 保存项目文档和笔记
- 整理学习资料和参考

### 工作流程管理
- 会议记录和决策跟踪
- 任务和进度管理
- 客户和项目信息

### 系统监控
- 操作日志和事件记录
- 性能数据和指标
- 错误和异常跟踪

## 高级功能

### 记忆关联
系统可以自动发现记忆之间的关联，建立知识网络。

### 重要性评分
基于访问频率、引用次数等因素评估记忆重要性。

### 自动摘要
对长篇记忆内容自动生成摘要，便于快速浏览。

### 可视化分析
生成记忆地图、时间线等可视化视图。

## 维护计划

建议设置以下定时任务：

1. **每日**：清理短期记忆，执行增量备份
2. **每周**：整理中期记忆，更新搜索索引
3. **每月**：评估长期记忆，执行完整备份
4. **每季度**：优化存储，清理冗余数据

## 故障排除

### 常见问题

1. **记忆找不到**
   - 运行维护脚本更新索引
   - 检查文件权限
   - 确认搜索路径正确

2. **存储空间不足**
   - 启用压缩功能
   - 清理归档记忆
   - 调整保留策略

3. **性能问题**
   - 减少实时搜索范围
   - 优化索引设置
   - 分批处理大量记忆

### 恢复备份
```bash
# 恢复最新备份
tar -xzf memory/backups/backup-最新日期.tar.gz -C .
```

## 贡献与扩展

欢迎扩展本系统功能：

1. **添加新存储后端**（数据库、云存储等）
2. **集成AI分析**（自动分类、摘要生成）
3. **开发可视化界面**
4. **添加API接口**

## 许可证

MIT License - 详见 LICENSE 文件。

## 支持

如有问题或建议，请：
1. 查看详细文档 SKILL.md
2. 检查配置文件设置
3. 运行诊断脚本
4. 联系维护团队

---

*让记忆成为力量，而不是负担。*