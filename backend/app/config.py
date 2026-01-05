import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), "data", "mansa_website_content.txt")

config = Config()
