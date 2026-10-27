// Service Worker for Umair Farooqui Portfolio (PWA)
const CACHE_NAME = "umair-portfolio-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./bg1.png",
  "./problem-x.png",
  "./pro-1.png",
  "./pro-2.png",
  "./pro-3.png",
  "./javascript.svg",
  "./html-5.png",
  "./css-3.png",
  "./NODE JS.png",
  "./mysql.png",
  "./MY_Resume.pdf"
];

// Install Event - Pre-cache core files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Some assets could not be pre-cached:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-while-revalidate for local assets, network-first for external APIs
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Don't cache API requests or chrome-extension schemes
  if (url.origin.includes("api.github.com") || url.origin.includes("api.web3forms.com") || !event.request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch new version in background (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {/* Ignore offline network errors */});
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Fallback for HTML documents if offline
        if (event.request.destination === "document") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
