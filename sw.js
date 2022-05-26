
importScripts('/js/sw-utils.js');


const SATATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';



const APPSHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APPSHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'css/animate.css',
    'js/libs/jquery.js'
];


self.addEventListener('install', e => {

    const cachestatic = caches.open(SATATIC_CACHE).then(cache => 
        cache.addAll(APPSHELL));

    const cacheinmutable = caches.open(INMUTABLE_CACHE).then(cache => 
        cache.addAll(APPSHELL_INMUTABLE));
    
        e.waitUntil(Promise.all([cachestatic, cacheinmutable]));
});


self.addEventListener('activate', e => {

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== SATATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request).then(res => {

        if (res) {
            return res;
        } else {
            return fetch(e.request).then(newres => {

                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newres);
            });
        }
    });

    e.respondWith(respuesta);
});