/**
 * Story Missions Database
 * Defines all story missions with objectives, rewards, and enemy configurations
 */

export const STORY_MISSIONS = {
  // ========== TUTORIAL ARENA ==========
  tutorial_1: {
    id: 'tutorial_1',
    region: 'tutorial',
    name: 'First Steps',
    description: 'Begin your journey in the arena. Face your first opponent and learn the basics of combat.',
    difficulty: 1,
    type: 'standard', // standard, survival, boss
    dialogue: {
      before: '"Welcome to the Arena, champion! Show us what you\'re made of."',
      after: '"Excellent work! You\'re a natural. But the real challenges lie ahead..."',
    },
    enemy: {
      name: 'Training Dummy',
      class: 'BALANCED',
      health: 150,
      strength: 5,
      level: 1,
    },
    objectives: [
      { id: 'win', description: 'Defeat the Training Dummy', type: 'win', required: true },
      { id: 'no_items', description: 'Win without using items', type: 'no_items', star: true },
      { id: 'fast', description: 'Win within 5 rounds', type: 'rounds', value: 5, star: true },
    ],
    rewards: {
      gold: 50,
      xp: 100,
      equipment: ['wooden_sword'], // Guaranteed drops
    },
    unlocks: ['tutorial_2'],
  },

  tutorial_2: {
    id: 'tutorial_2',
    region: 'tutorial',
    name: 'Skill Training',
    description: 'Learn to use your class skills effectively in battle.',
    difficulty: 2,
    type: 'standard',
    dialogue: {
      before: '"Skills are the key to victory. Use them wisely and you\'ll prevail!"',
      after: '"Well done! You\'re mastering the fundamentals. The Novice Grounds await!"',
    },
    enemy: {
      name: 'Apprentice Fighter',
      class: 'WARRIOR',
      health: 200,
      strength: 7,
      level: 1,
    },
    objectives: [
      { id: 'win', description: 'Defeat the Apprentice Fighter', type: 'win', required: true },
      { id: 'use_skills', description: 'Use at least 2 skills', type: 'skills_used', value: 2, star: true },
      { id: 'no_damage', description: 'Take less than 50 damage', type: 'damage_taken', value: 50, star: true },
    ],
    rewards: {
      gold: 60,
      xp: 150,
      equipment: ['bronze_ring'],
    },
    unlocks: ['region_novice'],
  },

  // ========== NOVICE GROUNDS ==========
  novice_1: {
    id: 'novice_1',
    region: 'novice',
    name: 'The Bandit Threat',
    description: 'Bandits have been harassing travelers. Teach them a lesson!',
    difficulty: 3,
    type: 'standard',
    dialogue: {
      before: '"These bandits have been terrorizing the roads. Stop them!"',
      after: '"The roads are safer now, thanks to you. But their leader still lurks..."',
    },
    enemy: {
      name: 'Bandit Thug',
      class: 'AGILE',
      health: 250,
      strength: 10,
      level: 2,
    },
    objectives: [
      { id: 'win', description: 'Defeat the Bandit Thug', type: 'win', required: true },
      { id: 'combo', description: 'Build a 3-hit combo', type: 'combo', value: 3, star: true },
      { id: 'crits', description: 'Land 2 critical hits', type: 'crits', value: 2, star: true },
    ],
    rewards: {
      gold: 80,
      xp: 200,
      equipment: ['leather_vest'],
    },
    unlocks: ['novice_2'],
  },

  novice_2: {
    id: 'novice_2',
    region: 'novice',
    name: 'Defend the Village',
    description: 'More bandits are attacking! Hold the line!',
    difficulty: 4,
    type: 'survival',
    dialogue: {
      before: '"Three waves incoming! Can you defend the village?"',
      after: '"Incredible! The village is saved. You\'re becoming a true hero!"',
    },
    waves: [
      { name: 'Bandit Scout', class: 'AGILE', health: 200, strength: 8, level: 2 },
      { name: 'Bandit Warrior', class: 'BALANCED', health: 300, strength: 10, level: 3 },
      { name: 'Bandit Brute', class: 'BRAWLER', health: 350, strength: 12, level: 3 },
    ],
    objectives: [
      { id: 'win', description: 'Survive all waves', type: 'win', required: true },
      { id: 'health', description: 'Finish with 70% HP', type: 'health_percent', value: 70, star: true },
      { id: 'efficient', description: 'Win within 12 rounds total', type: 'rounds', value: 12, star: true },
    ],
    rewards: {
      gold: 120,
      xp: 300,
      equipment: ['iron_sword', 'chainmail'],
    },
    unlocks: ['novice_3'],
  },

  novice_3: {
    id: 'novice_3',
    region: 'novice',
    name: 'Bandit Leader Showdown',
    description: 'Face the bandit leader and end their reign of terror!',
    difficulty: 5,
    type: 'boss',
    dialogue: {
      before: '"The bandit leader is mine! Prepare for the fight of your life!"',
      after: '"You\'ve proven yourself worthy. The path to greater challenges opens before you!"',
    },
    enemy: {
      name: 'Bandit King Rogan',
      class: 'ASSASSIN',
      health: 500,
      strength: 15,
      level: 4,
      isBoss: true,
    },
    objectives: [
      { id: 'win', description: 'Defeat the Bandit King', type: 'win', required: true },
      { id: 'no_healing', description: 'Win without healing items', type: 'no_healing', star: true },
      { id: 'dominant', description: 'Win with 50% HP remaining', type: 'health_percent', value: 50, star: true },
    ],
    rewards: {
      gold: 200,
      xp: 500,
      equipment: ['shadow_dagger', 'amulet_of_power'],
    },
    unlocks: ['region_forest', 'region_mountain'],
  },

  // ========== FOREST OF TRIALS ==========
  forest_1: {
    id: 'forest_1',
    region: 'forest',
    name: 'Into the Woods',
    description: 'Ancient creatures lurk in the Forest of Trials. Tread carefully.',
    difficulty: 6,
    type: 'standard',
    dialogue: {
      before: '"The forest tests all who enter. Prove your worth!"',
      after: '"You survived the first test. But darker forces await deeper within..."',
    },
    enemy: {
      name: 'Forest Guardian',
      class: 'TANK',
      health: 600,
      strength: 12,
      level: 5,
    },
    objectives: [
      { id: 'win', description: 'Defeat the Forest Guardian', type: 'win', required: true },
      { id: 'skills', description: 'Use 3 different skills', type: 'skills_variety', value: 3, star: true },
      { id: 'fast', description: 'Win within 8 rounds', type: 'rounds', value: 8, star: true },
    ],
    rewards: {
      gold: 150,
      xp: 400,
      equipment: ['steel_axe'],
    },
    unlocks: ['forest_2'],
  },

  forest_2: {
    id: 'forest_2',
    region: 'forest',
    name: 'The Corrupted Beasts',
    description: 'Twisted creatures emerge from the shadows. Clear them out!',
    difficulty: 7,
    type: 'survival',
    dialogue: {
      before: '"The corruption spreads! Stop these beasts before it\'s too late!"',
      after: '"The beasts are purged, but the source remains..."',
    },
    waves: [
      { name: 'Corrupted Wolf', class: 'AGILE', health: 350, strength: 14, level: 5 },
      { name: 'Corrupted Bear', class: 'BRAWLER', health: 500, strength: 16, level: 6 },
      { name: 'Corrupted Treant', class: 'TANK', health: 700, strength: 10, level: 6 },
    ],
    objectives: [
      { id: 'win', description: 'Defeat all corrupted beasts', type: 'win', required: true },
      { id: 'combo_master', description: 'Build a 5-hit combo', type: 'combo', value: 5, star: true },
      { id: 'damage', description: 'Deal 2000+ total damage', type: 'damage_dealt', value: 2000, star: true },
    ],
    rewards: {
      gold: 180,
      xp: 500,
      equipment: ['flame_blade', 'mystic_robes'],
    },
    unlocks: ['forest_3'],
  },

  forest_3: {
    id: 'forest_3',
    region: 'forest',
    name: 'The Ancient Treelord',
    description: 'Face the ancient protector of the forest in an epic battle!',
    difficulty: 8,
    type: 'boss',
    dialogue: {
      before: '"I am the voice of the forest. Only the strong may pass!"',
      after: '"You have proven your strength. The forest acknowledges you, champion."',
    },
    enemy: {
      name: 'Treelord Oakenheart',
      class: 'TANK',
      health: 900,
      strength: 18,
      level: 7,
      isBoss: true,
    },
    objectives: [
      { id: 'win', description: 'Defeat Treelord Oakenheart', type: 'win', required: true },
      { id: 'flawless', description: 'Take less than 100 damage', type: 'damage_taken', value: 100, star: true },
      { id: 'power', description: 'Deal 500+ damage in one hit', type: 'single_hit', value: 500, star: true },
    ],
    rewards: {
      gold: 250,
      xp: 700,
      equipment: ['arcane_staff', 'mana_crystal'],
    },
    unlocks: ['region_shadow'],
  },

  // ========== MOUNTAIN PASS ==========
  mountain_1: {
    id: 'mountain_1',
    region: 'mountain',
    name: 'Ascent Begins',
    description: 'Climb the treacherous mountain path and face its guardians.',
    difficulty: 6,
    type: 'standard',
    dialogue: {
      before: '"Only the brave dare climb these peaks. Are you worthy?"',
      after: '"Well climbed! But the summit is far above..."',
    },
    enemy: {
      name: 'Mountain Warrior',
      class: 'WARRIOR',
      health: 550,
      strength: 16,
      level: 5,
    },
    objectives: [
      { id: 'win', description: 'Defeat the Mountain Warrior', type: 'win', required: true },
      { id: 'crits', description: 'Land 3 critical hits', type: 'crits', value: 3, star: true },
      { id: 'efficient', description: 'Win within 10 rounds', type: 'rounds', value: 10, star: true },
    ],
    rewards: {
      gold: 160,
      xp: 420,
      equipment: ['steel_plate'],
    },
    unlocks: ['mountain_2'],
  },

  mountain_2: {
    id: 'mountain_2',
    region: 'mountain',
    name: 'Avalanche Defense',
    description: 'Warriors descend upon you! Hold your ground!',
    difficulty: 7,
    type: 'survival',
    dialogue: {
      before: '"Avalanche incoming! Brace yourself!"',
      after: '"You stood strong against the onslaught. Impressive!"',
    },
    waves: [
      { name: 'Ice Warrior', class: 'WARRIOR', health: 400, strength: 14, level: 6 },
      { name: 'Frost Mage', class: 'MAGE', health: 300, strength: 20, level: 6 },
      { name: 'Snow Berserker', class: 'BRAWLER', health: 550, strength: 18, level: 7 },
    ],
    objectives: [
      { id: 'win', description: 'Survive the avalanche', type: 'win', required: true },
      { id: 'skills_master', description: 'Use skills 5 times', type: 'skills_used', value: 5, star: true },
      { id: 'health', description: 'Finish with 60% HP', type: 'health_percent', value: 60, star: true },
    ],
    rewards: {
      gold: 190,
      xp: 520,
      equipment: ['titans_guard'],
    },
    unlocks: ['mountain_3'],
  },

  mountain_3: {
    id: 'mountain_3',
    region: 'mountain',
    name: 'Peak Challenge',
    description: 'Reach the summit and defeat the legendary Frost Giant!',
    difficulty: 8,
    type: 'boss',
    dialogue: {
      before: '"I AM THE MOUNTAIN! Face me if you dare!"',
      after: '"You... are stronger than I imagined. The mountain bows to you."',
    },
    enemy: {
      name: 'Frost Giant Bjorn',
      class: 'TANK',
      health: 1000,
      strength: 20,
      level: 8,
      isBoss: true,
    },
    objectives: [
      { id: 'win', description: 'Defeat Frost Giant Bjorn', type: 'win', required: true },
      { id: 'no_defend', description: 'Win without defending', type: 'no_defend', star: true },
      { id: 'combo', description: 'Build a 4-hit combo', type: 'combo', value: 4, star: true },
    ],
    rewards: {
      gold: 260,
      xp: 720,
      equipment: ['phoenix_armor', 'void_pendant'],
    },
    unlocks: ['region_shadow'],
  },

  // ========== SHADOW REALM ==========
  shadow_1: {
    id: 'shadow_1',
    region: 'shadow',
    name: 'Into Darkness',
    description: 'Enter the Shadow Realm where nightmares come alive.',
    difficulty: 9,
    type: 'standard',
    dialogue: {
      before: '"Turn back now, or be consumed by shadows..."',
      after: '"You survived... but the darkness has only just begun."',
    },
    enemy: {
      name: 'Shadow Assassin',
      class: 'ASSASSIN',
      health: 600,
      strength: 24,
      level: 9,
    },
    objectives: [
      { id: 'win', description: 'Defeat the Shadow Assassin', type: 'win', required: true },
      { id: 'fast', description: 'Win within 7 rounds', type: 'rounds', value: 7, star: true },
      { id: 'no_items', description: 'Win without items', type: 'no_items', star: true },
    ],
    rewards: {
      gold: 220,
      xp: 650,
      equipment: ['dragons_fang'],
    },
    unlocks: ['shadow_2'],
  },

  shadow_2: {
    id: 'shadow_2',
    region: 'shadow',
    name: 'Legion of Darkness',
    description: 'Face an army of shadow warriors!',
    difficulty: 10,
    type: 'survival',
    dialogue: {
      before: '"The shadow legion never ends. Can you withstand it?"',
      after: '"Against all odds, you prevailed. The Dark Champion awaits..."',
    },
    waves: [
      { name: 'Shadow Knight', class: 'WARRIOR', health: 650, strength: 22, level: 9 },
      { name: 'Shadow Mage', class: 'MAGE', health: 500, strength: 28, level: 10 },
      { name: 'Shadow Demon', class: 'HYBRID', health: 750, strength: 24, level: 10 },
    ],
    objectives: [
      { id: 'win', description: 'Defeat the shadow legion', type: 'win', required: true },
      { id: 'perfect', description: 'Finish with 80% HP', type: 'health_percent', value: 80, star: true },
      { id: 'damage', description: 'Deal 3000+ total damage', type: 'damage_dealt', value: 3000, star: true },
    ],
    rewards: {
      gold: 280,
      xp: 800,
      equipment: ['thunderstrike', 'ring_of_fury'],
    },
    unlocks: ['shadow_boss'],
  },

  shadow_boss: {
    id: 'shadow_boss',
    region: 'shadow',
    name: 'The Dark Champion',
    description: 'Face the ruler of shadows in an ultimate showdown!',
    difficulty: 12,
    type: 'boss',
    dialogue: {
      before: '"I am the void. I am eternal. You cannot defeat me!"',
      after: '"Impossible... A mortal... defeated me...? You are... truly a legend..."',
    },
    enemy: {
      name: 'Dark Champion Malakar',
      class: 'HYBRID',
      health: 1200,
      strength: 28,
      level: 12,
      isBoss: true,
    },
    objectives: [
      { id: 'win', description: 'Defeat the Dark Champion', type: 'win', required: true },
      { id: 'legendary', description: 'Win with 40% HP remaining', type: 'health_percent', value: 40, star: true },
      { id: 'power', description: 'Deal 600+ damage in one hit', type: 'single_hit', value: 600, star: true },
    ],
    rewards: {
      gold: 400,
      xp: 1000,
      equipment: ['excalibur', 'aegis_of_legends'],
    },
    unlocks: ['region_champions'],
  },

  // ========== CHAMPIONS VALLEY ==========
  champions_1: {
    id: 'champions_1',
    region: 'champions',
    name: 'Hall of Heroes',
    description: 'Face legendary champions who came before you.',
    difficulty: 13,
    type: 'standard',
    dialogue: {
      before: '"We are the champions of old. Prove you belong among us!"',
      after: '"Welcome to the Hall. You have earned your place."',
    },
    enemy: {
      name: 'Champion Theron',
      class: 'WARRIOR',
      health: 1000,
      strength: 30,
      level: 13,
    },
    objectives: [
      { id: 'win', description: 'Defeat Champion Theron', type: 'win', required: true },
      { id: 'crits', description: 'Land 5 critical hits', type: 'crits', value: 5, star: true },
      { id: 'combo', description: 'Build a 6-hit combo', type: 'combo', value: 6, star: true },
    ],
    rewards: {
      gold: 350,
      xp: 900,
      equipment: ['crown_of_champions'],
    },
    unlocks: ['champions_2'],
  },

  champions_2: {
    id: 'champions_2',
    region: 'champions',
    name: 'Trial of Legends',
    description: 'Face three legendary warriors in succession!',
    difficulty: 14,
    type: 'survival',
    dialogue: {
      before: '"Three legends stand before you. Can you overcome them all?"',
      after: '"Remarkable! Few have ever passed this trial!"',
    },
    waves: [
      { name: 'Legend Cassia', class: 'AGILE', health: 850, strength: 28, level: 13 },
      { name: 'Legend Brutus', class: 'TANK', health: 1200, strength: 24, level: 14 },
      { name: 'Legend Arcturus', class: 'MAGE', health: 700, strength: 35, level: 14 },
    ],
    objectives: [
      { id: 'win', description: 'Defeat all three legends', type: 'win', required: true },
      { id: 'flawless', description: 'Take less than 200 damage total', type: 'damage_taken', value: 200, star: true },
      { id: 'efficient', description: 'Win within 15 rounds total', type: 'rounds', value: 15, star: true },
    ],
    rewards: {
      gold: 450,
      xp: 1200,
    },
    unlocks: ['champions_final'],
  },

  champions_final: {
    id: 'champions_final',
    region: 'champions',
    name: 'The Arena Master',
    description: 'Face the undefeated Arena Master in the ultimate battle!',
    difficulty: 15,
    type: 'boss',
    dialogue: {
      before: '"I am the Arena Master. None have defeated me in 100 years. Come, legend!"',
      after: '"At last... a worthy successor. You are now... a Legend of the Arena!"',
    },
    enemy: {
      name: 'Arena Master Valerian',
      class: 'BALANCED',
      health: 1500,
      strength: 35,
      level: 15,
      isBoss: true,
    },
    objectives: [
      { id: 'win', description: 'Defeat the Arena Master', type: 'win', required: true },
      { id: 'master', description: 'Win with 50% HP remaining', type: 'health_percent', value: 50, star: true },
      { id: 'legend', description: 'Complete in under 10 rounds', type: 'rounds', value: 10, star: true },
    ],
    rewards: {
      gold: 600,
      xp: 1500,
    },
    unlocks: ['victory'],
  },
};

/**
 * Get mission by ID
 */
export function getMissionById(id) {
  return STORY_MISSIONS[id] || null;
}

/**
 * Get all missions for a region
 */
export function getMissionsByRegion(regionId) {
  return Object.values(STORY_MISSIONS).filter(m => m.region === regionId).map(m => m.id);
}

/**
 * Get mission difficulty label
 */
export function getDifficultyLabel(difficulty) {
  if (difficulty <= 3) return 'Easy';
  if (difficulty <= 7) return 'Normal';
  if (difficulty <= 11) return 'Hard';
  return 'Extreme';
}

/**
 * Get mission type icon
 */
export function getMissionTypeIcon(type) {
  const icons = {
    standard: '⚔️',
    survival: '🛡️',
    boss: '👑',
  };
  return icons[type] || '⚔️';
}
