// setting caching
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
// files to be cached
const staticFilesToCache = [
  "/",
  "/index.html",
  "index.js",
  "styles.css",
  "manifest.json",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png"
];
// cache install
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("caching is working");
      return cache.addAll(staticFilesToCache);
    })
  );
  self.skipWaiting();
});
// deleting previous cache data
self.addEventListener("activate", function (evt) {
  caches.keys().then(keyList => {
    return Promise.all(
      keyList.map(key => {
        if (key !== CACHE_NAME && KEY !== DATA_CACHE_NAME) {
          console.log("deleting previous cache data", key);
          return caches.delete(key);
        }
      })
    );
  });
  self.clients.claim();
});
// fetch, store, api
self.addEventListener("fetch", function (evt) {
  const { url } = evt.request;
  if (url.includes("/api")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.requet)
          .then(response => {
            if (response.status === 200) {
              cache.put(ect.request, response.clone())
            }
            return response;
          })
          .catch(err => {
            return cache.match(evt.request);
          });
      })
        .catch(err => console.log(err))
    );
    return;
  }
  evt.respondWith(caches.match(evt.request).then(function (response) {
    return response || fetch(ect.request);
  })
  );
});