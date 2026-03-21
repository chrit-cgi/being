# STAP 1: Bouw de Frontend (Vite)
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# STAP 2: Zet de Backend klaar
FROM node:20-alpine
WORKDIR /app

# Kopieer package files van de backend naar de huidige map (/app)
COPY backend/package*.json ./

# Installeer de modules DIRECT in /app
RUN npm install --production

# Kopieer de rest van de backend code naar /app
COPY backend/ .

# STAP 3: Combineer frontend
# Zorg dat de frontend 'dist' in de 'public' map van de backend komt
COPY --from=build-frontend /app/frontend/dist ./public

EXPOSE 3000
CMD ["node", "index.js"]