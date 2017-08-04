var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  'bus.css',
  'bus.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
	
	if (event.request.url.endsWith('.worker')) {
	    event.respondWith(new Response('<strong>Ten URL istnieje!</strong>',
	    {headers:
	     {"Content-type":"text/html"}
	   }));
	  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
		  
        if (response) {
          return response;
        }
		console.log("Fetch " + response);
        return fetch(event.request);
      }
    )
  );
});