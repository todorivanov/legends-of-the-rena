/**
 * Character Classes Database
 * Defines all playable classes with stats, abilities, and mechanics
 */

export const CHARACTER_CLASSES = {
  BALANCED: {
    id: 'BALANCED',
    name: 'Balanced Fighter',
    icon: '⚖️',
    description: 'A well-rounded warrior with no weaknesses.',
    lore: 'Masters of adaptability, Balanced Fighters excel in all situations.',

    // Base Stats
    stats: {
      healthMod: 1.0, // 400 HP base
      strengthMod: 1.0, // 10 STR base
      defenseMod: 1.0, // Normal defense
      manaRegen: 5, // Mana per turn
      critChance: 0.15, // 15% crit chance
      critDamage: 1.5, // 150% crit damage
      attackRange: 1, // Melee range
    },

    // Passive Abilities
    passive: {
      name: 'Versatility',
      description:
        'Gain +5% to all stats for each different action type used (attack, skill, defend, item)',
      icon: '✨',
    },

    // Class-specific mechanics
    mechanics: {
      skillCostReduction: 0,
      defendBonus: 0,
      comboBonus: 0,
      healingBonus: 0,
    },
  },

  WARRIOR: {
    id: 'WARRIOR',
    name: 'Warrior',
    icon: '⚔️',
    description: 'High damage dealer with strong offensive capabilities.',
    lore: 'Warriors live for battle, overwhelming foes with devastating attacks.',

    stats: {
      healthMod: 0.9, // 360 HP
      strengthMod: 1.3, // 13 STR
      defenseMod: 0.95, // Slightly lower defense
      manaRegen: 4, // Lower mana regen
      critChance: 0.2, // 20% crit chance (higher)
      critDamage: 1.75, // 175% crit damage (higher)
      attackRange: 1, // Melee range
    },

    passive: {
      name: 'Battle Fury',
      description:
        'Critical hits reduce skill cooldowns by 1 turn and grant +10% damage for next attack',
      icon: '🔥',
    },

    mechanics: {
      skillCostReduction: 0,
      defendBonus: -0.1, // 10% less effective defend
      comboBonus: 0.05, // +5% damage per combo hit
      healingBonus: 0,
    },
  },

  TANK: {
    id: 'TANK',
    name: 'Tank',
    icon: '🛡️',
    description: 'Extremely durable with high defense but lower damage.',
    lore: 'Immovable fortresses who protect allies and outlast any threat.',

    stats: {
      healthMod: 1.5, // 600 HP
      strengthMod: 0.6, // 6 STR
      defenseMod: 1.5, // 50% more defense
      manaRegen: 6, // Higher mana regen
      critChance: 0.1, // 10% crit chance (lower)
      critDamage: 1.25, // 125% crit damage (lower)
      attackRange: 1, // Melee range
    },

    passive: {
      name: 'Iron Will',
      description:
        'Defending grants a shield that absorbs 30% of next damage taken. Heal 5% max HP each turn.',
      icon: '🛡️',
    },

    mechanics: {
      skillCostReduction: 0,
      defendBonus: 0.3, // 30% more damage reduction when defending (total 80%)
      comboBonus: 0,
      healingBonus: 0.2, // 20% more healing from items
    },
  },

  GLASS_CANNON: {
    id: 'GLASS_CANNON',
    name: 'Glass Cannon',
    icon: '💥',
    description: 'Extreme damage output but very fragile.',
    lore: 'Risk-takers who sacrifice everything for devastating power.',

    stats: {
      healthMod: 0.75, // 300 HP
      strengthMod: 2.0, // 20 STR (massive)
      defenseMod: 0.7, // 30% less defense
      manaRegen: 3, // Low mana regen
      critChance: 0.25, // 25% crit chance (very high)
      critDamage: 2.0, // 200% crit damage (massive)
      attackRange: 1, // Melee range
    },

    passive: {
      name: 'Glass Cannon',
      description: 'Deal 15% more damage for every 25% HP missing. Skills cost 30% less mana.',
      icon: '💥',
    },

    mechanics: {
      skillCostReduction: 0.3, // 30% less mana cost
      defendBonus: -0.2, // 20% less effective defend
      comboBonus: 0.08, // +8% damage per combo hit
      healingBonus: -0.1, // 10% less healing
    },
  },

  BRUISER: {
    id: 'BRUISER',
    name: 'Bruiser',
    icon: '👊',
    description: 'Balanced between offense and defense with sustain.',
    lore: 'Tough brawlers who heal through combat and never back down.',

    stats: {
      healthMod: 1.25, // 500 HP
      strengthMod: 0.9, // 9 STR
      defenseMod: 1.1, // 10% more defense
      manaRegen: 5, // Normal mana regen
      critChance: 0.12, // 12% crit chance
      critDamage: 1.4, // 140% crit damage
      attackRange: 1, // Melee range
    },

    passive: {
      name: 'Lifesteal',
      description: 'Heal for 10% of damage dealt. Gain 2% max HP permanently every 3 kills.',
      icon: '💪',
    },

    mechanics: {
      skillCostReduction: 0,
      defendBonus: 0.1, // 10% more effective defend
      comboBonus: 0,
      healingBonus: 0.15, // 15% more healing
    },
  },

  MAGE: {
    id: 'MAGE',
    name: 'Mage',
    icon: '🔮',
    description: 'Powerful spellcaster with devastating skills.',
    lore: 'Arcane masters who bend reality with powerful magic.',

    stats: {
      healthMod: 0.85, // 340 HP
      strengthMod: 0.8, // 8 STR (low basic attacks)
      defenseMod: 0.9, // 10% less defense
      manaRegen: 10, // Very high mana regen
      critChance: 0.1, // 10% crit chance
      critDamage: 2.5, // 250% crit damage (massive crits but rare)
      attackRange: 3, // Ranged magic attacks
    },

    passive: {
      name: 'Arcane Power',
      description:
        'Skills deal 30% more damage. Using a skill grants +20% damage on next basic attack.',
      icon: '✨',
    },

    mechanics: {
      skillCostReduction: 0.2, // 20% less mana cost
      defendBonus: 0,
      comboBonus: 0,
      healingBonus: 0,
    },
  },

  ASSASSIN: {
    id: 'ASSASSIN',
    name: 'Assassin',
    icon: '🗡️',
    description: 'Swift striker with high burst damage and mobility.',
    lore: 'Silent killers who strike from the shadows with lethal precision.',

    stats: {
      healthMod: 0.8, // 320 HP
      strengthMod: 1.2, // 12 STR
      defenseMod: 0.85, // 15% less defense
      manaRegen: 6, // Above average mana regen
      critChance: 0.3, // 30% crit chance (highest)
      critDamage: 2.2, // 220% crit damage
      attackRange: 1, // Melee range (daggers)
    },

    passive: {
      name: 'First Strike',
      description:
        'First attack each combat deals double damage. Each attack has 15% chance to attack again immediately.',
      icon: '⚡',
    },

    mechanics: {
      skillCostReduction: 0.15,
      defendBonus: -0.15, // 15% less effective defend
      comboBonus: 0.1, // +10% damage per combo hit (highest)
      healingBonus: 0,
    },
  },

  BERSERKER: {
    id: 'BERSERKER',
    name: 'Berserker',
    icon: '🪓',
    description: 'Reckless fighter who grows stronger as they take damage.',
    lore: 'Rage-fueled warriors who become unstoppable when wounded.',

    stats: {
      healthMod: 1.1, // 440 HP
      strengthMod: 1.15, // 11.5 STR
      defenseMod: 0.8, // 20% less defense
      manaRegen: 4, // Low mana regen
      critChance: 0.18, // 18% crit chance
      critDamage: 1.8, // 180% crit damage
      attackRange: 1, // Melee range (axes)
    },

    passive: {
      name: 'Rage',
      description:
        'Gain 3% damage and 1% crit chance for every 10% HP missing. Taking damage grants +5 mana.',
      icon: '😡',
    },

    mechanics: {
      skillCostReduction: 0,
      defendBonus: -0.25, // 25% less effective defend (lowest)
      comboBonus: 0.06, // +6% damage per combo
      healingBonus: -0.2, // 20% less healing (rage over recovery)
    },
  },

  PALADIN: {
    id: 'PALADIN',
    name: 'Paladin',
    icon: '⚜️',
    description: 'Holy warrior with balanced stats and healing abilities.',
    lore: 'Champions of light who smite evil and protect the innocent.',

    stats: {
      healthMod: 1.2, // 480 HP
      strengthMod: 1.05, // 10.5 STR
      defenseMod: 1.15, // 15% more defense
      manaRegen: 7, // High mana regen
      critChance: 0.15, // 15% crit chance
      critDamage: 1.6, // 160% crit damage
      attackRange: 1, // Melee range (holy weapons)
    },

    passive: {
      name: 'Divine Protection',
      description: 'Heal 3% max HP each turn. Defending heals an additional 8% max HP.',
      icon: '✝️',
    },

    mechanics: {
      skillCostReduction: 0.1,
      defendBonus: 0.15, // 15% more effective defend
      comboBonus: 0,
      healingBonus: 0.4, // 40% more healing (highest)
    },
  },

  NECROMANCER: {
    id: 'NECROMANCER',
    name: 'Necromancer',
    icon: '💀',
    description: 'Dark mage who drains life and manipulates death.',
    lore: 'Masters of death magic who grow stronger from fallen foes.',

    stats: {
      healthMod: 0.9, // 360 HP
      strengthMod: 0.85, // 8.5 STR
      defenseMod: 0.95, // 5% less defense
      manaRegen: 8, // Very high mana regen
      critChance: 0.12, // 12% crit chance
      critDamage: 1.7, // 170% crit damage
      attackRange: 3, // Ranged dark magic
    },

    passive: {
      name: 'Life Drain',
      description:
        'Heal for 15% of skill damage dealt. Defeating enemies permanently increases max HP by 5%.',
      icon: '🩸',
    },

    mechanics: {
      skillCostReduction: 0.25, // 25% less mana cost
      defendBonus: 0,
      comboBonus: 0,
      healingBonus: 0.1,
    },
  },
};

