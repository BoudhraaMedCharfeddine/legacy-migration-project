# Build context: monorepo root
# docker build -f apps/orders-service/Dockerfile -t orders-service:latest .

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nest build orders-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist/apps/orders-service ./dist/apps/orders-service
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/apps/orders-service/apps/orders-service/src/main"]
