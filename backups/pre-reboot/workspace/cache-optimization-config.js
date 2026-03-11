#!/usr/bin/env node

/**
 * 阿里云缓存优化配置 v1.0
 *
 * 功能说明：
 * 1. 系统消息模板 - 固定系统消息提高缓存命中率
 * 2. Prompt 前缀复用 - 将不变指令放在最前面
 * 3. 缓存策略 - 配置缓存 TTL、命中率阈值、批处理
 * 4. 请求优化 - 模板化 prompt、合并相似请求
 * 5. 监控指标 - 追踪命中率、响应时间、token 用量
 *
 * 配置说明：
 * - systemPromptTemplate: 系统消息模板（assistant/coder/analyst）
 * - promptPrefix: Prompt 前缀（common/code/analysis）
 * - cacheOptimization: 缓存优化配置（TTL、批处理、前缀复用）
 * - requestOptimization: 请求优化配置
 * - metrics: 监控指标配置
 *
 * 用法：
 *   const config = require('./cache-optimization-config')
 *   const systemPrompt = config.systemPromptTemplate.coder
 *   const prefix = config.promptPrefix.code
 *
 * 示例输出：
 *   缓存配置已加载
 *   启用缓存：true
 *   缓存 TTL: 3600 秒
 *
 * 常见错误：
 * - 配置加载失败 → 检查文件路径
 * - 配置项不存在 → 检查配置对象键名
 *
 * 依赖：
 * - Node.js 14+
 *
 * 修改历史：
 * - 2026-03-07: 初始版本（5 轮测试验证）
 * - 2026-03-10: 添加完整 8 类注释
 */

module.exports = {
  // 1. 固定系统消息模板（第 2 轮优化）
  systemPromptTemplate: {
    assistant: '你是一个专业的 AI 助手，名叫扎克，帮助用户解决问题。回答要简洁、准确、有用。',
    coder: '你是一个资深软件工程师，编写高质量、可维护的代码。使用最佳实践，添加必要注释。',
    analyst: '你是数据分析师，提供清晰的洞察和建议。用数据说话，避免模糊表述。'
  },
  
  // 2. Prompt 前缀复用（第 3 轮优化）
  promptPrefix: {
    // 将不变的指令放在最前面，提高缓存命中
    common: '请按照以下要求回答：1) 简洁明了 2) 准确专业 3) 实用可操作\n\n',
    code: '请编写代码，要求：1) 遵循最佳实践 2) 添加注释 3) 考虑边界情况\n\n',
    analysis: '请分析以下内容，要求：1) 数据驱动 2) 清晰洞察 3) 可执行建议\n\n'
  },
  
  // 3. 缓存优化策略
  cacheOptimization: {
    // 启用 prompt 缓存
    enablePromptCache: true,
    
    // 缓存过期时间（秒）
    cacheTTL: 3600,
    
    // 最小缓存命中率阈值
    minHitRate: 0.5,
    
    // 自动批处理相似请求
    enableBatching: true,
    batchSize: 5,
    batchTimeoutMs: 100,
    
    // 前缀复用
    enablePrefixReuse: true,
    commonPrefix: '请按照以下要求回答：1) 简洁明了 2) 准确专业 3) 实用可操作\n\n'
  },
  
  // 4. 请求优化
  requestOptimization: {
    // 减少动态变量在 prompt 中的位置变化
    normalizeVariables: true,
    
    // 使用模板化 prompt
    useTemplates: true,
    
    // 合并相似请求
    mergeSimilarRequests: true,
    
    // 使用对话模式而非单次请求
    preferMultiTurn: true
  },
  
  // 5. 监控指标
  metrics: {
    trackHitRate: true,
    trackResponseTime: true,
    trackTokenUsage: true,
    reportInterval: 'hourly'
  }
};
