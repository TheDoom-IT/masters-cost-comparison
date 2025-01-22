#!/bin/bash
# Scripts required to install JMeter and its plugins on a server
curl -O https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.zip
unzip apache-jmeter-5.6.3.zip

cd apache-jmeter-5.6.3/lib
curl -O https://repo1.maven.org/maven2/kg/apc/cmdrunner/2.2.1/cmdrunner-2.2.1.jar

cd ext/
curl -O https://repo1.maven.org/maven2/kg/apc/jmeter-plugins-manager/1.6/jmeter-plugins-manager-1.6.jar

cd ..
java -jar cmdrunner-2.2.1.jar --tool org.jmeterplugins.repository.PluginManagerCMD install jpgc-casutg
java -jar cmdrunner-2.2.1.jar --tool org.jmeterplugins.repository.PluginManagerCMD install jpgc-perfmon

