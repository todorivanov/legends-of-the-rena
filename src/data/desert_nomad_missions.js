/**
 * Desert Nomad Story Path Missions
 * 14 missions surviving and thriving in the harsh desert
 *
 * Path Mechanics:
 * - Water Current: Resource management (starts at 100, consumption/replenishment)
 * - Oases Discovered: Critical water sources found
 * - Caravans Defended: Merchant protection missions
 * - Desert Reputation: Standing with nomad tribes
 */

export const DESERT_NOMAD_MISSIONS = {
  // ========== ACT 1: DESERT SURVIVAL (Missions 1-5) ==========

  desert_01_first_oasis: {
    id: 'desert_01_first_oasis',
    pathId: 'desert_nomad',
    name: 'First Oasis',
    description: 'Lost in the desert, you discover your first oasis. Water means life.',
    difficulty: 1,
    type: 'standard',
    act: 1,
    waterCurrent: 100,
    oasesDiscovered: 1,

    dialogue: {
      before: '"The sun burns, your throat is dry. There! Water in the distance!"',
      after: '"Sweet water! You will survive another day. But the desert is vast..."',
      relief: '"Remember this place. Oases are precious in the endless sands."',
    },

    enemy: {
      name: 'Desert Scavenger',
      class: 'AGILE',
      health: 180,
      strength: 10,
      level: 1,
    },

    objectives: [
      { id: 'win', description: 'Secure the oasis', type: 'win', required: true },
      {
        id: 'conserve',
        description: 'Take less than 45 damage',
        type: 'damage_taken',
        value: 45,
        star: true,
      },
      { id: 'efficient', description: 'Win within 6 rounds', type: 'rounds', value: 6, star: true },
    ],

    rewards: {
      gold: 40,
      xp: 120,
    },

    unlocks: ['desert_02_water_lesson'],

    pathMechanicEffects: {
      waterCurrent: 100,
      oasesDiscovered: ['First Oasis'],
      desertReputation: 5,
    },
  },

  desert_02_water_lesson: {
    id: 'desert_02_water_lesson',
    pathId: 'desert_nomad',
    name: 'Water Wisdom',
    description: 'A desert elder teaches you to survive. Every drop of water is precious.',
    difficulty: 2,
    type: 'standard',
    act: 1,
    waterCurrent: 85,
    oasesDiscovered: 1,

    dialogue: {
      before: '"Foolish one! The desert takes more than it gives. Learn or die!"',
      after: '"You learn quickly. The desert may spare you yet."',
      elderWisdom: '"Travel by night, rest by day. Seek the hidden oases. Conserve every drop."',
    },

    enemy: {
      name: 'Desert Wanderer',
      class: 'BALANCED',
      health: 250,
      strength: 13,
      level: 2,
    },

    objectives: [
      { id: 'win', description: 'Prove you can survive', type: 'win', required: true },
      { id: 'combo', description: 'Build a 2-hit combo', type: 'combo', value: 2, star: true },
      {
        id: 'health',
        description: 'Finish with 60% HP',
        type: 'health_percent',
        value: 60,
        star: true,
      },
    ],

    rewards: {
      gold: 70,
      xp: 180,
    },

    unlocks: ['desert_03_sandstorm'],

    pathMechanicEffects: {
      waterCurrent: 85,
      oasesDiscovered: ['First Oasis'],
      desertReputation: 10,
      waterWisdom: 'Learned',
    },
  },

  desert_03_sandstorm: {
    id: 'desert_03_sandstorm',
    pathId: 'desert_nomad',
    name: 'Sandstorm Survival',
    description: 'A massive sandstorm strikes! Find shelter and survive the fury of the desert.',
    difficulty: 3,
    type: 'standard',
    act: 1,
    waterCurrent: 70,
    oasesDiscovered: 1,

    dialogue: {
      before: '"The wind howls! The sands rise! Take cover or be buried alive!"',
      after: '"You survived the storm! The desert respects the strong."',
      aftermath: '"Sandstorms test all who dare the endless wastes. You passed."',
    },

    enemy: {
      name: 'Sand Wraith',
      class: 'AGILE',
      health: 290,
      strength: 16,
      level: 3,
    },

    objectives: [
      { id: 'win', description: 'Survive the sandstorm', type: 'win', required: true },
      { id: 'crits', description: 'Land 3 critical hits', type: 'crits', value: 3, star: true },
      { id: 'fast', description: 'Win within 8 rounds', type: 'rounds', value: 8, star: true },
    ],

    rewards: {
      gold: 110,
      xp: 260,
      equipment: ['leather_vest'],
    },

    unlocks: ['desert_04_caravan_defense'],

    pathMechanicEffects: {
      waterCurrent: 70,
      oasesDiscovered: ['First Oasis'],
      desertReputation: 15,
      sandstormsSurvived: 1,
    },
  },

  desert_04_caravan_defense: {
    id: 'desert_04_caravan_defense',
    pathId: 'desert_nomad',
    name: 'First Caravan',
    description: 'Protect a merchant caravan from raiders. Gold and water are your reward.',
    difficulty: 4,
    type: 'survival',
    act: 1,
    waterCurrent: 60,
    oasesDiscovered: 1,

    dialogue: {
      before: '"Raiders approach! Defend the caravan and I\'ll reward you handsomely!"',
      after: '"You saved our goods! Take water and gold as thanks!"',
      merchantGratitude: '"You are always welcome at our caravans, desert warrior!"',
    },

    waves: [
      { name: 'Desert Raider', class: 'AGILE', health: 280, strength: 17, level: 4 },
      { name: 'Raider Chief', class: 'WARRIOR', health: 340, strength: 19, level: 4 },
    ],

    objectives: [
      { id: 'win', description: 'Protect the caravan', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Finish with 55% HP',
        type: 'health_percent',
        value: 55,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 650+ total damage',
        type: 'damage_dealt',
        value: 650,
        star: true,
      },
    ],

    rewards: {
      gold: 180,
      xp: 400,
      equipment: ['iron_sword', 'chainmail'],
    },

    unlocks: ['desert_05_oasis_guardian'],

    pathMechanicEffects: {
      waterCurrent: 85, // Caravan merchants give water!
      oasesDiscovered: ['First Oasis'],
      desertReputation: 25,
      caravansDefended: 1,
      merchantAlliance: true,
    },
  },

  desert_05_oasis_guardian: {
    id: 'desert_05_oasis_guardian',
    pathId: 'desert_nomad',
    name: 'Second Oasis',
    description: 'Discover a second oasis, but a powerful guardian claims it. Prove your worth.',
    difficulty: 5,
    type: 'boss',
    act: 1,
    waterCurrent: 75,
    oasesDiscovered: 2,

    dialogue: {
      before: '"This oasis is mine! None shall drink here without my permission!"',
      after: '"You have proven stronger. The oasis is yours... for now."',
      respect: '"You are no ordinary wanderer. The desert favors you."',
    },

    enemy: {
      name: 'Oasis Guardian',
      class: 'TANK',
      health: 480,
      strength: 22,
      level: 5,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the guardian', type: 'win', required: true },
      {
        id: 'strong',
        description: 'Win with 50% HP remaining',
        type: 'health_percent',
        value: 50,
        star: true,
      },
      { id: 'combo', description: 'Build a 4-hit combo', type: 'combo', value: 4, star: true },
    ],

    rewards: {
      gold: 280,
      xp: 550,
      equipment: ['flame_blade'],
    },

    unlocks: ['desert_06_nomad_tribe'],

    pathMechanicEffects: {
      waterCurrent: 100, // Oasis fully replenishes!
      oasesDiscovered: ['First Oasis', 'Second Oasis'],
      desertReputation: 35,
    },
  },

  // ========== ACT 2: DESERT PROSPERITY (Missions 6-10) ==========

  desert_06_nomad_tribe: {
    id: 'desert_06_nomad_tribe',
    pathId: 'desert_nomad',
    name: 'Nomad Tribe',
    description: 'Join a nomad tribe. Together, you can thrive where others perish.',
    difficulty: 6,
    type: 'standard',
    act: 2,
    waterCurrent: 90,
    oasesDiscovered: 3,

    dialogue: {
      before: '"Prove you can keep pace with our warriors, outsider!"',
      after: '"You have earned your place among us! Welcome, sand brother!"',
      acceptance: '"Share our water, share our fire. You are one of us now."',
    },

    enemy: {
      name: 'Nomad Champion',
      class: 'BERSERKER',
      health: 450,
      strength: 26,
      level: 6,
    },

    objectives: [
      { id: 'win', description: "Earn the tribe's respect", type: 'win', required: true },
      { id: 'crits', description: 'Land 4 critical hits', type: 'crits', value: 4, star: true },
      { id: 'skills', description: 'Use 5 skills', type: 'skills_used', value: 5, star: true },
    ],

    rewards: {
      gold: 350,
      xp: 720,
    },

    unlocks: ['desert_07_caravan_network'],

    pathMechanicEffects: {
      waterCurrent: 90,
      oasesDiscovered: ['First Oasis', 'Second Oasis', 'Nomad Oasis'],
      desertReputation: 50,
      nomadTribe: 'Member',
    },
  },

  desert_07_caravan_network: {
    id: 'desert_07_caravan_network',
    pathId: 'desert_nomad',
    name: 'Caravan Network',
    description: 'Protect multiple caravans. Establish yourself as guardian of the trade routes.',
    difficulty: 7,
    type: 'survival',
    act: 2,
    waterCurrent: 85,
    oasesDiscovered: 3,

    dialogue: {
      before: '"Three caravans need protection! Can you defend them all?"',
      after: '"Incredible! The trade routes are secure thanks to you!"',
      reputation: '"Your name is spoken with reverence in every trading post!"',
    },

    waves: [
      { name: 'Raider Scout', class: 'AGILE', health: 400, strength: 24, level: 7 },
      { name: 'Raider Band', class: 'BRAWLER', health: 480, strength: 26, level: 7 },
      { name: 'Raider Warlord', class: 'WARRIOR', health: 550, strength: 30, level: 8 },
    ],

    objectives: [
      { id: 'win', description: 'Defend all caravans', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Finish with 45% HP',
        type: 'health_percent',
        value: 45,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 1100+ total damage',
        type: 'damage_dealt',
        value: 1100,
        star: true,
      },
    ],

    rewards: {
      gold: 500,
      xp: 950,
      equipment: ['steel_plate', 'mystic_robes'],
    },

    unlocks: ['desert_08_hidden_oasis'],

    pathMechanicEffects: {
      waterCurrent: 95, // Merchants reward you with water
      oasesDiscovered: ['First Oasis', 'Second Oasis', 'Nomad Oasis'],
      desertReputation: 65,
      caravansDefended: 4, // Total: 1+3=4
      tradeRoutesEstablished: 1,
      merchantReputation: 'High',
    },
  },

  desert_08_hidden_oasis: {
    id: 'desert_08_hidden_oasis',
    pathId: 'desert_nomad',
    name: 'Hidden Oasis',
    description: 'Discover the legendary hidden oasis. Ancient magic protects these waters.',
    difficulty: 8,
    type: 'boss',
    act: 2,
    waterCurrent: 90,
    oasesDiscovered: 4,

    dialogue: {
      before: '"The hidden oasis! Its waters grant power beyond measure!"',
      after: '"The magical waters are yours! You feel strength coursing through you!"',
      magic: '"This oasis is blessed by ancient spirits. Its waters never run dry."',
    },

    enemy: {
      name: 'Water Spirit',
      class: 'MAGE',
      health: 580,
      strength: 34,
      level: 9,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Claim the hidden oasis', type: 'win', required: true },
      {
        id: 'perfect',
        description: 'Win with 45% HP remaining',
        type: 'health_percent',
        value: 45,
        star: true,
      },
      { id: 'combo', description: 'Build a 5-hit combo', type: 'combo', value: 5, star: true },
    ],

    rewards: {
      gold: 700,
      xp: 1250,
      equipment: ['dragons_fang', 'arcane_staff'],
    },

    unlocks: ['desert_09_sand_prince'],

    pathMechanicEffects: {
      waterCurrent: 100, // Magical oasis grants abundant water!
      oasesDiscovered: ['First Oasis', 'Second Oasis', 'Nomad Oasis', 'Hidden Oasis'],
      desertReputation: 75,
      magicOasis: true,
    },
  },

  desert_09_sand_prince: {
    id: 'desert_09_sand_prince',
    pathId: 'desert_nomad',
    name: 'Challenge of the Sand Prince',
    description:
      'The desert prince challenges you. Prove you are worthy of the title "Desert Master".',
    difficulty: 9,
    type: 'standard',
    act: 2,
    waterCurrent: 95,
    oasesDiscovered: 4,

    dialogue: {
      before: '"You dare claim mastery of MY desert? Face me, pretender!"',
      after: '"You... you have defeated me! You ARE the true Desert Master!"',
      recognition: '"I yield to your superior skill. The desert acknowledges you!"',
    },

    enemy: {
      name: 'Sand Prince',
      class: 'ASSASSIN',
      health: 620,
      strength: 38,
      level: 10,
    },

    objectives: [
      { id: 'win', description: 'Defeat the Sand Prince', type: 'win', required: true },
      { id: 'crits', description: 'Land 6 critical hits', type: 'crits', value: 6, star: true },
      {
        id: 'efficient',
        description: 'Win within 12 rounds',
        type: 'rounds',
        value: 12,
        star: true,
      },
    ],

    rewards: {
      gold: 950,
      xp: 1550,
      equipment: ['shadow_dagger', 'titans_guard'],
    },

    unlocks: ['desert_10_prosperity'],

    pathMechanicEffects: {
      waterCurrent: 95,
      oasesDiscovered: ['First Oasis', 'Second Oasis', 'Nomad Oasis', 'Hidden Oasis'],
      desertReputation: 85,
      desertMaster: true,
    },
  },

  desert_10_prosperity: {
    id: 'desert_10_prosperity',
    pathId: 'desert_nomad',
    name: 'Desert Prosperity',
    description:
      'Create a thriving desert haven. Water, trade, and peace flourish under your protection.',
    difficulty: 10,
    type: 'boss',
    act: 2,
    waterCurrent: 100,
    oasesDiscovered: 5,

    dialogue: {
      before: '"The old warlord returns! He wants to reclaim the desert for tyranny!"',
      after: '"The warlord is defeated! Peace and prosperity reign!"',
      celebration: '"Under your guidance, the desert blooms! You are our savior!"',
    },

    enemy: {
      name: 'Desert Warlord',
      class: 'HYBRID',
      health: 720,
      strength: 42,
      level: 11,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the warlord', type: 'win', required: true },
      {
        id: 'strong',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
        star: true,
      },
      { id: 'combo', description: 'Build a 6-hit combo', type: 'combo', value: 6, star: true },
    ],

    rewards: {
      gold: 1300,
      xp: 1850,
      equipment: ['thunderstrike', 'phoenix_armor'],
    },

    unlocks: ['desert_11_legendary_oasis'],

    pathMechanicEffects: {
      waterCurrent: 100,
      oasesDiscovered: [
        'First Oasis',
        'Second Oasis',
        'Nomad Oasis',
        'Hidden Oasis',
        'Prosperity Oasis',
      ],
      desertReputation: 95,
      prosperity: 'Achieved',
      tradeRoutesEstablished: 3,
    },
  },

  // ========== ACT 3: DESERT LEGEND (Missions 11-14) ==========

  desert_11_legendary_oasis: {
    id: 'desert_11_legendary_oasis',
    pathId: 'desert_nomad',
    name: 'Legendary Oasis',
    description: 'Seek the legendary eternal oasis. It is said to hold the secret of immortality.',
    difficulty: 11,
    type: 'standard',
    act: 3,
    waterCurrent: 100,
    oasesDiscovered: 6,

    dialogue: {
      before: '"The eternal oasis... where time stands still and water never ends..."',
      after: '"You found it! The legendary oasis is REAL!"',
      wonder: '"Its waters shimmer with otherworldly light. This is beyond mortal understanding."',
    },

    enemy: {
      name: 'Eternal Guardian',
      class: 'PALADIN',
      health: 800,
      strength: 45,
      level: 12,
    },

    objectives: [
      { id: 'win', description: 'Claim the eternal oasis', type: 'win', required: true },
      { id: 'skills', description: 'Use 7 skills', type: 'skills_used', value: 7, star: true },
      { id: 'combo', description: 'Build a 7-hit combo', type: 'combo', value: 7, star: true },
    ],

    rewards: {
      gold: 1700,
      xp: 2100,
      equipment: ['void_pendant'],
    },

    unlocks: ['desert_12_ancient_city'],

    pathMechanicEffects: {
      waterCurrent: 100,
      oasesDiscovered: [
        'First Oasis',
        'Second Oasis',
        'Nomad Oasis',
        'Hidden Oasis',
        'Prosperity Oasis',
        'Eternal Oasis',
      ],
      desertReputation: 100,
      eternalOasis: true,
    },
  },

  desert_12_ancient_city: {
    id: 'desert_12_ancient_city',
    pathId: 'desert_nomad',
    name: 'Ancient Desert City',
    description:
      'Discover an ancient city buried in the sands. What treasures and dangers lie within?',
    difficulty: 12,
    type: 'survival',
    act: 3,
    waterCurrent: 100,
    oasesDiscovered: 6,

    dialogue: {
      before: '"The lost city rises from the sands! Ancient warriors awaken!"',
      after: '"The city is conquered! Its treasures and knowledge are yours!"',
      revelation: '"This city predates all known civilizations. You have unlocked history itself!"',
    },

    waves: [
      { name: 'Ancient Sentinel', class: 'TANK', health: 700, strength: 42, level: 12 },
      { name: 'Sand Construct', class: 'WARRIOR', health: 650, strength: 44, level: 12 },
      { name: 'Desert Sphinx', class: 'MAGE', health: 600, strength: 48, level: 13 },
    ],

    objectives: [
      { id: 'win', description: 'Conquer the ancient city', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Finish with 35% HP',
        type: 'health_percent',
        value: 35,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 1400+ total damage',
        type: 'damage_dealt',
        value: 1400,
        star: true,
      },
    ],

    rewards: {
      gold: 2200,
      xp: 2450,
      equipment: ['ring_of_fury', 'crown_of_wisdom'],
    },

    unlocks: ['desert_13_desert_king'],

    pathMechanicEffects: {
      waterCurrent: 100,
      oasesDiscovered: [
        'First Oasis',
        'Second Oasis',
        'Nomad Oasis',
        'Hidden Oasis',
        'Prosperity Oasis',
        'Eternal Oasis',
      ],
      desertReputation: 100,
      ancientCity: 'Discovered',
      ancientKnowledge: 'Unlocked',
    },
  },

  desert_13_desert_king: {
    id: 'desert_13_desert_king',
    pathId: 'desert_nomad',
    name: 'King of the Desert',
    description: 'Unite all nomad tribes under your banner. Become the undisputed Desert King.',
    difficulty: 13,
    type: 'boss',
    act: 3,
    waterCurrent: 100,
    oasesDiscovered: 6,

    dialogue: {
      before: '"The tribes have gathered! Will you lead us to a golden age?"',
      after: '"HAIL THE DESERT KING! Your reign begins!"',
      coronation: '"All tribes bow to you. The desert is united under your rule!"',
    },

    enemy: {
      name: 'Rival Chieftain',
      class: 'BERSERKER',
      health: 850,
      strength: 48,
      level: 14,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Prove you are worthy to rule', type: 'win', required: true },
      {
        id: 'legendary',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
        star: true,
      },
      { id: 'crits', description: 'Land 8 critical hits', type: 'crits', value: 8, star: true },
    ],

    rewards: {
      gold: 3000,
      xp: 2750,
      equipment: ['excalibur', 'battle_helm'],
    },

    unlocks: ['desert_14_eternal_waters'],

    pathMechanicEffects: {
      waterCurrent: 100,
      oasesDiscovered: [
        'First Oasis',
        'Second Oasis',
        'Nomad Oasis',
        'Hidden Oasis',
        'Prosperity Oasis',
        'Eternal Oasis',
      ],
      desertReputation: 100,
      desertKing: true,
      tribesUnited: true,
    },
  },

  desert_14_eternal_waters: {
    id: 'desert_14_eternal_waters',
    pathId: 'desert_nomad',
    name: 'Master of Eternal Waters',
    description: 'Face the ultimate trial. Prove you are the eternal master of the desert.',
    difficulty: 15,
    type: 'boss',
    act: 3,
    waterCurrent: 100,
    oasesDiscovered: 6,

    dialogue: {
      before: '"You have conquered drought, raiders, and rival kings. Now face the desert itself!"',
      after: '"VICTORY! You are immortalized! The Eternal Master of the Desert!"',
      epilogue:
        '"Your legend will be told for a thousand years. Water flows eternally at your command!"',
    },

    enemy: {
      name: 'Spirit of the Desert',
      class: 'NECROMANCER',
      health: 1100,
      strength: 52,
      level: 15,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Become the eternal master', type: 'win', required: true },
      {
        id: 'ultimate',
        description: 'Win with 45% HP remaining',
        type: 'health_percent',
        value: 45,
        star: true,
      },
      {
        id: 'legendary',
        description: 'Deal 1600+ total damage',
        type: 'damage_dealt',
        value: 1600,
        star: true,
      },
    ],

    rewards: {
      gold: 5000,
      xp: 3000,
      equipment: ['crown_of_champions', 'aegis_of_legends'],
    },

    unlocks: ['path_complete'],

    pathMechanicEffects: {
      pathComplete: true,
      waterCurrent: 100,
      oasesDiscovered: [
        'First Oasis',
        'Second Oasis',
        'Nomad Oasis',
        'Hidden Oasis',
        'Prosperity Oasis',
        'Eternal Oasis',
      ],
      desertReputation: 100,
      eternalMaster: true,
      legacy: 'Master of Eternal Waters',
    },
  },
};

