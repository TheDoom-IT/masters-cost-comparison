FROM node:20.18.0

WORKDIR /app

# build shared
COPY package.json .
COPY package-lock.json .

COPY ./packages/shared/package.json ./packages/shared/package.json
RUN npm install --workspace=packages/shared --include-workspace-root

COPY ./packages/shared/src packages/shared/src
COPY ./packages/shared/tsconfig.json packages/shared/tsconfig.json
RUN npm run build --workspace=packages/shared
COPY ./packages/shared/drizzle packages/shared/drizzle

# build server
COPY ./packages/server/package.json packages/server/package.json
RUN npm install --workspace=packages/server --include-workspace-root

COPY ./packages/server/src packages/server/src
COPY ./packages/server/tsconfig.json packages/server/tsconfig.json
RUN npm run build --workspace=packages/server
COPY ./packages/server/public packages/server/public
COPY ./packages/server/views packages/server/views

RUN npm prune --omit=dev

CMD ["npm", "run", "start", "--workspace=packages/server"]
