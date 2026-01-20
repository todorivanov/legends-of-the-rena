import type { CharacterClass } from '../types/game';

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxRank: number;
  row: number;
  column: number;
  requires: string[]; // IDs of prerequisite talents
  requiresPoints: number; // Total points needed in this tree
  effects: {
    stats?: {
      strength?: number;
      health?: number;
      defense?: number;
      critChance?: number;
      critDamage?: number;
      manaRegen?: number;
    };
    passive?: {
      type: string;
      [key: string]: string | number | boolean | undefined;
    };
  };
}

export interface TalentTree {
  id: string;
  name: string;
  description: string;
  icon: string;
  class: CharacterClass;
  talents: TalentNode[];
}

/**
 * WARRIOR Talent Trees
 */
const WARRIOR_ARMS: TalentTree = {
  id: 'warrior_arms',
  name: 'Arms',
  description: 'Master of weapons and devastating strikes',
  icon: '⚔️',
  class: 'WARRIOR',
  talents: [
    {
      id: 'war_arms_str',
      name: 'Weapon Mastery',
      description: 'Increase your strength by 2 per rank',
      icon: '💪',
      maxRank: 5,
      row: 0,
      column: 1,
      requires: [],
      requiresPoints: 0,
      effects: { stats: { strength: 2 } },
    },
    {
      id: 'war_arms_crit',
      name: 'Precise Strikes',
      description: 'Increase critical strike chance by 2% per rank',
      icon: '🎯',
      maxRank: 3,
      row: 1,
      column: 0,
      requires: [],
      requiresPoints: 3,
      effects: { stats: { critChance: 2 } },
    },
    {
      id: 'war_arms_hp',
      name: 'Battle Hardened',
      description: 'Increase maximum health by 15 per rank',
      icon: '❤️',
      maxRank: 3,
      row: 1,
      column: 2,
      requires: [],
      requiresPoints: 3,
      effects: { stats: { health: 15 } },
    },
    {
      id: 'war_arms_execute',
      name: 'Execute',
      description: 'Deal 50% more damage to enemies below 20% health',
      icon: '⚡',
      maxRank: 1,
      row: 2,
      column: 1,
      requires: ['war_arms_str'],
      requiresPoints: 8,
      effects: { passive: { type: 'execute', damageBonus: 0.5, threshold: 0.2 } },
    },
    {
      id: 'war_arms_capstone',
      name: 'Bladestorm',
      description: '+50% critical damage',
      icon: '🌪️',
      maxRank: 1,
      row: 3,
      column: 1,
      requires: ['war_arms_execute'],
      requiresPoints: 15,
      effects: { stats: { critDamage: 50 } },
    },
  ],
};

const WARRIOR_FURY: TalentTree = {
  id: 'warrior_fury',
  name: 'Fury',
  description: 'Unleash unbridled rage and relentless attacks',
  icon: '😤',
  class: 'WARRIOR',
  talents: [
    {
      id: 'war_fury_rage',
      name: 'Building Rage',
      description: '+1 strength and +1% crit per rank',
      icon: '🔥',
      maxRank: 5,
      row: 0,
      column: 1,
      requires: [],
      requiresPoints: 0,
      effects: { stats: { strength: 1, critChance: 1 } },
    },
    {
      id: 'war_fury_enrage',
      name: 'Enrage',
      description: 'Critical hits increase damage by 10% for 2 turns',
      icon: '💢',
      maxRank: 1,
      row: 1,
      column: 1,
      requires: [],
      requiresPoints: 3,
      effects: { passive: { type: 'enrage', bonus: 0.1, duration: 2 } },
    },
    {
      id: 'war_fury_rampage',
      name: 'Rampage',
      description: 'Each attack increases damage of next attack by 5% (stacks 3x)',
      icon: '⚔️',
      maxRank: 3,
      row: 2,
      column: 0,
      requires: ['war_fury_enrage'],
      requiresPoints: 8,
      effects: { passive: { type: 'rampage', damagePerStack: 5, maxStacks: 3 } },
    },
    {
      id: 'war_fury_capstone',
      name: 'Reckless Abandon',
      description: '+20% damage, +30% crit chance',
      icon: '💥',
      maxRank: 1,
      row: 3,
      column: 1,
      requires: ['war_fury_rampage'],
      requiresPoints: 15,
      effects: { stats: { strength: 10, critChance: 30 } },
    },
  ],
};

