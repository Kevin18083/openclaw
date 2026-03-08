# Save Money - 智能财务管理工具 ✅

## 完成状态

- ✅ 核心模块 (money-core.js)
- ✅ CLI 命令行工具 (save-money-cli.js)
- ✅ SKILL.md 文档
- ✅ npm 依赖安装 (chart.js, moment)
- ✅ 功能测试通过

## 快速使用

### 添加消费
```bash
cd C:\Users\17589\.openclaw\workspace\skills\save-money
node save-money-cli.js add --amount 50 --category 餐饮 --description 午餐
```

### 查看消费列表
```bash
node save-money-cli.js list --month 2026-03
```

### 设置预算
```bash
node save-money-cli.js budget --category 餐饮 --limit 1000
```

### 月度分析
```bash
node save-money-cli.js analyze --month 2026-03
```

### 省钱建议
```bash
node save-money-cli.js suggestions
```

### 消费趋势
```bash
node save-money-cli.js trend --months 6
```

### 储蓄目标
```bash
# 创建目标
node save-money-cli.js goal --add --name 旅游基金 --target 5000 --monthly 500

# 更新进度
node save-money-cli.js goal --update --id <目标 ID> --amount 100

# 查看目标
node save-money-cli.js goal
```

### 异常检测
```bash
node save-money-cli.js anomalies
```

## 核心功能

1. **消费跟踪** - 记录和管理日常消费
2. **预算管理** - 设置分类预算，超支提醒
3. **支出分析** - 月度/年度统计，趋势分析
4. **省钱建议** - 智能分析，个性化建议
5. **储蓄目标** - 目标设定，进度跟踪
6. **异常检测** - 识别大额和异常消费

## 测试记录

- ✅ 添加消费：成功
- ✅ 月度分析：成功
- ✅ 省钱建议：成功
- ✅ 数据持久化：成功

---
*技能完成时间：2026-03-07 03:59*
