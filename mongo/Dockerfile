ARG BASE_VERSION=latest
ARG MONGO_SHELL=mongosh

FROM mongo:${BASE_VERSION}

ENV MONGO_SHELL=${MONGO_SHELL}
ENV MONGO_INITDB_DATABASE=admin

ADD init-mongo.sh /docker-entrypoint-initdb.d/