FROM node:latest as builder
ENV SKIP_PREFLIGHT_CHECK=true
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
FROM bitnami/nginx:latest
COPY --from=builder /app/build /app