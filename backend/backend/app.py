import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
import logging

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False

# Setup CORS
CORS(app)

# Setup Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Mock Dataset
MOCK_BOOTHS = {
    "110001": [{"id": 1, "name": "Govt. Primary School, Connaught Place", "address": "Block A", "ward": "Ward 1", "distance": "0.4 km", "voters": 1247, "mapUrl": ""}]
}

@app.route("/api/booth", methods=["GET"])
@limiter.limit("10 per minute")
def get_booths():
    pincode = request.args.get("pincode", "")
    
    if not pincode.isdigit() or len(pincode) != 6:
        return jsonify({"error": "Invalid pincode"}), 400
        
    booths = MOCK_BOOTHS.get(pincode, [{"id": 999, "name": "Sample Polling Booth", "address": f"Area near PIN {pincode}", "ward": "Sample Ward", "distance": "N/A", "voters": 1000, "mapUrl": f"https://maps.google.com/?q=pin+code+{pincode}+india"}])
    return jsonify({"booths": booths})

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
