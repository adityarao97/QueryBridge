import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

LLAMA_ENDPOINTS = {
    "linkedin": os.getenv("LLAMA_LINKEDIN"),
    "amazon": os.getenv("LLAMA_AMAZON"),
    "booking": os.getenv("LLAMA_BOOKING")
}
