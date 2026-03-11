# Skill Vetter - 技能审查工具

> 学习时间：2026-03-07

---

## 📋 概述

Skill Vetter 是一个专业的技能审查和验证工具，用于确保 OpenClaw 技能的**安全性**、**质量**和**兼容性**。

---

## 🔧 核心功能

### 1. 安全检查
- 恶意代码检测
- 权限需求分析
- 外部依赖审查
- 数据安全评估

### 2. 代码质量审查
- 代码规范检查 (ESLint)
- 错误处理评估
- 性能优化建议
- 可维护性分析

### 3. 兼容性验证
- OpenClaw 版本兼容性
- 依赖包兼容性检查
- 系统环境要求验证

### 4. 功能完整性评估
- 文档完整性检查
- 示例代码验证
- 功能测试自动化

---

## 🚀 快速开始

### 命令行使用
```bash
# 审查指定技能
node vetter-cli.js --skill ./skills/my-skill

# 全面审查（包含所有检查项）
node vetter-cli.js --skill ./skills/my-skill --full

# 只进行安全检查
node vetter-cli.js --skill ./skills/my-skill --security-only

# 批量审查所有技能
node vetter-cli.js --all-skills
```

### JavaScript API
```javascript
const { SkillVetter } = require('./vetter-core.js');

const vetter = new SkillVetter();

// 审查一个技能
const report = await vetter.analyze('./skills/my-skill', {
  security: true,
  codeQuality: true,
  compatibility: true,
  dependencies: true
});

console.log('审查结果:', report.summary);
```

---

## 📊 审查报告格式

```json
{
  "skill": { "name": "技能名称", "version": "1.0.0" },
  "summary": {
    "overallScore": 85,
    "securityScore": 90,
    "qualityScore": 80,
    "compatibilityScore": 95,
    "riskLevel": "低风险"
  },
  "details": {
    "security": { "issues": [], "warnings": [] },
    "codeQuality": { "issues": [], "metrics": {} },
    "dependencies": { "vulnerabilities": [], "licenses": [] }
  }
}
```

---

## ⚠️ 风险等级

| 等级 | 分数 | 建议 |
|------|------|------|
| **低风险** | 90-100 | 安全可靠，推荐使用 |
| **中风险** | 70-89 | 需要注意，建议审查后使用 |
| **高风险** | 50-69 | 存在风险，需要谨慎使用 |
| **危险** | 0-49 | 高风险，不建议使用 |

---

## 🛠️ 安装依赖

```bash
# 代码质量工具
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 安全检查工具
npm install security-checker npm-audit

# 依赖分析工具
npm install depcheck license-checker
```

---

## 📁 使用场景

### 1. 技能开发者自检
```javascript
const selfCheck = await vetter.selfCheck('./my-skill');
if (selfCheck.securityScore < 80) {
  console.warn('安全评分较低，请检查问题');
}
```

### 2. 技能仓库管理
```bash
node vetter-cli.js --skill ./new-skill --output report.json
```

### 3. 用户技能选择
```javascript
async function evaluateSkillForUse(skillId) {
  const report = await vetter.analyzeSkill(skillId);
  if (report.riskLevel === '低风险' && report.summary.overallScore >= 80) {
    return { safeToUse: true, confidence: '高' };
  }
  return { safeToUse: false, reason: '安全风险过高' };
}
```

---

## ⚙️ 配置选项 (vetter-config.json)

```json
{
  "security": {
    "enableMalwareScan": true,
    "checkPermissions": true,
    "auditDependencies": true,
    "maxRiskScore": 70
  },
  "codeQuality": {
    "enableLinting": true,
    "checkDocumentation": true,
    "requireTests": false,
    "minQualityScore": 60
  },
  "compatibility": {
    "checkOpenClawVersion": true,
    "verifyDependencies": true
  }
}
```

---

## 🔗 相关链接

- **核心模块**: `vetter-core.js`
- **CLI 工具**: `vetter-cli.js`
- **配置文件**: `vetter-config.json`

---

*此技能记录永久保存*
