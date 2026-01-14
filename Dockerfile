FROM node:22-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code and pre-built web-build
COPY . .

# Verify web-build exists (should be in Git repo)
RUN ls -la web-build/ && test -f web-build/index.html || (echo "web-build/index.html not found!" && exit 1)

# Build server
RUN pnpm run build

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "dist/index.js"]
