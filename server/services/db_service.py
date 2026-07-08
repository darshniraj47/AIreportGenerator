"""
db_service.py — Firebase Firestore Database Service
==========================================
All database operations are encapsulated here.
Uses Firebase Firestore for cloud database storage.
"""

from firebase_admin import firestore
from datetime import datetime, timezone

# ─── Database connection ────────────────────────────────────────────────────────

# Maintain a global client to reuse connection pools across requests
_db = None

def get_db():
    """Returns the Firestore database client instance."""
    global _db
    if _db is None:
        try:
            _db = firestore.client()
        except Exception as e:
            raise RuntimeError(f"Failed to connect to Firestore: {e}")
            
    return _db

# ─── History CRUD ───────────────────────────────────────────────────────────────

def save_history(
    topic: str,
    content_type: str,
    tone: str,
    word_count: int,
    prompt: str,
    content: str,
    user_id: str = "anonymous",
) -> dict:
    """
    Save a generated content entry to the history collection.
    Returns the saved document with its string ID.
    """
    db = get_db()
    created_at = datetime.now(timezone.utc).isoformat()
    actual_word_count = len(content.split())
    
    data = {
        "user_id": user_id,
        "topic": topic,
        "content_type": content_type,
        "tone": tone,
        "word_count": word_count,
        "prompt": prompt,
        "content": content,
        "actual_word_count": actual_word_count,
        "created_at": created_at,
    }
    
    try:
        _, doc_ref = db.collection("history").add(data)
        data["_id"] = doc_ref.id
        return data
    except Exception as e:
        raise RuntimeError(f"Database error while saving history: {e}")


def get_history(user_id: str = "anonymous", search: str = "") -> list:
    """
    Retrieve history for a user, optionally filtered by a search term.
    Results are sorted by creation date descending (newest first).
    """
    db = get_db()
    
    try:
        # Fetch all documents for this user
        docs = db.collection("history").where(
            "user_id", "==", user_id
        ).order_by(
            "created_at", direction=firestore.Query.DESCENDING
        ).limit(100).stream()
        
        results = []
        for doc in docs:
            doc_data = doc.to_dict()
            doc_data["_id"] = doc.id
            
            # In-memory search filtering (Firestore lacks native regex)
            if search:
                search_lower = search.lower()
                topic_match = search_lower in doc_data.get("topic", "").lower()
                type_match = search_lower in doc_data.get("content_type", "").lower()
                if not (topic_match or type_match):
                    continue
                    
            results.append(doc_data)
            
        return results
    except Exception as e:
        raise RuntimeError(f"Database error while retrieving history: {e}")


def delete_history_item(item_id: str, user_id: str = "anonymous") -> bool:
    """
    Delete a single history item by its string ID.
    Returns True if deleted, False if not found.
    """
    db = get_db()
    
    try:
        doc_ref = db.collection("history").document(item_id)
        doc = doc_ref.get()
        if doc.exists and doc.to_dict().get("user_id") == user_id:
            doc_ref.delete()
            return True
        return False
    except Exception as e:
        raise RuntimeError(f"Database error while deleting history item: {e}")


def delete_all_history(user_id: str = "anonymous") -> int:
    """Delete all history entries for a user. Returns count of deleted items."""
    db = get_db()
    
    try:
        docs = db.collection("history").where("user_id", "==", user_id).stream()
        
        batch = db.batch()
        count = 0
        for doc in docs:
            batch.delete(doc.reference)
            count += 1
            # Firestore batches are limited to 500 operations
            if count % 500 == 0:
                batch.commit()
                batch = db.batch()
                
        if count % 500 != 0:
            batch.commit()
            
        return count
    except Exception as e:
        raise RuntimeError(f"Database error while deleting all history: {e}")
