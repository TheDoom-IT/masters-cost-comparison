#!/bin/bash

docker build --file docker/server.Dockerfile --platform linux/amd64 -t ghcr.io/$GITHUB_NAMESPACE/server:latest .
docker build --file docker/worker.Dockerfile --platform linux/amd64 -t ghcr.io/$GITHUB_NAMESPACE/worker:latest .

echo $GITHUB_ACCESS_TOKEN | docker login ghcr.io -u $GITHUB_NAMESPACE --password-stdin

docker push ghcr.io/$GITHUB_NAMESPACE/server:latest
docker push ghcr.io/$GITHUB_NAMESPACE/worker:latest
