from app.config import config
import os

def load_knowledge_base() -> str:
    try:
        if not os.path.exists(config.DATA_FILE_PATH):
            return "No knowledge base found."
        
        with open(config.DATA_FILE_PATH, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error loading knowledge base: {str(e)}"
