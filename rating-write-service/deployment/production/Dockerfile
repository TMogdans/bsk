FROM node:21-alpine as builder
WORKDIR /app
COPY ../../api .
RUN npm i
RUN npm run build

FROM node:21-alpine as final
RUN apk --no-cache -U upgrade
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY ../../api/package*.json .
RUN npm i --only=production
EXPOSE 3000
CMD ["npm", "run", "start"]