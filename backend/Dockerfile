FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN mkdir -p uploads
EXPOSE 8080
ENV PORT=8080
RUN ls -la /app
RUN ls -la /app/src || true
CMD ["node", "src/server.js"]