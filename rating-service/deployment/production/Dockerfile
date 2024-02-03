FROM node:latest AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app
COPY ../../api/package*.json /usr/src/app/
RUN npm ci --only=production
USER node
COPY --chown=node:node ../../api /usr/src/app
RUN npm run build
CMD ["dumb-init", "node", "src/index.js"]
