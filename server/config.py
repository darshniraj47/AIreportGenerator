"""
config.py — Application Configuration
======================================
Loads all environment variables from .env file using python-dotenv.
Raises clear errors for missing required variables.
"""

import os
from dotenv import load_dotenv

# Load .env file from the server directory
load_dotenv()


def get_required_env(key: str) -> str:
    """
    Retrieve a required environment variable.
    Raises a RuntimeError with a clear message if the variable is not set.
    """
    value = os.getenv(key)
    if not value:
        raise RuntimeError(
            f"❌ Missing required environment variable: '{key}'\n"
            f"   Please copy server/.env.example to server/.env and fill in your values."
        )
    return value


class Config:
    """Central configuration class for the Flask application."""

    # --- Flask ---
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    DEBUG: bool = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    FLASK_ENV: str = os.getenv("FLASK_ENV", "production")

    # --- CORS ---
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # --- Google Gemini API ---
    # Validated lazily so we can give a useful error at request time
    @staticmethod
    def get_gemini_api_key() -> str:
        return get_required_env("GEMINI_API_KEY")

    # --- MongoDB ---
    # Removed in favor of Firebase Firestore
