FROM node:20.18.0-alpine3.19 AS builder

WORKDIR /app

# install dependencies
COPY package.json .
COPY package-lock.json .
COPY ./packages/shared/package.json ./packages/shared/package.json
COPY ./packages/worker/package.json packages/worker/package.json
RUN npm install --workspace=packages/worker --include-workspace-root

# build shared
COPY ./packages/shared/src packages/shared/src
COPY ./packages/shared/tsconfig.json packages/shared/tsconfig.json
RUN npm run build --workspace=packages/shared

# build worker
COPY ./packages/worker/src packages/worker/src
COPY ./packages/worker/tsconfig.json packages/worker/tsconfig.json
RUN npm run build --workspace=packages/worker

RUN npm prune --omit=dev

FROM node:20.18.0-alpine3.19

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

COPY --from=builder /app/packages/shared/package.json /app/packages/shared/package.json
COPY --from=builder /app/packages/shared/dist /app/packages/shared/dist

COPY --from=builder /app/packages/worker/package.json /app/packages/worker/package.json
COPY --from=builder /app/packages/worker/dist /app/packages/worker/dist

CMD ["npm", "run", "start", "--workspace=packages/worker"]
