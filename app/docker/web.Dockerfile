FROM node:20.18.0-alpine3.19 AS builder

WORKDIR /app

# install dependencies
COPY package.json .
COPY package-lock.json .
COPY ./packages/web/package.json packages/web/package.json
COPY ./packages/shared/package.json ./packages/shared/package.json
RUN npm install --workspace=packages/web --include-workspace-root

# build shared
COPY ./packages/shared/src packages/shared/src
COPY ./packages/shared/tsconfig.json packages/shared/tsconfig.json
RUN npm run build --workspace=packages/shared

# build web
COPY ./packages/web/src packages/web/src
COPY ./packages/web/tsconfig.json packages/web/tsconfig.json
RUN npm run build --workspace=packages/web

RUN npm prune --omit=dev

FROM node:20.18.0-alpine3.19

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

COPY --from=builder /app/packages/shared/package.json /app/packages/shared/package.json
COPY --from=builder /app/packages/shared/dist /app/packages/shared/dist
COPY packages/shared/drizzle /app/packages/shared/drizzle

COPY --from=builder /app/packages/web/package.json /app/packages/web/package.json
COPY --from=builder /app/packages/web/dist /app/packages/web/dist
COPY packages/web/public /app/packages/web/public
COPY packages/web/views /app/packages/web/views


CMD ["npm", "run", "start", "--workspace=packages/web"]
