# ───────────────────────── Stage 1 : Build ────────────────────────
FROM node:18-bullseye-slim AS builder

WORKDIR /usr/src/app

# copy manifests + prisma first
COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci                

# copy source & build
COPY src ./src
COPY tsconfig*.json ./
RUN npm run build

# ───────────────────────── Stage 2 : Runtime ──────────────────────
FROM node:18-bullseye-slim    

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev          # prod deps only

# prisma client + schema
COPY --from=builder /usr/src/app/node_modules/.prisma  /usr/src/app/node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma  /usr/src/app/node_modules/@prisma
COPY --from=builder /usr/src/app/prisma                ./prisma

# compiled JS
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/server.js"]
