var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  'bus.css',
  'bus.js',
  'https://script.google.com/macros/s/AKfycbxHXrx9YLhONoVk9ZXz9YrvMVJhkk-qI7RwRZv3EM8DYdObrqc/exec?callback=onDataLoaded&direction=home',
  'https://script.google.com/macros/s/AKfycbxHXrx9YLhONoVk9ZXz9YrvMVJhkk-qI7RwRZv3EM8DYdObrqc/exec?callback=onDataLoaded&direction=work',
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
	
	if (event.request.url.endsWith('version')) {
	    event.respondWith(new Response('<strong>Version 0.9</strong>',
      {headers:{"Content-type":"text/html"}}));
      return ;
	}

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log("Cache: " + event.request.method + " " + event.request.url);
          return response;
        }
        console.log("Fetch: " + event.request.method + " " + event.request.url);
        return fetch(event.request);
      }
    )
  );

});