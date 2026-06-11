from uuid import UUID
from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
    )


class TimestampSchema(BaseSchema):
    id: UUID
    created_at: datetime
    updated_at: datetime
