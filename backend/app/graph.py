from typing import Dict, TypedDict, Annotated, Any, List, Optional
from langgraph.graph import StateGraph, END
import operator
from app.nodes.brain import BrainNode
from app.nodes.memory import MemoryNode

class AgentState(TypedDict):
    # The global state of the agent workflow
    input: str
    output: Optional[str]
    context: Annotated[List[str], operator.add]
    execution_log: Annotated[List[str], operator.add]
    # Use update/merge for intermediate_steps
    intermediate_steps: Annotated[Dict[str, Any], lambda x, y: {**x, **y}]

from app.nodes.registry import NodeRegistry

class GraphBuilder:
    def __init__(self, nodes: List[Any], edges: List[Any]):
        self.nodes = nodes
        self.edges = edges
        self.workflow = StateGraph(AgentState)

    def build(self):
        print(f"[GraphBuilder] Building with {len(self.nodes)} nodes and {len(self.edges)} edges.")
        # 1. Add Nodes
        for node in self.nodes:
            print(f"[GraphBuilder] Adding node: {node.id} ({node.type})")
            node_id = node.id
            node_type = node.type
            config = node.config
            
            # Get the executable logic from registry
            runner = NodeRegistry.get_runner(node_type, config)
            self.workflow.add_node(node_id, runner)

        # 2. Add Edges
        # Entry point logic
        # Entry point logic
        # Priority: chat-trigger -> trigger -> input-channel -> first node
        entry_node = next((n for n in self.nodes if n.type == 'chat-trigger'), None)
        if not entry_node:
            entry_node = next((n for n in self.nodes if n.type == 'trigger'), self.nodes[0])
        
        self.workflow.set_entry_point(entry_node.id)

        for edge in self.edges:
            self.workflow.add_edge(edge.source, edge.target)

        # 3. Handle Leaf Nodes (Dead-Ends)
        # LangGraph requires flow to end at END. Find nodes with no outgoing edges.
        edge_sources = set(e.source for e in self.edges)
        for node in self.nodes:
            if node.id not in edge_sources:
                 self.workflow.add_edge(node.id, END)

        return self.workflow.compile()
