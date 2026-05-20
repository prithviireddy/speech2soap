import shutil
import json

from pathlib import Path
from fastapi import FastAPI, UploadFile, File

from transcription.speaker_diarization import transcribe_audio
from processing.merge_dialogue import merge_dialogue
from clinical.generate_report import generate_clinical_report


app = FastAPI()


BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "data/uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/")
def root():
    return {"message": "Clinical AI API running"}


@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):

    # Save uploaded audio
    audio_path = UPLOAD_DIR / file.filename

    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run pipeline
    diarized_path = transcribe_audio(audio_path)

    merged_path = merge_dialogue(diarized_path)

    report_path = generate_clinical_report(merged_path)

    # Load final report
    with open(report_path, "r", encoding="utf-8") as f:
        report = json.load(f)

    return report
