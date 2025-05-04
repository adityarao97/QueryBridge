from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection setup
MONGO_URI = "mongodb+srv://adityarao:3yL9mZKRLbsibLSJ@cluster0.jguago1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)

# Access the database and collection
db = client["query_bridge"]
collection = db["CustomerUsageData"]

# API route to return company-wise total search counts with CompanyId
@app.get("/metrics/company-searches")
def get_company_search_metrics():
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