import { Logger } from '../utils/logger.js';
import { soundManager } from '../utils/soundManager.js';
import { createStatusEffect } from './StatusEffect.js';

/**
 * Skill - Represents a special ability
 */
export class Skill {
  constructor(name, manaCost, cooldown, type, power, statusEffect = null) {
    this.name = name;
    this.manaCost = manaCost;
    this.cooldown = cooldown; // Turns until can use again
    this.maxCooldown = cooldown;
    this.currentCooldown = 0; // Current cooldown remaining
    this.type = type; // 'damage', 'heal', 'buff', 'debuff'
    this.power = power; // Effect magnitude
    this.statusEffect = statusEffect; // Optional status effect to apply
  }

  /**
   * Check if skill is ready to use
   */
  isReady() {
    return this.currentCooldown === 0;
  }

  /**
   * Use the skill
   * @param {Object} caster - Fighter using the skill
   * @param {Object} target - Target fighter
   * @returns {boolean} Success
   */
  use(caster, target) {
    if (!this.isReady()) {
      Logger.log(`<div class="attack-div missed-attack text-center">⏱️ ${this.name} is on cooldown! (${this.currentCooldown} turns)</div>`);
      return false;
    }

    if (caster.mana < this.manaCost) {
      Logger.log(`<div class="attack-div missed-attack text-center">💧 Not enough mana for ${this.name}!</div>`);
      return false;
    }

    caster.mana -= this.manaCost;
    this.currentCooldown = this.maxCooldown;

    this.executeEffect(caster, target);
    return true;
  }

  /**
   * Execute skill effect
   */
  executeEffect(caster, target) {
    switch(this.type) {
      case 'damage':
        const damage = Math.ceil(this.power + caster.strength * 0.5);
        target.takeDamage(damage);
        target.showFloatingDamage(damage, 'critical');
        Logger.log(`<div class="attack-div special-attack text-center">💫 <strong>${caster.name}</strong> used ${this.name}! <span class="badge bg-danger">${damage} damage</span></div>`);
        soundManager.play('special');
        break;

      case 'heal':
        const healAmount = this.power;
        caster.health = Math.min(caster.maxHealth, caster.health + healAmount);
        caster.showFloatingDamage(healAmount, 'heal');
        Logger.log(`<div class="consumable text-center">💚 <strong>${caster.name}</strong> used ${this.name}! <span class="badge bg-success">+${healAmount} HP</span></div>`);
        soundManager.play('heal');
        break;

      case 'buff':
        if (this.statusEffect) {
          const effect = createStatusEffect(this.statusEffect);
          if (effect) {
            caster.statusEffects.push(effect);
            Logger.log(`<div class="attack-div text-center" style="background: #d4edda;">${effect.icon} <strong>${caster.name}</strong> gained ${effect.icon} ${this.name}!</div>`);
            soundManager.play('event');
          }
        }
        break;

      case 'debuff':
        if (this.statusEffect) {
          const effect = createStatusEffect(this.statusEffect);
          if (effect) {
            target.statusEffects.push(effect);
            Logger.log(`<div class="attack-div text-center" style="background: #f8d7da;">${effect.icon} <strong>${target.name}</strong> was afflicted with ${this.name}!</div>`);
            soundManager.play('event');
          }
        }
        break;
    }
  }

  /**
   * Reduce cooldown by 1
   */
  tick() {
    if (this.currentCooldown > 0) {
      this.currentCooldown--;
    }
  }
}

/**
 * Predefined class-specific skills
 */
export const CLASS_SKILLS = {
  TANK: [
    new Skill('Iron Wall', 30, 3, 'buff', 0, 'STRENGTH_BOOST'),
    new Skill('Taunt Strike', 20, 2, 'damage', 40, null)
  ],
  BALANCED: [
    new Skill('Power Slash', 25, 2, 'damage', 50, null),
    new Skill('Second Wind', 30, 4, 'heal', 60, null)
  ],
  AGILE: [
    new Skill('Swift Strike', 20, 1, 'damage', 35, null),
    new Skill('Poison Dart', 25, 3, 'debuff', 0, 'POISON')
  ],
  MAGE: [
    new Skill('Fireball', 35, 2, 'damage', 70, null),
    new Skill('Mana Surge', 15, 3, 'buff', 0, 'MANA_REGEN')
  ],
  HYBRID: [
    new Skill('Versatile Strike', 25, 2, 'damage', 45, null),
    new Skill('Rejuvenate', 30, 3, 'buff', 0, 'REGENERATION')
  ],
  ASSASSIN: [
    new Skill('Shadow Strike', 40, 3, 'damage', 90, null),
    new Skill('Weaken', 25, 2, 'debuff', 0, 'STRENGTH_DEBUFF')
  ],
  BRAWLER: [
    new Skill('Haymaker', 30, 2, 'damage', 65, null),
    new Skill('Adrenaline', 20, 3, 'buff', 0, 'STRENGTH_BOOST')
  ]
};

/**
 * Assign skills to a fighter based on their class
 */
export function assignSkillsToFighter(fighter) {
  const classSkills = CLASS_SKILLS[fighter.class] || CLASS_SKILLS.BALANCED;
  // Deep clone skills so each fighter has their own cooldowns
  fighter.skills = classSkills.map(skill => Object.assign(Object.create(Object.getPrototypeOf(skill)), skill));
}
