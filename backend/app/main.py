from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

# --- Lifespan ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DBs
    print("AgentOS Engines Starting...")
    yield
    # Shutdown: Close connections
    print("AgentOS Engines Shutting Down...")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AgentOS Backend", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all. In prod, lock this down.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schemas ---
class NodeData(BaseModel):
    id: str
    type: str
    label: str
    config: Dict[str, Any] = {}

class EdgeData(BaseModel):
    id: str
    source: str
    target: str

class WorkflowRequest(BaseModel):
    agent_id: str
    nodes: List[NodeData]
    edges: List[EdgeData]
    input_data: Optional[Dict[str, Any]] = {}

# --- Endpoints ---
@app.get("/health")
async def health_check():
    return {"status": "active", "version": "1.0.0"}

@app.post("/execute")
async def execute_workflow(request: WorkflowRequest):
    """
    Receives the frontend graph, compiles it into a LangGraph, and runs it.
    """
    try:
        from app.graph import GraphBuilder
        # Convert Pydantic models to dicts or objects as expected by Builder
        # (Builder currently expects objects with .id, .type attributes)
        
        # Build the graph
        builder = GraphBuilder(request.nodes, request.edges)
        graph = builder.build()
        
        # Execute
        # We start with the User Input from the request
        initial_state = {"input": request.input_data.get("input", ""), "context": [], "intermediate_steps": {}}
        result = await graph.ainvoke(initial_state)
        
        return {
            "status": "success",
            "agent_id": request.agent_id,
            "output": result.get("output"),
            "full_state": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
