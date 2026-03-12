#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Jack RAG - 检索增强生成系统
支持向量数据库和知识检索
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
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain_community.document_loaders import DirectoryLoader, TextLoader
    from langchain_community.vectorstores import Chroma
    from langchain_openai import OpenAIEmbeddings, ChatOpenAI
    from langchain_core.messages import HumanMessage, SystemMessage
except ImportError:
    print("❌ 缺少依赖，请运行：pip install langchain langchain-community langchain-openai chromadb")
    sys.exit(1)

# 配置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = "https://api.deepseek.com/v1"

# 路径配置
KNOWLEDGE_BASE = PROJECT_ROOT / "knowledge_base"
VECTOR_STORE = PROJECT_ROOT / "vector_store"

# 确保目录存在
KNOWLEDGE_BASE.mkdir(parents=True, exist_ok=True)
VECTOR_STORE.mkdir(parents=True, exist_ok=True)


class JackRAG:
    """Jack RAG 系统"""

    def __init__(self):
        self.embeddings = None
        self.vectorstore = None
        self.llm = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            length_function=len
        )

    def get_embeddings(self):
        """获取 Embedding 模型"""
        if self.embeddings is None:
            self.embeddings = OpenAIEmbeddings(
                model="text-embedding-3-large",
                api_key=DEEPSEEK_API_KEY,
            )
        return self.embeddings

    def get_llm(self):
        """获取 LLM 模型"""
        if self.llm is None:
            self.llm = ChatOpenAI(
                model="deepseek-chat",
                api_key=DEEPSEEK_API_KEY,
                base_url=DEEPSEEK_BASE_URL,
                temperature=0.3
            )
        return self.llm

    def init_knowledge_base(self, source_dir: str = None):
        """初始化知识库"""
        if source_dir is None:
            source_dir = KNOWLEDGE_BASE

        print(f"📚 加载知识库：{source_dir}")

        # 加载文档
        loader = DirectoryLoader(
            str(source_dir),
            glob="**/*.md",
            loader_cls=TextLoader,
            loader_kwargs={'encoding': 'utf-8'}
        )
        documents = loader.load()
        print(f"   加载了 {len(documents)} 个文档")

        # 分割文本
        texts = self.text_splitter.split_documents(documents)
        print(f"   分割为 {len(texts)} 个片段")

        # 创建向量存储
        embeddings = self.get_embeddings()
        self.vectorstore = Chroma.from_documents(
            documents=texts,
            embedding=embeddings,
            persist_directory=str(VECTOR_STORE)
        )

        print(f"   ✅ 知识库初始化完成")
        print(f"   向量存储：{VECTOR_STORE}")

        return len(texts)

    def load_vectorstore(self):
        """加载已有向量存储"""
        if not VECTOR_STORE.exists():
            print("⚠️ 向量存储不存在，请先初始化")
            return False

        embeddings = self.get_embeddings()
        self.vectorstore = Chroma(
            persist_directory=str(VECTOR_STORE),
            embedding_function=embeddings
        )
        print("✅ 已加载向量存储")
        return True

    def add_document(self, file_path: str):
        """添加文档到知识库"""
        path = Path(file_path)
        if not path.exists():
            print(f"❌ 文件不存在：{file_path}")
            return False

        print(f"📖 添加文档：{file_path}")

        # 加载文档
        loader = TextLoader(str(path), encoding='utf-8')
        document = loader.load()

        # 分割
        texts = self.text_splitter.split_documents(document)
        print(f"   分割为 {len(texts)} 个片段")

        # 添加到向量存储
        if self.vectorstore is None:
            self.load_vectorstore()

        if self.vectorstore:
            self.vectorstore.add_documents(texts)
            print(f"   ✅ 已添加")
            return True

        return False

    def query(self, question: str, top_k: int = 5) -> dict:
        """查询知识库"""
        if self.vectorstore is None:
            if not self.load_vectorstore():
                return {"error": "知识库未初始化"}

        print(f"🔍 查询：{question}")

        # 检索相关文档
        retriever = self.vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": top_k}
        )
        docs = retriever.invoke(question)

        # 构建上下文
        context = "\n\n".join([doc.page_content for doc in docs])

        # 调用 LLM 生成回答
        llm = self.get_llm()
        prompt = f"""请根据以下参考资料回答问题。如果资料中没有相关信息，请直接说明。

参考资料:
{context}

问题：{question}

请用中文详细回答："""

        messages = [HumanMessage(content=prompt)]
        response = llm.invoke(messages)

        result = {
            "question": question,
            "answer": response.content,
            "sources": [
                {
                    "content": doc.page_content[:200],
                    "metadata": doc.metadata
                }
                for doc in docs
            ]
        }

        print(f"✅ 回答完成")
        return result

    def search(self, query: str, top_k: int = 5) -> list:
        """搜索相关文档"""
        if self.vectorstore is None:
            if not self.load_vectorstore():
                return []

        print(f"🔎 搜索：{query}")

        docs = self.vectorstore.similarity_search(query, k=top_k)

        results = [
            {
                "content": doc.page_content,
                "metadata": doc.metadata,
                "score": None  # Chroma 不直接返回分数
            }
            for doc in docs
        ]

        print(f"✅ 找到 {len(results)} 条结果")
        return results

    def list_documents(self) -> list:
        """列出知识库文档"""
        docs = []
        for f in KNOWLEDGE_BASE.rglob("*.md"):
            docs.append({
                "path": str(f.relative_to(PROJECT_ROOT)),
                "size": f.stat().st_size,
                "modified": datetime.fromtimestamp(f.stat().st_mtime).isoformat()
            })
        return docs

    def rebuild(self):
        """重建向量索引"""
        print("🔄 重建向量索引...")
        self.vectorstore = None
        self.init_knowledge_base()

    def stats(self) -> dict:
        """查看知识库统计"""
        docs = self.list_documents()
        total_size = sum(d["size"] for d in docs)

        return {
            "document_count": len(docs),
            "total_size_kb": round(total_size / 1024, 2),
            "vector_store": str(VECTOR_STORE),
            "vector_store_exists": VECTOR_STORE.exists()
        }


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Jack RAG")
    subparsers = parser.add_subparsers(dest="command", help="命令")

    # init 命令
    init_parser = subparsers.add_parser("init", help="初始化知识库")
    init_parser.add_argument("--source", default=str(KNOWLEDGE_BASE), help="源目录")

    # add 命令
    add_parser = subparsers.add_parser("add", help="添加文档")
    add_parser.add_argument("--file", required=True, help="文件路径")

    # query 命令
    query_parser = subparsers.add_parser("query", help="查询")
    query_parser.add_argument("--question", required=True, help="问题")
    query_parser.add_argument("--top-k", type=int, default=5, help="结果数量")

    # search 命令
    search_parser = subparsers.add_parser("search", help="搜索")
    search_parser.add_argument("--query", required=True, help="搜索词")
    search_parser.add_argument("--top-k", type=int, default=5, help="结果数量")

    # list 命令
    subparsers.add_parser("list", help="列出文档")

    # rebuild 命令
    subparsers.add_parser("rebuild", help="重建索引")

    # stats 命令
    subparsers.add_parser("stats", help="统计信息")

    args = parser.parse_args()

    rag = JackRAG()

    if args.command == "init":
        rag.init_knowledge_base(args.source)
    elif args.command == "add":
        rag.add_document(args.file)
    elif args.command == "query":
        result = rag.query(args.question, args.top_k)
        print("\n" + "=" * 50)
        print(f"问题：{result['question']}")
        print(f"回答：{result['answer']}")
        print("\n来源:")
        for src in result.get("sources", []):
            print(f"  - {src['metadata'].get('source', 'unknown')}")
    elif args.command == "search":
        results = rag.search(args.query, args.top_k)
        for i, r in enumerate(results):
            print(f"\n[{i + 1}] {r['metadata'].get('source', 'unknown')}")
            print(f"    {r['content'][:200]}...")
    elif args.command == "list":
        docs = rag.list_documents()
        print(f"\n📚 知识库文档 ({len(docs)} 个):\n")
        for doc in docs:
            print(f"  📄 {doc['path']} ({doc['size']} bytes)")
    elif args.command == "rebuild":
        rag.rebuild()
    elif args.command == "stats":
        stats = rag.stats()
        print("\n📊 知识库统计:")
        print(f"  文档数量：{stats['document_count']}")
        print(f"  总大小：{stats['total_size_kb']} KB")
        print(f"  向量存储：{stats['vector_store']}")
        print(f"  向量存储存在：{stats['vector_store_exists']}")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
