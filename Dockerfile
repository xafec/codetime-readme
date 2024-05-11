FROM docker.io/python:3-slim AS builder

ENV POETRY_HOME="/opt/poetry" \
  POETRY_VIRTUALENVS_IN_PROJECT=1 \
  POETRY_NO_INTERACTION=1

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /app

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-root --no-ansi --without dev

FROM docker.io/python:3-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1 \
  PATH="/app/.venv/bin:$PATH"

WORKDIR /app

COPY --from=builder /app/.venv ./.venv

COPY . .

CMD ["python", "main.py"]