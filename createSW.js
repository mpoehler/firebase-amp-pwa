// Inside of build.js:
const {generateSW} = require('workbox-build');

const swDest = './public/sw.js';
generateSW({
  swDest,
  globDirectory: './public',
  globPatterns: ['app/**/*.{js,png,html,css,svg}'],    // precache app content
  navigateFallback: '/app/index.html',
  importWorkboxFrom: 'local',
  cacheId: 'pre-cache',
  directoryIndex: 'index.html',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  runtimeCaching: [{
    urlPattern: new RegExp('/^https:\/\/fonts\.googleapis\.com/'),
    handler: 'StaleWhileRevalidate',
    options: {
        cacheName: 'google-fonts-stylesheets'
    }
  },{
    urlPattern: new RegExp('/^https:\/\/fonts\.gstatic\.com/#'),
    handler: 'CacheFirst',
    options: {
        cacheName: 'google-fonts-webfonts',
        cacheableResponse: {
            statuses: [0, 200]
        },
        expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365
        }
    }
  },{
    urlPattern: new RegExp('/^https:\/\/cdn\.ampproject\.org/'),
    handler: 'StaleWhileRevalidate',
    options: {
        cacheName: 'amp-cache'
    }
  }
],
  // Other configuration options...
}).then(({count, size}) => {
  console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
});