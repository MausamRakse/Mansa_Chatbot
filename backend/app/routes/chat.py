from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import generate_response
from app.services.knowledge_base import load_knowledge_base

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def chat_endpoint(request: ChatRequest):
    context = load_knowledge_base()
    response = generate_response(request.message, context)
    return {"reply": response}
