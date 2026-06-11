from uuid import UUID
from typing import Any

from pydantic import BaseModel

from .common import TimestampSchema


class ReportUpdate(BaseModel):
    report_json: dict[str, Any]


class ReportApprove(BaseModel):
    approved: bool = True


class ReportRead(TimestampSchema):
    consultation_id: UUID

    is_approved: bool

    report_json: dict[str, Any]

    transcript_json: dict[str, Any] | None


class ReportSummary(BaseModel):
    id: UUID

    consultation_id: UUID

    is_approved: bool
