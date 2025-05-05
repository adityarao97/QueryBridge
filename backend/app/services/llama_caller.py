import requests
from config.settings import LLAMA_ENDPOINTS

def call_llama(company: str, prompt: str):
    llama_url = LLAMA_ENDPOINTS.get(company)
    if not llama_url:
        raise ValueError(f"No LLaMA endpoint configured for company: {company}")
    
    try:
        res = requests.post(llama_url, json={"prompt": prompt}, timeout=10)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"[LLaMA ERROR] {e}")
        return None
