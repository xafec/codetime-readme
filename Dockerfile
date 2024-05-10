FROM docker.io/python:3-slim

ENV \ 
  INPUT_CODETIME_COOKIE_KEY \
  INPUT_GH_TOKEN \
  INPUT_USERNAME 

ENV PATH="${PATH}:/root/.local/bin" \
  PYTHONFAULTHANDLER=1 \
  PYTHONUNBUFFERED=1 \
  PYTHONHASHSEED=random \
  PYTHONDONTWRITEBYTECODE=1 \
  PIP_DISABLE_PIP_VERSION_CHECK=1 \
  PIP_NO_CACHE_DIR=1 \
  PIP_DEFAULT_TIMEOUT=100

COPY --chown=root:root pyproject.toml main.py /app/

RUN python -m pip install /app/

CMD python /app/main.py