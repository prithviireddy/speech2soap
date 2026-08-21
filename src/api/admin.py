import uuid
from typing import Sequence

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.dependencies.auth import get_current_admin
from src.models.doctor import Doctor
from src.models.patient import Patient
from src.models.appointment import Appointment
from src.schemas.doctor import DoctorRead, DoctorRegistration, DoctorDetails, DoctorUpdate
from src.schemas.patient import PatientRead, PatientRegistration, PatientDetails, PatientUpdate
from src.schemas.appointment import AppointmentCreate, AppointmentFilters, AppointmentListItem, AppointmentRead, AppointmentUpdate,PatientLookup,DoctorLookup
from src.services.admin_service import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(get_current_admin)],
)

# Doctor APIs


@router.post(
    "/doctors",
    response_model=DoctorRead,
    status_code=status.HTTP_201_CREATED,
)
def create_doctor(payload: DoctorRegistration,db: Session = Depends(get_db)) -> Doctor:
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
def list_doctors(db: Session = Depends(get_db)) -> Sequence[Doctor]:
    service = AdminService(db)
    return service.list_doctors()


@router.get(
    "/doctors/lookup",
    response_model=list[DoctorLookup],
)
def doctor_lookup(search: str, db: Session = Depends(get_db)):
    service = AdminService(db)
    return service.doctor_lookup(search)


@router.get(
    "/doctors/{doctor_id}",
    response_model=DoctorDetails,
)
def get_doctor(doctor_id: uuid.UUID, db: Session = Depends(get_db)):
    service = AdminService(db)

    try:
        return service.get_doctor(doctor_id)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

@router.patch(
    "/doctors/{doctor_id}",
    response_model=DoctorRead,
)
def update_doctor(doctor_id: uuid.UUID, payload: DoctorUpdate, db: Session = Depends(get_db)):
    service= AdminService(db)

    try:
        return service.update_doctor(doctor_id,payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc)
        )


# Patient APIs


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


@router.get(
    "/patients",
    response_model=list[PatientRead],
)
def list_patients(
    db: Session = Depends(get_db),
) -> Sequence[Patient]:
    service = AdminService(db)
    return service.list_patients()


@router.get("/patients/lookup", response_model=list[PatientLookup])
def patient_lookup(search: str, db: Session = Depends(get_db)):
    service = AdminService(db)
    return service.patient_lookup(search)




@router.get(
    "/patients/{patient_id}",
    response_model=PatientDetails,
)
def get_patient(
    patient_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    service = AdminService(db)

    try:
        return service.get_patient(patient_id)

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

@router.patch(
    "/patients/{patient_id}",
    response_model=PatientRead,
)
def update_patient(patient_id: uuid.UUID, payload: PatientUpdate, db: Session = Depends(get_db)):
    service = AdminService(db)

    try:
        return service.update_patient(patient_id,payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


# Appointment APIs


@router.post(
    "/appointments",
    response_model = AppointmentRead,
    status_code = status.HTTP_201_CREATED
)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db))-> Appointment:
    service = AdminService(db)

    try:
        return service.create_appointment(payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        )
    

@router.get(
    "/appointments",
    response_model = list[AppointmentListItem]
)
def list_appointments(db: Session = Depends(get_db)) -> Sequence[Appointment]:
    service = AdminService(db)
    return service.list_appointments()



@router.get(
    "/appointments/{appointment_id}",
    response_model=AppointmentRead
)
def get_appointment(appointment_id: uuid.UUID, db: Session = Depends(get_db))->Appointment:
    service = AdminService(db)
    try:
        return service.get_appointment(appointment_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail= str(exc)
        )

@router.patch(
    "/appointments/{appointment_id}",
    response_model= AppointmentRead
)
def update_appointment(appointment_id: uuid.UUID, payload: AppointmentUpdate,db: Session= Depends(get_db))-> Appointment:
    service = AdminService(db)
    try:
        return service.update_appointment(appointment_id, payload)
    except ValueError as exc:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail= str(exc)
        )


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    service = AdminService(db)
    return service.get_stats()

