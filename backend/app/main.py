from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, voice
import os

app = FastAPI(title="Mansa Infotech Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])

# Mount React Frontend
# Ensure we point to the correct dist folder relative to this file
# Since frontend files are now in root, dist is in root.
# __file__ = backend/app/main.py
# dirname(__file__) = backend/app
# dirname(dirname(__file__)) = backend
# dirname(dirname(dirname(__file__))) = root
dist_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "dist")

if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Serve API requests normally (handled above), everything else goes to index.html
        if full_path.startswith("api"):
            return {"error": "Not Found"}
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    @app.get("/")
    async def root():
        return {"message": "Backend running. Frontend build not found."}


