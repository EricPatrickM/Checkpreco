FROM --platform=$BUILDPLATFORM python:3.10-alpine AS builder
ARG FLASK_APP FLASK_APP
ARG FLASK_ENV FLASK_ENV

ENV FLASK_APP=$FLASK_APP
ENV FLASK_ENV=$FLASK_ENV

WORKDIR /code
COPY requirements.txt .
RUN pip3 install -r requirements.txt

FROM builder as dev-envs
RUN <<EOF
apk update
apk add git
EOF
RUN <<EOF
addgroup -S docker
adduser -S --shell /bin/bash --ingroup docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /