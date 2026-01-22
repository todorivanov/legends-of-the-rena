/**
 * Roman Legionnaire Story Path Missions
 * 15 missions following the rise from recruit to General
 *
 * Path Mechanics:
 * - Rank Progression: Legionnaire → Optio → Centurion → Primus Pilus → Prefect → General
 * - Territory Control: Conquer regions for Rome
 * - Legion Loyalty: Manage soldiers' morale and effectiveness
 * - Political Influence: Navigate Roman Senate politics
 */

export const ROMAN_LEGIONNAIRE_MISSIONS = {
  // ========== ACT 1: NOVICE LEGIONNAIRE (Missions 1-5) ==========

  legion_01_oath_of_service: {
    id: 'legion_01_oath_of_service',
    pathId: 'roman_legionnaire',
    name: 'Oath of Service',
    description: 'Take the sacred oath and prove yourself in your first skirmish.',
    difficulty: 1,
    type: 'standard',
    act: 1,
    currentRank: 'legionnaire',

    dialogue: {
      before: '"You are now a soldier of Rome. Defend her honor with your life!"',
      after: '"Well fought, soldier. You have earned your place in the legion."',
      centurionComment: '"Keep this up and you\'ll rise through the ranks quickly."',
    },

    enemy: {
      name: 'Barbarian Raider',
      class: 'AGILE',
      health: 180,
      strength: 9,
      level: 1,
    },

    objectives: [
      { id: 'win', description: 'Defeat the barbarian raider', type: 'win', required: true },
      {
        id: 'defend',
        description: 'Use defend action 2 times',
        type: 'defend_used',
        value: 2,
        star: true,
      },
      {
        id: 'health',
        description: 'Finish with 70% HP',
        type: 'health_percent',
        value: 70,
        star: true,
      },
    ],

    rewards: {
      gold: 30,
      xp: 120,
      equipment: ['iron_sword'],
    },

    unlocks: ['legion_02_border_patrol'],

    pathMechanicEffects: {
      rank: 'legionnaire',
      territories: 1,
      legionMorale: 10,
    },
  },

  legion_02_border_patrol: {
    id: 'legion_02_border_patrol',
    pathId: 'roman_legionnaire',
    name: 'Border Patrol',
    description: 'Defend Roman borders from a group of invaders.',
    difficulty: 2,
    type: 'survival',
    act: 1,
    currentRank: 'legionnaire',

    dialogue: {
      before: '"Multiple enemies approach the border. Hold the line, legionnaire!"',
      after: '"The border is secure. Rome is proud of you, soldier."',
    },

    waves: [
      { name: 'Scout', class: 'AGILE', health: 150, strength: 8, level: 1 },
      { name: 'Warrior', class: 'BALANCED', health: 220, strength: 11, level: 2 },
      { name: 'Berserker', class: 'BRAWLER', health: 250, strength: 13, level: 2 },
    ],

    objectives: [
      { id: 'win', description: 'Defend against all invaders', type: 'win', required: true },
      {
        id: 'efficient',
        description: 'Complete within 12 rounds',
        type: 'rounds',
        value: 12,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 400+ total damage',
        type: 'damage_dealt',
        value: 400,
        star: true,
      },
    ],

    rewards: {
      gold: 60,
      xp: 200,
      equipment: ['leather_vest'],
    },

    unlocks: ['legion_03_first_campaign'],

    pathMechanicEffects: {
      territories: 2,
      legionMorale: 15,
      reputation: 'Reliable Soldier',
    },
  },

  legion_03_first_campaign: {
    id: 'legion_03_first_campaign',
    pathId: 'roman_legionnaire',
    name: 'First Campaign',
    description: 'Join your first major military campaign into enemy territory.',
    difficulty: 3,
    type: 'standard',
    act: 1,
    currentRank: 'legionnaire',

    dialogue: {
      before: '"This is your first real battle, soldier. Show no mercy!"',
      after: '"Victory! The enemy territory is now under Roman control."',
      commanderPraise: '"You fought with honor. I\'m recommending you for promotion."',
    },

    enemy: {
      name: 'Enemy Captain',
      class: 'WARRIOR',
      health: 300,
      strength: 15,
      level: 3,
    },

    objectives: [
      { id: 'win', description: 'Defeat the enemy captain', type: 'win', required: true },
      { id: 'combo', description: 'Build a 3-hit combo', type: 'combo', value: 3, star: true },
      { id: 'crits', description: 'Land 2 critical hits', type: 'crits', value: 2, star: true },
    ],

    rewards: {
      gold: 100,
      xp: 300,
      equipment: ['chainmail'],
    },

    unlocks: ['legion_04_siege_warfare'],

    pathMechanicEffects: {
      territories: 3,
      legionMorale: 20,
      reputation: 'Proven Warrior',
    },
  },

  legion_04_siege_warfare: {
    id: 'legion_04_siege_warfare',
    pathId: 'roman_legionnaire',
    name: 'Siege Warfare',
    description: 'Participate in the siege of an enemy fortress.',
    difficulty: 4,
    type: 'boss',
    act: 1,
    currentRank: 'legionnaire',

    dialogue: {
      before: '"The fortress walls are breached! Storm the keep and slay their commander!"',
      after: '"The fortress is ours! This is a great victory for Rome!"',
      promotionNotice: '"Legionnaire, you are hereby promoted to Optio!"',
    },

    enemy: {
      name: 'Fortress Commander',
      class: 'TANK',
      health: 450,
      strength: 18,
      level: 4,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the fortress commander', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Win with 45% HP remaining',
        type: 'health_percent',
        value: 45,
        star: true,
      },
      { id: 'fast', description: 'Win within 10 rounds', type: 'rounds', value: 10, star: true },
    ],

    rewards: {
      gold: 150,
      xp: 450,
      equipment: ['steel_axe', 'iron_helmet'],
    },

    unlocks: ['legion_05_optio_duties'],

    pathMechanicEffects: {
      rank: 'optio', // PROMOTED!
      territories: 4,
      legionMorale: 30,
      promotion: true,
    },
  },

  legion_05_optio_duties: {
    id: 'legion_05_optio_duties',
    pathId: 'roman_legionnaire',
    name: 'Optio Duties',
    description: 'As Optio, lead a squad against enemy reinforcements.',
    difficulty: 5,
    type: 'standard',
    act: 1,
    currentRank: 'optio',

    dialogue: {
      before: '"Optio, enemy reinforcements approach. Lead your men to victory!"',
      after: '"Excellent leadership, Optio. Your men follow you with pride."',
    },

    enemy: {
      name: 'Elite Guard',
      class: 'PALADIN',
      health: 400,
      strength: 20,
      level: 5,
    },

    objectives: [
      { id: 'win', description: 'Defeat the elite guard', type: 'win', required: true },
      { id: 'no_items', description: 'Win without items', type: 'no_items', star: true },
      { id: 'skills', description: 'Use 4 skills', type: 'skills_used', value: 4, star: true },
    ],

    rewards: {
      gold: 180,
      xp: 550,
    },

    unlocks: ['legion_06_mountain_pass'],

    pathMechanicEffects: {
      territories: 5,
      legionMorale: 35,
      commandRespect: 'Growing',
    },
  },

  // ========== ACT 2: RISE TO CENTURION (Missions 6-10) ==========

  legion_06_mountain_pass: {
    id: 'legion_06_mountain_pass',
    pathId: 'roman_legionnaire',
    name: 'Mountain Pass',
    description: 'Secure a strategic mountain pass against fierce resistance.',
    difficulty: 6,
    type: 'survival',
    act: 2,
    currentRank: 'optio',

    dialogue: {
      before: '"This pass is vital for our supply lines. Hold it at all costs!"',
      after: '"The pass is secured. Your tactical brilliance shines through, Optio."',
    },

    waves: [
      { name: 'Mountain Defender', class: 'TANK', health: 380, strength: 19, level: 6 },
      { name: 'Archer Captain', class: 'AGILE', health: 320, strength: 22, level: 6 },
      { name: 'Highland Chief', class: 'BERSERKER', health: 450, strength: 24, level: 7 },
    ],

    objectives: [
      { id: 'win', description: 'Secure the mountain pass', type: 'win', required: true },
      {
        id: 'health',
        description: 'Finish with 55% HP',
        type: 'health_percent',
        value: 55,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 700+ total damage',
        type: 'damage_dealt',
        value: 700,
        star: true,
      },
    ],

    rewards: {
      gold: 220,
      xp: 700,
      equipment: ['flame_blade'],
    },

    unlocks: ['legion_07_naval_assault'],

    pathMechanicEffects: {
      territories: 6,
      legionMorale: 45,
      strategicValue: 'High',
    },
  },

  legion_07_naval_assault: {
    id: 'legion_07_naval_assault',
    pathId: 'roman_legionnaire',
    name: 'Naval Assault',
    description: 'Lead a daring naval assault on an enemy port city.',
    difficulty: 7,
    type: 'boss',
    act: 2,
    currentRank: 'optio',

    dialogue: {
      before: '"The fleet is ready, Optio. Take the port and control the sea!"',
      after: '"The port is ours! You have proven yourself a true tactician."',
      senateNotice: '"The Senate has taken notice of your victories, Optio."',
    },

    enemy: {
      name: 'Admiral Thalassos',
      class: 'HYBRID',
      health: 550,
      strength: 26,
      level: 8,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat Admiral Thalassos', type: 'win', required: true },
      { id: 'combo', description: 'Build a 5-hit combo', type: 'combo', value: 5, star: true },
      { id: 'crits', description: 'Land 4 critical hits', type: 'crits', value: 4, star: true },
    ],

    rewards: {
      gold: 300,
      xp: 900,
      equipment: ['steel_plate', 'mystic_robes'],
    },

    unlocks: ['legion_08_centurion_trials'],

    pathMechanicEffects: {
      territories: 7,
      legionMorale: 55,
      navyControl: true,
    },
  },

  legion_08_centurion_trials: {
    id: 'legion_08_centurion_trials',
    pathId: 'roman_legionnaire',
    name: 'Centurion Trials',
    description: 'Face the trials to prove yourself worthy of the centurion rank.',
    difficulty: 8,
    type: 'standard',
    act: 2,
    currentRank: 'optio',

    dialogue: {
      before: '"These trials will test your strength, wisdom, and loyalty to Rome."',
      after: '"You have passed! Hail Centurion!"',
      promotion: '"From this day forward, you command a century of Rome\'s finest!"',
    },

    enemy: {
      name: 'Trial Master',
      class: 'BALANCED',
      health: 500,
      strength: 28,
      level: 9,
    },

    objectives: [
      { id: 'win', description: 'Complete the centurion trials', type: 'win', required: true },
      {
        id: 'perfect',
        description: 'Take less than 80 damage',
        type: 'damage_taken',
        value: 80,
        star: true,
      },
      { id: 'fast', description: 'Win within 8 rounds', type: 'rounds', value: 8, star: true },
    ],

    rewards: {
      gold: 400,
      xp: 1100,
      equipment: ['dragons_fang'],
    },

    unlocks: ['legion_09_legion_command'],

    pathMechanicEffects: {
      rank: 'centurion', // PROMOTED!
      territories: 8,
      legionMorale: 65,
      commandAuthority: 'Century',
    },
  },

  legion_09_legion_command: {
    id: 'legion_09_legion_command',
    pathId: 'roman_legionnaire',
    name: 'Legion Command',
    description: 'Lead your century in a major battle against overwhelming odds.',
    difficulty: 9,
    type: 'survival',
    act: 2,
    currentRank: 'centurion',

    dialogue: {
      before: '"Centurion, the enemy outnumbers us three to one. Show them Roman discipline!"',
      after: '"Against all odds, you prevailed! Rome salutes you, Centurion!"',
    },

    waves: [
      { name: 'Vanguard Leader', class: 'WARRIOR', health: 450, strength: 26, level: 9 },
      { name: 'War Priest', class: 'NECROMANCER', health: 400, strength: 30, level: 9 },
      { name: 'Warlord', class: 'BERSERKER', health: 600, strength: 32, level: 10 },
    ],

    objectives: [
      { id: 'win', description: 'Lead your century to victory', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
        star: true,
      },
      {
        id: 'efficient',
        description: 'Complete within 18 rounds',
        type: 'rounds',
        value: 18,
        star: true,
      },
    ],

    rewards: {
      gold: 500,
      xp: 1300,
      equipment: ['titans_guard', 'thunderstrike'],
    },

    unlocks: ['legion_10_senate_politics'],

    pathMechanicEffects: {
      territories: 9,
      legionMorale: 80,
      reputation: 'Hero of Rome',
    },
  },

  legion_10_senate_politics: {
    id: 'legion_10_senate_politics',
    pathId: 'roman_legionnaire',
    name: 'Senate Politics',
    description: 'Navigate political intrigue while defending against an assassination attempt.',
    difficulty: 10,
    type: 'boss',
    act: 2,
    currentRank: 'centurion',

    dialogue: {
      before: '"You have enemies in the Senate, Centurion. They send an assassin."',
      after: '"The assassin is defeated, but the political game has just begun."',
      senateFavor: '"Some senators see you as a threat. Others... as an opportunity."',
    },

    enemy: {
      name: 'Shadow Blade',
      class: 'ASSASSIN',
      health: 550,
      strength: 35,
      level: 11,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Survive the assassination attempt', type: 'win', required: true },
      { id: 'crits', description: 'Land 6 critical hits', type: 'crits', value: 6, star: true },
      { id: 'combo', description: 'Build a 6-hit combo', type: 'combo', value: 6, star: true },
    ],

    rewards: {
      gold: 600,
      xp: 1500,
      equipment: ['arcane_staff'],
    },

    unlocks: ['legion_11_primus_pilus'],

    pathMechanicEffects: {
      territories: 10,
      politicalPower: 'Growing',
      senateFaction: 'Divided',
    },
  },

  // ========== ACT 3: PATH TO GENERAL (Missions 11-15) ==========

  legion_11_primus_pilus: {
    id: 'legion_11_primus_pilus',
    pathId: 'roman_legionnaire',
    name: 'Primus Pilus',
    description: 'Prove yourself worthy of the highest centurion rank: Primus Pilus.',
    difficulty: 11,
    type: 'standard',
    act: 3,
    currentRank: 'centurion',

    dialogue: {
      before: '"Only the greatest warriors become Primus Pilus. Show us your worth!"',
      after: '"Hail Primus Pilus! You now lead the first cohort!"',
      honor: '"The legion\'s finest soldiers answer to you now."',
    },

    enemy: {
      name: 'Champion of Mars',
      class: 'PALADIN',
      health: 650,
      strength: 38,
      level: 12,
    },

    objectives: [
      { id: 'win', description: 'Defeat the Champion of Mars', type: 'win', required: true },
      {
        id: 'damage',
        description: 'Deal 1000+ total damage',
        type: 'damage_dealt',
        value: 1000,
        star: true,
      },
      {
        id: 'perfect',
        description: 'Take less than 100 damage',
        type: 'damage_taken',
        value: 100,
        star: true,
      },
    ],

    rewards: {
      gold: 800,
      xp: 1800,
      equipment: ['phoenix_armor'],
    },

    unlocks: ['legion_12_border_war'],

    pathMechanicEffects: {
      rank: 'primus_pilus', // PROMOTED!
      territories: 11,
      legionMorale: 90,
      commandAuthority: 'First Cohort',
    },
  },

  legion_12_border_war: {
    id: 'legion_12_border_war',
    pathId: 'roman_legionnaire',
    name: 'Border War',
    description: 'Lead the legion in a massive border war against an invading empire.',
    difficulty: 12,
    type: 'boss',
    act: 3,
    currentRank: 'primus_pilus',

    dialogue: {
      before: '"Primus Pilus, an entire enemy army approaches. Rally the legion!"',
      after: '"Victory! The enemy empire has been repelled! Rome is saved!"',
      generalNotice: '"The Senate wishes to speak with you about... higher command."',
    },

    enemy: {
      name: 'Enemy General Korgath',
      class: 'HYBRID',
      health: 800,
      strength: 42,
      level: 13,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat General Korgath', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Win with 35% HP remaining',
        type: 'health_percent',
        value: 35,
        star: true,
      },
      {
        id: 'legendary',
        description: 'Complete within 15 rounds',
        type: 'rounds',
        value: 15,
        star: true,
      },
    ],

    rewards: {
      gold: 1000,
      xp: 2000,
      equipment: ['void_pendant', 'ring_of_fury'],
    },

    unlocks: ['legion_13_prefect_appointment'],

    pathMechanicEffects: {
      territories: 12,
      legionMorale: 95,
      reputation: 'Savior of Rome',
    },
  },

  legion_13_prefect_appointment: {
    id: 'legion_13_prefect_appointment',
    pathId: 'roman_legionnaire',
    name: 'Prefect Appointment',
    description: 'Accept the rank of Prefect and command multiple legions.',
    difficulty: 11,
    type: 'standard',
    act: 3,
    currentRank: 'primus_pilus',

    dialogue: {
      before: '"Prefect, your first task is to quell a rebellion in the eastern provinces."',
      after: '"The rebellion is crushed. Your authority is absolute."',
      senateDecree: '"The Senate has great plans for you, Prefect..."',
    },

    enemy: {
      name: 'Rebel Commander',
      class: 'WARRIOR',
      health: 700,
      strength: 40,
      level: 13,
    },

    objectives: [
      { id: 'win', description: 'Quell the rebellion', type: 'win', required: true },
      { id: 'fast', description: 'Win within 12 rounds', type: 'rounds', value: 12, star: true },
      { id: 'skills', description: 'Use 6 skills', type: 'skills_used', value: 6, star: true },
    ],

    rewards: {
      gold: 1200,
      xp: 2200,
    },

    unlocks: ['legion_14_civil_war'],

    pathMechanicEffects: {
      rank: 'prefect', // PROMOTED!
      territories: 13,
      legionMorale: 98,
      commandAuthority: 'Multiple Legions',
    },
  },

  legion_14_civil_war: {
    id: 'legion_14_civil_war',
    pathId: 'roman_legionnaire',
    name: 'Civil War',
    description: 'Rome is divided! Choose a side and fight for the future of the empire.',
    difficulty: 13,
    type: 'boss',
    act: 3,
    currentRank: 'prefect',

    dialogue: {
      before: '"Civil war has come. Choose wisely, Prefect. The fate of Rome hangs in balance."',
      after: '"Your side has won! But at what cost to Rome?"',
      aftermath: '"The Senate is reformed. They name you... General."',
    },

    enemy: {
      name: 'Rival Prefect',
      class: 'BALANCED',
      health: 850,
      strength: 45,
      level: 14,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Win the civil war', type: 'win', required: true },
      {
        id: 'perfect',
        description: 'Win with 30% HP remaining',
        type: 'health_percent',
        value: 30,
        star: true,
      },
      { id: 'crits', description: 'Land 8 critical hits', type: 'crits', value: 8, star: true },
    ],

    rewards: {
      gold: 1500,
      xp: 2500,
      equipment: ['excalibur', 'aegis_of_legends'],
    },

    unlocks: ['legion_15_general_of_rome'],

    pathMechanicEffects: {
      rank: 'general', // FINAL PROMOTION!
      territories: 14,
      legionMorale: 100,
      politicalPower: 'Supreme',
    },
  },

  legion_15_general_of_rome: {
    id: 'legion_15_general_of_rome',
    pathId: 'roman_legionnaire',
    name: 'General of Rome',
    description: 'As General, lead Rome against its greatest enemy in the final battle.',
    difficulty: 15,
    type: 'boss',
    act: 3,
    currentRank: 'general',

    dialogue: {
      before: '"General, the final enemy stands before us. For Rome! For Glory! For Victory!"',
      after: '"VICTORY! Rome is supreme! Your name will echo through the ages!"',
      epilogue: '"You are the greatest General Rome has ever known. Your legend is eternal."',
    },

    enemy: {
      name: 'Emperor Tyrannus',
      class: 'NECROMANCER',
      health: 1000,
      strength: 50,
      level: 15,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat Emperor Tyrannus', type: 'win', required: true },
      {
        id: 'legendary',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
        star: true,
      },
      {
        id: 'ultimate',
        description: 'Deal 1500+ total damage',
        type: 'damage_dealt',
        value: 1500,
        star: true,
      },
    ],

    rewards: {
      gold: 3000,
      xp: 3000,
      equipment: ['crown_of_champions'],
    },

    unlocks: ['path_complete'],

    pathMechanicEffects: {
      pathComplete: true,
      territories: 15,
      legionMorale: 100,
      reputation: 'Legend of Rome',
      legacy: 'Eternal',
    },
  },
};

