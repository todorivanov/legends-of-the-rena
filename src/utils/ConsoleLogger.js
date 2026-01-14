/**
 * ConsoleLogger - Centralized logging system with granular control
 * Singleton pattern for consistent logging throughout the application
 *
 * Features:
 * - Multiple log levels (DEBUG, INFO, WARN, ERROR)
 * - Category-based filtering (e.g., ActionQueue, EconomyManager)
 * - UI-controlled settings via localStorage
 * - Color-coded console output
 */

// Log levels with priorities
export const LogLevel = {
  DEBUG: { name: 'DEBUG', priority: 0, color: '#9E9E9E', emoji: '🔍' },
  INFO: { name: 'INFO', priority: 1, color: '#2196F3', emoji: 'ℹ️' },
  WARN: { name: 'WARN', priority: 2, color: '#FF9800', emoji: '⚠️' },
  ERROR: { name: 'ERROR', priority: 3, color: '#F44336', emoji: '❌' },
};

// Common system categories
export const LogCategory = {
  COMBAT: 'Combat',
  ECONOMY: 'Economy',
  ACTION_QUEUE: 'ActionQueue',
  AI: 'AI',
  EQUIPMENT: 'Equipment',
  SAVE_SYSTEM: 'SaveSystem',
  UI: 'UI',
  PERFORMANCE: 'Performance',
  STORY: 'Story',
  TOURNAMENT: 'Tournament',
  ACHIEVEMENT: 'Achievement',
  GRID: 'Grid',
  STATUS_EFFECT: 'StatusEffect',
  SKILL: 'Skill',
  LEVELING: 'Leveling',
  MARKETPLACE: 'Marketplace',
  DURABILITY: 'Durability',
  TERRAIN: 'Terrain',
  SOUND: 'Sound',
  ROUTER: 'Router',
  STORE: 'Store',
  GENERAL: 'General',
};

class ConsoleLoggerClass {
  constructor() {
    if (ConsoleLoggerClass.instance) {
      return ConsoleLoggerClass.instance;
    }

    // Save reference to original console methods before any overrides
    this.originalConsole = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: console.debug.bind(console),
      info: console.info.bind(console),
    };

    this.settings = this.loadSettings();

