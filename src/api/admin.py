import uuid
from typing import Sequence

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.dependencies.auth import get_current_admin
from src.models.doctor import Doctor
from src.models.patient import Patient
from src.schemas.doctor import DoctorRead, DoctorRegistration, DoctorDetails
from src.schemas.patient import PatientRead, PatientRegistration
from src.services.admin_service import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(get_current_admin)],
)


@router.post(
    "/doctors",
    response_model=DoctorRead,
    status_code=status.HTTP_201_CREATED,
)
def create_doctor(
    payload: DoctorRegistration,
    db: Session = Depends(get_db),
) -> Doctor:
    service = AdminService(db)

    try:
        return service.create_doctor(payload)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "/doctors",
    response_model=list[DoctorRead],
)
def list_doctors(
    db: Session = Depends(get_db),
) -> Sequence[Doctor]:
    service = AdminService(db)
    return service.list_doctors()


@router.get(
    "/doctors/{doctor_id}",
    response_model=DoctorDetails,
)
def get_doctor(
    doctor_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    service = AdminService(db)

    try:
        return service.get_doctor(doctor_id)

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


@router.post(
    "/patients",
    response_model=PatientRead,
    status_code=status.HTTP_201_CREATED,
)
def create_patient(
    payload: PatientRegistration,
    db: Session = Depends(get_db),
) -> Patient:
    service = AdminService(db)

    try:
        return service.create_patient(payload)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