/**
 * Get class by ID
 * @param {string} classId - Class ID
 * @returns {Object|null} - Class data or null
 */
export function getClassById(classId) {
  return CHARACTER_CLASSES[classId] || null;
}

/**
 * Get all classes as array
 * @returns {Array} - Array of all classes
 */
export function getAllClasses() {
  return Object.values(CHARACTER_CLASSES);
}

/**
 * Get class display name
 * @param {string} classId - Class ID
 * @returns {string} - Display name
 */
export function getClassName(classId) {
  const classData = getClassById(classId);
  return classData ? classData.name : 'Unknown';
}

/**
 * Calculate actual stat value based on class modifier
 * @param {string} classId - Class ID
 * @param {string} statType - Stat type (health, strength, etc)
 * @param {number} baseValue - Base stat value
 * @returns {number} - Modified stat value
 */
export function calculateClassStat(classId, statType, baseValue) {
  const classData = getClassById(classId);
  if (!classData) return baseValue;

  const modKey = `${statType}Mod`;
  const modifier = classData.stats[modKey] || 1.0;

  return Math.round(baseValue * modifier);
}

/**
 * Get recommended classes for beginners
 * @returns {Array} - Array of beginner-friendly class IDs
 */
export function getBeginnerClasses() {
  return ['BALANCED', 'WARRIOR', 'PALADIN'];
}

/**
 * Get advanced classes
 * @returns {Array} - Array of advanced class IDs
 */
export function getAdvancedClasses() {
  return ['GLASS_CANNON', 'ASSASSIN', 'NECROMANCER'];
}
