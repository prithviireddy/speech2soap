from google import genai
import os
import json
import re
import time

from dotenv import load_dotenv
from pathlib import Path

# this file analyses doctor-patient convo transcripts and generates soap sections and clinical summary


load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

BASE_DIR = Path(__file__).resolve().parent.parent.parent

OUTPUT_DIR = BASE_DIR / "data/processed/clinical_reports_test"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = """
You are an advanced clinical NLP system.

Your task:
Analyze the doctor-patient conversation and generate:

1. SOAP sections
2. Clinical entities
3. Clinical summary

Return STRICT VALID JSON ONLY.

Required JSON format:

{
  "soap": {
    "subjective": [],
    "objective": [],
    "assessment": [],
    "plan": []
  },
  "entities": {
    "symptoms": [],
    "medications": [],
    "diagnosis": [],
    "duration": []
  },
  "summary": ""
}

Rules:
- Return ONLY valid JSON
- No markdown
- No explanations
- No extra text
- Keep SOAP utterances concise
- Avoid duplicates in entities
- summary must be short and clinical
- If information is missing, return empty arrays
"""


# Optional text cleanup
def clean_text(text):

    text = re.sub(r"<.*?>", "", text)
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def generate_clinical_report(transcript_path: Path) -> Path:

    print(f"Generating report: {transcript_path.name}")

    # Load merged transcript
    with open(transcript_path, "r", encoding="utf-8") as f:
        segments = json.load(f)

    # Convert JSON transcript → dialogue text
    dialogue_text = ""

    for segment in segments:
        speaker = segment.get("speaker", "UNKNOWN")
        text = segment.get("text", "").strip()

        if not text:
            continue

        dialogue_text += f"{speaker}: {text}\n"

    dialogue_text = clean_text(dialogue_text)

    USER_PROMPT = f"""
Analyze this clinical conversation.

Conversation:
{dialogue_text}
"""

    # Generate clinical report
    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=f"{SYSTEM_PROMPT}\n\n{USER_PROMPT}",
    )

    if not response.text:
        raise ValueError("Empty response from Gemini")

    raw_text = response.text.strip()

    # Remove markdown fences if model adds them
    raw_text = raw_text.replace("```json", "")
    raw_text = raw_text.replace("```", "")
    raw_text = raw_text.strip()

    # Parse JSON
    clinical_output = json.loads(raw_text)

    # Output path
    output_path = OUTPUT_DIR / f"{transcript_path.stem}.json"

    # Save report
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(clinical_output, f, indent=2, ensure_ascii=False)

    print(f"Saved -> {output_path}")

    # Optional rate limit safety
    time.sleep(1)

    return output_path
