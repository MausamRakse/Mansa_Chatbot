from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, voice

app = FastAPI(title="Mansa Infotech Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])

@app.get("/")
async def root():
    return {"message": "Welcome to Mansa Infotech Chatbot API"}
