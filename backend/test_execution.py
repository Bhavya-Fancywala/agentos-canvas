import requests
import json

url = "http://localhost:8000/execute"

payload = {
    "agent_id": "test-agent",
    "nodes": [
        {
            "id": "node-chat",
            "type": "chat-trigger",
            "label": "Chat",
            "config": {}
        },
        {
            "id": "node-brain",
            "type": "agent-brain",
            "label": "Brain",
            "config": {
                # Leaving API Key empty to test error handling
                # "apiKey": "sk-test" 
            }
        }
    ],
    "edges": [
        {
            "id": "edge-1",
            "source": "node-chat",
            "target": "node-brain"
        }
    ],
    "input_data": {
        "input": "Hello World"
    }
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
