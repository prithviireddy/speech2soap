import uuid

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.dependencies.auth import get_current_doctor
from src.models.user import User
from src.schemas.doctor import (
    DoctorAppointmentDetails,
    DoctorAppointmentListItem,
    DoctorConsultationListItem,
    DoctorConsultationRead,
    DoctorConsultationStatusRead,
)
from src.services.consultation_service import ConsultationService
from src.services.doctor_service import DoctorService

router = APIRouter(
    prefix="/doctor",
    tags=["Doctor"],
)


@router.get("/appointments", response_model=list[DoctorAppointmentListItem])
def list_appointments(
    current_user: User = Depends(get_current_doctor), db: Session = Depends(get_db)
) -> list[DoctorAppointmentListItem]:
    service = DoctorService(db)
    try:
        doctor = current_user.doctor_profile
        if doctor is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Doctor profile not found",
            )
        return service.list_appointments(doctor.id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.get("/appointments/{appointment_id}", response_model=DoctorAppointmentDetails)
def get_appointment(
    appointment_id: uuid.UUID,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    service = DoctorService(db)
    try:
        doctor = current_user.doctor_profile
        if doctor is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Doctor profile not found",
            )
        return service.get_appointment(doctor.id, appointment_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        )


@router.post("/consultations/upload")
async def upload_consultation(
    background_tasks: BackgroundTasks,
    appointment_id: uuid.UUID = Form(...),
    file: UploadFile = File(...),
    chief_complaint: str | None = Form(None),
    doctor_notes: str | None = Form(None),
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):

    doctor = current_user.doctor_profile

    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found.",
        )

    service = DoctorService(db)

    try:
        consultation_id, audio_path = service.upload_consultation(
            doctor.id,
            appointment_id,
            file,
            chief_complaint,
            doctor_notes,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        )

    background_tasks.add_task(
        ConsultationService.process_audio,
        audio_path,
        consultation_id,
    )

    return {
        "consultation_id": consultation_id,
    }


@router.get(
    "/consultations",
    response_model=list[DoctorConsultationListItem],
)
def list_consultations(
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):

    doctor = current_user.doctor_profile

    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found.",
        )

    service = DoctorService(db)

    return service.list_consultations(
        doctor.id,
    )


@router.get(
    "/consultations/{consultation_id}",
    response_model=DoctorConsultationRead,
)
def get_consultation(
    consultation_id: uuid.UUID,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):

    doctor = current_user.doctor_profile

    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found.",
        )

    service = DoctorService(db)

    try:
        return service.get_consultation(
            doctor.id,
            consultation_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        )


@router.get(
    "/consultations/{consultation_id}/status",
    response_model=DoctorConsultationStatusRead,
)
def get_consultation_status(
    consultation_id: uuid.UUID,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):

    doctor = current_user.doctor_profile

    if doctor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found.",
        )

    service = DoctorService(db)

    try:
        return service.get_consultation_status(
            doctor.id,
            consultation_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        )
