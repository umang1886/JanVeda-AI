from flask import Blueprint, request, jsonify
from src.extensions import limiter

booth_bp = Blueprint("booth_bp", __name__)

MOCK_BOOTHS = {
    "110001": [{"id": 1, "name": "Govt. Primary School, Connaught Place", "address": "Block A", "ward": "Ward 1", "distance": "0.4 km", "voters": 1247, "mapUrl": ""}]
}

@booth_bp.route("/api/booth", methods=["GET"])
@limiter.limit("10 per minute")
def get_booths():
    pincode = request.args.get("pincode", "")
    
    if not pincode.isdigit() or len(pincode) != 6:
        return jsonify({"error": "Invalid pincode"}), 400
        
    booths = MOCK_BOOTHS.get(pincode, [{"id": 999, "name": "Sample Polling Booth", "address": f"Area near PIN {pincode}", "ward": "Sample Ward", "distance": "N/A", "voters": 1000, "mapUrl": f"https://maps.google.com/?q=pin+code+{pincode}+india"}])
    return jsonify({"booths": booths})
