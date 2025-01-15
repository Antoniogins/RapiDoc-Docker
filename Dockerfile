# Build stage for Node.js backend
FROM node:18-alpine as backend

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    sqlite \
    sqlite-dev

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy backend source
COPY src/server ./src/server

# Create specs upload directory
RUN mkdir -p src/data/specs

# Frontend stage
FROM node:18-alpine

# Install nginx and SQLite
RUN apk add --no-cache nginx sqlite sqlite-dev

# Copy frontend files
COPY src/app /usr/share/nginx/html

# Copy nginx configuration
COPY default.conf /etc/nginx/http.d/default.conf

# Copy backend build from previous stage
COPY --from=backend /app /app

# Create data directories and set permissions
RUN mkdir -p /app/src/data && \
    chown -R node:node /app/src/data

EXPOSE 80 3000

# Start both nginx and node server
COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
