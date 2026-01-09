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
    intermediate_steps: Dict[str, Any]

from app.nodes.registry import NodeRegistry

class GraphBuilder:
    def __init__(self, nodes: List[Any], edges: List[Any]):
        self.nodes = nodes
        self.edges = edges
        self.workflow = StateGraph(AgentState)

    def build(self):
        # 1. Add Nodes
        for node in self.nodes:
            node_id = node.id
            node_type = node.type
            config = node.config
            
            # Get the executable logic from registry
            runner = NodeRegistry.get_runner(node_type, config)
            self.workflow.add_node(node_id, runner)

        # 2. Add Edges
        # Entry point logic
        entry_node = next((n for n in self.nodes if n.type == 'trigger'), self.nodes[0])
        self.workflow.set_entry_point(entry_node.id)

        for edge in self.edges:
            self.workflow.add_edge(edge.source, edge.target)

        return self.workflow.compile()
