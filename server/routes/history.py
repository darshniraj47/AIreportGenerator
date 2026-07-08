"""
history.py — History Management Routes
========================================
GET    /history           - Retrieve generation history
DELETE /history/<id>      - Delete a specific history item
DELETE /history           - Delete all history for a user
"""

from flask import Blueprint, request, jsonify
from services.db_service import get_history, delete_history_item, delete_all_history

history_bp = Blueprint("history", __name__)


@history_bp.route("/history", methods=["GET"])
def get_history_route():
    """
    Retrieve history for a user.

    Query parameters:
        user_id  (str)  optional, defaults to "anonymous"
        search   (str)  optional, search term for topic / content_type

    Response:
        200: { history: [...], count: int }
        500: { error: "database error" }
    """
    user_id = request.args.get("user_id", "anonymous")
    search = request.args.get("search", "").strip()

    try:
        history = get_history(user_id=user_id, search=search)
        return jsonify({"history": history, "count": len(history)}), 200
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500


@history_bp.route("/history/<item_id>", methods=["DELETE"])
def delete_history_route(item_id: str):
    """
    Delete a specific history item by ID.

    URL parameter:
        item_id  (str)  MongoDB ObjectId string

    Query parameter:
        user_id  (str)  optional, defaults to "anonymous"

    Response:
        200: { message: "Deleted successfully" }
        400: { error: "Invalid ID format" }
        404: { error: "Item not found" }
        500: { error: "database error" }
    """
    user_id = request.args.get("user_id", "anonymous")

    try:
        deleted = delete_history_item(item_id=item_id, user_id=user_id)
        if deleted:
            return jsonify({"message": "History item deleted successfully."}), 200
        else:
            return jsonify({"error": "History item not found or access denied."}), 404
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500


@history_bp.route("/history", methods=["DELETE"])
def delete_all_history_route():
    """
    Delete all history entries for a user.

    Query parameter:
        user_id  (str)  optional, defaults to "anonymous"

    Response:
        200: { message: "...", deleted_count: int }
        500: { error: "database error" }
    """
    user_id = request.args.get("user_id", "anonymous")

    try:
        count = delete_all_history(user_id=user_id)
        return jsonify({
            "message": f"Deleted {count} history item(s) successfully.",
            "deleted_count": count,
        }), 200
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 500
