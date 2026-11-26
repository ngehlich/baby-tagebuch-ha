/* Baby-Tagebuch – Service Worker: hält die App-Dateien auf dem Gerät.
   Daten und Anmeldung (/api, /auth) laufen nie über diesen Cache. */
const VERSION = "1.1.0";
const CACHE = "baby-tagebuch-" + VERSION;
const ASSETS = ["index.html", "auth.js", "app.js", "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS.map((a) => new Request(a, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("baby-tagebuch-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url), scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const key = req.mode === "navigate" ? new URL("index.html", scope).href : url.origin + url.pathname;
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const hit = await c.match(key);
      if (hit) return hit;
      try {
        return await fetch(req);
      } catch (err) {
        return new Response("Offline – bitte die App einmal mit Verbindung öffnen.", {
          status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })
  );
});
