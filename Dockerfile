FROM alpine:latest

# Systeem tools
RUN apk add --no-cache unzip ca-certificates curl

# PocketBase installatie
# ARG PB_VERSION=0.36.7
# ADD
# https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip
# /tmp/pb.zip

ADD https://github.com/pocketbase/pocketbase/releases#:~:text=pocketbase_0.36.7_linux_arm64.zip/tmp/pb.zip

RUN unzip /tmp/pb.zip -d /pb/

# Zorg dat de public map bestaat voor je frontend
COPY public/ /pb/pb_public/

# Poort 8090 openzetten
EXPOSE 8090

# Start PocketBase. 
# We gebruiken /pb/pb_data. Zorg dat je in Sliplane een volume 
# koppelt aan dit pad voor persistentie.
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data", "--publicDir=/pb/pb_public"]

