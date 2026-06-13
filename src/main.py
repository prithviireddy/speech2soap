import uuid
import shutil
import json
import uvicorn
from pathlib import Path
from fastapi import BackgroundTasks
from fastapi import FastAPI, UploadFile, File
from src.api.auth import router as auth_router
from src.services.consultation_service import ConsultationService

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)


BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "data/uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

jobs = dict()

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

    background_tasks.add_task(ConsultationService.process_audio, audio_path, job_id,jobs)

    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def get_status(job_id: str):

    if job_id not in jobs:
        return {"error": "job not found"}

    return jobs[job_id]

if __name__ == "__main__":
    uvicorn.run(app,host='localhost',port = 8000)
