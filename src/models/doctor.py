import uuid
from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.models.mixins import TimestampMixin, UUIDMixin


class Doctor(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "doctors"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    specialization: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    license_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="doctor_profile",
    )

    consultations = relationship(
        "Consultation",
        back_populates="doctor",
    )

    followups = relationship(
        "Followup",
        back_populates="doctor",
    )
