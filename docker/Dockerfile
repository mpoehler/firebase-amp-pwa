FROM node:10.16.0-alpine

# needed for auth callback when using firebase login
EXPOSE 9005
# used for firebase serve (hosting)
EXPOSE 5000
# used for firebase serve (functions emulator)
EXPOSE 5001
# used for vuejs serve
EXPOSE 8080 

# This is needed for npm packages like imagemin-cli
RUN apk add --update --no-cache make g++ automake autoconf libtool nasm libpng-dev
# And install of firebase tools is also needed
RUN npm install -g firebase-tools@^7.3.2

# Some post building instructions
RUN echo "Image was build, now configure the image to use your firebase project:"
RUN echo ""