const WARRIOR_PROTECTION: TalentTree = {
  id: 'warrior_protection',
  name: 'Protection',
  description: 'Impenetrable defense and battlefield control',
  icon: '🛡️',
  class: 'WARRIOR',
  talents: [
    {
      id: 'war_prot_def',
      name: 'Thick Skin',
      description: '+3 defense per rank',
      icon: '🛡️',
      maxRank: 5,
      row: 0,
      column: 1,
      requires: [],
      requiresPoints: 0,
      effects: { stats: { defense: 3 } },
    },
    {
      id: 'war_prot_hp',
      name: 'Toughness',
      description: '+25 HP per rank',
      icon: '❤️',
      maxRank: 5,
      row: 1,
      column: 1,
      requires: [],
      requiresPoints: 3,
      effects: { stats: { health: 25 } },
    },
    {
      id: 'war_prot_block',
      name: 'Shield Block',
      description: '10% chance per rank to block attacks',
      icon: '🛡️',
      maxRank: 3,
      row: 2,
      column: 1,
      requires: ['war_prot_hp'],
      requiresPoints: 8,
      effects: { passive: { type: 'block', chance: 10 } },
    },
    {
      id: 'war_prot_capstone',
      name: 'Shield Wall',
      description: '+50 defense, reflect 20% damage taken',
      icon: '🏰',
      maxRank: 1,
      row: 3,
      column: 1,
      requires: ['war_prot_block'],
      requiresPoints: 15,
      effects: { stats: { defense: 50 }, passive: { type: 'reflect', percent: 20 } },
    },
  ],
};

/**
 * MAGE Talent Trees
 */
const MAGE_FIRE: TalentTree = {
  id: 'mage_fire',
  name: 'Fire',
  description: 'Burn enemies with devastating flames',
  icon: '🔥',
  class: 'MAGE',
  talents: [
    {
      id: 'mage_fire_dmg',
      name: 'Flame Touched',
      description: '+2 spell damage per rank',
      icon: '🔥',
      maxRank: 5,
      row: 0,
      column: 1,
      requires: [],
      requiresPoints: 0,
      effects: { stats: { strength: 2 } },
    },
    {
      id: 'mage_fire_crit',
      name: 'Critical Mass',
      description: '+3% crit chance per rank',
      icon: '💥',
      maxRank: 3,
      row: 1,
      column: 1,
      requires: [],
      requiresPoints: 3,
      effects: { stats: { critChance: 3 } },
    },
    {
      id: 'mage_fire_ignite',
      name: 'Ignite',
      description: 'Critical strikes set enemies on fire',
      icon: '🌡️',
      maxRank: 1,
      row: 2,
      column: 1,
      requires: ['mage_fire_crit'],
      requiresPoints: 8,
      effects: { passive: { type: 'ignite', damage: 8, duration: 4 } },
    },
    {
      id: 'mage_fire_capstone',
      name: 'Combustion',
      description: 'Burn effects deal 50% more damage',
      icon: '💣',
      maxRank: 1,
      row: 3,
      column: 1,
      requires: ['mage_fire_ignite'],
      requiresPoints: 15,
      effects: { passive: { type: 'combustion', multiplier: 1.5 } },
    },
  ],
};

const MAGE_FROST: TalentTree = {
  id: 'mage_frost',
  name: 'Frost',
  description: 'Control the battlefield with ice and cold',
  icon: '❄️',
  class: 'MAGE',
  talents: [
    {
      id: 'mage_frost_dmg',
      name: 'Ice Veins',
      description: '+1 damage, +2 defense per rank',
      icon: '❄️',
      maxRank: 5,
      row: 0,
      column: 1,
      requires: [],
      requiresPoints: 0,
      effects: { stats: { strength: 1, defense: 2 } },
    },
    {
      id: 'mage_frost_barrier',
      name: 'Ice Barrier',
      description: 'Absorb 20 damage per rank',
      icon: '🧊',
      maxRank: 3,
      row: 1,
      column: 1,
      requires: [],
      requiresPoints: 3,
      effects: { passive: { type: 'ice_barrier', absorption: 20 } },
    },
    {
      id: 'mage_frost_chill',
      name: 'Deep Freeze',
      description: 'Attacks slow enemies',
      icon: '🥶',
      maxRank: 1,
      row: 2,
      column: 1,
      requires: ['mage_frost_barrier'],
      requiresPoints: 8,
      effects: { passive: { type: 'chill', duration: 2 } },
    },
    {
      id: 'mage_frost_capstone',
      name: 'Ice Storm',
      description: '+30% damage, +30 defense',
      icon: '🌨️',
      maxRank: 1,
      row: 3,
      column: 1,
      requires: ['mage_frost_chill'],
      requiresPoints: 15,
      effects: { stats: { strength: 15, defense: 30 } },
    },
  ],
};

