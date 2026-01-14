import { BaseEntity } from './baseEntity.js';
import { getClassById } from '../data/classes.js';
import { EQUIPMENT_DATABASE } from '../data/equipment.js';
import { TalentManager } from '../game/TalentManager.js';

/**
 * Fighter - Represents a combat fighter with unique abilities
 * Extends BaseEntity with fighter-specific functionality
 */
export class Fighter extends BaseEntity {
  /**
   * Get fighter's attack range
   * Combines base class range + equipped weapon range
   * @returns {number} - Attack range in grid cells
   */
  getAttackRange() {
    // Get base class range
    const classData = getClassById(this.class);
    let range = classData?.stats?.attackRange || 1;

    // Add weapon range if equipped
    if (this.equipped && this.equipped.weapon) {
      const weapon = EQUIPMENT_DATABASE[this.equipped.weapon];
      if (weapon && weapon.range) {
        range = Math.max(range, weapon.range); // Use highest range
      }
    }

    return range;
  }

  /**
   * Get fighter's current effectiveness (based on HP percentage)
   * @returns {number} - Effectiveness multiplier (0-1)
   */
  getEffectiveness() {
    const hpPercent = this.health / this.maxHealth;
    return Math.max(0.5, hpPercent); // Min 50% effectiveness even when low HP
  }

  /**
   * Check if fighter can use a specific skill
   * @param {Object} skill - Skill to check
   * @returns {boolean} - Can use skill
   */
  canUseSkill(skill) {
    if (!skill) return false;
    return this.mana >= skill.manaCost && skill.cooldownRemaining === 0;
  }

  /**
   * Calculate damage output modifier
   * @returns {number} - Damage multiplier
   */
  getDamageModifier() {
    let modifier = 1.0;

    // Effectiveness based on HP
    modifier *= this.getEffectiveness();

    // Class-based modifiers
    if (this.class === 'BRAWLER') {
      modifier *= 1.1; // Brawlers deal 10% more damage
    } else if (this.class === 'TANK') {
      modifier *= 0.8; // Tanks deal less damage but have more HP
    }

    return modifier;
  }

  /**
   * Calculate defense rating
   * @returns {number} - Defense value
   */
  getDefenseRating() {
    let defense = this.baseDefense || 0;

    // Class bonuses
    if (this.class === 'TANK') {
      defense += 10;
    }

    // Defending stance bonus
    if (this.isDefending) {
      defense += 20;
    }

    return defense;
  }

  /**
   * Restore fighter to full health and mana
   */
  fullRestore() {
    this.health = this.maxHealth;
    this.mana = this.maxMana;
    this.statusEffects = [];
    this.isDefending = false;
    this.combo = 0;
  }

  /**
   * Apply talent effects to fighter stats
   * Called when fighter is created or talents change
   * @returns {Fighter} - This fighter with talents applied
   */
  applyTalents() {
    if (!this.isPlayer) return this; // Only apply to player fighter

    TalentManager.applyTalentsToFighter(this);
    return this;
  }

  /**
   * Check if fighter has a specific talent passive
   * @param {string} passiveType - Type of passive to check
   * @returns {Object|null} - Passive effect object or null
   */
  getTalentPassive(passiveType) {
    if (!this.talentPassives) return null;
    return this.talentPassives.find((p) => p.type === passiveType) || null;
  }

  /**
   * Check if talent passive should proc
   * @param {string} passiveType - Type of passive
   * @returns {boolean} - Whether passive should activate
   */
  shouldProcTalentPassive(passiveType) {
    const passive = this.getTalentPassive(passiveType);
    if (!passive) return false;

    // Check chance-based passives
    if (passive.chance) {
      return Math.random() < passive.chance;
    }

    return true;
  }

  /**
   * Apply damage reduction based on defense
   * @param {number} incomingDamage - Raw damage amount
   * @returns {number} - Reduced damage
   */
  applyDefense(incomingDamage) {
    const defense = this.getDefenseRating();
    const reduction = defense * 0.5; // Each defense point reduces 0.5 damage
    return Math.max(1, incomingDamage - reduction);
  }
}
