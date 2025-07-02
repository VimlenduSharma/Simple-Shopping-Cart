FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# 1️⃣  Copy package manifests first (for layer caching)
COPY package.json package-lock.json ./

COPY prisma ./prisma

RUN npm ci

# 4️⃣  Copy the rest of the source and compile TS → dist/
COPY src ./src
COPY tsconfig*.json ./
RUN npm run build


FROM node:18-alpine

WORKDIR /usr/src/app

# Only production deps
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Prisma Client (already generated in the builder stage)
COPY --from=builder /usr/src/app/node_modules/.prisma /usr/src/app/node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma /usr/src/app/node_modules/@prisma

# Schema (optional, useful for introspection at runtime)
COPY --from=builder /usr/src/app/prisma ./prisma

# Compiled JS
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/server.js"]
