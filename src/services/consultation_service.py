import traceback

from src.db.session import SessionLocal
from src.models.appointment import AppointmentStatus
from src.models.consultation import Consultation, ConsultationStatus
from src.models.report import Report
from src.utils.consultation_progress import update_progress

from ..ai.generate_report import generate_clinical_report
from ..ai.merge_dialogue import merge_dialogue
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

            report = generate_clinical_report(merged_path)

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

            if consultation is None:
                raise ValueError("Consultation not found.")
            
            appointment = consultation.appointment

            consultation.progress = 100
            consultation.current_stage = "Completed"
            consultation.status = ConsultationStatus.REVIEW_PENDING
            consultation.transcript_path = str(merged_path)
            
            appointment.status = AppointmentStatus.COMPLETED
            db.commit()

        except Exception as e:
            print("\n")
            print("=" * 50)
            print("CONSULTATION PROCESSING FAILED")
            traceback.print_exc()
            print("=" * 50)
            print("\n")

            consultation = db.get(
                Consultation,
                consultation_id,
            )

            if consultation is not None:
                consultation.status = ConsultationStatus.FAILED
                consultation.progress = 0
                consultation.current_stage = "Failed"

                db.commit()

        finally:
            db.close()
