FROM node:22-slim
WORKDIR /app
# Copy package files
COPY package.json package-lock.json ./
# Install dependencies
RUN npm ci
# Copy source code
COPY . .
# Expose port
EXPOSE 3000 8080
# Start server
CMD ["npm", "start"]
