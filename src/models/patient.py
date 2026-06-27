from datetime import date
import uuid
from sqlalchemy import Date, ForeignKey, String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from src.db.base import Base
from src.models.mixins import UUIDMixin, TimestampMixin

class Gender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"

class Patient(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "patients"

    user_id: Mapped[uuid.UUID|None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        unique=True,
        nullable=True,
    )

    patient_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        index=True,
    )

    date_of_birth: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    gender: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="patient_profile",
    )

    consultations = relationship(
        "Consultation",
        back_populates="patient",
    )

    medications = relationship(
        "Medication",
        back_populates="patient",
    )

    followups = relationship(
        "Followup",
        back_populates="patient",
    )

    appointments = relationship(
        "Appointment",
        back_populates="patient",
    )
