#!/bin/sh

# Start the PerfMon Agent on a server

# --tcp-port specified on which port the agent will listen for incoming connections
java -jar $(dirname $0)/CMDRunner.jar --tool PerfMonAgent "$@" --tcp-port 25565
