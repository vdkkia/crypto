FROM python:3.8.5-slim

RUN apt-get update
RUN apt-get install -y netcat


RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt requirements.txt

RUN pip install pyyaml
RUN pip install argh

RUN pip install watchdog
RUN pip install -r requirements.txt
ENV PYTHONUNBUFFERED 1

COPY . .

ENTRYPOINT [ "python", "-u",  "/usr/src/app/index.py"]
