class InvalidTokenError(Exception):
    """Raised when a JWT is invalid."""

    pass


class InvalidAccessTokenError(Exception):
    """Raised when an access token is invalid."""

    pass


class InvalidRefreshTokenError(Exception):
    """Raised when a refresh token is invalid."""

    pass
