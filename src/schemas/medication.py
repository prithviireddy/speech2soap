from uuid import UUID

from pydantic import BaseModel
from pydantic import Field

from .common import TimestampSchema


class MedicationCreate(BaseModel):
    patient_id: UUID

    report_id: UUID

    name: str = Field(
        min_length=1,
        max_length=255,
    )

    dosage: str = Field(
        min_length=1,
        max_length=100,
    )

    frequency: str = Field(
        min_length=1,
        max_length=100,
    )

    instructions: str | None = None


class MedicationUpdate(BaseModel):
    name: str | None = None

    dosage: str | None = None

    frequency: str | None = None

    instructions: str | None = None


class MedicationRead(TimestampSchema):
    patient_id: UUID

    report_id: UUID

    name: str

    dosage: str

    frequency: str

    instructions: str | None
