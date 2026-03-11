# 文件体积检查脚本

> 来源：用户桌面文件 | 日期：2026-03-09

---

## 📋 概述

**用途**：Git 提交前检查文件体积是否超过 512KB

**场景**：CI/CD Pipeline、Git Hook

---

## ⚙️ 配置

```bash
# 体积限制 (KB)
size_limit=$((512))

# 排除模式
EXCLUDE_PATTERNS=(
  '**/pnpm-lock.yaml'
  'packages/arch/bot-api/src/auto-generate/**'
  'apps/bot-op/src/services/bam-auto-generate/**'
  'apps/prompt-platform/src/services/auto-generate/**'
  "**/lib/**"
  "**/.*/**"
  '**/__tests__/**'
  '**/__test__/**'
  "**/__mocks__/**"
  "**/__mock__/**"
  "**/*.test.*/**"
  "**/*.spec.*/**"
  "**/__snapshots__/**"
  "**/*.snap"
  '**/e2e/**'
  'common/changes/**'
  'apps/fornax/**'
  "packages/arch/semi-theme-hand01"
  "frontend/packages/arch/resources/studio-i18n-resource/src/**"
)
```

### ⚠️ 发现问题

**问题**：原始文件中数组元素之间用了逗号（`,`），但 Bash 数组应该用空格或换行分隔！

**原始代码（错误）**：
```bash
EXCLUDE_PATTERNS=(
  'apps/fornax/**',  # ❌ 多了逗号
  "packages/arch/semi-theme-hand01",  # ❌ 多了逗号
)
```

**修正后（正确）**：
```bash
EXCLUDE_PATTERNS=(
  'apps/fornax/**'   # ✅ 没有逗号
  "packages/arch/semi-theme-hand01"  # ✅ 没有逗号
)
```

---

## 🔧 核心逻辑

### 1. 获取变更文件

```bash
# CI 模式（与目标分支比较）
if [ "$CI_MODE" = true ]; then
  files=$(git diff --name-only --diff-filter=AM "origin/$TARGET_BRANCH..." $EXCLUDE_STRING)
else
  # Git Hook 模式（与暂存区比较）
  files=$(git diff --name-only --diff-filter=AM --cached $EXCLUDE_STRING)
fi
```

### 2. 检查文件体积

```bash
for file in $files; do
  file_size=$(wc -c <"$file" 2>/dev/null)
  file_size_kb=$((file_size / 1024))

  if [ "$file_size_kb" -gt "$size_limit" ]; then
    large_files_info+="- \`$file\` ($file_size_kb KB)\n"
  fi
done
```

### 3. 输出结论

**CI 模式**（JSON 格式）：
```bash
CONCLUSION="{
  \"name\": \"文件体积\",
  \"conclusion\": \"failed\",
  \"output\": {
    \"summary\": \"<h1>错误：文件体积过大</h1> 以下文件体积超过限制 (${size_limit}KB): \\n \\n $large_files_info\"
  }
}"
echo "$conclusion" > check-file-size.log
echo "::update-check-run::check-file-size.log"
```

**Git Hook 模式**：
```bash
echo "错误：以下文件体积超过限制 (${size_limit}KB):"
echo -e "$large_files_info"
exit 1
```

---

## 📖 使用方法

### CI 模式

```bash
CI_MODE=true targetBranch=main ./check-file-size.sh
```

### Git Hook 模式

```bash
# .git/hooks/pre-commit
#!/bin/bash
./scripts/check-file-size.sh
```

---

## 💡 学习收获

### 1. Git 差异比较

```bash
# 与分支比较
git diff --name-only --diff-filter=AM "origin/main..."

# 与暂存区比较
git diff --name-only --diff-filter=AM --cached

# diff-filter 说明
A = Added
M = Modified
D = Deleted
```

### 2. 排除模式处理

```bash
# 将数组转换为 Git 排除字符串
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
  EXCLUDE_STRING+=":(exclude)$pattern "
done
```

### 3. 文件大小获取

```bash
# 使用 wc -c
file_size=$(wc -c <"$file" 2>/dev/null)

# 转换为 KB
file_size_kb=$((file_size / 1024))
```

### 4. GitHub Actions 检查点更新

```bash
echo "::update-check-run::check-file-size.log"
```

---

*版本：1.0 | 学习时间：2026-03-09*
