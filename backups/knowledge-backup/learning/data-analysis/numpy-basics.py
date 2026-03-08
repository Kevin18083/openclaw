"""
NumPy数值计算基础 - 精简核心
重点：数组操作、数学计算、统计函数
"""

print("🔢 NumPy数值计算基础\n")

class NumpySimulator:
    """NumPy核心功能模拟"""
    
    @staticmethod
    def demonstrate_basics():
        print("=== 1. 数组创建 ===")
        print("""
import numpy as np

# 创建数组
arr1 = np.array([1, 2, 3, 4, 5])          # 一维数组
arr2 = np.array([[1, 2, 3], [4, 5, 6]])   # 二维数组
arr3 = np.zeros((3, 3))                   # 全0数组
arr4 = np.ones((2, 4))                    # 全1数组
arr5 = np.random.rand(3, 3)               # 随机数组
arr6 = np.arange(0, 10, 2)                # 范围数组 [0, 2, 4, 6, 8]
arr7 = np.linspace(0, 1, 5)               # 线性间隔 [0., 0.25, 0.5, 0.75, 1.]
        """)
        
        print("\n=== 2. 数组属性 ===")
        print("""
print(arr2.shape)    # 形状 (2, 3)
print(arr2.ndim)     # 维度 2
print(arr2.size)     # 元素数量 6
print(arr2.dtype)    # 数据类型 int64
        """)
        
        print("\n=== 3. 数组操作 ===")
        print("""
# 重塑形状
arr_reshaped = arr1.reshape(5, 1)

# 转置
arr_transposed = arr2.T

# 展平
arr_flattened = arr2.flatten()

# 拼接
arr_concat = np.concatenate([arr1, [6, 7, 8]])

# 分割
arr_split = np.split(arr1, [2, 4])  # 在索引2和4处分割
        """)
        
        print("\n=== 4. 数学运算 ===")
        print("""
# 基本运算
result_add = arr1 + 10           # 每个元素加10
result_mul = arr1 * 2            # 每个元素乘2
result_pow = arr1 ** 2           # 每个元素平方

# 数组间运算
arr_a = np.array([1, 2, 3])
arr_b = np.array([4, 5, 6])
result_sum = arr_a + arr_b       # 对应元素相加 [5, 7, 9]
result_dot = np.dot(arr_a, arr_b) # 点积 32

# 矩阵乘法
mat_a = np.array([[1, 2], [3, 4]])
mat_b = np.array([[5, 6], [7, 8]])
mat_mul = np.matmul(mat_a, mat_b)
        """)
        
        print("\n=== 5. 统计函数 ===")
        print("""
data = np.array([23, 45, 67, 89, 12, 34, 56, 78, 90, 21])

print(np.mean(data))     # 平均值
print(np.median(data))   # 中位数
print(np.std(data))      # 标准差
print(np.var(data))      # 方差
print(np.min(data))      # 最小值
print(np.max(data))      # 最大值
print(np.sum(data))      # 总和
print(np.percentile(data, 25))  # 25%分位数
print(np.percentile(data, 75))  # 75%分位数
        """)
        
        print("\n=== 6. 逻辑操作 ===")
        print("""
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

# 条件筛选
even_numbers = arr[arr % 2 == 0]          # 偶数 [2, 4, 6, 8, 10]
greater_than_5 = arr[arr > 5]             # 大于5的数 [6, 7, 8, 9, 10]

# 逻辑运算
condition = (arr > 3) & (arr < 8)         # 3到8之间的数
filtered = arr[condition]                 # [4, 5, 6, 7]

# 布尔索引
mask = np.array([True, False, True, False, True, False, True, False, True, False])
selected = arr[mask]                      # [1, 3, 5, 7, 9]
        """)
        
        print("\n=== 7. 广播机制 ===")
        print("""
# 广播：不同形状数组的运算
matrix = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
vector = np.array([10, 20, 30])

# 每行加vector
result = matrix + vector  # [[11, 22, 33], [14, 25, 36], [17, 28, 39]]

# 每列乘标量
result2 = matrix * 2      # 所有元素乘2
        """)
        
        print("\n=== 8. 实际案例：图像处理模拟 ===")
        print("""
# 模拟灰度图像数据 (5x5像素)
image = np.array([
    [100, 120, 130, 110, 105],
    [115, 125, 140, 135, 120],
    [110, 130, 150, 145, 130],
    [105, 120, 140, 135, 125],
    [100, 115, 130, 125, 115]
])

# 图像处理操作
brightened = image + 30               # 亮度增加
darkened = image - 20                 # 亮度降低
contrast = image * 1.5                # 对比度增强
blurred = (image[1:-1, 1:-1] + image[:-2, 1:-1] + image[2:, 1:-1] + 
           image[1:-1, :-2] + image[1:-1, 2:]) / 5  # 简单模糊

print("原始图像平均值:", np.mean(image))
print("亮度增加后平均值:", np.mean(brightened))
print("对比度增强后最大值:", np.max(contrast))
        """)

