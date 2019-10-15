importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.core.setCacheNameDetails({prefix: "pre-cache"});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.precaching.precacheAndRoute([],{
  "directoryIndex": "index.html"
});

workbox.routing.registerRoute(/\/^https:\/\/fonts.googleapis.com\//, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"google-fonts-stylesheets", plugins: [] }), 'GET');
workbox.routing.registerRoute(/\/^https:\/\/fonts.gstatic.com\/#/, new workbox.strategies.CacheFirst({ "cacheName":"google-fonts-webfonts", plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] }), new workbox.expiration.Plugin({ maxEntries: 30, maxAgeSeconds: 31536000, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/\/^https:\/\/cdn.ampproject.org\//, new workbox.strategies.StaleWhileRevalidate({ "cacheName":"amp-cache", plugins: [] }), 'GET');
workbox.routing.registerNavigationRoute(
  workbox.precaching.getCacheKeyForURL('/app/index.html'), {
    whitelist: [ new RegExp('/app/.*') ]
  }
);