FROM alpine:latest

# Systeem tools
RUN apk add --no-cache unzip ca-certificates curl

# PocketBase installatie
ARG PB_VERSION=0.36.7

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip

RUN unzip /tmp/pb.zip -d /pb/

# Zorg dat de public map bestaat voor je frontend
COPY public/ /pb/pb_public/

# Poort 8090 openzetten
EXPOSE 8090

# Start PocketBase. 
# We gebruiken standaard /pb/pb_data. Zorg dat je in Sliplane een volume met die naam hebt
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/doemaarwatdata", "--publicDir=/pb/pb_public"]