/**
 * Performance Monitoring and Optimization Utilities
 * 
 * These utilities help optimize HVEC performance across different device types
 * and provide insights into system performance for the quantum clinical intelligence.
 */

// Extended Navigator interface for device memory API
interface NavigatorWithDeviceMemory extends Navigator {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
}

// Extended Performance interface for memory API
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  loadTime: number;
  interactionLatency: number;
}

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  hasGoodPerformance: boolean;
  supportsWebGL: boolean;
  deviceMemory: number;
  networkType: string;
}

/**
 * Detect device capabilities for performance optimization
 */
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  // Check WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const supportsWebGL = !!gl;
  
  // Estimate device performance based on available APIs
  const extendedNavigator = navigator as NavigatorWithDeviceMemory;
  const deviceMemory = extendedNavigator?.deviceMemory || 4; // Default to 4GB
  const networkInfo = extendedNavigator?.connection;
  const networkType = networkInfo?.effectiveType || 'unknown';
  
  // Performance heuristics
  const hasGoodPerformance = deviceMemory >= 4 && !isMobile && supportsWebGL;
  
  return {
    isMobile,
    isTablet,
    hasGoodPerformance,
    supportsWebGL,
    deviceMemory,
    networkType,
  };
};

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  
  constructor() {
    this.initializeObservers();
  }
  
  private initializeObservers() {
    // Monitor render performance
    if ('PerformanceObserver' in window) {
      const renderObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.metrics.renderTime = entry.duration;
          }
        });
      });
      
      renderObserver.observe({ entryTypes: ['measure'] });
      this.observers.push(renderObserver);
    }
    
    // Monitor memory usage if available
    if ('memory' in performance) {
      setInterval(() => {
        const extendedPerformance = performance as PerformanceWithMemory;
        const memInfo = extendedPerformance.memory;
        if (memInfo) {
          this.metrics.memoryUsage = memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit;
        }
      }, 5000);
    }
  }
  
  /**
   * Start measuring a performance metric
   */
  startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }
  
  /**
   * End measuring and record the metric
   */
  endMeasure(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }
  
  /**
   * Get current performance metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }
  
  /**
   * Clean up observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Adaptive settings based on device capabilities
 */
export const getAdaptiveSettings = (capabilities: DeviceCapabilities) => {
  return {
    // Visual effects
    particleCount: capabilities.isMobile ? 15 : capabilities.isTablet ? 30 : 60,
    animationDuration: capabilities.isMobile ? 0.3 : 0.6,
    blurIntensity: capabilities.hasGoodPerformance ? 1.5 : 0.8,
    
    // Rendering
    enableAdvancedEffects: capabilities.hasGoodPerformance,
    useWebGL: capabilities.supportsWebGL && capabilities.hasGoodPerformance,
    frameRate: capabilities.isMobile ? 30 : 60,
    
    // Memory management
    cacheSize: capabilities.deviceMemory * 100, // MB
    preloadImages: capabilities.networkType === '4g' || capabilities.networkType === 'wifi',
    
    // UI complexity
    showDetailedAnimations: !capabilities.isMobile,
    enableParallax: capabilities.hasGoodPerformance,
    showParticleEffects: !capabilities.isMobile || capabilities.hasGoodPerformance,
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): T => {
  let inThrottle: boolean;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  }) as T;
};

/**
 * Lazy loading utility for images and components
 */
export const createIntersectionObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) => {
  if ('IntersectionObserver' in window) {
    return new IntersectionObserver((entries) => {
      entries.forEach(callback);
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });
  }
  return null;
};

/**
 * Preload critical resources
 */
export const preloadCriticalResources = async () => {
  // Preload critical fonts
  if ('fonts' in document) {
    await document.fonts.ready;
  }
  
  // Preload critical images (if any)
  const criticalImages: string[] = [
    // Add paths to critical images here
  ];
  
  const imagePromises = criticalImages.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  });
  
  try {
    await Promise.all(imagePromises);
  } catch (error) {
    console.warn('Failed to preload some critical resources:', error);
  }
};

/**
 * Memory management utility
 */
export class MemoryManager<T = unknown> {
  private cache: Map<string, T> = new Map();
  private maxSize: number;
  
  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }
  
  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
  
  get(key: string): T | undefined {
    return this.cache.get(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  getSize(): number {
    return this.cache.size;
  }
}
