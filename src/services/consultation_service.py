from .transcription.speaker_diarization import transcribe_audio
from .processing.merge_dialogue import merge_dialogue
from .reporting.generate_report import generate_clinical_report

import json


class ConsultationService:
    @staticmethod
    def process_audio(audio_path, job_id, jobs):

        try:
            jobs[job_id]["progress"] = 10
            jobs[job_id]["stage"] = "transcription"

            diarized_path = transcribe_audio(audio_path, job_id, jobs)

            jobs[job_id]["progress"] = 90
            jobs[job_id]["stage"] = "Processing Transcript"

            merged_path = merge_dialogue(diarized_path)

            jobs[job_id]["progress"] = 95
            jobs[job_id]["stage"] = "Generating Clinical Report"

            report_path = generate_clinical_report(merged_path)

            with open(report_path, "r", encoding="utf-8") as f:
                report = json.load(f)

            jobs[job_id]["progress"] = 100
            jobs[job_id]["stage"] = "completed"
            jobs[job_id]["status"] = "completed"
            jobs[job_id]["report"] = report

        except Exception as e:
            jobs[job_id]["status"] = "failed"
            jobs[job_id]["error"] = str(e)
