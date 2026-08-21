import uuid
from enum import Enum

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.models.mixins import TimestampMixin, UUIDMixin


class ConsultationStatus(str, Enum):
    UPLOADED = "UPLOADED"
    TRANSCRIBING = "TRANSCRIBING"
    PROCESSING = "PROCESSING"
    REVIEW_PENDING = "REVIEW_PENDING"
    APPROVED = "APPROVED"
    FAILED = "FAILED"


class Consultation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "consultations"

    appointment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("appointments.id", ondelete="RESTRICT"),
        nullable=False,
        unique=True,
    )

    doctor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("doctors.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    audio_file_path: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    duration_seconds: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    progress: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    current_stage: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    status: Mapped[ConsultationStatus] = mapped_column(
        SQLEnum(ConsultationStatus),
        nullable=False,
        index=True,
    )

    appointment = relationship(
        "Appointment",
        back_populates="consultation",
    )

    doctor = relationship(
        "Doctor",
        back_populates="consultations",
    )

    patient = relationship(
        "Patient",
        back_populates="consultations",
    )

    report = relationship(
        "Report",
        back_populates="consultation",
        uselist=False,
        cascade="all, delete-orphan",
    )

    chief_complaint: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    doctor_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    transcript_path: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    followups = relationship(
        "Followup",
        back_populates="consultation",
    )
