from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AdminRegistration(BaseModel):
    CompanyName: str
    Domain: str
    Description: str
    API_Endpoint: str
    Parameters: List[str]
    ExampleQueries: List[str]
    LLMEndpoint: Optional[str] = None   # Default to null
    CreatedAt: Optional[datetime] = None  # Will be set in backend
