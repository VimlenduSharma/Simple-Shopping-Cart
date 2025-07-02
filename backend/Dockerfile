# ─────────────────────────── Stage 1 : Build ───────────────────────────
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# 1. system deps *********************************************************
RUN apk add --no-cache \
      openssl1.1-compat  \
      libstdc++

# 2. copy manifests + prisma schema (needed for @prisma/client postinstall)
COPY package.json package-lock.json ./
COPY prisma ./prisma

# 3. install deps (generates Prisma Client)
RUN npm ci

# 4. copy source & compile
COPY src ./src
COPY tsconfig*.json ./
RUN npm run build

# ─────────────────────────── Stage 2 : Runtime ─────────────────────────
FROM node:18-alpine

# 1. system deps again (runtime stage)
RUN apk add --no-cache \
      openssl1.1-compat  \
      libstdc++

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev     # prod deps only

# copy prisma client & schema generated in builder
COPY --from=builder /usr/src/app/node_modules/.prisma  /usr/src/app/node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma  /usr/src/app/node_modules/@prisma
COPY --from=builder /usr/src/app/prisma                ./prisma

# compiled JS
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/server.js"]
