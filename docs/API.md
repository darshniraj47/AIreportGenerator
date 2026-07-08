# API Documentation

## Base URL

- **Development:** `http://localhost:5000`
- **Production:** `https://your-backend.onrender.com`

---

## Endpoints

### Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "AI Report Generator API",
  "version": "1.0.0"
}
```

---

### Generate Content

```
POST /generate
```

**Request Body:**
```json
{
  "topic": "Artificial Intelligence in Healthcare",
  "content_type": "Report",
  "tone": "Professional",
  "word_count": 1000,
  "custom_instructions": "Focus on Indian hospitals",
  "user_id": "user123"
}
```

| Field | Type | Required | Options |
|-------|------|----------|---------|
| `topic` | string | ✅ | Any text (max 500 chars) |
| `content_type` | string | ✅ | Report, Summary, Blog, Article, Email, Assignment, Research Notes |
| `tone` | string | ✅ | Professional, Academic, Formal, Friendly |
| `word_count` | integer | ✅ | 100–5000 |
| `custom_instructions` | string | ❌ | Additional instructions |
| `user_id` | string | ❌ | User identifier for history |

**Success Response (200):**
```json
{
  "content": "## Introduction\n\n...",
  "prompt": "You are an expert...",
  "word_count": 1023,
  "reading_time_minutes": 5.1,
  "history_id": "6878abc123def456",
  "topic": "Artificial Intelligence in Healthcare",
  "content_type": "Report",
  "tone": "Professional"
}
```

**Error Responses:**
```json
// 400 - Validation Error
{ "error": "Topic is required and cannot be empty." }

// 500 - Generation Failed
{ "error": "Failed to generate content via Gemini API: ..." }
```

---

### Preview Prompt

```
POST /preview
```

Same request body as `/generate`. Returns the prompt without calling Gemini.

**Response (200):**
```json
{
  "prompt": "You are an expert content writer...",
  "sections": ["Title", "Introduction", "Main Content", "..."],
  "tone_instruction": "Use a professional and polished tone...",
  "estimated_tokens": 156
}
```

---

### Get History

```
GET /history?user_id=user123&search=blockchain
```

| Query Param | Type | Required | Description |
|-------------|------|----------|-------------|
| `user_id` | string | ❌ | Defaults to "anonymous" |
| `search` | string | ❌ | Search in topic / content_type |

**Response (200):**
```json
{
  "history": [
    {
      "_id": "6878abc123def456",
      "user_id": "user123",
      "topic": "Blockchain Technology",
      "content_type": "Report",
      "tone": "Academic",
      "word_count": 1000,
      "actual_word_count": 1023,
      "created_at": "2024-06-15T10:30:00.000000+00:00"
    }
  ],
  "count": 1
}
```

---

### Delete History Item

```
DELETE /history/<item_id>?user_id=user123
```

**Response (200):**
```json
{ "message": "History item deleted successfully." }
```

**Error (404):**
```json
{ "error": "History item not found or access denied." }
```

---

### Delete All History

```
DELETE /history?user_id=user123
```

**Response (200):**
```json
{
  "message": "Deleted 15 history item(s) successfully.",
  "deleted_count": 15
}
```