# 实际运行示例（简化版）
def run_numpy_examples():
    print("\n🎯 NumPy核心操作示例输出：")
    print("-" * 50)
    
    # 模拟数组操作
    print("1. 数组创建和操作:")
    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    print(f"   原始数组: {arr}")
    print(f"   形状: 1维, {len(arr)}个元素")
    
    print("\n2. 数学运算:")
    print(f"   平均值: {sum(arr)/len(arr):.1f}")
    print(f"   总和: {sum(arr)}")
    print(f"   最大值: {max(arr)}")
    print(f"   最小值: {min(arr)}")
    
    print("\n3. 条件筛选:")
    even = [x for x in arr if x % 2 == 0]
    odd = [x for x in arr if x % 2 == 1]
    print(f"   偶数: {even}")
    print(f"   奇数: {odd}")
    
    print("\n4. 矩阵运算模拟:")
    matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    print(f"   矩阵: {matrix}")
    
    # 计算行列和
    row_sums = [sum(row) for row in matrix]
    col_sums = [sum(matrix[i][j] for i in range(3)) for j in range(3)]
    
    print(f"   行和: {row_sums}")
    print(f"   列和: {col_sums}")
    
    print("\n5. 统计计算:")
    data = [23, 45, 67, 89, 12, 34, 56, 78, 90, 21]
    sorted_data = sorted(data)
    n = len(sorted_data)
    
    mean = sum(data) / n
    median = (sorted_data[n//2 - 1] + sorted_data[n//2]) / 2 if n % 2 == 0 else sorted_data[n//2]
    variance = sum((x - mean) ** 2 for x in data) / n
    std_dev = variance ** 0.5
    
    print(f"   数据: {data}")
    print(f"   平均值: {mean:.1f}")
    print(f"   中位数: {median}")
    print(f"   方差: {variance:.1f}")
    print(f"   标准差: {std_dev:.1f}")
    
    print("\n" + "-" * 50)
    print("✅ NumPy基础学习完成")
    print("核心掌握：数组操作、数学计算、统计函数、广播机制")

if __name__ == "__main__":
    # 演示NumPy基础
    NumpySimulator.demonstrate_basics()
    
    # 运行简化示例
    run_numpy_examples()
    
    print("\n📚 学习要点总结：")
    print("1. ndarray是核心数据结构（高效的多维数组）")
    print("2. 数组创建：array(), zeros(), ones(), arange(), linspace()")
    print("3. 数组操作：reshape, transpose, concatenate, split")
    print("4. 数学运算：元素级运算、矩阵运算、统计函数")
    print("5. 广播机制：不同形状数组的智能运算")
    print("6. 实际应用：科学计算、图像处理、机器学习数据预处理")
    
    print("\n🔧 实际运行需要：")
    print("pip install numpy")
    print("import numpy as np")
    
    print("\n💡 NumPy优势：")
    print("• 比Python列表快10-100倍")
    print("• 内存效率高")
    print("• 丰富的数学函数库")
    print("• 机器学习的基础依赖")