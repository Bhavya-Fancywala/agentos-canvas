from typing import Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage

class BrainNode:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.model = config.get("llmModel", "gpt-3.5-turbo")
        self.api_key = config.get("apiKey")
        self.temperature = config.get("temperature", 0.7)
        self.max_tokens = config.get("maxTokens", 2048)
        self.system_prompt = config.get("systemPrompt", "You are a helpful assistant.")

    def _get_llm(self):
        if "gpt" in self.model:
            return ChatOpenAI(
                model=self.model,
                api_key=self.api_key,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
        elif "claude" in self.model:
            return ChatAnthropic(
                model_name=self.model,
                anthropic_api_key=self.api_key,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
        elif "gemini" in self.model:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(
                model=self.model,
                google_api_key=self.api_key,
                temperature=self.temperature,
                max_output_tokens=self.max_tokens
            )
        elif "mistral" in self.model or "codestral" in self.model:
            from langchain_mistralai import ChatMistralAI
            return ChatMistralAI(
                model=self.model,
                mistral_api_key=self.api_key,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
        elif "llama" in self.model: # Groq
            from langchain_groq import ChatGroq
            return ChatGroq(
                model_name=self.model,
                groq_api_key=self.api_key,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
        elif "o1" in self.model:
            # O1 doesn't support system prompts in the same way, but LangChain handles it roughly.
            # We might need to ensure max_completion_tokens is used instead of max_tokens if using newer SDKs
            return ChatOpenAI(
                 model=self.model,
                 api_key=self.api_key,
                 temperature=1, # o1 often fixes temp at 1
                 max_completion_tokens=self.max_tokens # valid for o1
            )
        else:
            # Default fallback
            return ChatOpenAI(api_key=self.api_key)

    async def process(self, input_text: str, context: str = "") -> str:
        llm = self._get_llm()
        
        messages = [
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=f"Context: {context}\n\nUser Input: {input_text}")
        ]
        
        response = await llm.ainvoke(messages)
        return response.content
