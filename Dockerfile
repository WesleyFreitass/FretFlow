# Multi-stage build for FretFlow React SPA
FROM node:20-alpine AS builder

WORKDIR /app

# Prevent Electron from downloading desktop binaries inside the build container
ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1

COPY package*.json ./
RUN npm ci || npm install

COPY . .
RUN npm run build

# Production Stage: Lightweight Nginx Alpine
FROM nginx:alpine

# Copy built assets to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
