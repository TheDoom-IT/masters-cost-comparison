#!/bin/bash

# Start test plan with remote servers
# -e generate report dashboard after load test
# -f removes previous report data
# jmeter -n -t ../TestPlan.jmx -l .log.log -e -o ./report -f
jmeter -n -t TestPlan.jmx -l ./<LOG_FILE> -R 192.168.0.7,192.168.0.8 -e -o ./<REPORT_DIR>

# Create RSI SSL keys
# https://jmeter.apache.org/usermanual/remote-test.html#setup_ssl
cd jmeter/bin
./create-rmi-keystore.sh

# copy the keystore rmi_keystore.jks to directory where the server agent is started


# Running distributed tests
# master
JVM_ARGS="-Xms1g -Xmx1g" ../apache-jmeter-5.6.3/bin/jmeter -n -t ../TestPlan.jmx -l ./test-logs.log -R host1,host2 -e -o ./report

# slave
JVM_ARGS="-Xms1g -Xmx1g" ./apache-jmeter-5.6.3/bin/jmeter-server
