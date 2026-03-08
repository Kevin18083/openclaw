"""
实际项目整合 - 极简核心
重点：完整流程、技术整合、实际应用
"""

print("🚀 实际项目整合（极简版）\n")

def project_workflow():
    print("=== 1. 完整项目流程 ===")
    print("🎯 阶段1：问题定义")
    print("   • 明确业务需求")
    print("   • 定义成功标准")
    print("   • 确定数据需求")
    
    print("\n📊 阶段2：数据准备")
    print("   • 数据收集和获取")
    print("   • 数据清洗和预处理")
    print("   • 探索性数据分析（EDA）")
    
    print("\n🤖 阶段3：模型开发")
    print("   • 特征工程")
    print("   • 模型选择和训练")
    print("   • 模型评估和优化")
    
    print("\n⚡ 阶段4：自动化部署")
    print("   • 创建自动化流水线")
    print("   • 部署到生产环境")
    print("   • 监控和维护")
    
    print("\n=== 2. 项目案例：电商销售分析系统 ===")
    
    print("\n📋 项目目标：")
    print("• 分析销售数据，发现业务洞察")
    print("• 预测未来销售额")
    print("• 自动生成日报和周报")
    print("• 监控关键业务指标")
    
    print("\n🔧 技术栈整合：")
    print("• 数据分析：Pandas + NumPy")
    print("• 数据可视化：Matplotlib + Seaborn")
    print("• 机器学习：Scikit-learn")
    print("• 自动化：Python脚本 + 定时任务")
    print("• 部署：Docker + 云服务器")
    
    print("\n=== 3. 代码架构 ===")
    
    print("\n📁 项目结构：")
    print("""
ecommerce_analysis/
├── data/                    # 数据目录
│   ├── raw/                # 原始数据
│   ├── processed/          # 处理后的数据
│   └── backups/            # 数据备份
├── src/                    # 源代码
│   ├── data_processing.py  # 数据处理
│   ├── analysis.py         # 数据分析
│   ├── modeling.py         # 机器学习模型
│   ├── visualization.py    # 数据可视化
│   └── automation.py       # 自动化脚本
├── notebooks/              # Jupyter笔记本
│   ├── exploration.ipynb   # 数据探索
│   └── modeling.ipynb      # 模型开发
├── reports/                # 报告输出
│   ├── daily/              # 日报
│   └── weekly/             # 周报
├── config/                 # 配置文件
│   └── settings.yaml       # 项目配置
├── tests/                  # 测试代码
├── requirements.txt        # 依赖包
└── README.md               # 项目说明
    """)
    
    print("\n=== 4. 核心模块实现 ===")
    
    print("\n📊 模块1：数据处理（data_processing.py）")
    print("""
import pandas as pd
import numpy as np

class DataProcessor:
    def __init__(self, data_path):
        self.data_path = data_path
        self.df = None
    
    def load_data(self):
        '''加载数据'''
        self.df = pd.read_csv(self.data_path)
        print(f"加载数据: {len(self.df)} 行, {len(self.df.columns)} 列")
        return self.df
    
    def clean_data(self):
        '''数据清洗'''
        # 处理缺失值
        self.df = self.df.dropna()
        
        # 处理异常值
        for col in ['sales', 'price']:
            q1 = self.df[col].quantile(0.25)
            q3 = self.df[col].quantile(0.75)
            iqr = q3 - q1
            self.df = self.df[(self.df[col] >= q1 - 1.5*iqr) & 
                              (self.df[col] <= q3 + 1.5*iqr)]
        
        # 数据类型转换
        self.df['date'] = pd.to_datetime(self.df['date'])
        
        return self.df
    
    def feature_engineering(self):
        '''特征工程'''
        # 时间特征
        self.df['year'] = self.df['date'].dt.year
        self.df['month'] = self.df['date'].dt.month
        self.df['day'] = self.df['date'].dt.day
        self.df['weekday'] = self.df['date'].dt.weekday
        
        # 业务特征
        self.df['revenue'] = self.df['sales'] * self.df['price']
        self.df['avg_price'] = self.df.groupby('product_id')['price'].transform('mean')
        
        return self.df
    """)
    
    print("\n📈 模块2：数据分析（analysis.py）")
    print("""
class SalesAnalyzer:
    def __init__(self, df):
        self.df = df
    
    def daily_analysis(self):
        '''每日分析'''
        daily_sales = self.df.groupby('date')['sales'].sum()
        daily_revenue = self.df.groupby('date')['revenue'].sum()
        
        return {
            'total_sales': self.df['sales'].sum(),
            'total_revenue': self.df['revenue'].sum(),
            'avg_daily_sales': daily_sales.mean(),
            'avg_daily_revenue': daily_revenue.mean(),
            'top_products': self.df.groupby('product_name')['sales'].sum().nlargest(5),
            'sales_trend': daily_sales.tail(7)  # 最近7天趋势
        }
    
    def customer_analysis(self):
        '''客户分析'''
        customer_stats = self.df.groupby('customer_id').agg({
            'sales': 'sum',
            'revenue': 'sum',
            'date': 'nunique'  # 购买天数
        })
        
        return {
            'total_customers': len(customer_stats),
            'repeat_customers': len(customer_stats[customer_stats['date'] > 1]),
            'avg_customer_value': customer_stats['revenue'].mean(),
            'top_customers': customer_stats.nlargest(5, 'revenue')
        }
    """)
    
    print("\n🤖 模块3：机器学习（modeling.py）")
    print("""
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

class SalesPredictor:
    def __init__(self, df):
        self.df = df
        self.model = None
    
    def prepare_features(self):
        '''准备特征'''
        features = ['month', 'day', 'weekday', 'avg_price', 'product_category']
        X = pd.get_dummies(self.df[features], drop_first=True)
        y = self.df['sales']
        
        return X, y
    
    def train_model(self, test_size=0.2):
        '''训练模型'''
        X, y = self.prepare_features()
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
        
        self.model = LinearRegression()
        self.model.fit(X_train, y_train)
        
        # 评估
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        return {
            'model': self.model,
            'mae': mae,
            'r2': r2,
            'features': X.columns.tolist()
        }
    
    def predict(self, new_data):
        '''预测新数据'''
        if self.model is None:
            raise ValueError("请先训练模型")
        
        return self.model.predict(new_data)
    """)
    
    print("\n⚡ 模块4：自动化（automation.py）")
    print("""
import schedule
import time
from datetime import datetime

class AutomationPipeline:
    def __init__(self):
        self.processor = DataProcessor('data/raw/sales.csv')
        self.analyzer = None
        self.predictor = None
    
    def daily_pipeline(self):
        '''每日自动化流水线'''
        print(f"{datetime.now()}: 🚀 开始每日自动化流程")
        
        # 1. 数据处理
        df = self.processor.load_data()
        df = self.processor.clean_data()
        df = self.processor.feature_engineering()
        
        # 2. 数据分析
        self.analyzer = SalesAnalyzer(df)
        daily_stats = self.analyzer.daily_analysis()
        customer_stats = self.analyzer.customer_analysis()
        
        # 3. 生成报告
        report = self.generate_report(daily_stats, customer_stats)
        
        # 4. 发送邮件
        self.send_report(report)
        
        print(f"{datetime.now()}: ✅ 每日流程完成")
    
    def weekly_pipeline(self):
        '''每周自动化流水线'''
        print(f"{datetime.now()}: 🚀 开始每周自动化流程")
        
        # 1. 训练预测模型
        df = self.processor.load_data()
        df = self.processor.clean_data()
        df = self.processor.feature_engineering()
        
        self.predictor = SalesPredictor(df)
        model_results = self.predictor.train_model()
        
        # 2. 生成周报
        weekly_report = self.generate_weekly_report(model_results)
        
        # 3. 发送周报
        self.send_weekly_report(weekly_report)
        
        print(f"{datetime.now()}: ✅ 每周流程完成")
    
    def schedule_tasks(self):
        '''调度任务'''
        # 每日早上9点执行
        schedule.every().day.at("09:00").do(self.daily_pipeline)
        
        # 每周一早上10点执行
        schedule.every().monday.at("10:00").do(self.weekly_pipeline)
        
        print("⏰ 任务调度已启动")
        
        # 保持运行
        while True:
            schedule.run_pending()
            time.sleep(60)
    """)

