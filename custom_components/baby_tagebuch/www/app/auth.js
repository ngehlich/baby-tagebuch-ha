/* Baby-Tagebuch – Offline-App: Anmeldung bei Home Assistant und Abgleich.
   Die Daten liegen auf dem Gerät (localStorage) und werden über
   /api/baby_tagebuch/sync mit Home Assistant abgeglichen, sobald eine
   Verbindung besteht. Anmeldung über den normalen Home-Assistant-Login (OAuth). */
(function () {
  "use strict";
  window.__babyKey = "babyTagebuch.pwa.v1";
  const TK = "babyTagebuch.pwa.auth", SK = "babyTagebuch.pwa.state";
  const BASE = location.origin, CLIENT_ID = BASE + "/", REDIRECT = BASE + location.pathname;
  let auth = null, loginNeeded = false, refreshing = null, exchanging = null;
  try { auth = JSON.parse(localStorage.getItem(TK) || "null"); } catch (e) { auth = null; }
  loginNeeded = !auth;
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) {}

  function store() { try { auth ? localStorage.setItem(TK, JSON.stringify(auth)) : localStorage.removeItem(TK); } catch (e) {} }
  function authError(msg) { const e = new Error(msg || "Anmeldung nötig"); e.auth = true; return e; }
  async function fetchT(url, opt, ms) {
    const c = new AbortController(), t = setTimeout(() => c.abort(), ms || 15000);
    try { return await fetch(url, Object.assign({ cache: "no-store", credentials: "same-origin" }, opt, { signal: c.signal })); }
    finally { clearTimeout(t); }
  }
  async function token(params) {
    const r = await fetchT(BASE + "/auth/token", { method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(params).toString() });
    if (r.status === 400 || r.status === 401 || r.status === 403) throw authError("Token abgelehnt (" + r.status + ")");
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }
  function setTokens(t) {
    auth = Object.assign(auth || {}, { access_token: t.access_token, expires: Date.now() + (t.expires_in || 1800) * 1000 });
    if (t.refresh_token) auth.refresh_token = t.refresh_token;
    store(); loginNeeded = false;
  }
  function refresh() {
    if (!auth || !auth.refresh_token) { auth = null; store(); loginNeeded = true; return Promise.reject(authError()); }
    if (!refreshing) refreshing = token({ grant_type: "refresh_token", refresh_token: auth.refresh_token, client_id: CLIENT_ID })
      .then(setTokens)
      .catch(e => { if (e.auth) { auth = null; store(); loginNeeded = true; } throw e; })
      .finally(() => { refreshing = null; });
    return refreshing;
  }
  async function apiSync(payload, retried) {
    if (exchanging) await exchanging.catch(() => {});
    if (!auth) { loginNeeded = true; throw authError(); }
    if (!auth.access_token || Date.now() > (auth.expires || 0) - 60000) await refresh();
    const r = await fetchT(BASE + "/api/baby_tagebuch/sync", { method: "POST",
      headers: { "Authorization": "Bearer " + auth.access_token, "Content-Type": "application/json" },
      body: JSON.stringify(payload) }, 20000);
    if (r.status === 401) {
      if (!retried) { auth.expires = 0; return apiSync(payload, true); }
      auth = null; store(); loginNeeded = true; throw authError();
    }
    if (!r.ok) throw new Error("HTTP " + r.status);
    const res = await r.json();
    loginNeeded = false;
    return res;
  }
  function login() {
    if (navigator.onLine === false) { alert("Zum Anmelden ist eine Internetverbindung nötig. Eintragen geht trotzdem, es wird später abgeglichen."); return; }
    const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
    try { localStorage.setItem(SK, state); } catch (e) {}
    location.href = BASE + "/auth/authorize?response_type=code&client_id=" + encodeURIComponent(CLIENT_ID) +
      "&redirect_uri=" + encodeURIComponent(REDIRECT) + "&state=" + encodeURIComponent(state);
  }
  function useToken(t) {
    t = String(t || "").trim(); if (!t) return;
    auth = { access_token: t, expires: Date.now() + 3650 * 864e5, llat: true }; store(); loginNeeded = false;
    after(() => { window.render && window.render(); window.sync && window.sync(); });
  }
  function logout() {
    const rt = auth && auth.refresh_token; auth = null; store(); loginNeeded = true;
    if (rt) fetchT(BASE + "/auth/revoke", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: rt }).toString() }).catch(() => {});
  }
  function after(fn) { setTimeout(() => { try { fn(); } catch (e) {} }, 0); }

  // Rückkehr vom Home-Assistant-Login: Code gegen Token tauschen
  const q = new URLSearchParams(location.search);
  if (q.get("code")) {
    const code = q.get("code"), st = q.get("state");
    let expected = null;
    try { expected = localStorage.getItem(SK); localStorage.removeItem(SK); } catch (e) {}
    history.replaceState(null, "", location.pathname);
    if (expected && st !== expected) {
      after(() => window.toast && window.toast("Anmeldung abgebrochen – bitte erneut versuchen"));
    } else {
      exchanging = token({ grant_type: "authorization_code", code: code, client_id: CLIENT_ID })
        .then(t => {
          setTokens(t);
          after(() => { window.toast && window.toast("✓ Mit Home Assistant verbunden"); window.render && window.render(); window.sync && window.sync(); });
        })
        .catch(e => {
          console.warn("Baby-Tagebuch: Anmeldung fehlgeschlagen", e); loginNeeded = !auth;
          after(() => { window.toast && window.toast("Anmeldung fehlgeschlagen – bitte erneut versuchen"); window.render && window.render(); window.updSync && window.updSync(); });
        })
        .finally(() => { exchanging = null; });
    }
  }

  window.__babyApi = {
    kind: "pwa",
    ready: () => !!auth || !!exchanging,
    needsLogin: () => loginNeeded && !exchanging,
    login: login, logout: logout, useToken: useToken, sync: apiSync, poll: 15000,
  };

  // Service Worker: App-Dateien auf dem Gerät halten, damit sie ohne Netz startet
  if ("serviceWorker" in navigator && window.isSecureContext) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register("sw.js").catch(e => console.warn("Baby-Tagebuch: Service Worker", e));
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (hadController) after(() => window.toast && window.toast("Neue Version geladen – beim nächsten Öffnen aktiv"));
    });
  }
})();
