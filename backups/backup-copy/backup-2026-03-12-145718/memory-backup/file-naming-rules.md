# 文件命名规则 - 永久记忆

## 制定时间
- **日期**: 2026-03-12
- **制定者**: 扎克 (Zack)
- **制定原因**: 罗总指示，需要统一文件命名规范

## 核心规则

### ✅ 允许使用中文的文件
1. **12类注释相关文件**
   - 示例: `12-lei-zhushi-jiaoxue-zhinan.md`
   - 说明: 12类注释教学指南等文档

2. **文档文件**
   - README、指南、说明、教程等文档类文件
   - 用户手册、配置说明、使用指南等

### ❌ 必须使用英文或拼音的文件
1. **代码文件**
   - `.js`, `.py`, `.java`, `.cpp`, `.ts` 等编程语言文件

2. **框架文件**
   - 框架配置文件、模块定义文件等

3. **脚本文件**
   - `.sh`, `.bat`, `.ps1`, `.cmd` 等脚本文件

4. **配置文件**
   - `.json`, `.yaml`, `.yml`, `.toml`, `.ini`, `.env` 等配置文件

5. **其他非文档类文件**
   - 数据文件、资源文件、模板文件等

## 命名规范

### 1. 拼音命名规则
- 使用连字符 `-` 连接单词，不使用下划线 `_`
- 示例: `caozuo-rizhi.md` (正确) vs `caozuo_rizhi.md` (错误)

### 2. 英文命名规则
- 使用小写字母
- 使用连字符 `-` 连接单词
- 保持简洁、描述性
- 示例: `memory-config.md`, `self-improvement-guide.md`

### 3. 混合命名处理
- 避免中英混合文件名
- 中文文件名 → 改为全拼音
- 示例: `zhake-memory-peizhi.md` → `zhake-memory-config.md`

## 今日整理记录 (2026-03-12)

### 已重命名的文件
| 原文件名 | 新文件名 | 说明 |
|---------|---------|------|
| `caozuo_rizhi.md` | `caozuo-rizhi.md` | 操作日志，下划线改连字符 |
| `caozuo_rizhi_orig.md` | `caozuo-rizhi-orig.md` | 操作日志原始版 |
| `kuajing_leimu_shendu_xuexi.md` | `kuajing-leimu-shendu-xuexi.md` | 跨境类目深度学习 |
| `zhake-memory-peizhi.md` | `zhake-memory-config.md` | 扎克记忆配置，混合改英文 |
| `zhake-memory-zhengli-baogao.md` | `zhake-memory-cleanup-report.md` | 扎克记忆整理报告 |
| `zhake-ziwo-gaijin-shiyong-zhinan.md` | `zhake-self-improvement-guide.md` | 扎克自我改进使用指南 |

### 保持不变的文件
| 文件名 | 原因 |
|-------|------|
| `12-lei-zhushi-jiaoxue-zhinan.md` | 12类注释相关文件，允许中文 |
| `AB-lunhuan-baohu-peizhi.md` | 已经是拼音格式 |
| `jingxiang-xitong-shiyong-shuoming.md` | 已经是拼音格式 |
| 所有 `jack-teaches-zack-*.md` | 已经是英文格式 |
| 所有 `zach-learned-*.md` | 已经是英文格式 |
| 所有 `2026-03-*.md` | 日期格式文件 |
| `MEMORY.md` | 主记忆文件 |

## 检查清单

### 创建新文件时
- [ ] 判断文件类型：代码/脚本/配置 or 文档？
- [ ] 代码类 → 使用英文或拼音
- [ ] 文档类 → 判断是否12类注释相关
- [ ] 12类注释 → 可以使用中文
- [ ] 其他文档 → 建议使用拼音或英文

### 整理现有文件时
- [ ] 检查文件名是否有下划线，改为连字符
- [ ] 检查是否中英混合，改为全拼音或全英文
- [ ] 确认文件类型，应用相应规则

## 永久记忆
> **扎克要永远记住这个规则：**
> - 除了12类注释和文档允许中文
> - 文件、代码、框架、脚本等不允许用中文
> - 文件是英文就保持不变
> - 如果是中文就改为拼音

## 更新记录
- 2026-03-12: 规则制定并首次整理文件
- 规则已记录到 `MEMORY.md` 和 `2026-03-12.md`