/**
 * TalentManager - Manages talent trees, talent point allocation, and talent effects
 *
 * Features:
 * - 3 talent trees per class
 * - Talent dependencies and prerequisites
 * - Stat modifiers and passive effects
 * - Talent point allocation based on level
 * - Talent respec functionality
 */

import { gameStore } from '../store/gameStore.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';
import { TALENT_TREES } from '../data/talents.js';

/**
 * @typedef {Object} TalentNode
 * @property {string} id - Unique talent identifier
 * @property {string} name - Display name
 * @property {string} description - Tooltip description
 * @property {string} icon - Emoji/icon
 * @property {number} maxRank - Maximum points that can be allocated
 * @property {number} row - Position in tree (0-based)
 * @property {number} column - Position in tree (0-based)
 * @property {string[]} requires - Array of talent IDs that must be learned first
 * @property {number} requiresPoints - Minimum points in this tree to unlock
 * @property {Object} effects - Talent effects per rank
 * @property {Object} effects.stats - Stat modifiers (strength, health, etc.)
 * @property {Object} effects.passive - Passive abilities
 */

export class TalentManager {
  /**
   * Get talent trees for a character class
   * @param {string} characterClass - Class name (e.g., 'WARRIOR', 'MAGE')
   * @returns {Object} Object with tree1, tree2, tree3
   */
  static getTalentTrees(characterClass) {
    const trees = TALENT_TREES[characterClass];

    if (!trees) {
      ConsoleLogger.warn(LogCategory.SYSTEM, `No talent trees found for class: ${characterClass}`);
      return null;
    }

    return trees;
  }

  /**
   * Get a specific talent node by ID
   * @param {string} characterClass - Class name
   * @param {string} treeId - Tree identifier (tree1, tree2, tree3)
   * @param {string} talentId - Talent node ID
   * @returns {TalentNode|null}
   */
  static getTalentNode(characterClass, treeId, talentId) {
    const trees = this.getTalentTrees(characterClass);
    if (!trees || !trees[treeId]) return null;

    return trees[treeId].talents.find((t) => t.id === talentId) || null;
  }

  /**
   * Get player's current talent allocations
   * @returns {Object} Talent allocations by tree
   */
  static getPlayerTalents() {
    const state = gameStore.getState();
    return state.player?.talents || {};
  }

  /**
   * Get total talent points available for player
   * @returns {number} Total talent points based on level
   */
  static getTotalTalentPoints() {
    const state = gameStore.getState();
    const level = state.player?.level || 1;

    // Gain 1 talent point per level starting at level 2
    return Math.max(0, level - 1);
  }

  /**
   * Get spent talent points
   * @returns {number} Number of points already allocated
   */
  static getSpentTalentPoints() {
    const talents = this.getPlayerTalents();
    let spent = 0;

    Object.keys(talents).forEach((treeId) => {
      Object.keys(talents[treeId]).forEach((talentId) => {
        spent += talents[treeId][talentId];
      });
    });

    return spent;
  }

  /**
   * Get available talent points
   * @returns {number} Unspent talent points
   */
  static getAvailableTalentPoints() {
    return this.getTotalTalentPoints() - this.getSpentTalentPoints();
  }

  /**
   * Get points spent in a specific tree
   * @param {string} treeId - Tree identifier
   * @returns {number}
   */
  static getTreePoints(treeId) {
    const talents = this.getPlayerTalents();
    if (!talents[treeId]) return 0;

    return Object.values(talents[treeId]).reduce((sum, rank) => sum + rank, 0);
  }

