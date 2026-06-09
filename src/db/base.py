from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass













from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Annotated

class UserBase(BaseModel):
    username = Annotated[str,Field(min_length=1,max_length=50)]
    email = Annotated[EmailStr, Field(max_length=120)]

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id
  
