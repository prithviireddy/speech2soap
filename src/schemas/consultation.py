from uuid import UUID
from enum import Enum

from pydantic import BaseModel
from pydantic import Field

from .common import TimestampSchema


class ConsultationStatus(str, Enum):
    UPLOADED = "UPLOADED"
    TRANSCRIBING = "TRANSCRIBING"
    PROCESSING = "PROCESSING"
    REVIEW_PENDING = "REVIEW_PENDING"
    APPROVED = "APPROVED"
    FAILED = "FAILED"


class ConsultationCreate(BaseModel):
    patient_id: UUID

    audio_file_path: str = Field(
        min_length=1,
    )


class ConsultationUpdate(BaseModel):
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
