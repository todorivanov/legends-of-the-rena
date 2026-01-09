// Helpers import removed - no longer needed after Team Battle removal
import { Logger } from '../utils/logger.js';
import Consumable from './consumables.js';
import { soundManager } from '../utils/soundManager.js';

/**
 * CombatEngine - Handles all combat logic including attacks and consumables
 */
export class CombatEngine {
  /**
   * Process a single fighter vs fighter combat round
   * @param {Object} attacker - The attacking fighter
   * @param {Object} defender - The defending fighter
   * @param {number} randomNumber - Random number for determining actions
   */
  static processSingleCombat(attacker, defender, randomNumber) {
    if (randomNumber > 100) {
      defender.health -= attacker.hit();
      this.tryConsumeItem(attacker, randomNumber, 149, 160);
    } else {
      attacker.health -= defender.hit();
      this.tryConsumeItem(defender, randomNumber, 49, 60);
    }
  }

  /**
   * Process team combat where all fighters attack
   * @param {Array} attackingTeam - Team that is attacking
   * @param {Array} defendingTeam - Team that is defending
   */
  // Team Battle mode removed - keeping only Story, Single Combat, and Tournament modes

  /**
   * Try to consume an item based on probability
   * @param {Object} fighter - The fighter to consume item
   * @param {number} randomNumber - Random number for probability
   * @param {number} min - Minimum threshold
   * @param {number} max - Maximum threshold
   */
  static tryConsumeItem(fighter, randomNumber, min, max) {
    if (randomNumber > min && randomNumber < max) {
      const consumable = Consumable.getConsumable();
      fighter.health += consumable.health;
      const msg = `<div class="consumable text-center">${fighter.name} consumed ${consumable.name} which gave him ${consumable.health} HP.</div>`;
      Logger.log(msg);
      soundManager.play('heal');

      // Show floating heal number
      if (fighter.showFloatingDamage) {
        fighter.showFloatingDamage(consumable.health, 'heal');
      }
    }
  }

  /**
   * Check if combat should end (fighter defeated)
   * @returns {Object|null} Winner if combat ended, null otherwise
   */
  static checkVictoryCondition(entity1, entity2) {
    if (entity1.health <= 0) {
      return { winner: entity2, isTeam: false };
    }
    if (entity2.health <= 0) {
      return { winner: entity1, isTeam: false };
    }
    return null;
  }
}
