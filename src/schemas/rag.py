"""
schemas/rag.py — Request/response schemas for the patient RAG API.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


# ── Shared ────────────────────────────────────────────────────────────────────

class RagQuestion(BaseModel):
    question: str = Field(..., min_length=3, max_length=2000)


class SourceCitation(BaseModel):
    type: str           # "consultation_report" | "medication" | "followup" | etc.
    id: str             # source_id (UUID as string)
    title: str          # human-readable label e.g. "Consultation — Aug 21, 2026"
    excerpt: str        # first ~150 chars of the matched chunk
    relevance: float    # cosine similarity score 0–1
    url: str | None     # frontend route if navigable


class RagAnswer(BaseModel):
    answer: str
    sources: list[SourceCitation]
    question: str       # echo the question back for chat history


# ── Chat session schemas ──────────────────────────────────────────────────────

class ChatMessageRead(BaseModel):
    id: UUID
    role: str                        # "user" | "assistant"
    content: str
    sources: list[SourceCitation] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatSessionRead(BaseModel):
    id: UUID
    patient_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    model_config = {"from_attributes": True}


class ChatSessionDetail(BaseModel):
    id: UUID
    patient_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    messages: list[ChatMessageRead]

    model_config = {"from_attributes": True}


class ChatSessionAskResponse(BaseModel):
    """Returned by POST /sessions/{id}/ask"""
    session_id: UUID
    user_message_id: UUID
    assistant_message_id: UUID
    answer: str
    sources: list[SourceCitation]
