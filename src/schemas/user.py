from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class User(BaseModel):
    id: int
    name: str = Field(min_length=1)
    age = Field()
    email= Field()

