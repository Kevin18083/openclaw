---
name: Skill Vetter
description: 技能审查和验证工具 - 用于分析、评估和验证OpenClaw技能的安全性、质量和兼容性。提供安全检查、代码审查、依赖分析等功能。
metadata: {"clawdbot":{"requires":{"bins":["node","npm"]},"install":[{"id":"npm-deps","kind":"npm","package":"eslint","label":"安装代码检查工具"},{"id":"npm-deps-2","kind":"npm","package":"security-checker","label":"安装安全检查工具"}]}}
---

# Skill Vetter - 技能审查工具

## 概述

Skill Vetter 是一个专业的技能审查和验证工具，用于确保OpenClaw技能的安全性、质量和兼容性。它可以帮助开发者、管理员和用户评估技能的风险级别、代码质量和功能完整性。

## 核心功能

### 1. 安全检查
- 恶意代码检测
- 权限需求分析
- 外部依赖审查
- 数据安全评估

### 2. 代码质量审查
- 代码规范检查
- 错误处理评估
- 性能优化建议
- 可维护性分析

### 3. 兼容性验证
- OpenClaw版本兼容性
- 依赖包兼容性检查
- 系统环境要求验证
- 工具接口兼容性

### 4. 功能完整性评估
- 文档完整性检查
- 示例代码验证
- 功能测试自动化
- 用户体验评估

## 安装依赖

```bash
# 代码质量工具
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 安全检查工具  
npm install security-checker npm-audit

# 依赖分析工具
npm install depcheck license-checker
```

## 快速开始

### 基本使用

```javascript
const { SkillVetter } = require('./vetter-core.js');

// 创建审查器实例
const vetter = new SkillVetter();

// 审查一个技能
async function vetSkill(skillPath) {
  const report = await vetter.analyze(skillPath, {
    security: true,
    codeQuality: true,
    compatibility: true,
    dependencies: true
  });
  
  return report;
}

// 生成审查报告
const report = await vetSkill('./skills/my-skill');
console.log('审查结果:', report.summary);
```

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

## 审查标准

### 安全审查标准
1. **代码安全**
   - 无恶意代码或后门
   - 安全的依赖包版本
   - 适当的权限控制
   - 数据加密和隐私保护

2. **权限管理**
   - 最小权限原则
   - 明确的权限声明
   - 用户授权机制
   - 权限使用审计

3. **外部依赖**
   - 依赖包安全性评估
   - 许可证兼容性检查
   - 版本漏洞扫描
   - 依赖更新建议

### 代码质量标准
1. **代码规范**
   - 一致的代码风格
   - 清晰的注释和文档
   - 适当的错误处理
   - 模块化设计

2. **性能标准**
   - 合理的资源使用
   - 高效的算法实现
   - 内存泄漏预防
   - 响应时间优化

3. **可维护性**
   - 清晰的代码结构
   - 完整的测试覆盖
   - 详细的文档
   - 易于扩展的设计

## 审查报告格式

### 报告结构
```json
{
  "skill": {
    "name": "技能名称",
    "version": "版本号",
    "path": "技能路径"
  },
  "summary": {
    "overallScore": 85,
    "securityScore": 90,
    "qualityScore": 80,
    "compatibilityScore": 95,
    "riskLevel": "低风险"
  },
  "details": {
    "security": {
      "issues": [],
      "warnings": [],
      "recommendations": []
    },
    "codeQuality": {
      "issues": [],
      "metrics": {},
      "suggestions": []
    },
    "dependencies": {
      "vulnerabilities": [],
      "outdated": [],
      "licenses": []
    }
  },
  "timestamp": "2026-03-04T12:46:00Z",
  "vetterVersion": "1.0.0"
}
```

### 风险等级
- **低风险** (90-100分): 安全可靠，推荐使用
- **中风险** (70-89分): 需要注意，建议审查后使用
- **高风险** (50-69分): 存在风险，需要谨慎使用
- **危险** (0-49分): 高风险，不建议使用

## 使用场景

### 场景1：技能开发者自检
```javascript
// 开发过程中自我审查
const vetter = new SkillVetter();
const selfCheck = await vetter.selfCheck('./my-skill');

if (selfCheck.securityScore < 80) {
  console.warn('安全评分较低，请检查以下问题:');
  console.log(selfCheck.security.issues);
}
```

### 场景2：技能仓库管理
```bash
# 自动化审查新提交的技能
node vetter-cli.js --skill ./new-skill --output report.json

# 根据审查结果决定是否接受
if report.riskLevel == "低风险"; then
  echo "技能通过审查"
else
  echo "技能需要改进"
fi
```

### 场景3：用户技能选择
```javascript
// 用户在选择技能前进行审查
async function evaluateSkillForUse(skillId) {
  const report = await vetter.analyzeSkill(skillId);
  
  if (report.riskLevel === '低风险' && report.summary.overallScore >= 80) {
    return { safeToUse: true, confidence: '高' };
  } else if (report.riskLevel === '中风险') {
    return { safeToUse: true, confidence: '中', warnings: report.details.security.warnings };
  } else {
    return { safeToUse: false, reason: '安全风险过高' };
  }
}
```

## 集成与自动化

### CI/CD集成
```yaml
# GitHub Actions 示例
name: Skill Vetting
on: [push, pull_request]
jobs:
  vet-skill:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Skill Vetter
        run: npm install
      - name: Run Skill Vetting
        run: node vetter-cli.js --skill ./skills --output vetting-report.json
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: vetting-report
          path: vetting-report.json
```

### 自动化监控
```javascript
// 定期审查已安装技能
const schedule = require('node-schedule');

// 每周日凌晨审查所有技能
schedule.scheduleJob('0 0 * * 0', async () => {
  console.log('开始定期技能审查...');
  const allSkills = await getAllInstalledSkills();
  
  for (const skill of allSkills) {
    const report = await vetter.analyze(skill.path);
    if (report.riskLevel !== '低风险') {
      sendAlert(`技能 ${skill.name} 存在风险: ${report.summary.overallScore}分`);
    }
  }
});
```

## 配置选项

在 `vetter-config.json` 中配置：

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
    "verifyDependencies": true,
    "testToolInterfaces": true
  },
  "output": {
    "format": "json",
    "detailed": true,
    "saveReport": true,
    "reportPath": "./reports"
  }
}
```

## 扩展开发

### 添加新的审查规则
```javascript
// 自定义审查规则
class CustomSecurityRule extends BaseRule {
  constructor() {
    super('custom-security', '自定义安全检查');
  }
  
  async check(skill) {
    // 实现自定义检查逻辑
    const issues = [];
    
    // 检查特定模式
    if (this.containsSuspiciousPattern(skill.code)) {
      issues.push({
        level: 'warning',
        message: '发现可疑代码模式',
        file: 'index.js',
        line: 42
      });
    }
    
    return {
      passed: issues.length === 0,
      issues: issues,
      score: issues.length === 0 ? 100 : 70
    };
  }
}

// 注册自定义规则
vetter.registerRule(new CustomSecurityRule());
```

## 注意事项

1. **审查局限性**
   - 不能保证100%安全
   - 需要定期更新审查规则
   - 人工审查仍然必要

2. **性能考虑**
   - 大型技能可能需要较长时间审查
   - 可以配置审查深度
   - 支持增量审查

3. **误报处理**
   - 提供误报反馈机制
   - 支持自定义白名单
   - 定期优化审查算法

## 许可证

MIT License - 自由使用和修改，但不对审查结果承担法律责任。