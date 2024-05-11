FROM docker.io/python:3-slim AS builder

ENV PATH="$POETRY_HOME/bin:$PATH"

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /app

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-root --no-ansi --without dev

CMD ["poetry", "run", "python", "main.py"]

# 

FROM docker.io/python:3-slim

ENV \ 
  INPUT_CODETIME_COOKIE_KEY \
  INPUT_USERNAME \
  INPUT_GH_TOKEN \
  PATH="/app/.venv/bin:$PATH"

WORKDIR /app

COPY --from=builder /app/.venv ./.venv

CMD ["poetry", "run", "python", "main.py"]