from fastapi import APIRouter
from models.schema import UserQuery
from services.mongo_logger import log_search_to_db, update_url_response
from services.llama_caller import call_llama
from models.admin_schema import AdminRegistration
from services.admin_register import register_admin_profile
from services.fetch_admin_data import get_company_search_metrics_service

router = APIRouter()

@router.post("/log_and_query")
async def log_and_trigger_llm(data: UserQuery):
    # Step 1: Log search to DB
    search_id = log_search_to_db(data.company, data.query)

    # Step 2: Call LLaMA model
    llama_response = call_llama(data.company, data.query)

    # Step 3: Update the log with success/failure message
    if llama_response:
        update_url_response(search_id, "LLM Triggered Successfully")
    else:
        update_url_response(search_id, "LLM Trigger Failed")

    return {"status": "logged and llama triggered"}

@router.post("/register_admin")
async def register_admin(data: AdminRegistration):
    register_admin_profile(data.model_dump())
    return {"status": "Admin profile registered successfully"}


@router.get("/metrics/company-searches")
def get_company_search_metrics():
    return get_company_search_metrics_service()