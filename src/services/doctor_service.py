from src.models.patient import Patient
import json
import shutil
import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.appointment import Appointment, AppointmentStatus
from src.models.consultation import Consultation, ConsultationStatus
from src.models.report import Report
from src.schemas.doctor import (
    DoctorAppointmentDetails,
    DoctorAppointmentListItem,
    DoctorConsultationListItem,
    DoctorConsultationRead,
    DoctorConsultationStatusRead,
    DoctorConsultationTranscriptRead,
    DoctorTranscriptSegment,
    DoctorPatientHistoryRead,
    DoctorPatientHistoryItem,
    DoctorReportListItem,
    DoctorReportRead,
    DoctorReportUpdate,
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
            DoctorAppointmentListItem(
                id=appointment.id,
                patient_id=appointment.patient_id,
                patient_name=appointment.patient.full_name,
                scheduled_at=appointment.scheduled_at,
                status=appointment.status,
                reason=appointment.reason,
            )
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

    def get_patient_history(
        self,
        doctor_id: uuid.UUID,
        patient_id: uuid.UUID,
    ) -> DoctorPatientHistoryRead:

        patient = self.db.get(
            Patient,
            patient_id,
        )

        if patient is None:
            raise ValueError("Patient not found.")

        consultations = (
            self.db.execute(
                select(Consultation)
                .where(
                    Consultation.doctor_id == doctor_id,
                    Consultation.patient_id == patient_id,
                )
                .order_by(
                    Consultation.created_at.desc(),
                )
            )
            .scalars()
            .all()
        )

        history = []

        for consultation in consultations:

            report_id = None
            report_approved = None

            if consultation.report is not None:
                report_id = consultation.report.id
                report_approved = consultation.report.is_approved

            history.append(
               DoctorPatientHistoryItem(
                    consultation_id=consultation.id,
                    appointment_id=consultation.appointment_id,
                    report_id=report_id,
                    consultation_date=consultation.created_at,
                    chief_complaint=consultation.chief_complaint,
                    doctor_notes=consultation.doctor_notes,
                    status=consultation.status,
                    report_approved=report_approved,
                )
            )

        return DoctorPatientHistoryRead(
            patient_id=patient.id,
            patient_name=patient.full_name,
            patient_number=patient.patient_number,
            consultations=history,
        )

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

    def get_consultation_transcript(
        self,
        doctor_id: uuid.UUID,
        consultation_id: uuid.UUID,
    ) -> DoctorConsultationTranscriptRead:

        consultation = self.db.get(
            Consultation,
            consultation_id,
        )

        if consultation is None:
            raise ValueError("Consultation not found.")

        if consultation.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to access this consultation.")

        transcript_file = None
        if consultation.transcript_path:
            p = Path(consultation.transcript_path)
            if p.exists():
                transcript_file = p

        if not transcript_file and consultation.audio_file_path:
            audio_stem = Path(consultation.audio_file_path).stem
            candidate_paths = [
                Path("data/processed/merged_transcripts") / f"{audio_stem}.json",
                Path("src/data/processed/merged_transcripts") / f"{audio_stem}.json",
                Path("data/processed/diarized_transcripts") / f"{audio_stem}.json",
                Path("src/data/processed/diarized_transcripts") / f"{audio_stem}.json",
            ]
            for cand in candidate_paths:
                if cand.exists():
                    transcript_file = cand
                    consultation.transcript_path = str(cand)
                    self.db.commit()
                    break

        if not transcript_file:
            raise ValueError("Transcript is not available yet for this consultation.")

        with open(transcript_file, "r", encoding="utf-8") as f:
            raw_segments = json.load(f)

        segments = [
            DoctorTranscriptSegment(
                speaker=seg.get("speaker", "UNKNOWN"),
                text=seg.get("text", ""),
                start=seg.get("start"),
                end=seg.get("end"),
            )
            for seg in raw_segments
            if seg.get("text", "").strip()
        ]

        return DoctorConsultationTranscriptRead(
            consultation_id=consultation.id,
            segments=segments,
        )

    def list_reports(
        self,
        doctor_id: uuid.UUID,
    ) -> list[DoctorReportListItem]:

        reports = (
            self.db.execute(
                select(Report)
                .join(Report.consultation)
                .where(
                    Consultation.doctor_id == doctor_id,
                )
                .order_by(
                    Report.created_at.desc(),
                )
            )
            .scalars()
            .all()
        )

        return [
            DoctorReportListItem(
                id=report.id,
                patient_name=report.consultation.patient.full_name,
                is_approved=report.is_approved,
                created_at=report.created_at,
                updated_at=report.updated_at,
            )
            for report in reports
        ]

    def get_report(
        self,
        doctor_id: uuid.UUID,
        report_id: uuid.UUID,
    ) -> DoctorReportRead:

        report = self.db.get(
            Report,
            report_id,
        )

        if report is None:
            raise ValueError("Report not found.")

        if report.consultation.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to access this report.")

        return DoctorReportRead(
            id=report.id,
            consultation_id=report.consultation_id,
            patient_id=report.consultation.patient_id,
            patient_name=report.consultation.patient.full_name,
            patient_number=report.consultation.patient.patient_number,
            is_approved=report.is_approved,
            report_json=report.report_json,
            created_at=report.created_at,
            updated_at=report.updated_at,
        )

    def update_report(
        self,
        doctor_id: uuid.UUID,
        report_id: uuid.UUID,
        payload: DoctorReportUpdate,
    ) -> DoctorReportRead:

        report = self.db.get(
            Report,
            report_id,
        )

        if report is None:
            raise ValueError("Report not found.")

        if report.consultation.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to update this report.")

        if report.is_approved:
            raise ValueError("Approved reports cannot be modified.")

        report.report_json = payload.report_json

        self.db.commit()
        self.db.refresh(report)

        return DoctorReportRead(
            id=report.id,
            consultation_id=report.consultation_id,
            patient_id=report.consultation.patient_id,
            is_approved=report.is_approved,
            report_json=report.report_json,
            created_at=report.created_at,
            updated_at=report.updated_at,
        )

    def approve_report(
        self,
        doctor_id: uuid.UUID,
        report_id: uuid.UUID,
    ) -> None:

        report = self.db.get(
            Report,
            report_id,
        )

        if report is None:
            raise ValueError("Report not found.")

        if report.consultation.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to approve this report.")

        if report.is_approved:
            raise ValueError("Report is already approved.")

        report.is_approved = True

        report.consultation.status = ConsultationStatus.APPROVED

        self.db.commit()

    def delete_consultation(
        self,
        doctor_id: uuid.UUID,
        consultation_id: uuid.UUID,
    ) -> None:
        consultation = self.db.get(Consultation, consultation_id)
        if consultation is None:
            raise ValueError("Consultation not found.")

        if consultation.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to delete this consultation.")

        # Remove audio file from disk if present
        if consultation.audio_file_path:
            try:
                audio_p = Path(consultation.audio_file_path)
                if audio_p.exists():
                    audio_p.unlink(missing_ok=True)
            except Exception:
                pass

        # Reset appointment status back to SCHEDULED if it was IN_PROGRESS
        if consultation.appointment and consultation.appointment.status in (
            AppointmentStatus.IN_PROGRESS,
            AppointmentStatus.COMPLETED,
        ):
            consultation.appointment.status = AppointmentStatus.SCHEDULED

        self.db.delete(consultation)
        self.db.commit()

    def delete_appointment(
        self,
        doctor_id: uuid.UUID,
        appointment_id: uuid.UUID,
    ) -> None:
        appointment = self.db.get(Appointment, appointment_id)
        if appointment is None:
            raise ValueError("Appointment not found.")

        if appointment.doctor_id != doctor_id:
            raise PermissionError("You are not authorized to delete this appointment.")

        # If consultation exists, delete it first
        if appointment.consultation:
            if appointment.consultation.audio_file_path:
                try:
                    audio_p = Path(appointment.consultation.audio_file_path)
                    if audio_p.exists():
                        audio_p.unlink(missing_ok=True)
                except Exception:
                    pass
            self.db.delete(appointment.consultation)

        self.db.delete(appointment)
        self.db.commit()

