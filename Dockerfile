FROM node:22-slim
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production=false

# Copy source code
COPY . .

# Build the backend (compile TypeScript to dist/index.cjs)
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
