# AgentOS Backend Execution Engine

This is the Python-based execution engine for AgentOS workflows, powered by **LangGraph**, **FastAPI**, and **LangChain**.

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- OpenAI / Anthropic API Keys (in `.env`)
- MongoDB (Optional, for memory persistence)
- Redis (Optional, for queue/memory)

### 2. Installation

```bash
cd backend
pip install -r requirements.txt
```

### 3. Environment Setup
Create a `.env` file in the `backend` directory:

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
MONGODB_URL=mongodb://localhost:27017
REDIS_URL=redis://localhost:6379
```

### 4. Running the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

## 🏗 Architecture

- **`app/main.py`**: FastAPI entry point. Exposes `/execute` endpoint.
- **`app/graph.py`**: compiles the JSON node graph into a runnable `langgraph.StateGraph`.
- **`app/nodes/registry.py`**: Maps frontend node types to backend Python classes.
- **`app/nodes/brain.py`**: Handles LLM logic (GPT-4, Claude).
- **`app/nodes/memory.py`**: Handles generic memory storage/retrieval (MongoDB, Redis, Pinecone).

## 🔌 API Usage

**POST /execute**
Payload:
```json
{
  "agent_id": "123",
  "nodes": [...],
  "edges": [...],
  "input_data": {"input": "Hello agent!"}
}
```
