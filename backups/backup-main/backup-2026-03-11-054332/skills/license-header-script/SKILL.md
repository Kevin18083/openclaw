# License Header 自动添加脚本

> 来源：用户桌面文件 | 日期：2026-03-09

---

## 📋 概述

**用途**：Git Pre-commit Hook 自动检查/添加 Apache License 2.0 许可证头

**项目**：Coze Studio (coze-dev)

---

## 🔧 功能

1. **自动检查**暂存文件是否包含许可证头
2. **自动添加**许可证头到缺少许可证的文件
3. **自动重新暂存**修改后的文件
4. **支持多种语言**：Go, TS, TSX, JS, JSX, Shell

---

## 📄 许可证模板

### C 风格注释（Go/TS/JS）

```javascript
/*
 * Copyright 2025 coze-dev Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
```

### Shell 注释

```bash
# Copyright 2025 coze-dev Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# ...
```

---

## 🛠️ 核心函数

### `has_license_header(file)`

检查文件是否已有许可证头

```bash
has_license_header() {
    local file="$1"
    local ext="${file##*.}"

    case "$ext" in
        "go"|"ts"|"tsx"|"js"|"jsx")
            head -n 5 "$file" | grep -q "Copyright.*coze-dev Authors"
            ;;
        "sh")
            head -n 10 "$file" | grep -q "Copyright.*coze-dev Authors"
            ;;
    esac
}
```

### `add_license_header(file)`

添加许可证头到文件

```bash
add_license_header() {
    local file="$1"
    local temp_file=$(mktemp)

    case "$ext" in
        "go"|"ts"|"tsx"|"js"|"jsx")
            echo "$APACHE_LICENSE_HEADER" > "$temp_file"
            cat "$file" >> "$temp_file"
            ;;
        "sh")
            # 保留 shebang
            if head -n 1 "$file" | grep -q "^#!"; then
                head -n 1 "$file" > "$temp_file"
                echo "$SHELL_LICENSE_HEADER" >> "$temp_file"
                tail -n +2 "$file" >> "$temp_file"
            fi
            ;;
    esac

    mv "$temp_file" "$file"
}
```

### `main()`

主函数：处理所有暂存文件

```bash
main() {
    staged_files=$(git diff --cached --name-only --diff-filter=ACM)

    for file in $staged_files; do
        if has_license_header "$file"; then
            echo "  ✓ License header present"
        else
            add_license_header "$file"
            git add "$file"  # 重新暂存
        fi
    done
}
```

---

## 📖 使用方法

### 作为 Git Hook

```bash
# 添加到 .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### 手动运行

```bash
./setup-license-header.sh
```

### 输出示例

```
Checking license headers for staged files...
Checking: frontend/src/app.ts
  + Adding license header
  ✓ License header added and file re-staged
Checking: backend/main.go
  ✓ License header present

Added license headers to 1 file(s) and re-staged them for commit.
```

---

## 🎯 学习收获

### 1. Git Hook 最佳实践

- 使用 `git diff --cached --name-only` 获取暂存文件
- 修改后自动 `git add` 重新暂存
- 使用 `diff-filter=ACM` 只处理添加/修改的文件

### 2. Shell 编程技巧

- `$(mktemp)` 创建临时文件
- `${file##*.}` 获取文件扩展名
- `head -n N` 读取前 N 行
- `case` 语句多条件处理

### 3. 许可证管理

- 不同语言用不同注释风格
- Shell 文件要保留 shebang
- 检查时留出足够行数（5-10 行）

---

## 🔗 相关脚本

| 脚本 | 用途 |
|------|------|
| `setup-license-header.sh` | 主入口，调用 VSCode 设置脚本 |
| `add-license-header.sh` | 完整的许可证添加逻辑 |
| `setup-vscode-settings.sh` | VSCode 配置（配套） |

---

*版本：1.0 | 学习时间：2026-03-09*
