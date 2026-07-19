import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.dependencies.auth import get_current_doctor
from src.models.user import User
from src.schemas.doctor import DoctorAppointmentDetails, DoctorAppointmentListItem
from src.services.doctor_service import DoctorService

router = APIRouter(prefix="/doctor", tags=["Doctor"])


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
