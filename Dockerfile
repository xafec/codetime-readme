FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install -g npm@latest

RUN npm cache clean --force

RUN npm rm -rf node_modules && rm package-lock.json

RUN npm install

CMD ["npm", "start"]

EXPOSE 3000