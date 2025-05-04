from fastapi import FastAPI
from app.api.routes import router as api_router

app = FastAPI(title="QueryBridge Backend")

# Include all routes from /api
app.include_router(api_router)
