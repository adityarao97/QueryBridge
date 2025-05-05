from pymongo import MongoClient

# MongoDB connection setup
MONGO_URI = "mongodb+srv://adityarao:3yL9mZKRLbsibLSJ@cluster0.jguago1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)

# Access the database and collection
db = client["query_bridge"]
collection = db["CustomerUsageData"]

def get_company_search_metrics_service():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "CompanyName": "$CompanyName",
                    "CompanyId": "$CompanyId"
                },
                "total_searches": {"$sum": 1}
            }
        }
    ]

    results = list(collection.aggregate(pipeline))

    # Structure the response including both CompanyName and CompanyId
    metrics = [
        {
            "CompanyName": doc["_id"]["CompanyName"],
            "CompanyId": doc["_id"]["CompanyId"],
            "total_searches": doc["total_searches"]
        }
        for doc in results
    ]

    return {"metrics": metrics}