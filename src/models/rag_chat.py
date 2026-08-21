import uuid
from enum import Enum

from sqlalchemy import Enum as SQLEnum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.base import Base
from src.models.mixins import TimestampMixin, UUIDMixin


class MessageRole(str, Enum):
    USER      = "user"
    ASSISTANT = "assistant"


class RagChatSession(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "rag_chat_sessions"

    doctor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("doctors.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Auto-set to first user question (truncated to 500 chars)
    title: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        default="New conversation",
    )

    messages = relationship(
        "RagChatMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="RagChatMessage.created_at",
    )


class RagChatMessage(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "rag_chat_messages"

    session_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("rag_chat_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    role: Mapped[MessageRole] = mapped_column(
        SQLEnum(MessageRole),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Source citations JSON — only populated on assistant messages
    sources: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    session = relationship(
        "RagChatSession",
        back_populates="messages",
    )
