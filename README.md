WELCHES PROBLEM LÖST DIESES PROJEKT
===================================

PWAs Single-Page-Apps bieten eine tolle UserExperience. Leider laden sie nicht sehr schnell. Da gibt es viele Ansätze die dazu führen dass PWAs/SPAs schneller laden, aber sie werden nie so schnell laden wie zum Beispiel AMP-Seiten, die ja ggf. auch von Google gecached werden oder schon per prefetch geholt werden. 

Die Idee dieses Projekts ist es, schnelle Landingages aus AMP-Basis zu erstellen, für eine SPA/PWA die dann komplexeren Funktionaliäten wie SignIn, komplexe Screens mit clientseitigem Zustand (FLUX), third-party payment providern usw. enthält. 

LÖSUNG
======
Wir bauen einen Generator, der AMP-Pages aus einer Datenquelle - in unserem Fall einfach eine JSON-Datei - und ein paar Templates generiert. Dazu entwickeln wir eine SPA/PWA auf VueJs Basis. Auf den AMP-Seiten wird bereits ein Service-Worker installiert, der die SPA/PWA in wesentliche Teilen precached. Damit ist die SPA/PWA beim Aufruf der eigentlichen App-Url bereits im ServiceWorker Cache und damit instant da. 

Rahmendaten zur Lösung:

1. AMP-Landingpage Generator, data.json + pug-templates
1. VueJs-SPA-PWA
1. ServiceWorker mit precache der SPA/PWA
1. Firebase Hosting to host AMP-Pages and SPA/PWA App
1. Firebase Auth to use Authentication in the SPA/PWA App
1. Firebase Cloud functions to deliver content to the AMP-Pages amp-list tag (to show a logged in user on an AMP Page)
1. Das Projekt liegt public bei githund und wird automatisch gebaut bei gitlab

TODOs
=====

1. Jetzt die Integration von Cloud-Functions probieren. Dabei soll man in der VueJS-App einfach eine Liste mit Einträgen editieren können und die soll auf einem AMP-Seite gelesen werden.
1. Einen ServiceWorker mit Workbox erstellen, den ServiceWorker auf allen Seiten (/app/index.html & AMP-Serviceworker im layout) einbinden.
1. Einen Artikel in Medium schreiben

- Jetzt sollte erstmal ein Vuetify-App-Rahmen aufgesetzt werden.
- die AMP-Seiten Homepage und die andere ein wenig hübsch machen damit das mit dem Vuetify-Design hinkommt.
- und bei der ganzen Nummer der das lokale Development schön machen.
- dann layout der amp seite anpassen. Vor allem Header und Drawer inkl. Icons. Außerdem soll mal ein pug-template gemeinsam verwandt werden. Drawer fehlt noch. Sie könnten ein gemeinsames Logo verwenden. Ist überhaupt die Frage was die wirklich so teilen an Inhalten...
- Dann mal PWA precaching per AMP probieren. Showcase mit precaching sollte gehen. (Ist das nicht unnötig und könnte man auch später machen?)
- Alternativ anfangen das Lensbot Projekt auf der Basis aufzusetzen.

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
docker run -v "$PWD:/app" -w "/app" -p "5000:5000" -it amp-pwa-buildimage yarn run serve

# start local hosting + watch
docker run -v "$PWD:/app" -w "/app" --name amp-pwa -p "3000:3000" -it amp-pwa-buildimage yarn run serve:watch

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

# build the app
docker run -v "$PWD:/app" -w "/app/app" -it amp-pwa-buildimage yarn build

```
ein Image gebaut um das Projekt im Container zu bauen und zu deployen. 

Directory Structure
===================

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
