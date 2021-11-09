FROM node:16-alpine

# Create app directory and copy source + dependencies list
WORKDIR /usr/app
COPY package*.json .
COPY src ./src

# Install dependencies
RUN npm install

EXPOSE 8080
ENTRYPOINT [ "npm", "run", "start" ]
