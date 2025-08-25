# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy everything
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS (outputs dist/)
RUN yarn build


# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled code
COPY --from=builder /app/dist ./dist

# Copy Prisma client & schema
COPY --from=builder /app/prisma ./prisma

# Expose NestJS port
EXPOSE 3000

# Start app
CMD ["yarn", "start:prod"]
