from typing import Any
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from app.schemas.user import UserCreate, UserOut, UserPublic, UserUpdateMe, UsersPublic
from app.services import user_crud as crud
from app.api.deps import CurrentUser, SessionDep, get_current_active_superuser
from app.models import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve users.
    """

    count_statement = select(func.count()).select_from(User)
    count = session.execute(count_statement).scalar_one()

    statement = select(User).offset(skip).limit(limit)
    users = session.scalars(statement).all()

    return UsersPublic(data=users, count=count)


@router.post(
    "/", dependencies=[Depends(get_current_active_superuser)], response_model=UserPublic
)
def create_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """
    Create new user.
    """
    try:
        user = crud.create_user(session=session, user_create=user_in)
        # TODO: email confirmation as in the template
        return user
    except IntegrityError as e:
        session.rollback()
        user = crud.get_user_by_email(session=session, email=user_in.email)
        if user:
            raise HTTPException(
                status_code=409,
                detail="The user with this email already exists in the system.",
            )

        user = crud.get_user_by_username(session=session, email=user_in.username)
        if user:
            raise HTTPException(
                status_code=409,
                detail="The user with this username already exists in the system.",
            )
    except Exception as e:  # noqa: F841
        session.rollback()
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Try again later.",
        )


@router.patch("/me", response_model=UserPublic)
def update_user_me(
    *, session: SessionDep, user_in: UserUpdateMe, current_user: CurrentUser
) -> Any:
    """
    Update own user: username or email
    """
    if user_in.email:
        existing_user = crud.get_user_by_email(session=session, email=user_in.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail="User with this email already exists"
            )
        current_user.email = user_in.email

    if user_in.username:
        existing_user = crud.get_user_by_username(
            session=session, username=user_in.username
        )
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=409, detail="User with this username already exists"
            )
        current_user.username = user_in.username

    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return current_user


@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(
    user_id: uuid.UUID, session: SessionDep, current_user: CurrentUser
) -> Any:
    """
    Get a specific user by id.
    """
    user = session.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user == current_user:
        return user
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges",
        )
    return user


@router.post("/register", response_model=UserOut)
def register_user(user_in: UserCreate, db: SessionDep):
    return crud.create_user(db, user_in)
