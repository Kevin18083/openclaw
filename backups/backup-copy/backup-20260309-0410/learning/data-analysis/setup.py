# 数据分析学习环境设置脚本
import subprocess
import sys

def install_packages():
    """安装数据分析所需的Python包"""
    packages = [
        'pandas',      # 数据处理
        'numpy',       # 数值计算
        'matplotlib',  # 数据可视化
        'seaborn',     # 统计可视化
        'jupyter',     # 交互式笔记本
        'scikit-learn' # 机器学习基础
    ]
    
    print("📦 开始安装数据分析所需的Python包...")
    
    for package in packages:
        try:
            print(f"正在安装 {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ {package} 安装成功")
        except subprocess.CalledProcessError as e:
            print(f"❌ {package} 安装失败: {e}")
    
    print("\n🎉 所有包安装完成！")

def verify_installation():
    """验证包安装是否成功"""
    print("\n🔍 验证安装...")
    
    import_checks = [
        ('pandas', 'pd'),
        ('numpy', 'np'),
        ('matplotlib.pyplot', 'plt'),
        ('seaborn', 'sns'),
        ('sklearn', 'sklearn')
    ]
    
    for module, alias in import_checks:
        try:
            if '.' in module:
                # 处理子模块导入
                parts = module.split('.')
                exec(f"import {parts[0]}")
                print(f"✅ {module} 导入成功")
            else:
                exec(f"import {module} as {alias}")
                print(f"✅ {module} 导入成功")
        except ImportError as e:
            print(f"❌ {module} 导入失败: {e}")
    
    print("\n✅ 环境验证完成")

if __name__ == "__main__":
    print("🚀 数据分析学习环境设置")
    print("=" * 50)
    
    # 检查Python版本
    print(f"Python版本: {sys.version}")
    
    # 安装包
    install_packages()
    
    # 验证安装
    verify_installation()
    
    print("\n" + "=" * 50)
    print("🎉 数据分析学习环境准备就绪！")
    print("可以开始学习：")
    print("1. Pandas数据处理")
    print("2. NumPy数值计算")
    print("3. 数据可视化")
    print("4. 基础分析")