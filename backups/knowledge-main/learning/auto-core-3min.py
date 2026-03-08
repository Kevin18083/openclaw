"""
自动化核心 - 3分钟精华
重点：生产级脚本模板
"""

print("⚡ 自动化核心：生产级脚本模板\n")

# 1. 生产级脚本模板
print("✅ 生产级脚本特点：")
print("• 错误处理完善")
print("• 日志记录详细")
print("• 配置可管理")
print("• 易于维护")

# 2. 核心模板
print("\n🔧 生产级脚本模板：")
template = """
#!/usr/bin/env python3
"""
print(template)

template2 = """
\"\"\"
自动化脚本：数据备份和报告生成
作者：你的团队
版本：1.0.0
\"\"\"

import os
import sys
import logging
import pandas as pd
from datetime import datetime
from pathlib import Path

# 1. 配置日志
def setup_logging():
    '''配置日志系统'''
    log_dir = Path('logs')
    log_dir.mkdir(exist_ok=True)
    
    log_file = log_dir / f'automation_{datetime.now().strftime("%Y%m%d")}.log'
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler(sys.stdout)
        ]
    )
    return logging.getLogger(__name__)

# 2. 主函数（带错误处理）
def main():
    logger = setup_logging()
    logger.info("🚀 开始自动化任务")
    
    try:
        # 核心业务逻辑
        result = process_data()
        generate_report(result)
        send_notification("任务完成")
        
        logger.info("✅ 自动化任务完成")
        
    except Exception as e:
        logger.error(f"❌ 任务失败: {e}", exc_info=True)
        send_notification(f"任务失败: {e}")
        sys.exit(1)

# 3. 核心业务函数
def process_data():
    '''处理数据'''
    logger = logging.getLogger(__name__)
    
    try:
        # 读取数据
        data_path = Path('data/input.csv')
        if not data_path.exists():
            raise FileNotFoundError(f"数据文件不存在: {data_path}")
        
        df = pd.read_csv(data_path)
        logger.info(f"读取数据: {len(df)} 行")
        
        # 数据处理
        df_clean = clean_data(df)
        
        # 保存结果
        output_path = Path('data/processed')
        output_path.mkdir(exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = output_path / f'processed_{timestamp}.csv'
        df_clean.to_csv(output_file, index=False)
        
        logger.info(f"数据已保存: {output_file}")
        return output_file
        
    except Exception as e:
        logger.error(f"数据处理失败: {e}")
        raise

# 4. 辅助函数
def clean_data(df):
    '''数据清洗'''
    # 处理缺失值
    df = df.dropna()
    
    # 去除重复
    df = df.drop_duplicates()
    
    # 数据类型转换
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
    
    return df

def generate_report(data_file):
    '''生成报告'''
    logger = logging.getLogger(__name__)
    
    try:
        df = pd.read_csv(data_file)
        
        # 生成统计报告
        report = {
            '生成时间': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            '数据行数': len(df),
            '数据列数': len(df.columns),
            '处理时间': datetime.now().strftime('%Y%m%d')
        }
        
        # 保存报告
        report_path = Path('reports')
        report_path.mkdir(exist_ok=True)
        
        report_file = report_path / f'report_{datetime.now().strftime("%Y%m%d")}.json'
        pd.Series(report).to_json(report_file)
        
        logger.info(f"报告已生成: {report_file}")
        return report_file
        
    except Exception as e:
        logger.error(f"报告生成失败: {e}")
        raise

def send_notification(message):
    '''发送通知'''
    logger = logging.getLogger(__name__)
    logger.info(f"通知: {message}")
    # 实际可集成邮件、钉钉、微信等

if __name__ == "__main__":
    main()
"""
print(template2)

# 3. 关键要点
print("\n🎯 3分钟掌握要点：")
print("1. ✅ 完善的错误处理（try-except）")
print("2. 📝 详细的日志记录（logging模块）")
print("3. 🔧 模块化函数设计")
print("4. 📁 合理的目录结构")
print("5. ⚙️ 配置和参数管理")

print("\n🚀 立即使用：")
print("1. 复制模板代码")
print("2. 修改业务逻辑部分")
print("3. 添加自己的处理函数")
print("4. 测试运行")

print("\n💡 记住：")
print("• 日志是调试的最好工具")
print("• 错误处理让脚本更健壮")
print("• 模块化便于维护和扩展")