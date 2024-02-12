FROM node:21-alpine as builder
WORKDIR /app
COPY ../../api .
RUN npm i
RUN npx prisma generate
RUN npm run build

FROM node:21-alpine as final
RUN apk --no-cache -U upgrade
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY ../../api/package*.json .
COPY ../../api/process.yml .
COPY ../../api/prisma ./prisma
RUN npm i -g pm2
RUN npm i --only=production
RUN npx prisma generate
EXPOSE 3000
ENTRYPOINT ["pm2-runtime", "./process.yml"]
