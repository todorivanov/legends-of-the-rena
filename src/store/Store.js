/**
 * Store - Centralized state management system
 * Inspired by Redux/Zustand but vanilla JS
 */

import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

export class Store {
  /**
   * Create a new store
   * @param {Object} initialState - Initial state object
   * @param {Object} reducers - Object with reducer functions
   */
  constructor(initialState = {}, reducers = {}) {
    this.state = initialState;
    this.reducers = reducers;
    this.listeners = new Set();
    this.history = [initialState]; // For time-travel debugging
    this.historyIndex = 0;
    this.maxHistory = 50; // Keep last 50 states
    this.middleware = [];
  }

  /**
   * Get current state (immutable)
   * @returns {Object} Current state
   */
  getState() {
    // Return frozen copy to prevent direct mutations
    return Object.freeze({ ...this.state });
  }

  /**
   * Dispatch an action to modify state
   * @param {Object} action - Action object with type and payload
   * @returns {Object} New state
   */
  dispatch(action) {
    if (!action || !action.type) {
      ConsoleLogger.error(LogCategory.STORE, '❌ Action must have a type property');
      return this.state;
    }

    ConsoleLogger.info(LogCategory.STORE, '📦 Store Action:', action.type, action.payload);

    const reducer = this.reducers[action.type];
    if (!reducer) {
      ConsoleLogger.warn(LogCategory.STORE, `⚠️ No reducer found for action: ${action.type}`);
      return this.state;
    }

    // Store previous state
    const prevState = this.state;

    // Apply middleware (before)
    this.middleware.forEach((mw) => {
      if (mw.before) mw.before(prevState, action);
    });

    // Execute reducer to get new state
    const newState = reducer(this.state, action.payload);

    // Merge new state with old state
    this.state = { ...this.state, ...newState };

    // Apply middleware (after)
    this.middleware.forEach((mw) => {
      if (mw.after) mw.after(this.state, action, prevState);
    });

    // Add to history for time-travel debugging
    this.addToHistory(this.state);

    // Notify all listeners
    this.notify(action.type);

    return this.state;
  }

  /**
   * Subscribe to state changes
   * @param {Function} listener - Callback function
   * @param {string} selector - Optional: only notify when this part of state changes
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener, selector = null) {
    const subscription = {
      callback: listener,
      selector,
      prevValue: selector ? this.select(selector) : null,
    };

    this.listeners.add(subscription);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(subscription);
    };
  }

  /**
   * Notify all listeners of state change
   * @private
   */
  notify(actionType) {
    this.listeners.forEach((subscription) => {
      try {
        // If selector provided, only notify if that part changed
        if (subscription.selector) {
          const newValue = this.select(subscription.selector);
          if (JSON.stringify(newValue) !== JSON.stringify(subscription.prevValue)) {
            subscription.prevValue = newValue;
            subscription.callback(this.state, actionType);
          }
        } else {
          // No selector - notify on any change
          subscription.callback(this.state, actionType);
        }
      } catch (error) {
        ConsoleLogger.error(LogCategory.STORE, 'Error in store listener:', error);
      }
    });
  }

  /**
   * Select a specific part of state using path
   * @param {string} path - Dot notation path (e.g., 'player.level')
   * @returns {*} Selected value
   */
  select(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.state);
  }

  /**
   * Add middleware
   * @param {Object} middleware - Middleware object with before/after hooks
   */
  use(middleware) {
    this.middleware.push(middleware);
  }

  /**
   * Add state to history for time-travel debugging
   * @private
   */
  addToHistory(state) {
    // Remove any future states if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    // Add new state
    this.history.push({ ...state });

    // Limit history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  /**
   * Time-travel: Go back in history
   * @returns {boolean} Success
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = { ...this.history[this.historyIndex] };
      this.notify('@@UNDO');
      ConsoleLogger.info(LogCategory.STORE, '⏪ State restored to:', this.historyIndex);
      return true;
    }
    return false;
  }

  /**
   * Time-travel: Go forward in history
   * @returns {boolean} Success
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = { ...this.history[this.historyIndex] };
      this.notify('@@REDO');
      ConsoleLogger.info(LogCategory.STORE, '⏩ State restored to:', this.historyIndex);
      return true;
    }
    return false;
  }

  /**
   * Get history info
   * @returns {Object} History metadata
   */
  getHistoryInfo() {
    return {
      current: this.historyIndex,
      total: this.history.length,
      canUndo: this.historyIndex > 0,
      canRedo: this.historyIndex < this.history.length - 1,
    };
  }

  /**
   * Reset store to initial state
   */
  reset(newInitialState = null) {
    const initialState = newInitialState || this.history[0];
    this.state = { ...initialState };
    this.history = [this.state];
    this.historyIndex = 0;
    this.notify('@@RESET');
    ConsoleLogger.info(LogCategory.STORE, '🔄 Store reset to initial state');
  }

  /**
   * Get all state for debugging
   * @returns {Object} Full state tree
   */
  inspect() {
    return {
      state: this.state,
      history: this.history,
      historyIndex: this.historyIndex,
      listeners: this.listeners.size,
      reducers: Object.keys(this.reducers),
    };
  }
}

/**
 * Create a store with reducers
 * @param {Object} initialState - Initial state
 * @param {Object} reducers - Reducer functions
 * @returns {Store} Store instance
 */
export function createStore(initialState, reducers) {
  return new Store(initialState, reducers);
}
