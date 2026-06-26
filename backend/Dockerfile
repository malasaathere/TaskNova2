FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN mkdir -p uploads

# Azure App Service routes to port 8080 by default for Docker containers
EXPOSE 8080

ENV PORT=8080

RUN ls -la /app
RUN ls -la /app/src || true

CMD ["node", "src/server.js"]