def best_practices():
    print("\n=== 5. 项目最佳实践 ===")
    print("✅ 代码组织：")
    print("   • 模块化设计，功能分离")
    print("   • 清晰的目录结构")
    print("   • 统一的代码风格")
    
    print("\n✅ 文档和注释：")
    print("   • 编写清晰的README")
    print("   • 函数和类添加文档字符串")
    print("   • 关键代码添加注释")
    
    print("\n✅ 测试和验证：")
    print("   • 编写单元测试")
    print("   • 数据验证检查")
    print("   • 集成测试流程")
    
    print("\n✅ 部署和维护：")
    print("   • 使用版本控制（Git）")
    print("   • 配置管理（环境变量、配置文件）")
    print("   • 监控和日志")
    print("   • 定期备份")

def next_steps():
    print("\n=== 6. 下一步行动 ===")
    print("🚀 立即可以做的：")
    print("1. 创建项目目录结构")
    print("2. 实现数据处理模块")
    print("3. 添加数据分析功能")
    print("4. 设置自动化调度")
    
    print("\n📈 进阶扩展：")
    print("• 添加Web界面（Streamlit/Flask）")
    print("• 集成数据库（MySQL/PostgreSQL）")
    print("• 添加实时数据流处理")
    print("• 部署到云平台（AWS/Azure/GCP）")
    
    print("\n🔧 学习资源：")
    print("• GitHub：参考优秀项目")
    print("• Kaggle：获取数据集和灵感")
    print("• 技术博客：学习最佳实践")
    print("• 开源社区：参与项目贡献")

if __name__ == "__main__":
    project_workflow()
    best_practices()
    next_steps()
    
    print("\n" + "="*50)
    print("✅ 实际项目整合（极简版）完成")
    
    print("\n📚 核心掌握：")
    print("1. 完整项目流程（4阶段）")
    print("2. 电商分析系统案例")
    print("3. 模块化代码架构")
    print("4. 技术栈整合应用")
    
    print("\n🔧 项目价值：")
    print("• 业务洞察：数据驱动决策")
    print("• 效率提升：自动化重复工作")
    print("• 预测能力：机器学习辅助")
    print("• 可扩展性：模块化设计")
    
    print("\n💡 记住：")
    print("• 从简单开始，逐步完善")
    print("• 解决实际业务问题")
    print("• 持续迭代和改进")
    print("• 文档和测试同样重要")