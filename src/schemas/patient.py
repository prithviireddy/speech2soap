from uuid import UUID
from datetime import date

from pydantic import BaseModel
from pydantic import EmailStr
from pydantic import Field

from .common import TimestampSchema
from .user import UserRead
from .user import UserRole



class PatientRegistration(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    patient_number: str

    full_name: str

    phone: str

    date_of_birth: date

    gender: str

    role: UserRole = UserRole.PATIENT


class PatientUpdate(BaseModel):
    full_name: str | None = None

    phone: str | None = None

    date_of_birth: date | None = None

    gender: str | None = None


class PatientRead(TimestampSchema):
    user_id: UUID

    patient_number: str

    full_name: str

    phone: str

    date_of_birth: date

    gender: str

    user: UserRead
