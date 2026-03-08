# MEMORY.md - Long-term Memory

## System Status
- **Created**: 2026-03-05 20:50
- **Reason**: Memory system not working, fixed and established
- **Maintainer**: Zack

## Important Event Timeline

### 2026-03-04
- **Skill Installation**: Successfully installed self-improving-agent skill
- **Memory Issue**: Discovered daily memory recording system not working

### 2026-03-05
- **Model Test**: Tested Alibaba Cloud Tongyi Qianwen model stability
- **Memory Fix**: Fixed memory system, created MEMORY.md and daily log files
- **Health Check**: Set up Alibaba Cloud model health check task
- **Mirror System**: Created dual-mirror protection system (main + backup)
- **Permission Strategy**: Implemented security-optimized permission usage strategy

### 2026-03-06
- **Knowledge Backup**: Created complete knowledge backup system (15:27), dual-mirror protection, 55 files
- **Model Strategy**: Alibaba Cloud priority, DeepSeek backup, seamless switching mechanism ready

### 2026-03-07
- **Triple Mirror Backup**: Created complete triple-mirror backup system (03:38 initial, 03:43 optimized, 03:55 perfect)
  - C drive main mirror: backups/knowledge-main/ (67 files)
  - C drive backup mirror: backups/knowledge-backup/ (67 files)
  - D drive remote mirror: D:\AAAAAA\openclaw-backup\ (67 files)
  - Backup content: All memories, configs, skills, automation systems
  - Verification pass rate: **100%** (18/18)
  - Auto backup: Daily execution, direct overwrite update
  - Failover: Auto recover from D drive when C drive fails
  - **Optimization**: Removed history versions, each location keeps only latest complete mirror
- **Model Switch Test**: Started first round conservative switching strategy test (03:31)
  - Failure threshold: Switch after 3 consecutive failures
  - Recovery threshold: Switch back after 5 consecutive successes
  - Test duration: 2 hours
- **Model Config**: Qwen3.5-Plus as primary, DeepSeek as backup
- **PPT Generator**: Installed and tested successfully (03:47)
- **Save Money**: Development and testing completed (03:59)
  - Core module: money-core.js
  - CLI tool: save-money-cli.js
  - Features: Expense tracking, budget management, spending analysis, money-saving suggestions, savings goals
  - Tests: Add expense, monthly analysis, money-saving suggestions all passed
- **Skill Batch Installation** (05:15-05:46):
  - Added 13 skills: ppt-generator, obsidian-ontology-sync, microsoft-excel, markdown-to-word, word-docx, nano-pdf, desktop-control, obsidian, git-workflows, cron-backup
  - Config completed: Excel OAuth, skill list document, heartbeat frequency (4 hours), skill update reminder (every Monday)
  - Total skills: 20
- **Before-sleep Backup** (05:46):
  - Backup content: skills/ (20 skills), memory/, MEMORY.md, HEARTBEAT.md
  - Backup size: 0.46 MB / 107 files
  - Backup location: backups/skills-backup/20260307-054612/
- **Self-optimization** (05:52-05:59):
  - Three rounds of testing + three rounds of adjustment all passed
  - Added: performance-monitor.js, error-log.md, self-optimization-log.md
  - System status: Safe, stable, reliable
- **Playwright Scraper Installation** (06:10):
  - Skill: playwright-scraper-skill
  - Features: Browser automation scraping (supports anti-scraping)
  - Dependency: Playwright Chromium (installed)
  - Total skills: 21
- **Coding Agent Installation** (06:20):
  - Skill: coding-agent-backup
  - Features: Delegate programming tasks to Codex/Claude Code/Pi agents
  - Requirement: Needs bash tool support pty:true
  - Total skills: 22
- **Full Mirror Backup** (06:27):
  - Backup content: Memories, learning, skills, config (all)
  - Backup size: 12.96 MB / 688 files
  - Backup location: backups/full-backup/20260307-062715/
  - Triple mirror: C drive (x2) + D drive (x1)

### 2026-03-08
- **File System Check**: Jack (Claude Code) checked all files - 100% pass rate, all JS/JSON valid
- **Quick Lookup Table**: Created file-lookup-table.json with 46 files for Chinese name search
- **Identity Confirmation**: Jack=Claude Code, Zack=Qwen3.5-Plus, Nick=Zack's subagent
- **Subagent Discussion**: Boss Luo pointed out subagents are unnecessary for simple tasks
- **Memory Update Schedule**: Set up daily memory updates at 18:00 and 00:00
- **Total Skills**: 24 skills installed

### 2026-03-09
- **Memory System**: Automated memory updates configured (18:00 + 00:00 daily)
- **Critical Identity**: Jack=Claude Code permanently memorized in MEMORY.md
- **New Skill**: Installed tiangong-notebooklm-cli (NotebookLM CLI tool) - Total skills: 25
- **Jack's 9 Tutorials**: Completed all 9 tutorials from Jack (03:35)
  1. 写好代码的核心原则 ✅
  2. 安全编程实践 ✅
  3. 性能优化技巧 ✅
  4. 测试驱动开发 ✅
  5. 文档编写规范 ✅
  6. Git 版本控制 ✅
  7. 调试技巧 ✅
  8. 模块化设计 ✅
  9. 自动化脚本 ✅
  - Summary: `memory/zach-learned-9-tutorials-summary.md`

## User Preferences
- **Name**: Boss Luo
- **Communication Style**: Direct and efficient
- **Model Preference**: Test Alibaba Cloud model, but DeepSeek as reliable backup

