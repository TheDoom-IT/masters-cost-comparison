#!/bin/sh

# --tcp-port 25565
java -jar $(dirname $0)/CMDRunner.jar --tool PerfMonAgent "$@"
