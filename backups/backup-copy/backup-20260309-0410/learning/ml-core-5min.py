"""
机器学习核心 - 5分钟精华
重点：随机森林实战
"""

print("🌲 机器学习核心：随机森林\n")

# 1. 为什么选随机森林？
print("✅ 优势：")
print("• 准确率高，不易过拟合")
print("• 处理数值和分类特征")
print("• 自动特征重要性评估")
print("• 无需太多数据预处理")

# 2. 核心代码模板
print("\n🔧 代码模板：")
code = """
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# 1. 准备数据
X = df.drop('target', axis=1)  # 特征
y = df['target']               # 目标

# 2. 分割数据
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. 创建模型
model = RandomForestClassifier(
    n_estimators=100,      # 树的数量
    max_depth=10,          # 树的最大深度
    min_samples_split=5,   # 分裂最小样本数
    random_state=42
)

# 4. 训练模型
model.fit(X_train, y_train)

# 5. 预测和评估
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"准确率: {accuracy:.2%}")

# 6. 特征重要性
importances = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)
print("\\n特征重要性:")
print(importances.head(10))
"""
print(code)

# 3. 2个关键调优技巧
print("\n🎯 调优技巧1：网格搜索")
print("""
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(model, param_grid, cv=5, scoring='accuracy')
grid_search.fit(X_train, y_train)
print(f"最佳参数: {grid_search.best_params_}")
print(f"最佳分数: {grid_search.best_score_:.2%}")
""")

print("\n🎯 调优技巧2：交叉验证")
print("""
from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"交叉验证准确率: {scores.mean():.2%} (±{scores.std():.2%})")
""")

# 4. 实际应用场景
print("\n🚀 应用场景：")
print("• 客户流失预测")
print("• 信用风险评估")
print("• 产品推荐")
print("• 异常检测")

print("\n✅ 5分钟掌握要点：")
print("1. 随机森林 = 多个决策树组合")
print("2. 调参：n_estimators, max_depth")
print("3. 评估：准确率 + 特征重要性")
print("4. 优化：网格搜索 + 交叉验证")

print("\n💡 记住：")
print("• 从100棵树开始")
print("• 查看特征重要性")
print("• 用交叉验证避免过拟合")