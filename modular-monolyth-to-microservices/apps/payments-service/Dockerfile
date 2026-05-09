# Build context: monorepo root
# docker build -f apps/payments-service/Dockerfile -t payments-service:latest .

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nest build payments-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist/apps/payments-service ./dist/apps/payments-service
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/apps/payments-service/apps/payments-service/src/main"]
