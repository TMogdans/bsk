FROM node:latest

WORKDIR /app

COPY ../../api/package*.json ./

RUN npm i

COPY ../../api .

EXPOSE 3000

CMD ["node", "dist/index.js"]

