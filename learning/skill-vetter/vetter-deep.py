"""
Skill Vetter 技能深入学习
重点：理解审查机制，掌握核心API
"""

print("🔍 Skill Vetter 技能深入学习\n")

def learn_vetter_core():
    print("=== 1. 技能审查的核心概念 ===")
    print("🎯 审查目标：")
    print("• 确保技能安全可靠")
    print("• 评估代码质量")
    print("• 验证兼容性")
    print("• 提供改进建议")
    
    print("\n=== 2. 四大审查维度 ===")
    
    print("\n🔒 维度1：安全审查")
    print("• 恶意代码检测")
    print("• 权限需求分析")
    print("• 依赖包安全检查")
    print("• 数据隐私保护")
    print("""
# 安全检查要点
1. 检查是否有危险的系统调用
2. 验证外部API调用的安全性
3. 分析文件操作权限
4. 评估网络访问风险
    """)
    
    print("\n📝 维度2：代码质量审查")
    print("• 代码规范检查")
    print("• 错误处理评估")
    print("• 性能优化建议")
    print("• 可维护性分析")
    print("""
# 代码质量指标
1. 代码复杂度（圈复杂度）
2. 重复代码比例
3. 注释覆盖率
4. 测试覆盖率
    """)
    
    print("\n🔧 维度3：兼容性审查")
    print("• OpenClaw版本兼容")
    print("• 依赖包版本兼容")
    print("• 系统环境要求")
    print("• 工具接口兼容")
    print("""
# 兼容性检查
1. package.json版本要求
2. Node.js版本兼容性
3. 操作系统限制
4. 硬件要求
    """)
    
    print("\n📚 维度4：功能完整性")
    print("• 文档完整性检查")
    print("• 示例代码验证")
    print("• 功能测试覆盖")
    print("• 用户体验评估")
    print("""
# 功能完整性检查
1. README文档是否完整
2. 是否有使用示例
3. 配置说明是否清晰
4. 故障排除指南
    """)
    
    print("\n=== 3. 审查流程 ===")
    
    print("\n🔄 标准审查流程")
    print("""
1. 收集技能信息
   - 读取skill.json/metadata
   - 分析目录结构
   - 收集代码文件

2. 静态代码分析
   - 语法检查
   - 安全模式扫描
   - 依赖分析

3. 动态测试（可选）
   - 运行单元测试
   - 功能验证
   - 性能测试

4. 生成审查报告
   - 计算各项得分
   - 识别问题和风险
   - 提供改进建议

5. 风险评估
   - 确定风险等级
   - 提供使用建议
   - 记录审查结果
    """)
    
    print("\n=== 4. 核心API使用方法 ===")
    
    print("\n🔧 基础审查API")
    print("""
const { SkillVetter } = require('skill-vetter');

// 创建审查器
const vetter = new SkillVetter({
  security: {
    enableMalwareScan: true,
    checkPermissions: true
  },
  codeQuality: {
    enableLinting: true,
    checkDocumentation: true
  }
});

// 审查技能
async function vetSkill(skillPath) {
  const report = await vetter.analyze(skillPath);
  
  console.log('审查结果:');
  console.log(`- 总体评分: ${report.summary.overallScore}/100`);
  console.log(`- 安全评分: ${report.summary.securityScore}/100`);
  console.log(`- 风险等级: ${report.summary.riskLevel}`);
  
  if (report.details.security.issues.length > 0) {
    console.log('\\n安全问题:');
    report.details.security.issues.forEach(issue => {
      console.log(`  - ${issue.level}: ${issue.message}`);
    });
  }
  
  return report;
}
    """)
    
    print("\n🔧 批量审查API")
    print("""
// 批量审查多个技能
async function vetMultipleSkills(skillPaths) {
  const results = [];
  
  for (const skillPath of skillPaths) {
    console.log(`审查: ${skillPath}`);
    const report = await vetter.analyze(skillPath);
    results.push({
      path: skillPath,
      score: report.summary.overallScore,
      risk: report.summary.riskLevel
    });
  }
  
  // 按评分排序
  results.sort((a, b) => b.score - a.score);
  
  return results;
}
    """)
    
    print("\n🔧 自定义审查规则")
    print("""
// 添加自定义审查规则
class CustomSecurityRule {
  constructor() {
    this.name = 'custom-security-check';
    this.description = '自定义安全检查';
  }
  
  async check(skill) {
    const issues = [];
    
    // 检查是否有敏感信息硬编码
    if (this.containsHardcodedSecrets(skill.code)) {
      issues.push({
        level: 'high',
        message: '发现硬编码的敏感信息',
        file: 'config.js',
        suggestion: '使用环境变量或配置文件'
      });
    }
    
    return {
      passed: issues.length === 0,
      issues: issues,
      score: issues.length === 0 ? 100 : 50
    };
  }
  
  containsHardcodedSecrets(code) {
    // 实现敏感信息检测逻辑
    const secretPatterns = [
      /password\\s*=\\s*['"][^'"]+['"]/i,
      /api[_-]?key\\s*=\\s*['"][^'"]+['"]/i,
      /token\\s*=\\s*['"][^'"]+['"]/i
    ];
    
    return secretPatterns.some(pattern => pattern.test(code));
  }
}

// 注册自定义规则
vetter.registerRule(new CustomSecurityRule());
    """)

