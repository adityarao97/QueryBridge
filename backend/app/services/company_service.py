from pymongo import MongoClient
from config.settings import MONGO_URI


# MongoDB connection
client = MongoClient(MONGO_URI)
db = client["query_bridge"]
collection = db["AdminUserProfiles"]

def fetch_all_companies():
    """
    Fetch all companies from the AdminUserProfiles collection.
    """
    try:
        companies = collection.find({}, {"CompanyName": 1, "_id": 0})  # Fetch only the CompanyName field
        return [company["CompanyName"] for company in companies]
    except Exception as e:
        print(f"[ERROR] Failed to fetch companies: {e}")
        return None