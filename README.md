# Mansa Infotech Chatbot

A full-stack AI chatbot for Mansa Infotech using Python (FastAPI) and React (Vite).

## Features
- **AI Chat**: Answers questions about Mansa Infotech using Google Gemini API.
- **Voice Support**: Supports voice-to-text input (Web Speech API).
- **Knowledge Base**: Restricted to Mansa Infotech content.
- **Modern UI**: Clean, responsive chat interface.

## Prerequisites
- Node.js & npm
- Python 3.8+
- Google Gemini API Key

## Setup

### Backend
1. Navigate to `backend` folder:
   ```sh
   cd backend
   ```
2. Create virtual environment (optional but recommended):
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Configure Environment:
   - Rename `.env.example` (or just `.env` if created) to `.env`.
   - Add your `GEMINI_API_KEY` in `.env`.

5. Run Server:
   ```sh
   uvicorn app.main:app --reload
   ```
   Server runs at `http://localhost:8000`.

### Frontend
1. Navigate to `frontend` folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run Development Server:
   ```sh
   npm run dev
   ```
   App runs at `http://localhost:5173`.

## Architecture
- **Frontend**: React + Vite
- **Backend**: FastAPI
- **LLM**: Google Gemini Pro
- **Voice**: Web Speech API (Frontend) -> Text -> Backend

## Folder Structure
- `frontend/`: React application
- `backend/`: FastAPI application
  - `app/services`: Logic for Gemini and storage.
  - `app/routes`: API endpoints.
  - `app/data`: Knowledge base text file.
