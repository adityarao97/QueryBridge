from fastapi import FastAPI
from pydantic import BaseModel
from uuid import uuid4
from datetime import datetime
from pymongo import MongoClient
import requests

from app.config.settings import MONGO_URI, LLAMA_ENDPOINTS

app = FastAPI()

client = MongoClient(MONGO_URI)
db = client["query_bridge"]
collection = db["CustomerUsageData"]

class UserQuery(BaseModel):
    company: str   # "linkedin", "amazon", "booking"
    query: str

@app.post("/log_and_query")
async def log_and_trigger_llm(data: UserQuery):
    search_id = str(uuid4())
    timestamp = datetime.utcnow()

    # Step 1: Insert into MongoDB
    collection.insert_one({
        "CompanyName": data.company,
        "TimeStamp": timestamp,
        "SearchId": search_id,
        "SearchInputPrompt": data.query,
        "URL_Response": None
    })

    # Step 2: Call the LLaMA endpoint (do not update DB)
    llama_url = LLAMA_ENDPOINTS.get(data.company)
    if llama_url:
        try:
            res = requests.post(llama_url, json={"prompt": data.query})
            print(f"[LLAMA] Response for {data.company}:", res.text)
        except Exception as e:
            print(f"[LLAMA ERROR] Failed to call model: {e}")

    return {"status": "logged and llama triggered"}
