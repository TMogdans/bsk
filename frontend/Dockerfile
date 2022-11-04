FROM node:19-alpine as builder

ENV SKIP_PREFLIGHT_CHECK=true
ENV NODE_OPTIONS="--openssl-legacy-provider"

WORKDIR /frontend

COPY . .

RUN npm ci --legacy-peer-deps

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start", "build"]
