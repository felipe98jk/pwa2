  // Versión del caché
  const CACHE_VERSION = 'v2';
  
  // Lista de recursos para cachear
  const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png',
    '/images/producto1.jpg',
    '/images/producto2.jpg',
    '/manifest.json'
  ];
  
  // Instalación del Service Worker
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_VERSION).then((cache) => {
        return cache.addAll(CACHE_ASSETS);
      })
    );
  });
  
  // Activación del Service Worker
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_VERSION) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  // Estrategia de caché: Cache First, luego Network
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((fetchResponse) => {
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }
          const responseToCache = fetchResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return fetchResponse;
        });
      })
    );
  });
  
  // Sincronización en segundo plano
  self.addEventListener('sync', (event) => {
    if (event.tag === 'sincronizar-datos') {
      event.waitUntil(sincronizarDatos());
    }
  });
  
  function sincronizarDatos() {
    // Implementar lógica de sincronización aquí
    console.log('Sincronización de datos en segundo plano');
  }
  
  // Notificaciones push
  self.addEventListener('push', (event) => {
    const opciones = {
      body: event.data.text(),
      icon: '/images/icon-192x192.png',
      badge: '/images/icon-192x192.png'
    };
  
    event.waitUntil(
      self.registration.showNotification('Notificación de Mi PWA', opciones)
    );
  });