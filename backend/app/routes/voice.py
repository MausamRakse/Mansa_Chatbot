from fastapi import APIRouter
from pydantic import BaseModel
from app.services.gemini_service import generate_response
from app.services.knowledge_base import load_knowledge_base

router = APIRouter()

class VoiceTextRequest(BaseModel):
    text: str

@router.post("/")
async def voice_endpoint(request: VoiceTextRequest):
    # Process text from voice input same as chat
    context = load_knowledge_base()
    response = generate_response(request.text, context)
    return {"reply": response}
