FROM docker.io/python:3-slim

ADD requirements.txt /requirements.txt
ADD main.py /main.py
RUN pip install -r requirements.txt

CMD ["python", "/main.py"]