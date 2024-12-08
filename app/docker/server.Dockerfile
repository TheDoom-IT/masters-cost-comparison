FROM node:20.18.0-alpine3.19 AS builder

WORKDIR /app

# install dependencies
COPY package.json .
COPY package-lock.json .
COPY ./packages/server/package.json packages/server/package.json
COPY ./packages/shared/package.json ./packages/shared/package.json
RUN npm install --workspace=packages/server --include-workspace-root

# build shared
COPY ./packages/shared/src packages/shared/src
COPY ./packages/shared/tsconfig.json packages/shared/tsconfig.json
RUN npm run build --workspace=packages/shared

# build server
COPY ./packages/server/src packages/server/src
COPY ./packages/server/tsconfig.json packages/server/tsconfig.json
RUN npm run build --workspace=packages/server

RUN npm prune --omit=dev

FROM node:20.18.0-alpine3.19

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

COPY --from=builder /app/packages/shared/package.json /app/packages/shared/package.json
COPY --from=builder /app/packages/shared/dist /app/packages/shared/dist
COPY packages/shared/drizzle /app/packages/shared/drizzle

COPY --from=builder /app/packages/server/package.json /app/packages/server/package.json
COPY --from=builder /app/packages/server/dist /app/packages/server/dist
COPY packages/server/public /app/packages/server/public
COPY packages/server/views /app/packages/server/views


CMD ["npm", "run", "start", "--workspace=packages/server"]
