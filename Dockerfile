FROM docker.io/python:3-slim

ENV INPUT_GH_TOKEN \
  INPUT_USERNAME \
  INPUT_CODETIME_COOKIE_KEY

ADD requirements.txt /requirements.txt
ADD main.py /main.py
RUN pip install -r requirements.txt

CMD ["python", "/main.py"]