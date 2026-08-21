"""
retriever.py

Orchestrates patient-scoped retrieval:
1. Verifies doctor is authorized for this patient.
2. Lazily builds the ChromaDB index on first call (or after reindex).
3. Queries the vector store.
4. Returns ranked chunks for the context builder.
"""

import uuid
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select

from src.models.consultation import Consultation
from src.models.patient import Patient
from src.models.medication import Medication
from src.models.followup import Followup

from src.services.rag.document_builder import build_patient_documents
from src.services.rag import vector_store


def _load_patient_with_relations(
    db: Session,
    patient_id: uuid.UUID,
) -> Patient | None:
    """
    Load patient with all relationships needed for document building:
    consultations -> report, medications, followups.
    """
    stmt = (
        select(Patient)
        .where(Patient.id == patient_id)
        .options(
            selectinload(Patient.consultations).selectinload(Consultation.report),
            selectinload(Patient.medications),
            selectinload(Patient.followups),
        )
    )
    return db.scalar(stmt)


def _doctor_has_access(
    db: Session,
    doctor_id: uuid.UUID,
    patient_id: uuid.UUID,
) -> bool:
    """
    A doctor may access a patient's RAG only if they have at least one
    consultation with that patient. Enforces the same authorization
    model as the rest of the doctor API.
    """
    stmt = (
        select(Consultation.id)
        .where(
            Consultation.doctor_id == doctor_id,
            Consultation.patient_id == patient_id,
        )
        .limit(1)
    )
    return db.scalar(stmt) is not None


def ensure_patient_indexed(
    db: Session,
    patient_id: uuid.UUID,
    force_rebuild: bool = False,
) -> int:
    """
    Build the patient's ChromaDB index if it doesn't exist yet.
    With force_rebuild=True, deletes and rebuilds the collection.

    Args:
        db:            SQLAlchemy session.
        patient_id:    Patient UUID.
        force_rebuild: If True, drop and recreate the collection.

    Returns:
        Number of documents indexed.
    """
    pid_str = str(patient_id)

    if force_rebuild:
        vector_store.delete_patient_collection(pid_str)
    elif vector_store.patient_collection_exists(pid_str):
        return 0  # already indexed, nothing to do

    patient = _load_patient_with_relations(db, patient_id)
    if patient is None:
        raise ValueError(f"Patient {patient_id} not found.")

    documents = build_patient_documents(patient)
    return vector_store.upsert_patient_documents(pid_str, documents)


def retrieve(
    db: Session,
    doctor_id: uuid.UUID,
    patient_id: uuid.UUID,
    query: str,
    n_results: int = 6,
) -> list[dict]:
    """
    Main retrieval entry point.

    1. Verifies doctor authorization.
    2. Lazily indexes patient records.
    3. Returns top-k similar chunks.

    Raises:
        PermissionError: If the doctor is not authorized for this patient.
        ValueError:      If the patient is not found.
    """
    if not _doctor_has_access(db, doctor_id, patient_id):
        raise PermissionError(
            "You are not authorized to access this patient's records."
        )

    # Lazy index
    ensure_patient_indexed(db, patient_id)

    return vector_store.query_patient(
        patient_id=str(patient_id),
        query_text=query,
        n_results=n_results,
    )
