from pymongo import MongoClient
from config.settings import MONGO_URI
from datetime import datetime, timezone

client = MongoClient(MONGO_URI)
db = client["query_bridge"]
collection = db["AdminUserProfiles"]

def register_admin_profile(data: dict):
    data["CreatedAt"] = datetime.now(timezone.utc)
    data["LLMEndpoint"] = None  # explicitly set to null
    collection.insert_one(data)
    return "Admin registration comleted successfully"
