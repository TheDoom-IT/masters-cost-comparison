#!/bin/bash
aws lambda update-function-code --function-name master-server --zip-file fileb://server.zip
