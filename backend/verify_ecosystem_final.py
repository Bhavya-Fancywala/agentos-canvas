
import asyncio
import os
from app.graph import GraphBuilder
from typing import Dict, Any

# Mock Node Definition
class MockNode:
    def __init__(self, id: str, type: str, config: Dict[str, Any]):
        self.id = id
        self.type = type
        self.config = config

class MockEdge:
    def __init__(self, source: str, target: str):
        self.source = source
        self.target = target

async def run_verification():
    print("🚀 Starting AgentOS Ecosystem Verification...")
    
    # 1. Define Nodes with Advanced Configs
    nodes = [
        MockNode("trigger-1", "trigger", {
            "triggerType": "webhook",
            "webhookSecret": "sec_123",
            "signatureHeader": "X-Hub-Signature-256"
        }),
        MockNode("ops-1", "ops-policy", {
            "maxCost": 5.0,
            "maxRetries": 3,
            "backoffFactor": 2.0,
            "failureThreshold": 5
        }),
        MockNode("guard-1", "guardrails", {
            "provider": "openai-moderation",
            "strictness": "high",
            "blockedCategories": ["hate", "violence"]
        }),
        MockNode("brain-1", "agent-brain", {
            "model": "gpt-4o",
            "temperature": 0.8,
            "topP": 0.9,
            "frequencyPenalty": 0.5,
            "presencePenalty": 0.3
        }),
        MockNode("memory-1", "memory-config", {
            "memoryType": "long-term",
            "topK": 5,
            "scoreThreshold": 0.75
        }),
        MockNode("output-1", "output-channel", {
            "method": "whatsapp",
            "phoneNumberId": "100555...",
            "accessToken": "EAA..."
        })
    ]

    # 2. Define Edges (Linear Flow)
    edges = [
        MockEdge("trigger-1", "ops-1"),
        MockEdge("ops-1", "guard-1"),
        MockEdge("guard-1", "memory-1"),
        MockEdge("memory-1", "brain-1"),
        MockEdge("brain-1", "output-1"),
        MockEdge("output-1", "__end__")
    ]

    # 3. Build Graph
    builder = GraphBuilder(nodes, edges)
    graph = builder.build()

    # 4. Execute Workflow
    print("\n⚡ Executing Graph...")
    result = await graph.ainvoke({"input": "Hello AgentOS! Validate my configuration."})
    
    print("\n✅ Execution Complete. Result:", result)

if __name__ == "__main__":
    asyncio.run(run_verification())
