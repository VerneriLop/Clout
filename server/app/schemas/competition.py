from datetime import datetime
import uuid
from pydantic import BaseModel, EmailStr, Field, HttpUrl


class Competition: ...


class CompetitionPublic(BaseModel):
    category: str
    description: str
    start_time: datetime
    end_time: datetime
    competition_number: int


class CompetitionsPublic(BaseModel):
    data: list[CompetitionPublic]
    count: int


class PostMinimal(BaseModel):
    image_url: HttpUrl


# Competition entry for pairwise voting on frontend
class CompetitionEntryPublic(BaseModel):
    post: PostMinimal


class VotePair(BaseModel):
    pair: tuple[CompetitionEntryPublic, CompetitionEntryPublic]
