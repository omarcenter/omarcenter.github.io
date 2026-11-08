'use strict';

const cacheName = 'omar-ps5-20261108-v1';
const scope = self.registration.scope;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const manifest = await fetch(new URL('offline.appcache', scope), {cache: 'reload'});
    if (!manifest.ok) throw new Error('Offline file list unavailable');
    const section = (await manifest.text()).split('CACHE:')[1].split('NETWORK:')[0];
    const paths = section.split(/\r?\n/).map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
    const cache = await caches.open(cacheName);
    try {
      await cache.addAll(paths.map(path => new Request(new URL(path, scope), {cache: 'reload'})));
    } catch (error) {
      await caches.delete(cacheName);
      throw error;
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith('omar-ps5-') && name !== cacheName) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return (await cache.match(event.request)) || fetch(event.request);
  })());
});
