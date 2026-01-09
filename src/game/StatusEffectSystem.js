/**
 * Enhanced Status Effect System with Interaction Matrix
 * Manages complex status effects and their interactions
 */

import { StatusEffect } from './StatusEffect.js';

/**
 * Status Effect Categories
 */
export const EffectCategory = {
  BUFF: 'buff',
  DEBUFF: 'debuff',
  DOT: 'dot', // Damage over time
  HOT: 'hot', // Heal over time
  CROWD_CONTROL: 'cc',
  MODIFIER: 'modifier',
};

/**
 * Enhanced Status Effect with interactions
 */
export class EnhancedStatusEffect extends StatusEffect {
  constructor(name, type, duration, value, icon, config = {}) {
    super(name, type, duration, value, icon);

    this.category = config.category || EffectCategory.MODIFIER;
    this.stackable = config.stackable || false;
    this.maxStacks = config.maxStacks || 1;
    this.stacks = 1;
    this.canDispel = config.canDispel !== false;
    this.unique = config.unique || false;
    this.tags = config.tags || [];
    this.onApply = config.onApply || null;
    this.onRemove = config.onRemove || null;
    this.onStack = config.onStack || null;
    this.metadata = config.metadata || {};
  }

  /**
   * Stack this effect
   */
  stack() {
    if (!this.stackable) return false;
    if (this.stacks >= this.maxStacks) return false;

    this.stacks++;
    if (this.onStack) {
      this.onStack(this);
    }
    return true;
  }

  /**
   * Get effective value with stacks
   */
  getEffectiveValue() {
    return this.value * this.stacks;
  }

  /**
   * Check if effect has tag
   */
  hasTag(tag) {
    return this.tags.includes(tag);
  }
}

/**
 * Status Effect Definitions
 */
