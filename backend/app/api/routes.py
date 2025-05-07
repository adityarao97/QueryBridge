from fastapi import APIRouter,File, UploadFile, Form
from fastapi.responses import JSONResponse
from typing import List
from services.company_service import fetch_all_companies
from models.schema import UserQuery
from services.mongo_logger import log_search_to_db, update_url_response
from services.llama_caller import call_llama
from models.admin_schema import AdminRegistration
from services.admin_register import register_admin_profile
from services.fetch_admin_data import get_company_search_metrics_service
from utils.create_llm_instance import create_llm_for_company

router = APIRouter()

#FASTAPI 1 log_and_query API
@router.post("/log_and_query")
async def log_and_trigger_llm(data: UserQuery):
    # Step 1: Log search to DB
    search_id = log_search_to_db(data.company, data.query)

    # Step 2: Call LLaMA model
    llama_response = call_llama(data.company, data.query)

    print("llama_response is ", llama_response)
    # Step 3: Update the log with success/failure message
    if llama_response:
        update_url_response(search_id, "LLM Triggered Successfully")
        # Extract the content from the llama_response
        content = llama_response.get("message", {}).get("content", None).replace("\n", "")
    else:
        update_url_response(search_id, "LLM Trigger Failed")
        content = None

    return {
        "status": "logged and llama triggered",
        "llama_response_content": content
    }

#FASTAPI 2 register_admin API
@router.post("/register_admin")
async def register_admin(data: AdminRegistration):
    updated_data = register_admin_profile(data.model_dump())
    # Calls utils\create_llm_instance.py LLM and update AdminUserProfiles with LLMEndpoint
    llm_response = create_llm_for_company(updated_data["CompanyId"])

    return {
        "status": "Admin profile registered successfully",
        "llm": llm_response
    }

@router.get("/metrics/company-searches")
def get_company_search_metrics():
    return get_company_search_metrics_service()

@router.get("/companies")
async def get_all_companies():
    """
    API to fetch all companies from the AdminUserProfiles collection.
    """
    companies = fetch_all_companies()
    if companies is None:
        return JSONResponse(content={"error": "Failed to fetch companies"}, status_code=500)
    return JSONResponse(content={"companies": companies}, status_code=200)