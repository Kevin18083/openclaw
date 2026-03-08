#!/bin/bash
# skills-checker.sh - 技能库自动检查和切换脚本
# 用法：./skills-checker.sh

set -e

PRIMARY_DIR="skills"
BACKUP_DIR="skills-backup"
STATE_FILE=".skills-state.json"
LOG_FILE=".skills-switch.log"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 记录日志
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 检查主库是否可用
check_primary() {
    # 检查目录存在
    if [ ! -d "$PRIMARY_DIR" ]; then
        return 1
    fi

    # 检查至少有一个技能文件
    if [ ! -f "$PRIMARY_DIR/code-quality-workflow/SKILL.md" ]; then
        return 1
    fi

    # 检查文件是否可读
    if ! head -1 "$PRIMARY_DIR/code-quality-workflow/SKILL.md" > /dev/null 2>&1; then
        return 1
    fi

    # 检查是否有 Git 冲突标记
    if grep -q "<<<<<<<" "$PRIMARY_DIR/code-quality-workflow/SKILL.md" 2>/dev/null; then
        return 1
    fi

    # 检查文件大小是否合理（至少 1KB）
    local file_size=$(stat -f%z "$PRIMARY_DIR/code-quality-workflow/SKILL.md" 2>/dev/null || stat -c%s "$PRIMARY_DIR/code-quality-workflow/SKILL.md" 2>/dev/null || echo 0)
    if [ "$file_size" -lt 1024 ]; then
        return 1
    fi

    return 0
}

# 切换到备份库
switch_to_backup() {
    log "${YELLOW}⚠️  主技能库不可用，切换到备份库...${NC}"

    # 如果主库存在但损坏，重命名它
    if [ -d "$PRIMARY_DIR" ]; then
        mv "$PRIMARY_DIR" "${PRIMARY_DIR}.broken.$(date +%Y%m%d%H%M%S)"
    fi

    # 从备份库复制
    if [ -d "$BACKUP_DIR" ]; then
        cp -r "$BACKUP_DIR" "$PRIMARY_DIR"
        log "${GREEN}✅ 已切换到备份库${NC}"
    else
        log "${RED}❌ 备份库也不存在！无法切换${NC}"
        exit 1
    fi

    # 记录切换事件
    echo "{\"switchedAt\": \"$(date -Iseconds)\", \"reason\": \"primary_unavailable\", \"autoSwitched\": true}" > "$STATE_FILE"
}

# 验证备份库
verify_backup() {
    if [ ! -d "$BACKUP_DIR" ]; then
        return 1
    fi

    if [ ! -f "$BACKUP_DIR/code-quality-workflow/SKILL.md" ]; then
        return 1
    fi

    return 0
}

# 主流程
main() {
    log "=== 技能库检查开始 ==="

    # 首先验证备份库存在（以防万一）
    if ! verify_backup; then
        log "${RED}❌ 备份库不存在或无效！${NC}"
        exit 1
    fi

    log "${GREEN}✅ 备份库可用${NC}"

    # 检查主库
    if check_primary; then
        log "${GREEN}✅ 主技能库可用${NC}"
    else
        switch_to_backup
    fi

    log "=== 技能库检查完成 ==="
}

main
