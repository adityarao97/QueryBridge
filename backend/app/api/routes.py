from fastapi import APIRouter, status
from app.models.schema import SearchRequest
from app.services.search_logger import log_search_and_trigger_llama

router = APIRouter()

@router.post("/search", status_code=status.HTTP_204_NO_CONTENT)
async def search_endpoint(req: SearchRequest):
    await log_search_and_trigger_llama(req)
    return
