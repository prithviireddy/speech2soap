import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from jwt.exceptions import InvalidTokenError as JWTInvalidTokenError

from src.core.config import settings
from src.security.exceptions import (
    InvalidAccessTokenError,
    InvalidRefreshTokenError,
    InvalidTokenError,
)

ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


def create_access_token(subject: str, role: str) -> str:

    now = datetime.now(UTC)
    expires_at = now + timedelta(minutes=settings.access_token_expire_minutes)

    payload = {
        "sub": subject,
        "role": role,
        "type": ACCESS_TOKEN_TYPE,
        "iat": now,
        "exp": expires_at,
        "jti": str(uuid.uuid4()),
        "iss": "clinicreport-api",
        "aud": "clinicreport-client",
    }

    return jwt.encode(
        payload,
        settings.secret_key.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )


def create_refresh_token(subject: str) -> str:

    expires_at = get_refresh_token_expiry()

    payload = {
        "sub": subject,
        "type": REFRESH_TOKEN_TYPE,
        "iat": datetime.now(UTC),
        "exp": expires_at,
        "jti": str(uuid.uuid4()),
        "iss": "clinicreport-api",
        "aud": "clinicreport-client",
    }

    return jwt.encode(
        payload,
        settings.secret_key.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )


def decode_token(token: str) -> dict[str, Any]:

    try:
        return jwt.decode(
            token,
            settings.secret_key.get_secret_value(),
            algorithms=[settings.jwt_algorithm],
            issuer=settings.jwt_issuer,
            audience=settings.jwt_audience,
        )

    except JWTInvalidTokenError as exc:
        raise InvalidTokenError() from exc


def verify_access_token(token: str) -> dict[str, Any]:

    payload = decode_token(token)

    if payload.get("type") != ACCESS_TOKEN_TYPE:
        raise InvalidAccessTokenError()

    return payload


def verify_refresh_token(token: str) -> dict[str, Any]:

    payload = decode_token(token)

    if payload.get("type") != REFRESH_TOKEN_TYPE:
        raise InvalidRefreshTokenError()

    return payload


def get_refresh_token_expiry() -> datetime:
    return datetime.now(UTC) + timedelta(days=settings.refresh_token_expire_days)
