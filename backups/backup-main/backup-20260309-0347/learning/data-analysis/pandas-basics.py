"""
Pandas数据处理基础 - 精简核心
重点：数据读取、清洗、转换、分析
"""

print("🐼 Pandas数据处理基础\n")

# 模拟Pandas核心功能（实际需要安装pandas库）
class PandasSimulator:
    """Pandas核心功能模拟"""
    
    @staticmethod
    def demonstrate_basics():
        print("=== 1. 数据创建 ===")
        print("创建DataFrame（数据表）：")
        print("""
import pandas as pd

# 从字典创建
data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 35, 28],
    '城市': ['北京', '上海', '广州', '深圳'],
    '薪资': [15000, 18000, 22000, 16000]
}

df = pd.DataFrame(data)
print(df)
        """)
        
        print("\n=== 2. 数据查看 ===")
        print("""
print(df.head())      # 前5行
print(df.tail())      # 后5行  
print(df.info())      # 信息概览
print(df.describe())  # 统计描述
        """)
        
        print("\n=== 3. 数据选择 ===")
        print("""
# 选择列
names = df['姓名']
ages = df.年龄

# 选择行
row1 = df.iloc[0]      # 第一行
young = df[df['年龄'] < 30]  # 年龄<30的行

# 条件筛选
high_salary = df[df['薪资'] > 17000]
beijing_people = df[df['城市'] == '北京']
        """)
        
        print("\n=== 4. 数据清洗 ===")
        print("""
# 处理缺失值
df_clean = df.dropna()           # 删除缺失值
df_filled = df.fillna(0)         # 填充为0

# 删除重复值
df_unique = df.drop_duplicates()

# 数据类型转换
df['年龄'] = df['年龄'].astype(int)
        """)
        
        print("\n=== 5. 数据转换 ===")
        print("""
# 添加新列
df['年薪'] = df['薪资'] * 12
df['年龄组'] = pd.cut(df['年龄'], bins=[20, 30, 40], labels=['青年', '中年'])

# 分组聚合
grouped = df.groupby('城市')['薪资'].mean()
city_stats = df.groupby('城市').agg({
    '年龄': 'mean',
    '薪资': ['min', 'max', 'mean']
})
        """)
        
        print("\n=== 6. 数据排序 ===")
        print("""
# 按薪资降序
df_sorted = df.sort_values('薪资', ascending=False)

# 多列排序
df_multi_sorted = df.sort_values(['城市', '薪资'], ascending=[True, False])
        """)
        
        print("\n=== 7. 数据合并 ===")
        print("""
# 创建第二个DataFrame
data2 = {
    '姓名': ['张三', '李四', '钱七'],
    '部门': ['技术部', '市场部', '财务部'],
    '工龄': [3, 5, 2]
}
df2 = pd.DataFrame(data2)

# 合并数据
merged = pd.merge(df, df2, on='姓名', how='left')
        """)
        
        print("\n=== 8. 实际案例：销售数据分析 ===")
        print("""
# 模拟销售数据
sales_data = {
    '日期': pd.date_range('2024-01-01', periods=30, freq='D'),
    '产品': ['A', 'B', 'C'] * 10,
    '销售额': np.random.randint(1000, 5000, 30),
    '数量': np.random.randint(1, 10, 30)
}
sales_df = pd.DataFrame(sales_data)

# 分析
daily_sales = sales_df.groupby('日期')['销售额'].sum()
product_stats = sales_df.groupby('产品').agg({
    '销售额': 'sum',
    '数量': 'sum'
}).sort_values('销售额', ascending=False)

print("每日销售额:", daily_sales.head())
print("\\n产品统计:", product_stats)
        """)

# 实际运行示例（简化版）
def run_pandas_examples():
    print("\n🎯 Pandas核心操作示例输出：")
    print("-" * 50)
    
    # 模拟数据
    data = {
        '姓名': ['张三', '李四', '王五', '赵六'],
        '年龄': [25, 30, 35, 28],
        '城市': ['北京', '上海', '广州', '深圳'],
        '薪资': [15000, 18000, 22000, 16000]
    }
    
    print("1. 原始数据:")
    for name, age, city, salary in zip(data['姓名'], data['年龄'], data['城市'], data['薪资']):
        print(f"   {name}: {age}岁, {city}, 薪资:{salary}")
    
    print("\n2. 数据分析:")
    avg_age = sum(data['年龄']) / len(data['年龄'])
    avg_salary = sum(data['薪资']) / len(data['薪资'])
    max_salary = max(data['薪资'])
    min_salary = min(data['薪资'])
    
    print(f"   平均年龄: {avg_age:.1f}岁")
    print(f"   平均薪资: {avg_salary:.0f}元")
    print(f"   最高薪资: {max_salary}元 ({data['姓名'][data['薪资'].index(max_salary)]})")
    print(f"   最低薪资: {min_salary}元 ({data['姓名'][data['薪资'].index(min_salary)]})")
    
    print("\n3. 按城市分组:")
    city_groups = {}
    for city, salary in zip(data['城市'], data['薪资']):
        if city not in city_groups:
            city_groups[city] = []
        city_groups[city].append(salary)
    
    for city, salaries in city_groups.items():
        avg = sum(salaries) / len(salaries)
        print(f"   {city}: {len(salaries)}人, 平均薪资:{avg:.0f}元")
    
    print("\n" + "-" * 50)
    print("✅ Pandas基础学习完成")
    print("核心掌握：数据创建、选择、清洗、转换、分析")

if __name__ == "__main__":
    # 演示Pandas基础
    PandasSimulator.demonstrate_basics()
    
    # 运行简化示例
    run_pandas_examples()
    
    print("\n📚 学习要点总结：")
    print("1. DataFrame是核心数据结构（类似Excel表格）")
    print("2. 数据选择：列选择、行选择、条件筛选")
    print("3. 数据清洗：处理缺失值、重复值、类型转换")
    print("4. 数据转换：添加列、分组聚合、排序")
    print("5. 数据合并：多个数据表连接")
    print("6. 实际应用：销售分析、用户分析、日志分析等")
    
    print("\n🔧 实际运行需要：")
    print("pip install pandas numpy")
    print("import pandas as pd")
    print("import numpy as np")