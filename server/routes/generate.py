"""
generate.py — Content Generation Route
========================================
POST /generate     - Generate content using Gemini API
POST /preview      - Preview the prompt without generating content
"""

from flask import Blueprint, request, jsonify
from prompts.prompt_builder import build_prompt, get_prompt_preview
from services.gemini_service import generate_content
from services.db_service import save_history

generate_bp = Blueprint("generate", __name__)

# ─── Validation constants ───────────────────────────────────────────────────────

VALID_CONTENT_TYPES = [
    "Report", "Summary", "Blog", "Article",
    "Email", "Assignment", "Research Notes"
]

VALID_TONES = ["Professional", "Academic", "Formal", "Friendly"]

MIN_WORD_COUNT = 100
MAX_WORD_COUNT = 5000


def validate_generate_request(data: dict) -> tuple[bool, str]:
    """
    Validate the incoming generate request payload.
    Returns (is_valid: bool, error_message: str).
    """
    topic = data.get("topic", "").strip()
    content_type = data.get("content_type", "")
    tone = data.get("tone", "")
    word_count = data.get("word_count")

    if not topic:
        return False, "Topic is required and cannot be empty."

    if len(topic) > 500:
        return False, "Topic must be 500 characters or fewer."

    if content_type not in VALID_CONTENT_TYPES:
        return False, f"Invalid content type. Choose from: {', '.join(VALID_CONTENT_TYPES)}"

    if tone not in VALID_TONES:
        return False, f"Invalid tone. Choose from: {', '.join(VALID_TONES)}"

    try:
        word_count = int(word_count)
    except (TypeError, ValueError):
        return False, "Word count must be a valid number."

    if not (MIN_WORD_COUNT <= word_count <= MAX_WORD_COUNT):
        return False, f"Word count must be between {MIN_WORD_COUNT} and {MAX_WORD_COUNT}."

    return True, ""


# ─── Routes ─────────────────────────────────────────────────────────────────────

@generate_bp.route("/generate", methods=["POST"])
def generate():
    """
    Generate content using Gemini API based on user selections.

    Request body (JSON):
        topic           (str)  required
        content_type    (str)  required
        tone            (str)  required
        word_count      (int)  required
        custom_instructions (str) optional
        user_id         (str)  optional, defaults to "anonymous"

    Response:
        200: { content, prompt, word_count, reading_time_minutes, history_id }
        400: { error: "validation error message" }
        500: { error: "generation failed message" }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    # Validate input
    is_valid, error_msg = validate_generate_request(data)
    if not is_valid:
        return jsonify({"error": error_msg}), 400

    topic = data["topic"].strip()
    content_type = data["content_type"]
    tone = data["tone"]
    word_count = int(data["word_count"])
    custom_instructions = data.get("custom_instructions", "").strip() or None
    user_id = data.get("user_id", "anonymous")

    # Build the dynamic prompt
    prompt = build_prompt(topic, content_type, tone, word_count, custom_instructions)

    # Call Gemini API
    try:
        content = generate_content(prompt)
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 500

    # Calculate stats
    actual_word_count = len(content.split())
    reading_time = round(actual_word_count / 200, 1)  # avg 200 words/min

    # Save to MongoDB history (non-blocking — errors don't fail the request)
    history_id = None
    try:
        saved = save_history(
            topic=topic,
            content_type=content_type,
            tone=tone,
            word_count=word_count,
            prompt=prompt,
            content=content,
            user_id=user_id,
        )
        history_id = saved.get("_id")
    except Exception as db_exc:
        # Log but don't fail — content generation succeeded
        print(f"[WARNING] Failed to save history: {db_exc}")

    return jsonify({
        "content": content,
        "prompt": prompt,
        "word_count": actual_word_count,
        "reading_time_minutes": reading_time,
        "history_id": history_id,
        "topic": topic,
        "content_type": content_type,
        "tone": tone,
    }), 200


@generate_bp.route("/preview", methods=["POST"])
def preview_prompt():
    """
    Preview the generated prompt without calling the LLM.
    Useful for showing users what prompt will be sent.
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    is_valid, error_msg = validate_generate_request(data)
    if not is_valid:
        return jsonify({"error": error_msg}), 400

    topic = data["topic"].strip()
    content_type = data["content_type"]
    tone = data["tone"]
    word_count = int(data["word_count"])
    custom_instructions = data.get("custom_instructions", "").strip() or None

    preview = get_prompt_preview(topic, content_type, tone, word_count, custom_instructions)
    return jsonify(preview), 200
