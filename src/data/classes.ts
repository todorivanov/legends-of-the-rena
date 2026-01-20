import type { ClassData } from '../types/game';
import { calculateTalentBonuses } from '../utils/talents';

/**
 * Character Classes Database
 * All 10 playable classes with unique stats, passives, and mechanics
 */

export const CHARACTER_CLASSES: Record<string, ClassData> = {
  BALANCED: {
    id: 'BALANCED',
    name: 'Balanced Fighter',
    icon: '⚖️',
    description: 'A well-rounded warrior with no weaknesses',
    lore: 'Masters of adaptability, Balanced Fighters excel in all situations.',
    difficulty: 1,
    stats: {
      healthMod: 1.0,    // 400 HP
      strengthMod: 1.0,  // 50 STR
      defenseMod: 1.0,
      manaRegen: 5,
      critChance: 0.15,
      critDamage: 1.5,
      attackRange: 1,
    },
    passive: {
      name: 'Versatility',
      description: 'Gain +5% to all stats for each different action type used',
      icon: '✨',
    },
    mechanics: {
      skillCostReduction: 0,
      defendBonus: 0,
      comboBonus: 0,
      healingBonus: 0,
    },
    skills: ['power_slash', 'second_wind'],
    talentTrees: ['balanced_offense', 'balanced_defense', 'balanced_utility'],
  },

  WARRIOR: {
    id: 'WARRIOR',
    name: 'Warrior',
    icon: '⚔️',
    description: 'High damage dealer with strong offensive capabilities',
    lore: 'Warriors live for battle, overwhelming foes with devastating attacks.',
    difficulty: 1,
    stats: {
      healthMod: 0.9,
      strengthMod: 1.3,
      defenseMod: 0.95,
      manaRegen: 4,
      critChance: 0.2,
      critDamage: 1.75,
      attackRange: 1,
    },
    passive: {
      name: 'Battle Fury',
      description: 'Critical hits reduce skill cooldowns by 1 turn',
      icon: '🔥',
    },
    mechanics: {
      skillCostReduction: 0,
      defendBonus: -0.1,
      comboBonus: 0.05,
      healingBonus: 0,
    },
    skills: ['whirlwind', 'cleave'],
    talentTrees: ['warrior_arms', 'warrior_fury', 'warrior_protection'],
  },

  TANK: {
    id: 'TANK',
    name: 'Tank',
    icon: '🛡️',
    description: 'Extremely durable with high defense but lower damage',
    lore: 'Immovable fortresses who protect allies and outlast any threat.',
    difficulty: 1,
    stats: {
      healthMod: 1.5,
      strengthMod: 0.6,
      defenseMod: 1.5,
      manaRegen: 6,
      critChance: 0.1,
      critDamage: 1.25,
      attackRange: 1,
    },
    passive: {
      name: 'Iron Will',
      description: 'Defending grants a shield that absorbs 30% of next damage',
      icon: '🛡️',
    },
    mechanics: {
      skillCostReduction: 0,
      defendBonus: 0.3,
      comboBonus: 0,
      healingBonus: 0.05,
    },
    skills: ['iron_wall', 'taunt_strike'],
    talentTrees: ['tank_fortitude', 'tank_revenge', 'tank_guardian'],
  },

  MAGE: {
    id: 'MAGE',
    name: 'Mage',
    icon: '🔮',
    description: 'Master of magical arts with powerful skills',
    lore: 'Mages channel arcane energy to unleash devastating spells.',
    difficulty: 2,
    stats: {
      healthMod: 0.7,
      strengthMod: 0.8,
      defenseMod: 0.8,
      manaRegen: 10,
      critChance: 0.12,
      critDamage: 2.0,
      attackRange: 3,
    },
    passive: {
      name: 'Arcane Mastery',
      description: 'Skills cost 20% less mana and deal 15% more damage',
      icon: '✨',
    },
    mechanics: {
      skillCostReduction: 0.2,
      defendBonus: 0,
      comboBonus: 0,
      healingBonus: 0,
    },
    skills: ['fireball', 'mana_surge'],
    talentTrees: ['mage_fire', 'mage_frost', 'mage_arcane'],
  },

  ROGUE: {
    id: 'ROGUE',
    name: 'Rogue',
    icon: '🗡️',
    description: 'Swift and deadly, strikes from the shadows',
    lore: 'Rogues rely on speed and cunning to outmaneuver their foes.',
    difficulty: 2,
    stats: {
      healthMod: 0.85,
      strengthMod: 1.1,
      defenseMod: 0.9,
      manaRegen: 5,
      critChance: 0.3,
      critDamage: 2.0,
      attackRange: 1,
    },
    passive: {
      name: 'Shadow Strike',
      description: 'Every 3rd attack is guaranteed critical',
      icon: '🌙',
    },
    mechanics: {
      skillCostReduction: 0,
      defendBonus: 0,
      comboBonus: 0.1,
      healingBonus: 0,
    },
    skills: ['backstab', 'shadow_strike'],
    talentTrees: ['rogue_assassination', 'rogue_subtlety', 'rogue_combat'],
  },

  BRAWLER: {
    id: 'BRAWLER',
    name: 'Brawler',
    icon: '👊',
    description: 'Raw power and aggression define this fighter',
    lore: 'Brawlers fight with pure instinct and overwhelming force.',
    difficulty: 1,
    stats: {
      healthMod: 1.2,
      strengthMod: 1.4,
      defenseMod: 0.8,
      manaRegen: 3,
      critChance: 0.18,
      critDamage: 1.6,
      attackRange: 1,
    },
    passive: {
      name: 'Rage',
      description: 'Deal more damage at low health (up to +50% at 20% HP)',
      icon: '💢',
    },
    mechanics: {
      skillCostReduction: 0,
      defendBonus: -0.2,
      comboBonus: 0.15,
      healingBonus: 0,
    },
    skills: ['haymaker', 'adrenaline'],
    talentTrees: ['brawler_fury', 'brawler_toughness', 'brawler_brutality'],
  },

  PALADIN: {
    id: 'PALADIN',
    name: 'Paladin',
    icon: '⚜️',
    description: 'Holy warrior with sustain and protection',
    lore: 'Paladins channel divine power to protect and heal.',
    difficulty: 1,
    stats: {
      healthMod: 1.2,
      strengthMod: 1.05,
      defenseMod: 1.15,
      manaRegen: 7,
      critChance: 0.15,
      critDamage: 1.6,
      attackRange: 1,
    },
    passive: {
      name: 'Divine Protection',
      description: 'Heal 3% max HP each turn. Defending heals an additional 8%',
      icon: '✝️',
    },
    mechanics: {
      skillCostReduction: 0,
      defendBonus: 0.15,
      comboBonus: 0,
      healingBonus: 0.4,
    },
    skills: ['divine_shield', 'holy_light'],
    talentTrees: ['paladin_holy', 'paladin_protection', 'paladin_retribution'],
  },

  BRUISER: {
    id: 'BRUISER',
    name: 'Bruiser',
    icon: '💪',
    description: 'Tanky brawler with lifesteal',
    lore: 'Bruisers combine toughness with relentless aggression.',
    difficulty: 1,
    stats: {
      healthMod: 1.25,
      strengthMod: 0.9,
      defenseMod: 1.1,
      manaRegen: 5,
      critChance: 0.12,
      critDamage: 1.4,
      attackRange: 1,
    },
    passive: {
      name: 'Lifesteal',
      description: 'Heal for 10% of damage dealt. Gain 2% max HP every 3 kills',
      icon: '🩸',
    },
    mechanics: {
      skillCostReduction: 0,
      defendBonus: 0.1,
      comboBonus: 0,
      healingBonus: 0.15,
    },
    skills: ['ground_slam', 'intimidate'],
    talentTrees: ['bruiser_might', 'bruiser_endurance', 'bruiser_domination'],
  },

  RANGER: {
    id: 'RANGER',
    name: 'Ranger',
    icon: '🏹',
    description: 'Precise ranged attacker with high mobility',
    lore: 'Rangers strike from afar with deadly accuracy.',
    difficulty: 2,
    stats: {
      healthMod: 0.8,
      strengthMod: 1.15,
      defenseMod: 0.85,
      manaRegen: 6,
      critChance: 0.25,
      critDamage: 1.8,
      attackRange: 3,
    },
    passive: {
      name: 'Marksman',
      description: 'Attacks from max range deal 30% bonus damage',
      icon: '🎯',
    },
    mechanics: {
      skillCostReduction: 0,
      defendBonus: -0.15,
      comboBonus: 0.08,
      healingBonus: 0,
    },
    skills: ['multi_shot', 'hunters_mark'],
    talentTrees: ['ranger_marksmanship', 'ranger_survival', 'ranger_beast_mastery'],
  },

  ASSASSIN: {
    id: 'ASSASSIN',
    name: 'Assassin',
    icon: '🔪',
    description: 'Master of stealth and critical strikes',
    lore: 'Assassins eliminate targets with surgical precision.',
    difficulty: 3,
    stats: {
      healthMod: 0.7,
      strengthMod: 1.2,
      defenseMod: 0.75,
      manaRegen: 4,
      critChance: 0.35,
      critDamage: 2.5,
      attackRange: 1,
    },
    passive: {
      name: 'Lethal Strike',
      description: 'Crits deal 50% more damage but take 25% more damage',
      icon: '💀',
    },
    mechanics: {
      skillCostReduction: 0,
      defendBonus: -0.25,
      comboBonus: 0.2,
      healingBonus: 0,
    },
    skills: ['assassinate', 'vanish'],
    talentTrees: ['assassin_subtlety', 'assassin_assassination', 'assassin_combat'],
  },
};

