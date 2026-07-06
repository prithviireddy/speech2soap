from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.doctor import Doctor
from src.models.patient import Patient
from src.models.user import User, UserRole
from src.schemas.doctor import DoctorRegistration
from src.schemas.patient import PatientRegistration
from src.security.password import hash_password
from src.utils.patient_number import generate_patient_number


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
    
    def list_doctors(self):
        return self.db.scalars(
            select(Doctor).order_by(Doctor.full_name)
        ).all()
