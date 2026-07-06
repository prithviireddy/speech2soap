import json

from src.db.session import SessionLocal
from src.models.consultation import Consultation, ConsultationStatus
from src.models.report import Report
from src.utils.consultation_progress import update_progress

from ..ai.merge_dialogue import merge_dialogue
from ..ai.generate_report import generate_clinical_report
from ..ai.speaker_diarization import transcribe_audio


class ConsultationService:
    @staticmethod
    def process_audio(audio_path, consultation_id) -> None:

        db = SessionLocal()

        try:
            update_progress(
                db,
                consultation_id,
                10,
                "Transcription",
                ConsultationStatus.TRANSCRIBING,
            )

            diarized_path = transcribe_audio(db, audio_path, consultation_id)

            update_progress(
                db,
                consultation_id,
                90,
                "Processing Transcript",
                ConsultationStatus.PROCESSING,
            )

            merged_path = merge_dialogue(diarized_path)

            update_progress(
                db,
                consultation_id,
                95,
                "Generating Clinical Report",
            )

            report_path = generate_clinical_report(merged_path)

            with open(report_path, "r", encoding="utf-8") as f:
                report = json.load(f)

            report_record = Report(
                consultation_id=consultation_id,
                report_json=report,
                is_approved=False,
            )

            db.add(report_record)

            consultation = db.get(
                Consultation,
                consultation_id,
            )

            consultation.progress = 100
            consultation.current_stage = "Completed"
            consultation.status = ConsultationStatus.REVIEW_PENDING
            db.commit()

        except Exception as e:
            consultation = db.get(
                Consultation,
                consultation_id,
            )

            consultation.status = ConsultationStatus.FAILED
            db.commit()

        finally:
            db.close()