def practical_applications():
    print("\n=== 5. 实际应用场景 ===")
    
    print("\n🏢 场景1：技能开发自检")
    print("""
# 开发过程中的自我审查
const selfCheckReport = await vetter.analyze('./my-skill');

if (selfCheckReport.summary.securityScore < 80) {
  console.warn('⚠️ 安全评分较低，请修复以下问题:');
  selfCheckReport.details.security.issues.forEach(issue => {
    console.log(`  - ${issue.file}:${issue.line} ${issue.message}`);
  });
}

if (selfCheckReport.summary.overallScore >= 90) {
  console.log('✅ 技能质量优秀，可以发布');
}
    """)
    
    print("\n📦 场景2：技能仓库管理")
    print("""
# 自动化审查新提交的技能
const newSkillReport = await vetter.analyze('./new-skill-submission');

// 根据审查结果决定是否接受
if (newSkillReport.summary.riskLevel === '低风险' && 
    newSkillReport.summary.overallScore >= 75) {
  console.log('✅ 技能通过审查，可以加入仓库');
  await addToSkillRepository('./new-skill-submission');
} else {
  console.log('❌ 技能未通过审查，需要改进');
  sendRejectionEmail(newSkillReport);
}
    """)
    
    print("\n👤 场景3：用户技能选择")
    print("""
# 用户在选择技能前进行审查
async function evaluateSkillForUser(skillId, userRequirements) {
  const report = await vetter.analyzeSkill(skillId);
  
  const evaluation = {
    skillId: skillId,
    overallScore: report.summary.overallScore,
    riskLevel: report.summary.riskLevel,
    suitableForUser: true,
    warnings: []
  };
  
  // 根据用户需求评估
  if (userRequirements.strictSecurity && report.summary.securityScore < 90) {
    evaluation.suitableForUser = false;
    evaluation.warnings.push('安全评分不符合要求');
  }
  
  if (userRequirements.needsGoodDocs && 
      report.details.codeQuality.documentationScore < 70) {
    evaluation.warnings.push('文档质量一般');
  }
  
  return evaluation;
}
    """)
    
    print("\n🔄 场景4：定期技能健康检查")
    print("""
# 定期审查已安装的技能
const schedule = require('node-schedule');

// 每月第一天进行审查
schedule.scheduleJob('0 0 1 * *', async () => {
  console.log('🔄 开始月度技能健康检查...');
  
  const installedSkills = await getAllInstalledSkills();
  const healthReport = {
    timestamp: new Date().toISOString(),
    totalSkills: installedSkills.length,
    skills: []
  };
  
  for (const skill of installedSkills) {
    const report = await vetter.analyze(skill.path);
    
    healthReport.skills.push({
      name: skill.name,
      score: report.summary.overallScore,
      riskLevel: report.summary.riskLevel,
      lastVetted: new Date().toISOString()
    });
    
    // 高风险技能告警
    if (report.summary.riskLevel === '高风险' || report.summary.riskLevel === '危险') {
      sendAlert(`⚠️ 高风险技能: ${skill.name} (评分: ${report.summary.overallScore})`);
    }
  }
  
  // 保存健康报告
  await saveHealthReport(healthReport);
  console.log('✅ 月度技能健康检查完成');
});
    """)

