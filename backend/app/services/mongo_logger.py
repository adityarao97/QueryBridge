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
    # Fetch the CompanyId from the AdminUserProfiles collection
    admin_collection = db["AdminUserProfiles"]
    company_doc = admin_collection.find_one({"CompanyName": company}, {"CompanyId": 1, "_id": 0})
    
    if not company_doc:
        raise ValueError(f"Company '{company}' not found in AdminUserProfiles")

    company_id = company_doc["CompanyId"]

    # Generate a unique search ID and timestamp
    search_id = str(uuid4())
    timestamp = datetime.now(timezone.utc)

    # Insert the search log into the CustomerUsageData collection
    collection.insert_one({
        "CompanyName": company,
        "CompanyId": company_id,  # Include the CompanyId
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