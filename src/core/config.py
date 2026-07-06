from pydantic import SecretStr
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str

    secret_key: SecretStr
    jwt_algorithm: str
    jwt_issuer: str
    jwt_audience: str

    cookie_secure: bool = False # True in production
    cookie_samesite: Literal["lax", "strict", "none"] | None = ("lax")
    refresh_cookie_name: str = "refresh_token"

    access_token_expire_minutes: int
    refresh_token_expire_days: int

    environment: str



settings = Settings()  # type: ignore[call-arg] #loaded from dotenv file
