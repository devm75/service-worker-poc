const CACHE_NAME = 'todo-api-cache-v1';
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Install event - Cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // You can cache other static resources here if necessary
            return cache.addAll(['/']); // Cache the homepage
        })
    );
});

// Fetch event - Intercept network requests
self.addEventListener('fetch', event => {
    // Check if the request is for the API URL
    if (event.request.url.includes(API_URL)) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        // Clone the response before caching because the response can only be used once
                        const responseClone = response.clone();
                        cache.put(event.request, responseClone); // Cache the API response
                        return response; // Return the original response
                    })
                    .catch(() => {
                        // Return cached response if network fails
                        return caches.match(event.request).then(cachedResponse => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            return new Response(JSON.stringify({ message: 'No cached data available' }), {
                                headers: { 'Content-Type': 'application/json' }
                            });
                        });
                    });
            })
        );
    } else {
        // For other requests, serve as usual
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
});
