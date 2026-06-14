import uuid
from enum import Enum

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Integer, String
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

    status: Mapped[ConsultationStatus] = mapped_column(
        SQLEnum(ConsultationStatus),
        nullable=False,
        index=True,
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
