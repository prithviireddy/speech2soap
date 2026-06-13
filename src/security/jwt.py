from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from jwt.exceptions import InvalidTokenError

from src.core.config import settings


ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


def create_access_token(
    subject: str,
    role: str,
) -> str:

    expires_at = datetime.now(UTC) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": subject,
        "role": role,
        "type": ACCESS_TOKEN_TYPE,
        "iat": datetime.now(UTC),
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def create_refresh_token(
    subject: str,
) -> str:

    expires_at = get_refresh_token_expiry()

    payload = {
        "sub": subject,
        "type": REFRESH_TOKEN_TYPE,
        "iat": datetime.now(UTC),
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )

def decode_token(
    token: str,
) -> dict[str, Any]:

    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )

    except InvalidTokenError as exc:
        raise ValueError("Invalid token") from exc


def verify_access_token(
    token: str,
) -> dict[str, Any]:

    payload = decode_token(token)

    if payload.get("type") != ACCESS_TOKEN_TYPE:
        raise ValueError("Invalid access token")

    return payload


def verify_refresh_token(
    token: str,
) -> dict[str, Any]:

    payload = decode_token(token)

    if payload.get("type") != REFRESH_TOKEN_TYPE:
        raise ValueError("Invalid refresh token")

    return payload

def get_refresh_token_expiry() -> datetime:
    return datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
