/**
 * Game Configuration
 * Centralized settings for game balance and mechanics
 */

export const GameConfig = {
  // Combat Settings
  combat: {
    roundInterval: 1500, // milliseconds between rounds
    normalAttackChance: 80, // % chance for normal attack (vs special)
    missChance: 10, // % chance to miss any attack
    normalAttackMultiplier: 0.4, // damage = strength * multiplier + random
    normalAttackRandomMin: 0,
    normalAttackRandomMax: 40,
    specialAttackMultiplier: 0.8,
    specialAttackRandomMin: 20,
    specialAttackRandomMax: 80,
  },

  // Event System
  events: {
    singleFight: {
      min: 90,
      max: 110,
    },
    teamMatch: {
      min: 470,
      max: 530,
    },
  },

  // Consumable System
  consumables: {
    singleFight: {
      player1: { min: 149, max: 160 },
      player2: { min: 49, max: 60 },
    },
    teamMatch: {
      chance: { min: 60, max: 80 },
    },
  },

  // Fighter Classes for balancing
  fighterClasses: {
    BALANCED: { healthMultiplier: 1.0, strengthMultiplier: 1.0 },
    GLASS_CANNON: { healthMultiplier: 0.8, strengthMultiplier: 2.0 },
    TANK: { healthMultiplier: 2.0, strengthMultiplier: 0.4 },
    BRUISER: { healthMultiplier: 1.5, strengthMultiplier: 0.6 },
    WARRIOR: { healthMultiplier: 0.9, strengthMultiplier: 1.1 },
  },

  // Image fallback
  images: {
    usePlaceholders: true,
    placeholderAPI: 'https://api.dicebear.com/7.x',
    style: 'avataaars', // avatar style
  },

  // Economy System
  economy: {
    startingGold: 100,
    battleRewardBase: 30,
    difficultyMultipliers: {
      easy: 0.8,
      normal: 1.0,
      hard: 1.5,
      nightmare: 2.0,
    },
    sellPriceMultiplier: 0.5, // Items sell for 50% of purchase price
  },

  // Equipment System
  equipment: {
    inventoryLimit: 20,
    durabilityMax: 100,
    durabilityLossMin: 5,
    durabilityLossMax: 10,
    durabilityEffectivenessThresholds: {
      broken: 0,
      damaged: 25,
      worn: 50,
      good: 75,
    },
  },

  // Marketplace System
  marketplace: {
    refreshIntervalHours: 24,
    refreshCost: 100, // Gold cost to force refresh
    inventorySize: { min: 6, max: 8 },
    legendaryChance: 0.05, // 5% at level 15+
    epicChance: 0.15, // 15% at level 10+
    rareChance: 0.30, // 30% at level 5+
  },

  // Story Mode
  story: {
    totalMissions: 25,
    starBonusXP: 50, // Bonus XP per star above 1
  },

  // Turn-Based Combat
  turnBased: {
    roundInterval: 1500,
    aiTurnDelay: 1200,
    baseCritChance: 15,
    critDamageMultiplier: 1.5,
    defendDamageReduction: 0.5,
    manaRegenPerTurn: 10,
    itemHealAmount: 20,
  },

  // Leveling System
  leveling: {
    maxLevel: 20,
    baseXP: 100,
    xpScaling: 1.5,
    hpPerLevel: 20,
    strengthPerLevel: 2,
    defensePerLevel: 1,
  },
};
