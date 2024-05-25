FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB tippspiel
ENV POSTGRES_SHARED_BUFFERS 8GB
ENV POSTGRES_WORK_MEM 64MB
ENV POSTGRES_RANDOM_PAGE_COST 1.1

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && \
    apt-get install -y nodejs

# Install pnpm globally
RUN npm install -g pnpm

# Set timezone to Germany
RUN ln -snf /usr/share/zoneinfo/Europe/Berlin /etc/localtime && echo Europe/Berlin > /etc/timezone

# Copy from build stage
COPY . ./
RUN rm -rf .next
RUN rm -rf node_modules

# Install dependencies using pnpm
RUN pnpm install
RUN pnpm dlx next-ws-cli@latest patch
RUN pnpm dlx prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# Expose the next port
EXPOSE 5173

# Start next
CMD ["pnpm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "5173"]
#CMD ["pnpm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "5173"]