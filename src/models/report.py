import uuid

from sqlalchemy import Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.models.mixins import TimestampMixin, UUIDMixin


class Report(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "reports"

    consultation_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("consultations.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    is_approved: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    report_json: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    transcript_json: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    consultation = relationship(
        "Consultation",
        back_populates="report",
    )

    medications = relationship(
        "Medication",
        back_populates="report",
    )
