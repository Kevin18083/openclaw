# VSCode 企业级配置学习

> 来源：Coze Studio 项目 | 日期：2026-03-09

---

## 📋 概述

**项目**：Coze Studio (135+ 包 Monorepo)

**配置目标**：优化大型 TypeScript 项目性能

---

## ⚙️ 核心配置

### 1. 编辑器基础

```json
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.formatOnType": false,
  "editor.formatOnPaste": false,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSaveMode": "modificationsIfAvailable",
  "editor.rulers": [80, 120],
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}
```

### 2. 保存时动作

```json
"editor.codeActionsOnSave": {
  "source.fixAll": "never",
  "source.fixAll.eslint": "never",
  "source.removeUnused": "never",
  "source.organizeImports": "never"
}
```

**说明**：禁用自动修复，避免保存时卡顿

---

## 🔍 搜索配置

### 排除路径

```json
"search.exclude": {
  "**/node_modules": true,
  "**/.nyc_output": true,
  "**/.rush": true,
  "**/pnpm-lock.yaml": true,
  "**/CHANGELOG.md": true,
  "common/changes": true,
  "**/output": true,
  "**/lib": true,
  "**/dist": true,
  "**/coverage": true,
  "common/temp": true
}
```

### 文件排除

```json
"files.exclude": {
  "**/.git": true,
  "**/.rush": true,
  "**/.swc": true,
  "**/rush-logs": true
}
```

### 监听排除

```json
"files.watcherExclude": {
  "**/.git/objects/**": true,
  "**/node_modules/*/**": true
}
```

---

## 📘 TypeScript 优化配置

### TS Server 性能优化

```json
{
  "typescript.tsdk": "frontend/config/ts-config/node_modules/typescript/lib",
  "typescript.tsserver.maxTsServerMemory": 16384,  // 16GB
  "typescript.tsserver.log": "off",                 // 关闭日志（防止磁盘占满）
  "typescript.tsserver.enableRegionDiagnostics": false,
  "typescript.tsserver.experimental.enableProjectDiagnostics": true,
  "typescript.disableAutomaticTypeAcquisition": true
}
```

### Watch 选项（关键！）

```json
"typescript.tsserver.watchOptions": {
  "fallbackPolling": "dynamicPriorityPolling",
  "synchronousWatchDirectory": false,
  "watchDirectory": "useFsEvents",
  "watchFile": "useFsEventsOnParentDirectory",
  "excludeDirectories": [
    "/**/node_modules",
    "/**/dist",
    "/**/lib",
    "/**/coverage",
    "**/temp"
  ],
  "excludeLibrarySymbols": true
}
```

**说明**：
- `useFsEvents` - 使用文件系统事件而非轮询
- `dynamicPriorityPolling` - 动态优先级轮询（兜底）
- 排除大目录，减少监听文件数量

### 其他 TS 配置

```json
{
  "typescript.format.enable": false,
  "typescript.referencesCodeLens.enabled": false,
  "typescript.preferGoToSourceDefinition": true,
  "typescript.updateImportsOnFileMove.enabled": "never",
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": true,
  "typescript.workspaceSymbols.excludeLibrarySymbols": true
}
```

---

## 🧩 ESLint 配置

```json
{
  "eslint.nodePath": "frontend/config/eslint-config/node_modules/eslint",
  "eslint.enable": true,
  "eslint.useFlatConfig": true,
  "eslint.format.enable": false,
  "eslint.codeActionsOnSave.mode": "problems",
  "eslint.lintTask.enable": false,
  "eslint.probe": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.workingDirectories": [{ "mode": "auto" }]
}
```

---

## 🎨 格式化器配置

### 各语言格式化器

```json
"[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[json]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[yaml]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[css]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[html]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
"[less]": { "editor.defaultFormatter": "stylelint.vscode-stylelint" },
"[shellscript]": { "editor.defaultFormatter": "foxundermoon.shell-format" },
"[sql]": { "editor.defaultFormatter": "adpyke.vscode-sql-formatter" },
"[svg]": { "editor.defaultFormatter": "jock.svg" }
```

### Stylelint 配置

```json
{
  "stylelint.enable": true,
  "stylelint.validate": ["css", "scss", "less"],
  "stylelint.stylelintPath": "frontend/config/stylelint-config/node_modules/stylelint"
}
```

---

## 📁 文件关联

```json
"files.associations": {
  ".code-workspace": "jsonc",
  ".babelrc": "json",
  ".eslintrc": "jsonc",
  ".stylelintrc": "javascript",
  "package.json": "json",
  "Procfile*": "shellscript",
  "README": "markdown",
  "**/pnpm-lock.yaml": "plaintext",  // 避免解析卡顿
  "**/dist/**": "plaintext",
  "*.map": "plaintext",
  "*.log": "plaintext"
}
```

---

## 🧠 拼写检查

```json
{
  "cSpell.diagnosticLevel": "Warning"
}
```

---

## 💡 学习收获

### 1. 大型项目性能优化

| 配置 | 效果 |
|------|------|
| `maxTsServerMemory: 16384` | 防止 TS 服务内存不足 |
| `tsserver.log: off` | 防止日志占满磁盘 |
| `watchOptions.exclude*` | 减少文件监听数量 |
| `pnpm-lock.yaml: plaintext` | 避免大文件解析卡顿 |

### 2. Monorepo 配置技巧

- **统一工具路径**：指向 workspace 的 eslint/prettier
- **自动模式**：`workingDirectories: [{ mode: "auto" }]`
- **排除临时目录**：`.rush`, `common/temp`, `rush-logs`

### 3. 格式化最佳实践

- **保存时格式化**：`formatOnSave: true`
- **不自动修复**：避免保存时卡顿
- **修改部分格式化**：`formatOnSaveMode: modificationsIfAvailable`

### 4. 关键注释学习

```json
// tsserver log 不会自动删除，日积月累，导致磁盘空间不足，因此默认关闭
"typescript.tsserver.log": "off"

// 锁定文件避免解析，否则 VSCode 打开可能卡顿
"**/pnpm-lock.yaml": "plaintext"
```

---

## 🔗 相关配置

| 配置类别 | 说明 |
|----------|------|
| 编辑器基础 | 缩进、格式化、保存动作 |
| 搜索排除 | 减少搜索范围 |
| TS 优化 | 内存、监听、诊断 |
| ESLint | 工作目录、自动修复 |
| 格式化器 | 各语言格式化器 |
| 文件关联 | 文件类型识别 |

---

*版本：1.0 | 学习时间：2026-03-09*
