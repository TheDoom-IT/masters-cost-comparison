# Test web application

This directory contains Node.js application consisting
of two building blocks:
- server - web server build over Fastify framework
- worker - responsible for processing background jobs. On dedicated
    server environment, it is implemented using `pg-boss` library, while
    on AWS Lambda environment, it is implemented using AWS SQS.

## Requirements
- Node.js 20.18.1
- Docker
- Docker Compose

## How to run?
1. Prepare environment variable file `.env` based on `.env.dist` file. Place
    it in the root directory of the project and in `packages/server`, `packages/worker`.
2. Run `docker-compose up -d` to start local PostgreSQL instance.
3. Run `npm install` to install dependencies.
4. Run `npm run build -w shared` to build shared package
    or `npm run dev -w shared` to enable watch mode.
5. Run `npm run dev -w server` to start web server.
6. Run `npm run dev -w worker` to start worker.

## Packages
The application is build using NPM workspaces. All packages
are stored in `packages` directory:
- `server` - contains web server code
- `worker` - contains worker code
- `shared` - contains code shared between `server` and `worker` (e.g. database models)

## Deployment
The application can be deployed using either AWS Lambda .zip file archives
or Docker containers.

To deploy .zip file archives run:
```bash
# prepare file archives
./scripts/prepare-server.sh
./scripts/prepare-worker.sh

# deploy to AWS
./scripts/deploy-server.sh
./scripts/deploy-worker.sh
```

To deploy Docker containers run:
```bash
# build and push Docker images
./scripts/build-server.sh
```
Containers are pushed to GitHub Container Registry.
To successfully push images, you need to have GITHUB_ACCESS_TOKEN
and GITHUB_NAMESPACE environment variables exported.
You can read more about how to access GitHub Container Registry
[here](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).
