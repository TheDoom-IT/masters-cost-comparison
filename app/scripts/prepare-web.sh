#!/bin/bash
set -e

rm -rf node_modules

npm i -w=packages/web --include-workspace-root

npm run build -w=packages/shared
npm run build -w=packages/web

npm prune --omit=dev

zip -r web.zip node_modules
cd packages/web
zip -r ../../web.zip dist public views package.json
