/**
 * PWA Service Worker注册脚本
 * 仅在Web平台注册Service Worker
 */

export function registerServiceWorker() {
  // 只在Web平台且支持Service Worker的浏览器中注册
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[PWA] Service Worker not supported');
    return;
  }

  // 等待页面加载完成
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });

      console.log('[PWA] Service Worker registered:', registration.scope);

      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New Service Worker available');
            
            // 可以在这里提示用户刷新页面以使用新版本
            if (confirm('发现新版本!是否立即更新?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });

      // 监听Service Worker控制变化
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Service Worker controller changed');
      });

    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  });
}

/**
 * 注销Service Worker (用于开发调试)
 */
export async function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('[PWA] Service Worker unregistered');
    }
  } catch (error) {
    console.error('[PWA] Service Worker unregistration failed:', error);
  }
}

/**
 * 清除所有缓存 (用于开发调试)
 */
export async function clearAllCaches() {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('[PWA] All caches cleared');
  } catch (error) {
    console.error('[PWA] Cache clearing failed:', error);
  }
}

/**
 * 检查是否在PWA模式下运行
 */
export function isPWAMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // 检查display-mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // 检查iOS Safari
  const isIOSStandalone = (window.navigator as any).standalone === true;
  
  return isStandalone || isIOSStandalone;
}

/**
 * 检查是否支持PWA安装
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // 检查beforeinstallprompt事件支持
  return 'BeforeInstallPromptEvent' in window;
}
