from uuid import UUID
from datetime import date

from pydantic import EmailStr
from pydantic import Field

from .common import TimestampSchema,BaseSchema
from .user import UserRead


class PatientRegistration(BaseSchema):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    full_name: str
    phone: str
    date_of_birth: date
    gender: str



class PatientUpdate(BaseSchema):
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

class PatientDetails(BaseSchema):
    id: UUID
    patient_number: str
    full_name: str
    email: EmailStr | None = None
    phone: str
    date_of_birth: date
    gender: str
