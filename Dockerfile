FROM node:18-alpine AS build-frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY --from=build-frontend /frontend/dist ./public

EXPOSE 3000
CMD ["node", "server.js"]
