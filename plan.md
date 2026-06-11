Execution flow

React
  ↓
uploadAudio()
  ↓
Axios
  ↓
FastAPI
  ↓
Whisper
  ↓
Diarization
  ↓
LLM
  ↓
Clinical Report


SOAP (Subjective, Objective, Assessment, Plan)


Raw Dialogue
   ↓
whisper / speaker diarization
   ↓
transcript cleanup
   ↓
SOAP categorization
   ↓
Structured medical summary generation



clinical-report/
│
├── data/
│   ├── raw_audio/
│   ├── processed/
│   │   ├── diarized_transcripts/
│   │   ├── merged_transcripts/
│   │   └── clinical_reports/
│
├── src/
│   ├── transcription/
│   │   └── whisperx_pipeline.py
│   │
│   ├── processing/
│   │   ├── merge_dialogue.py
│   │   └── clean_text.py
│   │
│   ├── clinical/
│   │   └── generate_report.py
│   │
│   └── main.py
│
├── .env
├── requirements.txt
└── README.md


Doctor uploads audio
        ↓
Transcript generated
        ↓
Clinical report generated
        ↓
Doctor reviews
        ↓
Doctor edits if needed
        ↓
Doctor approves
