const CACHE='__CACHE__';
const PRECACHE=/*__PRECACHE__*/[];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE))));
self.addEventListener('message',event=>{if(event.data==='ACTIVATE_UPDATE')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('sugarlens-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 // Static resources are selected at build time. Ignore Vary: Origin because module
 // requests and install-time fetches use different Origin headers in some browsers.
 const cached=request=>caches.open(CACHE).then(cache=>cache.match(request,{ignoreVary:true}));
 if(event.request.mode==='navigate'){event.respondWith(cached(new URL('./index.html',self.registration.scope).href).then(hit=>hit||fetch(event.request)));return;}
 event.respondWith(cached(event.request).then(hit=>hit||fetch(event.request)));
});
