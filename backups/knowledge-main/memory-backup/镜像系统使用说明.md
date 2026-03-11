# 镜像自动切换系统使用说明

> **创建时间**: 2026-03-09  
> **维护者**: 扎克 (Zack)  
> **设计者**: 杰克 (Jack)

---

##  系统概述

镜像系统提供**3 层自动保护**，确保记忆系统高可用性：

### 优先级架构

```
┌─────────────────────────────────────┐
│  主镜像 (C 盘 1 号)   ← 默认使用    │
│  memory-backup\mirror\              │
└─────────────────────────────────────┘
              ↓ 故障自动切换
┌─────────────────────────────────────┐
│  备镜像 (C 盘 2 号)   ← 自动备用    │
│  backups\mirror\                    │
└─────────────────────────────────────┘
              ↓ 双 C 盘故障
┌─────────────────────────────────────┐
│  杀手锏 (D 盘)       ← 最后防线    │
│  D:\AAAAAA\ClaudeBackups\mirror\    │
└─────────────────────────────────────┘
```

---

## 🔄 自动切换逻辑

### 工作流程

1. **每次记忆维护前** → 自动健康检查
2. **主镜像健康** → 继续使用主镜像
3. **主镜像故障** → 自动切换到备镜像
4. **主镜像恢复** → 自动切回主镜像
5. **双 C 盘故障** → 启用 D 盘杀手锏

### 健康检查标准

- ✅ 目录存在
- ✅ 可访问（能读取文件列表）
- ✅ 关键文件 ≥ 75%（4 个关键文件至少 3 个存在）

**关键文件清单**:
- `MEMORY.md`
- `coding-agent.md`
- `skill-vetter.md`
- `shared-openclaw.md`

---

## 📋 使用命令

### 自动检查（推荐）

```bash
# 运行记忆维护（自动包含镜像检查）
node memory/memory-maintenance.js

# 或单独检查镜像
node memory/mirror-switcher.js check
```

### 查看状态

```bash
# 查看镜像系统完整状态
node memory/mirror-switcher.js status
```

### 获取当前镜像路径

```bash
# 获取当前使用的镜像路径
node memory/mirror-switcher.js path
```

### 强制切换（手动）

```bash
# 切换到主镜像
node memory/mirror-switcher.js switch primary

# 切换到备镜像
node memory/mirror-switcher.js switch backup

# 切换到 D 盘杀手锏
node memory/mirror-switcher.js switch disaster
```

---

## 📊 状态文件

**位置**: `memory/mirror-state.json`

**内容**:
```json
{
  "currentMirror": "primary",
  "lastCheck": "2026-03-09T04:18:49.845Z",
  "lastSwitch": "2026-03-09T04:18:49.845Z",
  "switchReason": "健康检查通过",
  "healthHistory": [...]
}
```

---

## 🔧 集成说明

### 已集成到

1. **记忆维护脚本** (`memory-maintenance.js`)
   - 每次维护前自动检查镜像
   - 自动切换故障镜像
   - 记录到自我改进系统

2. **心跳检查** (HEARTBEAT.md)
   - 每 4 小时自动运行记忆维护
   - 包含镜像健康检查

### 调用示例

```javascript
const MirrorSwitcher = require('./mirror-switcher.js');

// 自动检查并切换
const state = MirrorSwitcher.autoSwitch();
console.log('当前镜像:', state.currentMirror);

// 获取当前镜像路径
const path = MirrorSwitcher.getCurrentMirrorPath();

// 强制切换
MirrorSwitcher.forceSwitch('backup');
```

---

## 🧪 测试

```bash
# 运行完整测试
node memory/test-mirror-switch.js
```

**测试内容**:
1. ✅ 健康检查功能
2. ✅ 自动选择镜像
3. ✅ 状态管理
4. ✅ 获取镜像路径
5. ✅ 状态显示
6. ✅ 模拟故障切换

---

## 📈 运行日志示例

```
🚀 开始记忆系统维护...

🔍 检查记忆文件完整性...
✅ 完整性检查完成

🪞 镜像系统健康检查...
🔍 开始镜像健康检查...

检查 主镜像 (C 盘 1 号)...
  状态：✓ 存在
  可访问：✓
  文件数：10
  关键文件：4/4
  健康：✅

检查 备镜像 (C 盘 2 号)...
  状态：✓ 存在
  可访问：✓
  文件数：10
  关键文件：4/4
  健康：✅

检查 杀手锏 (D 盘)...
  状态：✓ 存在
  可访问：✓
  文件数：10
  关键文件：4/4
  健康：✅

✓ 镜像无需切换，继续使用：主镜像 (C 盘 1 号)
```

---

## ⚠️ 故障处理

### 所有镜像都故障

如果三个镜像都不健康：
1. 系统会记录错误到 `mirror-state.json`
2. 记忆系统仍然可以运行（使用 memory/ 主目录）
3. 需要手动修复或重建镜像

### 恢复步骤

```bash
# 1. 检查状态
node memory/mirror-switcher.js status

# 2. 从备份恢复镜像
# (从 knowledge-main 或 knowledge-backup 复制)

# 3. 重新运行检查
node memory/mirror-switcher.js check
```

---

## 🎯 设计原则

1. **自动化优先** - 无需人工干预
2. **快速故障检测** - 每次使用前检查
3. **透明切换** - 记录所有切换原因
4. **优先本地** - C 盘优先，D 盘最后
5. **自动恢复** - 主镜像恢复后自动切回

---

*扎克，记住：镜像系统是你的自动保护伞，平时不用管，出问题自动切换！*

**—— 杰克**