/**
 * Get mission by ID
 */
export function getLegionMissionById(id) {
  return ROMAN_LEGIONNAIRE_MISSIONS[id] || null;
}

/**
 * Get all missions for this path
 */
export function getAllLegionMissions() {
  return Object.values(ROMAN_LEGIONNAIRE_MISSIONS);
}

/**
 * Get missions by act
 */
export function getLegionMissionsByAct(act) {
  return Object.values(ROMAN_LEGIONNAIRE_MISSIONS).filter((m) => m.act === act);
}

/**
 * Get missions by rank
 */
export function getLegionMissionsByRank(rank) {
  return Object.values(ROMAN_LEGIONNAIRE_MISSIONS).filter((m) => m.currentRank === rank);
}

/**
 * Get missions available based on current rank and territories
 */
export function getAvailableLegionMissions(currentRank, territories) {
  const rankOrder = ['legionnaire', 'optio', 'centurion', 'primus_pilus', 'prefect', 'general'];
  const playerRankIndex = rankOrder.indexOf(currentRank);

  return Object.values(ROMAN_LEGIONNAIRE_MISSIONS).filter((m) => {
    const missionRankIndex = rankOrder.indexOf(m.currentRank);
    return missionRankIndex <= playerRankIndex;
  });
}

/**
 * Get next mission in progression
 */
