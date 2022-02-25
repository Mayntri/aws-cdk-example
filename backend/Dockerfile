FROM alpine:latest
RUN apk add --no-cache nodejs npm
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]