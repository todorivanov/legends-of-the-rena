/**
 * Story Mode Missions
 * 25-mission campaign across 5 regions with progressive difficulty
 */

export type MissionType = 'STANDARD' | 'SURVIVAL' | 'BOSS';
export type MissionObjective = 'win' | 'no_items' | 'fast_clear' | 'no_damage' | 'perfect';

export interface MissionObjectiveDetails {
  id: MissionObjective;
  description: string;
  stars: number;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  region: string;
  type: MissionType;
  difficulty: number;
  requiredLevel: number;
  objectives: MissionObjectiveDetails[];
  opponent: {
    name: string;
    class: string;
    level: number;
  };
  rewards: {
    xp: number;
    gold: number;
    equipment?: string;
  };
  unlocks?: string[]; // IDs of missions this unlocks
}

export interface Region {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredLevel: number;
}

/**
 * Story Regions
 */
export const STORY_REGIONS: Region[] = [
  {
    id: 'training_grounds',
    name: 'Training Grounds',
    description: 'Learn the basics of combat',
    icon: '🎯',
    requiredLevel: 1,
  },
  {
    id: 'city_arena',
    name: 'City Arena',
    description: 'Prove yourself in the local arena',
    icon: '🏛️',
    requiredLevel: 3,
  },
  {
    id: 'mountain_pass',
    name: 'Mountain Pass',
    description: 'Face fierce warriors in the highlands',
    icon: '⛰️',
    requiredLevel: 6,
  },
  {
    id: 'dark_forest',
    name: 'Dark Forest',
    description: 'Battle rogues and assassins in the shadows',
    icon: '🌲',
    requiredLevel: 9,
  },
  {
    id: 'grand_colosseum',
    name: 'Grand Colosseum',
    description: 'The ultimate test of skill and strength',
    icon: '👑',
    requiredLevel: 12,
  },
];

/**
 * Story Missions
 */
