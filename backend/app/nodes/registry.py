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
        impl = cls._registry.get(node_type)
        if not impl:
            # Fallback no-op runner
            async def no_op(state):
                return {}
            return no_op

        # Logic to wrap classes vs functions
        # For this system, we'll assume we register "Runner Factories" or Classes with a standardized .process()
        
        if node_type == "agent-brain":
            node_instance = BrainNode(config)
            async def brain_runner(state):
                context_str = "\n".join(state.get("context", []))
                res = await node_instance.process(state.get("input", ""), context=context_str)
                return {"output": res, "intermediate_steps": {node_type: res}}
            return brain_runner

        elif node_type == "memory-config":
            node_instance = MemoryNode(config)
            async def memory_runner(state):
                res = await node_instance.retrieve(state.get("input", ""))
                return {"context": [res]}
            return memory_runner

        elif node_type == "trigger":
            # Triggers often start the workflow, but if they are part of the graph execution
            # (e.g. chaining triggers), they might just pass data through.
            async def trigger_runner(state):
                # If webhook, we might validate payload here
                return {"intermediate_steps": {"trigger": "Triggered"}}
            return trigger_runner

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

        else:
             async def generic_runner(state):
                return {}
             return generic_runner
