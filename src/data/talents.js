/**
 * Talent Trees Data
 *
 * Each character class has 3 talent trees
 * Each tree contains multiple talent nodes with dependencies and effects
 */

/**
 * WARRIOR Talent Trees
 */
const WARRIOR_TALENTS = {
  tree1: {
    id: 'tree1',
    name: 'Arms',
    description: 'Master of weapons and devastating strikes',
    icon: '⚔️',
    talents: [
      // Row 0 - Foundation
      {
        id: 'war_arms_dmg_1',
        name: 'Weapon Mastery',
        description: 'Increase your strength',
        icon: '💪',
        maxRank: 5,
        row: 0,
        column: 1,
        requires: [],
        requiresPoints: 0,
        effects: {
          stats: { strength: 2 }, // +2 strength per rank
        },
      },
      // Row 1
      {
        id: 'war_arms_crit_1',
        name: 'Precise Strikes',
        description: 'Increase critical strike chance',
        icon: '🎯',
        maxRank: 3,
        row: 1,
        column: 0,
        requires: [],
        requiresPoints: 5,
        effects: {
          stats: { critChance: 2 }, // +2% crit per rank
        },
      },
      {
        id: 'war_arms_hp_1',
        name: 'Battle Hardened',
        description: 'Increase maximum health',
        icon: '❤️',
        maxRank: 3,
        row: 1,
        column: 2,
        requires: [],
        requiresPoints: 5,
        effects: {
          stats: { health: 15 }, // +15 HP per rank
        },
      },
      // Row 2 - Major talent
      {
        id: 'war_arms_execute',
        name: 'Execute',
        description: 'Deal 50% more damage to enemies below 20% health',
        icon: '⚡',
        maxRank: 1,
        row: 2,
        column: 1,
        requires: ['war_arms_dmg_1'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'execute',
            damageBonus: 0.5,
            threshold: 0.2,
          },
        },
      },
      // Row 3
      {
        id: 'war_arms_bleed',
        name: 'Mortal Strike',
        description: 'Attacks have a chance to cause bleeding',
        icon: '🩸',
        maxRank: 1,
        row: 3,
        column: 0,
        requires: ['war_arms_crit_1', 'war_arms_execute'],
        requiresPoints: 15,
        effects: {
          passive: {
            type: 'bleed',
            chance: 0.25,
            damage: 5,
            duration: 3,
          },
        },
      },
      {
        id: 'war_arms_cleave',
        name: 'Sweeping Strikes',
        description: 'Attacks hit an additional nearby enemy',
        icon: '🌀',
        maxRank: 1,
        row: 3,
        column: 2,
        requires: ['war_arms_execute'],
        requiresPoints: 15,
        effects: {
          passive: {
            type: 'cleave',
            targets: 1,
            damageReduction: 0.5,
          },
        },
      },
      // Row 4 - Capstone
      {
        id: 'war_arms_bladestorm',
        name: 'Bladestorm',
        description: 'Become a whirlwind of steel. +50% critical damage',
        icon: '🌪️',
        maxRank: 1,
        row: 4,
        column: 1,
        requires: ['war_arms_bleed', 'war_arms_cleave'],
        requiresPoints: 20,
        effects: {
          stats: { critDamage: 50 },
          passive: {
            type: 'bladestorm',
            aoeChance: 0.15,
          },
        },
      },
    ],
  },
  tree2: {
    id: 'tree2',
    name: 'Fury',
    description: 'Unleash unbridled rage and relentless attacks',
    icon: '😤',
    talents: [
      // Row 0
      {
        id: 'war_fury_rage_1',
        name: 'Building Rage',
        description: 'Increase attack speed and damage',
        icon: '🔥',
        maxRank: 5,
        row: 0,
        column: 1,
        requires: [],
        requiresPoints: 0,
        effects: {
          stats: { strength: 1, critChance: 1 },
        },
      },
      // Row 1
      {
        id: 'war_fury_enrage',
        name: 'Enrage',
        description: 'Critical hits grant temporary strength',
        icon: '💢',
        maxRank: 1,
        row: 1,
        column: 1,
        requires: ['war_fury_rage_1'],
        requiresPoints: 5,
        effects: {
          passive: {
            type: 'enrage',
            strengthBonus: 10,
            duration: 2,
          },
        },
      },
      // Row 2
      {
        id: 'war_fury_rampage',
        name: 'Rampage',
        description: 'Each attack increases damage of next attack',
        icon: '🔴',
        maxRank: 3,
        row: 2,
        column: 0,
        requires: ['war_fury_enrage'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'rampage',
            damagePerStack: 0.05, // +5% per stack per rank
            maxStacks: 5,
          },
        },
      },
      {
        id: 'war_fury_bloodthirst',
        name: 'Bloodthirst',
        description: 'Restore health when dealing critical strikes',
        icon: '🩸',
        maxRank: 3,
        row: 2,
        column: 2,
        requires: ['war_fury_enrage'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'lifesteal',
            healPercent: 0.05, // 5% per rank
          },
        },
      },
      // Row 3 - Capstone
      {
        id: 'war_fury_reckless',
        name: 'Reckless Abandon',
        description: '+20% damage, +30% critical strike chance',
        icon: '⚡',
        maxRank: 1,
        row: 3,
        column: 1,
        requires: ['war_fury_rampage', 'war_fury_bloodthirst'],
        requiresPoints: 15,
        effects: {
          stats: { strength: 20, critChance: 30 },
          passive: {
            type: 'reckless',
            damageBonus: 0.2,
          },
        },
      },
    ],
  },
  tree3: {
    id: 'tree3',
    name: 'Protection',
    description: 'Impenetrable defense and battlefield control',
    icon: '🛡️',
    talents: [
      // Row 0
      {
        id: 'war_prot_armor_1',
        name: 'Thick Skin',
        description: 'Increase defense',
        icon: '🛡️',
        maxRank: 5,
        row: 0,
        column: 1,
        requires: [],
        requiresPoints: 0,
        effects: {
          stats: { defense: 3 },
        },
      },
      // Row 1
      {
        id: 'war_prot_hp_1',
        name: 'Toughness',
        description: 'Greatly increase maximum health',
        icon: '💚',
        maxRank: 5,
        row: 1,
        column: 1,
        requires: ['war_prot_armor_1'],
        requiresPoints: 5,
        effects: {
          stats: { health: 25 },
        },
      },
      // Row 2
      {
        id: 'war_prot_block',
        name: 'Shield Block',
        description: 'Chance to block incoming attacks',
        icon: '🚫',
        maxRank: 3,
        row: 2,
        column: 0,
        requires: ['war_prot_hp_1'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'block',
            chance: 0.1, // 10% per rank
            reduction: 0.5,
          },
        },
      },
      {
        id: 'war_prot_taunt',
        name: 'Challenging Shout',
        description: 'Force enemies to attack you',
        icon: '📢',
        maxRank: 1,
        row: 2,
        column: 2,
        requires: ['war_prot_hp_1'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'taunt',
            duration: 2,
          },
        },
      },
      // Row 3 - Capstone
      {
        id: 'war_prot_wall',
        name: 'Shield Wall',
        description: '+50 defense, reflect 20% of damage taken',
        icon: '🏰',
        maxRank: 1,
        row: 3,
        column: 1,
        requires: ['war_prot_block', 'war_prot_taunt'],
        requiresPoints: 15,
        effects: {
          stats: { defense: 50 },
          passive: {
            type: 'reflect',
            reflectPercent: 0.2,
          },
        },
      },
    ],
  },
};

