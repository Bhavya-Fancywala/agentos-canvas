from typing import Dict, Type, Callable, Any
from app.nodes.brain import BrainNode
from app.nodes.memory import MemoryNode

# Define a protocol or base class if needed, but for now we use loose typing
# The runner function signature: async func(state: AgentState, config: Dict) -> Dict

class NodeRegistry:
    _registry = {}

    @classmethod
    def register(cls, node_type: str):
        def decorator(func_or_class):
            cls._registry[node_type] = func_or_class
            return func_or_class
        return decorator

    @classmethod
    def get_runner(cls, node_type: str, config: Dict[str, Any]):
        """
        Returns an async callable that takes (state) and returns (update).
        """
        # Main Registry Logic
        # We check specific types first, then fall back to decorators if needed


        # Logic to wrap classes vs functions
        # For this system, we'll assume we register "Runner Factories" or Classes with a standardized .process()
        
        if node_type == "agent-brain":
            node_instance = BrainNode(config)
            async def brain_runner(state):
                log_entry = f"[Brain] processing input..."
                try:
                    context_str = "\n".join(state.get("context", []))
                    res = await node_instance.process(state.get("input", ""), context=context_str)
                    return {
                        "output": res, 
                        "intermediate_steps": {node_type: res},
                        "execution_log": [log_entry, f"[Brain] Generated {len(res)} chars"]
                    }
                except Exception as e:
                    return {
                        "intermediate_steps": {node_type: f"Error: {e}"},
                        "execution_log": [log_entry, f"[Brain] Error: {e}"]
                    }
            return brain_runner

        elif node_type == "chat-trigger":
            async def chat_runner(state):
                try:
                    user_msg = state.get("input", "")
                    return {
                        "intermediate_steps": {"chat-trigger": "Received Input"},
                        "execution_log": [f"[Chat] Triggered with input: {user_msg}"]
                    }
                except Exception as e:
                     return {
                         "intermediate_steps": {"chat-trigger": f"Error: {e}"},
                         "execution_log": [f"[Chat] Error: {e}"]
                     }
            return chat_runner
            
        elif node_type == "agent-goal":
            async def goal_runner(state):
                mission = config.get("missionStatement", "")
                return {
                    "context": [f"Mission: {mission}"],
                    "execution_log": [f"[Goal] Injected Mission: {mission}"]
                }
            return goal_runner

        elif node_type == "tool-definition":
            # Registers a tool in the context for the Brain to use
            async def tool_runner(state):
                tool_name = config.get("toolName", "unknown_tool")
                schema = config.get("schema", "{}")
                print(f"[Tool Registry] Registering tool: {tool_name} with schema len={len(schema)}")
                # In a real system, we would parse `config.get('code')` and register it to the LLM's toolset
                return {"context": [f"Available Tool: {tool_name}"]}
            return tool_runner

        elif node_type == "crm-tool":
            async def crm_runner(state):
                action = config.get("action", "unknown")
                platform = config.get("platform", "generic")
                token = config.get("accessToken") # Specific to HubSpot Private Apps usually
                print(f"[CRM] Executing {action} on {platform} with token_len={len(token or '')}")
                return {"intermediate_steps": {f"crm-{action}": "Success"}}
            return crm_runner
            
        elif node_type == "api-action":
            # Executes an external HTTP request
            import httpx
            async def api_runner(state):
                method = config.get("method", "GET")
                url = config.get("baseUrl", "")
                headers = config.get("headers", {})
                # In real code: parse body template with jinja2 or f-strings using state
                body = config.get("body", {})
                
                print(f"[API] {method} {url}")
                async with httpx.AsyncClient() as client:
                    try:
                        if method == "GET":
                            resp = await client.get(url, headers=headers)
                        else:
                            resp = await client.request(method, url, headers=headers, json=body)
                        return {"intermediate_steps": {f"api-{url}": resp.status_code}}
                    except Exception as e:
                        return {"intermediate_steps": {f"api-{url}": str(e)}}
            return api_runner

        elif node_type == "doc-generator":
            async def doc_runner(state):
                template = config.get("template", "")
                output_format = config.get("outputFormat", "pdf")
                print(f"[Doc Gen] Generating {output_format} from template len={len(template)}")
                # Real code: use reportlab or weasyprint
                return {"intermediate_steps": {"doc-gen": f"Generated {output_format}"}}
            return doc_runner

        elif node_type == "guardrails":
            async def guard_runner(state):
                provider = config.get("provider", "simple")
                if provider == "openai-moderation":
                    # Placeholder for OpenAI Mod API
                    blocked = config.get("blockedCategories", [])
                    print(f"[Guard] Checking OpenAI Moderation for: {blocked}")
                else:
                    regex_list = config.get("customRegex", "").split("\n")
                    print(f"[Guard] Checking {len(regex_list)} regex patterns.")
                
                return {"intermediate_steps": {"guard-check": "Passed"}}
            return guard_runner

        elif node_type == "output-channel":
            async def output_runner(state):
                method = config.get("method", "log")
                dest = config.get("destination", "console")
                
                if method == "sms":
                     # Twilio Logic
                     account_sid = config.get("accountSid")
                     auth_token = config.get("authToken")
                     from_number = config.get("fromNumber")
                     print(f"[Output] Sending SMS to {dest} via Twilio ({from_number})")
                elif method == "whatsapp":
                     phone_id = config.get("phoneNumberId")
                     token = config.get("accessToken")
                     print(f"[Output] Sending WhatsApp to {dest} using ID {phone_id}")
                elif method == "storage":
                     bucket = config.get("bucketName")
                     key_id = config.get("accessKeyId")
                     print(f"[Output] Uploading to bucket {bucket}/{dest} with KeyID {key_id}")
                else:
                     print(f"[Output] Sending to {method}::{dest}")
                
                return {"intermediate_steps": {f"output-{method}": "Sent"}}
            return output_runner

        elif node_type == "email-receiver":
            async def email_runner(state):
                # This usually triggers a workflow, similar to 'trigger'
                return {"intermediate_steps": {"email-in": "Checked"}}
            return email_runner

        elif node_type == "ops-policy":
            async def ops_runner(state):
                cost = config.get("maxCost", 1.0)
                retries = config.get("maxRetries", 3)
                cb_threshold = config.get("failureThreshold", 5)
                print(f"[Ops] Policy: Max Cost=${cost}, Retries={retries}, Circuit Breaker={cb_threshold} fails")
                return {"intermediate_steps": {"ops": "Approved"}}
            return ops_runner
            
        elif node_type == "human-control":
             async def human_runner(state):
                 appr = config.get("assignedOwner")
                 timeout = config.get("timeoutHours", 24)
                 escalation = config.get("escalation", "manager")
                 print(f"[Human] Requesting approval from {appr}. Timeout: {timeout}h -> {escalation}")
                 # In LangGraph, this would return a command to interrupt execution
                 return {"intermediate_steps": {"human": "Waiting for Approval"}}
             return human_runner

        elif node_type == "agent-goal":
            async def goal_runner(state):
                # Goals typically set the Persona / System Prompt context
                mission = config.get("missionStatement", "")
                persona = config.get("personaTone", "professional")
                context_update = f"System Persona: {persona}.\nMission: {mission}"
                return {"context": [context_update]}
            return goal_runner

        elif node_type == "knowledge-base":
            async def kb_runner(state):
                # Simulating Retrieval
                source = config.get("sourceType", "docs")
                return {"context": [f"Retrieved context from {source}"]}
            return kb_runner

        elif node_type == "logic-router":
            async def router_runner(state):
                # In a real graph, this would return a conditional edge, but for now we log it
                rule_type = config.get("routingType", "static")
                print(f"[Router] Routing based on {rule_type}")
                return {"intermediate_steps": {"router": "Routed"}}
            return router_runner

        elif node_type == "action-result":
             async def result_runner(state):
                 # Post-processing the output
                 process_type = config.get("processingType", "raw")
                 current_output = state.get("output", "")
                 if process_type == "summarize":
                     current_output = f"[Summarized] {current_output[:50]}..."
                 elif process_type == "format":
                     template = config.get("formatTemplate", "")
                     current_output = f"Formatted: {template.replace('{{output}}', current_output)}"
                 
                 return {"output": current_output}
             return result_runner

        else:
             async def generic_runner(state):
                print(f"[Warn] No runner found for {node_type}, passing state.")
                return {}
             return generic_runner
