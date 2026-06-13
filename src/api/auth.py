from fastapi import (
    APIRouter,
    Depends,
    Response,
    status,
)
from sqlalchemy.orm import Session

from src.db.session import get_db
from src.dependencies.auth import (
    get_current_user,
)
from src.models.user import User
from src.schemas.auth import (
    AccessTokenResponse,
    CurrentUserResponse,
    LoginRequest,
    RefreshTokenRequest,
    TokenResponse,
)
from src.services.auth_service import (
    AuthService,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):

    return AuthService.login(
        db=db,
        email=payload.email,
        password=payload.password,
    )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
def logout(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    AuthService.logout(
        db=db,
        user=current_user,
        refresh_token=payload.refresh_token,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/refresh",
    response_model=AccessTokenResponse,
)
def refresh(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db),
):

    access_token = AuthService.refresh_access_token(
        db=db,
        refresh_token=payload.refresh_token,
    )

    return AccessTokenResponse(
        access_token=access_token,
    )


@router.get(
    "/me",
    response_model=CurrentUserResponse,
)
def current_user(
    user: User = Depends(get_current_user),
):
    return user
