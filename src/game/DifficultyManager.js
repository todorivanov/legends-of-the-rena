/**
 * DifficultyManager - Manages game difficulty settings and scaling
 */

import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  NORMAL: 'normal',
  HARD: 'hard',
  NIGHTMARE: 'nightmare',
};

export const DIFFICULTY_CONFIG = {
  easy: {
    name: 'Easy',
    icon: '😊',
    description: 'Forgiving gameplay for newcomers. AI makes more mistakes, you get bonuses.',
    color: '#4caf50',
    modifiers: {
      playerHealthMultiplier: 1.3,
      playerStrengthMultiplier: 1.2,
      enemyHealthMultiplier: 0.8,
      enemyStrengthMultiplier: 0.8,
      aiMistakeChance: 0.25, // 25% chance AI makes suboptimal choice
      xpMultiplier: 0.8, // 80% XP
      equipmentDropRate: 0.7, // 70% drop chance
    },
    tips: [
      'Enemies are weaker',
      'You start with bonus HP and Strength',
      'AI makes frequent mistakes',
      'Great for learning the game',
    ],
  },
  normal: {
    name: 'Normal',
    icon: '⚔️',
    description: 'Balanced difficulty for most players. Standard gameplay experience.',
    color: '#2196f3',
    modifiers: {
      playerHealthMultiplier: 1.0,
      playerStrengthMultiplier: 1.0,
      enemyHealthMultiplier: 1.0,
      enemyStrengthMultiplier: 1.0,
      aiMistakeChance: 0.1, // 10% chance AI makes suboptimal choice
      xpMultiplier: 1.0, // 100% XP
      equipmentDropRate: 0.5, // 50% drop chance
    },
    tips: [
      'Standard gameplay',
      'Balanced challenge',
      'Normal XP and rewards',
      'Recommended for most players',
    ],
  },
  hard: {
    name: 'Hard',
    icon: '💀',
    description: 'Challenging experience for skilled players. Enemies are tougher and smarter.',
    color: '#ff9800',
    modifiers: {
      playerHealthMultiplier: 1.0,
      playerStrengthMultiplier: 1.0,
      enemyHealthMultiplier: 1.3,
      enemyStrengthMultiplier: 1.2,
      aiMistakeChance: 0.05, // 5% chance AI makes suboptimal choice
      xpMultiplier: 1.3, // 130% XP
      equipmentDropRate: 0.6, // 60% drop chance (better rewards)
    },
    tips: [
      'Enemies have more HP and damage',
      'Smarter AI decisions',
      '+30% XP bonus',
      'Better equipment drops',
    ],
  },
  nightmare: {
    name: 'Nightmare',
    icon: '👹',
    description: 'Brutal challenge for true masters. Only the best will survive.',
    color: '#f44336',
    modifiers: {
      playerHealthMultiplier: 1.0,
      playerStrengthMultiplier: 1.0,
      enemyHealthMultiplier: 1.6,
      enemyStrengthMultiplier: 1.5,
      aiMistakeChance: 0.0, // 0% chance - AI always optimal
      xpMultiplier: 1.5, // 150% XP
      equipmentDropRate: 0.7, // 70% drop chance (highest)
    },
    tips: [
      'Enemies have +60% HP and +50% Strength',
      'Perfect AI - no mistakes',
      '+50% XP bonus',
      'Highest equipment drop rate',
    ],
  },
};

export class DifficultyManager {
  /**
   * Get current difficulty
   */
  static getCurrentDifficulty() {
    return SaveManager.get('settings.difficulty') || DIFFICULTY_LEVELS.NORMAL;
  }

  /**
   * Set difficulty
   */
  static setDifficulty(difficulty) {
    if (!DIFFICULTY_CONFIG[difficulty]) {
      console.error(`Invalid difficulty: ${difficulty}`);
      return false;
    }

    SaveManager.update('settings.difficulty', difficulty);
    console.log(`⚙️ Difficulty set to: ${DIFFICULTY_CONFIG[difficulty].name}`);
    return true;
  }

  /**
   * Get difficulty configuration
   */
  static getDifficultyConfig(difficulty = null) {
    const currentDifficulty = difficulty || this.getCurrentDifficulty();
    return DIFFICULTY_CONFIG[currentDifficulty];
  }

  /**
   * Apply difficulty modifiers to a fighter
   * @param {Object} fighter - Fighter to modify
   * @param {boolean} isPlayer - Whether this is the player's fighter
   * @returns {Object} - Modified fighter
   */
  static applyDifficultyModifiers(fighter, isPlayer = false) {
    const config = this.getDifficultyConfig();

    if (isPlayer) {
      // Apply player bonuses/penalties
      fighter.health = Math.floor(fighter.health * config.modifiers.playerHealthMultiplier);
      fighter.maxHealth = Math.floor(fighter.maxHealth * config.modifiers.playerHealthMultiplier);
      fighter.strength = Math.floor(fighter.strength * config.modifiers.playerStrengthMultiplier);

      console.log(`💪 Player difficulty modifiers applied (${config.name}):`, {
        hp: `x${config.modifiers.playerHealthMultiplier}`,
        str: `x${config.modifiers.playerStrengthMultiplier}`,
      });
    } else {
      // Apply enemy modifiers
      fighter.health = Math.floor(fighter.health * config.modifiers.enemyHealthMultiplier);
      fighter.maxHealth = Math.floor(fighter.maxHealth * config.modifiers.enemyHealthMultiplier);
      fighter.strength = Math.floor(fighter.strength * config.modifiers.enemyStrengthMultiplier);

      console.log(`👹 Enemy difficulty modifiers applied (${config.name}):`, {
        hp: `x${config.modifiers.enemyHealthMultiplier}`,
        str: `x${config.modifiers.enemyStrengthMultiplier}`,
      });
    }

    return fighter;
  }

  /**
   * Check if AI should make a mistake (for difficulty scaling)
   * @returns {boolean}
   */
  static shouldAIMakeMistake() {
    const config = this.getDifficultyConfig();
    return Math.random() < config.modifiers.aiMistakeChance;
  }

  /**
   * Get XP multiplier for current difficulty
   * @returns {number}
   */
  static getXPMultiplier() {
    const config = this.getDifficultyConfig();
    return config.modifiers.xpMultiplier;
  }

  /**
   * Get equipment drop rate for current difficulty
   * @returns {number}
   */
  static getEquipmentDropRate() {
    const config = this.getDifficultyConfig();
    return config.modifiers.equipmentDropRate;
  }

  /**
   * Get difficulty info for display
   */
  static getDifficultyInfo(difficulty = null) {
    const diff = difficulty || this.getCurrentDifficulty();
    const config = DIFFICULTY_CONFIG[diff];

    return {
      id: diff,
      name: config.name,
      icon: config.icon,
      description: config.description,
      color: config.color,
      tips: config.tips,
      isCurrent: diff === this.getCurrentDifficulty(),
    };
  }

  /**
   * Get all difficulties info
   */
  static getAllDifficultiesInfo() {
    return Object.keys(DIFFICULTY_CONFIG).map((diff) => this.getDifficultyInfo(diff));
  }

  /**
   * Get scaled XP reward
   */
  static getScaledXP(baseXP) {
    const multiplier = this.getXPMultiplier();
    return Math.floor(baseXP * multiplier);
  }

  /**
   * Format difficulty display
   */
  static formatDifficultyDisplay() {
    const config = this.getDifficultyConfig();
    return `${config.icon} ${config.name}`;
  }
}
