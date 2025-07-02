# ─────────────────────────── Stage 1 : Build ───────────────────────────
FROM node:18-slim AS builder

WORKDIR /usr/src/app

# 1. Copy manifests + Prisma schema first (layer caching + prisma generate)
COPY package.json package-lock.json ./
COPY prisma ./prisma

# 2. Install all deps (prisma generate runs here)
RUN npm ci

# 3. Copy source & compile TS → dist
COPY src ./src
COPY tsconfig*.json ./
RUN npm run build

# ─────────────────────────── Stage 2 : Runtime ─────────────────────────
FROM node:18-slim

WORKDIR /usr/src/app

# 1. Prod deps only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 2. Copy Prisma client (generated in builder)
COPY --from=builder /usr/src/app/node_modules/.prisma  /usr/src/app/node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma  /usr/src/app/node_modules/@prisma

# 3. Copy compiled JS & schema
COPY --from=builder /usr/src/app/dist    ./dist
COPY --from=builder /usr/src/app/prisma  ./prisma

EXPOSE 4000
CMD ["node", "dist/server.js"]
