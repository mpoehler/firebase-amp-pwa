DER PLAN
========

1. Erstmal den AMP-Generator aus dem klv Projekt rüberholen. Aus dem data.json und den pug templates sollen statische Seiten entstehen.
1. Dann ist vielleicht ein gute Zeitpunkt das Projekt mal bei github anzulegen, mirror zu gitlab und auf einem firebase projekt zu deployen.
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

```
ein Image gebaut um das Projekt im Container zu bauen und zu deployen. 

Konkrete Next Steps:
- Firebase config, gitlab connect, push-to-deploy
- Danach VueJs

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



