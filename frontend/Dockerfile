FROM node:latest as builder
ENV SKIP_PREFLIGHT_CHECK=true
WORKDIR /frontend
COPY . .
RUN yarn
RUN yarn build
FROM bitnami/nginx:latest
COPY --from=builder /frontend/build /app