const MAGE_ARCANE: TalentTree = {
  id: 'mage_arcane',
  name: 'Arcane',
  description: 'Master pure magical energy',
  icon: '✨',
  class: 'MAGE',
  talents: [
    {
      id: 'mage_arcane_mana',
      name: 'Arcane Mind',
      description: '+2 mana regen per rank',
      icon: '💠',
      maxRank: 5,
      row: 0,
      column: 1,
      requires: [],
      requiresPoints: 0,
      effects: { stats: { manaRegen: 2 } },
    },
    {
      id: 'mage_arcane_dmg',
      name: 'Arcane Power',
      description: '+3 spell damage per rank',
      icon: '⚡',
      maxRank: 3,
      row: 1,
      column: 1,
      requires: [],
      requiresPoints: 3,
      effects: { stats: { strength: 3 } },
    },
    {
      id: 'mage_arcane_surge',
      name: 'Arcane Surge',
      description: 'Attacks restore 5 mana',
      icon: '💫',
      maxRank: 1,
      row: 2,
      column: 1,
      requires: ['mage_arcane_dmg'],
      requiresPoints: 8,
      effects: { passive: { type: 'mana_on_hit', amount: 5 } },
    },
    {
      id: 'mage_arcane_capstone',
      name: 'Arcane Mastery',
      description: 'Skills cost 30% less mana',
      icon: '🌟',
      maxRank: 1,
      row: 3,
      column: 1,
      requires: ['mage_arcane_surge'],
      requiresPoints: 15,
      effects: { passive: { type: 'mana_cost_reduction', percent: 30 } },
    },
  ],
};

/**
 * BALANCED Talent Trees
 */
const BALANCED_VERSATILITY: TalentTree = {
  id: 'balanced_versatility',
  name: 'Versatility',
  description: 'Jack of all trades, master of adaptation',
  icon: '⚖️',
  class: 'BALANCED',
  talents: [
    {
      id: 'bal_vers_all',
      name: 'All-Rounder',
      description: '+1 to all stats per rank',
      icon: '⚖️',
      maxRank: 5,
      row: 0,
      column: 1,
      requires: [],
      requiresPoints: 0,
      effects: { stats: { strength: 1, health: 10, defense: 1, manaRegen: 1 } },
    },
    {
      id: 'bal_vers_adapt',
      name: 'Adaptive Combat',
      description: '+2% crit, +5 HP per rank',
      icon: '🎯',
      maxRank: 3,
      row: 1,
      column: 1,
      requires: [],
      requiresPoints: 3,
      effects: { stats: { critChance: 2, health: 5 } },
    },
    {
      id: 'bal_vers_mastery',
      name: 'Combat Mastery',
      description: 'Using all action types grants +5% all stats',
      icon: '💪',
      maxRank: 1,
      row: 2,
      column: 1,
      requires: ['bal_vers_adapt'],
      requiresPoints: 8,
      effects: { passive: { type: 'versatility_bonus', percent: 5 } },
    },
    {
      id: 'bal_vers_capstone',
      name: 'Perfect Balance',
      description: '+10 to all stats',
      icon: '✨',
      maxRank: 1,
      row: 3,
      column: 1,
      requires: ['bal_vers_mastery'],
      requiresPoints: 15,
      effects: { stats: { strength: 10, health: 50, defense: 10, manaRegen: 2, critChance: 5 } },
    },
  ],
};

/**
 * ROGUE Talent Trees
 */
const ROGUE_SUBTLETY: TalentTree = {
  id: 'rogue_subtlety',
  name: 'Subtlety',
  description: 'Strike from the shadows with deadly precision',
  icon: '🗡️',
  class: 'ROGUE',
  talents: [
    {
      id: 'rogue_sub_agi',
      name: 'Shadow Step',
      description: '+2 strength per rank',
      icon: '👤',
      maxRank: 5,
      row: 0,
      column: 1,
      requires: [],
      requiresPoints: 0,
      effects: { stats: { strength: 2 } },
    },
    {
      id: 'rogue_sub_crit',
      name: 'Find Weakness',
      description: '+4% crit chance per rank',
      icon: '🎯',
      maxRank: 3,
      row: 1,
      column: 1,
      requires: [],
      requiresPoints: 3,
      effects: { stats: { critChance: 4 } },
    },
    {
      id: 'rogue_sub_backstab',
      name: 'Backstab',
      description: 'First attack deals 100% bonus damage',
      icon: '🔪',
      maxRank: 1,
      row: 2,
      column: 1,
      requires: ['rogue_sub_crit'],
      requiresPoints: 8,
      effects: { passive: { type: 'backstab', multiplier: 2 } },
    },
    {
      id: 'rogue_sub_capstone',
      name: 'Shadow Dance',
      description: '+25% crit chance, +75% crit damage',
      icon: '💃',
      maxRank: 1,
      row: 3,
      column: 1,
      requires: ['rogue_sub_backstab'],
      requiresPoints: 15,
      effects: { stats: { critChance: 25, critDamage: 75 } },
    },
  ],
};

