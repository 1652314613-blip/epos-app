/**
 * 性能优化工具
 * 提供设备性能检测、动画优化和资源管理功能
 */

import { Platform, Dimensions } from "react-native";

// 设备性能等级
export type DevicePerformance = "high" | "medium" | "low";

/**
 * 检测设备性能等级
 */
export function detectDevicePerformance(): DevicePerformance {
  if (Platform.OS === "web") {
    // Web平台通过navigator.hardwareConcurrency判断
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || 4;

    if (cores >= 8 && memory >= 8) {
      return "high";
    } else if (cores >= 4 && memory >= 4) {
      return "medium";
    } else {
      return "low";
    }
  }

  // 移动平台通过屏幕尺寸和像素密度判断
  const { width, height } = Dimensions.get("window");
  const screenSize = width * height;

  if (screenSize > 2000000) {
    // 高分辨率设备 (如iPad Pro)
    return "high";
  } else if (screenSize > 1000000) {
    // 中等分辨率设备
    return "medium";
  } else {
    // 低分辨率设备
    return "low";
  }
}

/**
 * 根据设备性能获取推荐的动画配置
 */
export function getAnimationConfig(performance?: DevicePerformance) {
  const devicePerformance = performance || detectDevicePerformance();

  switch (devicePerformance) {
    case "high":
      return {
        duration: 300,
        useNativeDriver: true,
        enableComplexAnimations: true,
        maxParticles: 50,
      };
    case "medium":
      return {
        duration: 250,
        useNativeDriver: true,
        enableComplexAnimations: true,
        maxParticles: 30,
      };
    case "low":
      return {
        duration: 200,
        useNativeDriver: true,
        enableComplexAnimations: false,
        maxParticles: 10,
      };
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 懒加载图片
 */
export function lazyLoadImage(uri: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (Platform.OS === "web") {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = uri;
    } else {
      // React Native环境
      resolve();
    }
  });
}

/**
 * 批量处理任务 (分批执行,避免阻塞)
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);

    // 让出主线程,避免阻塞UI
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return results;
}

/**
 * 内存优化: 清理未使用的资源
 */
export function cleanupResources() {
  if (Platform.OS === "web") {
    // Web平台: 清理未使用的缓存
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          if (name.includes("old") || name.includes("temp")) {
            caches.delete(name);
          }
        });
      });
    }
  }
}

/**
 * 性能监控: 测量函数执行时间
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;

  console.log(`[Performance] ${name}: ${duration}ms`);

  return result;
}

/**
 * 检查是否为低端设备
 */
export function isLowEndDevice(): boolean {
  return detectDevicePerformance() === "low";
}

/**
 * 获取推荐的列表渲染配置
 */
export function getListRenderConfig(performance?: DevicePerformance) {
  const devicePerformance = performance || detectDevicePerformance();

  switch (devicePerformance) {
    case "high":
      return {
        initialNumToRender: 20,
        maxToRenderPerBatch: 10,
        windowSize: 21,
        removeClippedSubviews: false,
      };
    case "medium":
      return {
        initialNumToRender: 15,
        maxToRenderPerBatch: 8,
        windowSize: 15,
        removeClippedSubviews: true,
      };
    case "low":
      return {
        initialNumToRender: 10,
        maxToRenderPerBatch: 5,
        windowSize: 10,
        removeClippedSubviews: true,
      };
  }
}
