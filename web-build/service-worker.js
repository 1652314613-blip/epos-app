/**
 * Epos Service Worker
 * 实现离线缓存和PWA功能
 */

const CACHE_NAME = 'epos-cache-v1';
const RUNTIME_CACHE = 'epos-runtime-v1';

// 静态资源缓存列表 (Cache-First策略)
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/grammar-center',
  '/swipe-vocabulary',
  '/textbook-reading',
];

// 安装事件 - 预缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_CACHE_URLS).catch((error) => {
        console.error('[Service Worker] Failed to cache:', error);
        // 即使部分缓存失败也继续安装
        return Promise.resolve();
      });
    })
  );
  
  // 强制激活新的Service Worker
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // 立即接管所有页面
  return self.clients.claim();
});

// 请求拦截 - 实现缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }
  
  // API请求使用Network-First策略
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // 静态资源使用Cache-First策略
  event.respondWith(cacheFirst(request));
});

/**
 * Cache-First策略
 * 优先从缓存读取,缓存未命中则从网络获取
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[Service Worker] Cache hit:', request.url);
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    // 只缓存成功的GET请求
    if (response.status === 200 && request.method === 'GET') {
      const responseToCache = response.clone();
      cache.put(request, responseToCache);
      console.log('[Service Worker] Cached new resource:', request.url);
    }
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    
    // 返回离线页面或默认响应
    return new Response('Offline - Resource not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
    });
  }
}

/**
 * Network-First策略
 * 优先从网络获取,网络失败则从缓存读取
 */
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    
    // 缓存成功的响应
    if (response.status === 200) {
      const responseToCache = response.clone();
      cache.put(request, responseToCache);
    }
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // 返回错误响应
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
  }
}

// 消息监听 - 支持手动缓存清理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
