import asyncio
from app.graph import GraphBuilder

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
            "llmModel": "deepseek-chat",
            "apiKey": "sk-mock-deepseek-key", 
            "systemPrompt": "You are a generic assistant."
        })
    ]
    edges = [MockEdge("node-chat", "node-brain")]
    
    builder = GraphBuilder(nodes, edges)
    graph = builder.build()
    
    print("Testing DeepSeek Integration...")
    initial_state = {
        "input": "Hello DeepSeek", 
        "context": [], 
        "intermediate_steps": {},
        "execution_log": []
    }
    
    try:
        result = await graph.ainvoke(initial_state)
        print("Result:", result)
    except Exception as e:
        print(f"Execution Error (Expected if invalid key): {e}")

if __name__ == "__main__":
    asyncio.run(main())
