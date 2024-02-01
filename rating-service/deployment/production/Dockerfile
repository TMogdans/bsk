FROM node:latest AS build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app
COPY ../../api/package*.json /usr/src/app/
RUN npm ci --only=production

FROM node:21.6-bullseye-slim

ENV NODE_ENV production
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node ../../api/dist /usr/src/app
CMD ["dumb-init", "node", "index.js"]
