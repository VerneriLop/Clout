from fastapi import FastAPI
from app.api.main import api_router
from fastapi.routing import APIRoute
from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

app.include_router(api_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
