from uuid import UUID

from pydantic import EmailStr
from pydantic import Field

from .common import TimestampSchema,BaseSchema
from .user import UserRead


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
