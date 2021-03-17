FROM node:lts-slim

ENV PORT 5000
EXPOSE 5000

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

CMD ["npm", "run", "start"]
