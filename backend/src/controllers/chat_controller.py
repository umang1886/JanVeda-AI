from flask import Blueprint, request, jsonify
from src.extensions import limiter
from src.services.gemini_service import generate_election_process_response

chat_bp = Blueprint("chat_bp", __name__)

@chat_bp.route("/api/chat", methods=["POST"])
@limiter.limit("20 per minute")
def chat():
    data = request.get_json()
    if not data or "query" not in data:
        return jsonify({"error": "Bad Request: Missing 'query'"}), 400
    
    # Optional history parsing depending on payload
    history = data.get("history", [])
    
    # Generate Response
    response_text = generate_election_process_response(data["query"], history)
    
    return jsonify({
        "reply": response_text
    })
