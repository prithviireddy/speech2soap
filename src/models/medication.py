from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.models.mixins import UUIDMixin, TimestampMixin


class Medication(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "medications"

    patient_id: Mapped[str] = mapped_column(
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    report_id: Mapped[str] = mapped_column(
        ForeignKey("reports.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    dosage: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    frequency: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    instructions: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    patient = relationship(
        "Patient",
        back_populates="medications",
    )

    report = relationship(
        "Report",
        back_populates="medications",
    )
