from sqlalchemy.orm import Session

from src.models.consultation import Consultation,ConsultationStatus


def update_progress(
    db: Session,
    consultation_id,
    progress: int,
    stage: str,
    status: ConsultationStatus | None = None,
):
    consultation = db.get(
        Consultation,
        consultation_id,
    )

    if consultation is None:
        raise ValueError(f"Consultation {consultation_id} not found")

    consultation.progress = progress
    consultation.current_stage = stage

    if status is not None:
        consultation.status = status

    db.commit()
