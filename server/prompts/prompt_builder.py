"""
prompt_builder.py — Dynamic Prompt Engineering Module
======================================================
Builds structured, context-aware prompts based on user selections.
This module is the core of the prompt engineering strategy.

Design: All prompt templates live here so they can be updated or
extended without touching the API layer.
"""

from typing import Optional


# ─── Section templates per content type ────────────────────────────────────────

SECTION_TEMPLATES = {
    "Report": [
        "Title",
        "Executive Summary",
        "Introduction",
        "Background and Context",
        "Main Analysis",
        "Key Findings",
        "Advantages and Benefits",
        "Challenges and Limitations",
        "Future Scope and Recommendations",
        "Conclusion",
        "References (if applicable)",
    ],
    "Summary": [
        "Overview",
        "Key Points",
        "Main Takeaways",
        "Conclusion",
    ],
    "Blog": [
        "Engaging Title",
        "Hook / Opening Paragraph",
        "Background",
        "Main Content (with subheadings)",
        "Examples and Case Studies",
        "Practical Tips",
        "Call to Action",
        "Conclusion",
    ],
    "Article": [
        "Headline",
        "Introduction",
        "Main Body (divided into clear sections)",
        "Expert Insights",
        "Real-World Examples",
        "Challenges",
        "Conclusion",
    ],
    "Email": [
        "Subject Line",
        "Salutation",
        "Opening Statement",
        "Body (clear and concise)",
        "Call to Action",
        "Closing",
        "Signature",
    ],
    "Assignment": [
        "Title Page",
        "Abstract",
        "Introduction",
        "Literature Review",
        "Methodology",
        "Discussion",
        "Results and Analysis",
        "Conclusion",
        "References",
    ],
    "Research Notes": [
        "Topic Overview",
        "Key Concepts and Definitions",
        "Current Research Landscape",
        "Important Findings",
        "Methodologies Used",
        "Open Problems",
        "Interesting Papers / Sources to Explore",
        "Personal Observations",
    ],
}


# ─── Tone instruction map ───────────────────────────────────────────────────────

TONE_INSTRUCTIONS = {
    "Professional": (
        "Use a professional and polished tone. "
        "Write clearly and concisely for a business or industry audience. "
        "Avoid informal language and slang."
    ),
    "Academic": (
        "Use a formal academic tone suitable for scholarly writing. "
        "Use precise terminology, cite concepts properly, and maintain objectivity. "
        "Write in third person where appropriate."
    ),
    "Formal": (
        "Use a formal and structured tone. "
        "Maintain a respectful, measured style appropriate for official communications."
    ),
    "Friendly": (
        "Use a warm, conversational, and approachable tone. "
        "Write as if explaining to a knowledgeable friend. "
        "Use 'you' and keep sentences engaging."
    ),
}


# ─── Main prompt builder ────────────────────────────────────────────────────────

def build_prompt(
    topic: str,
    content_type: str,
    tone: str,
    word_count: int,
    custom_instructions: Optional[str] = None,
) -> str:
    """
    Constructs a detailed, structured prompt for the LLM.

    Args:
        topic:               The subject/topic to write about.
        content_type:        One of the keys in SECTION_TEMPLATES.
        tone:                Writing tone (Professional, Academic, etc.).
        word_count:          Target word count for the generated content.
        custom_instructions: Optional additional instructions from the user.

    Returns:
        A formatted prompt string ready to be sent to the LLM.
    """
    # Resolve sections for this content type
    sections = SECTION_TEMPLATES.get(content_type, SECTION_TEMPLATES["Report"])
    sections_list = "\n".join(f"  - {s}" for s in sections)

    # Resolve tone instruction
    tone_instruction = TONE_INSTRUCTIONS.get(
        tone, TONE_INSTRUCTIONS["Professional"]
    )

    # Build prompt
    prompt = f"""You are an expert content writer and researcher.

Task: Generate a complete {content_type} on the following topic.

Topic: {topic}
Content Type: {content_type}
Tone: {tone}
Target Word Count: STRICTLY {word_count} words

Tone Instruction:
{tone_instruction}

Required Structure — include ALL of the following sections in order:
{sections_list}

Formatting Guidelines:
- Use Markdown formatting for all headings (##, ###) and emphasis (**bold**, *italic*).
- Each section must have a clear ## heading.
- Use bullet points or numbered lists where appropriate.
- Write in well-structured paragraphs.
- Do NOT add any preamble like "Sure!" or "Here is your content:" — start directly with the title.
- CRITICAL REQUIREMENT: You MUST generate exactly {word_count} words. Do NOT exceed {word_count} words and do NOT fall short. The length is a strict requirement.

{"Additional Instructions from User:" + chr(10) + custom_instructions if custom_instructions else ""}

Now generate the complete {content_type} on "{topic}":"""

    return prompt.strip()


def get_prompt_preview(
    topic: str,
    content_type: str,
    tone: str,
    word_count: int,
    custom_instructions: Optional[str] = None,
) -> dict:
    """
    Returns the prompt string along with metadata about it,
    to be displayed in the frontend Prompt Preview panel.
    """
    prompt = build_prompt(topic, content_type, tone, word_count, custom_instructions)
    sections = SECTION_TEMPLATES.get(content_type, SECTION_TEMPLATES["Report"])

    return {
        "prompt": prompt,
        "sections": sections,
        "tone_instruction": TONE_INSTRUCTIONS.get(tone, ""),
        "estimated_tokens": len(prompt.split()),  # rough estimate
    }