/**
 * Get class data by ID
 */
export function getClassById(classId: string): ClassData | null {
  return CHARACTER_CLASSES[classId] || null;
}

/**
 * Get all available classes
 */
export function getAllClasses(): ClassData[] {
  return Object.values(CHARACTER_CLASSES);
}

/**
 * Get classes by difficulty
 */
export function getClassesByDifficulty(difficulty: number): ClassData[] {
  return Object.values(CHARACTER_CLASSES).filter(c => c.difficulty === difficulty);
}

/**
 * Calculate fighter stats with class modifiers
 */
export function calculateFighterStats(
  baseHealth: number,
  baseStrength: number,
  baseDefense: number,
  classData: ClassData
) {
  return {
    health: Math.floor(baseHealth * classData.stats.healthMod),
    strength: Math.floor(baseStrength * classData.stats.strengthMod),
    defense: Math.floor(baseDefense * classData.stats.defenseMod),
    manaRegen: classData.stats.manaRegen,
    critChance: classData.stats.critChance,
    critDamage: classData.stats.critDamage,
    attackRange: classData.stats.attackRange,
  };
}

/**
 * Helper to calculate player stats from PlayerCharacter
 */
export function calculatePlayerStats(player: any) {
  const classData = getClassById(player.class);
  if (!classData) {
    throw new Error(`Class ${player.class} not found`);
  }
  
  // Calculate talent bonuses if available
  const talentBonuses = player.learnedTalents 
    ? calculateTalentBonuses(player.learnedTalents)
    : {
        strength: 0,
        health: 0,
        defense: 0,
        critChance: 0,
        critDamage: 0,
        manaRegen: 0,
      };
  
  const baseHealth = 100 + (player.level - 1) * 20 + talentBonuses.health;
  const baseStrength = 20 + (player.level - 1) * 2 + talentBonuses.strength;
  const baseDefense = 10 + (player.level - 1) * 1 + talentBonuses.defense;
  
  const stats = calculateFighterStats(baseHealth, baseStrength, baseDefense, classData);
  
  return {
    ...stats,
    maxHealth: stats.health,
    maxMana: 100,
    health: stats.health,
    mana: 100,
    critChance: talentBonuses.critChance,
    critDamage: 150 + talentBonuses.critDamage,
  };
}