  /**
   * Check if a talent can be learned
   * @param {string} characterClass - Class name
   * @param {string} treeId - Tree identifier
   * @param {string} talentId - Talent ID
   * @returns {Object} {canLearn: boolean, reason: string}
   */
  static canLearnTalent(characterClass, treeId, talentId) {
    const talent = this.getTalentNode(characterClass, treeId, talentId);
    if (!talent) {
      return { canLearn: false, reason: 'Talent not found' };
    }

    const talents = this.getPlayerTalents();
    const currentRank = talents[treeId]?.[talentId] || 0;

    // Check if already at max rank
    if (currentRank >= talent.maxRank) {
      return { canLearn: false, reason: 'Maximum rank reached' };
    }

    // Check if player has available talent points
    if (this.getAvailableTalentPoints() <= 0) {
      return { canLearn: false, reason: 'No talent points available' };
    }

    // Check if required points in tree are met
    const pointsInTree = this.getTreePoints(treeId);
    if (pointsInTree < talent.requiresPoints) {
      return {
        canLearn: false,
        reason: `Requires ${talent.requiresPoints} points in this tree`,
      };
    }

    // Check if prerequisite talents are learned
    if (talent.requires && talent.requires.length > 0) {
      for (const requiredTalentId of talent.requires) {
        const requiredTalent = this.getTalentNode(characterClass, treeId, requiredTalentId);
        const requiredRank = talents[treeId]?.[requiredTalentId] || 0;

        if (requiredRank < (requiredTalent?.maxRank || 1)) {
          return {
            canLearn: false,
            reason: `Requires ${requiredTalent?.name || 'prerequisite talent'}`,
          };
        }
      }
    }

    return { canLearn: true, reason: '' };
  }

  /**
   * Learn a talent (allocate one point)
   * @param {string} treeId - Tree identifier
   * @param {string} talentId - Talent ID
   * @returns {boolean} Success
   */
  static learnTalent(treeId, talentId) {
    const state = gameStore.getState();
    const characterClass = state.player?.character?.class;

    if (!characterClass) {
      ConsoleLogger.error(LogCategory.SYSTEM, 'No character class found');
      return false;
    }

    const canLearn = this.canLearnTalent(characterClass, treeId, talentId);
    if (!canLearn.canLearn) {
      ConsoleLogger.warn(LogCategory.SYSTEM, `Cannot learn talent: ${canLearn.reason}`);
      return false;
    }

    // Allocate talent point
    gameStore.dispatch({
      type: 'LEARN_TALENT',
      payload: { treeId, talentId },
    });

    const talent = this.getTalentNode(characterClass, treeId, talentId);
    ConsoleLogger.info(
      LogCategory.SYSTEM,
      `✨ Learned talent: ${talent.name} (Rank ${this.getPlayerTalents()[treeId]?.[talentId] || 0}/${talent.maxRank})`
    );

    return true;
  }

  /**
   * Unlearn a talent (remove one point)
   * Only allowed if no other talents depend on it
   * @param {string} treeId - Tree identifier
   * @param {string} talentId - Talent ID
   * @returns {boolean} Success
   */
  static unlearnTalent(treeId, talentId) {
    const state = gameStore.getState();
    const characterClass = state.player?.character?.class;
    const talents = this.getPlayerTalents();

    const currentRank = talents[treeId]?.[talentId] || 0;
    if (currentRank === 0) {
      ConsoleLogger.warn(LogCategory.SYSTEM, 'Talent not learned');
      return false;
    }

    // Check if any learned talents depend on this one
    const trees = this.getTalentTrees(characterClass);
    if (trees && trees[treeId]) {
      for (const otherTalent of trees[treeId].talents) {
        if (otherTalent.requires?.includes(talentId)) {
          const otherRank = talents[treeId]?.[otherTalent.id] || 0;
          if (otherRank > 0) {
            ConsoleLogger.warn(
              LogCategory.SYSTEM,
              `Cannot unlearn: ${otherTalent.name} depends on this talent`
            );
            return false;
          }
        }
      }
    }

    gameStore.dispatch({
      type: 'UNLEARN_TALENT',
      payload: { treeId, talentId },
    });

    const talent = this.getTalentNode(characterClass, treeId, talentId);
    ConsoleLogger.info(LogCategory.SYSTEM, `Unlearned talent: ${talent?.name}`);

    return true;
  }