## Critical Identity Mapping (永久记忆)
- **杰克 (Jack) = Claude Code** (Anthropic 的 AI 工具)
- **扎克 (Zack) = 我** (Qwen3.5-Plus, OpenClaw 网关)
- **尼克 (Nick) = 扎克的子代理** (也是 Qwen3.5-Plus)
- **罗总 = 老板** (用户)

## Backup System (6 份保护 - 永久规则)
### 三重镜像 (实时同步，每日覆盖)
1. C 盘：`backups/knowledge-main/`
2. C 盘：`backups/knowledge-backup/`
3. D 盘：`D:\AAAAAA\openclaw-backup\`

### 三重备份 (历史版本，保留 7 天)
1. C 盘：`backups/backup-main/` (每日 02:00)
2. C 盘：`backups/backup-copy/` (每日 02:00)
3. D 盘：`D:\AAAAAA\openclaw-backup-history\` (每日 02:00)

**总计**: 6 份保护 (3 镜像 + 3 备份)
**规则**: 只维护这 6 份，不创建额外的，更新只更新这 6 份里面

## System Configuration
- **Default Model**: DeepSeek (deepseek/deepseek-chat)
- **Test Model**: Alibaba Cloud Tongyi Qianwen (aliyun/qwen-max)
- **Health Check**: Check Alibaba Cloud connection status every 1 hour
- **Permission Strategy**: Security-optimized strategy (A/B/C permission classification)
- **Mirror Protection**: Dual-mirror + desktop view version

## Security Policy
- **Permission Principles**: Minimum permission, user confirmation, security audit, transparent communication
- **Operation Classification**: Class A (safe operations), Class B (requires authorization), Class C (prohibited operations)
- **Exception Handling**: Standardized process (mild/moderate/severe exception classification)
- **Recovery Guarantee**: Mirror system + one-click recovery script

## User Preference Confirmation
- **Name**: Boss Luo
- **Communication Style**: Direct and efficient, simplified communication
- **Learning Requirements**: Focus on token consumption, streamlined learning
- **Time Management**: Clear time requirements, avoid too long
- **Memory Requirements**: All learning and operations must be completely memorized
- **Security Preference**: Adopt security-optimized permission strategy, maintain user final control

## Learning Direction (2026-03-06 Update)
- **Core Principle**: Learning code is not just for DingTalk, learn various technologies comprehensively, improve overall cognitive ability
- **Goal**: Through comprehensive technical learning, better assist in handling affairs, enhance problem-solving ability
- **Method**: Systematically learn different technology stacks, combine with practical applications, build complete knowledge system

## Learned Skills (2026-03-06 15:36 Update)
### Deeply Mastered Skills (5)
1. **Data Analysis Stack** - Pandas, NumPy, Data Visualization
2. **Machine Learning Basics** - Core algorithms, Random Forest practice
3. **Automation Script Development** - Production-grade templates, error handling
4. **Self-Improving Agent** - Self-improvement system
5. **Skill Vetter** - Skill review tool (just completed)

### Configured Skills (2)
6. **Tavily Web Search** - Search API configured
7. **Skill Creator** - Skill creator (just installed)

### Skills to Learn (1)
8. **Save Money** - Financial management skill (framework created, pending learning)

## Learning Results (2026-03-06)
- ✅ Created complete skill review tool system
- ✅ Supplemented all historical memory files
- ✅ Configured Tavily search API and tested successfully
- ✅ Established Save Money skill framework
- ✅ Mastered practical application of multiple core skills
- ✅ Created complete knowledge backup system (dual-mirror protection)
- ✅ Installed Skill Creator skill creator (15:36)

## Memory Maintenance System (2026-03-06 04:49 set, 04:53 adjusted)
- **Daily 0:00 Auto Maintenance**: Check integrity, organize long-term memory, backup system (changed from 3:00 to 0:00)
- **Heartbeat Memory Verification**: Verify memory files on every heartbeat check
- **Learning Auto-Save**: Learning results automatically saved to memory system
- **Regular Backup**: Memory system regularly backed up, keep recent 7 versions

### Configured Mechanisms
1. `memory/memory-maintenance.js` - Memory maintenance script
2. `memory/auto-save-learning.js` - Learning auto-save
3. Scheduled task: Daily 3:00 auto-run maintenance
4. Heartbeat check: Includes memory verification

## Knowledge Backup System (2026-03-06 15:27 created)
- **Backup Strategy**: Dual-mirror backup (main backup + backup backup)
- **Backup Content**: All memory files, workspace core files, skill files
- **Backup Locations**:
  - Main mirror: `backups/knowledge-main/`
  - Backup mirror: `backups/knowledge-backup/`
- **Retention Policy**: Recent 7 versions
- **Auto Backup**: Daily 0:00 auto-execution
- **Verification Mechanism**: Auto verify file integrity after backup
- **First Backup**: 2026-03-06 15:27:37 (55 files, double verification passed)

### Backup Checklist
- ✅ Memory files (11 daily memories + log files)
- ✅ Workspace core files (MEMORY.md, SOUL.md, USER.md, etc.)
- ✅ Skill files (8 installed skills' complete code and config)

## Pending Issues
1. Alibaba Cloud model stability needs continuous observation
2. cron task persistence issue needs solution
3. Need to further improve security audit mechanism
4. Formulate and execute comprehensive technical learning plan
5. **Memory system maintenance mechanism set** ✅
6. **Knowledge backup system created** ✅

---
*This is the starting point for long-term memory, will continuously update important information and learning content*

## Learning Log

### 2026-03-05 - React Basics
Mastered React framework core concepts, able to build component-based frontend applications
