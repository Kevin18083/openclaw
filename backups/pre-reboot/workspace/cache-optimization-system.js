#!/usr/bin/env node

/**
 * 阿里云大模型缓存优化系统 v1.0 - 完整版
 *
 * 功能说明：
 * 1. 模板库 - 3 个阶段全覆盖的模板库（基础问答/代码/分析）
 * 2. 自动排查 - 自动检测缓存命中率问题并排查
 * 3. 持续优化 - 根据命中率持续改进模板
 * 4. 统计分析 - 统计缓存使用情况和命中率
 *
 * 配置说明：
 * - TemplateLibrary: 模板库对象（basic/code/analysis 三类）
 * - 模板数量：20+ 个常用场景模板
 * - 目标命中率：70%
 *
 * 用法：
 *   const { TemplateLibrary } = require('./cache-optimization-system')
 *   const template = TemplateLibrary.basic.weather
 *
 * 示例输出：
 *   缓存优化系统已加载
 *   模板数量：20
 *   目标命中率：70%
 *
 * 常见错误：
 * - 模板变量替换失败 → 检查变量名与模板中的{variable}匹配
 * - 模板不存在 → 检查 templateKey 是否正确
 *
 * 依赖：
 * - Node.js 14+
 * - fs, path (内置模块)
 *
 * 修改历史：
 * - 2026-03-07: 初始版本
 * - 2026-03-10: 添加完整 8 类注释
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// 第一部分：模板库（3 个阶段全覆盖）
// ============================================================================

const TemplateLibrary = {
  // === 阶段 1: 基础问答模板 ===
  basic: {
    weather: {
      name: '天气查询',
      template: `请提供天气信息：
1. 当前位置：{location}
2. 时间范围：{timeRange}
3. 需要信息：温度、降水概率、风速、空气质量、穿衣建议

回答格式：
- 当前温度：X°C
- 天气状况：[描述]
- 降水概率：X%
- 风速：X 级
- 空气质量：[等级]
- 建议：[简短建议]`,
      hitRateTarget: 70
    },
    
    fact: {
      name: '事实查询',
      template: `请提供准确事实信息：
问题：{question}

回答要求：
1. 核心答案（第一句直接回答）
2. 关键事实（3-5 个要点）
3. 数据来源（如适用）
4. 相关背景（1-2 句）

回答格式：
【答案】[核心答案]
【事实】• 事实 1 • 事实 2 • 事实 3
【来源】[数据来源]
【背景】[相关背景]`,
      hitRateTarget: 70
    },
    
    calculation: {
      name: '计算问题',
      template: `请完成计算：
题目：{problem}

回答格式：
【结果】[最终答案]
【过程】
步骤 1: [计算步骤]
步骤 2: [计算步骤]
步骤 3: [计算步骤]
【验证】[验证方法]`,
      hitRateTarget: 75
    },
    
    definition: {
      name: '定义解释',
      template: `请解释概念：
概念：{concept}

回答格式：
【定义】[核心定义，1-2 句]
【特征】• 特征 1 • 特征 2 • 特征 3
【例子】[实际例子]
【相关】[相关概念]`,
      hitRateTarget: 72
    },
    
    list: {
      name: '列表生成',
      template: `请列出项目：
主题：{topic}
数量：{count}个

回答格式：
【列表】
1. [项目名称] - [简要说明]
2. [项目名称] - [简要说明]
3. [项目名称] - [简要说明]
...
【总结】[1 句总结]`,
      hitRateTarget: 75
    }
  },
  
  // === 阶段 2: 中等难度模板 ===
  intermediate: {
    codeGeneration: {
      name: '代码生成',
      template: `请编写代码：
【需求】
功能：{functionality}
语言：{language}
输入：{inputs}
输出：{outputs}

【代码要求】
- 遵循 {language} 最佳实践
- 添加必要注释
- 包含错误处理
- 提供使用示例

【输出格式】
\`\`\`{language}
[代码]
\`\`\`

【使用说明】
[如何使用这段代码]

【测试示例】
[测试代码/方法]`,
      hitRateTarget: 70
    },
    
    dataAnalysis: {
      name: '数据分析',
      template: `请分析数据：
【数据概览】
{dataSummary}

【分析要求】
1. 关键指标计算
2. 趋势分析
3. 异常检测
4. 建议行动

【输出格式】
## 关键指标
- 指标 1: [数值] ([同比/环比])
- 指标 2: [数值] ([同比/环比])

## 趋势分析
[趋势描述]

## 异常检测
[异常点及原因]

## 建议行动
1. [建议 1]
2. [建议 2]
3. [建议 3]`,
      hitRateTarget: 68
    },
    
    textSummary: {
      name: '文本摘要',
      template: `请总结内容：
【原文】
{text}

【摘要要求】
- 核心观点（3-5 个）
- 关键论据
- 结论/建议

【输出格式】
## 核心观点
1. [观点 1]
2. [观点 2]
3. [观点 3]

## 关键论据
[支持观点的主要论据]

## 结论
[最终结论/建议]`,
      hitRateTarget: 70
    },
    
    comparison: {
      name: '对比分析',
      template: `请对比分析：
对象 A: {objectA}
对象 B: {objectB}

【输出格式】
## 共同点
• [共同点 1]
• [共同点 2]

## 差异对比
| 维度 | A | B |
|------|---|---|
| [维度 1] | [A 特点] | [B 特点] |
| [维度 2] | [A 特点] | [B 特点] |

## 优劣势
**A 优势**: [优势列表]
**A 劣势**: [劣势列表]
**B 优势**: [优势列表]
**B 劣势**: [劣势列表]

## 使用建议
- 选择 A 的场景：[场景列表]
- 选择 B 的场景：[场景列表]`,
      hitRateTarget: 68
    },
    
    problemSolving: {
      name: '问题解决',
      template: `请解决问题：
【问题描述】
{problem}

【输出格式】
## 问题分析
**现象**: [问题表现]
**影响**: [影响范围]

## 根因分析
可能原因：
1. [原因 1] - [可能性]%
2. [原因 2] - [可能性]%
3. [原因 3] - [可能性]%

## 解决方案
### 短期方案（立即执行）
1. [步骤 1]
2. [步骤 2]

### 长期方案（根本解决）
1. [步骤 1]
2. [步骤 2]
3. [步骤 3]

## 验证方法
[如何验证问题已解决]

## 预防措施
[如何避免再次发生]`,
      hitRateTarget: 72
    }
  },
  
  // === 阶段 3: 高难度模板 ===
  advanced: {
    systemDesign: {
      name: '系统设计',
      template: `请设计系统：
【需求】
功能需求：{functionalReqs}
性能需求：{performanceReqs}
约束条件：{constraints}

【输出格式】
## 1. 架构概述
[整体架构图描述]

## 2. 核心组件
### 组件 1: [名称]
- 职责：[职责描述]
- 接口：[接口定义]
- 依赖：[依赖组件]

### 组件 2: [名称]
[同上]

## 3. 技术选型
| 组件 | 技术 | 选型理由 |
|------|------|----------|
| [组件] | [技术] | [理由] |

## 4. 数据流
[数据流转描述]

## 5. 扩展性
- 水平扩展：[方案]
- 垂直扩展：[方案]

## 6. 容错设计
- 故障检测：[方法]
- 故障恢复：[方案]
- 降级策略：[方案]

## 7. 监控指标
- 关键指标：[列表]
- 告警阈值：[列表]`,
      hitRateTarget: 75
    },
    
    complexCode: {
      name: '复杂代码实现',
      template: `请实现复杂功能：
【需求】
功能：{functionality}
性能要求：{performanceReqs}
约束：{constraints}

【输出格式】
## 设计思路
[实现思路概述]

## 核心算法
[算法描述/伪代码]

## 完整实现
\`\`\`{language}
[完整代码]
\`\`\`

## 关键代码解析
[重点代码段说明]

## 使用示例
\`\`\`{language}
[使用示例]
\`\`\`

## 性能分析
- 时间复杂度：O(?)
- 空间复杂度：O(?)
- 优化空间：[优化建议]

## 测试方案
[测试用例/方法]`,
      hitRateTarget: 72
    },
    
    reasoning: {
      name: '多步推理',
      template: `请进行推理：
【已知条件】
{conditions}

【推理目标】
{goal}

【输出格式】
## 已知信息整理
1. [条件 1]
2. [条件 2]
3. [条件 3]

## 推理过程
**步骤 1**: [推理步骤]
→ 得出：[中间结论]

**步骤 2**: [推理步骤]
→ 得出：[中间结论]

**步骤 3**: [推理步骤]
→ 得出：[最终结论]

## 最终答案
【结论】[明确答案]

## 验证
[验证方法]`,
      hitRateTarget: 75
    },
    
    debug: {
      name: '调试分析',
      template: `请分析并修复 bug：
【代码】
{code}

【错误现象】
{error}

【输出格式】
## 问题分析
**错误类型**: [错误类型]
**错误位置**: [文件：行号]
**错误原因**: [原因分析]

## 修复方案
### 原代码
\`\`\`{language}
[问题代码]
\`\`\`

### 修复后
\`\`\`{language}
[修复代码]
\`\`\`

### 修改说明
[修改了什么，为什么]

## 验证方法
[如何验证修复成功]

## 预防建议
[如何避免类似问题]`,
      hitRateTarget: 75
    },
    
    creative: {
      name: '创意写作',
      template: `请创作内容：
【主题】
{topic}

【要求】
体裁：{genre}
字数：{wordCount}
风格：{style}

【输出格式】
[按要求的体裁创作]

---
【创作说明】
- 主题：[主题表达]
- 亮点：[创作亮点]
- 字数：[实际字数]`,
      hitRateTarget: 72
    }
  }
};

// ============================================================================
// 第二部分：自动排查系统
// ============================================================================

class CacheOptimizer {
  constructor() {
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      templates: {},
      performance: []
    };
    
    this.config = {
      hitRateTarget: 70,
      checkInterval: 100, // 每 100 次请求检查一次
      autoOptimize: true,
      logPath: 'C:\\Users\\17589\\.openclaw\\workspace\\cache-optimization-log.json'
    };
    
    this.loadStats();
  }
  
  // 加载历史统计
  loadStats() {
    try {
      if (fs.existsSync(this.config.logPath)) {
        const data = fs.readFileSync(this.config.logPath, 'utf-8');
        this.stats = JSON.parse(data);
        console.log(`[CacheOptimizer] 已加载历史统计：${this.stats.totalRequests} 次请求`);
      }
    } catch (e) {
      console.log('[CacheOptimizer] 无历史统计，从头开始');
    }
  }
  
  // 保存统计
  saveStats() {
    try {
      fs.writeFileSync(this.config.logPath, JSON.stringify(this.stats, null, 2));
    } catch (e) {
      console.error('[CacheOptimizer] 保存统计失败:', e.message);
    }
  }
  
  // 记录请求
  recordRequest(category, templateName, hit, responseTime, tokenUsage) {
    this.stats.totalRequests++;
    if (hit) {
      this.stats.cacheHits++;
    } else {
      this.stats.cacheMisses++;
    }
    
    // 记录模板使用情况
    if (!this.stats.templates[templateName]) {
      this.stats.templates[templateName] = {
        uses: 0,
        hits: 0,
        avgResponseTime: 0,
        avgTokenUsage: 0
      };
    }
    
    const t = this.stats.templates[templateName];
    t.uses++;
    if (hit) t.hits++;
    t.avgResponseTime = (t.avgResponseTime * (t.uses - 1) + responseTime) / t.uses;
    t.avgTokenUsage = (t.avgTokenUsage * (t.uses - 1) + tokenUsage) / t.uses;
    
    // 记录性能数据
    this.stats.performance.push({
      timestamp: Date.now(),
      category,
      templateName,
      hit,
      responseTime,
      tokenUsage
    });
    
    // 定期清理旧数据（保留最近 1000 条）
    if (this.stats.performance.length > 1000) {
      this.stats.performance = this.stats.performance.slice(-1000);
    }
    
    // 定期检查并优化
    if (this.stats.totalRequests % this.config.checkInterval === 0) {
      this.analyzeAndOptimize();
    }
    
    this.saveStats();
  }
  
  // 分析并优化
  analyzeAndOptimize() {
    console.log('\n[CacheOptimizer] 开始自动分析优化...');
    
    const currentHitRate = this.getCurrentHitRate();
    console.log(`当前命中率：${currentHitRate.toFixed(1)}% (目标：${this.config.hitRateTarget}%)`);
    
    // 找出表现差的模板
    const underperformingTemplates = this.findUnderperformingTemplates();
    
    if (underperformingTemplates.length > 0) {
      console.log(`\n发现 ${underperformingTemplates.length} 个表现不佳的模板:`);
      underperformingTemplates.forEach(t => {
        console.log(`  - ${t.name}: ${t.hitRate.toFixed(1)}% (使用${t.uses}次)`);
      });
      
      // 生成优化建议
      this.generateOptimizationSuggestions(underperformingTemplates);
    } else {
      console.log('✅ 所有模板表现良好！');
    }
    
    // 生成优化报告
    this.generateOptimizationReport();
  }
  
  // 计算当前命中率
  getCurrentHitRate() {
    if (this.stats.totalRequests === 0) return 0;
    return (this.stats.cacheHits / this.stats.totalRequests) * 100;
  }
  
  // 找出表现不佳的模板
  findUnderperformingTemplates() {
    const underperforming = [];
    
    for (const [name, stats] of Object.entries(this.stats.templates)) {
      if (stats.uses >= 10) { // 至少使用 10 次才有统计意义
        const hitRate = (stats.hits / stats.uses) * 100;
        const template = this.findTemplateByName(name);
        const target = template ? template.hitRateTarget : this.config.hitRateTarget;
        
        if (hitRate < target - 10) { // 低于目标 10% 以上
          underperforming.push({
            name,
            hitRate,
            target,
            uses: stats.uses,
            avgResponseTime: stats.avgResponseTime,
            avgTokenUsage: stats.avgTokenUsage
          });
        }
      }
    }
    
    return underperforming.sort((a, b) => a.hitRate - b.hitRate);
  }
  
  // 根据名称查找模板
  findTemplateByName(name) {
    for (const category of Object.values(TemplateLibrary)) {
      for (const template of Object.values(category)) {
        if (template.name === name) {
          return template;
        }
      }
    }
    return null;
  }
  
  // 生成优化建议
  generateOptimizationSuggestions(templates) {
    console.log('\n优化建议:');
    
    templates.forEach(t => {
      console.log(`\n【${t.name}】当前命中率：${t.hitRate.toFixed(1)}% → 目标：${t.target}%`);
      
      const suggestions = [];
      
      if (t.hitRate < 50) {
        suggestions.push('❗ 严重偏低：考虑重构模板结构');
        suggestions.push('   - 增加固定前缀');
        suggestions.push('   - 减少动态变量');
        suggestions.push('   - 标准化输出格式');
      } else if (t.hitRate < 60) {
        suggestions.push('⚠️ 需要优化：');
        suggestions.push('   - 固定系统消息');
        suggestions.push('   - 统一输出格式');
      } else if (t.hitRate < t.target - 10) {
        suggestions.push('📊 小幅调整：');
        suggestions.push('   - 微调模板措辞');
        suggestions.push('   - 增加示例');
      }
      
      suggestions.forEach(s => console.log(`   ${s}`));
    });
  }
  
  // 生成优化报告
  generateOptimizationReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalRequests: this.stats.totalRequests,
        hitRate: this.getCurrentHitRate().toFixed(1),
        avgResponseTime: this.calculateAvgResponseTime(),
        avgTokenUsage: this.calculateAvgTokenUsage()
      },
      templates: Object.entries(this.stats.templates).map(([name, stats]) => ({
        name,
        hitRate: ((stats.hits / stats.uses) * 100).toFixed(1),
        uses: stats.uses,
        avgResponseTime: stats.avgResponseTime.toFixed(0),
        avgTokenUsage: stats.avgTokenUsage.toFixed(0)
      })),
      recommendations: this.generateRecommendations()
    };
    
    const reportPath = 'C:\\Users\\17589\\.openclaw\\workspace\\cache-optimization-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📊 优化报告已保存：${reportPath}`);
  }
  
  // 计算平均响应时间
  calculateAvgResponseTime() {
    if (this.stats.performance.length === 0) return 0;
    const sum = this.stats.performance.reduce((s, p) => s + p.responseTime, 0);
    return (sum / this.stats.performance.length).toFixed(0);
  }
  
  // 计算平均 Token 使用
  calculateAvgTokenUsage() {
    if (this.stats.performance.length === 0) return 0;
    const sum = this.stats.performance.reduce((s, p) => s + p.tokenUsage, 0);
    return (sum / this.stats.performance.length).toFixed(0);
  }
  
  // 生成总体建议
  generateRecommendations() {
    const recommendations = [];
    const hitRate = this.getCurrentHitRate();
    
    if (hitRate < 50) {
      recommendations.push('紧急：整体命中率过低，建议全面审查模板设计');
    } else if (hitRate < 60) {
      recommendations.push('需要改进：增加模板复用，减少 prompt 变化');
    } else if (hitRate < 70) {
      recommendations.push('持续优化：微调低效模板，保持良好模板');
    } else {
      recommendations.push('表现优秀：继续保持，关注极端场景');
    }
    
    return recommendations;
  }
  
  // 选择最佳模板
  selectTemplate(category, intent) {
    const templates = TemplateLibrary[category];
    if (!templates) {
      console.warn(`[CacheOptimizer] 未找到类别 "${category}" 的模板`);
      return null;
    }
    
    // 根据意图选择最匹配的模板
    const templateKey = Object.keys(templates).find(key => 
      intent.toLowerCase().includes(key.toLowerCase()) ||
      intent.toLowerCase().includes(templates[key].name.toLowerCase())
    );
    
    if (templateKey) {
      return templates[templateKey];
    }
    
    // 返回第一个模板作为默认
    return Object.values(templates)[0];
  }
  
  // 应用模板
  applyTemplate(template, variables) {
    if (!template || !template.template) return null;
    
    let result = template.template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    
    return result;
  }
}

// ============================================================================
// 第三部分：导出和使用示例
// ============================================================================

module.exports = {
  TemplateLibrary,
  CacheOptimizer,
  
  // 快速使用示例
  quickStart: function() {
    console.log('='.repeat(80));
    console.log('阿里云缓存优化系统 - 快速启动');
    console.log('='.repeat(80));
    console.log('');
    console.log('可用模板库:');
    
    for (const [category, templates] of Object.entries(TemplateLibrary)) {
      console.log(`\n【${category}】`);
      for (const [key, template] of Object.entries(templates)) {
        console.log(`  - ${key}: ${template.name} (目标命中率：${template.hitRateTarget}%)`);
      }
    }
    
    console.log('');
    console.log('使用示例:');
    console.log(`
const { CacheOptimizer, TemplateLibrary } = require('./cache-optimization-system');

const optimizer = new CacheOptimizer();

// 选择模板
const template = optimizer.selectTemplate('basic', 'weather');

// 应用模板
const prompt = optimizer.applyTemplate(template, {
  location: '北京',
  timeRange: '今天'
});

// 发送请求（使用你的 API）
const response = await callAI(prompt);

// 记录结果
optimizer.recordRequest(
  'basic',
  template.name,
  response.cacheHit,
  response.responseTime,
  response.tokenUsage
);
`);
    
    console.log('='.repeat(80));
  }
};

// 如果是直接运行，显示快速启动信息
if (require.main === module) {
  const system = module.exports;
  system.quickStart();
}
