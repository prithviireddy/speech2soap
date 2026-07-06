import shutil
import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.dependencies.auth import get_current_user
from src.models.appointment import Appointment, AppointmentStatus
from src.models.consultation import Consultation, ConsultationStatus
from src.models.user import User
from src.services.consultation_service import ConsultationService

router = APIRouter(
    prefix="/consultations",
    tags=["Consultations"],
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "data/uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/doctor/upload")
async def analyze_audio(
    background_tasks: BackgroundTasks,
    appointment_id: uuid.UUID = Form(...),
    file: UploadFile = File(...),
    chief_complaint: str | None = Form(None),
    doctor_notes: str | None = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    doctor = current_user.doctor_profile
    if doctor is None:
        raise HTTPException(
            status_code=403,
            detail="Doctor profile not found",
        )

    appointment = db.get(
        Appointment,
        appointment_id,
    )

    if appointment is None:
        raise HTTPException(
            status_code=404,
            detail="Appointment not found",
        )

    if appointment.doctor_id != doctor.id:
        raise HTTPException(
            status_code=403,
            detail="Appointment is not assigned to this doctor",
        )

    if appointment.consultation is not None:
        raise HTTPException(
            status_code=400,
            detail="Consultation already exists for this appointment",
        )

    filename = file.filename

    if filename is None:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing",
        )

    extension = Path(filename).suffix.lower()

    audio_filename = f"{uuid.uuid4()}{extension}"

    audio_path = UPLOAD_DIR / audio_filename

    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    consultation = Consultation(
        appointment_id=appointment.id,
        doctor_id=appointment.doctor_id,
        patient_id=appointment.patient_id,
        audio_file_path=str(audio_path),
        chief_complaint=chief_complaint,
        doctor_notes=doctor_notes,
        progress=0,
        current_stage="Uploaded",
        status=ConsultationStatus.UPLOADED,
    )
    appointment.status = AppointmentStatus.IN_PROGRESS

    db.add(consultation)
    db.commit()

    db.refresh(consultation)
    background_tasks.add_task(
        ConsultationService.process_audio,
        str(audio_path),
        consultation.id,
    )

    return {"consultation_id": consultation.id}


@router.get("/{consultation_id}/status")
async def get_status(
    consultation_id: uuid.UUID,
    db: Session = Depends(get_db),
):

    consultation = db.get(
        Consultation,
        consultation_id,
    )

    if not consultation:
        raise HTTPException(
            status_code=404,
            detail="Consultation not found",
        )

    response = {
        "progress": consultation.progress,
        "stage": consultation.current_stage,
        "status": consultation.status.value,
    }

    if consultation.report:
        response["report"] = consultation.report.report_json

    return response
