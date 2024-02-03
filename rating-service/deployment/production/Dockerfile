FROM node:21-alpine as node

FROM node AS builder

WORKDIR /app

COPY ../../api/package*.json ./

RUN npm i

COPY ../../api .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]

FROM node AS production

RUN apk --no-cache -U upgrade

RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN npm i -g pm2

COPY --chown=node:node ../../api/package*.json ../..api/process.yml ./

USER node

RUN npm i --only=production

COPY --chown=node:node --from=builder /app/dist ./dist

EXPOSE 3000

ENTRYPOINT ["pm2-runtime", "./process.yml"]
