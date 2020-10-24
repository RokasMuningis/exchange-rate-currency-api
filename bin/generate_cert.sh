#!bash

openssl req -nodes -new -x509 -keyout config/cert/server.key -out config/cert/server.cert -subj "/C=LT/ST=Vilnius/L=Vilnius/O=Mega Evil Corp./CN=localhost"