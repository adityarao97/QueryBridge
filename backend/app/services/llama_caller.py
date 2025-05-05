from pymongo import MongoClient
from app.config.settings import MONGO_URI
import requests

client = MongoClient(MONGO_URI)
collection = client["query_bridge"]["AdminUserProfiles"]

def call_llama(company: str, prompt: str):
    company_doc = collection.find_one({"CompanyName": company})
    if not company_doc:
        print(f"[ERROR] Company '{company}' not found in AdminUserProfiles")
        return None

    llama_url = company_doc.get("LLMEndpoint")
    if not llama_url:
        print(f"[ERROR] No LLMEndpoint registered for company '{company}'")
        return None

    try:
        res = requests.post(
            llama_url,
            json={"prompt": prompt},
            timeout=10
        )
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"[ERROR] Failed to call LLaMA: {e}")
        return None
