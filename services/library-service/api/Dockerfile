FROM node:21-alpine as builder
WORKDIR /app
COPY . .
RUN pnpm i
RUN pnpm run build

FROM node:21-alpine as final
RUN apk --no-cache -U upgrade
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json .
RUN pnpm i --only=production
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]
