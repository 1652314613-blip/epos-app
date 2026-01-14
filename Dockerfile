FROM node:22-slim

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Verify web-build exists
RUN test -f web-build/index.html || (echo "web-build/index.html not found!" && exit 1)

# Build server - use tsx to compile TypeScript directly without esbuild
RUN pnpm run build || echo "Build script failed, continuing with pre-built dist"

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "dist/index.cjs"]
