# Build context: monorepo root
# docker build -f apps/api-gateway/Dockerfile -t api-gateway:latest .

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx nest build api-gateway

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist/apps/api-gateway ./dist/apps/api-gateway
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/apps/api-gateway/apps/api-gateway/src/main"]
