from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    """
    Hash a plain-text password using the recommended
    Argon2 configuration.
    """
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str,) -> tuple[bool, str | None]:
    """
    Verify a password and return:

    (
        is_valid,
        updated_hash_if_rehash_needed
    )

    If updated_hash is not None, persist it to the database.
    """

    return password_hash.verify_and_update(plain_password,hashed_password)
