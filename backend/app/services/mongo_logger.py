from pymongo import MongoClient
from uuid import uuid4
from datetime import datetime, timezone
from config.settings import MONGO_URI

client = MongoClient(MONGO_URI)
db = client["query_bridge"]
collection = db["CustomerUsageData"]

# Step 1: Update DB with first frontend call
# This function logs the initial search to the database with a unique search ID and timestamp.
def log_search_to_db(company: str, prompt: str) -> str:
    search_id = str(uuid4())
    timestamp = datetime.now(timezone.utc)

    collection.insert_one({
        "CompanyName": company,
        "TimeStamp": timestamp,
        "SearchId": search_id,
        "SearchInputPrompt": prompt,
        "URL_Response": None
    })
    return search_id

# Step 2: Update URL_Response after LLaMA returns
# This function updates the URL_Response field in the database for a given search ID.
def update_url_response(search_id: str, status_message: str):
    collection.update_one(
        {"SearchId": search_id},
        {"$set": {"URL_Response": status_message}}
    )