/**
 * TANK Talent Trees
 */
const TANK_FORTITUDE: TalentTree = {
  id: 'tank_fortitude',
  name: 'Fortitude',
  description: 'Unbreakable wall of endurance',
  icon: '🛡️',
  class: 'TANK',
  talents: [
    {
      id: 'tank_fort_hp',
      name: 'Iron Constitution',
      description: '+30 HP per rank',
      icon: '❤️',
      maxRank: 5,
      row: 0,
      column: 1,
      requires: [],
      requiresPoints: 0,
      effects: { stats: { health: 30 } },
    },
    {
      id: 'tank_fort_def',
      name: 'Stone Skin',
      description: '+4 defense per rank',
      icon: '🛡️',
      maxRank: 5,
      row: 1,
      column: 1,
      requires: [],
      requiresPoints: 3,
      effects: { stats: { defense: 4 } },
    },
    {
      id: 'tank_fort_regen',
      name: 'Regeneration',
      description: 'Heal 3% max HP per turn',
      icon: '💚',
      maxRank: 1,
      row: 2,
      column: 1,
      requires: ['tank_fort_def'],
      requiresPoints: 8,
      effects: { passive: { type: 'regeneration', percent: 3 } },
    },
    {
      id: 'tank_fort_capstone',
      name: 'Immortal',
      description: '+100 HP, +20 defense',
      icon: '⚡',
      maxRank: 1,
      row: 3,
      column: 1,
      requires: ['tank_fort_regen'],
      requiresPoints: 15,
      effects: { stats: { health: 100, defense: 20 } },
    },
  ],
};

/**
 * Export all talent trees
 */
export const TALENT_TREES: TalentTree[] = [
  // Warrior
  WARRIOR_ARMS,
  WARRIOR_FURY,
  WARRIOR_PROTECTION,
  // Mage
  MAGE_FIRE,
  MAGE_FROST,
  MAGE_ARCANE,
  // Balanced
  BALANCED_VERSATILITY,
  // Rogue
  ROGUE_SUBTLETY,
  // Tank
  TANK_FORTITUDE,
];

/**
 * Get talent trees for a specific class
 */
export function getTalentTreesForClass(characterClass: CharacterClass): TalentTree[] {
  return TALENT_TREES.filter(tree => tree.class === characterClass);
}

/**
 * Get total points spent in a tree
 */
export function getPointsInTree(
  treeId: string,
  learnedTalents: Record<string, number>
): number {
  const tree = TALENT_TREES.find(t => t.id === treeId);
  if (!tree) return 0;

  return tree.talents.reduce((total, talent) => {
    const rank = learnedTalents[talent.id] || 0;
    return total + rank;
  }, 0);
}

/**
 * Check if a talent can be learned
 */
export function canLearnTalent(
  talent: TalentNode,
  treeId: string,
  currentRank: number,
  learnedTalents: Record<string, number>,
  availablePoints: number
): { canLearn: boolean; reason?: string } {
  // Check if already maxed
  if (currentRank >= talent.maxRank) {
    return { canLearn: false, reason: 'Already maxed' };
  }

  // Check if have available points
  if (availablePoints <= 0) {
    return { canLearn: false, reason: 'No talent points available' };
  }

  // Check tree points requirement
  const pointsInTree = getPointsInTree(treeId, learnedTalents);
  if (pointsInTree < talent.requiresPoints) {
    return {
      canLearn: false,
      reason: `Need ${talent.requiresPoints - pointsInTree} more points in this tree`,
    };
  }

  // Check prerequisites
  for (const reqId of talent.requires) {
    const reqRank = learnedTalents[reqId] || 0;
    if (reqRank === 0) {
      return { canLearn: false, reason: 'Missing prerequisite' };
    }
  }

  return { canLearn: true };
}
