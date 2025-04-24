import uuid
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    username: str
    is_active: bool = True
    is_superuser: bool = False
    # first_name: str | None
    # last_name: str | None


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


# Properties to receive via API on update
class UserUpdateMe(BaseModel):
    username: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    # first_name....


class UserUpdate(BaseModel):
    username: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=40)
    # first_name....


class UpdatePassword(BaseModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


class UsersPublic(BaseModel):
    data: list[UserPublic]
    count: int


# Generic message
class Message(BaseModel):
    message: str


class User(UserBase):
    id: uuid.UUID
    hashed_password: str
    username: str
