#!/bin/bash
# sync-skills.sh - 同步主技能库到备份库
# 用法：./sync-skills.sh

set -e

PRIMARY_DIR="skills"
BACKUP_DIR="skills-backup"
LOG_FILE=".skills-sync.log"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 记录日志
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 同步主库到备份库
sync_skills() {
    log "开始同步技能库..."

    # 检查主库是否存在
    if [ ! -d "$PRIMARY_DIR" ]; then
        log "❌ 主库不存在，无法同步"
        exit 1
    fi

    # 同步各个技能目录
    for dir in code-quality-workflow tech-error-log code-security-check; do
        if [ -d "$PRIMARY_DIR/$dir" ]; then
            cp -r "$PRIMARY_DIR/$dir" "$BACKUP_DIR/"
            log "✅ 同步 $dir"
        fi
    done

    # 同步维护指南
    if [ -f "$PRIMARY_DIR/SKILL-MAINTENANCE.md" ]; then
        cp "$PRIMARY_DIR/SKILL-MAINTENANCE.md" "$BACKUP_DIR/"
        log "✅ 同步 SKILL-MAINTENANCE.md"
    fi

    log "同步完成！"
}

sync_skills
