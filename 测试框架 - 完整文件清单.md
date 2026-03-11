# 杰克测试框架 - 完整文件清单

> 版本：v2.0 | 更新日期：2026-03-09

---

## 📦 核心脚本文件（9 个）

| 文件名 | 大小 | 用途 | 版本 |
|--------|------|------|------|
| `test-framework.sh` | 17K | 基础测试框架（3 个流程） | v1.0 |
| `test-framework-plus.sh` | 37K | 增强测试框架（14 个流程） | v3.0 |
| `quick-check.sh` | 11K | 快速检查模式（5 项核心检查） | v2.0 |
| `decision-tree.sh` | 18K | 实装决策树（权重评分） | v2.0 |
| `memory-review.sh` | 12K | 记忆库自动回顾 | v1.0 |
| `unified-gateway.sh` | 7.7K | 统一入口（连通性） | v1.0 |
| `test-runner.sh` | 3.6K | 测试运行器 | v1.0 |
| `test-examples.sh` | 4.0K | 测试示例 | v1.0 |
| `sync-skills.sh` | 1.1K | 技能同步脚本 | v1.0 |

**总计**：约 110KB

---

## 📚 文档文件（3 个）

| 文件名 | 大小 | 用途 |
|--------|------|------|
| `test-framework-usage.md` | 8.9K | 测试框架使用指南 |
| `连通性指南.md` | 8.0K | 三大功能连通性说明 |
| `决策树 -v2 更新说明.md` | 5.6K | v2.0 更新说明 |

**总计**：约 22.5KB

---

## 🗂️ 记忆库文件（4 个）

| 文件名 | 用途 | 位置 |
|--------|------|------|
| `memory/error-memory.md` | 错误记忆库 | ./memory/ |
| `memory/success-memory.md` | 成功案例记忆库 | ./memory/ |
| `memory/DUAL-MEMORY-GUIDE.md` | 双记忆库使用指南 | ./memory/ |
| `DEPLOYMENT-CHECKLIST.md` | 实装前检查清单 | 根目录 |

---

## 📋 完整文件树

```
C:\Users\17589\.openclaw\workspace\
│
├── 📁 测试框架核心/
│   ├── test-framework.sh          # 基础版（3 流程）
│   ├── test-framework-plus.sh     # 增强版（14 流程）
│   ├── quick-check.sh             # 快速检查（5 项）
│   ├── decision-tree.sh           # 决策树评估
│   ├── memory-review.sh           # 记忆库回顾
│   ├── unified-gateway.sh         # 统一入口
│   ├── test-runner.sh             # 测试运行器
│   ├── test-examples.sh           # 测试示例
│   └── sync-skills.sh             # 技能同步
│
├── 📁 文档/
│   ├── test-framework-usage.md    # 使用指南
│   ├── 连通性指南.md               # 连通性说明
│   ├── 决策树-v2 更新说明.md         # 更新说明
│   └── DEPLOYMENT-CHECKLIST.md    # 实装清单
│
├── 📁 记忆库/
│   └── memory/
│       ├── error-memory.md        # 错误记忆
│       ├── success-memory.md      # 成功记忆
│       └── DUAL-MEMORY-GUIDE.md   # 使用指南
│
└── 📁 日志输出/
    └── test-logs/                 # 测试日志目录
        ├── main-*.log             # 主日志
        ├── error-*.log            # 错误日志
        ├── summary-*.log          # 摘要日志
        ├── security-*.log         # 安全日志
        ├── performance-*.log      # 性能日志
        ├── quick-check-*.md       # 快速检查报告
        ├── decision-tree-*.md     # 决策树报告
        └── memory-review-*.md     # 记忆库报告
```

---

## 🎯 使用场景对照表

| 场景 | 使用脚本 | 运行时间 |
|------|----------|----------|
| 日常开发提交前 | `quick-check.sh` | 1 分钟 |
| 实装部署前 | `decision-tree.sh` | 2-3 分钟 |
| 新项目启动 | `memory-review.sh` | 30 秒 |
| 完整测试流程 | `unified-gateway.sh --full` | 5-10 分钟 |
| 仅基础测试 | `test-framework.sh` | 3-5 分钟 |
| 仅增强测试 | `test-framework-plus.sh` | 5-10 分钟 |

---

## 🔧 快速命令参考

```bash
# 统一入口（推荐）
bash unified-gateway.sh --full .       # 完整流程
bash unified-gateway.sh --quick .      # 快速检查
bash unified-gateway.sh --decision .   # 决策树
bash unified-gateway.sh --memory .     # 记忆库回顾

# 单独运行
bash quick-check.sh .                  # 快速检查
bash decision-tree.sh .                # 决策树评估
bash memory-review.sh .                # 记忆库回顾
bash test-framework-plus.sh .          # 完整测试

# 帮助
bash unified-gateway.sh --help
```

---

## 📊 评分标准速查

### 决策树 v2.0

| 检查项 | 权重 | 通过线 |
|--------|------|--------|
| 基础测试 | 30% | 100% |
| 安全检查 | 30% | 0 问题 |
| 代码质量 | 15% | 90 分 |
| 单元测试 | 15% | 90% |
| 构建检查 | 10% | 100% |

**实装条件**：关键项通过 + 总分≥80 分

### 代码质量扣分项

| 问题 | 扣分 |
|------|------|
| TODO/FIXME/HACK | -3 分/个 |
| console.log/debugger | -8 分/个 |
| 大文件（>800 行） | -10 分/个 |
| 硬编码密钥/密码 | -15 分/个 |
| 空 catch 块 | -5 分/个 |
| 嵌套循环 | -5 分/个 |

---

## 📈 版本历史

| 版本 | 日期 | 新增内容 |
|------|------|----------|
| v1.0 | 2026-03-09 | 基础框架（3 流程）+ 记忆库 |
| v2.0 | 2026-03-09 | 增强框架（9 流程）+ 快速检查 |
| v3.0 | 2026-03-09 | 14 流程 + 决策树 + 记忆库回顾 + 连通性 |
| v2.0(决策树) | 2026-03-09 | 90 分标准 + 构建后测试 |

---

## 🎯 推荐工作流

```
开发前 → memory-review.sh（回顾历史错误）
  ↓
开发中 → quick-check.sh（快速检查）
  ↓
提交前 → decision-tree.sh（决策评估）
  ↓
部署前 → unified-gateway.sh --full（完整流程）
  ↓
实装 → ✅
```

---

*杰克测试框架 - 完整文件清单 v2.0*
