#!/bin/sh
# Scripts to install Java on a server

# Ubuntu
apt install default-jre -y

# Amazon Linux
sudo yum install java-21-amazon-corretto-headless -y
