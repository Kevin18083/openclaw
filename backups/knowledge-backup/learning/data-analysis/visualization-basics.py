"""
数据可视化基础 - 精简核心
重点：Matplotlib基础图表、Seaborn统计图表、实用案例
"""

print("📊 数据可视化基础\n")

class VisualizationSimulator:
    """数据可视化核心功能模拟"""
    
    @staticmethod
    def demonstrate_basics():
        print("=== 1. Matplotlib基础 ===")
        print("""
import matplotlib.pyplot as plt
import numpy as np

# 1.1 折线图 - 趋势分析
x = np.arange(0, 10, 0.1)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
plt.title('正弦函数曲线')
plt.xlabel('X轴')
plt.ylabel('Y轴')
plt.grid(True, alpha=0.3)
plt.legend()
plt.show()

# 1.2 散点图 - 相关性分析
x_scatter = np.random.randn(100)
y_scatter = x_scatter + np.random.randn(100) * 0.5

plt.figure(figsize=(8, 6))
plt.scatter(x_scatter, y_scatter, alpha=0.6, c='red', edgecolors='black')
plt.title('散点图 - 相关性分析')
plt.xlabel('特征X')
plt.ylabel('特征Y')
plt.show()

# 1.3 柱状图 - 分类比较
categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 33]

plt.figure(figsize=(8, 6))
bars = plt.bar(categories, values, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'])
plt.title('分类数据柱状图')
plt.xlabel('类别')
plt.ylabel('数值')
plt.ylim(0, 100)

# 添加数值标签
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 1,
             f'{height}', ha='center', va='bottom')

plt.show()

# 1.4 直方图 - 分布分析
data_hist = np.random.normal(0, 1, 1000)

plt.figure(figsize=(8, 6))
plt.hist(data_hist, bins=30, edgecolor='black', alpha=0.7, color='skyblue')
plt.title('数据分布直方图')
plt.xlabel('数值')
plt.ylabel('频数')
plt.grid(True, alpha=0.3)
plt.show()
        """)
        
        print("\n=== 2. Seaborn高级可视化 ===")
        print("""
import seaborn as sns
import pandas as pd

# 2.1 箱线图 - 数据分布和异常值
tips = sns.load_dataset('tips')  # Seaborn内置数据集

plt.figure(figsize=(10, 6))
sns.boxplot(x='day', y='total_bill', data=tips, palette='Set2')
plt.title('每日消费箱线图')
plt.xlabel('星期')
plt.ylabel('消费金额')
plt.show()

# 2.2 热力图 - 相关性矩阵
corr_matrix = tips.corr()

plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0,
            square=True, linewidths=1, cbar_kws={"shrink": 0.8})
plt.title('相关性热力图')
plt.show()

# 2.3 小提琴图 - 分布密度
plt.figure(figsize=(10, 6))
sns.violinplot(x='day', y='total_bill', data=tips, palette='muted', inner='quartile')
plt.title('消费金额分布小提琴图')
plt.xlabel('星期')
plt.ylabel('消费金额')
plt.show()

# 2.4 配对图 - 多变量关系
iris = sns.load_dataset('iris')
sns.pairplot(iris, hue='species', palette='husl', markers=['o', 's', 'D'])
plt.suptitle('鸢尾花数据集配对图', y=1.02)
plt.show()
        """)
        
        print("\n=== 3. 子图和多图布局 ===")
        print("""
# 创建2x2的子图布局
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# 子图1: 折线图
x = np.linspace(0, 10, 100)
axes[0, 0].plot(x, np.sin(x), 'r-', label='sin(x)')
axes[0, 0].plot(x, np.cos(x), 'b--', label='cos(x)')
axes[0, 0].set_title('三角函数')
axes[0, 0].set_xlabel('X')
axes[0, 0].set_ylabel('Y')
axes[0, 0].legend()
axes[0, 0].grid(True, alpha=0.3)

# 子图2: 散点图
x_scatter = np.random.randn(50)
y_scatter = x_scatter + np.random.randn(50) * 0.5
axes[0, 1].scatter(x_scatter, y_scatter, alpha=0.6, c='green')
axes[0, 1].set_title('随机散点图')
axes[0, 1].set_xlabel('X')
axes[0, 1].set_ylabel('Y')

# 子图3: 柱状图
categories = ['Q1', 'Q2', 'Q3', 'Q4']
values = [120, 135, 115, 140]
axes[1, 0].bar(categories, values, color=['#FF9999', '#66B2FF', '#99FF99', '#FFCC99'])
axes[1, 0].set_title('季度销售额')
axes[1, 0].set_xlabel('季度')
axes[1, 0].set_ylabel('销售额(万)')

# 子图4: 饼图
sizes = [30, 25, 20, 15, 10]
labels = ['产品A', '产品B', '产品C', '产品D', '其他']
axes[1, 1].pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90,
               colors=['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'])
axes[1, 1].set_title('产品市场份额')

plt.tight_layout()
plt.show()
        """)
        
        print("\n=== 4. 实际案例：销售数据可视化 ===")
        print("""
# 模拟销售数据
np.random.seed(42)
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

sales_data = {
    '月份': months,
    '线上销售额': np.random.randint(50, 200, 12),
    '线下销售额': np.random.randint(30, 150, 12),
    '客户数量': np.random.randint(100, 500, 12),
    '广告投入': np.random.randint(10, 50, 12)
}

df_sales = pd.DataFrame(sales_data)

# 创建可视化仪表板
fig = plt.figure(figsize=(15, 10))

# 1. 销售额趋势图
ax1 = plt.subplot(2, 2, 1)
ax1.plot(df_sales['月份'], df_sales['线上销售额'], 'o-', label='线上', linewidth=2)
ax1.plot(df_sales['月份'], df_sales['线下销售额'], 's--', label='线下', linewidth=2)
ax1.set_title('月度销售额趋势')
ax1.set_xlabel('月份')
ax1.set_ylabel('销售额(万)')
ax1.legend()
ax1.grid(True, alpha=0.3)

# 2. 销售额对比柱状图
ax2 = plt.subplot(2, 2, 2)
x = np.arange(len(months))
width = 0.35
ax2.bar(x - width/2, df_sales['线上销售额'], width, label='线上', color='#4ECDC4')
ax2.bar(x + width/2, df_sales['线下销售额'], width, label='线下', color='#FF6B6B')
ax2.set_title('线上线下销售额对比')
ax2.set_xlabel('月份')
ax2.set_ylabel('销售额(万)')
ax2.set_xticks(x)
ax2.set_xticklabels(months)
ax2.legend()

# 3. 客户数量与销售额散点图
ax3 = plt.subplot(2, 2, 3)
scatter = ax3.scatter(df_sales['客户数量'], df_sales['线上销售额'], 
                      c=df_sales['广告投入'], s=100, alpha=0.6, cmap='viridis')
ax3.set_title('客户数量 vs 销售额 (颜色:广告投入)')
ax3.set_xlabel('客户数量')
ax3.set_ylabel('线上销售额(万)')
plt.colorbar(scatter, ax=ax3, label='广告投入(万)')

# 4. 月度汇总饼图
ax4 = plt.subplot(2, 2, 4)
total_online = df_sales['线上销售额'].sum()
total_offline = df_sales['线下销售额'].sum()
ax4.pie([total_online, total_offline], 
        labels=['线上', '线下'], 
        autopct='%1.1f%%', 
        colors=['#4ECDC4', '#FF6B6B'],
        explode=(0.05, 0),
        shadow=True)
ax4.set_title('年度销售渠道占比')

plt.tight_layout()
plt.show()

# 计算关键指标
print("年度销售分析报告:")
print(f"线上总销售额: {total_online}万")
print(f"线下总销售额: {total_offline}万")
print(f"总销售额: {total_online + total_offline}万")
print(f"线上占比: {total_online/(total_online+total_offline)*100:.1f}%")
print(f"最佳月份: {df_sales.loc[df_sales['线上销售额'].idxmax(), '月份']}")
        """)