export function getNextLegionMission(currentMissionId) {
  const current = ROMAN_LEGIONNAIRE_MISSIONS[currentMissionId];
  if (!current || !current.unlocks || current.unlocks.length === 0) return null;

  return ROMAN_LEGIONNAIRE_MISSIONS[current.unlocks[0]] || null;
}

/**
 * Check if mission is unlocked
 */
export function isLegionMissionUnlocked(missionId, completedMissions, currentRank) {
  const mission = ROMAN_LEGIONNAIRE_MISSIONS[missionId];
  if (!mission) return false;

  // Check rank requirement
  const rankOrder = ['legionnaire', 'optio', 'centurion', 'primus_pilus', 'prefect', 'general'];
  const playerRankIndex = rankOrder.indexOf(currentRank);
  const missionRankIndex = rankOrder.indexOf(mission.currentRank);
  if (missionRankIndex > playerRankIndex) return false;

  // First mission is always available
  if (missionId === 'legion_01_oath_of_service') return true;

  // Check if prerequisite mission is completed
  const allMissions = Object.values(ROMAN_LEGIONNAIRE_MISSIONS);
  const prerequisiteMission = allMissions.find((m) => m.unlocks && m.unlocks.includes(missionId));

  if (!prerequisiteMission) return false;

  return completedMissions[prerequisiteMission.id] !== undefined;
}

/**
 * Get rank progression percentage
 */
export function getRankProgression(currentRank) {
  const rankOrder = ['legionnaire', 'optio', 'centurion', 'primus_pilus', 'prefect', 'general'];
  const index = rankOrder.indexOf(currentRank);
  return ((index + 1) / rankOrder.length) * 100;
}

export default ROMAN_LEGIONNAIRE_MISSIONS;
