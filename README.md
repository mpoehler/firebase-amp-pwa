WELCHES PROBLEM LÖST DIESES PROJEKT
===================================

PWAs Single-Page-Apps bieten eine tolle UserExperience. Leider laden sie nicht sehr schnell. Da gibt es viele Ansätze die dazu führen dass PWAs/SPAs schneller laden, aber sie werden nie so schnell laden wie zum Beispiel AMP-Seiten, die ja ggf. auch von Google gecached werden oder schon per prefetch geholt werden. 

Die Idee dieses Projekts ist es, schnelle Landingages aus AMP-Basis zu erstellen, für eine SPA/PWA die dann komplexeren Funktionaliäten wie SignIn, komplexe Screens mit clientseitigem Zustand (FLUX), third-party payment providern usw. enthält. Beim Laden der AMP-Seiten soll ein ServiceWorker installiert werden, der die App bereits in den Cache lädt.

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
1. Das Projekt liegt public bei github und wird automatisch gebaut bei gitlab

TODOs
=====

1. Jetzt die Integration von Cloud-Functions probieren. Dabei soll man sich in der VueJS-App einloggen können. Der Login-Zustand soll dann per AMP-List auf den AMP-Seiten eingeblendet werden können.
1. Einen ServiceWorker mit Workbox erstellen, den ServiceWorker auf allen Seiten (/app/index.html & AMP-Serviceworker im layout) einbinden.
1. passwordless login könnte man noch einbauen. 
1. Google Analytics ist auf jeden Fall noch ein wichtiges Thema. Da also den GTM einbauen in der App und auch auf den AMP Seiten. Dazu könnte man dann später die KPIs definieren und in einem dedizierten Dashboard über Google Datastudio auswerfen.
1. Einen Artikel in Medium schreiben

- Dann mal PWA precaching per AMP probieren. Showcase mit precaching sollte gehen. (Ist das nicht unnötig und könnte man auch später machen?)
- Alternativ anfangen das Lensbot Projekt auf der Basis aufzusetzen. (später, vorher noch Login rund machen - und was ist noch zu klären???)
- Datenübergabe der Landingpage an die App könnte man auch noch konstruieren. Hier könnte man einen Hosenshop simulieren, man soll seine Hose und seine Größe angeben. Dann wird man auf die App weitergeleitet und die muss die Daten dann erstmal in den VUEX ablegen und dann ggf. auf das Login weiterleiten. Das könnte man eigentlich in einem Guard machen, oder? Der checkt einfach die Request-Parameter (geht das auch bei POST?) und legt die ggf. in den VUEX ab. Spätere Formulare werden da dann einfach dran gebunden. 
- Analytics ist vorher noch zu klären. 
  Bei dem späteren Lensbot Projekt ist es ja so, dass die Leute aus unterschiedlichen Quellen auf den AMP-Landingpages landen. Dort geben sie ihre Daten ein und werden dann in die App geschickt, in der sie sich erstmal anmelden müssen. Nach der Anmeldung müssen die Leute ihre Zahlungsdaten eingeben und bekommen dann nochmal ein Summary ihrer Bestellung angezeigt. Das ist also ein klassischer Funnel, der nach Quelle(SEM-Kampagne, SEO, usw) aufgesplittert werden muss.
- payment provider mache ich dann erst im Lensbot projekt
- Man könnte noch die Begrüßungsemail verschicken. 
- 

TODO Next
=========

Die Daten aus dem Formular werden im store gespeichert. Die müssten auf der Seite nach dem Login angezeigt werden.

Ich hab' dann noch mit 
```
# build the image
cd docker
docker build -t amp-pwa-buildimage .

# do the login in the image
cd ..
docker run -p 9005:9005 -v "$PWD:/app" -w "/app" --name amp-pwa -it amp-pwa-buildimage firebase login

# persist container state
docker commit amp-pwa amp-pwa-buildimage

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
