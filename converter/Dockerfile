FROM node:21-alpine3.18
RUN apk update && apk upgrade
RUN apk add ffmpeg
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
