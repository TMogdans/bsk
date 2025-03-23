FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies directly
COPY services/rating-view-service/package.json .
COPY services/rating-view-service/.babelrc .
COPY services/rating-view-service/tsconfig.json .
COPY services/rating-view-service/webpack.config.js .

RUN npm install

# Copy source files
COPY services/rating-view-service/src ./src

# Expose port
EXPOSE 3000

# Set command to start the dev server
CMD ["npm", "start"]