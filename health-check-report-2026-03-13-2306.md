# System Health Check Report
**Timestamp:** 2026-03-13 23:06 (Asia/Shanghai)
**Job ID:** 8e007a88-1eae-4721-ad0c-52f35d36b025

---

## 1. Alibaba Cloud Model Connection Status

**Status: ❌ FAILED**

- **Endpoint:** dashscope.aliyuncs.com
- **Network Connectivity:** ✅ Reachable
- **API Authentication:** ❌ Invalid API-key provided
- **Error:** `InvalidApiKey - Invalid API-key provided.`
- **Consecutive Failures:** 56

**Action Taken:** ⚠️ **AUTOMATIC FAILSAFE TRIGGERED** - Switched primary model to DeepSeek due to consecutive Alibaba Cloud failures.

---

## 2. Process Running Status

**Status: ✅ HEALTHY**

| Process | PID | CPU (%) | Memory (MB) | Start Time |
|---------|-----|---------|-------------|------------|
| node | 7576 | 124.03 | 208.9 | 2026/3/13 8:48:05 |
| node | 11248 | 0.27 | 39.2 | 2026/3/13 8:46:33 |
| node | 13092 | 2.48 | 39.9 | 2026/3/13 8:46:30 |
| node | 14152 | 65.59 | 171.9 | 2026/3/13 8:45:41 |
| node | 15372 | 1.02 | 39.4 | 2026/3/13 8:46:33 |
| node | 15684 | 0.20 | 37.5 | 2026/3/13 8:46:30 |

**Gateway Status:** Running (OpenClaw 2026.3.8)
**Session Status:** Active

---

## 3. Backup Integrity

**Status: ✅ HEALTHY**

- **Last Backup:** 2026-03-12 23:43:36
- **Total Mirrors:** 3 (All Successful)
- **Total Backups:** 3 (All Successful)
- **Verification Pass Rate:** 100%

**Backup Locations:**
1. `C:\Users\17589\.openclaw\workspace\backups\backup-main\` ✅
2. `C:\Users\17589\.openclaw\workspace\backups\backup-copy\` ✅
3. `D:\AAAAAA\openclaw-backup-history\` ✅

**Workspace Files:** 12,868 files

---

## 4. File System Status

**Status: ✅ HEALTHY**

| Drive | Used | Free | Usage |
|-------|------|------|-------|
| C: | 71.7 GB | 177.0 GB | 28.84% |

**Key Files Verified:**
- MEMORY.md: ✅ Exists
- openclaw.json: ✅ Exists
- restart-sentinel.json: ✅ Exists

---

## 5. Model Failsafe Action

**⚠️ PRIMARY MODEL SWITCHED**

| Model | Status | Action |
|-------|--------|--------|
| bailian/qwen3.5-plus | ❌ Invalid API Key | Disabled (Primary) |
| deepseek/deepseek-chat | ✅ Operational | **Now Primary** |

**Configuration Updated:** `C:\Users\17589\.openclaw\openclaw.json`
- Changed `agents.defaults.model.primary` from `bailian/qwen3.5-plus` to `deepseek/deepseek-chat`

---

## 6. Cron Job Status Summary

| Job | Status | Consecutive Errors |
|-----|--------|-------------------|
| Alibaba Cloud Model Health Check | ❌ Error | 56 |
| Jack Activity Monitor | ⚠️ Skipped | 0 |
| Daily Knowledge Backup - Triple Mirror | ✅ OK | 0 |
| Memory System Maintenance | ❌ Error | 3 |
| Daily Auto Backup - Triple Backup | ✅ OK | 0 |
| Daily Memory Update 00:00 | ✅ OK | 0 |
| Performance Monitor - Every 4 Hours | ❌ Error | 17 |
| Error Log Check - Daily | ❌ Error | 3 |
| Daily Memory Update 18:00 | ✅ OK | 0 |
| Daily Knowledge Backup 18:00 | ✅ OK | 0 |
| Daily Auto Backup 18:00 | ✅ OK | 0 |
| Jack Auto Learn - Daily | ✅ OK | 0 |
| Cache Optimization Auto-Check | ✅ OK | 0 |
| Skill Update Check | ❌ Error | 1 |

---

## Recommendations

1. **URGENT:** Update Alibaba Cloud API key in `openclaw.json` - current key `sk-sp-315aff3cdf38402eb91393dc85e8e32a` is invalid
2. Review cron jobs with consecutive errors (Performance Monitor, Memory System Maintenance, Error Log Check)
3. Consider running `openclaw doctor --non-interactive` for system diagnostics

---

**Report Generated:** 2026-03-13 23:06:00 (Asia/Shanghai)
**Next Scheduled Check:** 2026-03-14 00:06:19 (Asia/Shanghai)
