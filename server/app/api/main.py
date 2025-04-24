from fastapi import APIRouter
from app.api.routes import user
from app.api.routes import utils
from app.api.routes import login

api_router = APIRouter()
api_router.include_router(user.router)
api_router.include_router(utils.router)
api_router.include_router(login.router)
