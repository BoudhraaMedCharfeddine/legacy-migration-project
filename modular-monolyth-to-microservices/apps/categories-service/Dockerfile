# Build context: monorepo root
# docker build -f apps/categories-service/Dockerfile -t categories-service:latest .

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nest build categories-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist/apps/categories-service ./dist/apps/categories-service
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/apps/categories-service/apps/categories-service/src/main"]