export const STORY_MISSIONS: Mission[] = [
  // TRAINING GROUNDS (Missions 1-5)
  {
    id: 'training_01',
    name: 'First Steps',
    description: 'Begin your journey by defeating a training dummy.',
    region: 'training_grounds',
    type: 'STANDARD',
    difficulty: 1,
    requiredLevel: 1,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take no damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 5 turns', stars: 1 },
    ],
    opponent: {
      name: 'Training Dummy',
      class: 'BALANCED',
      level: 1,
    },
    rewards: {
      xp: 50,
      gold: 20,
    },
    unlocks: ['training_02'],
  },
  {
    id: 'training_02',
    name: 'Basic Combat',
    description: 'Test your skills against a novice fighter.',
    region: 'training_grounds',
    type: 'STANDARD',
    difficulty: 1,
    requiredLevel: 1,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 8 turns', stars: 1 },
    ],
    opponent: {
      name: 'Novice Fighter',
      class: 'WARRIOR',
      level: 2,
    },
    rewards: {
      xp: 75,
      gold: 30,
      equipment: 'iron_sword',
    },
    unlocks: ['training_03'],
  },
  {
    id: 'training_03',
    name: 'Defense Training',
    description: 'Face a defensive opponent and learn to break through.',
    region: 'training_grounds',
    type: 'STANDARD',
    difficulty: 2,
    requiredLevel: 2,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 50 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 10 turns', stars: 1 },
    ],
    opponent: {
      name: 'Shield Guardian',
      class: 'TANK',
      level: 3,
    },
    rewards: {
      xp: 100,
      gold: 40,
    },
    unlocks: ['training_04'],
  },
  {
    id: 'training_04',
    name: 'Spell Practice',
    description: 'Battle a mage to understand magical combat.',
    region: 'training_grounds',
    type: 'STANDARD',
    difficulty: 2,
    requiredLevel: 2,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'perfect', description: 'Win with all objectives', stars: 1 },
    ],
    opponent: {
      name: 'Apprentice Mage',
      class: 'MAGE',
      level: 3,
    },
    rewards: {
      xp: 125,
      gold: 50,
      equipment: 'spell_tome',
    },
    unlocks: ['training_05'],
  },
  {
    id: 'training_05',
    name: 'Graduation Battle',
    description: 'Prove you are ready for the arena by defeating the trainer.',
    region: 'training_grounds',
    type: 'BOSS',
    difficulty: 3,
    requiredLevel: 3,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 100 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 12 turns', stars: 1 },
    ],
    opponent: {
      name: 'Master Trainer',
      class: 'BALANCED',
      level: 4,
    },
    rewards: {
      xp: 200,
      gold: 100,
      equipment: 'steel_sword',
    },
    unlocks: ['city_01'],
  },

  // CITY ARENA (Missions 6-10)
  {
    id: 'city_01',
    name: 'Arena Debut',
    description: 'Make your mark in the city arena.',
    region: 'city_arena',
    type: 'STANDARD',
    difficulty: 3,
    requiredLevel: 3,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 10 turns', stars: 1 },
    ],
    opponent: {
      name: 'Arena Contender',
      class: 'WARRIOR',
      level: 4,
    },
    rewards: {
      xp: 150,
      gold: 75,
    },
    unlocks: ['city_02'],
  },
  {
    id: 'city_02',
    name: 'The Swift Blade',
    description: 'Face a quick and deadly rogue.',
    region: 'city_arena',
    type: 'STANDARD',
    difficulty: 4,
    requiredLevel: 4,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 75 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 15 turns', stars: 1 },
    ],
    opponent: {
      name: 'Shadow Striker',
      class: 'ROGUE',
      level: 5,
    },
    rewards: {
      xp: 175,
      gold: 90,
      equipment: 'leather_armor',
    },
    unlocks: ['city_03'],
  },
  {
    id: 'city_03',
    name: 'The Iron Wall',
    description: 'Break through an impenetrable defense.',
    region: 'city_arena',
    type: 'STANDARD',
    difficulty: 4,
    requiredLevel: 4,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'perfect', description: 'Win with all objectives', stars: 1 },
    ],
    opponent: {
      name: 'Iron Sentinel',
      class: 'TANK',
      level: 6,
    },
    rewards: {
      xp: 200,
      gold: 110,
    },
    unlocks: ['city_04'],
  },
  {
    id: 'city_04',
    name: 'Elemental Fury',
    description: 'Withstand a barrage of magical attacks.',
    region: 'city_arena',
    type: 'STANDARD',
    difficulty: 5,
    requiredLevel: 5,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 100 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 12 turns', stars: 1 },
    ],
    opponent: {
      name: 'Elemental Mage',
      class: 'MAGE',
      level: 6,
    },
    rewards: {
      xp: 225,
      gold: 130,
      equipment: 'magic_staff',
    },
    unlocks: ['city_05'],
  },
  {
    id: 'city_05',
    name: 'Champion Challenge',
    description: 'Defeat the city arena champion.',
    region: 'city_arena',
    type: 'BOSS',
    difficulty: 6,
    requiredLevel: 5,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 150 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 15 turns', stars: 1 },
    ],
    opponent: {
      name: 'City Champion',
      class: 'WARRIOR',
      level: 7,
    },
    rewards: {
      xp: 300,
      gold: 200,
      equipment: 'champion_blade',
    },
    unlocks: ['mountain_01'],
  },

  // MOUNTAIN PASS (Missions 11-15)
  {
    id: 'mountain_01',
    name: 'Highland Warrior',
    description: 'Face the fierce warriors of the mountains.',
    region: 'mountain_pass',
    type: 'STANDARD',
    difficulty: 6,
    requiredLevel: 6,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 15 turns', stars: 1 },
    ],
    opponent: {
      name: 'Mountain Berserker',
      class: 'WARRIOR',
      level: 7,
    },
    rewards: {
      xp: 250,
      gold: 150,
    },
    unlocks: ['mountain_02'],
  },
  {
    id: 'mountain_02',
    name: 'Frozen Guardian',
    description: 'Battle through ice and cold.',
    region: 'mountain_pass',
    type: 'STANDARD',
    difficulty: 7,
    requiredLevel: 7,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 125 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 18 turns', stars: 1 },
    ],
    opponent: {
      name: 'Frost Guardian',
      class: 'TANK',
      level: 8,
    },
    rewards: {
      xp: 275,
      gold: 175,
      equipment: 'mountain_armor',
    },
    unlocks: ['mountain_03'],
  },
  {
    id: 'mountain_03',
    name: 'Storm Caller',
    description: 'Face a powerful elemental mage.',
    region: 'mountain_pass',
    type: 'STANDARD',
    difficulty: 7,
    requiredLevel: 7,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'perfect', description: 'Win with all objectives', stars: 1 },
    ],
    opponent: {
      name: 'Storm Caller',
      class: 'MAGE',
      level: 9,
    },
    rewards: {
      xp: 300,
      gold: 200,
    },
    unlocks: ['mountain_04'],
  },
  {
    id: 'mountain_04',
    name: 'Avalanche Battle',
    description: 'Survive an intense survival challenge.',
    region: 'mountain_pass',
    type: 'SURVIVAL',
    difficulty: 8,
    requiredLevel: 8,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 150 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 20 turns', stars: 1 },
    ],
    opponent: {
      name: 'Mountain Warlord',
      class: 'WARRIOR',
      level: 9,
    },
    rewards: {
      xp: 350,
      gold: 225,
      equipment: 'battle_axe',
    },
    unlocks: ['mountain_05'],
  },
  {
    id: 'mountain_05',
    name: 'Peak Conquest',
    description: 'Defeat the ruler of the mountain pass.',
    region: 'mountain_pass',
    type: 'BOSS',
    difficulty: 9,
    requiredLevel: 8,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 200 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 20 turns', stars: 1 },
    ],
    opponent: {
      name: 'Mountain King',
      class: 'WARRIOR',
      level: 10,
    },
    rewards: {
      xp: 400,
      gold: 300,
      equipment: 'kings_hammer',
    },
    unlocks: ['forest_01'],
  },

  // DARK FOREST (Missions 16-20)
  {
    id: 'forest_01',
    name: 'Shadow Ambush',
    description: 'Navigate the treacherous dark forest.',
    region: 'dark_forest',
    type: 'STANDARD',
    difficulty: 9,
    requiredLevel: 9,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 18 turns', stars: 1 },
    ],
    opponent: {
      name: 'Shadow Assassin',
      class: 'ROGUE',
      level: 10,
    },
    rewards: {
      xp: 325,
      gold: 225,
    },
    unlocks: ['forest_02'],
  },
  {
    id: 'forest_02',
    name: 'Poison Master',
    description: 'Face a deadly poisoner.',
    region: 'dark_forest',
    type: 'STANDARD',
    difficulty: 10,
    requiredLevel: 9,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 175 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 20 turns', stars: 1 },
    ],
    opponent: {
      name: 'Venom Blade',
      class: 'ROGUE',
      level: 11,
    },
    rewards: {
      xp: 375,
      gold: 250,
      equipment: 'shadow_dagger',
    },
    unlocks: ['forest_03'],
  },
  {
    id: 'forest_03',
    name: 'Dark Ritual',
    description: 'Interrupt a dark mage\'s ritual.',
    region: 'dark_forest',
    type: 'STANDARD',
    difficulty: 10,
    requiredLevel: 10,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'perfect', description: 'Win with all objectives', stars: 1 },
    ],
    opponent: {
      name: 'Dark Sorcerer',
      class: 'MAGE',
      level: 11,
    },
    rewards: {
      xp: 400,
      gold: 275,
    },
    unlocks: ['forest_04'],
  },
  {
    id: 'forest_04',
    name: 'Twin Blades',
    description: 'Face two deadly rogues in succession.',
    region: 'dark_forest',
    type: 'SURVIVAL',
    difficulty: 11,
    requiredLevel: 10,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 200 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 25 turns', stars: 1 },
    ],
    opponent: {
      name: 'Twin Shadow',
      class: 'ROGUE',
      level: 12,
    },
    rewards: {
      xp: 450,
      gold: 300,
      equipment: 'dual_daggers',
    },
    unlocks: ['forest_05'],
  },
  {
    id: 'forest_05',
    name: 'Forest Lord',
    description: 'Defeat the master of the dark forest.',
    region: 'dark_forest',
    type: 'BOSS',
    difficulty: 12,
    requiredLevel: 11,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 250 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 25 turns', stars: 1 },
    ],
    opponent: {
      name: 'Shadow Lord',
      class: 'ROGUE',
      level: 13,
    },
    rewards: {
      xp: 500,
      gold: 400,
      equipment: 'shadow_cloak',
    },
    unlocks: ['colosseum_01'],
  },

  // GRAND COLOSSEUM (Missions 21-25)
  {
    id: 'colosseum_01',
    name: 'Colosseum Entry',
    description: 'Prove your worth in the grand colosseum.',
    region: 'grand_colosseum',
    type: 'STANDARD',
    difficulty: 12,
    requiredLevel: 12,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 20 turns', stars: 1 },
    ],
    opponent: {
      name: 'Colosseum Guard',
      class: 'TANK',
      level: 13,
    },
    rewards: {
      xp: 450,
      gold: 350,
    },
    unlocks: ['colosseum_02'],
  },
  {
    id: 'colosseum_02',
    name: 'The Undefeated',
    description: 'Challenge an undefeated warrior.',
    region: 'grand_colosseum',
    type: 'STANDARD',
    difficulty: 13,
    requiredLevel: 12,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 200 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 22 turns', stars: 1 },
    ],
    opponent: {
      name: 'Titan Warrior',
      class: 'WARRIOR',
      level: 14,
    },
    rewards: {
      xp: 500,
      gold: 400,
      equipment: 'titan_armor',
    },
    unlocks: ['colosseum_03'],
  },
  {
    id: 'colosseum_03',
    name: 'Archmage Duel',
    description: 'Face the colosseum\'s resident archmage.',
    region: 'grand_colosseum',
    type: 'STANDARD',
    difficulty: 14,
    requiredLevel: 13,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_items', description: 'Win without using items', stars: 1 },
      { id: 'perfect', description: 'Win with all objectives', stars: 1 },
    ],
    opponent: {
      name: 'Archmage Valorian',
      class: 'MAGE',
      level: 14,
    },
    rewards: {
      xp: 550,
      gold: 450,
    },
    unlocks: ['colosseum_04'],
  },
  {
    id: 'colosseum_04',
    name: 'Legend Battle',
    description: 'Face a legendary fighter.',
    region: 'grand_colosseum',
    type: 'SURVIVAL',
    difficulty: 15,
    requiredLevel: 13,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 250 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 30 turns', stars: 1 },
    ],
    opponent: {
      name: 'Legendary Hero',
      class: 'BALANCED',
      level: 15,
    },
    rewards: {
      xp: 600,
      gold: 500,
      equipment: 'legendary_blade',
    },
    unlocks: ['colosseum_05'],
  },
  {
    id: 'colosseum_05',
    name: 'The Grand Champion',
    description: 'Become the grand champion of the colosseum!',
    region: 'grand_colosseum',
    type: 'BOSS',
    difficulty: 16,
    requiredLevel: 14,
    objectives: [
      { id: 'win', description: 'Win the battle', stars: 1 },
      { id: 'no_damage', description: 'Take less than 300 damage', stars: 1 },
      { id: 'fast_clear', description: 'Win in under 30 turns', stars: 1 },
    ],
    opponent: {
      name: 'Grand Champion',
      class: 'WARRIOR',
      level: 16,
    },
    rewards: {
      xp: 800,
      gold: 1000,
      equipment: 'champions_crown',
    },
  },
];

/**
 * Get missions for a specific region
 */
export function getMissionsByRegion(regionId: string): Mission[] {
  return STORY_MISSIONS.filter(mission => mission.region === regionId);
}

/**
 * Get mission by ID
 */
export function getMissionById(missionId: string): Mission | undefined {
  return STORY_MISSIONS.find(mission => mission.id === missionId);
}

/**
 * Check if mission is unlocked
 */
export function isMissionUnlocked(
  missionId: string,
  unlockedMissions: string[]
): boolean {
  return unlockedMissions.includes(missionId);
}

/**
 * Get region by ID
 */
export function getRegionById(regionId: string): Region | undefined {
  return STORY_REGIONS.find(region => region.id === regionId);
}

/**
 * Check if region is unlocked based on player level
 */
export function isRegionUnlocked(regionId: string, playerLevel: number): boolean {
  const region = getRegionById(regionId);
  return region ? playerLevel >= region.requiredLevel : false;
}