def best_practices():
    print("\n=== 6. 最佳实践 ===")
    
    print("\n✅ 审查策略建议：")
    print("1. **分级审查**：根据技能类型调整审查严格度")
    print("2. **增量审查**：只审查变更部分，提高效率")
    print("3. **白名单机制**：信任已验证的技能")
    print("4. **定期复审**：技能更新后重新审查")
    
    print("\n✅ 错误处理建议：")
    print("1. **优雅降级**：部分检查失败不影响整体审查")
    print("2. **详细日志**：记录审查过程和决策依据")
    print("3. **人工复核**：高风险决策需要人工确认")
    print("4. **反馈循环**：根据误报优化审查规则")
    
    print("\n✅ 性能优化建议：")
    print("1. **缓存结果**：相同技能使用缓存审查结果")
    print("2. **并行审查**：多个技能同时审查")
    print("3. **增量分析**：只分析变更的文件")
    print("4. **资源限制**：设置审查时间和内存限制")

def integration_with_workflow():
    print("\n=== 7. 与工作流集成 ===")
    
    print("\n🔧 集成到开发流程")
    print("""
# package.json 中添加审查脚本
{
  "scripts": {
    "dev": "node index.js",
    "test": "jest",
    "vet": "skill-vetter --skill . --output vet-report.json",
    "prepublish": "npm run test && npm run vet"
  }
}
    """)
    
    print("\n🔧 CI/CD流水线集成")
    print("""
# .github/workflows/vet-skills.yml
name: Skill Vetting
on: [push, pull_request]
jobs:
  vet-skill:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install Skill Vetter
        run: npm install skill-vetter
      - name: Run Skill Vetting
        run: npx skill-vetter --skill ./skills --min-score 80
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: vetting-report
          path: vetting-report.json
    """)
    
    print("\n🔧 与监控系统集成")
    print("""
// 实时监控技能状态
const monitoringSystem = {
  async checkSkillHealth(skillId) {
    const report = await vetter.analyzeSkill(skillId);
    
    return {
      status: report.summary.riskLevel === '低风险' ? 'healthy' : 'warning',
      metrics: {
        security: report.summary.securityScore,
        quality: report.summary.qualityScore,
        compatibility: report.summary.compatibilityScore
      },
      lastChecked: new Date().toISOString()
    };
  },
  
  async alertOnDegradation(skillId, previousScore, currentScore) {
    if (currentScore < previousScore - 10) {
      // 评分下降超过10分，发送告警
      sendAlert(`技能 ${skillId} 质量下降: ${previousScore} -> ${currentScore}`);
    }
  }
};
    """)

if __name__ == "__main__":
    learn_vetter_core()
    practical_applications()
    best_practices()
    integration_with_workflow()
    
    print("\n" + "="*50)
    print("✅ Skill Vetter 技能深入学习完成")
    
    print("\n📚 掌握要点：")
    print("1. 四大审查维度：安全、质量、兼容性、完整性")
    print("2. 标准审查流程：收集→分析→测试→报告→评估")
    print("3. 核心API使用：基础审查、批量审查、自定义规则")
    print("4. 实际应用场景：开发自检、仓库管理、用户选择、健康检查")
    
    print("\n🚀 下一步：")
    print("1. 安装必要的依赖包")
    print("2. 创建实际审查工具")
    print("3. 测试对现有技能的审查")
    print("4. 集成到开发和工作流程")
    
    print("\n💡 核心价值：")
    print("• 确保技能安全可靠")
    print("• 提升技能质量标准")
    print("• 降低使用风险")
    print("• 建立信任机制")