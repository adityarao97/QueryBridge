from pymongo import MongoClient
from config.settings import MONGO_URI
import requests
from config.settings import LLAMA_ENDPOINTS

client = MongoClient(MONGO_URI)
collection = client["query_bridge"]["AdminUserProfiles"]

def call_llama(company: str, user_prompt: str):
    # Fetch the company document from MongoDB
    company_doc = collection.find_one({"CompanyName": company})
    if not company_doc:
        print(f"[ERROR] Company '{company}' not found in AdminUserProfiles")
        return None

    # Get the LLM endpoint
    llama_url = company_doc.get("LLMEndpoint")
    if not llama_url:
        print(f"[ERROR] No LLMEndpoint registered for company '{company}'")
        return None

    # Get the system prompt
    system_prompt = company_doc.get("SystemPrompt")
    if not system_prompt:
        print(f"[ERROR] No SystemPrompt found for company '{company}'")
        return None

    # Prepare the payload for Ollama
    payload = {
        "model": "llama2:13b-chat",  # Replace with the model name if different
        "stream": False,
        "temperature": 0,
        "stop": ["\n\n"],
        "messages": [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ]
    }

    # Make the POST request to Ollama
    try:
        res = requests.post(
            llama_url,
            json=payload,
            timeout=100
        )
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"[ERROR] Failed to call LLaMA: {e}")
        return None
