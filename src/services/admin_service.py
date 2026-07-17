import uuid
from datetime import datetime, timedelta
from typing import Sequence
from zoneinfo import ZoneInfo

from sqlalchemy import or_, select
from sqlalchemy.orm import Session




from src.models.appointment import Appointment, AppointmentStatus
from src.models.doctor import Doctor
from src.models.patient import Patient
from src.models.user import User, UserRole
from src.schemas.appointment import (
    AppointmentCreate,
    AppointmentRead,
    AppointmentUpdate,
)
from src.schemas.doctor import DoctorDetails, DoctorRegistration, DoctorUpdate
from src.schemas.patient import PatientDetails, PatientRegistration, PatientUpdate
from src.security.password import hash_password
from src.utils.patient_number import generate_patient_number

INDIA_TZ = ZoneInfo("Asia/Kolkata")

class AdminService:
    def __init__(self, db: Session):
        self.db = db

    def create_doctor(self, payload: DoctorRegistration) -> Doctor:

        existing_user = self.db.scalar(select(User).where(User.email == payload.email))

        if existing_user:
            raise ValueError("Email already registered")

        user = User(
            email=payload.email,
            password_hash=hash_password(payload.password),
            role=UserRole.DOCTOR,
            is_active=True,
        )

        self.db.add(user)
        self.db.flush()

        doctor = Doctor(
            user_id=user.id,
            full_name=payload.full_name,
            specialization=payload.specialization,
            license_number=payload.license_number,
            phone=payload.phone,
        )

        self.db.add(doctor)

        self.db.commit()
        self.db.refresh(doctor)

        return doctor

    def list_doctors(self) -> Sequence[Doctor]:
        return self.db.scalars(select(Doctor).order_by(Doctor.full_name)).all()

    def get_doctor(self, doctor_id: uuid.UUID) -> DoctorDetails:
        doctor = self.db.get(Doctor, doctor_id)

        if doctor is None:
            raise ValueError("Doctor not found")

        return DoctorDetails(
            id=doctor.id,
            full_name=doctor.full_name,
            email=doctor.user.email,
            specialization=doctor.specialization,
            license_number=doctor.license_number,
            phone=doctor.phone,
        )

    def update_doctor(self, doctor_id: uuid.UUID, payload: DoctorUpdate) -> Doctor:
        doctor = self.db.get(Doctor, doctor_id)

        if doctor is None:
            raise ValueError("Doctor Not Found")

        updates = payload.model_dump(exclude_unset=True)

        for field, value in updates.items():
            setattr(doctor, field, value)

        self.db.commit()
        self.db.refresh(doctor)

        return doctor

    def create_patient(self, payload: PatientRegistration) -> Patient:

        existing_user = self.db.scalar(select(User).where(User.email == payload.email))

        if existing_user:
            raise ValueError("Email already registered")

        user = User(
            email=payload.email,
            password_hash=hash_password(payload.password),
            role=UserRole.PATIENT,
            is_active=True,
        )

        self.db.add(user)
        self.db.flush()

        patient = Patient(
            user_id=user.id,
            patient_number=generate_patient_number(self.db),
            full_name=payload.full_name,
            phone=payload.phone,
            date_of_birth=payload.date_of_birth,
            gender=payload.gender,
        )

        self.db.add(patient)

        self.db.commit()

        self.db.refresh(patient)

        return patient

    def list_patients(self) -> Sequence[Patient]:
        return self.db.scalars(select(Patient).order_by(Patient.full_name)).all()

    def get_patient(self, patient_id: uuid.UUID) -> PatientDetails:

        patient = self.db.get(Patient, patient_id)

        if patient is None:
            raise ValueError("Patient not found")

        return PatientDetails(
            id=patient.id,
            patient_number=patient.patient_number,
            full_name=patient.full_name,
            email=patient.user.email if patient.user else None,
            phone=patient.phone,
            date_of_birth=patient.date_of_birth,
            gender=patient.gender,
        )

    def update_patient(self, patient_id: uuid.UUID, payload: PatientUpdate) -> Patient:
        patient = self.db.get(Patient, patient_id)

        if patient is None:
            raise ValueError("Patient Not Found")

        updates = payload.model_dump(exclude_unset=True)

        for field, value in updates.items():
            setattr(patient, field, value)

        self.db.commit()
        self.db.refresh(patient)

        return patient

    def create_appointment(self, payload: AppointmentCreate) -> Appointment:
        if payload.scheduled_at.tzinfo is None:
            payload.scheduled_at = payload.scheduled_at.replace(
                tzinfo=INDIA_TZ
            )
        patient = self.db.get(Patient, payload.patient_id)
        doctor = self.db.get(Doctor, payload.doctor_id)

        if patient is None:
            raise ValueError("patient not found")

        if doctor is None:
            raise ValueError("Doctor not found")

        if self._has_appointment_conflict(
            doctor_id=payload.doctor_id,
            scheduled_at=payload.scheduled_at,
            duration_minutes=payload.duration_minutes,
        ):
            raise ValueError("Doctor already has an appointment during this time slot.")

        appointment = Appointment(
            doctor_id=payload.doctor_id,
            patient_id=payload.patient_id,
            scheduled_at=payload.scheduled_at,
            duration_minutes=payload.duration_minutes,
            status=AppointmentStatus.SCHEDULED,
            reason=payload.reason,
            notes=payload.notes,
        )

        self.db.add(appointment)

        self.db.commit()
        self.db.refresh(appointment)
        return appointment

    def list_appointments(self) -> Sequence[Appointment]:
        return self.db.scalars(
            select(Appointment).order_by(Appointment.scheduled_at.desc())
        ).all()

    def get_appointment(self, appointment_id: uuid.UUID) -> Appointment:
        appointment = self.db.get(Appointment, appointment_id)

        if appointment is None:
            raise ValueError("Appointment not found")

        return appointment

    def update_appointment(
        self, appointment_id: uuid.UUID, payload: AppointmentUpdate
    ) -> Appointment:
        if (
            payload.scheduled_at is not None
            and payload.scheduled_at.tzinfo is None
        ):
            payload.scheduled_at = payload.scheduled_at.replace(
                tzinfo=INDIA_TZ
            )
        appointment = self.db.get(Appointment, appointment_id)
        if appointment is None:
            raise ValueError("Appointment not found")

        new_scheduled_at = (
            payload.scheduled_at
            if payload.scheduled_at is not None
            else appointment.scheduled_at
        )
        new_duration_minutes = (
            payload.duration_minutes
            if payload.duration_minutes is not None
            else appointment.duration_minutes
        )

        if payload.scheduled_at is not None or payload.duration_minutes is not None:
            if self._has_appointment_conflict(
                doctor_id=appointment.doctor_id,
                scheduled_at=new_scheduled_at,
                duration_minutes=new_duration_minutes,
                exclude_appointment_id=appointment_id,
            ):
                raise ValueError("There is an appointment conflict")

        updates = payload.model_dump(exclude_unset=True)
        for field, value in updates.items():
            setattr(appointment, field, value)

        self.db.commit()
        self.db.refresh(appointment)

        return appointment

    def patient_lookup(self, search: str) -> Sequence[Patient]:
        search_term = f"%{search}%"
        return self.db.scalars(
            select(Patient)
            .where(
                or_(
                    Patient.patient_number.ilike(search_term),
                    Patient.full_name.ilike(search_term),
                    Patient.phone.ilike(search_term),
                )
            )
            .order_by(Patient.full_name)
            .limit(10)
        ).all()

    def doctor_lookup(self, search: str) -> Sequence[Doctor]:
        search_term = f"%{search}%"
        return self.db.scalars(
            select(Doctor)
            .where(
                or_(
                    Doctor.full_name.ilike(search_term),
                    Doctor.specialization.ilike(search_term),
                    Doctor.license_number.ilike(search_term),
                )
            )
            .order_by(Doctor.full_name)
            .limit(10)
        ).all()

    def _has_appointment_conflict(
        self,
        doctor_id: uuid.UUID,
        scheduled_at: datetime,
        duration_minutes: int,
        exclude_appointment_id: uuid.UUID | None = None,
    ) -> bool:
        new_start = scheduled_at
        new_end = scheduled_at + timedelta(minutes=duration_minutes)

        existing_appointments = self.db.scalars(
            select(Appointment).where(
                Appointment.doctor_id == doctor_id,
                Appointment.status != AppointmentStatus.CANCELLED,
            )
        ).all()

        for appointment in existing_appointments:
            if (
                exclude_appointment_id is not None
                and appointment.id == exclude_appointment_id
            ):
                continue

            existing_start = appointment.scheduled_at
            existing_end = appointment.scheduled_at + timedelta(
                minutes=appointment.duration_minutes
            )

            if new_start < existing_end and new_end > existing_start:
                return True

        return False
