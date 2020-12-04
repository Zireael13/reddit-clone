#!/bin/bash

echo Version?
read VERSION

docker build -t zireael13/readit:$VERSION .
docker push zireael13/readit:$VERSION

cd ~/.ssh

ssh -i digitalocean root@167.172.140.37 "docker pull zireael13/readit:$VERSION && docker tag zireael13/readit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"