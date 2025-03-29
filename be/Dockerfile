FROM node:20-alpine
WORKDIR /app
RUN npm install --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