    ConsoleLoggerClass.instance = this;
  }

  /**
   * Load settings from localStorage
   * @returns {Object} Logger settings
   */
  loadSettings() {
    const defaultSettings = {
      enabled: true,
      levels: {
        DEBUG: true,
        INFO: true,
        WARN: true,
        ERROR: true,
      },
      categories: {}, // Empty means all categories enabled
      enabledCategories: [], // Empty array means all categories enabled
      disabledCategories: [], // Specific categories to disable
      showTimestamp: true,
      showCategory: true,
      showEmoji: true,
    };

    try {
      const stored = localStorage.getItem('consoleLoggerSettings');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSettings, ...parsed };
      }
    } catch (e) {
      this.originalConsole.warn('Failed to load logger settings:', e);
    }

    return defaultSettings;
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem('consoleLoggerSettings', JSON.stringify(this.settings));
    } catch (e) {
      this.originalConsole.warn('Failed to save logger settings:', e);
    }
  }

  /**
   * Enable/disable logging globally
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.settings.enabled = enabled;
    this.saveSettings();
  }

  /**
   * Check if logging is enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.settings.enabled;
  }

  /**
   * Enable/disable specific log level
   * @param {string} level - Log level name (DEBUG, INFO, WARN, ERROR)
   * @param {boolean} enabled
   */
  setLevelEnabled(level, enabled) {
    if (this.settings.levels.hasOwnProperty(level)) {
      this.settings.levels[level] = enabled;
      this.saveSettings();
    }
  }

  /**
   * Check if a log level is enabled
   * @param {string} level
   * @returns {boolean}
   */
  isLevelEnabled(level) {
    return this.settings.levels[level] !== false;
  }

  /**
   * Enable/disable specific category
   * @param {string} category - Category name
   * @param {boolean} enabled
   */
  setCategoryEnabled(category, enabled) {
    if (enabled) {
      // Remove from disabled list
      this.settings.disabledCategories = this.settings.disabledCategories.filter(
        (cat) => cat !== category
      );
      // Add to enabled list if not present
      if (!this.settings.enabledCategories.includes(category)) {
        this.settings.enabledCategories.push(category);
      }
    } else {
      // Add to disabled list
      if (!this.settings.disabledCategories.includes(category)) {
        this.settings.disabledCategories.push(category);
      }
      // Remove from enabled list
      this.settings.enabledCategories = this.settings.enabledCategories.filter(
        (cat) => cat !== category
      );
    }
    this.saveSettings();
  }

  /**
   * Check if a category is enabled
   * @param {string} category
   * @returns {boolean}
   */
  isCategoryEnabled(category) {
    // If disabled list has the category, it's disabled
    if (this.settings.disabledCategories.includes(category)) {
      return false;
    }

    // If enabled list is empty, all categories are enabled
    if (this.settings.enabledCategories.length === 0) {
      return true;
    }

    // Otherwise, check if it's in the enabled list
    return this.settings.enabledCategories.includes(category);
  }

  /**
   * Get all category states
   * @returns {Object} Category enabled states
   */
  getAllCategoryStates() {
    const states = {};
    Object.values(LogCategory).forEach((category) => {
      states[category] = this.isCategoryEnabled(category);
    });
    return states;
  }

  /**
   * Reset to default settings
   */
  resetSettings() {
    this.settings = this.loadSettings();
    localStorage.removeItem('consoleLoggerSettings');
    this.saveSettings();
  }

  /**
   * Core logging method
   * @param {Object} level - Log level object
   * @param {string} category - Category name
   * @param {...any} args - Arguments to log
   */
  log(level, category, ...args) {
    // Check if logging is enabled
    if (!this.settings.enabled) {
      return;
    }

    // Check if this level is enabled
    if (!this.isLevelEnabled(level.name)) {
      return;
    }

    // Check if this category is enabled
    if (!this.isCategoryEnabled(category)) {
      return;
    }

    // Build log message prefix
    const parts = [];

    // Timestamp
    if (this.settings.showTimestamp) {
      const now = new Date();
      const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
        .getMilliseconds()
        .toString()
        .padStart(3, '0')}`;
      parts.push(`[${timestamp}]`);
    }

    // Emoji
    if (this.settings.showEmoji) {
      parts.push(level.emoji);
    }

    // Level
    parts.push(`[${level.name}]`);

    // Category
    if (this.settings.showCategory) {
      parts.push(`[${category}]`);
    }

    // Choose appropriate console method
    let consoleMethod = this.originalConsole.log;
    switch (level.name) {
      case 'WARN':
        consoleMethod = this.originalConsole.warn;
        break;
      case 'ERROR':
        consoleMethod = this.originalConsole.error;
        break;
      case 'DEBUG':
        consoleMethod = this.originalConsole.debug;
        break;
      case 'INFO':
        consoleMethod = this.originalConsole.info;
        break;
    }

    // Log with styling
    const prefix = parts.join(' ');
    consoleMethod(`%c${prefix}`, `color: ${level.color}; font-weight: bold;`, ...args);
  }

  /**
   * Convenience methods for each log level
   */
  debug(category, ...args) {
    this.log(LogLevel.DEBUG, category, ...args);
  }

  info(category, ...args) {
    this.log(LogLevel.INFO, category, ...args);
  }

  warn(category, ...args) {
    this.log(LogLevel.WARN, category, ...args);
  }

  error(category, ...args) {
    this.log(LogLevel.ERROR, category, ...args);
  }

  /**
   * Get current settings (for UI)
   * @returns {Object} Current settings
   */
  getSettings() {
    return { ...this.settings };
  }

  /**
   * Update multiple settings at once
   * @param {Object} newSettings - Settings to update
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  /**
   * Get statistics about logged messages (for debugging)
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      enabled: this.settings.enabled,
      enabledLevels: Object.keys(this.settings.levels).filter(
        (level) => this.settings.levels[level]
      ),
      disabledCategories: this.settings.disabledCategories,
      enabledCategories: this.settings.enabledCategories,
    };
  }
}

// Create singleton instance
const ConsoleLogger = new ConsoleLoggerClass();

// Don't freeze - we need to be able to modify internal state
// Object.freeze(ConsoleLogger);

export { ConsoleLogger };
export default ConsoleLogger;
