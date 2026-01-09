/**
 * AIPersonality - Defines personality traits that affect AI behavior
 */

/**
 * Personality Trait Definitions
 */
export const PersonalityTraits = {
  // Aggression: How likely to attack vs defend
  AGGRESSION: 'aggression', // 0-100

  // Caution: How much health loss triggers defensive behavior
  CAUTION: 'caution', // 0-100

  // Skill Usage: Preference for using skills vs basic attacks
  SKILL_PREFERENCE: 'skillPreference', // 0-100

  // Item Usage: How quickly to use healing items
  ITEM_USAGE: 'itemUsage', // 0-100

  // Risk Taking: Willingness to take risks for high rewards
  RISK_TAKING: 'riskTaking', // 0-100

  // Adaptability: How quickly AI learns and adapts
  ADAPTABILITY: 'adaptability', // 0-100
};

/**
 * Predefined Personality Archetypes
 */
export const PersonalityArchetypes = {
  AGGRESSIVE: {
    name: 'Aggressive',
    traits: {
      aggression: 90,
      caution: 20,
      skillPreference: 70,
      itemUsage: 30,
      riskTaking: 80,
      adaptability: 50,
    },
    description: 'Focuses on dealing damage, rarely defends',
  },

  DEFENSIVE: {
    name: 'Defensive',
    traits: {
      aggression: 30,
      caution: 90,
      skillPreference: 40,
      itemUsage: 80,
      riskTaking: 20,
      adaptability: 50,
    },
    description: 'Prioritizes survival, uses items frequently',
  },

  TACTICAL: {
    name: 'Tactical',
    traits: {
      aggression: 50,
      caution: 60,
      skillPreference: 80,
      itemUsage: 60,
      riskTaking: 40,
      adaptability: 80,
    },
    description: 'Balanced approach, adapts to situation',
  },

  BERSERKER: {
    name: 'Berserker',
    traits: {
      aggression: 100,
      caution: 10,
      skillPreference: 50,
      itemUsage: 10,
      riskTaking: 100,
      adaptability: 30,
    },
    description: 'All-out offense, ignores defense',
  },

  GLASS_CANNON: {
    name: 'Glass Cannon',
    traits: {
      aggression: 80,
      caution: 70,
      skillPreference: 90,
      itemUsage: 50,
      riskTaking: 60,
      adaptability: 60,
    },
    description: 'High damage dealer, cautious when low HP',
  },

  TANK: {
    name: 'Tank',
    traits: {
      aggression: 40,
      caution: 80,
      skillPreference: 60,
      itemUsage: 70,
      riskTaking: 30,
      adaptability: 40,
    },
    description: 'Defensive specialist, outlasts opponents',
  },

  OPPORTUNIST: {
    name: 'Opportunist',
    traits: {
      aggression: 60,
      caution: 50,
      skillPreference: 70,
      itemUsage: 40,
      riskTaking: 70,
      adaptability: 90,
    },
    description: 'Exploits weaknesses, highly adaptive',
  },

  BALANCED: {
    name: 'Balanced',
    traits: {
      aggression: 50,
      caution: 50,
      skillPreference: 50,
      itemUsage: 50,
      riskTaking: 50,
      adaptability: 50,
    },
    description: 'Well-rounded, no specific focus',
  },
};

/**
 * Class-specific personality mappings
 */
export const ClassPersonalities = {
  TANK: PersonalityArchetypes.TANK,
  BALANCED: PersonalityArchetypes.BALANCED,
  AGILE: PersonalityArchetypes.GLASS_CANNON,
  MAGE: PersonalityArchetypes.GLASS_CANNON,
  HYBRID: PersonalityArchetypes.TACTICAL,
  ASSASSIN: PersonalityArchetypes.OPPORTUNIST,
  BRAWLER: PersonalityArchetypes.AGGRESSIVE,
};

/**
 * Difficulty-based personality modifiers
 */
