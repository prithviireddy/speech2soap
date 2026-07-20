import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.appointment import Appointment, AppointmentStatus
from src.models.consultation import Consultation, ConsultationStatus
from src.schemas.doctor import (
    DoctorAppointmentDetails,
    DoctorAppointmentListItem,
    DoctorConsultationListItem,
    DoctorConsultationRead,
    DoctorConsultationStatusRead,
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "data/uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


class DoctorService:
    def __init__(self, db: Session):
        self.db = db

    def list_appointments(
        self,
        doctor_id: uuid.UUID,
    ) -> list[DoctorAppointmentListItem]:

        appointments = (
            self.db.execute(
                select(Appointment)
                .where(Appointment.doctor_id == doctor_id)
                .order_by(Appointment.scheduled_at.desc())
            )
            .scalars()
            .all()
        )

        return [
            DoctorAppointmentListItem.model_validate(appointment)
            for appointment in appointments
        ]

    def get_appointment(
        self,
        doctor_id: uuid.UUID,
        appointment_id: uuid.UUID,
    ) -> DoctorAppointmentDetails:

        appointment = self.db.get(
            Appointment,
            appointment_id,
        )

        if appointment is None:
            raise ValueError("Appointment not found.")

        if appointment.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to access this appointment.")

        return DoctorAppointmentDetails.model_validate(appointment)

    def upload_consultation(
        self,
        doctor_id: uuid.UUID,
        appointment_id: uuid.UUID,
        file: UploadFile,
        chief_complaint: str | None,
        doctor_notes: str | None,
    ) -> tuple[uuid.UUID, Path]:

        appointment = self.db.get(
            Appointment,
            appointment_id,
        )

        if appointment is None:
            raise ValueError("Appointment not found.")

        if appointment.doctor_id != doctor_id:
            raise PermissionError("This appointment is not assigned to you.")

        if appointment.consultation is not None:
            raise ValueError("A consultation already exists for this appointment.")

        if file.filename is None:
            raise ValueError("Filename is missing.")

        extension = Path(file.filename).suffix.lower()

        audio_filename = f"{uuid.uuid4()}{extension}"

        audio_path = UPLOAD_DIR / audio_filename

        with open(audio_path, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer,
            )

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

        self.db.add(consultation)

        self.db.commit()

        self.db.refresh(consultation)

        return (
            consultation.id,
            audio_path,
        )

    def list_consultations(
        self,
        doctor_id: uuid.UUID,
    ) -> list[DoctorConsultationListItem]:

        consultations = (
            self.db.execute(
                select(Consultation)
                .where(Consultation.doctor_id == doctor_id)
                .order_by(Consultation.created_at.desc())
            )
            .scalars()
            .all()
        )

        return [
            DoctorConsultationListItem(
                id=consultation.id,
                patient_name=consultation.patient.full_name,
                status=consultation.status,
                progress=consultation.progress,
                current_stage=consultation.current_stage,
                created_at=consultation.created_at,
            )
            for consultation in consultations
        ]

    def get_consultation(
        self,
        doctor_id: uuid.UUID,
        consultation_id: uuid.UUID,
    ) -> DoctorConsultationRead:

        consultation = self.db.get(
            Consultation,
            consultation_id,
        )

        if consultation is None:
            raise ValueError("Consultation not found.")

        if consultation.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to access this consultation.")

        return DoctorConsultationRead(
            id=consultation.id,
            appointment_id=consultation.appointment_id,
            patient_name=consultation.patient.full_name,
            chief_complaint=consultation.chief_complaint,
            doctor_notes=consultation.doctor_notes,
            status=consultation.status,
            progress=consultation.progress,
            current_stage=consultation.current_stage,
            audio_file_path=consultation.audio_file_path,
            created_at=consultation.created_at,
            updated_at=consultation.updated_at,
        )

    def get_consultation_status(
        self,
        doctor_id: uuid.UUID,
        consultation_id: uuid.UUID,
    ) -> DoctorConsultationStatusRead:

        consultation = self.db.get(
            Consultation,
            consultation_id,
        )

        if consultation is None:
            raise ValueError("Consultation not found.")

        if consultation.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to access this consultation.")

        report_id = None

        if consultation.report:
            report_id = consultation.report.id

        return DoctorConsultationStatusRead(
            id=consultation.id,
            status=consultation.status,
            progress=consultation.progress,
            current_stage=consultation.current_stage,
            report_id=report_id,
        )
