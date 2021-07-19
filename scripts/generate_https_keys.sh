#!/bin/bash
mkdir -p ./keys/
cd ./keys/
echo "What is your local IP address?  Try ifconfig command."
read ipaddr
mkcert $ipaddr

echo "Renaming keys to server.crt (certificate) and server.pem (key)"
mv ./$ipaddr.pem ./server.crt
mv ./$ipaddr-key.pem ./server.pem
echo "Done, contents of ./keys directory:"
ls 
