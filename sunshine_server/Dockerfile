<<<<<<< HEAD
FROM acmeuniverse/sunshine:v2
# FROM registry.gitlab.com/stage-ai/sunshine/sunshine/golang:1.15-latest

LABEL organization="stageai"
LABEL maintainer="vladimiroff"
=======
FROM golang:latest 
# LABEL organization="stageai"
# LABEL maintainer="vladimiroff"
>>>>>>> main

ENV GOPROXY https://proxy.golang.org,direct

ENV ENV="/etc/profile"
ENV GO111MODULE=on
# ENV GOPRIVATE stageai.tech
ENV SUNSHINE_ENV k8s

USER root
<<<<<<< HEAD
# RUN chown -R stageai:stageai /data
RUN mkdir /data && chown -R stageai:stageai /data

# TODO: copy to a clean pandoc:xetex image
USER stageai
COPY --chown=stageai . /home/stageai/sunshine
WORKDIR /home/stageai/sunshine
# RUN go get github.com/pressly/goose/v3/cmd/goose


RUN make build

ENTRYPOINT ["/home/stageai/sunshine/k8s/entrypoint.sh"]

# FROM registry.gitlab.com/stage-ai/sunshine/sunshine/golang:1.15-latest

# LABEL organization="stageai"
# LABEL maintainer="vladimiroff"

# ENV GOPROXY https://proxy.golang.org,direct
# ENV GOPRIVATE stageai.tech
# ENV SUNSHINE_ENV k8s

# USER root
# RUN mkdir /data && chown -R stageai:stageai /data

# # TODO: copy to a clean pandoc:xetex image
# USER stageai
# COPY --chown=stageai . /home/stageai/sunshine
# WORKDIR /home/stageai/sunshine
# RUN make build
# ENTRYPOINT ["/home/stageai/sunshine/k8s/entrypoint.sh"]
=======
RUN mkdir /data && chown -R root:root /data

# TODO: copy to a clean pandoc:xetex image
USER root
COPY --chown=root . /home/ubuntu/go/src/sunshine_server

WORKDIR /home/ubuntu/go/src/sunshine_server

RUN make build
ENTRYPOINT ["/home/ubuntu/go/src/sunshine_server/k8s/entrypoint.sh"]
#ENTRYPOINT ["/home/stageai/sunshine/k8s/entrypoint.sh"]
>>>>>>> main
