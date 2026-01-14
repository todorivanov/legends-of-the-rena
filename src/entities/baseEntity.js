import { Helpers } from '../utils/helpers.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

import { Logger } from '../utils/logger.js';
import { soundManager } from '../utils/soundManager.js';
import { assignSkillsToFighter } from '../game/SkillSystem.js';

/**
 * BaseEntity - Base class for all combat entities
 */
export class BaseEntity {
  constructor(baseEntity) {
    this.id = baseEntity.id;
    this.name = baseEntity.name;

    // Ensure health values are valid numbers
    const initialHealth = isNaN(baseEntity.health) ? 100 : Math.max(1, baseEntity.health);
    this.health = initialHealth;
    this.maxHealth = initialHealth;

    this.image = baseEntity.image;

    // Ensure strength is a valid number
    const initialStrength = isNaN(baseEntity.strength) ? 50 : Math.max(1, baseEntity.strength);
    this.strength = initialStrength;
    this.baseStrength = initialStrength; // Store original strength

    this.description = baseEntity.description;
    this.class = baseEntity.class || 'BALANCED';
    this.level = baseEntity.level || 1; // Fighter level
    this.isPlayer = baseEntity.isPlayer || false; // Track if this is the player
    this.mana = 100; // Starting mana
    this.maxMana = 100;
    this.isDefending = false;
    this.statusEffects = []; // Array of active status effects
    this.skills = []; // Class-specific skills
    this.combo = 0; // Combo counter

    // Assign skills based on class
    assignSkillsToFighter(this);
  }

  /**
   * Perform an attack (normal or special based on chance)
   * @returns {number} Damage dealt
   */
  hit() {
    const num = Helpers.getRandomNumber(0, 101);
    if (num < 80) {
      const result = this.normalAttack();
      // normalAttack returns an object { damage, isCritical }, extract just damage
      return typeof result === 'object' ? result.damage || 0 : result;
    } else {
      return this.specialAttack();
    }
  }

  /**
   * Perform a normal attack
   * @returns {number} Damage dealt
   */
  normalAttack() {
    const shouldHit = Helpers.getRandomNumber(0, 101);
    if (shouldHit < 10) {
      const msg = `<div class="attack-div missed-attack text-center">💨 <strong>${this.name}</strong> swung but missed completely! <span class="text-muted">(0 damage)</span></div>`;
      Logger.log(msg);
      soundManager.play('miss');
      return { damage: 0, isCritical: false };
    } else {
      const isCritical = Math.random() < 0.15; // 15% crit chance
      const baseDmg = Math.ceil(this.strength * 0.4 + Helpers.getRandomNumber(0, 40));
      const dmg = isCritical ? Math.ceil(baseDmg * 1.5) : baseDmg;

      const critBadge = isCritical ? '<span class="badge bg-danger">CRITICAL!</span> ' : '';
      const attackClass = isCritical ? 'critical-hit' : 'normal-attack';
      const msg = `<div class="attack-div ${attackClass} text-center">⚔️ <strong>${this.name}</strong> landed a ${isCritical ? 'devastating' : 'solid'} hit! ${critBadge}<span class="badge bg-warning">${dmg} damage</span></div>`;
      Logger.log(msg);
      soundManager.play('hit');
      this.showFloatingDamage(dmg, isCritical ? 'critical' : 'normal');
      return { damage: dmg, isCritical };
    }
  }

  /**
   * Perform a special attack
   * @returns {number} Damage dealt
   */
  specialAttack() {
    const shouldHit = Helpers.getRandomNumber(0, 101);
    if (shouldHit < 10) {
      const msg = `<div class="attack-div missed-attack text-center">💥 <strong>${this.name}</strong> attempted a special attack but it failed! <span class="text-muted">(0 damage)</span></div>`;
      Logger.log(msg);
      soundManager.play('miss');
      return 0;
    } else {
      const dmg = Math.ceil(this.strength * 0.8 + Helpers.getRandomNumber(20, 80));
      const msg = `<div class="attack-div special-attack text-center">🔥 <strong>${this.name}</strong> unleashed a devastating special attack! <span class="badge bg-danger">${dmg} damage</span></div>`;
      Logger.log(msg);
      soundManager.play('special');
      this.showFloatingDamage(dmg, 'critical');
      return dmg;
    }
  }