export const DifficultyModifiers = {
  easy: {
    aggression: -20,
    caution: +10,
    skillPreference: -20,
    itemUsage: -20,
    riskTaking: -30,
    adaptability: -30,
  },
  normal: {
    aggression: 0,
    caution: 0,
    skillPreference: 0,
    itemUsage: 0,
    riskTaking: 0,
    adaptability: 0,
  },
  hard: {
    aggression: +10,
    caution: +10,
    skillPreference: +20,
    itemUsage: +10,
    riskTaking: +10,
    adaptability: +20,
  },
  nightmare: {
    aggression: +20,
    caution: +20,
    skillPreference: +30,
    itemUsage: +20,
    riskTaking: +20,
    adaptability: +40,
  },
};

/**
 * AIPersonality Class
 */
export class AIPersonality {
  constructor(archetype = PersonalityArchetypes.BALANCED, difficulty = 'normal') {
    this.archetype = archetype;
    this.difficulty = difficulty;
    this.traits = this.calculateTraits();
    this.memory = {
      damageReceived: [],
      damageDealt: [],
      actionsUsed: {},
      opponentPatterns: [],
    };
  }

  /**
   * Calculate final traits with difficulty modifiers
   */
  calculateTraits() {
    const baseTraits = { ...this.archetype.traits };
    const modifiers = DifficultyModifiers[this.difficulty] || {};

    const traits = {};
    for (const [trait, value] of Object.entries(baseTraits)) {
      const modifier = modifiers[trait] || 0;
      traits[trait] = Math.max(0, Math.min(100, value + modifier));
    }

    return traits;
  }

  /**
   * Get trait value (0-100)
   */
  getTrait(trait) {
    return this.traits[trait] || 50;
  }

  /**
   * Get trait as probability (0-1)
   */
  getTraitProbability(trait) {
    return this.getTrait(trait) / 100;
  }

  /**
   * Record action taken
   */
  recordAction(action, result) {
    if (!this.memory.actionsUsed[action]) {
      this.memory.actionsUsed[action] = { count: 0, successes: 0 };
    }

    this.memory.actionsUsed[action].count++;
    if (result === 'success') {
      this.memory.actionsUsed[action].successes++;
    }
  }

  /**
   * Record damage
   */
  recordDamage(amount, isDealt) {
    const array = isDealt ? this.memory.damageDealt : this.memory.damageReceived;
    array.push(amount);

    // Keep last 10 entries
    if (array.length > 10) {
      array.shift();
    }
  }

  /**
   * Get average damage dealt
   */
  getAverageDamageDealt() {
    if (this.memory.damageDealt.length === 0) return 0;
    return (
      this.memory.damageDealt.reduce((sum, dmg) => sum + dmg, 0) / this.memory.damageDealt.length
    );
  }

  /**
   * Get average damage received
   */
  getAverageDamageReceived() {
    if (this.memory.damageReceived.length === 0) return 0;
    return (
      this.memory.damageReceived.reduce((sum, dmg) => sum + dmg, 0) /
      this.memory.damageReceived.length
    );
  }

  /**
   * Get action success rate
   */
  getActionSuccessRate(action) {
    const stats = this.memory.actionsUsed[action];
    if (!stats || stats.count === 0) return 0;
    return stats.successes / stats.count;
  }

  /**
   * Should adapt strategy?
   */
  shouldAdapt() {
    const adaptability = this.getTraitProbability(PersonalityTraits.ADAPTABILITY);
    return Math.random() < adaptability;
  }

  /**
   * Get personality description
   */
  getDescription() {
    return this.archetype.description;
  }

  /**
   * Export personality data
   */
  toJSON() {
    return {
      archetype: this.archetype.name,
      difficulty: this.difficulty,
      traits: this.traits,
      memory: this.memory,
    };
  }
}

/**
 * Get personality for fighter class
 */
export function getPersonalityForClass(fighterClass, difficulty = 'normal') {
  const archetype = ClassPersonalities[fighterClass] || PersonalityArchetypes.BALANCED;
  return new AIPersonality(archetype, difficulty);
}

/**
 * Get random personality archetype
 */
export function getRandomArchetype() {
  const archetypes = Object.values(PersonalityArchetypes);
  return archetypes[Math.floor(Math.random() * archetypes.length)];
}
