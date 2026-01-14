/**
 * AIManager - Central AI management system
 * Ties together behavior trees, personalities, and combat logic
 */

import { BehaviorTree } from './BehaviorTree.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

import { getPersonalityForClass, getRandomArchetype, AIPersonality } from './AIPersonality.js';
import { getBehaviorForPersonality } from './CombatBehaviors.js';

/**
 * AIManager - Manages AI for a single fighter
 */
export class AIManager {
  constructor(fighter, difficulty = 'normal', personalityOverride = null) {
    this.fighter = fighter;
    this.difficulty = difficulty;

    // Create personality
    if (personalityOverride) {
      this.personality = new AIPersonality(personalityOverride, difficulty);
    } else {
      this.personality = getPersonalityForClass(fighter.class, difficulty);
    }

    // Create behavior tree
    const behaviorRoot = getBehaviorForPersonality(this.personality);
    this.behaviorTree = new BehaviorTree(`${fighter.name}_AI`, behaviorRoot);

    ConsoleLogger.info(
      LogCategory.AI,
      `🤖 AI Created for ${fighter.name}: ${this.personality.archetype.name} (${difficulty})`
    );
  }

  /**
   * Choose action for current turn
   * @param {Object} opponent - Opponent fighter
   * @returns {Object} Action to perform { type, skillIndex?, skill? }
   */
  chooseAction(opponent) {
    // Build context for decision-making
    const context = {
      fighter: this.fighter,
      opponent,
      personality: this.personality,
      difficulty: this.difficulty,
      chosenAction: null,
    };

    // Execute behavior tree
    this.behaviorTree.execute(context);

    // Return chosen action (or default to attack)
    const action = context.chosenAction || { type: 'attack' };

    // Record action for learning
    this.personality.recordAction(action.type, 'pending');

    ConsoleLogger.info(LogCategory.AI, `🤖 ${this.fighter.name} chose:`, action.type);

    return action;
  }

  /**
   * Record combat event for learning
   */
  recordEvent(event) {
    switch (event.type) {
      case 'damage_dealt':
        this.personality.recordDamage(event.amount, true);
        break;
      case 'damage_received':
        this.personality.recordDamage(event.amount, false);
        break;
      case 'action_success':
        this.personality.recordAction(event.action, 'success');
        break;
      case 'action_failure':
        this.personality.recordAction(event.action, 'failure');
        break;
    }
  }

  /**
   * Get AI personality info
   */
  getPersonalityInfo() {
    return {
      archetype: this.personality.archetype.name,
      description: this.personality.getDescription(),
      traits: this.personality.traits,
      difficulty: this.difficulty,
    };
  }

  /**
   * Should AI adapt strategy?
   */
  shouldAdapt() {
    return this.personality.shouldAdapt();
  }

  /**
   * Reset AI state
   */
  reset() {
    this.behaviorTree.reset();
    this.personality.memory = {
      damageReceived: [],
      damageDealt: [],
      actionsUsed: {},
      opponentPatterns: [],
    };
  }

  /**
   * Export AI data
   */
  toJSON() {
    return {
      fighter: this.fighter.name,
      difficulty: this.difficulty,
      personality: this.personality.toJSON(),
    };
  }
}

/**
 * Create AI for fighter
 * @param {Object} fighter - Fighter instance
 * @param {string} difficulty - Difficulty level
 * @param {Object} personalityOverride - Optional custom personality
 * @returns {AIManager} AI manager instance
 */
export function createAI(fighter, difficulty = 'normal', personalityOverride = null) {
  return new AIManager(fighter, difficulty, personalityOverride);
}

/**
 * Create AI with random personality
 */
export function createRandomAI(fighter, difficulty = 'normal') {
  const randomPersonality = getRandomArchetype();
  return new AIManager(fighter, difficulty, randomPersonality);
}

/**
 * Legacy compatibility: Simple AI decision (fallback)
 * Used if behavior tree system fails
 */
export function simpleFallbackAI(fighter, _opponent) {
  ConsoleLogger.warn(LogCategory.AI, '⚠️ Using fallback AI - behavior tree failed');

  // Simple decision logic
  const healthPercent = fighter.health / fighter.maxHealth;

  // Low health - use item if available
  if (healthPercent < 0.3 && fighter.itemsRemaining > 0) {
    return { type: 'item' };
  }

  // Try to use skill if available
  if (fighter.skills && fighter.skills.length > 0) {
    const availableSkill = fighter.skills.find(
      (skill) => fighter.mana >= skill.manaCost && skill.cooldownRemaining === 0
    );

    if (availableSkill && Math.random() < 0.6) {
      const skillIndex = fighter.skills.indexOf(availableSkill);
      return { type: 'skill', skillIndex, skill: availableSkill };
    }
  }

  // Defend if very low health
  if (healthPercent < 0.2 && Math.random() < 0.5) {
    return { type: 'defend' };
  }

  // Default: Attack
  return { type: 'attack' };
}
