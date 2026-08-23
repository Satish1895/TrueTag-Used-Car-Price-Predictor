# /frontend/Dockerfile

# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run the optimized standalone build
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copy the standalone output and static assets from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]