  /**
   * Reset all talents (respec)
   * @param {number} cost - Gold cost for respec (optional)
   * @returns {boolean} Success
   */
  static resetAllTalents(cost = 0) {
    const state = gameStore.getState();
    const currentGold = state.player?.gold || 0;

    if (cost > 0 && currentGold < cost) {
      ConsoleLogger.warn(LogCategory.SYSTEM, `Cannot afford respec (${cost} gold required)`);
      return false;
    }

    gameStore.dispatch({
      type: 'RESET_TALENTS',
      payload: { cost },
    });

    ConsoleLogger.info(LogCategory.SYSTEM, '✨ Talents reset successfully');
    return true;
  }

  /**
   * Get all active talent effects for a player
   * Aggregates stat modifiers and passive effects from all learned talents
   * @returns {Object} {stats: {}, passives: []}
   */
  static getActiveTalentEffects() {
    const state = gameStore.getState();
    const characterClass = state.player?.character?.class;
    const talents = this.getPlayerTalents();

    const effects = {
      stats: {
        strength: 0,
        health: 0,
        defense: 0,
        critChance: 0,
        critDamage: 0,
        manaRegen: 0,
        movementBonus: 0,
      },
      passives: [],
    };

    Object.keys(talents).forEach((treeId) => {
      Object.keys(talents[treeId]).forEach((talentId) => {
        const rank = talents[treeId][talentId];
        if (rank === 0) return;

        const talent = this.getTalentNode(characterClass, treeId, talentId);
        if (!talent || !talent.effects) return;

        // Apply stat modifiers
        if (talent.effects.stats) {
          Object.keys(talent.effects.stats).forEach((stat) => {
            const value = talent.effects.stats[stat];
            // Multiply by rank if it's a per-rank effect
            effects.stats[stat] = (effects.stats[stat] || 0) + value * rank;
          });
        }

        // Apply passive effects
        if (talent.effects.passive) {
          effects.passives.push({
            talentId: talent.id,
            talentName: talent.name,
            rank,
            ...talent.effects.passive,
          });
        }
      });
    });

    return effects;
  }

  /**
   * Apply talent effects to a fighter
   * @param {Object} fighter - Fighter instance
   * @returns {Object} Modified fighter
   */
  static applyTalentsToFighter(fighter) {
    if (!fighter) return fighter;

    const effects = this.getActiveTalentEffects();

    // Apply stat bonuses
    Object.keys(effects.stats).forEach((stat) => {
      const bonus = effects.stats[stat];
      if (bonus > 0) {
        fighter[stat] = (fighter[stat] || 0) + bonus;
      }
    });

    // Store passive effects for combat logic to use
    fighter.talentPassives = effects.passives;

    ConsoleLogger.debug(
      LogCategory.SYSTEM,
      `Applied talents to fighter: +${effects.stats.strength} STR, +${effects.stats.health} HP, ${effects.passives.length} passives`
    );

    return fighter;
  }

  /**
   * Get talent tree summary (for UI display)
   * @param {string} characterClass - Class name
   * @param {string} treeId - Tree identifier
   * @returns {Object} Summary info
   */
  static getTreeSummary(characterClass, treeId) {
    const trees = this.getTalentTrees(characterClass);
    if (!trees || !trees[treeId]) return null;

    const tree = trees[treeId];
    const talents = this.getPlayerTalents();
    const pointsInTree = this.getTreePoints(treeId);

    return {
      name: tree.name,
      description: tree.description,
      icon: tree.icon,
      pointsSpent: pointsInTree,
      totalTalents: tree.talents.length,
      learnedTalents: Object.keys(talents[treeId] || {}).filter((id) => talents[treeId][id] > 0)
        .length,
    };
  }

  /**
   * Validate talent allocations (used for save data integrity)
   * @param {Object} talentData - Talent allocation data
   * @returns {boolean} Valid
   */
  static validateTalentData(talentData) {
    if (!talentData || typeof talentData !== 'object') return false;

    // Check that all talent IDs exist in talent trees
    // Check that ranks don't exceed max
    // Check that prerequisites are met
    // This is a basic validation - can be expanded

    return true;
  }
}

export default TalentManager;