export const ENHANCED_STATUS_EFFECTS = {
  // Existing effects (enhanced)
  STRENGTH_BOOST: {
    name: 'strength_boost',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 3,
    value: 20,
    icon: '💪',
    description: '+20 Strength for 3 turns',
    tags: ['stat_boost'],
  },

  DEFENSE_BOOST: {
    name: 'defense_boost',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 3,
    value: 15,
    icon: '🛡️',
    description: '+15 Defense for 3 turns',
    tags: ['stat_boost'],
  },

  REGENERATION: {
    name: 'regeneration',
    type: 'buff',
    category: EffectCategory.HOT,
    duration: 5,
    value: 15,
    icon: '💚',
    description: '+15 HP per turn for 5 turns',
    stackable: true,
    maxStacks: 3,
    tags: ['healing'],
  },

  POISON: {
    name: 'poison',
    type: 'debuff',
    category: EffectCategory.DOT,
    duration: 4,
    value: 10,
    icon: '☠️',
    description: '-10 HP per turn for 4 turns',
    stackable: true,
    maxStacks: 5,
    tags: ['damage', 'nature'],
  },

  BURN: {
    name: 'burn',
    type: 'debuff',
    category: EffectCategory.DOT,
    duration: 3,
    value: 12,
    icon: '🔥',
    description: '-12 HP per turn for 3 turns',
    stackable: true,
    maxStacks: 3,
    tags: ['damage', 'fire'],
  },

  STUN: {
    name: 'stun',
    type: 'debuff',
    category: EffectCategory.CROWD_CONTROL,
    duration: 1,
    value: 0,
    icon: '💫',
    description: 'Cannot act for 1 turn',
    tags: ['cc', 'disable'],
  },

  // NEW EFFECTS

  BLEED: {
    name: 'bleed',
    type: 'debuff',
    category: EffectCategory.DOT,
    duration: 4,
    value: 8,
    icon: '🩸',
    description: '-8 HP per turn, increases with actions',
    stackable: true,
    maxStacks: 5,
    tags: ['damage', 'physical'],
    metadata: { actionCounter: 0 },
  },

  FROZEN: {
    name: 'frozen',
    type: 'debuff',
    category: EffectCategory.CROWD_CONTROL,
    duration: 2,
    value: 30, // % stat reduction
    icon: '❄️',
    description: '-30% Speed, vulnerable to shatter',
    tags: ['cc', 'ice', 'shatterable'],
  },

  SHOCK: {
    name: 'shock',
    type: 'debuff',
    category: EffectCategory.DOT,
    duration: 2,
    value: 15,
    icon: '⚡',
    description: '-15 HP per turn, chains to apply',
    tags: ['damage', 'lightning', 'chain'],
  },

  CURSE: {
    name: 'curse',
    type: 'debuff',
    category: EffectCategory.MODIFIER,
    duration: 4,
    value: 50, // % healing reduction
    icon: '🌑',
    description: '-50% healing received',
    tags: ['healing_reduction', 'dark'],
  },

  BLESS: {
    name: 'bless',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 3,
    value: 25, // % damage increase
    icon: '✨',
    description: '+25% damage dealt',
    tags: ['damage_boost', 'holy'],
  },

  WEAKNESS: {
    name: 'weakness',
    type: 'debuff',
    category: EffectCategory.DEBUFF,
    duration: 3,
    value: 15, // Flat stat reduction
    icon: '😰',
    description: '-15 to all stats',
    tags: ['stat_debuff'],
  },

  HASTE: {
    name: 'haste',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 3,
    value: 40, // % speed increase
    icon: '💨',
    description: '+40% action speed',
    tags: ['speed_boost', 'time'],
  },

  SLOW: {
    name: 'slow',
    type: 'debuff',
    category: EffectCategory.CROWD_CONTROL,
    duration: 3,
    value: 30, // % speed reduction
    icon: '🐌',
    description: '-30% action speed',
    tags: ['speed_debuff', 'time'],
  },

  SHIELD: {
    name: 'shield',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 3,
    value: 50, // Damage absorption
    icon: '🔰',
    description: 'Absorbs 50 damage',
    tags: ['protection', 'absorption'],
    metadata: { absorbedDamage: 0 },
  },

  REFLECT: {
    name: 'reflect',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 2,
    value: 30, // % damage reflected
    icon: '🪞',
    description: 'Reflects 30% damage back',
    tags: ['protection', 'counter'],
  },

  VULNERABLE: {
    name: 'vulnerable',
    type: 'debuff',
    category: EffectCategory.DEBUFF,
    duration: 2,
    value: 50, // % increased damage taken
    icon: '💔',
    description: '+50% damage taken',
    tags: ['damage_amp'],
  },

  FORTIFY: {
    name: 'fortify',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 3,
    value: 30, // % damage reduction
    icon: '⛰️',
    description: '-30% damage taken',
    stackable: true,
    maxStacks: 2,
    tags: ['damage_reduction'],
  },

  ENRAGE: {
    name: 'enrage',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 2,
    value: 40, // % damage increase, % defense decrease
    icon: '😡',
    description: '+40% damage, -20% defense',
    tags: ['berserk'],
    metadata: { defenseReduction: 20 },
  },

  SILENCE: {
    name: 'silence',
    type: 'debuff',
    category: EffectCategory.CROWD_CONTROL,
    duration: 2,
    value: 0,
    icon: '🔇',
    description: 'Cannot use skills',
    tags: ['cc', 'disable'],
  },

  CLARITY: {
    name: 'clarity',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 3,
    value: 50, // % mana cost reduction
    icon: '🧠',
    description: '-50% mana costs',
    tags: ['mana'],
  },

  THORNS: {
    name: 'thorns',
    type: 'buff',
    category: EffectCategory.BUFF,
    duration: 4,
    value: 15, // Flat damage return
    icon: '🌹',
    description: 'Return 15 damage when hit',
    stackable: true,
    maxStacks: 3,
    tags: ['counter', 'damage'],
  },
};

/**
 * Status Effect Interaction Matrix
 * Defines how effects interact with each other
 */
export const EFFECT_INTERACTIONS = {
  // Fire interactions
  burn_frozen: {
    trigger: ['burn', 'frozen'],
    result: 'dispel_frozen',
    description: 'Burn melts Frozen',
    priority: 10,
  },

  // Ice interactions
  frozen_burn: {
    trigger: ['frozen', 'burn'],
    result: 'dispel_burn',
    description: 'Frozen extinguishes Burn',
    priority: 10,
  },

  frozen_shatter: {
    trigger: ['frozen', 'heavy_damage'],
    result: 'shatter',
    description: 'Frozen can shatter on heavy hit',
    priority: 15,
  },

  // Poison interactions
  poison_regeneration: {
    trigger: ['poison', 'regeneration'],
    result: 'reduce_both',
    description: 'Poison and Regen partially cancel',
    priority: 5,
  },

  // Lightning interactions
  shock_wet: {
    trigger: ['shock', 'wet'],
    result: 'amplify_shock',
    description: 'Shock deals double damage when wet',
    priority: 8,
  },

  // Curse interactions
  curse_regeneration: {
    trigger: ['curse', 'regeneration'],
    result: 'reduce_healing',
    description: 'Curse reduces healing effects',
    priority: 7,
  },

  curse_bless: {
    trigger: ['curse', 'bless'],
    result: 'dispel_both',
    description: 'Curse and Bless cancel each other',
    priority: 12,
  },

  // Haste/Slow interactions
  haste_slow: {
    trigger: ['haste', 'slow'],
    result: 'dispel_both',
    description: 'Haste and Slow cancel each other',
    priority: 10,
  },

  // Vulnerable/Fortify interactions
  vulnerable_fortify: {
    trigger: ['vulnerable', 'fortify'],
    result: 'reduce_both',
    description: 'Vulnerable and Fortify partially cancel',
    priority: 8,
  },

  // Bleed interactions
  bleed_action: {
    trigger: ['bleed', 'action_taken'],
    result: 'stack_bleed',
    description: 'Actions worsen Bleeding',
    priority: 5,
  },

  // Shield interactions
  shield_vulnerable: {
    trigger: ['shield', 'vulnerable'],
    result: 'reduce_vulnerable',
    description: 'Shield reduces Vulnerable effect',
    priority: 6,
  },

  // Enrage interactions
  enrage_weakness: {
    trigger: ['enrage', 'weakness'],
    result: 'reduce_weakness',
    description: 'Enrage partially overcomes Weakness',
    priority: 7,
  },
};

