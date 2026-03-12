"""
Self-Improving Agent 实际改进系统
立即可以使用的自我改进工具
"""

import json
import time
from datetime import datetime
from pathlib import Path

class SelfImprovementSystem:
    """自我改进系统核心"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.setup_directories()
    
    def setup_directories(self):
        """创建必要的目录结构"""
        directories = [
            'improvement',
            'knowledge',
            'metrics',
            'strategies'
        ]
        
        for dir_name in directories:
            dir_path = self.base_dir / dir_name
            dir_path.mkdir(exist_ok=True)
            print(f"✅ 创建目录: {dir_path}")
    
    def reflect_on_task(self, task_name, result, metrics=None):
        """任务反思"""
        log_file = self.base_dir / 'self-improvement.md'
        
        reflection = {
            'timestamp': datetime.now().isoformat(),
            'task': task_name,
            'result': str(result)[:500],  # 限制长度
            'metrics': metrics or {},
            'improvements': []
        }
        
        # 分析改进机会
        improvements = self.analyze_for_improvements(result, metrics)
        reflection['improvements'] = improvements
        
        # 记录到文件
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(f"\n## {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
            f.write(f"**任务**: {task_name}\n")
            f.write(f"**结果**: {result[:200]}...\n" if len(str(result)) > 200 else f"**结果**: {result}\n")
            
            if metrics:
                f.write(f"**指标**: {json.dumps(metrics, indent=2)}\n")
            
            if improvements:
                f.write(f"**改进建议**:\n")
                for imp in improvements:
                    f.write(f"- {imp}\n")
            
            f.write(f"\n---\n")
        
        print(f"📝 任务反思已记录: {task_name}")
        return improvements
    
    def analyze_for_improvements(self, result, metrics):
        """分析改进机会"""
        improvements = []
        
        # 基于结果分析
        if isinstance(result, Exception):
            improvements.append(f"错误处理: {str(result)[:100]}")
        
        # 基于指标分析
        if metrics:
            if metrics.get('error_rate', 0) > 0.1:
                improvements.append("错误率过高，需要优化错误处理")
            
            if metrics.get('response_time', 0) > 5:
                improvements.append("响应时间过长，需要优化性能")
            
            if metrics.get('success_rate', 1) < 0.8:
                improvements.append("成功率较低，需要分析失败原因")
        
        return improvements
    
    def add_knowledge(self, category, knowledge, context=""):
        """添加知识到知识库"""
        knowledge_file = self.base_dir / 'knowledge' / f'{category}.md'
        
        with open(knowledge_file, 'a', encoding='utf-8') as f:
            f.write(f"\n### {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
            f.write(f"**知识**: {knowledge}\n")
            if context:
                f.write(f"**上下文**: {context}\n")
            f.write(f"**分类**: {category}\n")
            f.write(f"\n---\n")
        
        print(f"📚 知识已添加: {category} - {knowledge[:50]}...")
    
    def record_metric(self, metric_name, value, tags=None):
        """记录性能指标"""
        metrics_file = self.base_dir / 'metrics' / 'performance.json'
        
        # 读取现有指标
        if metrics_file.exists():
            with open(metrics_file, 'r', encoding='utf-8') as f:
                try:
                    metrics_data = json.load(f)
                except json.JSONDecodeError:
                    metrics_data = {}
        else:
            metrics_data = {}
        
        # 添加新指标
        timestamp = datetime.now().isoformat()
        if metric_name not in metrics_data:
            metrics_data[metric_name] = []
        
        metric_entry = {
            'timestamp': timestamp,
            'value': value,
            'tags': tags or {}
        }
        
        metrics_data[metric_name].append(metric_entry)
        
        # 只保留最近1000条记录
        if len(metrics_data[metric_name]) > 1000:
            metrics_data[metric_name] = metrics_data[metric_name][-1000:]
        
        # 保存指标
        with open(metrics_file, 'w', encoding='utf-8') as f:
            json.dump(metrics_data, f, indent=2, ensure_ascii=False)
        
        print(f"📊 指标已记录: {metric_name} = {value}")
    
    def generate_improvement_report(self, days=7):
        """生成改进报告"""
        report = {
            'generated_at': datetime.now().isoformat(),
            'period_days': days,
            'summary': {},
            'improvements': [],
            'recommendations': []
        }
        
        # 分析改进日志
        log_file = self.base_dir / 'self-improvement.md'
        if log_file.exists():
            with open(log_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 简单分析（实际可以更复杂）
            task_count = content.count('## 20')  # 基于时间戳计数
            improvement_count = content.count('改进建议')
            
            report['summary']['tasks_analyzed'] = task_count
            report['summary']['improvements_identified'] = improvement_count
        
        # 分析知识积累
        knowledge_dir = self.base_dir / 'knowledge'
        if knowledge_dir.exists():
            knowledge_files = list(knowledge_dir.glob('*.md'))
            report['summary']['knowledge_categories'] = len(knowledge_files)
        
        # 生成建议
        report['recommendations'] = [
            "定期回顾改进日志",
            "将知识应用到实际任务",
            "监控关键性能指标",
            "持续优化改进流程"
        ]
        
        # 保存报告
        report_file = self.base_dir / 'improvement' / f'report-{datetime.now().strftime("%Y%m%d")}.json'
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        print(f"📋 改进报告已生成: {report_file}")
        return report
    
    def task_wrapper(self, func):
        """任务包装器装饰器"""
        def wrapper(*args, **kwargs):
            start_time = time.time()
            
            try:
                # 执行任务
                result = func(*args, **kwargs)
                end_time = time.time()
                
                # 记录成功指标
                metrics = {
                    'success': True,
                    'response_time': end_time - start_time,
                    'error': None
                }
                
                # 反思
                self.reflect_on_task(
                    task_name=func.__name__,
                    result=result,
                    metrics=metrics
                )
                
                # 记录性能指标
                self.record_metric(
                    metric_name=f'task_{func.__name__}_time',
                    value=end_time - start_time,
                    tags={'success': True}
                )
                
                return result
                
            except Exception as e:
                end_time = time.time()
                
                # 记录错误指标
                metrics = {
                    'success': False,
                    'response_time': end_time - start_time,
                    'error': str(e)
                }
                
                # 错误反思
                self.reflect_on_task(
                    task_name=func.__name__,
                    result=e,
                    metrics=metrics
                )
                
                # 记录错误指标
                self.record_metric(
                    metric_name=f'task_{func.__name__}_error',
                    value=1,
                    tags={'error_type': type(e).__name__}
                )
                
                # 添加错误知识
                self.add_knowledge(
                    category='errors',
                    knowledge=f"任务 {func.__name__} 失败: {str(e)[:100]}",
                    context=f"参数: {args}, {kwargs}"
                )
                
                raise
        
        return wrapper

# 使用示例
if __name__ == "__main__":
    print("🚀 Self-Improving Agent 改进系统初始化")
    print("=" * 50)
    
    # 创建改进系统
    sis = SelfImprovementSystem()
    
    # 示例任务函数
    @sis.task_wrapper
    def example_task(data):
        """示例任务"""
        print(f"执行任务: 处理数据 {data}")
        time.sleep(0.5)  # 模拟处理时间
        return f"处理完成: {data.upper()}"
    
    # 测试任务执行
    try:
        result = example_task("test data")
        print(f"任务结果: {result}")
    except Exception as e:
        print(f"任务失败: {e}")
    
    # 测试错误任务
    @sis.task_wrapper
    def failing_task():
        """会失败的任务"""
        raise ValueError("模拟任务失败")
    
    try:
        failing_task()
    except:
        print("预期中的任务失败，已记录")
    
    # 添加一些知识
    sis.add_knowledge(
        category='technical',
        knowledge='Python装饰器可以包装函数添加额外功能',
        context='用于任务监控和改进'
    )
    
    sis.add_knowledge(
        category='process',
        knowledge='任务执行后立即反思效果最好',
        context='改进系统设计'
    )
    
    # 生成改进报告
    report = sis.generate_improvement_report(days=1)
    
    print("\n" + "=" * 50)
    print("✅ Self-Improving Agent 改进系统测试完成")
    
    print("\n📊 系统状态:")
    print(f"- 改进日志: memory/self-improvement.md")
    print(f"- 知识库: memory/knowledge/")
    print(f"- 性能指标: memory/metrics/performance.json")
    print(f"- 改进报告: memory/improvement/")
    
    print("\n🚀 立即使用:")
    print("1. 用 @sis.task_wrapper 装饰你的函数")
    print("2. 系统会自动记录和反思")
    print("3. 定期查看改进报告")
    print("4. 根据建议优化任务")
    
    print("\n💡 提示:")
    print("• 系统会自动创建必要目录")
    print("• 所有数据都保存在 memory/ 目录")
    print("• 可以扩展和定制分析逻辑")
    print("• 持续使用效果更好")