# Build Stage
FROM node:lts-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the static site
RUN npm run build

# production stage
# https://hub.docker.com/r/bitnami/nginx -> always runs as non-root user
FROM bitnami/nginx:1.25 AS prod

# Copy built files from the build stage
COPY --from=build /app/dist /app

# Copy nginx configuration
COPY nginx.conf /opt/bitnami/nginx/conf/nginx.conf

# Expose port 8080
EXPOSE 8080
