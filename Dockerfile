FROM node:22-slim

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application source
COPY . .

# Build Vite frontend to dist/
RUN npm run build

# Expose port and configure environment
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

# Start server
CMD ["node", "server.ts"]
