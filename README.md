# ClinicReport

AI-powered clinical conversation processing pipeline that converts raw doctor–patient audio into structured medical documentation.

Built with:

* WhisperX for transcription + diarization
* FastAPI backend
* Streamlit frontend
* LLM-based SOAP note generation
* Clinical dialogue restructuring pipeline

---

# Features

* Audio transcription using WhisperX
* Speaker diarization
* Dialogue cleanup and restructuring
* SOAP note extraction
* Clinical summary generation
* FastAPI backend API
* Streamlit UI
* Modular pipeline architecture
* JSON structured outputs

---

# Pipeline Overview

```text
Doctor-Patient Audio
        │
        ▼
WhisperX Transcription
        │
        ▼
Speaker Diarization
        │
        ▼
Dialogue Merging & Cleanup
        │
        ▼
LLM Clinical Structuring
        │
        ├── SOAP Notes
        ├── Clinical Summary
        ├── Key Symptoms
        ├── Medications
        └── Diagnoses
```

---

# Tech Stack

| Component     | Technology                 |
| ------------- | -------------------------- |
| Transcription | WhisperX                   |
| Backend       | FastAPI                    |
| Frontend      | Streamlit                  |
| LLM           | Gemini / OpenAI-compatible |
| Environment   | Python + uv                |
| Diarization   | pyannote / WhisperX        |

---

# Project Structure

```bash
clinicReport/
│
├── src/
│   ├── api/
│   │   └── main.py
│   │
│   ├── transcription/
│   │   ├── speaker_diarization.py
│   │   └── transcribe.py
│   │
│   ├── processing/
│   │   ├── merge_dialogue.py
│   │   ├── cleanup.py
│   │   └── clinical_structure.py
│   │
│   ├── ui/
│   │   └── streamlit_app.py
│   │
│   └── outputs/
│
├── .env
├── pyproject.toml
├── README.md
└── uv.lock
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/clinicReport.git

cd clinicReport
```

---

## 2. Install Dependencies

Using `uv`:

```bash
uv sync
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
GOOGLE_API_KEY=your_api_key
HF_TOKEN=your_huggingface_token
```

---

# Running the Backend

Start FastAPI server:

```bash
uv run uvicorn src.api.main:app --reload
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

---

# Running the Streamlit UI

```bash
uv run streamlit run src/ui/streamlit_app.py
```

---

# API Endpoints

## Upload Audio

```http
POST /process-audio
```

Processes:

* transcription
* diarization
* cleanup
* SOAP extraction

Returns structured JSON response.

---

# Example Output

```json
{
  "soap": {
    "subjective": [
      "Patient reports diarrhea for 3 days.",
      "Loose watery stools 6-7 times daily."
    ],
    "objective": [
      "Mild abdominal tenderness."
    ],
    "assessment": [
      "Likely acute gastroenteritis."
    ],
    "plan": [
      "Oral rehydration.",
      "Monitor symptoms."
    ]
  },

  "summary": "Patient presents with acute diarrhea likely due to gastroenteritis."
}
```

---

# Future Improvements

* Role assignment (Doctor vs Patient)
* EMR/EHR integration
* ICD-10 code extraction
* Prescription generation
* Medical entity extraction
* RAG over patient history
* Multilingual support
* Real-time consultation processing
* Local LLM deployment

---

# Challenges

Clinical conversations are noisy and unstructured:

* overlapping speech
* fragmented sentences
* filler words
* repeated phrases
* medical terminology variations

This project focuses on converting that messy conversational data into clinically useful structured documentation.

---

# Why This Project Matters

Doctors spend significant time on documentation instead of patient interaction.

ClinicReport aims to reduce administrative burden by automatically generating structured clinical notes from consultations.

---

# Disclaimer

This project is for research and educational purposes only.

Not intended for direct clinical deployment without proper medical validation, compliance checks, and regulatory approval.

---

# License

MIT License

---

# Contributors

Built by Maddy.
