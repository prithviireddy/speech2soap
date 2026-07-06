from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.dependencies.auth import get_current_admin
from src.schemas.doctor import DoctorRegistration, DoctorRead
from src.schemas.patient import PatientRegistration, PatientRead
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
):
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
):
    service = AdminService(db)
    return service.list_doctors()
    
@router.post(
    "/patients",
    response_model=PatientRead,
    status_code=status.HTTP_201_CREATED,
)
def create_patient(
    payload: PatientRegistration,
    db: Session = Depends(get_db),
):
    service = AdminService(db)

    try:
        return service.create_patient(payload)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
