FROM node:22-bookworm-slim AS base
WORKDIR /app

# 1. Dependencies
FROM base AS deps
COPY package*.json ./
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install

# 2. Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Runner
FROM base AS runner
ENV NODE_ENV production

# Maak de map aan en zorg dat de 'node' gebruiker erbij kan
RUN mkdir -p /app/data && chown -R node:node /app/data

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Gebruik de 'node' gebruiker voor veiligheid en schrijf-rechten
USER node

EXPOSE 3000
CMD ["npm", "start"]