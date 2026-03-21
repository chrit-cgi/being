# Voeg deze regel tijdelijk toe om de cache te breken
ARG CACHEBUST=1

# STEP 1: Use Node.js as the base image
FROM node:20-alpine

# Install system dependencies: 
# - unzip/ca-certificates for PocketBase
# - supervisor to manage multiple processes
# - curl for health checks
RUN apk add --no-cache unzip ca-certificates supervisor curl

# STEP 2: Install PocketBase (The Auth Server)
ARG PB_VERSION=0.36.7
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

# STEP 5: Configure Supervisor to run both processes
# The [supervisord] section is mandatory for the manager to start.
# nodaemon=true ensures the container doesn't exit immediately.
RUN printf "[supervisord]\n\
nodaemon=true\n\
user=root\n\
logfile=/dev/stdout\n\
logfile_maxbytes=0\n\
\n\
[program:pocketbase]\n\
command=/pb/pocketbase serve --http=0.0.0.0:8090 --dir=/pb/pb_data --publicDir=/pb/pb_public\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
\n\
[program:nodeapp]\n\
command=node /app/index.js\n\
autostart=true\n\
autorestart=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0\n\
stderr_logfile=/dev/stderr\n\
stderr_logfile_maxbytes=0\n\
" > /etc/supervisord.conf
# Expose both ports
EXPOSE 8090 3000

# Start Supervisor to launch both services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