/**
 * MAGE Talent Trees
 */
const MAGE_TALENTS = {
  tree1: {
    id: 'tree1',
    name: 'Fire',
    description: 'Burn enemies with devastating flames',
    icon: '🔥',
    talents: [
      // Row 0
      {
        id: 'mage_fire_dmg_1',
        name: 'Flame Touched',
        description: 'Increase spell damage',
        icon: '🔥',
        maxRank: 5,
        row: 0,
        column: 1,
        requires: [],
        requiresPoints: 0,
        effects: {
          stats: { strength: 2 },
        },
      },
      // Row 1
      {
        id: 'mage_fire_crit_1',
        name: 'Critical Mass',
        description: 'Increase critical strike chance',
        icon: '💥',
        maxRank: 3,
        row: 1,
        column: 1,
        requires: ['mage_fire_dmg_1'],
        requiresPoints: 5,
        effects: {
          stats: { critChance: 3 },
        },
      },
      // Row 2
      {
        id: 'mage_fire_ignite',
        name: 'Ignite',
        description: 'Critical strikes set enemies on fire',
        icon: '🌡️',
        maxRank: 1,
        row: 2,
        column: 0,
        requires: ['mage_fire_crit_1'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'ignite',
            damage: 8,
            duration: 4,
          },
        },
      },
      {
        id: 'mage_fire_blast',
        name: 'Pyroblast',
        description: 'Attacks have chance to deal massive damage',
        icon: '☄️',
        maxRank: 1,
        row: 2,
        column: 2,
        requires: ['mage_fire_crit_1'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'pyroblast',
            chance: 0.15,
            multiplier: 2.5,
          },
        },
      },
      // Row 3 - Capstone
      {
        id: 'mage_fire_combustion',
        name: 'Combustion',
        description: 'Ignite explodes, dealing AoE damage',
        icon: '💣',
        maxRank: 1,
        row: 3,
        column: 1,
        requires: ['mage_fire_ignite', 'mage_fire_blast'],
        requiresPoints: 15,
        effects: {
          stats: { critDamage: 40 },
          passive: {
            type: 'combustion',
            aoeRadius: 2,
            damageMultiplier: 1.5,
          },
        },
      },
    ],
  },
  tree2: {
    id: 'tree2',
    name: 'Frost',
    description: 'Control the battlefield with ice and cold',
    icon: '❄️',
    talents: [
      // Row 0
      {
        id: 'mage_frost_dmg_1',
        name: 'Ice Veins',
        description: 'Increase frost damage',
        icon: '❄️',
        maxRank: 5,
        row: 0,
        column: 1,
        requires: [],
        requiresPoints: 0,
        effects: {
          stats: { strength: 1, defense: 2 },
        },
      },
      // Row 1
      {
        id: 'mage_frost_slow',
        name: 'Frost Nova',
        description: 'Attacks slow enemy movement',
        icon: '🧊',
        maxRank: 1,
        row: 1,
        column: 1,
        requires: ['mage_frost_dmg_1'],
        requiresPoints: 5,
        effects: {
          passive: {
            type: 'slow',
            movementReduction: 1,
            duration: 2,
          },
        },
      },
      // Row 2
      {
        id: 'mage_frost_shield',
        name: 'Ice Barrier',
        description: 'Absorb damage with an ice shield',
        icon: '🛡️',
        maxRank: 3,
        row: 2,
        column: 0,
        requires: ['mage_frost_slow'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'shield',
            absorbAmount: 20, // per rank
          },
        },
      },
      {
        id: 'mage_frost_freeze',
        name: 'Deep Freeze',
        description: 'Chance to freeze enemies in place',
        icon: '🥶',
        maxRank: 1,
        row: 2,
        column: 2,
        requires: ['mage_frost_slow'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'freeze',
            chance: 0.2,
            duration: 1,
          },
        },
      },
      // Row 3 - Capstone
      {
        id: 'mage_frost_blizzard',
        name: 'Blizzard',
        description: 'AoE frost damage and control',
        icon: '🌨️',
        maxRank: 1,
        row: 3,
        column: 1,
        requires: ['mage_frost_shield', 'mage_frost_freeze'],
        requiresPoints: 15,
        effects: {
          stats: { defense: 30 },
          passive: {
            type: 'blizzard',
            aoeRadius: 3,
            slowAmount: 2,
          },
        },
      },
    ],
  },
  tree3: {
    id: 'tree3',
    name: 'Arcane',
    description: 'Harness raw magical power',
    icon: '🔮',
    talents: [
      // Row 0
      {
        id: 'mage_arcane_power_1',
        name: 'Arcane Power',
        description: 'Increase all damage',
        icon: '✨',
        maxRank: 5,
        row: 0,
        column: 1,
        requires: [],
        requiresPoints: 0,
        effects: {
          stats: { strength: 3 },
        },
      },
      // Row 1
      {
        id: 'mage_arcane_mana',
        name: 'Arcane Intellect',
        description: 'Increase mana regeneration',
        icon: '🧠',
        maxRank: 3,
        row: 1,
        column: 1,
        requires: ['mage_arcane_power_1'],
        requiresPoints: 5,
        effects: {
          stats: { manaRegen: 2 },
        },
      },
      // Row 2
      {
        id: 'mage_arcane_missiles',
        name: 'Arcane Missiles',
        description: 'Attacks hit multiple times',
        icon: '🎆',
        maxRank: 1,
        row: 2,
        column: 0,
        requires: ['mage_arcane_mana'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'missiles',
            extraHits: 2,
            damagePerHit: 0.3,
          },
        },
      },
      {
        id: 'mage_arcane_surge',
        name: 'Arcane Surge',
        description: 'Attacks amplify next spell damage',
        icon: '⚡',
        maxRank: 3,
        row: 2,
        column: 2,
        requires: ['mage_arcane_mana'],
        requiresPoints: 10,
        effects: {
          passive: {
            type: 'surge',
            damageBonus: 0.1, // 10% per rank
            maxStacks: 4,
          },
        },
      },
      // Row 3 - Capstone
      {
        id: 'mage_arcane_mastery',
        name: 'Arcane Mastery',
        description: 'Become a master of the arcane arts',
        icon: '🌟',
        maxRank: 1,
        row: 3,
        column: 1,
        requires: ['mage_arcane_missiles', 'mage_arcane_surge'],
        requiresPoints: 15,
        effects: {
          stats: { strength: 25, manaRegen: 5, critChance: 15 },
          passive: {
            type: 'mastery',
            allDamageBonus: 0.25,
          },
        },
      },
    ],
  },
};

// Export talent trees for all classes
export const TALENT_TREES = {
  WARRIOR: WARRIOR_TALENTS,
  MAGE: MAGE_TALENTS,
  // Add more classes as needed
  BALANCED: WARRIOR_TALENTS, // Placeholder
  TANK: WARRIOR_TALENTS,
  GLASS_CANNON: MAGE_TALENTS,
  BRUISER: WARRIOR_TALENTS,
  ASSASSIN: WARRIOR_TALENTS,
  BERSERKER: WARRIOR_TALENTS,
  PALADIN: WARRIOR_TALENTS,
  NECROMANCER: MAGE_TALENTS,
};

export default TALENT_TREES;
