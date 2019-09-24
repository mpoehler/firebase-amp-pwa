DER PLAN
========

1. Erstmal den AMP-Generator aus dem klv Projekt rüberholen. Aus dem data.json und den pug templates sollen statische Seiten entstehen. DONE.
1. Dann ist vielleicht ein gute Zeitpunkt das Projekt mal bei github anzulegen, mirror zu gitlab und auf einem firebase projekt zu deployen. DONE.
1. Eine VueJS App erstellen, die im Unterverzeichnis /app wohnt
1. Jetzt die Integration von Cloud-Functions probieren. Dabei soll man in der VueJS-App einfach eine Liste mit Einträgen editieren können und die soll auf einem AMP-Seite gelesen werden.
1. Einen ServiceWorker mit Workbox erstellen, den ServiceWorker auf allen Seiten (/app/index.html & AMP-Serviceworker im layout) einbinden.
1. Einen Artikel in Medium schreiben


Ich hab' dann noch mit 
```
# build the image
cd docker
docker build -t amp-pwa-buildimage .

# do the login in the image
cd ..
docker run -p 9005:9005 -v "$PWD:/app" -w "/app" -it amp-pwa-buildimage firebase login

# persist container state
docker commit `docker ps -n 1 | grep -v '^CONTAINER' | awk '{ print $1 }'` amp-pwa-buildimage

# select/init project 
docker run -p 9005:9005 -v "$PWD:/app" -w "/app" -it amp-pwa-buildimage firebase init

# generate a FIREBASE_TOKEN for use with gitlab runner
docker run -p 9005:9005 -v "$PWD:/app" -w "/app" -it amp-pwa-buildimage firebase login:ci

# start hosting local
docker run -v "$PWD:/app" -w "/app" -p "5000:5000" -it amp-pwa-buildimage npm run serve

# start local hosting + watch
docker run -v "$PWD:/app" -w "/app" -p "5000:5000" -it amp-pwa-buildimage npm run serve:watch

# create a project in app with vue-cli
# first install vue-cli and commit 
docker run -v "$PWD:/app" -w "/app" -it amp-pwa-buildimage yarn global add @vue/cli
docker commit `docker ps -n 1 | grep -v '^CONTAINER' | awk '{ print $1 }'` amp-pwa-buildimage
docker run -v "$PWD:/app" -w "/app/app" -p "8080:8080" -it amp-pwa-buildimage yarn global add @vue/cli-service-global
docker commit `docker ps -n 1 | grep -v '^CONTAINER' | awk '{ print $1 }'` amp-pwa-buildimage

# then create the project
docker run -v "$PWD:/app" -w "/app" -it amp-pwa-buildimage vue create app

# then run the vue app
docker run -v "$PWD:/app" -w "/app/app" -p "8080:8080" -it amp-pwa-buildimage yarn serve

# add vuetifiy
docker run -v "$PWD:/app" -w "/app/app" -it amp-pwa-buildimage vue add vuetify

```
ein Image gebaut um das Projekt im Container zu bauen und zu deployen. 

Konkrete Next Steps:
- das lokale Entwickeln für die AMP-Landingpage und die VueJS App muss noch gemacht werden. Mit Hot-Reloading und BrowserSync alles hübsch und schnell. Vielleicht sollte ich das noch vor dem VueJS einschieben. Das ist jetzt so einigermaßen fertig. Man kann mit **serve:watch** einen kompletten Build machen und dann werden scss, images überwacht - was jetzt noch fehlt ist ein watch mode bei createPages. Das wäre schon fein. DONE (So einigermaßen)
- Jetzt VueJs-Vuetify aufsetzen
- die AMP-Seiten Homepage und die andere ein wenig hübsch machen damit das mit dem Vuetify-Design hinkommt.
- und bei der ganzen Nummer der das lokale Development schön machen.


Offene Punkte:
- In der App würde ich gerne Vuetify benutzen. Es wäre eigentlich cool, wenn ich die Styles aus dem Vuetify projekt benutzen könnte in den AMP-Seiten. Sozusagen den gleichen Theme benutzen. Dazu muss man sich mal angucken wie da die Styles benutzt werden. Also eigentlich eine Vuetify a la Carte installation, bei der dann das AMP-Projekt sein styles zieht. Das bedeutet auch, dass das App-Projekt vor den AMP Seiten gebaut werden muss. Also erstmal eine App mit Vuetify bauen und dann mal gucken, ob man die Styles in den AMP Seiten nutzen kann. Das führt allerdings auch zu Abhängigkeiten bei den AMP-Seiten zu dem Vuetify Projekt - das ist nicht so schön. Man kann ja auch das Aussehen der Elemente auf den AMP-Seiten manuell dem Look-and-Feel von Vuetify anpassen. Das ist zwar etwas Arbeit, aber man verwässert so nicht die AMP-Seiten und hat keine Abhängigkeiten. Nach einer Nacht drüber schlafen: Ja, das sollte man wirklich nur optisch angleichen und keine Abhängigkeiten erzeugen.


Directory Structure
-------------------

- **data**: contains data to generate the static AMP Pages. 
- **generated**: contains intermediate results that occur during the build process.
- **images**: contains potentially unoptimized footage. Optimized during build and copied to /public/images.
- **inline-data**: contains content that is loaded inline into the pages during builds. This can be Json data or images.
- **public**: This folder contains the result of the build.
- **pug**: all PUG templates
- **static**: This folder contains all contents which should be copied statically into the public folder.


Build Process
-------------

1. Every build starts with a clean, cleaning the public and generated directories. (**clean**)
1. Then the static folder is copied into the public folder. Subsequent processes can overwrite copied files here if necessary. (**build:static**)
1. Then the images from the image folder are optimized and copied into the public/img folder. (**build:images**)
1. Optimized CSS files are generated from the SCSS, which are later integrated inline into the pages. (**build:scss, build:postcss**)
1. Now the AMP pages can be created from the PUG templates and the data.json as well as other sources if necessary. (**build:createPages**)



