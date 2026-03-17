# STAP 1: Bouw de Frontend (Vite)
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# STAP 2: Zet de Backend (Node.js) klaar
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# STAP 3: Combineer alles
# Kopieer de gebouwde frontend bestanden naar de public map van de backend
COPY --from=build-frontend /app/frontend/dist ./public

# Start de server
EXPOSE 3000
CMD ["node", "index.js"]

