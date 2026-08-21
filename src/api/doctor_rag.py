"""
api/doctor_rag.py  —  RAG API with persistent chat sessions.

Endpoints:
    GET    /doctor/patients/{patient_id}/ai/sessions
    POST   /doctor/patients/{patient_id}/ai/sessions
    GET    /doctor/patients/{patient_id}/ai/sessions/{session_id}
    DELETE /doctor/patients/{patient_id}/ai/sessions/{session_id}
    POST   /doctor/patients/{patient_id}/ai/sessions/{session_id}/ask
    POST   /doctor/patients/{patient_id}/ai/reindex   (keep for report approval hook)
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, func

from src.db.session import get_db
from src.dependencies.auth import get_current_doctor
from src.models.user import User
from src.models.patient import Patient
from src.models.consultation import Consultation
from src.models.rag_chat import RagChatSession, RagChatMessage, MessageRole

from src.schemas.rag import (
    RagQuestion,
    SourceCitation,
    ChatSessionRead,
    ChatSessionDetail,
    ChatMessageRead,
    ChatSessionAskResponse,
)

from src.services.rag import retriever
from src.services.rag.context_builder import build_context, extract_source_citations
from src.services.rag.answer_generator import generate_answer
from src.services.rag.retriever import ensure_patient_indexed

router = APIRouter(prefix="/doctor", tags=["Doctor RAG"])


# ── Auth helpers ──────────────────────────────────────────────────────────────

def _get_doctor(current_user: User):
    if current_user.doctor_profile is None:
        raise HTTPException(status_code=404, detail="Doctor profile not found.")
    return current_user.doctor_profile


def _assert_patient_access(db: Session, doctor_id: uuid.UUID, patient_id: uuid.UUID):
    """Raise 403 if the doctor has no consultation with this patient."""
    stmt = (
        select(Consultation.id)
        .where(
            Consultation.doctor_id == doctor_id,
            Consultation.patient_id == patient_id,
        )
        .limit(1)
    )
    if db.scalar(stmt) is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this patient's records.",
        )


def _get_session_or_404(
    db: Session,
    session_id: uuid.UUID,
    doctor_id: uuid.UUID,
    patient_id: uuid.UUID,
) -> RagChatSession:
    session = db.get(RagChatSession, session_id)
    if session is None or session.patient_id != patient_id or session.doctor_id != doctor_id:
        raise HTTPException(status_code=404, detail="Chat session not found.")
    return session


def _patient_name(db: Session, patient_id: uuid.UUID) -> str:
    p = db.get(Patient, patient_id)
    return p.full_name if p else "Unknown Patient"


# ── Session list ──────────────────────────────────────────────────────────────

@router.get(
    "/patients/{patient_id}/ai/sessions",
    response_model=list[ChatSessionRead],
)
def list_sessions(
    patient_id: uuid.UUID,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    doctor = _get_doctor(current_user)
    _assert_patient_access(db, doctor.id, patient_id)

    sessions = (
        db.execute(
            select(RagChatSession)
            .where(
                RagChatSession.doctor_id == doctor.id,
                RagChatSession.patient_id == patient_id,
            )
            .order_by(RagChatSession.updated_at.desc())
        )
        .scalars()
        .all()
    )

    result = []
    for s in sessions:
        count = db.scalar(
            select(func.count()).where(RagChatMessage.session_id == s.id)
        )
        item = ChatSessionRead(
            id=s.id,
            patient_id=s.patient_id,
            title=s.title,
            created_at=s.created_at,
            updated_at=s.updated_at,
            message_count=count or 0,
        )
        result.append(item)

    return result


# ── Create session ────────────────────────────────────────────────────────────

@router.post(
    "/patients/{patient_id}/ai/sessions",
    response_model=ChatSessionRead,
    status_code=status.HTTP_201_CREATED,
)
def create_session(
    patient_id: uuid.UUID,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    doctor = _get_doctor(current_user)
    _assert_patient_access(db, doctor.id, patient_id)

    session = RagChatSession(
        doctor_id=doctor.id,
        patient_id=patient_id,
        title="New conversation",
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return ChatSessionRead(
        id=session.id,
        patient_id=session.patient_id,
        title=session.title,
        created_at=session.created_at,
        updated_at=session.updated_at,
        message_count=0,
    )


# ── Get session with messages ─────────────────────────────────────────────────

@router.get(
    "/patients/{patient_id}/ai/sessions/{session_id}",
    response_model=ChatSessionDetail,
)
def get_session(
    patient_id: uuid.UUID,
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    doctor = _get_doctor(current_user)
    session = _get_session_or_404(db, session_id, doctor.id, patient_id)

    messages = (
        db.execute(
            select(RagChatMessage)
            .where(RagChatMessage.session_id == session.id)
            .order_by(RagChatMessage.created_at)
        )
        .scalars()
        .all()
    )

    return ChatSessionDetail(
        id=session.id,
        patient_id=session.patient_id,
        title=session.title,
        created_at=session.created_at,
        updated_at=session.updated_at,
        messages=[
            ChatMessageRead(
                id=m.id,
                role=m.role.value,
                content=m.content,
                sources=[SourceCitation(**s) for s in (m.sources or {}).get("sources", [])]
                    if m.sources else None,
                created_at=m.created_at,
            )
            for m in messages
        ],
    )


# ── Delete session ────────────────────────────────────────────────────────────

@router.delete(
    "/patients/{patient_id}/ai/sessions/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_session(
    patient_id: uuid.UUID,
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    doctor = _get_doctor(current_user)
    session = _get_session_or_404(db, session_id, doctor.id, patient_id)
    db.delete(session)
    db.commit()


# ── Ask in session ────────────────────────────────────────────────────────────

@router.post(
    "/patients/{patient_id}/ai/sessions/{session_id}/ask",
    response_model=ChatSessionAskResponse,
)
def ask_in_session(
    patient_id: uuid.UUID,
    session_id: uuid.UUID,
    body: RagQuestion,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    doctor = _get_doctor(current_user)
    session = _get_session_or_404(db, session_id, doctor.id, patient_id)

    # Load prior messages for multi-turn context (oldest first)
    prior_messages = (
        db.execute(
            select(RagChatMessage)
            .where(RagChatMessage.session_id == session.id)
            .order_by(RagChatMessage.created_at)
        )
        .scalars()
        .all()
    )
    history = [{"role": m.role.value, "content": m.content} for m in prior_messages]

    # Set session title from first user question
    if not prior_messages:
        session.title = body.question[:497] + ("..." if len(body.question) > 497 else "")

    # Save user message
    user_msg = RagChatMessage(
        session_id=session.id,
        role=MessageRole.USER,
        content=body.question,
    )
    db.add(user_msg)
    db.flush()  # get the ID without committing yet

    # Retrieve + generate
    try:
        chunks = retriever.retrieve(
            db=db,
            doctor_id=doctor.id,
            patient_id=patient_id,
            query=body.question,
            n_results=8,
        )
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    context   = build_context(chunks)
    citations = extract_source_citations(chunks)

    patient_name = _patient_name(db, patient_id)
    doctor_name  = doctor.full_name

    answer_text = generate_answer(
        question=body.question,
        context=context,
        patient_name=patient_name,
        doctor_name=doctor_name,
        history=history,
    )

    # Save assistant message (store sources as JSONB)
    sources_data = {"sources": [c for c in citations]}
    assistant_msg = RagChatMessage(
        session_id=session.id,
        role=MessageRole.ASSISTANT,
        content=answer_text,
        sources=sources_data,
    )
    db.add(assistant_msg)

    # Bump session updated_at
    from datetime import datetime, timezone
    session.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user_msg)
    db.refresh(assistant_msg)

    return ChatSessionAskResponse(
        session_id=session.id,
        user_message_id=user_msg.id,
        assistant_message_id=assistant_msg.id,
        answer=answer_text,
        sources=[SourceCitation(**c) for c in citations],
    )


# ── Reindex (called on report approval) ──────────────────────────────────────

@router.post(
    "/patients/{patient_id}/ai/reindex",
    status_code=status.HTTP_202_ACCEPTED,
)
def reindex_patient(
    patient_id: uuid.UUID,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db),
):
    doctor = _get_doctor(current_user)
    _assert_patient_access(db, doctor.id, patient_id)

    try:
        count = ensure_patient_indexed(db, patient_id, force_rebuild=True)
        return {"indexed": count, "patient_id": str(patient_id)}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Reindex failed: {exc}")
