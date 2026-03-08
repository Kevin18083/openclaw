"""
机器学习入门 - 极简核心
重点：概念理解、流程掌握、实际应用
"""

print("🤖 机器学习入门（极简版）\n")

def ml_basics():
    print("=== 1. 机器学习是什么？ ===")
    print("• 让计算机从数据中学习规律")
    print("• 自动改进性能，无需显式编程")
    print("• 应用：推荐系统、图像识别、预测分析")
    
    print("\n=== 2. 三大类型 ===")
    print("📊 监督学习（有标签）")
    print("   • 分类：邮件 spam/非spam")
    print("   • 回归：房价预测")
    print("   • 算法：决策树、SVM、神经网络")
    
    print("\n🔍 无监督学习（无标签）")
    print("   • 聚类：客户分群")
    print("   • 降维：数据压缩")
    print("   • 算法：K-means、PCA")
    
    print("\n🎮 强化学习（交互学习）")
    print("   • 智能体与环境交互")
    print("   • 通过奖励学习策略")
    print("   • 应用：游戏AI、机器人控制")
    
    print("\n=== 3. 核心流程 ===")
    print("1. 数据收集 → 获取原始数据")
    print("2. 数据清洗 → 处理缺失值、异常值")
    print("3. 特征工程 → 提取有用特征")
    print("4. 模型选择 → 选择合适算法")
    print("5. 模型训练 → 用数据训练模型")
    print("6. 模型评估 → 测试模型性能")
    print("7. 模型部署 → 实际应用")
    
    print("\n=== 4. 常用算法（掌握5个） ===")
    print("🌲 决策树 - 易于理解")
    print("   • 像流程图，if-else规则")
    print("   • 应用：客户分类、风险评估")
    
    print("\n📈 线性回归 - 预测数值")
    print("   • 找最佳拟合直线")
    print("   • 公式：y = wx + b")
    print("   • 应用：销量预测、趋势分析")
    
    print("\n🎯 逻辑回归 - 二分类")
    print("   • 预测概率（0-1之间）")
    print("   • 应用：是否购买、是否违约")
    
    print("\n🤝 K近邻 - 基于相似度")
    print("   • 看最近的K个邻居")
    print("   • 应用：推荐系统、模式识别")
    
    print("\n🌀 K-means - 聚类分析")
    print("   • 将数据分成K组")
    print("   • 应用：客户细分、图像压缩")
    
    print("\n=== 5. 实际案例：房价预测 ===")
    print("问题：根据房屋特征预测价格")
    print("\n步骤：")
    print("1. 数据：面积、卧室数、位置、房龄")
    print("2. 清洗：处理缺失值、异常值")
    print("3. 特征：面积、卧室数、位置编码")
    print("4. 模型：线性回归（预测价格）")
    print("5. 训练：用80%数据训练模型")
    print("6. 评估：用20%数据测试准确率")
    print("7. 预测：输入新房屋特征，输出价格")
    
    print("\n代码框架：")
    print("""
# 1. 准备数据
X = df[['面积', '卧室数', '位置编码']]
y = df['价格']

# 2. 分割数据
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 3. 训练模型
model = LinearRegression()
model.fit(X_train, y_train)

# 4. 预测
predictions = model.predict(X_test)

# 5. 评估
accuracy = model.score(X_test, y_test)
print(f"模型准确率: {accuracy:.2%}")
    """)
    
    print("\n=== 6. 评估指标 ===")
    print("📊 分类问题：")
    print("   • 准确率：(正确数/总数)")
    print("   • 精确率：预测为正的实际正比例")
    print("   • 召回率：实际正的预测正比例")
    print("   • F1分数：精确率和召回率的调和平均")
    
    print("\n📈 回归问题：")
    print("   • MAE：平均绝对误差")
    print("   • MSE：均方误差")
    print("   • R²：决定系数（越接近1越好）")
    
    print("\n=== 7. 工具和库 ===")
    print("🔧 Scikit-learn：主流ML库")
    print("   • 简单易用，算法丰富")
    print("   • 适合入门和实际项目")
    
    print("\n🧠 TensorFlow/PyTorch：深度学习")
    print("   • 神经网络、复杂模型")
    print("   • 需要较多计算资源")
    
    print("\n📊 部署工具：")
    print("   • Flask/FastAPI：API服务")
    print("   • Streamlit：快速Web应用")
    print("   • Docker：容器化部署")

def practical_advice():
    print("\n=== 8. 实用建议 ===")
    print("🎯 入门路径：")
    print("1. 先掌握1-2个算法（线性回归、决策树）")
    print("2. 完成1个完整项目（从数据到部署）")
    print("3. 理解评估指标和调参")
    print("4. 学习特征工程技巧")
    
    print("\n⚠️ 常见误区：")
    print("• 不要追求复杂模型（简单模型常更好）")
    print("• 数据质量 > 算法复杂度")
    print("• 特征工程是关键（80%时间在这里）")
    print("• 先验证业务问题，再选择技术方案")
    
    print("\n🚀 学习资源：")
    print("• Kaggle：实战项目和数据集")
    print("• Scikit-learn官方文档")
    print("• 《Python机器学习》")
    print("• 在线课程：Coursera、Udacity")

if __name__ == "__main__":
    ml_basics()
    practical_advice()
    
    print("\n" + "="*50)
    print("✅ 机器学习入门（极简版）完成")
    print("\n📚 核心掌握：")
    print("1. 机器学习三大类型")
    print("2. 7步核心流程")
    print("3. 5个常用算法")
    print("4. 评估指标和工具")
    print("5. 实际应用案例")
    
    print("\n🔧 下一步：")
    print("1. 安装：pip install scikit-learn pandas numpy")
    print("2. 尝试：Kaggle入门竞赛（Titanic、房价预测）")
    print("3. 实践：用真实数据完成一个完整项目")
    
    print("\n💡 记住：")
    print("• ML是工具，解决业务问题是目的")
    print("• 从简单开始，逐步深入")
    print("• 实践是最好的学习方式")