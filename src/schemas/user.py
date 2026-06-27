from enum import Enum

from pydantic import ConfigDict
from pydantic import EmailStr
from pydantic import Field
from pydantic import field_validator

from .common import TimestampSchema, BaseSchema


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    DOCTOR = "DOCTOR"
    PATIENT = "PATIENT"


class UserCreate(BaseSchema):
    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )
  
    role: UserRole

    model_config = ConfigDict(extra="forbid")

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:

        if not any(ch.isdigit() for ch in value):
            raise ValueError("Password must contain at least one digit")

        return value


class UserUpdate(BaseSchema):
    email: EmailStr | None = None

    is_active: bool | None = None


class UserRead(TimestampSchema):
    email: EmailStr

    role: UserRole

    is_active: bool
