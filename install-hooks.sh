#!/bin/bash
#===============================================================================
# 杰克测试框架 - Git Hook 安装脚本
# 版本：v1.0
# 用途：安装 Git pre-commit 钩子
#===============================================================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}  杰克测试框架 - Git Hook 安装${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOKS_SOURCE="$SCRIPT_DIR/.hooks"
GIT_HOOKS_DIR="$SCRIPT_DIR/.git/hooks"

# 检查是否在 Git 仓库中
if [ ! -d "$GIT_HOOKS_DIR" ]; then
    echo -e "${RED}❌ 错误：未在 Git 仓库中${NC}"
    echo ""
    echo "请先初始化 Git 仓库："
    echo "  git init"
    echo ""
    exit 1
fi

# 创建 hooks 目录（如果不存在）
mkdir -p "$HOOKS_SOURCE"

# 复制 pre-commit 钩子
echo "安装 pre-commit 钩子..."
cp "$HOOKS_SOURCE/pre-commit" "$GIT_HOOKS_DIR/pre-commit"
chmod +x "$GIT_HOOKS_DIR/pre-commit"

echo -e "${GREEN}✅ pre-commit 钩子已安装${NC}"
echo ""

# 验证安装
echo "验证安装..."
if [ -x "$GIT_HOOKS_DIR/pre-commit" ]; then
    echo -e "${GREEN}✅ pre-commit 钩子可执行${NC}"
else
    echo -e "${YELLOW}⚠️  pre-commit 钩子不可执行，尝试修复...${NC}"
    chmod +x "$GIT_HOOKS_DIR/pre-commit"
    echo -e "${GREEN}✅ 已添加执行权限${NC}"
fi

echo ""
echo "════════════════════════════════════════"
echo "  安装完成！"
echo "════════════════════════════════════════"
echo ""
echo "已安装的钩子："
echo "  - pre-commit: 提交前运行快速检查"
echo ""
echo "使用方法："
echo "  1. 正常提交代码即可自动运行检查"
echo "  2. 如需跳过检查：git commit --no-verify"
echo ""
echo "卸载方法："
echo "  rm .git/hooks/pre-commit"
echo ""
