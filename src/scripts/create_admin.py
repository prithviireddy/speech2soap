from sqlalchemy import select

from src.db.session import SessionLocal
from src.models.user import User, UserRole
from src.security.password import hash_password


ADMIN_EMAIL = "admin@clinicreport.com"
ADMIN_PASSWORD = "ChangeMe123!"


def main():
    db = SessionLocal()

    try:
        existing = db.scalar(select(User).where(User.email == ADMIN_EMAIL))

        if existing:
            print("Admin already exists.")
            return

        admin = User(
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            role=UserRole.ADMIN,
            is_active=True,
        )

        db.add(admin)
        db.commit()

        print("Admin created successfully.")
        print(f"Email: {ADMIN_EMAIL}")
        print(f"Password: {ADMIN_PASSWORD}")

    finally:
        db.close()


if __name__ == "__main__":
    main()
