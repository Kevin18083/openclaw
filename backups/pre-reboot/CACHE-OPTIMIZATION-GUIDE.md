# 缓存优化系统 - 完整使用指南

## 📦 系统组成

### 核心文件
1. **cache-optimization-system.js** - 核心优化系统（模板库 + 优化器）
2. **cache-auto-check.js** - 自动排查脚本
3. **cache-optimization-20rounds.js** - 20 轮测试脚本
4. **cache-optimization-log.json** - 运行时统计（自动生成）
5. **cache-optimization-report.md** - 排查报告（自动生成）

### 模板库（3 阶段全覆盖）

#### 阶段 1: 基础问答（5 个模板）
| 模板 | 名称 | 目标命中率 |
|------|------|-----------|
| weather | 天气查询 | 70% |
| fact | 事实查询 | 70% |
| calculation | 计算问题 | 75% |
| definition | 定义解释 | 72% |
| list | 列表生成 | 75% |

#### 阶段 2: 中等难度（5 个模板）
| 模板 | 名称 | 目标命中率 |
|------|------|-----------|
| codeGeneration | 代码生成 | 70% |
| dataAnalysis | 数据分析 | 68% |
| textSummary | 文本摘要 | 70% |
| comparison | 对比分析 | 68% |
| problemSolving | 问题解决 | 72% |

#### 阶段 3: 高难度（5 个模板）
| 模板 | 名称 | 目标命中率 |
|------|------|-----------|
| systemDesign | 系统设计 | 75% |
| complexCode | 复杂代码 | 72% |
| reasoning | 多步推理 | 75% |
| debug | 调试分析 | 75% |
| creative | 创意写作 | 72% |

---

## 🚀 快速开始

### 1. 测试系统
```bash
node C:\Users\17589\.openclaw\workspace\cache-optimization-system.js
```

### 2. 运行自动排查
```bash
node C:\Users\17589\.openclaw\workspace\cache-auto-check.js
```

### 3. 在代码中使用

```javascript
const { CacheOptimizer, TemplateLibrary } = require('./cache-optimization-system');

// 创建优化器实例
const optimizer = new CacheOptimizer();

// === 示例 1: 天气查询 ===
const weatherTemplate = optimizer.selectTemplate('basic', 'weather');
const weatherPrompt = optimizer.applyTemplate(weatherTemplate, {
  location: '北京',
  timeRange: '今天'
});
// 使用 weatherPrompt 调用 AI...

// === 示例 2: 代码生成 ===
const codeTemplate = optimizer.selectTemplate('intermediate', 'code');
const codePrompt = optimizer.applyTemplate(codeTemplate, {
  functionality: '计算斐波那契数列',
  language: 'Python',
  inputs: 'n (整数)',
  outputs: '斐波那契数列第 n 项'
});

// === 示例 3: 系统设计 ===
const designTemplate = optimizer.selectTemplate('advanced', 'system');
const designPrompt = optimizer.applyTemplate(designTemplate, {
  functionalReqs: '短链接生成、重定向、统计',
  performanceReqs: 'QPS 10000+, 延迟 < 50ms',
  constraints: '预算有限，使用开源方案'
});

// === 记录请求结果 ===
optimizer.recordRequest(
  'basic',           // 类别
  '天气查询',         // 模板名
  true,              // 是否命中缓存
  1200,              // 响应时间 (ms)
  850                // Token 使用量
);

// === 查看当前命中率 ===
const hitRate = optimizer.getCurrentHitRate();
console.log(`当前命中率：${hitRate}%`);
```

---

## 📊 自动排查

### 手动运行
```bash
node C:\Users\17589\.openclaw\workspace\cache-auto-check.js
```

### 设置定时任务（每 3 天）

使用 Windows 任务计划程序：
1. 打开"任务计划程序"
2. 创建基本任务
3. 名称：缓存优化检查
4. 触发器：**每 3 天**
5. 操作：启动程序
   - 程序：`node`
   - 参数：`C:\Users\17589\.openclaw\workspace\cache-auto-check.js`

