// エニクック スケジュール Service Worker
// 画面ファイルだけをキャッシュし、電波が悪いときも起動できるようにする。
// 予定データ（Firebase）とログインは常にネットから取得するので、ここでは扱わない。
const CACHE = 'anycook-schedule-v2';
const SHELL = [
  './factory_schedule.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 同じサイトのファイルはネット優先（更新がすぐ反映される）、つながらないときだけキャッシュを使う
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then(hit => hit || (req.mode === 'navigate' ? caches.match('./factory_schedule.html') : undefined)))
  );
});
