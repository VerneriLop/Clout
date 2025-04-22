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
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr

    class Config:
        from_attributes = True


# Properties to receive via API on update
class UserUpdateMe(BaseModel):
    username: str | None = Field(default=None, max_length=255)
    email: str | None = Field(default=None, max_length=255)
    # first_name....


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID

    class Config:
        from_attributes = True


class UsersPublic(BaseModel):
    data: list[UserPublic]
    count: int


class User(UserBase):
    id: uuid.UUID
    hashed_password: str
    username: str
