from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from pymongo import MongoClient
import hashlib
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from app.config.settings import MONGO_URI
from datetime import datetime, timezone

app = FastAPI()

# MongoDB config
client = MongoClient(MONGO_URI)
collection = client.get_database("QueryBridge")["AdminUserProfiles"]

# === LLM Registry (in-memory) ===
llm_registry = {}  # companyId -> {pipeline, prompt, endpoint}


# === Input Model ===
class CompanyRequest(BaseModel):
    companyId: str


# === Prompt Builder ===
def build_prompt(company):
    param_list = ', '.join(company.get("Parameters", []))
    domain = company.get("Domain", "")
    endpoint = company.get("API Endpoint", "")

    return (
        f"You are an intelligent URL generator designed to convert natural language prompts into precise search URLs.\n\n"
        f"Your role is to assist users by interpreting their natural language input and generating a complete URL that, when pasted into a browser, will return the exact search results they are looking for.\n\n"
        f"You are configured for the domain: {domain}, which supports filters such as: {param_list}.\n\n"
        f"When generating URLs:\n"
        f"- Identify all relevant filters from the user’s query.\n"
        f"- Use as many supported filters as possible in the final URL.\n"
        f"- Ensure the URL matches the structure of the API endpoint: {endpoint}.\n"
        f"- Do not add unsupported or guessed parameters.\n\n"
        f"I will provide prompts one by one. Return only the final search URL in your response."
    )


# === LLaMA Instance Loader ===
def spin_up_llm(company_name: str, system_prompt: str):
    print(f"[INFO] 🚀 Spinning up LLaMA instance for: {company_name}")

    model_name = "meta-llama/Llama-2-7b-chat-hf"  # Replace with your fine-tuned or local model
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")

    gen_pipeline = pipeline("text-generation", model=model, tokenizer=tokenizer)

    print(f"[READY] ✅ LLaMA instance ready for: {company_name}")
    return {
        "company": company_name,
        "system_prompt": system_prompt,
        "pipeline": gen_pipeline
    }


# === FastAPI Route ===
@app.post("/init-llm")
async def init_llm(req: CompanyRequest, request: Request):
    company = collection.find_one({"companyId": req.companyId})
    if not company:
        raise HTTPException(status_code=404, detail=f"Company with ID '{req.companyId}' not found.")

    system_prompt = build_prompt(company)

    # Use hash of companyId to generate endpoint
    endpoint_hash = hashlib.sha1(req.companyId.encode()).hexdigest()[:8]
    endpoint_path = f"/llm/{endpoint_hash}"
    full_url = f"{str(request.base_url).rstrip('/')}{endpoint_path}"

    # Check if already initialized
    if req.companyId in llm_registry:
        return {
            "message": f"LLM instance already exists for '{req.companyId}'",
            "llm_endpoint": full_url
        }

    # Spin up LLM and register
    instance = spin_up_llm(company.get("Company Name", req.companyId), system_prompt)
    llm_registry[req.companyId] = {
        "instance": instance,
        "endpoint_path": endpoint_path
    }

    return {
        "message": f"LLM instance for '{req.companyId}' initialized successfully.",
        "llm_endpoint": full_url
    }

def create_llm_for_company(company_id: str):
    company = collection.find_one({"CompanyName": company_id})
    if not company:
        return None

    system_prompt = build_prompt(company)
    instance = spin_up_llm(company_id, system_prompt)

    endpoint_hash = hashlib.sha1(company_id.encode()).hexdigest()[:8]
    llm_endpoint = f"http://localhost:8000/llm/{endpoint_hash}"

    collection.update_one(
        {"CompanyName": company_id},
        {"$set": {
            "LLMEndpoint": llm_endpoint,
            "LLMInitializedAt": datetime.now(timezone.utc)
        }}
    )

    return {
        "status": "LLM instance initialized",
        "llm_endpoint": llm_endpoint
    }
