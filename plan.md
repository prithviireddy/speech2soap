Execution flow

Audio File
   ↓
speaker_diarization.py
   ↓
merge_consecutive_speakers.py
   ↓
ner_extractor.py
   ↓
outputs




SOAP (Subjective, Objective, Assessment, Plan)


Raw Dialogue
   ↓
nvidia nemo / speaker diarization
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
