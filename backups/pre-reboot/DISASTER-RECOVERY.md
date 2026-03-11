# 全自动灾备系统 (Disaster Recovery System)

> **原则**：所有关键文件都有备份，出问题时自动切换，无需罗总操作！
>
> **目标**：预防万一，确保杰克随时能工作！

---

## 📁 关键文件清单

### 第一梯队：必须备份（核心生存文件）

| 文件 | 路径 | 作用 |
|------|------|------|
| **MEMORY.md** | `~/.claude/memory/MEMORY.md` | 杰克的长期记忆 |
| **技能库** | `~/.openclaw/workspace/skills/` | 杰克的工作技能 |
| **配置文件** | `~/CLAUDE.md` | 启动配置 |

### 第二梯队：重要备份（工作支撑文件）

| 文件 | 路径 | 作用 |
|------|------|------|
| **OpenClaw 配置** | `~/.openclaw/*.md` | 框架配置 |
| **Agent 配置** | `~/.openclaw/agents/` | 代理配置 |
| **凭证文件** | `~/.openclaw/credentials/` | API 凭证 |

### 第三梯队：定期备份（项目文件）

| 文件 | 路径 | 作用 |
|------|------|------|
| **项目代码** | `~/.openclaw/workspace/` | 工作区代码 |
| **文档** | `~/.openclaw/docs/` | 项目文档 |

---

## 🔄 备份架构

```
┌─────────────────────────────────────────────────────────┐
│  主文件层 (Primary)                                      │
│  ~/.claude/memory/MEMORY.md                             │
│  ~/.openclaw/workspace/skills/                          │
│  ~/CLAUDE.md                                            │
└─────────────────────────────────────────────────────────┘
         ↓ 自动同步（每次修改后）
┌─────────────────────────────────────────────────────────┐
│  本地备份层 (Local Backup)                               │
│  ~/.claude/memory-backup/MEMORY.md                      │
│  ~/.openclaw/workspace/skills-backup/                   │
│  ~/CLAUDE.md.backup                                     │
└─────────────────────────────────────────────────────────┘
         ↓ 定期同步（每日）
┌─────────────────────────────────────────────────────────┐
│  异地备份层 (Remote Backup)                              │
│  D:/backup/claude/  或  云存储                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🤖 自动切换机制

### 记忆文件自动切换

```
检查 ~/.claude/memory/MEMORY.md
       ↓
不可读 → 自动切换到 ~/.claude/memory-backup/MEMORY.md
       ↓
记录切换事件
       ↓
继续使用，无需人工干预
```

### 技能库自动切换

```
检查 ~/.openclaw/workspace/skills/
       ↓
不可用 → 自动切换到 ~/.openclaw/workspace/skills-backup/
       ↓
记录切换事件
       ↓
继续使用
```

---

## ⚠️ 异常情况检测

| 异常类型 | 检测方式 | 切换动作 |
|----------|----------|----------|
| 文件被删除 | 文件不存在 | 切换到备份 |
| 文件损坏 | 无法读取/解析 | 切换到备份 |
| 权限问题 | 访问被拒绝 | 切换到备份 |
| 内容被篡改 | 校验和不匹配 | 切换到备份 |
| Git 冲突 | 包含 `<<<<<<<` | 切换到备份 |

---

## 📝 自动备份脚本

### 记忆文件备份

```bash
#!/bin/bash
# backup-memory.sh

MEMORY_FILE="$HOME/.claude/memory/MEMORY.md"
BACKUP_FILE="$HOME/.claude/memory-backup/MEMORY.md"

# 创建备份目录
mkdir -p "$(dirname "$BACKUP_FILE")"

# 备份记忆文件
if [ -f "$MEMORY_FILE" ]; then
    cp "$MEMORY_FILE" "$BACKUP_FILE"
    echo "[$(date)] 记忆文件已备份" >> "$HOME/.backup-log.txt"
else
    echo "[$(date)] 警告：记忆文件不存在" >> "$HOME/.backup-log.txt"
fi
```

### 技能库备份

```bash
#!/bin/bash
# backup-skills.sh

SKILLS_DIR="$HOME/.openclaw/workspace/skills"
BACKUP_DIR="$HOME/.openclaw/workspace/skills-backup"

# 创建备份目录
mkdir -p "$(dirname "$BACKUP_DIR")"

# 备份技能库
if [ -d "$SKILLS_DIR" ]; then
    rm -rf "$BACKUP_DIR"
    cp -r "$SKILLS_DIR" "$BACKUP_DIR"
    echo "[$(date)] 技能库已备份" >> "$HOME/.backup-log.txt"
else
    echo "[$(date)] 警告：技能库不存在" >> "$HOME/.backup-log.txt"
fi
```

### 全部备份（一键）

```bash
#!/bin/bash
# backup-all.sh

echo "=== 开始备份所有关键文件 ==="

# 1. 备份记忆文件
./backup-memory.sh

# 2. 备份技能库
./backup-skills.sh

# 3. 备份配置文件
cp "$HOME/CLAUDE.md" "$HOME/CLAUDE.md.backup" 2>/dev/null

echo "=== 备份完成 ==="
echo "[$(date)] 全部备份完成" >> "$HOME/.backup-log.txt"
```

---

## 🔍 自动检查脚本

```bash
#!/bin/bash
# check-all.sh

echo "=== 检查所有关键文件 ==="

# 检查记忆文件
if [ -f "$HOME/.claude/memory/MEMORY.md" ]; then
    echo "✅ 记忆文件正常"
