/**
 * StatusEffect - Represents buffs and debuffs
 */
export class StatusEffect {
  constructor(name, type, duration, value, icon) {
    this.name = name; // Effect name
    this.type = type; // 'buff' or 'debuff'
    this.duration = duration; // Turns remaining
    this.value = value; // Effect magnitude
    this.icon = icon; // Display icon
  }

  /**
   * Reduce duration by 1 turn
   * @returns {boolean} True if effect is still active
   */
  tick() {
    this.duration--;
    return this.duration > 0;
  }

  /**
   * Apply effect to fighter
   * @param {Object} fighter - Target fighter
   */
  apply(fighter) {
    switch(this.name) {
      case 'strength_boost':
        fighter.strength += this.value;
        break;
      case 'strength_debuff':
        fighter.strength -= this.value;
        break;
      case 'regeneration':
        fighter.health = Math.min(fighter.maxHealth, fighter.health + this.value);
        fighter.showFloatingDamage(this.value, 'heal');
        break;
      case 'poison':
        fighter.health -= this.value;
        fighter.showFloatingDamage(this.value, 'critical');
        break;
      case 'mana_regen':
        fighter.mana = Math.min(fighter.maxMana, fighter.mana + this.value);
        break;
    }
  }

  /**
   * Remove effect from fighter
   * @param {Object} fighter - Target fighter
   */
  remove(fighter) {
    switch(this.name) {
      case 'strength_boost':
        fighter.strength -= this.value;
        break;
      case 'strength_debuff':
        fighter.strength += this.value;
        break;
    }
  }
}

/**
 * Predefined status effects
 */
export const STATUS_EFFECTS = {
  STRENGTH_BOOST: {
    name: 'strength_boost',
    type: 'buff',
    duration: 3,
    value: 20,
    icon: '💪',
    description: '+20 Strength for 3 turns'
  },
  STRENGTH_DEBUFF: {
    name: 'strength_debuff',
    type: 'debuff',
    duration: 3,
    value: 15,
    icon: '🥴',
    description: '-15 Strength for 3 turns'
  },
  REGENERATION: {
    name: 'regeneration',
    type: 'buff',
    duration: 5,
    value: 15,
    icon: '💚',
    description: '+15 HP per turn for 5 turns'
  },
  POISON: {
    name: 'poison',
    type: 'debuff',
    duration: 4,
    value: 10,
    icon: '☠️',
    description: '-10 HP per turn for 4 turns'
  },
  MANA_REGEN: {
    name: 'mana_regen',
    type: 'buff',
    duration: 3,
    value: 20,
    icon: '✨',
    description: '+20 MP per turn for 3 turns'
  }
};

/**
 * Create a status effect from template
 */
export function createStatusEffect(effectKey) {
  const template = STATUS_EFFECTS[effectKey];
  if (!template) return null;
  
  return new StatusEffect(
    template.name,
    template.type,
    template.duration,
    template.value,
    template.icon
  );
}