/**
 * Get mission by ID
 */
export function getDesertMissionById(id) {
  return DESERT_NOMAD_MISSIONS[id] || null;
}

/**
 * Get all missions for this path
 */
export function getAllDesertMissions() {
  return Object.values(DESERT_NOMAD_MISSIONS);
}

/**
 * Get missions by act
 */
export function getDesertMissionsByAct(act) {
  return Object.values(DESERT_NOMAD_MISSIONS).filter((m) => m.act === act);
}

/**
 * Get missions available based on water current and oases discovered
 */
export function getAvailableDesertMissions(waterCurrent, oasesCount) {
  return Object.values(DESERT_NOMAD_MISSIONS).filter(
    (m) => m.waterCurrent <= waterCurrent && m.oasesDiscovered <= oasesCount
  );
}

/**
 * Get next mission in progression
 */
export function getNextDesertMission(currentMissionId) {
  const current = DESERT_NOMAD_MISSIONS[currentMissionId];
  if (!current || !current.unlocks || current.unlocks.length === 0) return null;

  return DESERT_NOMAD_MISSIONS[current.unlocks[0]] || null;
}

/**
 * Check if mission is unlocked
 */
export function isDesertMissionUnlocked(missionId, completedMissions, waterCurrent) {
  const mission = DESERT_NOMAD_MISSIONS[missionId];
  if (!mission) return false;

  // Check water requirement
  if (mission.waterCurrent > waterCurrent) return false;

  // First mission is always available
  if (missionId === 'desert_01_first_oasis') return true;

  // Check if prerequisite mission is completed
  const allMissions = Object.values(DESERT_NOMAD_MISSIONS);
  const prerequisiteMission = allMissions.find((m) => m.unlocks && m.unlocks.includes(missionId));

  if (!prerequisiteMission) return false;

  return completedMissions[prerequisiteMission.id] !== undefined;
}

/**
 * Calculate water status based on current amount
 */
export function calculateWaterStatus(waterCurrent) {
  if (waterCurrent < 25) return 'critical';
  if (waterCurrent < 50) return 'low';
  if (waterCurrent < 75) return 'adequate';
  return 'abundant';
}

/**
 * Get oasis water replenishment amount
 */
export function getOasisBenefits(oasisName) {
  const oasisBenefits = {
    'First Oasis': 50,
    'Second Oasis': 50,
    'Nomad Oasis': 40,
    'Hidden Oasis': 60,
    'Prosperity Oasis': 50,
    'Eternal Oasis': 100, // Always full!
  };

  return oasisBenefits[oasisName] || 30;
}

export default DESERT_NOMAD_MISSIONS;
