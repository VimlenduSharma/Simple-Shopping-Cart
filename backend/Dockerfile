# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

# Install build-time deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build          # compiles TS → dist/

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Runtime
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine

# Only prod dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy the compiled JS, Prisma client, and Prisma schema
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma

COPY --from=builder /usr/src/app/prisma/seed.ts ./prisma/seed.ts

# Expose API port
EXPOSE 4000

# Default start command
CMD ["node", "dist/server.js"]
