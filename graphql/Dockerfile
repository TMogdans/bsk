FROM node:alpine

RUN npm install -g postgraphile \
    && npm install -g postgraphile-plugin-connection-filter

COPY ./custom-plugin /tmp/custom-plugin
RUN cd /tmp/custom-plugin  \
    && npm pack  \
    && npm install -g /tmp/custom-plugin/custom-plugin-0.0.1.tgz \
    && rm -rf /tmp/custom-plugin

EXPOSE 5000
ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]
