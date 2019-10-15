const workboxBuild = require('workbox-build');

// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild.injectManifest({
    swSrc: 'sw.js',
    swDest: 'public/sw.js',
    globDirectory: './public',
    globPatterns: ['app/**/*.{js,png,html,css,svg}'],
    maximumFileSizeToCacheInBytes: 20 *1024 * 1024
  }).then(({count, size, warnings}) => {
    // Optionally, log any warnings and details.
    warnings.forEach(console.warn);
    console.log(`${count} files will be precached, totaling ${size} bytes.`);
  });
}
buildSW();