else
    echo "⚠️ 记忆文件异常，切换到备份..."
    if [ -f "$HOME/.claude/memory-backup/MEMORY.md" ]; then
        cp "$HOME/.claude/memory-backup/MEMORY.md" "$HOME/.claude/memory/MEMORY.md"
        echo "✅ 已从备份恢复"
    fi
fi

# 检查技能库
if [ -d "$HOME/.openclaw/workspace/skills" ]; then
    echo "✅ 技能库正常"
else
    echo "⚠️ 技能库异常，切换到备份..."
    if [ -d "$HOME/.openclaw/workspace/skills-backup" ]; then
        cp -r "$HOME/.openclaw/workspace/skills-backup" "$HOME/.openclaw/workspace/skills"
        echo "✅ 已从备份恢复"
    fi
fi

echo "=== 检查完成 ==="
```

---

## 📅 备份计划

### 实时备份（触发式）

| 触发条件 | 备份内容 |
|----------|----------|
| 记忆文件修改后 | MEMORY.md → memory-backup |
| 技能库更新后 | skills/ → skills-backup |
| 配置文件修改后 | CLAUDE.md → CLAUDE.md.backup |

### 定时备份

| 周期 | 备份内容 |
|------|----------|
| 每小时 | 检查记忆文件变化 |
| 每天凌晨 3 点 | 完整备份所有文件 |
| 每周日 | 验证备份可用性 |
| 每月 1 号 | 清理旧备份（保留 30 天） |

---

## 🗄️ 备份版本管理

### 保留策略

```
每天备份 → 保留 7 天
每周备份 → 保留 4 周
每月备份 → 保留 12 个月
```

### 版本命名

```
MEMORY-20260309-120000.md  ← 日期 + 时间
SKILLS-20260309-latest/
```

---

## 🔐 校验和验证

### 创建校验和

```bash
# 生成校验和
md5sum "$HOME/.claude/memory/MEMORY.md" > "$HOME/.claude/memory/MEMORY.md.md5"

# 验证
md5sum -c "$HOME/.claude/memory/MEMORY.md.md5"
```

### 自动验证脚本

```bash
#!/bin/bash
# verify-backup.sh

MEMORY_FILE="$HOME/.claude/memory/MEMORY.md"
MEMORY_MD5="$MEMORY_FILE.md5"

if [ -f "$MEMORY_MD5" ]; then
    if md5sum -c "$MEMORY_MD5" > /dev/null 2>&1; then
        echo "✅ 记忆文件校验通过"
    else
        echo "❌ 记忆文件校验失败，可能已损坏"
        # 切换到备份
        cp "$HOME/.claude/memory-backup/MEMORY.md" "$MEMORY_FILE"
        echo "✅ 已从备份恢复"
    fi
fi
```

---

## 🚨 紧急恢复流程

### 场景 1：记忆文件丢失

```
1. 检测到 MEMORY.md 不存在
   ↓
2. 自动从 memory-backup 恢复
   ↓
3. 如果备份也不存在，从异地备份恢复
   ↓
4. 记录恢复事件
```

### 场景 2：技能库损坏

```
1. 检测到 skills/ 目录异常
   ↓
2. 自动切换到 skills-backup/
   ↓
3. 如果备份也损坏，从 git 恢复
   ↓
4. 记录恢复事件
```

### 场景 3：全部丢失（最坏情况）

```
1. 本地备份全部丢失
   ↓
2. 从异地备份恢复（云存储/外部硬盘）
   ↓
3. 从 git 仓库恢复代码
   ↓
4. 重新生成配置文件
```

---

## 📊 备份状态监控

### 状态文件

```json
{
    "lastBackup": "2026-03-09T12:00:00Z",
    "status": "ok",
    "files": {
        "memory": {
            "primary": "~/.claude/memory/MEMORY.md",
            "backup": "~/.claude/memory-backup/MEMORY.md",
            "lastChecked": "2026-03-09T12:00:00Z",
            "status": "ok"
        },
        "skills": {
            "primary": "~/.openclaw/workspace/skills/",
            "backup": "~/.openclaw/workspace/skills-backup/",
            "lastChecked": "2026-03-09T12:00:00Z",
            "status": "ok"
        }
    },
    "nextScheduledBackup": "2026-03-09T15:00:00Z"
}
```

---

## 📋 恢复测试

### 每月测试一次

```bash
# 1. 模拟记忆文件丢失
mv "$HOME/.claude/memory/MEMORY.md" "$HOME/.claude/memory/MEMORY.md.test"

# 2. 运行恢复脚本
./restore-memory.sh

# 3. 验证恢复成功
diff "$HOME/.claude/memory/MEMORY.md" "$HOME/.claude/memory-backup/MEMORY.md"

# 4. 清理测试文件
rm "$HOME/.claude/memory/MEMORY.md.test"
```

---

## 💡 杰克承诺

> 1. **每次修改后自动备份** — 不留时间窗口
> 2. **每小时检查一次** — 确保备份可用
> 3. **出问题时自动切换** — 无需罗总操作
> 4. **每天完整备份一次** — 全量备份所有文件
> 5. **每月测试恢复** — 确保备份真的能用
> 6. **记录所有备份事件** — 方便追溯

---

## 🔗 相关文件

| 文件 | 作用 |
|------|------|
| `skills-backup/BACKUP-README.md` | 技能备份说明 |
| `skills-backup/AUTO-SWITCH.md` | 自动切换说明 |
| 本文档 | 全局灾备说明 |

---

*版本：1.0 | 创建日期：2026-03-09 | 使用者：杰克（Claude）*

*最后更新：2026-03-09*

---

**三层备份，自动切换，万无一失**！🔒💪
