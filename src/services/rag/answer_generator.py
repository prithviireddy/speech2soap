"""
answer_generator.py

Generates a grounded clinical answer using Gemini 2.5 Flash, given:
  - the doctor's question
  - the structured context from context_builder
  - optional conversation history for multi-turn sessions

Enforces clinical safety rules:
  - Answers must be grounded in retrieved evidence
  - Must not invent diagnoses, medications, or citations
  - Must frame information as documented evidence, not clinical advice
"""

import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

GENERATION_MODEL = "gemini-2.5-flash"

_SYSTEM_PROMPT = """You are a clinical documentation assistant helping a doctor retrieve information about a specific patient.

Your role is to:
- Answer questions by synthesizing the retrieved patient records provided below
- Cite specific evidence from the records in your answer
- Be precise and clinically accurate
- Clearly acknowledge when information is NOT available in the retrieved records

Rules you must follow:
1. Base your answer ONLY on the retrieved records provided — do not add external medical knowledge unless specifically asked
2. Never invent medications, dates, diagnoses, or clinical facts not present in the records
3. Frame patient-specific observations as documented information (e.g., "As of Aug 2026, the records document..." not "The patient has...")
4. If the records do not contain enough information to answer, say so clearly
5. Do not provide a clinical diagnosis — you are retrieving documented information
6. Keep answers concise and structured — use bullet points for lists

Format:
- Start with a direct answer
- Support with specific evidence from the records
- Use bullet points for lists of findings, medications, etc.
- If information spans multiple consultations, note the dates
"""


def _build_history_block(history: list[dict]) -> str:
    """
    Format prior conversation turns into a readable history block
    to inject into the LLM prompt for multi-turn context.

    Args:
        history: List of {"role": "user"|"assistant", "content": str} dicts,
                 in chronological order (oldest first).

    Returns:
        Formatted string or empty string if no history.
    """
    if not history:
        return ""

    lines = ["=== PREVIOUS CONVERSATION ==="]
    for msg in history:
        role = "Doctor" if msg["role"] == "user" else "Assistant"
        lines.append(f"{role}: {msg['content']}")
    lines.append("=== END OF PREVIOUS CONVERSATION ===\n")
    return "\n".join(lines)


def generate_answer(
    question: str,
    context: str,
    patient_name: str,
    doctor_name: str,
    history: list[dict] | None = None,
) -> str:
    """
    Call Gemini to generate a grounded answer with optional multi-turn history.

    Args:
        question:     The doctor's current question.
        context:      Structured context string from context_builder.build_context().
        patient_name: For personalizing the prompt.
        doctor_name:  For personalizing the prompt.
        history:      Prior conversation turns (oldest first) for multi-turn sessions.

    Returns:
        The generated answer text.
    """
    history_block = _build_history_block(history or [])

    user_prompt = f"""Patient: {patient_name}
Doctor: Dr. {doctor_name}

=== RETRIEVED PATIENT RECORDS ===
{context}
=== END OF RETRIEVED RECORDS ===

{history_block}Current question from Dr. {doctor_name}: {question}

Please answer based on the retrieved records above.{' Take into account the previous conversation for context.' if history_block else ''}"""

    response = _client.models.generate_content(
        model=GENERATION_MODEL,
        contents=f"{_SYSTEM_PROMPT}\n\n{user_prompt}",
    )

    return response.text or "Unable to generate an answer. Please try again."