  /**
   * Perform a defend action (reduce next damage taken)
   */
  defend() {
    this.isDefending = true;
    const msg = `<div class="attack-div text-center" style="background: #d1ecf1; border-left-color: #17a2b8;">🛡️ <strong>${this.name}</strong> takes a defensive stance!</div>`;
    Logger.log(msg);
    soundManager.play('heal');
  }

  /**
   * Use special skill (class-specific)
   */
  useSkill() {
    if (this.mana < 30) {
      const msg = `<div class="attack-div missed-attack text-center">${this.name} doesn't have enough mana!</div>`;
      Logger.log(msg);
      return 0;
    }

    this.mana -= 30;
    const dmg = Math.ceil(this.strength * 1.2 + Helpers.getRandomNumber(30, 100));
    const msg = `<div class="attack-div special-attack text-center">💫 <strong>${this.name}</strong> unleashed their special skill! <span class="badge bg-danger">${dmg} damage</span></div>`;
    Logger.log(msg);
    soundManager.play('special');
    this.showFloatingDamage(dmg, 'critical');
    return dmg;
  }

  /**
   * Use healing item
   */
  useItem() {
    const healAmount = 20;
    this.health = Math.min(this.maxHealth, this.health + healAmount);
    const msg = `<div class="consumable text-center">🧪 <strong>${this.name}</strong> used a healing potion! <span class="badge bg-success">+${healAmount} HP</span></div>`;
    Logger.log(msg);
    soundManager.play('heal');
    this.showFloatingDamage(healAmount, 'heal');
  }

  /**
   * Regenerate mana each turn
   */
  regenerateMana() {
    this.mana = Math.min(this.maxMana, this.mana + 10);
  }

  /**
   * Process status effects at start of turn
   */
  processStatusEffects() {
    const activeEffects = [];

    for (const effect of this.statusEffects) {
      effect.apply(this);

      if (effect.tick()) {
        activeEffects.push(effect);
      } else {
        // Effect expired, remove it
        effect.remove(this);
        const msg = `<div class="attack-div text-center" style="background: #fff3cd;">${effect.icon} ${this.name}'s ${effect.name} wore off.</div>`;
        Logger.log(msg);
      }
    }

    this.statusEffects = activeEffects;
  }

  /**
   * Tick cooldowns on all skills
   */
  tickSkillCooldowns() {
    for (const skill of this.skills) {
      skill.tick();
    }
  }

  /**
   * Take damage with defense modifier
   */
  takeDamage(damage) {
    // Ensure damage is a valid number
    let actualDamage = isNaN(damage) ? 0 : Math.max(0, damage);

    if (this.isDefending) {
      actualDamage = Math.ceil(actualDamage * 0.5);
      const msg = `<div class="attack-div text-center" style="background: #d1ecf1;">🛡️ <strong>${this.name}</strong> blocked 50% of the damage!</div>`;
      Logger.log(msg);
      this.isDefending = false; // Defend only lasts one turn
    }

    // Ensure health is a valid number before subtracting
    if (isNaN(this.health)) {
      ConsoleLogger.error(
        LogCategory.COMBAT,
        `${this.name} has NaN health! Resetting to maxHealth.`
      );
      this.health = this.maxHealth || 100;
    }

    this.health = Math.max(0, this.health - actualDamage);
    return actualDamage;
  }

  /**
   * Show floating damage number animation
   * @param {number} damage - Damage amount
   * @param {string} type - Damage type (normal, critical, heal)
   */
  showFloatingDamage(damage, type = 'normal') {
    const damageElement = document.createElement('div');
    damageElement.className = `damage-float ${type}`;
    damageElement.textContent = type === 'heal' ? `+${damage}` : `-${damage}`;

    // Position randomly near center of screen
    const x = window.innerWidth / 2 + Helpers.getRandomNumber(-100, 100);
    const y = window.innerHeight / 2 + Helpers.getRandomNumber(-50, 50);
    damageElement.style.left = `${x}px`;
    damageElement.style.top = `${y}px`;

    document.body.appendChild(damageElement);

    // Remove after animation completes
    setTimeout(() => {
      damageElement.remove();
    }, 1500);
  }
}
