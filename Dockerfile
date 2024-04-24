# Build stage
FROM node:latest AS build

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the package.json and package-lock.json files to the working directory
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code into the container
COPY . /app

# Build the application
RUN pnpm run build

# Run stage
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB tippspiel

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && \
    apt-get install -y nodejs

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Set timezone to Germany
RUN ln -snf /usr/share/zoneinfo/Europe/Berlin /etc/localtime && echo Europe/Berlin > /etc/timezone

# Copy from build stage
COPY --from=build /app ./

# Expose the next port
EXPOSE 5173

# Start next
CMD ["pnpm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "5173"]