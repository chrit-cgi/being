# Gebruik een stabiele Node versie op Debian Bookworm (net als jouw Chromebook)
FROM node:22-bookworm-slim AS base

# 1. Install Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
# We installeren ook python3 en build-essential voor better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install

# 2. Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js build stap
RUN npm run build

# 3. Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Maak een map voor de database die we "persistent" kunnen maken
RUN mkdir -p /app/data

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Zorg dat de app weet waar de database staat via een poort of env
EXPOSE 3000

CMD ["npm", "start"]