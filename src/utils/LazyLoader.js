/**
 * LazyLoader - Dynamic module and asset loading system
 * Improves initial load time by loading resources on demand
 */

import { ConsoleLogger, LogCategory } from './ConsoleLogger.js';

export class LazyLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
    this.preloadQueue = [];
    this.observers = new Map();
  }

  /**
   * Dynamically import a module
   * @param {string} modulePath - Path to module
   * @returns {Promise<any>} Loaded module
   */
  async loadModule(modulePath) {
    // Check cache
    if (this.cache.has(modulePath)) {
      return this.cache.get(modulePath);
    }

    // Check if already loading
    if (this.loading.has(modulePath)) {
      return this.loading.get(modulePath);
    }

    // Start loading
    const loadPromise = import(/* @vite-ignore */ modulePath)
      .then((module) => {
        this.cache.set(modulePath, module);
        this.loading.delete(modulePath);
        this.notifyObservers(modulePath, 'loaded', module);
        return module;
      })
      .catch((error) => {
        this.loading.delete(modulePath);
        this.notifyObservers(modulePath, 'error', error);
        ConsoleLogger.error(LogCategory.PERFORMANCE, `Failed to load module: ${modulePath}`, error);
        throw error;
      });

    this.loading.set(modulePath, loadPromise);
    return loadPromise;
  }

  /**
   * Load an image asset
   * @param {string} imagePath - Path to image
   * @returns {Promise<HTMLImageElement>} Loaded image
   */
  async loadImage(imagePath) {
    if (this.cache.has(imagePath)) {
      return this.cache.get(imagePath);
    }

    if (this.loading.has(imagePath)) {
      return this.loading.get(imagePath);
    }

    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.cache.set(imagePath, img);
        this.loading.delete(imagePath);
        this.notifyObservers(imagePath, 'loaded', img);
        resolve(img);
      };

      img.onerror = () => {
        this.loading.delete(imagePath);
        const error = new Error(`Failed to load image: ${imagePath}`);
        this.notifyObservers(imagePath, 'error', error);
        reject(error);
      };

      img.src = imagePath;
    });

    this.loading.set(imagePath, loadPromise);
    return loadPromise;
  }

  /**
   * Load multiple resources in parallel
   * @param {Array<string>} paths - Array of resource paths
   * @param {string} type - Resource type ('module' or 'image')
   * @returns {Promise<Array>} Array of loaded resources
   */
  async loadBatch(paths, type = 'module') {
    const loader = type === 'image' ? this.loadImage.bind(this) : this.loadModule.bind(this);
    return Promise.all(paths.map((path) => loader(path)));
  }

  /**
   * Preload resources for future use
   * @param {Array<string>} paths - Paths to preload
   * @param {string} type - Resource type
   * @param {number} priority - Loading priority (higher = sooner)
   */
  preload(paths, type = 'module', priority = 0) {
    paths.forEach((path) => {
      this.preloadQueue.push({ path, type, priority });
    });

    // Sort by priority
    this.preloadQueue.sort((a, b) => b.priority - a.priority);

    // Start preloading if not already running
    if (!this.isPreloading) {
      this.processPreloadQueue();
    }
  }

  /**
   * Process preload queue
   */
  async processPreloadQueue() {
    if (this.preloadQueue.length === 0) {
      this.isPreloading = false;
      return;
    }

    this.isPreloading = true;
    const { path, type } = this.preloadQueue.shift();

    try {
      if (type === 'image') {
        await this.loadImage(path);
      } else {
        await this.loadModule(path);
      }
    } catch (error) {
      ConsoleLogger.warn(LogCategory.PERFORMANCE, `Preload failed for ${path}:`, error);
    }

    // Continue with next item
    requestIdleCallback(() => this.processPreloadQueue());
  }

  /**
   * Lazy load Web Component definition
   * @param {string} tagName - Component tag name
   * @param {string} modulePath - Path to component module
   * @returns {Promise<void>}
   */
  async loadComponent(tagName, modulePath) {
    // Check if already defined
    if (customElements.get(tagName)) {
      return;
    }

    const module = await this.loadModule(modulePath);

    // Register component if not already registered
    if (!customElements.get(tagName)) {
      const ComponentClass = module.default || module[Object.keys(module)[0]];
      customElements.define(tagName, ComponentClass);
    }
  }

  /**
   * Intersection Observer for lazy loading elements
   * @param {Element} element - Element to observe
   * @param {Function} callback - Callback when element is visible
   * @param {Object} options - Intersection observer options
   */
  observeElement(element, callback, options = {}) {
    const observerKey = `${element.tagName}-${Date.now()}`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry.target);
            observer.unobserve(entry.target);
            this.observers.delete(observerKey);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
        ...options,
      }
    );

    observer.observe(element);
    this.observers.set(observerKey, observer);
  }

  /**
   * Register observer for module load events
   * @param {string} modulePath - Module to observe
   * @param {Function} callback - Callback(event, data)
   */
  onModuleLoad(modulePath, callback) {
    if (!this.moduleObservers) {
      this.moduleObservers = new Map();
    }

    if (!this.moduleObservers.has(modulePath)) {
      this.moduleObservers.set(modulePath, []);
    }

    this.moduleObservers.get(modulePath).push(callback);
  }

  /**
   * Notify observers of module events
   */
  notifyObservers(modulePath, event, data) {
    if (!this.moduleObservers || !this.moduleObservers.has(modulePath)) {
      return;
    }

    this.moduleObservers.get(modulePath).forEach((callback) => {
      try {
        callback(event, data);
      } catch (error) {
        ConsoleLogger.error(LogCategory.PERFORMANCE, 'Observer callback error:', error);
      }
    });
  }

  /**
   * Clear cache
   * @param {string} [pattern] - Optional pattern to match paths
   */
  clearCache(pattern) {
    if (pattern) {
      const regex = new RegExp(pattern);
      for (const [key] of this.cache) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    return {
      cached: this.cache.size,
      loading: this.loading.size,
      queued: this.preloadQueue.length,
      observers: this.observers.size,
    };
  }

  /**
   * Dispose all observers and clear cache
   */
  dispose() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.cache.clear();
    this.loading.clear();
    this.preloadQueue = [];
  }
}

// Singleton instance
export const lazyLoader = new LazyLoader();

// Convenience methods
export const loadModule = (path) => lazyLoader.loadModule(path);
export const loadImage = (path) => lazyLoader.loadImage(path);
export const preloadModules = (paths, priority) => lazyLoader.preload(paths, 'module', priority);
export const preloadImages = (paths, priority) => lazyLoader.preload(paths, 'image', priority);
