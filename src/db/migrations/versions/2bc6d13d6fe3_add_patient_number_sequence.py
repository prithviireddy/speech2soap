"""add patient number sequence

Revision ID: 2bc6d13d6fe3
Revises: 0770fb834d52
Create Date: 2026-06-28 01:06:02.537278

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2bc6d13d6fe3'
down_revision: Union[str, Sequence[str], None] = '0770fb834d52'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:  
    op.execute("CREATE SEQUENCE patient_number_seq START 1;")


def downgrade() -> None:
    op.execute("DROP SEQUENCE patient_number_seq;")
