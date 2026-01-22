/**
 * Barbarian Traveller Story Path Missions
 * 13 missions exploring tribal lands and uncovering ancient mysteries
 *
 * Path Mechanics:
 * - Discovered Locations: Track explored regions
 * - Tribal Reputation: Standing with different tribes
 * - Ancient Knowledge: Lore and secrets discovered
 * - Alliances: Friendly tribes
 */

export const BARBARIAN_TRAVELLER_MISSIONS = {
  // ========== ACT 1: WANDERER'S BEGINNING (Missions 1-4) ==========

  barbarian_01_leaving_homeland: {
    id: 'barbarian_01_leaving_homeland',
    pathId: 'barbarian_traveller',
    name: 'Leaving the Homeland',
    description: "Your journey begins. Prove yourself worthy of the wanderer's path.",
    difficulty: 1,
    type: 'standard',
    act: 1,
    discoveredLocations: 1,

    dialogue: {
      before: '"The elders have given their blessing. Your journey into the unknown begins."',
      after: '"You have honored your ancestors with victory. The path ahead beckons."',
      elderBlessing: '"May the spirits guide your steps, young wanderer."',
    },

    enemy: {
      name: 'Homeland Guardian',
      class: 'BALANCED',
      health: 170,
      strength: 9,
      level: 1,
    },

    objectives: [
      { id: 'win', description: 'Prove your worth', type: 'win', required: true },
      {
        id: 'honorable',
        description: 'Take less than 50 damage',
        type: 'damage_taken',
        value: 50,
        star: true,
      },
      { id: 'efficient', description: 'Win within 6 rounds', type: 'rounds', value: 6, star: true },
    ],

    rewards: {
      gold: 35,
      xp: 110,
    },

    unlocks: ['barbarian_02_first_tribe'],

    pathMechanicEffects: {
      discoveredLocations: ['Homeland Valley'],
      tribalReputation: { homeland: 20 },
      ancientKnowledge: 1,
    },
  },

  barbarian_02_first_tribe: {
    id: 'barbarian_02_first_tribe',
    pathId: 'barbarian',
    name: 'First Tribe',
    description: 'Encounter a foreign tribe. Will they be friend or foe?',
    difficulty: 2,
    type: 'standard',
    act: 1,
    discoveredLocations: 2,

    dialogue: {
      before: '"Strangers! State your business or face our warriors!"',
      after: '"You fight with honor. Share our fire and speak of your journey."',
      chieftainRespect: '"A traveller who walks in peace. You are welcome here."',
    },

    enemy: {
      name: 'Tribal Warrior',
      class: 'BRAWLER',
      health: 240,
      strength: 12,
      level: 2,
    },

    objectives: [
      { id: 'win', description: "Earn the tribe's respect", type: 'win', required: true },
      { id: 'combo', description: 'Build a 2-hit combo', type: 'combo', value: 2, star: true },
      {
        id: 'survive',
        description: 'Finish with 65% HP',
        type: 'health_percent',
        value: 65,
        star: true,
      },
    ],

    rewards: {
      gold: 60,
      xp: 160,
    },

    unlocks: ['barbarian_03_forest_depths'],

    pathMechanicEffects: {
      discoveredLocations: ['Homeland Valley', 'River Tribe Village'],
      tribalReputation: { homeland: 20, river_tribe: 30 },
      ancientKnowledge: 2,
      alliancesMade: ['River Tribe'],
    },
  },

  barbarian_03_forest_depths: {
    id: 'barbarian_03_forest_depths',
    pathId: 'barbarian_traveller',
    name: 'Forest Depths',
    description: 'Venture into the ancient forest. Legends speak of spirits that dwell within.',
    difficulty: 3,
    type: 'standard',
    act: 1,
    discoveredLocations: 3,

    dialogue: {
      before: '"The forest breathes with ancient power. Tread carefully, wanderer."',
      after: '"The forest spirits have tested you and found you worthy."',
      spiritWhisper: '"Knowledge seekers are always welcome in our domain..."',
    },

    enemy: {
      name: 'Forest Guardian',
      class: 'AGILE',
      health: 280,
      strength: 15,
      level: 3,
    },

    objectives: [
      { id: 'win', description: 'Defeat the forest guardian', type: 'win', required: true },
      { id: 'crits', description: 'Land 3 critical hits', type: 'crits', value: 3, star: true },
      { id: 'fast', description: 'Win within 8 rounds', type: 'rounds', value: 8, star: true },
    ],

    rewards: {
      gold: 100,
      xp: 240,
      equipment: ['leather_vest'],
    },

    unlocks: ['barbarian_04_mountain_pass'],

    pathMechanicEffects: {
      discoveredLocations: ['Homeland Valley', 'River Tribe Village', 'Ancient Forest'],
      tribalReputation: { homeland: 20, river_tribe: 30 },
      ancientKnowledge: 5,
      forestSpirits: 'Friendly',
    },
  },

  barbarian_04_mountain_pass: {
    id: 'barbarian_04_mountain_pass',
    pathId: 'barbarian_traveller',
    name: 'Mountain Pass',
    description: 'Cross the perilous mountain pass. Highland warriors defend their territory.',
    difficulty: 4,
    type: 'survival',
    act: 1,
    discoveredLocations: 4,

    dialogue: {
      before: '"None pass through our lands without proving their strength!"',
      after: '"You have earned passage. The highlands recognize your courage."',
    },

    waves: [
      { name: 'Highland Scout', class: 'AGILE', health: 280, strength: 16, level: 4 },
      { name: 'Highland Warrior', class: 'WARRIOR', health: 350, strength: 18, level: 4 },
    ],

    objectives: [
      { id: 'win', description: 'Cross the mountain pass', type: 'win', required: true },
      {
        id: 'health',
        description: 'Finish with 55% HP',
        type: 'health_percent',
        value: 55,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 600+ total damage',
        type: 'damage_dealt',
        value: 600,
        star: true,
      },
    ],

    rewards: {
      gold: 150,
      xp: 350,
      equipment: ['iron_sword', 'chainmail'],
    },

    unlocks: ['barbarian_05_ancient_ruins'],

    pathMechanicEffects: {
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
      ],
      tribalReputation: { homeland: 20, river_tribe: 30, highland_clan: 25 },
      ancientKnowledge: 6,
      alliancesMade: ['River Tribe', 'Highland Clan'],
    },
  },

  // ========== ACT 2: ANCIENT MYSTERIES (Missions 5-9) ==========

  barbarian_05_ancient_ruins: {
    id: 'barbarian_05_ancient_ruins',
    pathId: 'barbarian_traveller',
    name: 'Ancient Ruins',
    description: 'Discover ruins of a lost civilization. What secrets do they hold?',
    difficulty: 5,
    type: 'boss',
    act: 2,
    discoveredLocations: 5,

    dialogue: {
      before: '"These ruins predate all living memory. Something stirs within..."',
      after: '"The guardian has fallen! Ancient texts reveal themselves!"',
      revelation: '"The old prophecy... it speaks of a great convergence..."',
    },

    enemy: {
      name: 'Stone Guardian',
      class: 'TANK',
      health: 450,
      strength: 20,
      level: 5,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the ancient guardian', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Win with 50% HP remaining',
        type: 'health_percent',
        value: 50,
        star: true,
      },
      { id: 'combo', description: 'Build a 4-hit combo', type: 'combo', value: 4, star: true },
    ],

    rewards: {
      gold: 250,
      xp: 500,
      equipment: ['flame_blade'],
    },

    unlocks: ['barbarian_06_tribal_council'],

    pathMechanicEffects: {
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
        'Lost Ruins',
      ],
      tribalReputation: { homeland: 20, river_tribe: 30, highland_clan: 25 },
      ancientKnowledge: 15,
      prophecyDiscovered: true,
    },
  },

  barbarian_06_tribal_council: {
    id: 'barbarian_06_tribal_council',
    pathId: 'barbarian_traveller',
    name: 'Tribal Council',
    description: 'Unite the tribes for a great council. Ancient knowledge must be shared.',
    difficulty: 6,
    type: 'standard',
    act: 2,
    discoveredLocations: 5,

    dialogue: {
      before: '"The tribes gather! Prove your words with strength!"',
      after: '"The council recognizes your wisdom. The tribes will unite!"',
      councilDecision: '"Together, we shall face what comes from the ancient places."',
    },

    enemy: {
      name: 'Skeptical Chieftain',
      class: 'BERSERKER',
      health: 420,
      strength: 24,
      level: 6,
    },

    objectives: [
      { id: 'win', description: 'Convince the skeptical chieftain', type: 'win', required: true },
      { id: 'crits', description: 'Land 4 critical hits', type: 'crits', value: 4, star: true },
      { id: 'skills', description: 'Use 5 skills', type: 'skills_used', value: 5, star: true },
    ],

    rewards: {
      gold: 300,
      xp: 650,
    },

    unlocks: ['barbarian_07_sacred_grove'],

    pathMechanicEffects: {
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
        'Lost Ruins',
      ],
      tribalReputation: { homeland: 40, river_tribe: 50, highland_clan: 45, plains_tribe: 30 },
      ancientKnowledge: 18,
      alliancesMade: ['River Tribe', 'Highland Clan', 'Plains Tribe', 'Forest Dwellers'],
      tribalCouncil: 'United',
    },
  },

  barbarian_07_sacred_grove: {
    id: 'barbarian_07_sacred_grove',
    pathId: 'barbarian_traveller',
    name: 'Sacred Grove',
    description: 'The druids guard sacred knowledge. Prove yourself to the keepers of lore.',
    difficulty: 7,
    type: 'standard',
    act: 2,
    discoveredLocations: 6,

    dialogue: {
      before: '"The sacred grove tests all who seek its wisdom. Are you prepared?"',
      after: '"You have proven worthy. The ancient secrets are yours to protect."',
      druidWisdom: '"The darkness gathers. Only united can the tribes survive."',
    },

    enemy: {
      name: 'Druid Keeper',
      class: 'MAGE',
      health: 400,
      strength: 28,
      level: 7,
    },

    objectives: [
      { id: 'win', description: "Pass the druid's test", type: 'win', required: true },
      { id: 'combo', description: 'Build a 5-hit combo', type: 'combo', value: 5, star: true },
      {
        id: 'efficient',
        description: 'Win within 10 rounds',
        type: 'rounds',
        value: 10,
        star: true,
      },
    ],

    rewards: {
      gold: 400,
      xp: 850,
      equipment: ['mystic_robes', 'arcane_staff'],
    },

    unlocks: ['barbarian_08_shadow_threat'],

    pathMechanicEffects: {
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
        'Lost Ruins',
        'Sacred Grove',
      ],
      tribalReputation: { homeland: 40, river_tribe: 50, highland_clan: 45, plains_tribe: 30 },
      ancientKnowledge: 30,
      druidAlliance: true,
      sacredSecrets: 'Revealed',
    },
  },

  barbarian_08_shadow_threat: {
    id: 'barbarian_08_shadow_threat',
    pathId: 'barbarian_traveller',
    name: 'Shadow Threat',
    description: 'Dark forces emerge from the ruins. The prophecy begins to unfold.',
    difficulty: 8,
    type: 'survival',
    act: 2,
    discoveredLocations: 6,

    dialogue: {
      before: '"They come! Shadow warriors from the ancient darkness!"',
      after: '"The shadow retreats... but this is only the beginning."',
      warning: '"The prophecy speaks of three trials. This was merely the first."',
    },

    waves: [
      { name: 'Shadow Scout', class: 'ASSASSIN', health: 380, strength: 26, level: 8 },
      { name: 'Shadow Warrior', class: 'WARRIOR', health: 450, strength: 28, level: 8 },
      { name: 'Shadow Priest', class: 'NECROMANCER', health: 400, strength: 32, level: 9 },
    ],

    objectives: [
      { id: 'win', description: 'Defeat the shadow forces', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Finish with 45% HP',
        type: 'health_percent',
        value: 45,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 1000+ total damage',
        type: 'damage_dealt',
        value: 1000,
        star: true,
      },
    ],

    rewards: {
      gold: 550,
      xp: 1100,
      equipment: ['steel_plate', 'shadow_dagger'],
    },

    unlocks: ['barbarian_09_alliance_tested'],

    pathMechanicEffects: {
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
        'Lost Ruins',
        'Sacred Grove',
      ],
      tribalReputation: { homeland: 50, river_tribe: 60, highland_clan: 55, plains_tribe: 40 },
      ancientKnowledge: 35,
      shadowThreat: 'Known',
      prophecyProgress: 1,
    },
  },

  barbarian_09_alliance_tested: {
    id: 'barbarian_09_alliance_tested',
    pathId: 'barbarian_traveller',
    name: 'Alliance Tested',
    description: 'The tribal alliance faces its greatest challenge. Stand united or fall divided.',
    difficulty: 9,
    type: 'boss',
    act: 2,
    discoveredLocations: 6,

    dialogue: {
      before: '"The shadow lord himself comes! This is the second trial!"',
      after: '"Victory! The tribes stand strong! But the final trial awaits..."',
      prophecy: '"Two trials complete. The third will determine the fate of all."',
    },

    enemy: {
      name: 'Shadow Lord',
      class: 'HYBRID',
      health: 650,
      strength: 35,
      level: 10,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the Shadow Lord', type: 'win', required: true },
      {
        id: 'perfect',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
        star: true,
      },
      { id: 'crits', description: 'Land 7 critical hits', type: 'crits', value: 7, star: true },
    ],

    rewards: {
      gold: 800,
      xp: 1450,
      equipment: ['dragons_fang', 'titans_guard'],
    },

    unlocks: ['barbarian_10_deepest_ruins'],

    pathMechanicEffects: {
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
        'Lost Ruins',
        'Sacred Grove',
      ],
      tribalReputation: { homeland: 70, river_tribe: 80, highland_clan: 75, plains_tribe: 60 },
      ancientKnowledge: 45,
      prophecyProgress: 2,
      allianceStrength: 'Proven',
    },
  },

  // ========== ACT 3: DESTINY FULFILLED (Missions 10-13) ==========

  barbarian_10_deepest_ruins: {
    id: 'barbarian_10_deepest_ruins',
    pathId: 'barbarian_traveller',
    name: 'Deepest Ruins',
    description: 'Journey to the heart of the ancient ruins. The source of darkness awaits.',
    difficulty: 11,
    type: 'standard',
    act: 3,
    discoveredLocations: 7,

    dialogue: {
      before: '"The deepest chamber... where it all began. Steel yourself, wanderer."',
      after: '"The ancient evil stirs! The final trial approaches!"',
      ancientVoice: '"You have done well to come this far. But the true test lies ahead."',
    },

    enemy: {
      name: 'Ancient Construct',
      class: 'TANK',
      health: 750,
      strength: 38,
      level: 12,
    },

    objectives: [
      { id: 'win', description: 'Defeat the ancient construct', type: 'win', required: true },
      { id: 'combo', description: 'Build a 6-hit combo', type: 'combo', value: 6, star: true },
      { id: 'skills', description: 'Use 7 skills', type: 'skills_used', value: 7, star: true },
    ],

    rewards: {
      gold: 1100,
      xp: 1800,
      equipment: ['thunderstrike'],
    },

    unlocks: ['barbarian_11_prophecy_revealed'],

    pathMechanicEffects: {
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
        'Lost Ruins',
        'Sacred Grove',
        'Deep Ruins',
      ],
      tribalReputation: { homeland: 70, river_tribe: 80, highland_clan: 75, plains_tribe: 60 },
      ancientKnowledge: 60,
      prophecyProgress: 2,
    },
  },

  barbarian_11_prophecy_revealed: {
    id: 'barbarian_11_prophecy_revealed',
    pathId: 'barbarian_traveller',
    name: 'Prophecy Revealed',
    description: 'The full prophecy is revealed. You are the one foretold.',
    difficulty: 12,
    type: 'boss',
    act: 3,
    discoveredLocations: 7,

    dialogue: {
      before: '"The prophecy speaks... you are the Chosen Wanderer, destined to unite and save."',
      after: '"The prophecy is clear. You must face the Ancient One in final battle."',
      destiny: '"Your journey was never random. The spirits guided you to this moment."',
    },

    enemy: {
      name: 'Prophecy Guardian',
      class: 'PALADIN',
      health: 800,
      strength: 42,
      level: 13,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Prove you are the Chosen', type: 'win', required: true },
      {
        id: 'legendary',
        description: 'Win with 35% HP remaining',
        type: 'health_percent',
        value: 35,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 1300+ total damage',
        type: 'damage_dealt',
        value: 1300,
        star: true,
      },
    ],

    rewards: {
      gold: 1600,
      xp: 2200,
      equipment: ['phoenix_armor', 'void_pendant'],
    },

    unlocks: ['barbarian_12_ancient_enemy'],

    pathMechanicEffects: {
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
        'Lost Ruins',
        'Sacred Grove',
        'Deep Ruins',
      ],
      tribalReputation: { homeland: 90, river_tribe: 100, highland_clan: 95, plains_tribe: 80 },
      ancientKnowledge: 80,
      prophecyProgress: 3,
      chosenOne: true,
    },
  },

  barbarian_12_ancient_enemy: {
    id: 'barbarian_12_ancient_enemy',
    pathId: 'barbarian_traveller',
    name: 'Ancient Enemy',
    description: 'Face the source of all darkness. The ancient evil awakens.',
    difficulty: 13,
    type: 'boss',
    act: 3,
    discoveredLocations: 8,

    dialogue: {
      before: '"I have slumbered for millennia. Now I shall reclaim this world!"',
      after: '"The ancient evil falls! But its influence lingers..."',
      aftermath: '"The battle is won, but the war continues. One final trial remains."',
    },

    enemy: {
      name: 'Ancient Darkness',
      class: 'NECROMANCER',
      health: 900,
      strength: 46,
      level: 14,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the Ancient Darkness', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Win with 30% HP remaining',
        type: 'health_percent',
        value: 30,
        star: true,
      },
      {
        id: 'perfect',
        description: 'Complete within 15 rounds',
        type: 'rounds',
        value: 15,
        star: true,
      },
    ],

    rewards: {
      gold: 2300,
      xp: 2600,
      equipment: ['ring_of_fury', 'excalibur'],
    },

    unlocks: ['barbarian_13_eternal_guardian'],

    pathMechanicEffects: {
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
        'Lost Ruins',
        'Sacred Grove',
        'Deep Ruins',
        'Darkness Source',
      ],
      tribalReputation: { homeland: 100, river_tribe: 100, highland_clan: 100, plains_tribe: 100 },
      ancientKnowledge: 95,
      prophecyProgress: 3,
      ancientEvilDefeated: true,
    },
  },

  barbarian_13_eternal_guardian: {
    id: 'barbarian_13_eternal_guardian',
    pathId: 'barbarian_traveller',
    name: 'Eternal Guardian',
    description: 'Take your place as the eternal guardian of the tribes. Destiny fulfilled.',
    difficulty: 15,
    type: 'boss',
    act: 3,
    discoveredLocations: 8,

    dialogue: {
      before: '"This is your destiny. Become the eternal guardian, protector of all tribes!"',
      after: '"VICTORY! You are now immortal in legend! The Eternal Guardian of the tribes!"',
      epilogue:
        '"Your name will be spoken with reverence for a thousand generations. You are legend."',
    },

    enemy: {
      name: 'Final Trial',
      class: 'HYBRID',
      health: 1000,
      strength: 50,
      level: 15,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Complete the final trial', type: 'win', required: true },
      {
        id: 'ultimate',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
        star: true,
      },
      {
        id: 'legendary',
        description: 'Deal 1500+ total damage',
        type: 'damage_dealt',
        value: 1500,
        star: true,
      },
    ],

    rewards: {
      gold: 4000,
      xp: 3000,
      equipment: ['crown_of_champions', 'aegis_of_legends'],
    },

    unlocks: ['path_complete'],

    pathMechanicEffects: {
      pathComplete: true,
      discoveredLocations: [
        'Homeland Valley',
        'River Tribe Village',
        'Ancient Forest',
        'Highland Pass',
        'Lost Ruins',
        'Sacred Grove',
        'Deep Ruins',
        'Darkness Source',
      ],
      tribalReputation: { homeland: 100, river_tribe: 100, highland_clan: 100, plains_tribe: 100 },
      ancientKnowledge: 100,
      prophecyProgress: 3,
      guardianStatus: 'Eternal',
      legacy: 'Guardian of All Tribes',
    },
  },
};

