from sqlalchemy import text
from sqlalchemy.orm import Session


def generate_patient_number(db: Session) -> str:
    num = db.execute(text("SELECT nextval('patient_number_seq')")).scalar_one()
    return f"PAT-{num:06d}"
