from uuid import UUID
from datetime import datetime
from enum import Enum

from pydantic import Field

from .common import TimestampSchema, BaseSchema


class FollowupStatus(str, Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    MISSED = "MISSED"
    CANCELLED = "CANCELLED"


class FollowupCreate(BaseSchema):
    patient_id: UUID
    doctor_id: UUID
    consultation_id: UUID | None = None
    title: str = Field(
        min_length=1,
        max_length=255,
    )
    notes: str | None = None
    scheduled_at: datetime


class FollowupUpdate(BaseSchema):
    title: str | None = None
    notes: str | None = None
    scheduled_at: datetime | None = None
    status: FollowupStatus | None = None


class FollowupRead(TimestampSchema):
    patient_id: UUID
    doctor_id: UUID
    consultation_id: UUID | None
    title: str
    notes: str | None
    scheduled_at: datetime
    status: FollowupStatus
