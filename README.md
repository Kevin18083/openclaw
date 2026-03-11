# 杰克测试框架 (Jack Test Framework)

> 🧪 一套完整的测试驱动开发工具 | 版本：v3.0 | 创建日期：2026-03-09

[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-3.0-green.svg)](CHANGELOG.md)
[![Shell](https://img.shields.io/badge/shell-Bash-blue.svg)](https://www.gnu.org/software/bash/)

---

## 📖 目录

- [简介](#-简介)
- [快速开始](#-快速开始)
- [安装说明](#-安装说明)
- [核心功能](#-核心功能)
- [使用指南](#-使用指南)
- [配置选项](#-配置选项)
- [输出示例](#-输出示例)
- [记忆库系统](#-记忆库系统)
- [常见问题](#-常见问题)
- [最佳实践](#-最佳实践)
- [文件清单](#-文件清单)
- [贡献指南](#-贡献指南)

---

## 🎯 简介

**杰克测试框架** 是一套完整的 Bash 测试驱动开发工具，专为以下场景设计：

- ✅ **测试驱动开发 (TDD)** - 先测试，后实装
- ✅ **代码质量检查** - 自动检测 TODO、调试语句、硬编码密钥
- ✅ **安全检查** - 敏感文件、SQL 注入、eval 执行检测
- ✅ **实装决策** - 权重评分系统，自动判断能否实装
- ✅ **记忆库系统** - 记录历史错误和成功案例，避免重复犯错

### 核心理念

```
不测试，不实装！
成功后必须复查、检查、检测，最后才能实装！
```

### 适用场景

- 📦 日常开发提交前检查
- 📦 部署前完整测试
- 📦 CI/CD 自动化测试
- 📦 代码审查辅助
- 📦 团队协作规范

---

## 🚀 快速开始

### 30 秒上手

```bash
# 1. 克隆或下载测试框架
cd your-project

# 2. 运行快速检查（1 分钟）
bash quick-check.sh .

# 3. 运行决策树评估（2 分钟）
bash decision-tree.sh .

# 4. 运行完整测试流程（5-10 分钟）
bash unified-gateway.sh --full .
```

### 一键命令

```bash
# 日常提交前
bash unified-gateway.sh --quick .

# 部署前
bash unified-gateway.sh --full .
```

---

## 📥 安装说明

### 方式 1：直接下载（推荐）

```bash
# 下载核心脚本
curl -O https://example.com/test-framework/test-framework-plus.sh
curl -O https://example.com/test-framework/quick-check.sh
curl -O https://example.com/test-framework/decision-tree.sh
curl -O https://example.com/test-framework/memory-review.sh
curl -O https://example.com/test-framework/unified-gateway.sh

# 添加执行权限
chmod +x *.sh
```

### 方式 2：Git 克隆

```bash
git clone https://github.com/your-repo/jack-test-framework.git
cd jack-test-framework
chmod +x *.sh
```

### 方式 3：作为子模块

```bash
git submodule add https://github.com/your-repo/jack-test-framework.git .test-framework
cd .test-framework
chmod +x *.sh
```

### 安装 Git Hook（可选）

```bash
# 自动安装 pre-commit 钩子
bash install-hooks.sh

# 手动安装
cp .hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## 🧩 核心功能

### 1. 快速检查模式 (quick-check.sh)

**5 项核心检查，1 分钟出结果**

| 检查项 | 说明 | 必须性 |
|--------|------|--------|
| 语法检查 | Bash/JS/TS 语法验证 | ✅ 必须 |
| 安全扫描 | 敏感文件、SQL 注入检测 | ✅ 必须 |
| 密钥检查 | 硬编码密码/API 密钥检测 | ✅ 必须 |
| 代码质量 | TODO、调试语句、大文件检测 | ✅ 必须 (≥90 分) |
| 单元测试 | 自动运行项目测试 | ⚠️ 可选 |

```bash
bash quick-check.sh ./项目路径
```

---

### 2. 实装决策树 (decision-tree.sh)

**权重评分系统，自动判断能否实装**

| 检查项 | 权重 | 通过线 |
|--------|------|--------|
| 基础测试 | 30% | 100% |
| 安全检查 | 30% | 0 问题 |
| 代码质量 | 15% | ≥90 分 |
| 单元测试 | 15% | ≥90% |
| 构建检查 | 10% | 100% |

**实装条件**：关键项（基础 + 安全）通过 + 总分≥80 分

```bash
bash decision-tree.sh ./项目路径
```

---

### 3. 记忆库回顾 (memory-review.sh)

**查看历史错误，避免重复犯错**

- 自动匹配当前代码中的历史错误模式
- 推荐成功案例参考
- 生成回顾报告

```bash
bash memory-review.sh ./项目路径
```

---

### 4. 完整测试流水线 (test-framework-plus.sh)

**14 个完整流程**

```
阶段 1: 初步测试（5 轮重试）
阶段 2: 复查验证（连续 3 次通过）
阶段 3: 代码质量检查
阶段 4: 安全检查
阶段 5: 性能检查
阶段 6: 文档检查
阶段 7: 兼容性检查
阶段 8: Git 提交规范检查
阶段 9: 环境变量检查
阶段 10: 依赖健康检查
阶段 11: 单元测试运行
阶段 12: 构建检查（含测试环节）
阶段 13: 端口/服务检查
阶段 14: 完整测试流水线
```

---

## 📖 使用指南

### 日常开发流程

```bash
# 早上开始开发前
bash memory-review.sh .        # 回顾历史错误

# 开发中
bash quick-check.sh .          # 快速检查

# 提交前
bash decision-tree.sh .        # 决策评估

# 通过后提交
git add .
git commit -m "feat: 新功能"
```

### 部署前流程

```bash
# 完整测试流程
bash unified-gateway.sh --full .

# 查看决策报告
cat test-logs/decision-tree-*.md

# 通过后部署
./deploy.sh
```

### CI/CD集成

```yaml
# .github/workflows/test.yml
name: Test Framework

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4

      - name: Install dependencies
        run: npm install

      - name: Quick Check
        run: bash unified-gateway.sh --quick .

      - name: Decision Tree
        run: bash unified-gateway.sh --decision .
```

---

## ⚙️ 配置选项

### 环境变量

```bash
# 在脚本开头或 ~/.bashrc 中配置
export MAX_RETRIES=5           # 初步测试轮数（默认 5）
export VERIFY_RETRIES=3        # 复查验证轮数（默认 3）
export LOG_DIR="./test-logs"   # 日志目录
export PASSING_SCORE=80        # 决策树通过分数（默认 80）
```

### 配置文件（v2.0+）

创建 `.testrc` 文件：

```bash
# 权重配置
WEIGHT_BASE_TEST=30
WEIGHT_SECURITY=30
WEIGHT_CODE_QUALITY=15
WEIGHT_UNIT_TEST=15
WEIGHT_BUILD=10

# 通过线
THRESHOLD_CODE_QUALITY=90
THRESHOLD_UNIT_TEST=90

# 排除目录
EXCLUDE_DIRS="node_modules .git dist build coverage"
```

---

## 📊 输出示例

### 快速检查输出

```
========================================
  杰克快速检查 v2.0
  时间：2026-03-09 10:30:00
  目标：./src
  标准：90 分通过线
========================================

[1/5] 语法检查...
  ✅ 语法检查通过
[2/5] 安全扫描...
  ✅ 安全检查通过
[3/5] 密钥检查...
  ✅ 密钥检查通过
[3.5/5] 代码质量评分...
  ✅ 代码质量 92 分（≥90 分）
[4/5] 单元测试...
  ✅ 单元测试通过
[5/5] 构建检查...
  ✅ 构建成功

========================================
  快速检查结果
========================================
  总计：6 项
  通过：6 项
  失败：0 项
  ✅ 快速检查通过！可以提交！
```

### 决策树输出

```
========================================
  杰克实装决策树 v2.0
========================================

[1/5] 评分基础测试...
      ✅ 3/3 通过
[2/5] 评分安全检查...
      ✅ 0 个问题
[3/5] 评分代码质量...
      ✅ 得分 92 (TODO:2 调试:1 大文件:0)
[4/5] 评分单元测试...
      ✅ 2/2 通过，覆盖率 95%
[5/5] 评分构建检查...
      ✅ 4/4 成功 (测试通过 ✅)

========================================
  总分：100 / 100
========================================

  ✅ 可以实装！

决策报告：./test-logs/decision-tree-20260309-103000.md
```

---

## 🗂️ 记忆库系统

### 错误记忆库

记录所有测试失败的案例，包含：
- 错误名称和发现日期
- 测试命令
- 错误信息
- 根本原因
- 解决方案
- 学习收获

**位置**：`memory/error-memory.md`

### 成功案例记忆库

记录所有测试通过的案例，包含：
- 案例名称和成功日期
- 测试命令
- 成功关键
- 使用场景
- 复用建议

**位置**：`memory/success-memory.md`

### 双记忆库联动

```
新任务 → 查成功案例 → 避免错误案例 → 写代码 → 测试
                                              ↓
              成功 → 记录成功案例    失败 → 记录错误案例
```

---

## ❓ 常见问题

### Q1: 如何跳过某些检查？

```bash
# 使用 quick 模式，只运行核心检查
bash unified-gateway.sh --quick .

# 或者自定义运行
source test-framework-plus.sh
code_quality_check "./src"
security_check "./src"
```

### Q2: 如何修改通过分数？

编辑 `decision-tree.sh`：

```bash
PASSING_SCORE=80  # 修改为你需要的分数
```

### Q3: 如何排除某些目录？

在 `.testrc` 文件中配置：

```bash
EXCLUDE_DIRS="node_modules .git dist build"
```

### Q4: 测试运行太慢怎么办？

```bash
# 减少重试轮数
export MAX_RETRIES=3

# 使用 quick 模式
bash unified-gateway.sh --quick .
```

### Q5: 如何在 Windows 上使用？

推荐使用 Git Bash 或 WSL：

```bash
# Git Bash
bash quick-check.sh .

# WSL
wsl bash quick-check.sh .
```

---

## 🎯 最佳实践

### 1. 每天开发前

```bash
# 花 30 秒回顾历史错误
bash memory-review.sh .
```

### 2. 每次提交前

```bash
# 运行快速检查（1 分钟）
bash quick-check.sh .
```

### 3. 每次实装前

```bash
# 运行决策树评估
bash decision-tree.sh .

# 总分≥80 且关键项通过才能实装
```

### 4. 每周回顾

```bash
# 查看新增的错误案例和成功案例
cat memory/error-memory.md
cat memory/success-memory.md
```

### 5. CI/CD集成

```yaml
# 在 GitHub Actions 中集成
- name: Test Framework
  run: bash unified-gateway.sh --full .
```

---

## 📁 文件清单

| 文件 | 用途 | 大小 |
|------|------|------|
| `test-framework.sh` | 基础测试框架 | 17K |
| `test-framework-plus.sh` | 增强测试框架 | 37K |
| `quick-check.sh` | 快速检查 | 11K |
| `decision-tree.sh` | 决策树评估 | 18K |
| `memory-review.sh` | 记忆库回顾 | 12K |
| `unified-gateway.sh` | 统一入口 | 7.7K |
| `test-runner.sh` | 测试运行器 | 3.6K |
| `test-examples.sh` | 测试示例 | 4.0K |

**文档**：
- `test-framework-usage.md` - 使用指南
- `连通性指南.md` - 连通性说明
- `决策树 -v2 更新说明.md` - 更新说明
- `测试框架 - 完整文件清单.md` - 完整清单

---

## 🤝 贡献指南

### 提交 PR

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/your-repo/jack-test-framework.git

# 运行自测脚本
bash self-test.sh

# 运行所有测试
bash unified-gateway.sh --full .
```

---

## 📄 许可证

本项目采用 Apache 2.0 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

感谢所有为本项目做出贡献的开发者！

---

*杰克测试框架 - 不测试，不实装！*
