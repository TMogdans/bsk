FROM node:alpine

RUN npm install -g postgraphile
RUN npm install -g postgraphile-plugin-connection-filter

COPY ./custom-plugin /tmp/custom-plugin
RUN cd /tmp/custom-plugin && npm pack
RUN npm install -g /tmp/custom-plugin/custom-plugin-0.0.1.tgz
RUN rm -rf /tmp/custom-plugin

EXPOSE 5000
ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]