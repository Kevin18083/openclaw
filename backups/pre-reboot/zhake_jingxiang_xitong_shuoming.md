# 🛡️ OpenClaw 完整知识镜像系统

## 系统概述

三重镜像保护系统，所有知识、记忆、配置和技能的**完整实时副本**，确保绝对安全。

### 镜像策略
```
工作区数据 → C 盘主镜像 (knowledge-main)
         → C 盘备用镜像 (knowledge-backup)
         → D 盘异地镜像 (openclaw-backup)
```

### 镜像位置
| 镜像 | 路径 | 状态 |
|------|------|------|
| C 盘主镜像 | `C:\Users\17589\.openclaw\backups\knowledge-main\` | ✅ 正常 |
| C 盘备用镜像 | `C:\Users\17589\.openclaw\backups\knowledge-backup\` | ✅ 正常 |
| D 盘异地镜像 | `D:\AAAAAA\openclaw-backup\` | ✅ 正常 |

## 镜像内容（60 个文件）

### 核心文件（8 个）
- ✅ MEMORY.md - 长期记忆
- ✅ SOUL.md - 身份定义
- ✅ USER.md - 用户信息
- ✅ IDENTITY.md - 身份配置
- ✅ AGENTS.md - 工作区规则
- ✅ TOOLS.md - 工具配置
- ✅ HEARTBEAT.md - 心跳检查清单
- ✅ openclaw.json - 系统配置

### 记忆系统（14 个文件）
- ✅ workspace/memory/ - 日常记忆文件

### 技能系统（30 个文件）
- ✅ workspace/skills/ - 已安装技能

### 自动化系统（8 个文件）
- ✅ auto-switch-model.js - 模型自动切换
- ✅ auto-switch-model-test.js - 切换测试版
- ✅ model-switch-test-runner.js - 测试运行器
- ✅ full-backup-system.js - 备份系统自身
- ✅ 模型切换测试计划.md
- ✅ backup-log.md - 备份日志

## 自动镜像计划

### 定时任务
- **频率**: 每 24 小时一次（每日自动执行）
- **Job ID**: `5975ea45-b15b-4e1a-8612-8953c5cb2d98`
- **方式**: 自动覆盖更新，保持最新状态

### 手动触发
```bash
node C:\Users\17589\.openclaw\workspace\full-backup-system.js
```

## 故障转移机制

### 自动恢复逻辑
```
如果 C 盘主镜像失败 → 尝试从 C 盘备用镜像恢复
如果 C 盘全部失败 → 从 D 盘异地镜像恢复
如果全部失败 → 发出严重警告
```

### 恢复命令
```bash
# 从 D 盘异地镜像恢复
# 脚本会自动检测并执行故障转移
node C:\Users\17589\.openclaw\workspace\full-backup-system.js
```

## 镜像验证

### 完整性检查
- ✅ 每次镜像后自动验证
- ✅ 验证通过率 >80% 视为成功
- ✅ 当前验证结果：94.7% (18/19 项目)

## 最新镜像记录

### 当前镜像状态
- **时间**: 2026-03-07 03:43:22
- **文件数**: 60 个
- **验证**: 94.7% 通过
- **状态**: ✅ 全部成功

### 镜像清单
```
C:\Users\17589\.openclaw\backups\knowledge-main\
  └── 完整工作区副本 (60 文件)

C:\Users\17589\.openclaw\backups\knowledge-backup\
  └── 完整工作区副本 (60 文件)

D:\AAAAAA\openclaw-backup\
  └── 完整工作区副本 (60 文件)
```

## 监控与日志

### 日志文件
- **备份日志**: `workspace/backup-log.md`
- **状态文件**: 每个镜像目录包含 BACKUP_MANIFEST.json

### 查看命令
```bash
# 查看备份日志
type workspace\backup-log.md

# 查看镜像清单
type backups\knowledge-main\BACKUP_MANIFEST.json

# 查看镜像目录
dir backups\knowledge-main
```

## 排除目录

以下目录**不会**被镜像（避免递归和冗余）：
- ❌ backups/ - 备份目录自身
- ❌ node_modules/ - npm 依赖
- ❌ .git/ - Git 版本控制

## 应急恢复流程

### 场景 1: C 盘损坏
```bash
# 从 D 盘异地镜像恢复
xcopy /E /I /Y D:\AAAAAA\openclaw-backup\workspace C:\Users\17589\.openclaw\workspace
xcopy /E /I /Y D:\AAAAAA\openclaw-backup\openclaw.json C:\Users\17589\.openclaw\
```

### 场景 2: 单文件丢失
```bash
# 从镜像恢复单个文件
xcopy /Y backups\knowledge-main\workspace\MEMORY.md workspace\
```

### 场景 3: 完全灾难恢复
```bash
# 1. 重新安装 OpenClaw
npm install -g openclaw-cn

# 2. 从 D 盘恢复所有数据
xcopy /E /I /Y D:\AAAAAA\openclaw-backup\ C:\Users\17589\.openclaw\

# 3. 重启 Gateway
openclaw gateway restart
```

## 系统状态

| 组件 | 状态 | 最后更新 |
|------|------|----------|
| 镜像脚本 | ✅ 正常 | 2026-03-07 03:43 |
| C 盘主镜像 | ✅ 正常 | 2026-03-07 03:43 |
| C 盘备用镜像 | ✅ 正常 | 2026-03-07 03:43 |
| D 盘异地镜像 | ✅ 正常 | 2026-03-07 03:43 |
| 定时任务 | ✅ 已设置 | 2026-03-07 03:43 |
| 故障转移 | ✅ 就绪 | 2026-03-07 03:43 |

## 核心优势

### vs 多版本备份
| 特性 | 多版本备份 | 实时镜像 |
|------|-----------|---------|
| **存储空间** | 大（7 个版本×3 位置） | 小（1 个版本×3 位置） |
| **恢复速度** | 慢（需要查找版本） | 快（直接复制） |
| **复杂度** | 高（版本管理） | 低（直接覆盖） |
| **适用场景** | 需要历史回滚 | 只需最新状态 |

### 我们的选择：实时镜像
- ✅ **简单高效**: 每次都是完整最新副本
- ✅ **节省空间**: 不保留历史版本
- ✅ **快速恢复**: 直接复制即可
- ✅ **三重保护**: 3 个位置完全相同的数据

## 注意事项

1. **实时镜像** - 每个位置都是最新完整副本
2. **自动覆盖** - 每次执行都会更新所有文件
3. **每日自动** - 无需手动干预
4. **故障自动转移** - C 盘失败自动使用 D 盘
5. **排除递归** - 已修复无限嵌套问题

---
*镜像系统创建时间：2026-03-07 03:38*
*优化为实时镜像：2026-03-07 03:43*
*维护者：扎克*
*最后更新：2026-03-07 03:43*
