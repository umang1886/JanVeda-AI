import google.generativeai as genai
from src.config import Config

# Initialize API
if Config.GEMINI_API_KEY:
    genai.configure(api_key=Config.GEMINI_API_KEY)

def generate_election_process_response(query: str, history: list = None) -> str:
    """
    Generates a response focusing on the Indian democratic/election process.
    """
    if not Config.GEMINI_API_KEY:
        return "Gemini API Key is not configured."
    
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = (
            "You are JanVeda AI, an intelligent assistant focused ONLY on the Indian Election Process, "
            "voter education, polling, and civics. Always be polite, concise, and accurate.\n\n"
            f"User Question: {query}\n"
        )
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error communicating with AI: {str(e)}"
