#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Jack AI Agent - AI Agent 系统
支持 LangChain 和 CrewAI
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime

# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

try:
    from langchain_openai import ChatOpenAI
    from langchain_core.messages import HumanMessage, SystemMessage
    from langchain_core.tools import Tool
except ImportError:
    print("❌ 缺少依赖，请运行：pip install langchain langchain-openai")
    sys.exit(1)

# 配置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"

# Jack 工具函数
def run_security_scan(code: str) -> str:
    """运行安全扫描"""
    import subprocess
    try:
        result = subprocess.run(
            ["npm", "audit", "--json"],
            capture_output=True,
            text=True,
            cwd=PROJECT_ROOT
        )
        return result.stdout
    except Exception as e:
        return f"安全扫描错误：{str(e)}"

def run_code_review(code: str) -> str:
    """运行代码审查"""
    # 调用 DeepSeek API
    llm = ChatOpenAI(
        model="deepseek-chat",
        api_key=DEEPSEEK_API_KEY,
        base_url=DEEPSEEK_BASE_URL,
        temperature=0.3
    )

    response = llm.invoke([
        SystemMessage(content="你是杰克，代码审查专家。请审查代码并指出问题。"),
        HumanMessage(content=f"请审查以下代码：\n\n{code}")
    ])

    return response.content

def get_memory_context() -> str:
    """获取记忆上下文"""
    memory_file = Path.home() / ".claude" / "memory" / "MEMORY.md"
    if memory_file.exists():
        content = memory_file.read_text(encoding="utf-8")
        return content[:5000]  # 限制长度
    return "暂无记忆数据"

def save_to_memory(key: str, value: str) -> str:
    """保存记忆"""
    memory_file = PROJECT_ROOT / "knowledge_base" / f"{key}.md"
    memory_file.parent.mkdir(parents=True, exist_ok=True)
    memory_file.write_text(f"# {key}\n\n{value}\n", encoding="utf-8")
    return f"记忆已保存：{key}"

# 定义工具
JACK_TOOLS = [
    Tool(
        name="security_scan",
        func=run_security_scan,
        description="扫描代码中的安全漏洞，输入代码返回扫描结果"
    ),
    Tool(
        name="code_review",
        func=run_code_review,
        description="审查代码质量，输入代码返回审查报告"
    ),
    Tool(
        name="get_memory",
        func=get_memory_context,
        description="获取杰克系统的记忆上下文"
    ),
    Tool(
        name="save_memory",
        func=save_to_memory,
        description="保存内容到记忆，参数：key, value"
    ),
]

# Agent 角色定义
AGENT_ROLES = {
    "mentor": {
        "role": "杰克导师",
        "goal": "帮助扎克学习和提高编程技能",
        "backstory": """你是杰克，一个经验丰富的 AI 导师。
        你擅长代码审查、安全扫描、性能分析。
        你会耐心指导扎克，帮助他成为更好的开发者。""",
        "tools": ["code_review", "security_scan", "get_memory"],
    },
    "researcher": {
        "role": "高级研究员",
        "goal": "发现和分析最新技术趋势",
        "backstory": """你是一位在硅谷工作多年的技术研究员，
        擅长发现新兴技术和市场趋势。""",
        "tools": ["get_memory"],
    },
    "coder": {
        "role": "资深工程师",
        "goal": "编写高质量可运行的代码",
        "backstory": """你是一位经验丰富的高级工程师，
        擅长快速实现功能和解决技术问题。""",
        "tools": ["code_review", "save_memory"],
    },
    "reviewer": {
        "role": "代码审查专家",
        "goal": "确保代码质量和安全",
        "backstory": """你是一位资深代码审查专家，
        对代码质量有严格要求，善于发现潜在问题。""",
        "tools": ["security_scan", "code_review"],
    },
}

def get_llm():
    """获取 LLM 实例"""
    return ChatOpenAI(
        model="deepseek-chat",
        api_key=DEEPSEEK_API_KEY,
        base_url=DEEPSEEK_BASE_URL,
        temperature=0.7
    )

def get_tools(tool_names: list) -> list:
    """获取指定工具列表"""
    return [t for t in JACK_TOOLS if t.name in tool_names]

def create_agent(role_name: str):
    """创建单个 Agent"""
    if role_name not in AGENT_ROLES:
        print(f"❌ 未知角色：{role_name}")
        print(f"可用角色：{list(AGENT_ROLES.keys())}")
        return None

    role = AGENT_ROLES[role_name]
    llm = get_llm()
    tools = get_tools(role["tools"])

    # 创建系统提示
    system_prompt = f"""你是{role['role']}。

背景：
{role['backstory']}

你的目标：{role['goal']}

请使用提供的工具完成任务。"""

    print(f"✅ 已创建 Agent: {role['role']}")
    print(f"   工具：{role['tools']}")

    return {
        "name": role_name,
        "llm": llm,
        "tools": tools,
        "system_prompt": system_prompt
    }

def run_agent_task(agent_name: str, task: str):
    """运行 Agent 任务"""
    agent = create_agent(agent_name)
    if not agent:
        return

    llm = agent["llm"]

    messages = [
        SystemMessage(content=agent["system_prompt"]),
        HumanMessage(content=task)
    ]

    print(f"\n🚀 执行任务：{task}")
    print("-" * 50)

    response = llm.invoke(messages)
    print(response.content)
    print("-" * 50)

    return response.content

def list_agents():
    """列出所有 Agent"""
    print("\n🤖 可用 Agent 列表:\n")
    for name, role in AGENT_ROLES.items():
        print(f"  {name}:")
        print(f"    角色：{role['role']}")
        print(f"    目标：{role['goal']}")
        print(f"    工具：{role['tools']}")
        print()

def init_command():
    """初始化命令"""
    print("🤖 Jack AI Agent 系统")
    print("=" * 50)
    print("\n✅ 系统已初始化")
    print(f"   可用 Agent: {len(AGENT_ROLES)}")
    print(f"   可用工具：{len(JACK_TOOLS)}")

    # 创建知识库目录
    kb_dir = PROJECT_ROOT / "knowledge_base"
    kb_dir.mkdir(parents=True, exist_ok=True)
    print(f"   知识库目录：{kb_dir}")

    # 测试 LLM 连接
    try:
        llm = get_llm()
        response = llm.invoke([HumanMessage(content="Hello")])
        print("   LLM 连接：✅")
    except Exception as e:
        print(f"   LLM 连接：❌ {str(e)}")

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Jack AI Agent")
    subparsers = parser.add_subparsers(dest="command", help="命令")

    # init 命令
    subparsers.add_parser("init", help="初始化")

    # list 命令
    subparsers.add_parser("list", help="列出 Agent")

    # run 命令
    run_parser = subparsers.add_parser("run", help="运行 Agent")
    run_parser.add_argument("--agent", required=True, help="Agent 名称")
    run_parser.add_argument("--task", required=True, help="任务描述")

    args = parser.parse_args()

    if args.command == "init":
        init_command()
    elif args.command == "list":
        list_agents()
    elif args.command == "run":
        run_agent_task(args.agent, args.task)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
