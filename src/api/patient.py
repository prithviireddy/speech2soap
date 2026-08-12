import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.dependencies.auth import get_current_patient
from src.models.user import User

from src.schemas.patient import (
    PatientDetails,
    PatientUpdate,
)

from src.schemas.report import (
    ReportRead,
    ReportSummary,
)

from src.services.patient_service import PatientService


router = APIRouter(
    prefix="/patient",
    tags=["Patient"],
)


@router.get(
    "/me",
    response_model=PatientDetails,
)
def get_profile(
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    patient = current_user.patient_profile

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    service = PatientService(db)

    try:
        return service.get_profile(patient.id)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )



@router.patch(
    "/me",
    response_model=PatientDetails,
)
def update_profile(
    payload: PatientUpdate,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    patient = current_user.patient_profile

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    service = PatientService(db)

    try:
        return service.update_profile(
            patient.id,
            payload,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.get(
    "/reports",
    response_model=list[ReportSummary],
)
def list_reports(
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    patient = current_user.patient_profile

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    service = PatientService(db)

    return service.list_reports(
        patient.id,
    )



@router.get(
    "/reports/{report_id}",
    response_model=ReportRead,
)
def get_report(
    report_id: uuid.UUID,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    patient = current_user.patient_profile

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    service = PatientService(db)

    try:
        return service.get_report(
            patient.id,
            report_id,
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
