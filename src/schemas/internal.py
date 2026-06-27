from .common import BaseSchema


class LoginResult(BaseSchema):
    access_token: str
    refresh_token: str
