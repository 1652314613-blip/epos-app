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

# Build server
RUN pnpm run build || echo "Build script failed, continuing with pre-built dist"

# Verify dist/index.cjs exists
RUN test -f dist/index.cjs || (echo "dist/index.cjs not found!" && exit 1)

# Expose port
EXPOSE 3000

# Start server using index.cjs
CMD ["node", "--no-warnings", "dist/index.cjs"]