/**
 * Get mission by ID
 */
export function getBarbarianMissionById(id) {
  return BARBARIAN_TRAVELLER_MISSIONS[id] || null;
}

/**
 * Get all missions for this path
 */
export function getAllBarbarianMissions() {
  return Object.values(BARBARIAN_TRAVELLER_MISSIONS);
}

/**
 * Get missions by act
 */
export function getBarbarianMissionsByAct(act) {
  return Object.values(BARBARIAN_TRAVELLER_MISSIONS).filter((m) => m.act === act);
}

/**
 * Get missions available based on discovered locations and tribal reputation
 */
export function getAvailableBarbarianMissions(discoveredLocations, tribalReputation) {
  return Object.values(BARBARIAN_TRAVELLER_MISSIONS).filter(
    (m) => m.discoveredLocations <= discoveredLocations.length
  );
}

/**
 * Get next mission in progression
 */
export function getNextBarbarianMission(currentMissionId) {
  const current = BARBARIAN_TRAVELLER_MISSIONS[currentMissionId];
  if (!current || !current.unlocks || current.unlocks.length === 0) return null;

  return BARBARIAN_TRAVELLER_MISSIONS[current.unlocks[0]] || null;
}

/**
 * Check if mission is unlocked
 */
export function isBarbarianMissionUnlocked(missionId, completedMissions, discoveredLocations) {
  const mission = BARBARIAN_TRAVELLER_MISSIONS[missionId];
  if (!mission) return false;

  // Check discovered locations requirement
  if (mission.discoveredLocations > discoveredLocations.length) return false;

  // First mission is always available
  if (missionId === 'barbarian_01_leaving_homeland') return true;

  // Check if prerequisite mission is completed
  const allMissions = Object.values(BARBARIAN_TRAVELLER_MISSIONS);
  const prerequisiteMission = allMissions.find((m) => m.unlocks && m.unlocks.includes(missionId));

  if (!prerequisiteMission) return false;

  return completedMissions[prerequisiteMission.id] !== undefined;
}

/**
 * Get tribal reputation with specific tribe
 */
export function getTribeReputation(tribeName, tribalReputation) {
  return tribalReputation[tribeName] || 0;
}

/**
 * Calculate exploration progress percentage
 */
export function getExplorationProgress(discoveredLocations) {
  const totalLocations = 8; // Total discoverable locations in the path
  return Math.min(100, Math.round((discoveredLocations.length / totalLocations) * 100));
}

export default BARBARIAN_TRAVELLER_MISSIONS;
