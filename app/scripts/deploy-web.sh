#!/bin/bash
aws lambda update-function-code --function-name master-web --zip-file fileb://web.zip
