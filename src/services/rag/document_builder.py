"""
document_builder.py

Converts patient ORM objects into a flat list of text documents
suitable for embedding and storage in ChromaDB.

Each document is:
{
    "id":       str  — unique stable ID for upsert idempotency
    "text":     str  — the text that will be embedded
    "metadata": dict — used for filtering and citation display
}
"""

import json
from pathlib import Path


# ── Helpers ──────────────────────────────────────────────────────────────────

def _fmt_date(dt) -> str:
    if dt is None:
        return "unknown date"
    return dt.strftime("%b %d, %Y")


def _safe_list(v) -> list:
    return v if isinstance(v, list) else []


def _safe_str(v) -> str:
    return v if isinstance(v, str) else ""


# ── Report documents ──────────────────────────────────────────────────────────

def _build_report_docs(consultation) -> list[dict]:
    """
    One document per major SOAP / clinical section of the approved report.
    Keeps chunks focused so retrieval targets the right section.
    """
    report = consultation.report
    if report is None or not report.is_approved:
        return []

    rj = report.report_json or {}
    docs = []
    date_label = _fmt_date(consultation.created_at)
    base_meta = {
        "patient_id":       str(consultation.patient_id),
        "doctor_id":        str(consultation.doctor_id),
        "document_type":    "consultation_report",
        "source_id":        str(report.id),
        "consultation_id":  str(consultation.id),
        "created_at":       _fmt_date(consultation.created_at),
        "title":            f"Consultation Report — {date_label}",
        "url":              f"/doctor/reports/{report.id}",
    }

    # Summary
    summary = _safe_str(rj.get("summary"))
    if summary:
        docs.append({
            "id":       f"report_{report.id}_summary",
            "text":     f"Clinical Summary ({date_label}):\n{summary}",
            "metadata": {**base_meta, "section": "summary"},
        })

    # SOAP
    soap = rj.get("soap", {})
    for section in ("subjective", "objective", "assessment", "plan"):
        items = _safe_list(soap.get(section))
        if items:
            text = "\n".join(f"- {i}" for i in items)
            docs.append({
                "id":       f"report_{report.id}_soap_{section}",
                "text":     f"SOAP {section.capitalize()} ({date_label}):\n{text}",
                "metadata": {**base_meta, "section": f"soap_{section}"},
            })

    # Clinical report sections
    cr = rj.get("clinical_report", {})
    cr_sections = {
        "diagnosis":       "Diagnosis",
        "medications":     "Medications prescribed",
        "allergies":       "Allergies",
        "key_findings":    "Key findings",
        "treatment_plan":  "Treatment plan",
        "follow_up_tasks": "Follow-up tasks",
    }
    for key, label in cr_sections.items():
        items = _safe_list(cr.get(key))
        if items:
            # Handle dict items (e.g. diagnosis has {name, icd_code})
            lines = []
            for item in items:
                if isinstance(item, dict):
                    lines.append(", ".join(f"{k}: {v}" for k, v in item.items() if v))
                else:
                    lines.append(str(item))
            text = "\n".join(f"- {l}" for l in lines)
            docs.append({
                "id":       f"report_{report.id}_cr_{key}",
                "text":     f"{label} ({date_label}):\n{text}",
                "metadata": {**base_meta, "section": key},
            })

    return docs


# ── Transcript documents ──────────────────────────────────────────────────────

