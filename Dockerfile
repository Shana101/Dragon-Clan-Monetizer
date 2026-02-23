FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
# Install production deps only
RUN npm ci --omit=dev
EXPOSE 5050
ENV NODE_ENV=production
ENV PORT=5050
CMD ["node", "dist/index.cjs"]
