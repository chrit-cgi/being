# STEP 1: Use Node.js as the base image
FROM node:20-alpine

# Install system dependencies: 
# - unzip/ca-certificates for PocketBase
# - supervisor to manage multiple processes
# - curl for health checks
RUN apk add --no-cache unzip ca-certificates supervisor curl

# STEP 2: Install PocketBase (The Auth Server)
ARG PB_VERSION=0.22.21
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/
RUN mkdir -p /pb/pb_data

# STEP 3: Install Node.js Backend (The Calculation Engine)
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ .

# STEP 4: Setup Frontend (Static files served by PocketBase)
COPY public/ /pb/pb_public/

# STEP 5: Configure Supervisor
# This configures Supervisor to start and monitor both PB and Node apps.
# PocketBase handles Auth on 8090. Node handles calculations on 3000.
RUN printf "[program:pocketbase]\ncommand=/pb/pocketbase serve --http=0.0.0.0:8090 --dir=/pb/pb_data --publicDir=/pb/pb_public\n\n[program:nodeapp]\ncommand=node index.js\n" > /etc/supervisord.conf

# Expose both ports
EXPOSE 8090 3000

# Start Supervisor to launch both services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
