from __future__ import annotations

import hashlib

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.refresh_token import RefreshToken
from src.models.user import User
from src.schemas.auth import TokenResponse
from src.security.jwt import (
    create_access_token,
    create_refresh_token,
    get_refresh_token_expiry,
    verify_refresh_token,
)
from src.security.password import verify_password


class AuthService:
    @staticmethod
    def login(
        db: Session,
        email: str,
        password: str,
    ) -> TokenResponse:

        user = db.scalar(select(User).where(User.email == email))

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        is_valid, new_hash = verify_password(
            password,
            user.password_hash,
        )

        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )

        if new_hash:
            user.password_hash = new_hash

        access_token = create_access_token(
            subject=str(user.id),
            role=user.role.value,
        )

        refresh_token = create_refresh_token(
            subject=str(user.id),
        )

        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()

        db_token = RefreshToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=get_refresh_token_expiry(),
        )

        db.add(db_token)
        db.commit()

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )

    @staticmethod
    def logout(
        db: Session,
        user: User,
        refresh_token: str,
    ) -> None:

        token_hash = hashlib.sha256(
            refresh_token.encode()
        ).hexdigest()

        token = db.scalar(
            select(RefreshToken).where(
                RefreshToken.token_hash == token_hash,
                RefreshToken.user_id == user.id,
            )
        )

        if token:
            token.revoked = True
            db.commit()

    @staticmethod
    def refresh_access_token(
        db: Session,
        refresh_token: str,
    ) -> str:

        verify_refresh_token(refresh_token)

        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()

        db_token = db.scalar(
            select(RefreshToken).where(
                RefreshToken.token_hash == token_hash,
                RefreshToken.revoked.is_(False),
            )
        )

        if not db_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )

        user = db.get(
            User,
            db_token.user_id,
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )

        return create_access_token(
            subject=str(user.id),
            role=user.role.value,
        )
