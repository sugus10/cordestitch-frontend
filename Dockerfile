# Stage 1: Dependencies
FROM node:20 AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install platform-specific native modules
RUN npm install --os=linux --cpu=x64 sharp
RUN npm install --platform=linux-x64 lightningcss
RUN npm install --platform=linux-x64 @tailwindcss/oxide

# Stage 2: Builder
FROM node:20 AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Rebuild ALL native modules for the current platform
RUN npm rebuild

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Runner
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install minimal runtime dependencies
RUN apt-get update && apt-get install -y \
    --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Add a non-root user to run the app
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nextjs

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
