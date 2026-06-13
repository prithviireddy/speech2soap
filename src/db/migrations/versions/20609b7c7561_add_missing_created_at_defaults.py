"""add missing created_at defaults

Revision ID: 20609b7c7561
Revises: 119de7aa821e
Create Date: 2026-06-12 16:49:46.860493

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20609b7c7561'
down_revision: Union[str, Sequence[str], None] = '119de7aa821e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
