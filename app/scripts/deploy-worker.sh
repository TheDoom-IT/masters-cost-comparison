#!/bin/bash
aws lambda update-function-code --function-name master-worker --zip-file fileb://worker.zip
