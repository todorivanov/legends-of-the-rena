/**
 * Combo Definitions - Define all available combo chains and their effects
 */

/**
 * Combo structure:
 * - name: Display name of the combo
 * - description: What the combo does
 * - icon: Icon to display
 * - sequence: Array of actions that trigger the combo
 * - requiredClass: Optional class restriction
 * - bonus: Effects applied when combo triggers
 */

export const COMBO_DEFINITIONS = [
  // ===== UNIVERSAL COMBOS (Any Class) =====
  {
    name: 'Offensive Surge',
    description: 'Two consecutive attacks build momentum',
    icon: '⚔️',
    sequence: [
      { type: 'attack' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.3,
      extraDamage: 10,
    },
  },

  {
    name: 'Berserker Rush',
    description: 'Three attacks in a row unleash fury',
    icon: '🔥',
    sequence: [
      { type: 'attack' },
      { type: 'attack' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.5,
      extraDamage: 25,
      statusEffect: 'STRENGTH_BOOST',
    },
  },

  {
    name: 'Tactical Retreat',
    description: 'Defend then strike for calculated damage',
    icon: '🛡️',
    sequence: [
      { type: 'defend' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.4,
      heal: 15,
    },
  },

  {
    name: 'Double Defense',
    description: 'Consecutive defenses build resilience',
    icon: '🏰',
    sequence: [
      { type: 'defend' },
      { type: 'defend' },
    ],
    bonus: {
      heal: 30,
      statusEffect: 'DEFENSE_BOOST',
    },
  },

  // ===== TANK COMBOS =====
  {
    name: 'Iron Fortress',
    description: 'Defensive stance followed by devastating counter',
    icon: '🛡️⚔️',
    requiredClass: 'TANK',
    sequence: [
      { type: 'skill', skill: 'Iron Wall' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.6,
      extraDamage: 30,
      heal: 20,
    },
  },

  {
    name: 'Unstoppable Force',
    description: 'Taunt followed by powerful strike',
    icon: '💪',
    requiredClass: 'TANK',
    sequence: [
      { type: 'skill', skill: 'Taunt Strike' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.5,
      cooldownReduce: 1,
    },
  },

  // ===== BALANCED COMBOS =====
  {
    name: 'Perfect Balance',
    description: 'Attack and heal in harmony',
    icon: '⚖️',
    requiredClass: 'BALANCED',
    sequence: [
      { type: 'skill', skill: 'Power Slash' },
      { type: 'skill', skill: 'Second Wind' },
    ],
    bonus: {
      heal: 40,
      manaRestore: 20,
      cooldownReduce: 1,
    },
  },

  {
    name: 'Warrior\'s Resolve',
    description: 'Heal then unleash power',
    icon: '💚⚔️',
    requiredClass: 'BALANCED',
    sequence: [
      { type: 'skill', skill: 'Second Wind' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.4,
      extraDamage: 20,
    },
  },

  // ===== AGILE COMBOS =====
  {
    name: 'Rapid Assault',
    description: 'Swift strikes create opening for poison',
    icon: '⚡',
    requiredClass: 'AGILE',
    sequence: [
      { type: 'skill', skill: 'Swift Strike' },
      { type: 'skill', skill: 'Poison Dart' },
    ],
    bonus: {
      damageMultiplier: 1.3,
      extraDamage: 15,
      statusEffect: 'POISON',
    },
  },

  {
    name: 'Shadow Dance',
    description: 'Multiple swift strikes in succession',
    icon: '🌪️',
    requiredClass: 'AGILE',
    sequence: [
      { type: 'skill', skill: 'Swift Strike' },
      { type: 'attack' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.6,
      extraDamage: 25,
      manaRestore: 15,
    },
  },

  // ===== MAGE COMBOS =====
  {
    name: 'Arcane Inferno',
    description: 'Surge mana then unleash devastating fireball',
    icon: '🔮🔥',
    requiredClass: 'MAGE',
    sequence: [
      { type: 'skill', skill: 'Mana Surge' },
      { type: 'skill', skill: 'Fireball' },
    ],
    bonus: {
      damageMultiplier: 2.0,
      extraDamage: 50,
      manaRestore: 25,
    },
  },

  {
    name: 'Elemental Barrage',
    description: 'Chain cast for overwhelming power',
    icon: '⚡🔥',
    requiredClass: 'MAGE',
    sequence: [
      { type: 'skill', skill: 'Fireball' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.5,
      statusEffect: 'BURN',
    },
  },

  // ===== HYBRID COMBOS =====
  {
    name: 'Adaptive Strike',
    description: 'Versatility creates unexpected opportunities',
    icon: '🌟',
    requiredClass: 'HYBRID',
    sequence: [
      { type: 'skill', skill: 'Versatile Strike' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.4,
      heal: 20,
      manaRestore: 15,
    },
  },

  {
    name: 'Life Surge',
    description: 'Regeneration amplifies all actions',
    icon: '💫',
    requiredClass: 'HYBRID',
    sequence: [
      { type: 'skill', skill: 'Rejuvenate' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.3,
      heal: 30,
      statusEffect: 'REGENERATION',
    },
  },

  // ===== ASSASSIN COMBOS =====
  {
    name: 'Silent Death',
    description: 'Weaken then assassinate',
    icon: '🗡️',
    requiredClass: 'ASSASSIN',
    sequence: [
      { type: 'skill', skill: 'Weaken' },
      { type: 'skill', skill: 'Shadow Strike' },
    ],
    bonus: {
      damageMultiplier: 2.2,
      extraDamage: 60,
    },
  },

  {
    name: 'Backstab',
    description: 'Defend to hide, then strike from shadows',
    icon: '🌑',
    requiredClass: 'ASSASSIN',
    sequence: [
      { type: 'defend' },
      { type: 'skill', skill: 'Shadow Strike' },
    ],
    bonus: {
      damageMultiplier: 1.8,
      extraDamage: 40,
      cooldownReduce: 1,
    },
  },

  // ===== BRAWLER COMBOS =====
  {
    name: 'Knockout Punch',
    description: 'Adrenaline powered haymaker',
    icon: '🥊',
    requiredClass: 'BRAWLER',
    sequence: [
      { type: 'skill', skill: 'Adrenaline' },
      { type: 'skill', skill: 'Haymaker' },
    ],
    bonus: {
      damageMultiplier: 2.0,
      extraDamage: 45,
      statusEffect: 'STUN',
    },
  },

  {
    name: 'Relentless Assault',
    description: 'Continuous aggression breaks defenses',
    icon: '💥',
    requiredClass: 'BRAWLER',
    sequence: [
      { type: 'skill', skill: 'Haymaker' },
      { type: 'attack' },
      { type: 'attack' },
    ],
    bonus: {
      damageMultiplier: 1.7,
      extraDamage: 35,
      heal: 25,
    },
  },

  // ===== ADVANCED UNIVERSAL COMBOS =====
  {
    name: 'Calculated Strike',
    description: 'Defend, attack, then finish with skill',
    icon: '🎯',
    sequence: [
      { type: 'defend' },
      { type: 'attack' },
      { type: 'skill' },
    ],
    bonus: {
      damageMultiplier: 1.7,
      extraDamage: 30,
      manaRestore: 20,
      cooldownReduce: 1,
    },
  },

  {
    name: 'Overwhelming Force',
    description: 'Skill, attack, skill - unstoppable momentum',
    icon: '⚡💥',
    sequence: [
      { type: 'skill' },
      { type: 'attack' },
      { type: 'skill' },
    ],
    bonus: {
      damageMultiplier: 1.8,
      extraDamage: 40,
      heal: 25,
      manaRestore: 30,
    },
  },
];

/**
 * Get combos available for a specific class
 * @param {string} fighterClass - Fighter's class
 * @returns {Array} Filtered combo definitions
 */
export function getCombosForClass(fighterClass) {
  return COMBO_DEFINITIONS.filter(
    (combo) => !combo.requiredClass || combo.requiredClass === fighterClass
  );
}

/**
 * Get all universal combos (no class requirement)
 * @returns {Array} Universal combo definitions
 */
export function getUniversalCombos() {
  return COMBO_DEFINITIONS.filter((combo) => !combo.requiredClass);
}
