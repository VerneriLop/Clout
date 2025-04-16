
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app


COPY ./requirements.txt /src/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /src/requirements.txt

ENV PYTHONPATH=/app

COPY ./scripts /app/scripts

COPY ./alembic.ini /app/

COPY ./app /app/app


CMD ["fastapi", "run", "app/main.py", "--port", "8000"]