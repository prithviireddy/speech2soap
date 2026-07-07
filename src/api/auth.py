from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from src.core.config import settings
from src.db.session import get_db
from src.dependencies.auth import get_current_user
from src.models.user import User
from src.schemas.auth import (
    AccessTokenResponse,
    CurrentUserResponse,
    LoginRequest,
    TokenResponse,
)
from src.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse, 
)
def login(
    response: Response,
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    """receive HTTP requests
    validate request schemas
    inject dependencies
    return responses"""
    result = AuthService.login(
        db=db,
        email=payload.email,
        password=payload.password,
    )

    response.set_cookie(
        key=settings.refresh_cookie_name,
        value=result.refresh_token,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        expires=settings.refresh_token_expire_days * 24 * 60 * 60,
        path="/",
    )

    return TokenResponse(
        access_token=result.access_token,
    )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
def logout(
    response: Response,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    refresh_token: str | None = Cookie(
        default=None,
        alias=settings.refresh_cookie_name,
    ),
):

    if refresh_token:
        AuthService.logout(
            db=db,
            user=current_user,
            refresh_token=refresh_token,
        )

    response.delete_cookie(
        key=settings.refresh_cookie_name,
        path="/",
        secure=settings.cookie_secure,
        httponly=True,
        samesite=settings.cookie_samesite,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post( #refresh access tokem
    "/refresh",
    response_model=AccessTokenResponse,
)
def refresh(
    db: Session = Depends(get_db),
    refresh_token: str | None = Cookie(
        default=None, alias=settings.refresh_cookie_name
    ),
):

    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="missing refresh token"
        )

    access_token = AuthService.refresh_access_token(
        db=db,
        refresh_token=refresh_token,
    )

    return AccessTokenResponse(
        access_token=access_token,
    )


@router.get(
    "/me",
    response_model=CurrentUserResponse,
)
def current_user(
    current_user: User = Depends(get_current_user),
):
    full_name = None

    if current_user.role == 'ADMIN':
        full_name = "Administrator"
    elif current_user.doctor_profile:
        full_name = current_user.doctor_profile.full_name
    elif current_user.patient_profile:
        full_name = current_user.patient_profile.full_name

    return CurrentUserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=full_name,
        role=current_user.role,
        is_active=current_user.is_active,
    )
