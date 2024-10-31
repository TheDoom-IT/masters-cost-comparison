#!/bin/bash
set -e

rm -rf node_modules

npm i -w=packages/server --include-workspace-root

npm run build -w=packages/shared
npm run build -w=packages/server

npm prune --omit=dev

zip -r server.zip node_modules
cd packages/server
zip -r ../../server.zip dist public views package.json
