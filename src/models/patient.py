from datetime import date

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.models.mixins import UUIDMixin, TimestampMixin


class Patient(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "patients"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    patient_number: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
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
        cascade="all, delete-orphan",
    )

    medications = relationship(
        "Medication",
        back_populates="patient",
        cascade="all, delete-orphan",
    )

    followups = relationship(
        "Followup",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