# 实际运行示例（简化版）
def run_visualization_examples():
    print("\n🎯 数据可视化核心概念输出：")
    print("-" * 50)
    
    print("1. 图表类型选择指南:")
    print("   📈 折线图 - 趋势分析、时间序列")
    print("   • 示例：月度销售额变化、用户增长趋势")
    print("   • 关键：连续数据、时间维度")
    
    print("\n   🔵 散点图 - 相关性分析、聚类识别")
    print("   • 示例：广告投入 vs 销售额、用户年龄 vs 消费")
    print("   • 关键：两个连续变量、发现模式")
    
    print("\n   📊 柱状图 - 分类比较、排名展示")
    print("   • 示例：产品销量对比、地区业绩排名")
    print("   • 关键：分类数据、数值比较")
    
    print("\n   📉 直方图 - 分布分析、异常检测")
    print("   • 示例：用户年龄分布、订单金额分布")
    print("   • 关键：单变量分布、数据形态")
    
    print("\n   🎻 箱线图 - 数据分布、异常值识别")
    print("   • 示例：各城市房价分布、员工薪资分布")
    print("   • 关键：五数概括、异常值检测")
    
    print("\n   🔥 热力图 - 相关性矩阵、密度展示")
    print("   • 示例：特征相关性、用户行为热图")
    print("   • 关键：矩阵数据、强度可视化")
    
    print("\n2. 可视化最佳实践:")
    print("   ✅ 选择合适的图表类型")
    print("   ✅ 保持简洁，避免信息过载")
    print("   ✅ 使用有意义的颜色和标签")
    print("   ✅ 添加必要的图例和标题")
    print("   ✅ 确保图表易于理解和解读")
    
    print("\n3. 实际应用场景:")
    print("   🏢 商业分析: 销售仪表板、KPI监控")
    print("   📱 产品分析: 用户行为分析、功能使用统计")
    print("   🔬 数据分析: 探索性分析、假设验证")
    print("   📝 报告制作: 数据故事讲述、决策支持")
    
    print("\n" + "-" * 50)
    print("✅ 数据可视化基础学习完成")
    print("核心掌握：图表选择、Matplotlib基础、Seaborn高级图表")

if __name__ == "__main__":
    # 演示可视化基础
    VisualizationSimulator.demonstrate_basics()
    
    # 运行简化示例
    run_visualization_examples()
    
    print("\n📚 学习要点总结：")
    print("1. Matplotlib: 基础绘图库，灵活但代码较多")
    print("2. Seaborn: 基于Matplotlib，统计图表更简单美观")
    print("3. 图表选择: 根据数据类型和分析目的选择合适图表")
    print("4. 子图布局: 创建多图表仪表板")
    print("5. 颜色主题: 使用有意义的颜色方案")
    print("6. 交互式: 可结合Plotly、Bokeh创建交互图表")
    
    print("\n🔧 实际运行需要：")
    print("pip install matplotlib seaborn pandas numpy")
    print("import matplotlib.pyplot as plt")
    print("import seaborn as sns")
    
    print("\n💡 可视化价值：")
    print("• 数据探索: 快速发现模式和异常")
    print("• 故事讲述: 用图表讲述数据故事")
    print("• 决策支持: 直观展示分析结果")
    print("• 沟通工具: 让非技术人员理解数据")