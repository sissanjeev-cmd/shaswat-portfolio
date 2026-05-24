FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm run build


# Runtime
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy ALL node_modules from builder (important)
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

CMD ["sh","-c","npx prisma generate && npx prisma migrate deploy && node dist/server.js"]