/**
 * Status Effect Manager
 * Handles effect application, interactions, and processing
 */
export class StatusEffectManager {
  constructor() {
    this.effects = new Map(); // fighter.id -> effects array
  }

  /**
   * Apply effect to fighter
   * @param {Object} fighter - Target fighter
   * @param {string} effectKey - Effect key
   * @returns {boolean} Success
   */
  applyEffect(fighter, effectKey) {
    const template = ENHANCED_STATUS_EFFECTS[effectKey];
    if (!template) return false;

    const effects = this.getEffects(fighter);

    // Check for existing effect
    const existing = effects.find((e) => e.name === template.name);

    if (existing) {
      if (template.stackable) {
        const stacked = existing.stack();
        if (stacked) {
          console.log(`📚 ${effectKey} stacked on ${fighter.name} (${existing.stacks} stacks)`);
        }
        return stacked;
      } else {
        // Refresh duration
        existing.duration = Math.max(existing.duration, template.duration);
        return true;
      }
    }

    // Create new effect
    const effect = new EnhancedStatusEffect(
      template.name,
      template.type,
      template.duration,
      template.value,
      template.icon,
      template
    );

    effects.push(effect);
    this.setEffects(fighter, effects);

    // Apply initial effect
    if (effect.onApply) {
      effect.onApply(fighter, effect);
    } else {
      effect.apply(fighter);
    }

    // Check for interactions
    this.checkInteractions(fighter, effect);

    console.log(`✨ ${effectKey} applied to ${fighter.name}`);
    return true;
  }

  /**
   * Remove effect from fighter
   * @param {Object} fighter - Target fighter
   * @param {string} effectName - Effect name
   */
  removeEffect(fighter, effectName) {
    const effects = this.getEffects(fighter);
    const index = effects.findIndex((e) => e.name === effectName);

    if (index === -1) return false;

    const effect = effects[index];

    // Call onRemove
    if (effect.onRemove) {
      effect.onRemove(fighter, effect);
    } else {
      effect.remove(fighter);
    }

    effects.splice(index, 1);
    this.setEffects(fighter, effects);

    console.log(`🔄 ${effectName} removed from ${fighter.name}`);
    return true;
  }

  /**
   * Process all effects for a fighter
   * @param {Object} fighter - Target fighter
   */
  processEffects(fighter) {
    const effects = this.getEffects(fighter);
    const toRemove = [];

    effects.forEach((effect) => {
      // Apply effect
      effect.apply(fighter);

      // Tick duration
      const stillActive = effect.tick();

      if (!stillActive) {
        toRemove.push(effect.name);
      }
    });

    // Remove expired effects
    toRemove.forEach((name) => this.removeEffect(fighter, name));
  }

  /**
   * Check for effect interactions
   * @param {Object} fighter - Target fighter
   * @param {EnhancedStatusEffect} _newEffect - Newly applied effect
   */
  checkInteractions(fighter, _newEffect) {
    const effects = this.getEffects(fighter);

    Object.entries(EFFECT_INTERACTIONS).forEach(([_key, interaction]) => {
      const triggers = interaction.trigger;

      // Check if all triggers are present
      const hasAllTriggers = triggers.every((trigger) => {
        if (trigger === 'heavy_damage') return false; // Handled separately
        return effects.some((e) => e.name === trigger);
      });

      if (hasAllTriggers) {
        this.executeInteraction(fighter, interaction);
      }
    });
  }

