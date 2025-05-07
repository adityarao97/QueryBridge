from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from pymongo import MongoClient
import hashlib
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
import torch
import requests
from config.settings import MONGO_URI
from datetime import datetime, timezone
from fastapi import APIRouter
# Create a router for dynamically added endpoints
dynamic_router = APIRouter()

app = FastAPI()

# MongoDB config
client = MongoClient(MONGO_URI)
db = client["query_bridge"]
collection = db["AdminUserProfiles"]

# === LLM Registry (in-memory) ===
llm_registry = {}  # companyId -> {pipeline, prompt, endpoint}


# === Input Model ===
class CompanyRequest(BaseModel):
    companyId: str


# === Prompt Builder ===
def build_prompt(company):
    domain = company.get("Domain", "Walmart.com")
    endpoint = company.get("API_Endpoint", "https://www.walmart.com/searchProducts")
    params = company.get("Parameters", [])

    # format bullet list of supported params
    params_formatted = ""
    if params:
        params_formatted = "\n  • " + "\n  • ".join(params)

    # build the template string for actual URL generation
    template_params = "&".join(f"{p}={{{p}}}" for p in params)

    # build a generic example (using uppercase placeholders)
    example_query = "example query providing values for: " + ", ".join(params)
    example_url = endpoint
    if params:
        example_url += "?" + "&".join(f"{p}={p.upper()}" for p in params)

    return (
        f"You are an intelligent URL generator for {domain}.\n"
        f"Base search endpoint: {endpoint}\n"
        f"Supported query params:{params_formatted}\n\n"
        f"When you see a user query, map it to those params and output EXACTLY one URL:\n"
        f"{endpoint}?{template_params}\n\n"
        f"Return only the URL (no bullets, no explanation).\n\n"
        f"Example:\n"
        f"User: {example_query}\n"
        f"Assistant: {example_url}"
    )




# === LLaMA Instance Loader ===
def spin_up_llm(company_name: str, system_prompt: str):
    print(f"[INFO] 🚀 Spinning up Flan-T5 instance for: {company_name}")

    model_name = "google/flan-t5-small"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    gen_pipeline = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

    print(f"[READY] ✅ Flan-T5 instance ready for: {company_name}")
    return {
        "company": company_name,
        "system_prompt": system_prompt,
        "pipeline": gen_pipeline
    }
    

def spin_up_llm_ollama(company_name: str, system_prompt: str):
    print(f"[INFO] 🚀 Spinning up Ollama instance for: {company_name}")

    # Ollama does not require model loading in Python; it runs as a local server.
    # Store the system prompt for use in API calls.
    instance = {
        "company": company_name,
        "system_prompt": system_prompt,
        "pipeline": None  # Placeholder for the pipeline
    }

    print(f"[READY] ✅ Ollama instance ready for: {company_name}")
    return instance


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


def create_llm_for_company(CompanyId: str):
    # Fetch the company details from the database
    company = collection.find_one({"CompanyId": CompanyId})
    if not company:
        raise HTTPException(status_code=404, detail=f"Company with ID '{CompanyId}' not found.")

    # Build the system prompt for the LLM
    system_prompt = build_prompt(company)

    # Spin up the LLM instance (store system prompt for use)
    instance = spin_up_llm_ollama(CompanyId, system_prompt)

    # Generate the endpoint hash and URL (for reference only)
    llm_endpoint = f"http://localhost:11434/api/chat"  # Ollama's default API endpoint

    # Save the system prompt and endpoint in the database
    collection.update_one(
        {"CompanyId": CompanyId},
        {"$set": {
            "LLMEndpoint": llm_endpoint,
            "SystemPrompt": system_prompt,  # Save the system prompt
            "LLMInitializedAt": datetime.now(timezone.utc)
        }}
    )

    # Debug: Print the Ollama endpoint
    print(f"Ollama endpoint: {llm_endpoint}")

    # Return the LLM initialization status
    return {
        "status": "LLM instance initialized",
        "llm_endpoint": llm_endpoint
    }