FROM docker.io/python:3-slim

RUN pip install poetry

RUN poetry install

CMD ["poetry", "run", "python", "main.py"]