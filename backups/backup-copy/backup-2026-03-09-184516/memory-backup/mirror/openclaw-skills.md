# OpenClaw 技能系统

> 学习时间：2026-03-07

---

## 📊 技能清单（22 个）

### 📄 文档处理（5 个）
| 技能 | 功能 | 状态 |
|------|------|------|
| ppt-generator | 生成 HTML 演示稿 | ✅ |
| markdown-to-word | Markdown 转 Word | ✅ |
| word-docx | DOCX 技术参考 | ✅ |
| nano-pdf | PDF 编辑 | ✅ |
| microsoft-excel | Excel API 集成 | ✅ OAuth 已配置 |

### 🤖 AI 代理（3 个）
| 技能 | 功能 |
|------|------|
| proactive-agent | 主动代理，心跳检查、定时任务 |
| self-improving-agent | 自我改进代理 |
| elite-longterm-memory | 长期记忆管理 |

### 🔍 搜索工具（2 个）
| 技能 | 功能 |
|------|------|
| multi-search-engine | 多引擎搜索（Bing/Google/Baidu） |
| tavily-search | Tavily API 搜索 |

### 🛠️ 开发工具（3 个）
| 技能 | 功能 |
|------|------|
| skill-creator | 创建新技能 |
| skill-vetter | 技能审查验证 |
| openclaw-anything | 多功能工具集 |

### 其他技能
- **desktop-control** - 桌面自动化（鼠标/键盘/屏幕控制）
- **obsidian-ontology-sync** - Obsidian 知识图谱同步
- **save-money** - 财务管理
- **summarize** - URL/PDF/YouTube 摘要

---

## 🔧 Proactive Agent 详解

### 心跳检查配置
```markdown
# HEARTBEAT.md
## 每日检查
- [ ] 检查未读邮件
- [ ] 查看日历事件
- [ ] 检查待办事项

## 每小时检查
- [ ] 检查服务状态
- [ ] 监控资源使用
```

### 定时任务示例
```bash
# 每天早上 8 点提醒
openclaw cron add --schedule '0 8 * * *' --message "早安！今天有什么计划？"

# 每 30 分钟检查服务
openclaw cron add --schedule '*/30 * * * *' --message "检查系统服务状态"

# 每天下午 6 点日报
openclaw cron add --schedule '0 18 * * *' --message "生成今日工作报告"
```

---

## 📁 技能文件位置

- **技能目录**: `~/.openclaw/workspace/skills/`
- **技能清单**: `~/.openclaw/workspace/skills/SKILLS-INVENTORY.md`
- **工具笔记**: `~/.openclaw/workspace/TOOLS.md`

---

## 🎯 推荐学习路径

### 第 1 周（新手）
1. multi-search-engine - 快速搜索
2. proactive-agent - 任务管理
3. elite-longterm-memory - 记忆系统

### 第 2 周（进阶）
1. microsoft-excel - Excel API
2. ppt-generator - 演示文稿
3. save-money - 财务管理

### 第 3 周（高级）
1. desktop-control - 桌面自动化
2. obsidian-ontology-sync - 知识图谱
3. nano-pdf - PDF 编辑

---

*此技能记录永久保存*
