FROM node:lts-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM bitnami/nginx:1.25
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# Build Stage
FROM node:lts-alpine AS build

# Set working directory
WORKDIR /app

# Accept build argument for project url and set it
ARG PROJECT_URL
ENV PROJECT_URL=${PROJECT_URL}

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
