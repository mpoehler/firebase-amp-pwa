FROM node:12.13-alpine

# needed for auth callback when using firebase login
EXPOSE 9005
# used for firebase serve (hosting)
EXPOSE 5000
# used for firebase serve (functions emulator)
EXPOSE 5001
# used for vuejs serve
EXPOSE 8080
# used for browsersync proxy
EXPOSE 3000

# This is needed for npm packages like imagemin-cli
RUN apk add --update --no-cache make g++ automake autoconf libtool nasm libpng-dev curl python
# And install of firebase tools is also needed
RUN npm install -g firebase-tools@^7.8.1
# add vue support
RUN yarn global add @vue/cli @vue/cli-service-global 

