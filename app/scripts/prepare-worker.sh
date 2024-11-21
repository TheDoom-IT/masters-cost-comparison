#!/bin/bash
set -e

rm -rf node_modules

npm i -w=packages/worker --include-workspace-root

npm run build -w=packages/shared
npm run build -w=packages/worker

npm prune --omit=dev

zip -r worker.zip node_modules
cd packages/worker
zip -r ../../worker.zip dist package.json
