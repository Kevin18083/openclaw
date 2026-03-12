/**
 * Jack Edge API
 * 运行在 Cloudflare Workers 上的 Jack API
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

// 类型定义
type Bindings = {
  DEEPSEEK_API_KEY: string;
  DB: D1Database;
  CACHE: KVNamespace;
  MEMORY: KVNamespace;
};

type Variables = {
  userId: string;
};

// 创建 Hono 应用
const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 中间件
app.use('*', cors());

// JWT 认证（可选路径）
const authPaths = ['/api/review', '/api/scan', '/api/memory'];
app.use('/api/*', async (c, next) => {
  if (authPaths.some(path => c.req.path.startsWith(path))) {
    try {
      const token = c.req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      // 验证 token（简化版）
      const payload = JSON.parse(atob(token.split('.')[1]));
      c.set('userId', payload.userId);
    } catch (e) {
      return c.json({ error: 'Invalid token' }, 401);
    }
  }
  await next();
});

// 健康检查
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 代码审查 API
app.post(
  '/api/review',
  zValidator('json', z.object({
    code: z.string(),
    language: z.string().optional(),
    focus: z.array(z.string()).optional()
  })),
  async (c) => {
    const { code, language = 'typescript', focus = [] } = c.req.valid('json');

    // 调用 DeepSeek API
    const review = await callDeepSeek({
      system: `你是杰克，代码审查专家。请审查${language}代码。`,
      user: `请审查以下代码：\n\n${code}`
    });

    // 保存到 D1
    await c.env.DB.prepare(`
      INSERT INTO reviews (user_id, code, review, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(
      c.get('userId') || 'anonymous',
      code.slice(0, 1000),
      review,
      new Date().toISOString()
    ).run();

    return c.json({
      success: true,
      review,
      timestamp: new Date().toISOString()
    });
  }
);

// 安全扫描 API
app.post(
  '/api/scan',
  zValidator('json', z.object({
    code: z.string(),
    scanType: z.enum(['security', 'performance', 'quality']).optional()
  })),
  async (c) => {
    const { code, scanType = 'security' } = c.req.valid('json');

    const scan = await callDeepSeek({
      system: `你是安全专家。请进行${scanType}扫描。`,
      user: `请扫描以下代码的${scanType}问题：\n\n${code}`
    });

    return c.json({
      success: true,
      scanType,
      result: scan,
      timestamp: new Date().toISOString()
    });
  }
);

// 记忆查询 API（RAG）
app.get(
  '/api/memory',
  zValidator('query', z.object({
    q: z.string(),
    topK: z.string().transform(Number).default('5')
  })),
  async (c) => {
    const { q, topK } = c.req.valid('query');

    // 从 KV 缓存中查找
    const cacheKey = `memory:${q.slice(0, 50)}:${topK}`;
    const cached = await c.env.CACHE.get(cacheKey);

    if (cached) {
      return c.json({
        success: true,
        result: JSON.parse(cached),
        fromCache: true
      });
    }

    // 调用 RAG 查询
    const result = await ragQuery(q, topK);

    // 缓存 5 分钟
    await c.env.CACHE.put(cacheKey, JSON.stringify(result), {
      expirationTtl: 300
    });

    return c.json({
      success: true,
      result,
      fromCache: false
    });
  }
);

// 保存记忆 API
app.post(
  '/api/memory',
  zValidator('json', z.object({
    key: z.string(),
    value: z.string()
  })),
  async (c) => {
    const { key, value } = c.req.valid('json');

    await c.env.MEMORY.put(key, value);

    return c.json({
      success: true,
      message: `Memory saved: ${key}`
    });
  }
);

// 统计 API
app.get('/api/stats', async (c) => {
  const stats = await c.env.DB.prepare(`
    SELECT
      COUNT(*) as total_reviews,
      COUNT(DISTINCT user_id) as unique_users,
      DATE(MAX(created_at)) as last_review
    FROM reviews
  `).first<{ total_reviews: number; unique_users: number; last_review: string }>();

  return c.json({
    success: true,
    stats
  });
});

// DeepSeek API 调用
async function callDeepSeek(messages: { system: string; user: string }) {
  const apiKey = DEEPSEEK_API_KEY || 'sk-xxx';

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: messages.system },
        { role: 'user', content: messages.user }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// RAG 查询（简化版）
async function ragQuery(query: string, topK: number) {
  // 实际实现需要连接向量数据库
  // 这里使用 KV 存储的简单搜索
  const allKeys = await listMemoryKeys();
  const results = [];

  for (const key of allKeys.slice(0, topK)) {
    const value = await MEMORY.get(key);
    if (value && value.toLowerCase().includes(query.toLowerCase())) {
      results.push({ key, value });
    }
  }

  return results;
}

async function listMemoryKeys() {
  // 简化实现
  return ['memory:1', 'memory:2'];
}

// D1 数据库初始化
const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  code TEXT NOT NULL,
  review TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  scan_type TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_user ON scans(user_id);
`;

export default app;
