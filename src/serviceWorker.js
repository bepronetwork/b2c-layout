/* eslint-disable no-console */

const CACHE = "betprotocol-casino";
const offlineFallbackPage = "offline.html";
const { self, caches, Request, fetch } = global;

self.addEventListener("install", (event) => {
  console.log("Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      console.log("Cached offline page during install");

      return cache.add(offlineFallbackPage);
    })
  );
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch((error) => {
      // The following validates that the request was for a navigation to a new document
      if (
        event.request.destination !== "document" ||
        event.request.mode !== "navigate"
      ) {
        return null;
      }

      console.error(`Network request Failed. Serving offline page ${error}`);

      return caches.open(CACHE).then((cache) => {
        return cache.match(offlineFallbackPage);
      });
    })
  );
});

self.addEventListener("refreshOffline", () => {
  const offlinePageRequest = new Request(offlineFallbackPage);

  return fetch(offlineFallbackPage).then((response) => {
    return caches.open(CACHE).then((cache) => {
      console.log(
        `Offline page updated from refreshOffline event: ${response.url}`
      );

      return cache.put(offlinePageRequest, response);
    });
  });
});

/* eslint-enable no-console */
