# Build context: monorepo root
# docker build -f apps/products-service/Dockerfile -t products-service:latest .

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nest build products-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist/apps/products-service ./dist/apps/products-service
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/apps/products-service/apps/products-service/src/main"]
