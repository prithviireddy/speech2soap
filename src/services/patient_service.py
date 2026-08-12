import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.patient import Patient
from src.models.report import Report
from src.models.consultation import Consultation
from src.models.medication import Medication

from src.schemas.patient import (
    PatientDetails,
    PatientUpdate,
)

from src.schemas.report import (
    ReportRead,
    ReportSummary,
)

from src.schemas.medication import (
    MedicationRead,
)


class PatientService:

    def __init__(self, db: Session):
        self.db = db

    def get_profile(
        self,
        patient_id: uuid.UUID,
    ) -> PatientDetails:

        patient = self.db.get(
            Patient,
            patient_id,
        )

        if patient is None:
            raise ValueError("Patient not found.")

        return PatientDetails(
            id=patient.id,
            patient_number=patient.patient_number,
            full_name=patient.full_name,
            email=patient.email,
            phone=patient.phone,
            date_of_birth=patient.date_of_birth,
            gender=patient.gender,
        )

    def update_profile(
        self,
        patient_id: uuid.UUID,
        payload: PatientUpdate,
    ) -> PatientDetails:

        patient = self.db.get(
            Patient,
            patient_id,
        )

        if patient is None:
            raise ValueError("Patient not found.")

        if payload.full_name is not None:
            patient.full_name = payload.full_name

        if payload.phone is not None:
            patient.phone = payload.phone

        if payload.date_of_birth is not None:
            patient.date_of_birth = payload.date_of_birth

        if payload.gender is not None:
            patient.gender = payload.gender

        self.db.commit()
        self.db.refresh(patient)

        return PatientDetails(
            id=patient.id,
            patient_number=patient.patient_number,
            full_name=patient.full_name,
            email=patient.email,
            phone=patient.phone,
            date_of_birth=patient.date_of_birth,
            gender=patient.gender,
        )

    def list_reports(
        self,
        patient_id: uuid.UUID,
    ) -> list[ReportSummary]:

        reports = (
            self.db.execute(
                select(Report)
                .join(Report.consultation)
                .where(
                    Consultation.patient_id == patient_id,
                    Report.is_approved.is_(True),
                )
                .order_by(
                    Report.created_at.desc(),
                )
            )
            .scalars()
            .all()
        )

        return [
            ReportSummary(
                id=report.id,
                consultation_id=report.consultation_id,
                is_approved=report.is_approved,
                created_at=report.created_at,
                updated_at=report.updated_at, 
            )
            for report in reports
        ]

    def get_report(
        self,
        patient_id: uuid.UUID,
        report_id: uuid.UUID,
    ) -> ReportRead:

        report = self.db.get(
            Report,
            report_id,
        )

        if report is None:
            raise ValueError("Report not found.")

        if report.consultation.patient_id != patient_id:
            raise PermissionError(
                "You are not authorized to access this report."
            )

        if not report.is_approved:
            raise PermissionError(
                "This report has not been approved."
            )

        return ReportRead(
            id=report.id,
            consultation_id=report.consultation_id,
            is_approved=report.is_approved,
            report_json=report.report_json,
            transcript_json=report.transcript_json,
            created_at=report.created_at,
            updated_at=report.updated_at,
        )
