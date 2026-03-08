#!/bin/bash
# Elite Longterm Memory 初始化脚本

echo "初始化 Elite Longterm Memory 系统..."
echo "======================================"

# 创建目录结构
mkdir -p memory/{short-term,medium-term,long-term,archived,tags,indexes,backups}

echo "✓ 创建记忆目录结构"

# 创建配置文件
cat > memory/config.json << EOF
{
  "system_name": "Elite Longterm Memory",
  "version": "1.0",
  "initialized": "$(date -Iseconds)",
  "retention_policies": {
    "short_term": "24h",
    "medium_term": "30d",
    "long_term": "permanent",
    "archive_after": "365d"
  },
  "features": {
    "auto_cleanup": true,
    "backup_enabled": true,
    "compression_enabled": false,
    "indexing_enabled": true
  },
  "paths": {
    "short_term": "memory/short-term",
    "medium_term": "memory/medium-term",
    "long_term": "memory/long-term",
    "archived": "memory/archived",
    "tags": "memory/tags",
    "indexes": "memory/indexes",
    "backups": "memory/backups"
  }
}
EOF

echo "✓ 创建配置文件"

# 创建示例记忆
cat > memory/long-term/system-principles.md << EOF
# 系统基本原则

## 核心原则
1. **重要性优先**：重要信息永久保存
2. **自动管理**：系统自动分类和整理
3. **易于检索**：支持多种搜索方式
4. **安全可靠**：定期备份，防止数据丢失

## 使用指南
- 短期记忆：临时想法、待处理事项
- 中期记忆：项目文档、会议记录
- 长期记忆：核心知识、重要决策
- 归档记忆：历史记录、参考资料

创建时间: $(date)
EOF

echo "✓ 创建示例长期记忆"

# 创建维护脚本
cat > memory-maintenance.sh << EOF
#!/bin/bash
# 记忆维护脚本

echo "执行记忆维护..."
echo "=================="

# 1. 移动过期短期记忆到归档
echo "1. 清理短期记忆..."
find memory/short-term/ -name "*.md" -mtime +1 -exec echo "  归档: {}" \; -exec mv {} memory/archived/ \;

# 2. 检查中期记忆
echo "2. 检查中期记忆..."
find memory/medium-term/ -name "*.md" -mtime +30 -exec echo "  即将过期: {}" \;

# 3. 更新索引
echo "3. 更新搜索索引..."
if [ -f "update-index.js" ]; then
    node update-index.js
else
    echo "  索引更新脚本不存在，跳过"
fi

# 4. 执行备份
echo "4. 执行备份..."
backup_file="memory/backups/backup-\$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "\$backup_file" memory/{short-term,medium-term,long-term,archived,tags,config.json} 2>/dev/null
echo "  备份创建: \$backup_file"

echo "维护完成!"
EOF

chmod +x memory-maintenance.sh

echo "✓ 创建维护脚本"

# 创建快速添加记忆的别名/函数
cat > memory-commands.sh << EOF
#!/bin/bash
# 记忆管理快捷命令

# 添加短期记忆
function mem-add-short() {
    echo "\$*" > "memory/short-term/\$(date +%Y%m%d-%H%M%S).md"
    echo "短期记忆已添加"
}

# 添加长期记忆
function mem-add-long() {
    local title="\${1:-未标题}"
    local filename="\$(echo "\$title" | tr ' ' '-' | tr -cd '[:alnum:]-_').md"
    echo "# \$title" > "memory/long-term/\$filename"
    echo "" >> "memory/long-term/\$filename"
    echo "创建时间: \$(date)" >> "memory/long-term/\$filename"
    echo "长期记忆 '\$title' 已创建"
}

# 搜索记忆
function mem-search() {
    grep -r -i "\$*" memory/ --include="*.md" | head -20
}

# 列出最近记忆
function mem-recent() {
    find memory/ -name "*.md" -type f -exec ls -lt {} + | head -10
}

echo "记忆命令已加载:"
echo "  mem-add-short '内容'      # 添加短期记忆"
echo "  mem-add-long '标题'       # 添加长期记忆"
echo "  mem-search '关键词'       # 搜索记忆"
echo "  mem-recent               # 查看最近记忆"
EOF

chmod +x memory-commands.sh

echo "✓ 创建快捷命令"

echo ""
echo "======================================"
echo "初始化完成!"
echo ""
echo "下一步:"
echo "1. 阅读 SKILL.md 了解完整功能"
echo "2. 运行: source memory-commands.sh  加载快捷命令"
echo "3. 运行: ./memory-maintenance.sh    执行首次维护"
echo "4. 设置定时任务自动维护"
echo "======================================"