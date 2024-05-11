FROM node:20-slim

WORKDIR /app

COPY . /app

RUN npm install

COPY . .

CMD ["npm", "start"]