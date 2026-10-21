FROM node:18

WORKDIR /app

# Copy trực tiếp từ thư mục hiện tại vào container
COPY package*.json ./

RUN npm install

# Copy toàn bộ source code server vào
COPY . .

EXPOSE 10000

CMD ["node", "server.js"]