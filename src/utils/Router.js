/**
 * Router - Manages application navigation and routing
 * Uses History API for proper browser navigation
 */

import { ConsoleLogger, LogCategory } from './ConsoleLogger.js';

// SaveManager imported but not used - kept for future route guards

export class Router {
  constructor() {
    this.routes = new Map();
    this.guards = new Map();
    this.currentRoute = null;
    this.listeners = [];
    this.initialized = false;
  }

  /**
   * Initialize the router with browser history support
   */
  init() {
    if (this.initialized) return;

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
      const path = event.state?.path || '/';
      this.navigateWithoutPush(path, event.state?.data);
    });

    this.initialized = true;
    ConsoleLogger.info(LogCategory.ROUTER, '🧭 Router initialized');
  }

  /**
   * Register a route with its handler
   * @param {string} path - Route path (e.g., '/profile', '/combat')
   * @param {Function} handler - Function to call when route is accessed
   * @param {Object} options - Route options (title, guard)
   */
  register(path, handler, options = {}) {
    this.routes.set(path, {
      handler,
      title: options.title || 'Legends of the Arena',
      guard: options.guard || null,
    });
  }

  /**
   * Register a route guard (access check)
   * @param {string} name - Guard name
   * @param {Function} check - Function that returns true if access is allowed
   */
  registerGuard(name, check) {
    this.guards.set(name, check);
  }

  /**
   * Navigate to a route
   * @param {string} path - Route path
   * @param {Object} data - Optional data to pass to route
   * @param {boolean} replace - Replace current history entry instead of pushing
   */
  navigate(path, data = {}, replace = false) {
    const route = this.routes.get(path);

    if (!route) {
      ConsoleLogger.error(LogCategory.ROUTER, `❌ Route not found: ${path}`);
      return false;
    }

    // Check route guard if exists
    if (route.guard) {
      const guard = this.guards.get(route.guard);
      if (guard && !guard(data)) {
        ConsoleLogger.warn(LogCategory.ROUTER, `🚫 Access denied to route: ${path}`);
        return false;
      }
    }

    // Update browser history
    const state = { path, data };
    if (replace) {
      window.history.replaceState(state, '', `#${path}`);
    } else {
      window.history.pushState(state, '', `#${path}`);
    }

    // Update page title
    document.title = route.title;

    // Store current route
    this.currentRoute = { path, data };

    // Execute route handler
    route.handler(data);

    // Notify listeners
    this.notifyListeners(path, data);

    ConsoleLogger.info(LogCategory.ROUTER, `🧭 Navigated to: ${path}`);
    return true;
  }

  /**
   * Navigate without adding to history (for popstate handler)
   * @private
   */
  navigateWithoutPush(path, data = {}) {
    const route = this.routes.get(path);

    if (!route) {
      ConsoleLogger.error(LogCategory.ROUTER, `❌ Route not found: ${path}`);
      this.navigate('/', {}, true); // Fallback to home
      return;
    }

    // Check route guard
    if (route.guard) {
      const guard = this.guards.get(route.guard);
      if (guard && !guard(data)) {
        ConsoleLogger.warn(LogCategory.ROUTER, `🚫 Access denied to route: ${path}`);
        this.navigate('/', {}, true); // Redirect to home
        return;
      }
    }

    // Update page title
    document.title = route.title;

    // Store current route
    this.currentRoute = { path, data };

    // Execute route handler
    route.handler(data);

    // Notify listeners
    this.notifyListeners(path, data);
  }

  /**
   * Go back in history
   */
  back() {
    window.history.back();
  }

  /**
   * Go forward in history
   */
  forward() {
    window.history.forward();
  }

  /**
   * Get current route
   * @returns {Object} Current route object
   */
  getCurrentRoute() {
    return this.currentRoute;
  }

  /**
   * Check if a route exists
   * @param {string} path - Route path
   * @returns {boolean}
   */
  hasRoute(path) {
    return this.routes.has(path);
  }

  /**
   * Listen for route changes
   * @param {Function} callback - Function to call on route change
   * @returns {Function} Unsubscribe function
   */
  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Notify all listeners of route change
   * @private
   */
  notifyListeners(path, data) {
    this.listeners.forEach((listener) => {
      try {
        listener({ path, data });
      } catch (error) {
        ConsoleLogger.error(LogCategory.ROUTER, 'Error in route listener:', error);
      }
    });
  }

  /**
   * Clear all routes and guards
   */
  clear() {
    this.routes.clear();
    this.guards.clear();
    this.listeners = [];
    this.currentRoute = null;
  }
}

// Export singleton instance
export const router = new Router();
