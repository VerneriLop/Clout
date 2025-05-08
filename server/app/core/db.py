import json
import logging
import os
from pathlib import Path

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.services.user_crud import create_user
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# engine = create_engine(settings.POSTGRES_URL)


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    user = session.execute(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            username=settings.FIRST_SUPERUSER,
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = create_user(session=session, user_create=user_in)

    if settings.ENVIRONMENT == "local":
        logger.info("Populating db with mock data")
        logger.info(os.getcwd())
        hashed_pw = get_password_hash("salasana")
        base_dir = Path(__file__).resolve().parent.parent / "mock-data"

        with open(base_dir / "users.json") as f:
            user_data = json.load(f)

        def user_exists_not(email: str) -> bool:
            user = session.execute(select(User).where(User.email == email)).first()
            return not user

        users = [
            User(**data, hashed_password=hashed_pw)
            for data in user_data
            if user_exists_not(data["email"])
        ]
        session.add_all(users)
        logger.info("Finished db population")
        session.commit()
