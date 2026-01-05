import google.generativeai as genai
from app.config import config

genai.configure(api_key=config.GEMINI_API_KEY)

model = genai.GenerativeModel('models/gemini-2.5-flash')

import time

def generate_response(query: str, context: str) -> str:
    if not config.GEMINI_API_KEY or "your_google_gemini_api_key" in config.GEMINI_API_KEY:
         return "⚠️ **Configuration Error**: I need a valid Google Gemini API Key to work.\n\n1. Get a free key here: [Google AI Studio](https://aistudio.google.com/app/apikey)\n2. Open `backend/.env` file.\n3. Replace the placeholder with your new key.\n4. Save the file."

    prompt = f"""
    You are an expert IT Consultant representing Mansa Infotech.
    Your goal is to be helpful, persuasive, and professional, guiding users to Mansa Infotech's services.
    
    Context:
    {context}
    
    User Question: {query}
    
    Instructions:
    - Persona: Act as a senior consultant who understands business needs and offers solutions.
    - Tone: Professional, confident, innovative, and customer-focused.
    - Length: Be VERY CONCISE. Keep answers under 60 words.
    - Formatting: Use **Bold** for key terms. Use *Bullet points* for lists. Never use large headers.
    - Strategy: Don't just answer facts; explain the *value* Mansa Infotech brings.
    - If the user asks clearly unrelated questions, politely redirect them.
    - **CRITICAL**: If the user asks to **book a meeting**, **talk to a senior consultant**, or **schedule a call**, you MUST reply with: "Certainly! To book a meeting with our Senior Consultants, please visit: [Contact Mansa Infotech](https://www.mansainfotech.com/contact)"
    - Use the provided context as your source of truth.
    """
    
    max_retries = 5
    retry_delay = 5  # Start with 5 seconds

    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            error_str = str(e)
            if "429" in error_str:
                if attempt < max_retries - 1:
                    print(f"Rate limited. Retrying in {retry_delay}s...")
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential: 5, 10, 20, 40...
                    continue
                else:
                    return "⚠️ **High Traffic (Free Tier Limit)**: Google is momentarily limiting requests. Please wait 1 minute and try again."
            else:
                return f"Error communicating with AI service: {error_str}"
