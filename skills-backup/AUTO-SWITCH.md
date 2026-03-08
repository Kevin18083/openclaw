# 自动切换机制

> **原则**：主库出问题时，杰克自动切换到备份库，无需人工干预！

---

## 🤖 自动切换流程

```
┌─────────────────────────────────────────────────────────┐
│  每次需要使用技能时                                      │
│       ↓                                                 │
│  1. 检查主技能库 (skills/) 是否可用                      │
│       ↓                                                 │
│  2. 可用 → 使用主库                                     │
│       ↓                                                 │
│  3. 不可用 → 自动切换到备份库 (skills-backup/)           │
│       ↓                                                 │
│  4. 记录切换事件                                        │
│       ↓                                                 │
│  5. 修复主库后自动同步回主库                            │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ 检查主库是否可用的标准

| 检查项 | 通过标准 |
|--------|----------|
| 目录存在 | `skills/` 目录存在 |
| 文件可读 | 至少能读取一个技能文件 |
| 内容有效 | 文件包含有效的 markdown 内容 |
| 无 Git 冲突 | 文件没有 `<<<<<<<` 冲突标记 |

---

## 🔧 自动切换实现

### 方案 1：Bash 脚本检查（推荐）

```bash
#!/bin/bash
# check-skills.sh - 检查技能库并自动切换

PRIMARY_DIR="skills"
BACKUP_DIR="skills-backup"
STATE_FILE=".skills-state.json"

# 检查主库是否可用
check_primary() {
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

    # 检查是否有 Git 冲突
    if grep -q "<<<<<<<" "$PRIMARY_DIR/code-quality-workflow/SKILL.md" 2>/dev/null; then
        return 1
    fi

    return 0
}

# 切换到备份库
switch_to_backup() {
    echo "⚠️  主技能库不可用，切换到备份库..."

    # 创建符号链接（如果主库是目录则重命名）
    if [ -d "$PRIMARY_DIR" ]; then
        mv "$PRIMARY_DIR" "${PRIMARY_DIR}.broken"
    fi

    # 复制备份库到主库位置
    cp -r "$BACKUP_DIR" "$PRIMARY_DIR"

    # 记录切换事件
    echo "{\"switchedAt\": \"$(date -Iseconds)\", \"reason\": \"primary_unavailable\"}" > "$STATE_FILE"

    echo "✅ 已切换到备份库"
}

# 主流程
main() {
    if check_primary; then
        echo "✅ 主技能库可用"
    else
        switch_to_backup
    fi
}

main
```

---

### 方案 2：Claude 内部检查（集成到工作流）

在每次使用技能前，我（杰克）自动执行以下检查：

```javascript
// 伪代码 - 杰克的内部检查逻辑

async function checkAndUseSkill(skillName) {
    const primaryPath = `skills/${skillName}/SKILL.md`;
    const backupPath = `skills-backup/${skillName}/SKILL.md`;

    try {
        // 尝试读取主库
        const content = await read(primaryPath);

        // 验证内容有效性
        if (isValidSkillContent(content)) {
            return content; // 主库可用
        }
    } catch (e) {
        // 主库不可用
    }

    // 切换到备份库
    console.log("⚠️  主技能库不可用，切换到备份库");
    const backupContent = await read(backupPath);

    // 记录切换事件
    logSwitchEvent({
        timestamp: Date.now(),
        reason: "primary_unavailable",
        skill: skillName
    });

    return backupContent;
}
```

---

## 📝 切换事件日志

### 日志格式

```json
{
    "switches": [
        {
            "timestamp": "2026-03-09T12:00:00Z",
            "from": "skills/",
            "to": "skills-backup/",
            "reason": "主库文件被删除",
            "autoSwitched": true
        }
    ]
}
```

### 日志位置

```
.skills-switch-log.json
```

---

## 🔄 自动修复主库

### 流程

```
切换到备份库后
       ↓
检测主库是否可以修复
       ↓
可以修复 → 从备份库同步回主库
       ↓
验证主库可用
       ↓
切换回主库（或保持备份库）
```

### 自动修复脚本

```bash
#!/bin/bash
# auto-repair-skills.sh

PRIMARY_DIR="skills"
BACKUP_DIR="skills-backup"

# 从备份库修复主库
repair_primary() {
    echo "🔧 开始修复主技能库..."

    # 删除损坏的主库
    rm -rf "$PRIMARY_DIR"

    # 从备份库复制
    cp -r "$BACKUP_DIR" "$PRIMARY_DIR"

    echo "✅ 主技能库已修复"
}

repair_primary
```

---

## 🧪 测试自动切换

### 模拟测试

```bash
# 1. 模拟主库被删除
rm -rf skills/

# 2. 运行检查脚本
./check-skills.sh

# 预期输出：
# ⚠️  主技能库不可用，切换到备份库...
# ✅ 已切换到备份库

# 3. 验证切换成功
ls skills/

# 4. 修复主库
./auto-repair-skills.sh
```

---

## 📊 切换状态

### 状态文件

```json
{
    "currentState": {
        "active": "primary",  // 或 "backup"
        "switchedAt": null,
        "reason": null
    },
    "history": [],
    "lastCheck": "2026-03-09T12:00:00Z"
}
```

### 状态检查命令

```bash
# 查看当前状态
cat .skills-state.json
```

---

## 🚨 通知机制

### 切换后通知罗总

```
杰克：罗总，主技能库出问题了，我已经自动切换到备份库。

原因：[具体原因]

时间：[切换时间]

修复计划：[如果有]
```

---

## 📋 自动切换规则

### 必须切换的情况

| 情况 | 自动切换 |
|------|----------|
| `skills/` 目录被删除 | ✅ |
| 技能文件无法读取 | ✅ |
| 文件内容被篡改（无效内容） | ✅ |
| Git 冲突未解决 | ✅ |
| 权限问题导致无法访问 | ✅ |

### 可以不切换的情况

| 情况 | 处理 |
|------|------|
| 单个文件有小问题 | 尝试修复，不切换 |
| 非关键技能文件缺失 | 记录警告，继续使用主库 |

---

## 💡 杰克承诺

> 1. **每次使用技能前自动检查** — 确保使用的是可用版本
> 2. **主库出问题时自动切换** — 不需要罗总操作
> 3. **切换后记录事件** — 方便追溯
> 4. **有机会时自动修复主库** — 恢复双份保障
> 5. **定期验证备份可用** — 每周至少一次

---

## 🎯 目标

```
零人工干预 = 罗总完全不用管
           ↓
    杰克自己搞定一切
```

---

*版本：1.0 | 创建日期：2026-03-09 | 使用者：杰克（Claude）*

*最后更新：2026-03-09*

---

**自动切换，无需操心**！🤖
