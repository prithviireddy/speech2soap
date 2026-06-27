from uuid import UUID
from enum import Enum

from pydantic import Field

from .common import TimestampSchema,BaseSchema


class ConsultationStatus(str, Enum):
    UPLOADED = "UPLOADED"
    TRANSCRIBING = "TRANSCRIBING"
    PROCESSING = "PROCESSING"
    REVIEW_PENDING = "REVIEW_PENDING"
    APPROVED = "APPROVED"
    FAILED = "FAILED"


class ConsultationCreate(BaseSchema):
    appointment_id: UUID
    chief_complaint: str | None
    doctor_notes: str | None


class ConsultationUpdate(BaseSchema):
    status: ConsultationStatus | None = None

    progress: int | None = Field(
        default=None,
        ge=0,
        le=100,
    )


class ConsultationRead(TimestampSchema):
    doctor_id: UUID

    patient_id: UUID

    audio_file_path: str

    duration_seconds: int | None

    progress: int

    status: ConsultationStatus


class ConsultationListItem(TimestampSchema):
    patient_id: UUID

    progress: int

    status: ConsultationStatus
