"""
自动化脚本 - 极简核心
重点：常用场景、实用脚本、最佳实践
"""

print("⚡ 自动化脚本（极简版）\n")

def automation_basics():
    print("=== 1. 为什么自动化？ ===")
    print("• 节省时间：重复任务自动化")
    print("• 减少错误：避免人工操作失误")
    print("• 提高效率：7x24小时运行")
    print("• 可重复：确保每次结果一致")
    
    print("\n=== 2. 常用自动化场景 ===")
    print("📁 文件处理：")
    print("   • 批量重命名文件")
    print("   • 文件格式转换")
    print("   • 数据备份和同步")
    
    print("\n🌐 网络操作：")
    print("   • 网页数据抓取")
    print("   • API调用和数据收集")
    print("   • 网站监控和报警")
    
    print("\n💾 数据处理：")
    print("   • 数据清洗和转换")
    print("   • 报表自动生成")
    print("   • 数据验证和检查")
    
    print("\n🔧 系统管理：")
    print("   • 日志分析和监控")
    print("   • 系统健康检查")
    print("   • 定时任务调度")
    
    print("\n=== 3. Python自动化核心库 ===")
    print("📁 os / pathlib - 文件系统操作")
    print("   • 遍历目录、创建文件夹")
    print("   • 路径操作、文件检查")
    
    print("\n📄 pandas - 数据处理")
    print("   • 读写Excel/CSV/JSON")
    print("   • 数据清洗和转换")
    
    print("\n🌐 requests - 网络请求")
    print("   • HTTP请求、API调用")
    print("   • 网页内容获取")
    
    print("\n📧 smtplib / email - 邮件发送")
    print("   • 自动发送邮件")
    print("   • 邮件内容生成")
    
    print("\n⏰ schedule - 定时任务")
    print("   • 定时执行脚本")
    print("   • 周期性任务")
    
    print("\n=== 4. 实用脚本示例 ===")
    
    print("\n📊 示例1：数据备份脚本")
    print("""
import os
import shutil
from datetime import datetime

def backup_files(source_dir, backup_dir):
    '''备份指定目录的文件'''
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = os.path.join(backup_dir, f'backup_{timestamp}')
    
    # 创建备份目录
    os.makedirs(backup_path, exist_ok=True)
    
    # 复制文件
    for item in os.listdir(source_dir):
        source = os.path.join(source_dir, item)
        target = os.path.join(backup_path, item)
        
        if os.path.isfile(source):
            shutil.copy2(source, target)
        elif os.path.isdir(source):
            shutil.copytree(source, target)
    
    print(f'✅ 备份完成: {backup_path}')
    return backup_path

# 使用
backup_files('./data', './backups')
    """)
    
    print("\n📈 示例2：数据报表生成")
    print("""
import pandas as pd
from datetime import datetime

def generate_report(data_file, output_file):
    '''从数据文件生成报表'''
    # 读取数据
    df = pd.read_csv(data_file)
    
    # 数据分析
    summary = {
        '生成时间': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        '数据行数': len(df),
        '数据列数': len(df.columns),
        '开始日期': df['date'].min(),
        '结束日期': df['date'].max(),
        '总销售额': df['sales'].sum(),
        '平均销售额': df['sales'].mean(),
        '最大销售额': df['sales'].max(),
        '最小销售额': df['sales'].min()
    }
    
    # 生成报表
    report_df = pd.DataFrame([summary])
    report_df.to_excel(output_file, index=False)
    
    print(f'✅ 报表已生成: {output_file}')
    return output_file

# 使用
generate_report('sales_data.csv', 'sales_report.xlsx')
    """)
    
    print("\n📧 示例3：自动发送邮件")
    print("""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email_report(to_email, subject, content, attachment=None):
    '''发送带附件的邮件'''
    # 邮件配置
    sender = 'your_email@example.com'
    password = 'your_password'
    
    # 创建邮件
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = to_email
    msg['Subject'] = subject
    
    # 正文
    msg.attach(MIMEText(content, 'plain'))
    
    # 附件
    if attachment:
        with open(attachment, 'rb') as f:
            attach = MIMEApplication(f.read(), Name=os.path.basename(attachment))
        attach['Content-Disposition'] = f'attachment; filename="{os.path.basename(attachment)}"'
        msg.attach(attach)
    
    # 发送
    with smtplib.SMTP_SSL('smtp.example.com', 465) as server:
        server.login(sender, password)
        server.send_message(msg)
    
    print(f'✅ 邮件已发送至: {to_email}')

# 使用
send_email_report(
    'boss@company.com',
    '每日销售报表',
    '附件是今日销售报表，请查收。',
    'sales_report.xlsx'
)
    """)
    
    print("\n🌐 示例4：网站监控脚本")
    print("""
import requests
import time
from datetime import datetime

def monitor_website(url, check_interval=300):
    '''监控网站可用性'''
    while True:
        try:
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                print(f'{datetime.now()}: ✅ {url} 正常')
            else:
                print(f'{datetime.now()}: ⚠️ {url} 状态码: {response.status_code}')
                
        except requests.RequestException as e:
            print(f'{datetime.now()}: ❌ {url} 连接失败: {e}')
        
        # 等待下次检查
        time.sleep(check_interval)

# 使用（后台运行）
# monitor_website('https://example.com', 300)  # 每5分钟检查一次
    """)
    
    print("\n=== 5. 自动化最佳实践 ===")
    print("✅ 错误处理：")
    print("   • 使用try-except捕获异常")
    print("   • 记录错误日志")
    print("   • 设置重试机制")
    
    print("\n✅ 日志记录：")
    print("   • 记录关键操作")
    print("   • 包含时间戳和状态")
    print("   • 便于问题排查")
    
    print("\n✅ 配置管理：")
    print("   • 使用配置文件")
    print("   • 分离敏感信息（密码、API密钥）")
    print("   • 环境变量配置")
    
    print("\n✅ 测试验证：")
    print("   • 编写测试用例")
    print("   • 验证脚本功能")
    print("   • 模拟异常情况")

def practical_tips():
    print("\n=== 6. 实用技巧 ===")
    print("🚀 快速开始：")
    print("1. 从简单任务开始（文件整理、数据转换）")
    print("2. 逐步增加复杂度")
    print("3. 复用现有脚本和代码")
    
    print("\n🔧 工具推荐：")
    print("• Jupyter Notebook：快速原型")
    print("• VS Code：代码编辑和调试")
    print("• Git：版本控制")
    print("• Docker：环境一致性")
    
    print("\n📅 定时执行：")
    print("• Windows：任务计划程序")
    print("• Linux/Mac：cron")
    print("• Python：schedule库")
    
    print("\n🔄 持续改进：")
    print("• 定期优化脚本性能")
    print("• 添加新功能")
    print("• 重构代码提高可维护性")

if __name__ == "__main__":
    automation_basics()
    practical_tips()
    
    print("\n" + "="*50)
    print("✅ 自动化脚本（极简版）完成")
    
    print("\n📚 核心掌握：")
    print("1. 4大自动化场景")
    print("2. 5个核心Python库")
    print("3. 4个实用脚本示例")
    print("4. 自动化最佳实践")
    
    print("\n🔧 立即可以做的：")
    print("1. 备份重要文件")
    print("2. 自动生成日报")
    print("3. 监控网站状态")
    print("4. 定时发送邮件")
    
    print("\n💡 记住：")
    print("• 自动化是为了解放人力")
    print("• 从重复性最高的工作开始")
    print("• 小脚本也能产生大价值")