#!/bin/bash

# build image if not exists
IMAGENAME='amp-pwa-buildimage'

# check that a docker image exists, otherwise build it
FOUND=$(docker images | grep -c $IMAGENAME);
if [ "$FOUND" -lt 1 ]; then
  echo "no image found - create it"
  docker build --file docker/Dockerfile --tag $IMAGENAME . ;
else
  echo "image $IMAGENAME found - skip recreation";
fi

# TODO ? check if there is already a user logged in, otherwise try to do the login

# start local hosting and watch
docker run -v "$(PWD):/app" -w "/app" -p "3000:3000" -it amp-pwa-buildimage yarn run serve:watch
