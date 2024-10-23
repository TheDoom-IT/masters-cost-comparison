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

# build worker
COPY ./packages/worker/package.json packages/worker/package.json
RUN npm install --workspace=packages/worker --include-workspace-root

COPY ./packages/worker/src packages/worker/src
COPY ./packages/worker/tsconfig.json packages/worker/tsconfig.json
RUN npm run build --workspace=packages/worker

RUN npm prune --omit=dev

CMD ["npm", "run", "start", "--workspace=packages/worker"]
