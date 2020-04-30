FROM ubuntu:18.04

RUN apt-get update -y && apt-get upgrade -y && apt-get install nodejs npm -y
RUN apt-get update -y && apt-get upgrade -y && apt-get install python3-pip -y
RUN npm install -g npm@latest

COPY . /app
WORKDIR /app/static/ui
RUN npm install
RUN npm run-script build

WORKDIR /app
RUN pip3 install -r requirements.txt
EXPOSE 5000
CMD ["python3", "app.py"]