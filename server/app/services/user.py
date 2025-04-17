import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password


def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.get(User, user_id)


def create_user(db: Session, user_in: UserCreate) -> User:
    hashed_pw = hash_password(user_in.password)
    user = User(
        username=user_in.username, email=user_in.email, hashed_password=hashed_pw
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.scalars(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user
