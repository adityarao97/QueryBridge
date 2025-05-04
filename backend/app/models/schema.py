from pydantic import BaseModel

class UserQuery(BaseModel):
    company: str   # "linkedin", "amazon", "booking"
    query: str     # Natural language query from frontend
