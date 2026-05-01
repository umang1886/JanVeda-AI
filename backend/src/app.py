from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from src.config import Config
from src.extensions import limiter

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config["JSON_AS_ASCII"] = False

    # CORS configuration
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Rate limiter
    limiter.init_app(app)

    # Register blueprints safely here
    from src.controllers.booth_controller import booth_bp
    from src.controllers.chat_controller import chat_bp
    app.register_blueprint(booth_bp)
    app.register_blueprint(chat_bp)

    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "healthy", "version": "v1"})

    # Secure Headers & Exception handling
    @app.after_request
    def set_secure_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        # Basic Content Security Policy (could be enhanced)
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        return response

    @app.errorhandler(400)
    def bad_request(_):
        return jsonify({"error": "Bad Request"}), 400

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": "Not Found"}), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"error": "Internal Server Error"}), 500

    return app

# The instance for gunicorn
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
