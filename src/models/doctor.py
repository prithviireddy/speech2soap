from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.models.mixins import UUIDMixin, TimestampMixin


class Doctor(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "doctors"

    user_id: Mapped[str] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
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
        index=True,
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
