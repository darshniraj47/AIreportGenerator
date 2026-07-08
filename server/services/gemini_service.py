"""
gemini_service.py — LLM Service (Google Gemini)
=================================================
Abstracted LLM service layer. The rest of the application only
calls `generate_content()` — making it trivial to swap Gemini
for another LLM (OpenAI, Anthropic, etc.) in the future.

To replace Gemini:
  1. Install the new SDK.
  2. Implement the same `generate_content(prompt) -> str` interface below.
  3. Update `_create_client()` and `generate_content()`.
"""

import google.generativeai as genai
from config import Config


# ─── Model configuration ────────────────────────────────────────────────────────

# Gemini model to use. Change here to switch versions.
GEMINI_MODEL = "gemini-2.5-flash"

# Generation configuration for quality control
GENERATION_CONFIG = {
    "temperature": 0.7,       # Creativity vs consistency balance
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
}

# Safety settings — permissive for educational/research content
SAFETY_SETTINGS = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
]


def _create_client():
    """
    Initialise the Gemini client with the API key from environment.
    Raises RuntimeError with a clear message if the key is missing.
    """
    api_key = Config.get_gemini_api_key()
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        generation_config=GENERATION_CONFIG,
        safety_settings=SAFETY_SETTINGS,
    )


def generate_content(prompt: str) -> str:
    """
    Send a prompt to the configured LLM and return the text response.

    Args:
        prompt: The fully-built prompt string.

    Returns:
        The generated text as a string.

    Raises:
        RuntimeError: If the API key is missing or the API call fails.
        ValueError:   If the model returns an empty response.
    """
    try:
        model = _create_client()
        response = model.generate_content(prompt)

        # Extract text from the response
        if not response.text:
            raise ValueError(
                "The AI model returned an empty response. "
                "Try rephrasing your topic or adjusting the word count."
            )

        return response.text

    except RuntimeError:
        # Re-raise config errors as-is (they have clear messages)
        raise

    except Exception as exc:
        # Wrap unexpected errors with a user-friendly message
        raise RuntimeError(
            f"Failed to generate content via Gemini API: {str(exc)}"
        ) from exc


# ─── Service metadata (used by health check endpoint) ──────────────────────────

def get_service_info() -> dict:
    """Return metadata about the current LLM service configuration."""
    return {
        "provider": "Google Gemini",
        "model": GEMINI_MODEL,
        "status": "configured" if Config.get_gemini_api_key() else "missing_key",
    }
