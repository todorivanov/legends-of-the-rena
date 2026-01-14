/**
 * ActionQueue - Advanced action queue with priorities and batching
 */

import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

export class ActionQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.paused = false;
    this.history = [];
    this.maxHistorySize = 50;
  }

  /**
   * Add action to queue
   * @param {Object} action - Action to add
   * @returns {string} Action ID
   */
  enqueue(action) {
    const queuedAction = {
      id: this.generateId(),
      ...action,
      queuedAt: Date.now(),
      status: 'queued',
      priority: action.priority || 0,
    };

    this.queue.push(queuedAction);
    this.sortByPriority();

    ConsoleLogger.info(
      LogCategory.ACTION_QUEUE,
      `📥 Enqueued: ${action.type} (priority: ${queuedAction.priority})`
    );
    return queuedAction.id;
  }

  /**
   * Add multiple actions as a batch
   * @param {Array} actions - Actions to add
   * @returns {Array} Action IDs
   */
  enqueueBatch(actions) {
    const ids = actions.map((action) => this.enqueue(action));
    ConsoleLogger.info(LogCategory.ACTION_QUEUE, `📦 Batch enqueued: ${actions.length} actions`);
    return ids;
  }

  /**
   * Remove next action from queue
   * @returns {Object|null} Next action or null
   */
  dequeue() {
    if (this.queue.length === 0) {
      return null;
    }

    const action = this.queue.shift();
    this.addToHistory(action);

    ConsoleLogger.info(LogCategory.ACTION_QUEUE, `📤 Dequeued: ${action.type}`);
    return action;
  }

  /**
   * Peek at next action without removing
   * @returns {Object|null} Next action or null
   */
  peek() {
    return this.queue.length > 0 ? { ...this.queue[0] } : null;
  }

  /**
   * Get action by ID
   * @param {string} id - Action ID
   * @returns {Object|null} Action or null
   */
  getById(id) {
    const action = this.queue.find((a) => a.id === id);
    return action ? { ...action } : null;
  }

  /**
   * Remove action by ID
   * @param {string} id - Action ID
   * @returns {boolean} True if removed
   */
  removeById(id) {
    const index = this.queue.findIndex((a) => a.id === id);
    if (index !== -1) {
      const action = this.queue.splice(index, 1)[0];
      ConsoleLogger.info(LogCategory.ACTION_QUEUE, `🗑️ Removed: ${action.type}`);
      return true;
    }
    return false;
  }

  /**
   * Get all actions matching criteria
   * @param {Function} predicate - Filter function
   * @returns {Array} Matching actions
   */
  filter(predicate) {
    return this.queue.filter(predicate).map((a) => ({ ...a }));
  }

  /**
   * Get actions by type
   * @param {string} type - Action type
   * @returns {Array} Actions of specified type
   */
  getByType(type) {
    return this.filter((action) => action.type === type);
  }

  /**
   * Get actions by fighter
   * @param {string} fighterId - Fighter ID
   * @returns {Array} Fighter's actions
   */
  getByFighter(fighterId) {
    return this.filter((action) => action.attacker?.id === fighterId);
  }

  /**
   * Clear all actions
   */
  clear() {
    const count = this.queue.length;
    this.queue = [];
    ConsoleLogger.info(LogCategory.ACTION_QUEUE, `🗑️ Cleared ${count} actions`);
  }

  /**
   * Sort queue by priority (descending)
   */
  sortByPriority() {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get queue size
   * @returns {number} Number of actions
   */
  size() {
    return this.queue.length;
  }

  /**
   * Check if queue is empty
   * @returns {boolean} True if empty
   */
  isEmpty() {
    return this.queue.length === 0;
  }

  /**
   * Pause queue processing
   */
  pause() {
    this.paused = true;
    ConsoleLogger.info(LogCategory.ACTION_QUEUE, '⏸️ Queue paused');
  }

  /**
   * Resume queue processing
   */
  resume() {
    this.paused = false;
    ConsoleLogger.info(LogCategory.ACTION_QUEUE, '▶️ Queue resumed');
  }

  /**
   * Check if paused
   * @returns {boolean} True if paused
   */
  isPaused() {
    return this.paused;
  }

  /**
   * Check if processing
   * @returns {boolean} True if processing
   */
  isProcessing() {
    return this.processing;
  }

  /**
   * Mark as processing
   */
  startProcessing() {
    this.processing = true;
  }

  /**
   * Mark as not processing
   */
  stopProcessing() {
    this.processing = false;
  }

  /**
   * Add action to history
   * @param {Object} action - Completed action
   */
  addToHistory(action) {
    this.history.unshift({
      ...action,
      completedAt: Date.now(),
    });

    // Trim history
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Get action history
   * @param {number} limit - Max number of actions
   * @returns {Array} Recent actions
   */
  getHistory(limit = 10) {
    return this.history.slice(0, limit).map((a) => ({ ...a }));
  }

  /**
   * Get all queued actions
   * @returns {Array} All actions in queue
   */
  getAll() {
    return this.queue.map((a) => ({ ...a }));
  }

  /**
   * Update action status
   * @param {string} id - Action ID
   * @param {string} status - New status
   * @returns {boolean} True if updated
   */
  updateStatus(id, status) {
    const action = this.queue.find((a) => a.id === id);
    if (action) {
      action.status = status;
      action.updatedAt = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get queue statistics
   * @returns {Object} Statistics
   */
  getStats() {
    const byType = {};
    const byStatus = {};
    const byPriority = {};

    this.queue.forEach((action) => {
      // Count by type
      byType[action.type] = (byType[action.type] || 0) + 1;

      // Count by status
      byStatus[action.status] = (byStatus[action.status] || 0) + 1;

      // Count by priority
      const priorityKey = `priority_${action.priority}`;
      byPriority[priorityKey] = (byPriority[priorityKey] || 0) + 1;
    });

    return {
      total: this.queue.length,
      byType,
      byStatus,
      byPriority,
      historySize: this.history.length,
      isPaused: this.paused,
      isProcessing: this.processing,
    };
  }

  /**
   * Reset queue and history
   */
  reset() {
    this.queue = [];
    this.history = [];
    this.processing = false;
    this.paused = false;
    ConsoleLogger.info(LogCategory.ACTION_QUEUE, '🔄 Action queue reset');
  }
}

export default ActionQueue;
