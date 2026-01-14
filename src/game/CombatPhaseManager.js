/**
 * CombatPhaseManager - Manages combat phases with event hooks
 * Provides a structured approach to combat flow with extensibility points
 */

import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

/**
 * Simple Event Emitter for combat events
 */
class CombatEventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  emit(event, data) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          ConsoleLogger.error(LogCategory.COMBAT, `Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

/**
 * Combat phases
 */
export const CombatPhase = {
  IDLE: 'idle',
  BATTLE_START: 'battle_start',
  TURN_START: 'turn_start',
  ACTION_SELECTION: 'action_selection',
  ACTION_EXECUTION: 'action_execution',
  ACTION_RESOLUTION: 'action_resolution',
  TURN_END: 'turn_end',
  BATTLE_END: 'battle_end',
};

/**
 * Combat events
 */
export const CombatEvent = {
  // Battle lifecycle
  BATTLE_STARTED: 'combat:battle_started',
  BATTLE_ENDED: 'combat:battle_ended',

  // Turn lifecycle
  TURN_STARTED: 'combat:turn_started',
  TURN_ENDED: 'combat:turn_ended',

  // Action lifecycle
  ACTION_SELECTED: 'combat:action_selected',
  ACTION_QUEUED: 'combat:action_queued',
  ACTION_EXECUTING: 'combat:action_executing',
  ACTION_EXECUTED: 'combat:action_executed',
  ACTION_RESOLVED: 'combat:action_resolved',

  // Combat results
  DAMAGE_DEALT: 'combat:damage_dealt',
  HEALING_APPLIED: 'combat:healing_applied',
  STATUS_APPLIED: 'combat:status_applied',
  STATUS_REMOVED: 'combat:status_removed',

  // Fighter state
  FIGHTER_DEFEATED: 'combat:fighter_defeated',
  HEALTH_CHANGED: 'combat:health_changed',
  MANA_CHANGED: 'combat:mana_changed',

  // Combo system
  COMBO_TRIGGERED: 'combat:combo_triggered',
  COMBO_BROKEN: 'combat:combo_broken',
};

export class CombatPhaseManager {
  constructor() {
    this.currentPhase = CombatPhase.IDLE;
    this.eventEmitter = new CombatEventEmitter();
    this.actionQueue = [];
    this.phaseHistory = [];
    this.turnCount = 0;
    this.combatData = {
      fighters: [],
      attacker: null,
      defender: null,
      turnManager: null,
    };
    this.hooks = new Map(); // Phase-specific hooks
  }

  /**
   * Initialize combat
   * @param {Object} attacker - Attacking fighter
   * @param {Object} defender - Defending fighter
   * @param {Object} turnManager - Turn manager instance
   */
  initialize(attacker, defender, turnManager) {
    this.combatData.attacker = attacker;
    this.combatData.defender = defender;
    this.combatData.fighters = [attacker, defender];
    this.combatData.turnManager = turnManager;
    this.turnCount = 0;
    this.actionQueue = [];
    this.phaseHistory = [];
  }

  /**
   * Start a new battle
   */
  async startBattle() {
    this.setPhase(CombatPhase.BATTLE_START);

    const eventData = {
      fighters: this.combatData.fighters,
      timestamp: Date.now(),
    };

    await this.executePhaseHooks(CombatPhase.BATTLE_START, eventData);
    this.emit(CombatEvent.BATTLE_STARTED, eventData);

    ConsoleLogger.info(LogCategory.COMBAT, '⚔️ Battle Started');
  }

  /**
   * Start a new turn
   * @param {Object} activeFighter - Fighter whose turn it is
   */
  async startTurn(activeFighter) {
    this.turnCount++;
    this.setPhase(CombatPhase.TURN_START);

    const eventData = {
      fighter: activeFighter,
      turnNumber: this.turnCount,
      timestamp: Date.now(),
    };

    await this.executePhaseHooks(CombatPhase.TURN_START, eventData);
    this.emit(CombatEvent.TURN_STARTED, eventData);

    ConsoleLogger.info(
      LogCategory.COMBAT,
      `🎯 Turn ${this.turnCount}: ${activeFighter.name}'s turn`
    );
  }

  /**
   * End current turn
   * @param {Object} activeFighter - Fighter whose turn is ending
   */
  async endTurn(activeFighter) {
    this.setPhase(CombatPhase.TURN_END);

    const eventData = {
      fighter: activeFighter,
      turnNumber: this.turnCount,
      timestamp: Date.now(),
    };

    await this.executePhaseHooks(CombatPhase.TURN_END, eventData);
    this.emit(CombatEvent.TURN_ENDED, eventData);
  }

  /**
   * Queue an action for execution
   * @param {Object} action - Action to queue
   */
  queueAction(action) {
    const queuedAction = {
      ...action,
      id: this.generateActionId(),
      queuedAt: Date.now(),
      status: 'queued',
    };

    this.actionQueue.push(queuedAction);
    this.emit(CombatEvent.ACTION_QUEUED, { action: queuedAction });

    ConsoleLogger.debug(LogCategory.COMBAT, `📋 Action queued: ${action.type}`, queuedAction);
    return queuedAction;
  }

  /**
   * Execute the next action in the queue
   * @returns {Promise<Object>} Execution result
   */
  async executeNextAction() {
    if (this.actionQueue.length === 0) {
      ConsoleLogger.warn(LogCategory.COMBAT, '⚠️ No actions in queue');
      return null;
    }

    const action = this.actionQueue.shift();
    return await this.executeAction(action);
  }

  /**
   * Execute a specific action
   * @param {Object} action - Action to execute
   * @returns {Promise<Object>} Execution result
   */
  async executeAction(action) {
    this.setPhase(CombatPhase.ACTION_EXECUTION);

    action.status = 'executing';
    action.executedAt = Date.now();

    this.emit(CombatEvent.ACTION_EXECUTING, { action });

    // Execute phase hooks
    const hookResult = await this.executePhaseHooks(CombatPhase.ACTION_EXECUTION, { action });

    // Action execution result
    const result = {
      action,
      success: true,
      effects: [],
      ...hookResult,
    };

    action.status = 'executed';
    this.emit(CombatEvent.ACTION_EXECUTED, { action, result });

    // Resolve action effects
    await this.resolveAction(action, result);

    return result;
  }

  /**
   * Resolve action effects
   * @param {Object} action - Executed action
   * @param {Object} result - Execution result
   */
  async resolveAction(action, result) {
    this.setPhase(CombatPhase.ACTION_RESOLUTION);

    const eventData = { action, result };

    await this.executePhaseHooks(CombatPhase.ACTION_RESOLUTION, eventData);
    this.emit(CombatEvent.ACTION_RESOLVED, eventData);

    action.status = 'resolved';
  }

  /**
   * End the battle
   * @param {Object} winner - Winning fighter
   * @param {Object} loser - Losing fighter
   */
  async endBattle(winner, loser) {
    this.setPhase(CombatPhase.BATTLE_END);

    const eventData = {
      winner,
      loser,
      turnCount: this.turnCount,
      timestamp: Date.now(),
    };

    await this.executePhaseHooks(CombatPhase.BATTLE_END, eventData);
    this.emit(CombatEvent.BATTLE_ENDED, eventData);

    ConsoleLogger.info(LogCategory.COMBAT, `🏆 Battle Ended: ${winner.name} wins!`);

    this.setPhase(CombatPhase.IDLE);
  }

  /**
   * Register a phase hook
   * @param {string} phase - Combat phase
   * @param {Function} callback - Hook callback
   * @param {number} priority - Execution priority (higher = earlier)
   * @returns {string} Hook ID for removal
   */
  registerPhaseHook(phase, callback, priority = 0) {
    if (!this.hooks.has(phase)) {
      this.hooks.set(phase, []);
    }

    const hookId = this.generateHookId();
    const hook = {
      id: hookId,
      callback,
      priority,
    };

    this.hooks.get(phase).push(hook);

    // Sort by priority (descending)
    this.hooks.get(phase).sort((a, b) => b.priority - a.priority);

    ConsoleLogger.debug(
      LogCategory.COMBAT,
      `🪝 Registered hook for ${phase} (priority: ${priority})`
    );
    return hookId;
  }

  /**
   * Unregister a phase hook
   * @param {string} hookId - Hook ID to remove
   */
  unregisterPhaseHook(hookId) {
    for (const [phase, hooks] of this.hooks.entries()) {
      const index = hooks.findIndex((h) => h.id === hookId);
      if (index !== -1) {
        hooks.splice(index, 1);
        ConsoleLogger.debug(LogCategory.COMBAT, `🪝 Unregistered hook ${hookId} from ${phase}`);
        return true;
      }
    }
    return false;
  }

  /**
   * Execute all hooks for a phase
   * @param {string} phase - Combat phase
   * @param {Object} data - Event data
   * @returns {Promise<Object>} Combined hook results
   */
  async executePhaseHooks(phase, data) {
    const hooks = this.hooks.get(phase) || [];
    const results = {};

    for (const hook of hooks) {
      try {
        const result = await hook.callback(data);
        if (result) {
          Object.assign(results, result);
        }
      } catch (error) {
        ConsoleLogger.error(LogCategory.COMBAT, `❌ Hook error in ${phase}:`, error);
      }
    }

    return results;
  }

  /**
   * Register an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    return this.eventEmitter.on(event, callback);
  }

  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  emit(event, data) {
    this.eventEmitter.emit(event, data);
  }

  /**
   * Remove all listeners for an event
   * @param {string} event - Event name (optional, removes all if not provided)
   */
  removeAllListeners(event) {
    this.eventEmitter.removeAllListeners(event);
  }

  /**
   * Set current phase
   * @param {string} phase - New phase
   */
  setPhase(phase) {
    const previousPhase = this.currentPhase;
    this.currentPhase = phase;

    this.phaseHistory.push({
      phase,
      timestamp: Date.now(),
    });

    ConsoleLogger.debug(LogCategory.COMBAT, `📍 Phase: ${previousPhase} → ${phase}`);
  }

  /**
   * Get current phase
   * @returns {string} Current phase
   */
  getPhase() {
    return this.currentPhase;
  }

  /**
   * Check if in specific phase
   * @param {string} phase - Phase to check
   * @returns {boolean} True if in phase
   */
  isInPhase(phase) {
    return this.currentPhase === phase;
  }

  /**
   * Get action queue
   * @returns {Array} Current action queue
   */
  getActionQueue() {
    return [...this.actionQueue];
  }

  /**
   * Clear action queue
   */
  clearActionQueue() {
    this.actionQueue = [];
    ConsoleLogger.debug(LogCategory.COMBAT, '🗑️ Action queue cleared');
  }

  /**
   * Get combat data
   * @returns {Object} Combat data
   */
  getCombatData() {
    return { ...this.combatData };
  }

  /**
   * Get phase history
   * @returns {Array} Phase history
   */
  getPhaseHistory() {
    return [...this.phaseHistory];
  }

  /**
   * Reset phase manager
   */
  reset() {
    this.currentPhase = CombatPhase.IDLE;
    this.actionQueue = [];
    this.phaseHistory = [];
    this.turnCount = 0;
    this.combatData = {
      fighters: [],
      attacker: null,
      defender: null,
      turnManager: null,
    };
    this.hooks.clear();

    ConsoleLogger.info(LogCategory.COMBAT, '🔄 Phase manager reset');
  }

  /**
   * Generate unique action ID
   * @returns {string} Action ID
   */
  generateActionId() {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique hook ID
   * @returns {string} Hook ID
   */
  generateHookId() {
    return `hook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get debug info
   * @returns {Object} Debug information
   */
  getDebugInfo() {
    return {
      currentPhase: this.currentPhase,
      turnCount: this.turnCount,
      queueLength: this.actionQueue.length,
      hookCount: Array.from(this.hooks.values()).reduce((sum, hooks) => sum + hooks.length, 0),
      phaseHistoryLength: this.phaseHistory.length,
    };
  }
}

// Export singleton instance
export const combatPhaseManager = new CombatPhaseManager();
