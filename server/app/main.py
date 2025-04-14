from fastapi import FastAPI
from app.api.main import api_router
from app.db.base import Base
from app.db.session import engine

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(api_router, prefix="/api")
