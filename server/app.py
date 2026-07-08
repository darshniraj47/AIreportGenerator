"""
app.py — Flask Application Entry Point
========================================
Creates and configures the Flask application, registers blueprints,
sets up CORS, and defines the health check endpoint.

Run locally:
    python app.py

Run with Gunicorn (production):
    gunicorn -w 4 -b 0.0.0.0:5000 app:app
"""

import os
import json
import base64
import sys

# Add the server directory to python path for Vercel deployment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# FIX: Protobuf compatibility bug with Python 3.14 alpha
os.environ["PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION"] = "python"

from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

# Import route blueprints
from routes.generate import generate_bp
from routes.history import history_bp

import firebase_admin
from firebase_admin import credentials

# Initialize Firebase Admin SDK
try:
    firebase_creds = os.environ.get("FIREBASE_CREDENTIALS")
    if firebase_creds:
        # Vercel deployment uses environment variable
        import json
        cred_dict = json.loads(firebase_creds)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin initialized successfully with FIREBASE_CREDENTIALS env var.")
    elif os.path.exists("serviceAccountKey.json"):
        # Local development uses file
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        print("Firebase Admin initialized successfully with serviceAccountKey.json")
    else:
        # In production (Firebase Functions), this is used automatically
        firebase_admin.initialize_app()
        print("Firebase Admin initialized successfully with default credentials.")
except Exception as e:
    print(f"Warning: Failed to initialize Firebase Admin: {e}")

def create_app() -> Flask:
    """
    Flask application factory.
    Creates, configures, and returns the Flask app instance.
    """
    app = Flask(__name__)

    # ── Load configuration ──────────────────────────────────────────────────────
    app.config["SECRET_KEY"] = Config.SECRET_KEY
    app.config["DEBUG"] = Config.DEBUG

    # ── CORS Setup ──────────────────────────────────────────────────────────────
    # Allow requests from the React frontend
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=False,
    )

    # ── Register Blueprints ─────────────────────────────────────────────────────
    app.register_blueprint(generate_bp)
    app.register_blueprint(history_bp)

    # ── Health Check ────────────────────────────────────────────────────────────
    @app.route("/health", methods=["GET"])
    def health():
        """Simple health check endpoint for deployment monitoring."""
        return jsonify({
            "status": "ok",
            "service": "AI Report Generator API",
            "version": "1.0.0",
        }), 200

    # ── Global error handlers ───────────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Endpoint not found."}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Method not allowed."}), 405

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error. Please try again."}), 500

    return app


# ─── Entry point ────────────────────────────────────────────────────────────────
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