或者使用批处理文件：
```bash
cache-check-scheduled.bat
```

---

## 🔍 自动排查功能

### 检查内容
1. **整体命中率** - 是否达到 70% 目标
2. **模板表现** - 每个模板的命中率、响应时间、Token 使用
3. **异常检测** - 识别表现不佳的模板
4. **优化建议** - 自动生成改进建议

### 输出报告
- **console** - 即时显示排查结果
- **cache-optimization-report.md** - 详细 Markdown 报告
- **cache-optimization-log.json** - 统计数据持久化

### 告警级别
| 级别 | 命中率 | 行动 |
|------|--------|------|
| 🟢 良好 | ≥70% | 维持现状 |
| 🟡 需改进 | 50-70% | 优化低效模板 |
| 🔴 紧急 | <50% | 立即全面审查 |

---

## 🎯 优化策略

### 已实装的优化

#### 1. 固定系统消息
```javascript
const systemPrompts = {
  default: '你是一个专业的 AI 助手，名叫扎克，帮助用户解决问题。回答要简洁、准确、有用。',
  coding: '你是一个资深软件工程师，编写高质量、可维护的代码。使用最佳实践，添加必要注释。',
  analysis: '你是数据分析师，提供清晰的洞察和建议。用数据说话，避免模糊表述。'
};
```

#### 2. Prompt 前缀复用
所有模板都使用固定的开头格式，提高缓存命中。

#### 3. 输出格式标准化
每个模板都有明确的输出格式要求，减少变化。

#### 4. 自动排查优化
系统自动检测低效模板并生成优化建议。

---

## 📈 监控指标

### 核心指标
- **缓存命中率** - 目标 70%+
- **平均响应时间** - 目标 <1500ms
- **平均 Token 使用** - 持续降低
- **成本支出** - 目标降低 15-25%

### 查看实时数据
```javascript
const optimizer = new CacheOptimizer();
console.log('命中率:', optimizer.getCurrentHitRate(), '%');
```

### 查看报告
打开 `cache-optimization-report.md` 查看最新排查报告。

---

## 🛠️ 故障排查

### 问题 1: 命中率没有提升
**可能原因**:
- 模板使用不一致
- 动态变量太多
- 系统消息频繁变化

**解决方法**:
1. 检查是否使用了模板
2. 减少 prompt 中的动态内容
3. 固定系统消息

### 问题 2: 系统不记录数据
**可能原因**:
- 文件权限问题
- 路径不存在

**解决方法**:
```bash
# 检查工作区目录权限
dir C:\Users\17589\.openclaw\workspace
```

### 问题 3: 报告生成失败
**检查**:
1. Node.js 是否正常安装
2. 工作区目录是否可写
3. 磁盘空间是否充足

---

## 📝 最佳实践

### ✅ 应该做的
1. **始终使用模板** - 不要自己构建 prompt
2. **固定系统消息** - 同一个场景用同一个系统消息
3. **记录每次请求** - 让系统学习优化
4. **定期查看报告** - 每周至少一次
5. **遵循模板格式** - 不要随意修改模板结构

### ❌ 不应该做的
1. **频繁更换系统消息** - 会导致缓存失效
2. **混合使用多个模板** - 降低单个模板的复用率
3. **忽略低命中率** - 及时优化低效模板
4. **手动构建复杂 prompt** - 优先使用模板

---

## 🔄 版本历史

### v1.0 (2026-03-07)
- ✅ 3 阶段 15 个模板全部实装
- ✅ 自动排查系统
- ✅ 持续优化机制
- ✅ 详细报告生成
- ✅ 统计数据持久化

---

## 📞 支持

遇到问题或有优化建议，查看以下文件：
- `CACHE-OPTIMIZATION-IMPLEMENTATION.md` - 实装方案详情
- `cache-test-20rounds-result.json` - 20 轮测试数据
- `cache-optimization-log.json` - 运行统计

---

*最后更新：2026-03-07 06:48*
*维护者：扎克*
