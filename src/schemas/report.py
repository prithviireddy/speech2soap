from uuid import UUID
from typing import Any

from .common import TimestampSchema, BaseSchema


class ReportUpdate(BaseSchema):
    report_json: dict[str, Any]


class ReportApprove(BaseSchema):
    approved: bool = True


class ReportRead(TimestampSchema):
    consultation_id: UUID

    is_approved: bool

    report_json: dict[str, Any]

    transcript_json: dict[str, Any] | None


class ReportSummary(BaseSchema):
    id: UUID

    consultation_id: UUID

    is_approved: bool
