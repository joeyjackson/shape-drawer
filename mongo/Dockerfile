ARG BASE_VERSION=latest

FROM mongo:${BASE_VERSION}

ARG MONGO_SHELL=mongosh
ENV MONGO_SHELL=${MONGO_SHELL}
ENV MONGO_INITDB_DATABASE=admin

ADD init-mongo.sh /docker-entrypoint-initdb.d/