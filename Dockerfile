FROM docker.io/python:3-slim

WORKDIR /app

COPY . /app

RUN pip install poetry

RUN poetry install

CMD ["poetry", "run", "python", "/app/main.py"]