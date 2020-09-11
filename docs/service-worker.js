let cacheName = 'v1';
let cacheFiles = [
    './',
    './assets'
]

self.addEventListener('install', event => {
    console.log('[ServiceWorker] installed')

    event.waitUntil(

        caches.open(cacheName).then(cache => {
            console.log('[ServiceWorker] caching cacheFiles');
            return cache.addAll(cacheFiles);
        })
    )
  })

self.addEventListener('activate', event => {
    console.log('[ServiceWorker] activated')

    event.waitUntil(

        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(thisCacheName => {
                if (thisCacheName !== cacheName) {
                    console.log('[ServiceWorker] removing cached files from ', thisCacheName);
                    return cache.delete(thisCacheName);
                }
            }))
        })
    )
})
 
self.addEventListener('fetch', event => {
    console.log('[ServiceWorker] fetching', event.request.url);   

    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                console.log('[ServiceWorker] found in cache', event.request.url);
                return response;
            }

            let requestClone = event.request.clone();

            fetch(requestClone)
                .then(response => {
                    if (!response) {
                        console.log('[ServiceWorker], No response from fetch');
                        return response;
                    }

                    let responseClone = response.clone();

                    caches.open(cacheName).then(cache => {
                        cache.put(event.request, responseClone);
                        console.log('[ServiceWorker] New Data Cached', event.request.url)
                        return response;
                    })
                }).catch(err => {
                    console.log('[ServiceWorker] Error fetching and caching data', err);
                });
        }) 
    )
})