def _build_transcript_docs(consultation) -> list[dict]:
    """
    Groups consecutive same-speaker segments into chunks (~300 chars).
    Only indexes transcripts from approved consultations.
    """
    report = consultation.report
    if report is None or not report.is_approved:
        return []

    transcript_path = consultation.transcript_path
    if not transcript_path:
        return []

    path = Path(transcript_path)
    if not path.exists():
        return []

    try:
        with open(path, "r", encoding="utf-8") as f:
            segments = json.load(f)
    except Exception:
        return []

    date_label = _fmt_date(consultation.created_at)
    docs = []
    chunk_text = ""
    chunk_speaker = ""
    chunk_index = 0

    def flush_chunk():
        nonlocal chunk_text, chunk_speaker, chunk_index
        if chunk_text.strip():
            docs.append({
                "id":   f"transcript_{consultation.id}_chunk_{chunk_index}",
                "text": f"Transcript excerpt ({date_label}) — {chunk_speaker}:\n{chunk_text.strip()}",
                "metadata": {
                    "patient_id":      str(consultation.patient_id),
                    "doctor_id":       str(consultation.doctor_id),
                    "document_type":   "consultation_transcript",
                    "source_id":       str(consultation.id),
                    "consultation_id": str(consultation.id),
                    "created_at":      _fmt_date(consultation.created_at),
                    "title":           f"Transcript — {date_label}",
                    "url":             f"/doctor/consultations/{consultation.id}",
                    "speaker":         chunk_speaker,
                },
            })
            chunk_index += 1
            chunk_text = ""
            chunk_speaker = ""

    for seg in segments:
        text = seg.get("text", "").strip()
        speaker = seg.get("speaker", "UNKNOWN")
        if not text:
            continue

        # Flush when speaker changes or chunk exceeds ~300 chars
        if (chunk_speaker and chunk_speaker != speaker) or len(chunk_text) > 300:
            flush_chunk()

        chunk_speaker = speaker
        chunk_text += " " + text

    flush_chunk()
    return docs


# ── Medication documents ──────────────────────────────────────────────────────

def _build_medication_docs(patient) -> list[dict]:
    docs = []
    for med in (patient.medications or []):
        parts = [f"Medication: {med.name}", f"Dosage: {med.dosage}", f"Frequency: {med.frequency}"]
        if med.instructions:
            parts.append(f"Instructions: {med.instructions}")
        docs.append({
            "id":   f"medication_{med.id}",
            "text": "\n".join(parts),
            "metadata": {
                "patient_id":    str(patient.id),
                "document_type": "medication",
                "source_id":     str(med.id),
                "created_at":    _fmt_date(med.created_at),
                "title":         f"Medication — {med.name}",
                "url":           None,
            },
        })
    return docs


# ── Followup documents ────────────────────────────────────────────────────────

def _build_followup_docs(patient) -> list[dict]:
    docs = []
    for fu in (patient.followups or []):
        parts = [f"Follow-up: {fu.title}", f"Scheduled: {_fmt_date(fu.scheduled_at)}", f"Status: {fu.status}"]
        if fu.notes:
            parts.append(f"Notes: {fu.notes}")
        docs.append({
            "id":   f"followup_{fu.id}",
            "text": "\n".join(parts),
            "metadata": {
                "patient_id":    str(patient.id),
                "document_type": "followup",
                "source_id":     str(fu.id),
                "created_at":    _fmt_date(fu.scheduled_at),
                "title":         f"Follow-up — {fu.title}",
                "url":           None,
            },
        })
    return docs


# ── Consultation meta documents ───────────────────────────────────────────────

def _build_consultation_meta_docs(consultation) -> list[dict]:
    parts = []
    if consultation.chief_complaint:
        parts.append(f"Chief complaint: {consultation.chief_complaint}")
    if consultation.doctor_notes:
        parts.append(f"Doctor notes: {consultation.doctor_notes}")

    if not parts:
        return []

    date_label = _fmt_date(consultation.created_at)
    return [{
        "id":   f"consultation_meta_{consultation.id}",
        "text": f"Consultation notes ({date_label}):\n" + "\n".join(parts),
        "metadata": {
            "patient_id":      str(consultation.patient_id),
            "doctor_id":       str(consultation.doctor_id),
            "document_type":   "consultation_meta",
            "source_id":       str(consultation.id),
            "consultation_id": str(consultation.id),
            "created_at":      date_label,
            "title":           f"Consultation — {date_label}",
            "url":             f"/doctor/consultations/{consultation.id}",
        },
    }]


# ── Public API ────────────────────────────────────────────────────────────────

def build_patient_documents(patient) -> list[dict]:
    """
    Build all indexable documents from a patient's clinical records.
    Only includes data from approved consultations (transcript + report).
    Medications, followups, and consultation meta are always included.

    Args:
        patient: Patient ORM instance with eager-loaded relationships.

    Returns:
        List of document dicts ready for embedding + upsert into ChromaDB.
    """
    docs: list[dict] = []

    for consultation in (patient.consultations or []):
        docs.extend(_build_report_docs(consultation))
        docs.extend(_build_transcript_docs(consultation))
        docs.extend(_build_consultation_meta_docs(consultation))

    docs.extend(_build_medication_docs(patient))
    docs.extend(_build_followup_docs(patient))

    return docs
