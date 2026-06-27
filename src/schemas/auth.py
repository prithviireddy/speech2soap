from datetime import datetime
from uuid import UUID

from pydantic import (
    ConfigDict,
    EmailStr,
    Field,
)

from src.models.user import UserRole

from .common import BaseSchema


class LoginRequest(BaseSchema):
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
    )


class TokenResponse(BaseSchema):
    access_token: str
    token_type: str = "bearer"


class ForgotPasswordRequest(BaseSchema):
    email: EmailStr


class ResetPasswordRequest(BaseSchema):
    token: str

    new_password: str = Field(
        min_length=8,
        max_length=128,
    )


class CurrentUserResponse(BaseSchema):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime


class AccessTokenResponse(BaseSchema):
    access_token: str
    token_type: str = "bearer"
