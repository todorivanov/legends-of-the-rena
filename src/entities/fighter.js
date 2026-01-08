import { BaseEntity } from "./baseEntity.js";

/**
 * Fighter - Represents a combat fighter with unique abilities
 * Extends BaseEntity with fighter-specific functionality
 */
export class Fighter extends BaseEntity {
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