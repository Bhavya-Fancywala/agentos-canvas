import asyncio
from app.graph import GraphBuilder
from typing import Dict, Any

class MockNode:
    def __init__(self, id, type, config):
        self.id = id
        self.type = type
        self.config = config

class MockEdge:
    def __init__(self, source, target):
        self.source = source
        self.target = target

async def main():
    nodes = [
        MockNode("node-chat", "chat-trigger", {}),
        MockNode("node-brain", "agent-brain", {
            "llmModel": "llama-3.3-70b-versatile",
            "apiKey": "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" 
        })
    ]
    edges = [
        MockEdge("node-chat", "node-brain")
    ]
    
    print("Building Graph...")
    builder = GraphBuilder(nodes, edges)
    graph = builder.build()
    
    print("Executing Graph...")
    initial_state = {
        "input": "Explain quantum physics in 1 sentence.", 
        "context": [], 
        "intermediate_steps": {}
    }
    
    try:
        result = await graph.ainvoke(initial_state)
        print("Execution Result:")
        print(result)
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    asyncio.run(main())
