# ── Stage 1: Build React App ─────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ────────────────────────────────────
FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run sends PORT env variable — nginx listens on 8080
ENV PORT=8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