  /**
   * Execute an interaction
   * @param {Object} fighter - Target fighter
   * @param {Object} interaction - Interaction definition
   */
  executeInteraction(fighter, interaction) {
    console.log(`⚡ Interaction: ${interaction.description}`);

    switch (interaction.result) {
      case 'dispel_frozen':
        this.removeEffect(fighter, 'frozen');
        break;

      case 'dispel_burn':
        this.removeEffect(fighter, 'burn');
        break;

      case 'dispel_both':
        interaction.trigger.forEach((name) => this.removeEffect(fighter, name));
        break;

      case 'reduce_both': {
        const effects = this.getEffects(fighter);
        interaction.trigger.forEach((name) => {
          const effect = effects.find((e) => e.name === name);
          if (effect) {
            effect.value = Math.floor(effect.value * 0.5);
            effect.duration = Math.max(1, effect.duration - 1);
          }
        });
        break;
      }

      case 'amplify_shock': {
        const shock = this.getEffects(fighter).find((e) => e.name === 'shock');
        if (shock) {
          shock.value *= 2;
        }
        break;
      }

      case 'reduce_healing': {
        const regen = this.getEffects(fighter).find((e) => e.name === 'regeneration');
        if (regen) {
          regen.value = Math.floor(regen.value * 0.5);
        }
        break;
      }

      case 'stack_bleed': {
        const bleed = this.getEffects(fighter).find((e) => e.name === 'bleed');
        if (bleed && bleed.stackable) {
          bleed.stack();
        }
        break;
      }

      case 'shatter': {
        // Deal bonus damage based on frozen stacks
        const frozen = this.getEffects(fighter).find((e) => e.name === 'frozen');
        if (frozen) {
          const shatterDamage = 30;
          fighter.takeDamage(shatterDamage);
          this.removeEffect(fighter, 'frozen');
          console.log(`💥 Shatter! ${shatterDamage} bonus damage`);
        }
        break;
      }
    }
  }

  /**
   * Get effects for fighter
   */
  getEffects(fighter) {
    if (!this.effects.has(fighter.id)) {
      this.effects.set(fighter.id, []);
    }
    return this.effects.get(fighter.id);
  }

  /**
   * Set effects for fighter
   */
  setEffects(fighter, effects) {
    this.effects.set(fighter.id, effects);

    // Update fighter's statusEffects property for compatibility
    fighter.statusEffects = effects;
  }

  /**
   * Check if fighter has effect
   */
  hasEffect(fighter, effectName) {
    return this.getEffects(fighter).some((e) => e.name === effectName);
  }

  /**
   * Get effect by name
   */
  getEffect(fighter, effectName) {
    return this.getEffects(fighter).find((e) => e.name === effectName);
  }

  /**
   * Clear all effects from fighter
   */
  clearEffects(fighter) {
    const effects = this.getEffects(fighter);
    effects.forEach((effect) => {
      if (effect.onRemove) {
        effect.onRemove(fighter, effect);
      } else {
        effect.remove(fighter);
      }
    });
    this.setEffects(fighter, []);
  }

  /**
   * Get all active effects by category
   */
  getEffectsByCategory(fighter, category) {
    return this.getEffects(fighter).filter((e) => e.category === category);
  }

  /**
   * Get all active effects by tag
   */
  getEffectsByTag(fighter, tag) {
    return this.getEffects(fighter).filter((e) => e.hasTag(tag));
  }

  /**
   * Dispel effects
   * @param {Object} fighter - Target fighter
   * @param {number} count - Number of effects to dispel
   * @param {string} type - Effect type to target ('buff' or 'debuff')
   */
  dispel(fighter, count = 1, type = 'debuff') {
    const effects = this.getEffects(fighter).filter((e) => e.type === type && e.canDispel);

    for (let i = 0; i < Math.min(count, effects.length); i++) {
      this.removeEffect(fighter, effects[i].name);
    }
  }
}

// Singleton instance
export const statusEffectManager = new StatusEffectManager();

// Convenience functions
export const applyEffect = (fighter, effectKey) =>
  statusEffectManager.applyEffect(fighter, effectKey);
export const removeEffect = (fighter, effectName) =>
  statusEffectManager.removeEffect(fighter, effectName);
export const processEffects = (fighter) => statusEffectManager.processEffects(fighter);
export const hasEffect = (fighter, effectName) =>
  statusEffectManager.hasEffect(fighter, effectName);
export const clearEffects = (fighter) => statusEffectManager.clearEffects(fighter);
export const dispelEffects = (fighter, count, type) =>
  statusEffectManager.dispel(fighter, count, type);
