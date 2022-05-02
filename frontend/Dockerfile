FROM node:latest as builder

ENV SKIP_PREFLIGHT_CHECK=true

WORKDIR /frontend

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]