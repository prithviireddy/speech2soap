from datetime import date, datetime
from uuid import UUID

from pydantic import Field

from .common import BaseSchema, TimestampSchema
from src.models.appointment import AppointmentStatus

class AppointmentCreate(BaseSchema):
    doctor_id: UUID
    patient_id: UUID
    scheduled_at: datetime
    duration_minutes: int = Field(gt=0, le=120)
    reason: str = Field(min_length=1, max_length=500)
    notes: str | None = Field(default=None, max_length=5000)


class AppointmentUpdate(BaseSchema):
    scheduled_at: datetime | None = None
    duration_minutes: int | None = Field(
        default=None,
        gt=0,
        le=120,
    )
    reason: str | None = Field(
        default=None,
        max_length=500,
    )
    notes: str | None = Field(
        default=None,
        max_length=5000,
    )
    status: AppointmentStatus | None = None


class AppointmentRead(TimestampSchema):
    doctor_id: UUID
    doctor_name: str
    patient_id: UUID
    patient_name: str
    scheduled_at: datetime
    duration_minutes: int
    reason: str = Field(min_length=1, max_length=500)
    notes: str | None = None
    status: AppointmentStatus


class AppointmentListItem(BaseSchema):
    id: UUID
    scheduled_at: datetime
    duration_minutes: int = Field(gt=0, le=120)
    patient_name: str
    doctor_name: str
    reason: str
    status: AppointmentStatus


class AppointmentFilters(BaseSchema):
    search: str | None = Field(default=None, max_length=100)
    doctor_id: UUID | None = None
    patient_id: UUID | None = None
    status: AppointmentStatus | None = None
    # date: date | None = None

class PatientLookup(BaseSchema):
    id: UUID
    patient_number: str
    full_name: str


class DoctorLookup(BaseSchema):
    id: UUID
    full_name: str
    specialization: str
