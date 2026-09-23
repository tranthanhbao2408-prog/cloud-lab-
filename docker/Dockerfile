FROM node:20-alpine

WORKDIR /app

COPY mern-demo/package*.json ./
RUN npm ci

COPY mern-demo/server ./server

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
