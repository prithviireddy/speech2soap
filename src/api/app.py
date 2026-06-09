import uuid
import shutil
import json
import uvicorn
from pathlib import Path
from fastapi import BackgroundTasks
from fastapi import FastAPI, UploadFile, File

from transcription.speaker_diarization import transcribe_audio
from processing.merge_dialogue import merge_dialogue
from clinicalReport.generate_report import generate_clinical_report

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "data/uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

jobs = dict()

def process_audio_pipeline(audio_path, job_id):

    try:
        jobs[job_id]["progress"] = 10
        jobs[job_id]["stage"] = "transcription"

        diarized_path = transcribe_audio(audio_path,job_id,jobs)

        jobs[job_id]["progress"] = 90
        jobs[job_id]["stage"] = "Processing Transcript"

        merged_path = merge_dialogue(diarized_path)

        jobs[job_id]["progress"] = 95
        jobs[job_id]["stage"] = "Generating Clinical Report"

        report_path = generate_clinical_report(merged_path)

        with open(report_path, "r", encoding="utf-8") as f:
            report = json.load(f)

        jobs[job_id]["progress"] = 100
        jobs[job_id]["stage"] = "completed"
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["report"] = report

    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)


@app.get("/")
def root():
    return {"message": "Clinical AI API running"}


@app.post("/upload")
async def analyze_audio(
    background_tasks: BackgroundTasks, file: UploadFile = File(...)
):

    audio_path = UPLOAD_DIR / file.filename

    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    job_id = str(uuid.uuid4())

    jobs[job_id] = {"progress": 0, "stage": "upload", "status": "processing"}

    background_tasks.add_task(process_audio_pipeline, audio_path, job_id)

    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def get_status(job_id: str):

    if job_id not in jobs:
        return {"error": "job not found"}

    return jobs[job_id]

if __name__ == "__main__":
    uvicorn.run(app,host="0.0.0.0",port = 8000)
