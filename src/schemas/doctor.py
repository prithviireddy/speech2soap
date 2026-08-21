from datetime import datetime
from uuid import UUID

from pydantic import EmailStr, Field

from .appointment import AppointmentStatus
from .common import BaseSchema, TimestampSchema
from .consultation import ConsultationStatus
from .user import UserRead


class DoctorTranscriptSegment(BaseSchema):
    speaker: str
    text: str
    start: float | None = None
    end: float | None = None


class DoctorConsultationTranscriptRead(BaseSchema):
    consultation_id: UUID
    segments: list[DoctorTranscriptSegment]


class DoctorRegistration(BaseSchema):
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
    )
    full_name: str = Field(
        min_length=1,
        max_length=255,
    )
    specialization: str = Field(
        min_length=1,
        max_length=255,
    )
    license_number: str = Field(
        min_length=1,
        max_length=100,
    )
    phone: str = Field(
        min_length=10,
        max_length=20,
    )


class DoctorUpdate(BaseSchema):
    full_name: str | None = None
    specialization: str | None = None
    phone: str | None = None
    license_number: str | None = None


class DoctorRead(TimestampSchema):
    user_id: UUID
    full_name: str
    specialization: str
    license_number: str
    phone: str
    user: UserRead


class DoctorDetails(BaseSchema):
    id: UUID
    full_name: str
    email: EmailStr
    specialization: str
    license_number: str
    phone: str


class DoctorAppointmentListItem(BaseSchema):
    id: UUID
    patient_id: UUID
    patient_name: str
    scheduled_at: datetime
    status: AppointmentStatus
    reason: str | None = None


class DoctorAppointmentDetails(TimestampSchema):
    id: UUID
    patient_id: UUID
    patient_name: str
    scheduled_at: datetime
    duration_minutes: int = Field(
        gt=0,
        le=120,
    )
    status: AppointmentStatus
    reason: str | None = None
    notes: str | None = None


class DoctorConsultationListItem(BaseSchema):
    id: UUID
    patient_name: str
    status: ConsultationStatus
    progress: int
    current_stage: str
    created_at: datetime


class DoctorConsultationRead(TimestampSchema):
    id: UUID
    appointment_id: UUID
    patient_name: str
    chief_complaint: str | None = None
    doctor_notes: str | None = None
    status: ConsultationStatus
    progress: int
    current_stage: str
    audio_file_path: str


class DoctorConsultationStatusRead(BaseSchema):
    id: UUID
    status: ConsultationStatus
    progress: int
    current_stage: str
    report_id: UUID | None = None

class DoctorReportListItem(TimestampSchema):

    id: UUID
    patient_name: str
    is_approved: bool


class DoctorReportRead(TimestampSchema):

    id: UUID
    consultation_id: UUID
    patient_id: UUID
    is_approved: bool
    report_json: dict


class DoctorReportUpdate(BaseSchema):

    report_json: dict

class DoctorPatientHistoryItem(BaseSchema):
    consultation_id: UUID
    appointment_id: UUID
    report_id: UUID | None = None

    consultation_date: datetime

    chief_complaint: str | None = None
    doctor_notes: str | None = None

    status: ConsultationStatus

    report_approved: bool | None = None


class DoctorPatientHistoryRead(BaseSchema):
    patient_id: UUID
    patient_name: str
    patient_number: str

    consultations: list[DoctorPatientHistoryItem]
