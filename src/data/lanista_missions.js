/**
 * Lanista (Gladiator School Owner) Story Path Missions
 * 14 missions building a gladiatorial empire from single fighter to legendary ludus
 *
 * Path Mechanics:
 * - Gladiator Roster: Recruit and manage fighters
 * - Reputation: Build fame across the empire
 * - Ludus Economy: Manage profits and investments
 * - Political Connections: Curry favor with wealthy patrons
 */

export const LANISTA_MISSIONS = {
  // ========== ACT 1: HUMBLE BEGINNINGS (Missions 1-5) ==========

  lanista_01_first_acquisition: {
    id: 'lanista_01_first_acquisition',
    pathId: 'lanista',
    name: 'First Acquisition',
    description: 'Purchase your first gladiator and prove they can win.',
    difficulty: 1,
    type: 'standard',
    act: 1,
    gladiatorRoster: 1,

    dialogue: {
      before: '"You\'ve bought your first slave. Now make him earn his keep in the arena."',
      after: '"Victory! Your investment has paid off. But this is just the beginning."',
      merchantComment:
        '"Not bad for a first-timer. Keep winning and you\'ll attract better stock."',
    },

    enemy: {
      name: 'Untrained Fighter',
      class: 'BALANCED',
      health: 160,
      strength: 8,
      level: 1,
    },

    objectives: [
      { id: 'win', description: 'Win your first match as lanista', type: 'win', required: true },
      { id: 'efficient', description: 'Win within 6 rounds', type: 'rounds', value: 6, star: true },
      {
        id: 'health',
        description: 'Finish with 70% HP',
        type: 'health_percent',
        value: 70,
        star: true,
      },
    ],

    rewards: {
      gold: 40,
      xp: 100,
    },

    unlocks: ['lanista_02_training_regimen'],

    pathMechanicEffects: {
      gladiatorRoster: 1,
      reputation: 5,
      ludusProfit: 40,
    },
  },

  lanista_02_training_regimen: {
    id: 'lanista_02_training_regimen',
    pathId: 'lanista',
    name: 'Training Regimen',
    description: 'Invest in proper training equipment and test your fighter.',
    difficulty: 2,
    type: 'standard',
    act: 1,
    gladiatorRoster: 1,

    dialogue: {
      before: '"Your fighter is improving. Let\'s see if the training was worth the cost."',
      after: '"Excellent! Proper training makes all the difference."',
      trainerComment: '"With more coin, I can make champions out of any slave."',
    },

    enemy: {
      name: 'Trained Warrior',
      class: 'WARRIOR',
      health: 220,
      strength: 11,
      level: 2,
    },

    objectives: [
      { id: 'win', description: 'Defeat the trained warrior', type: 'win', required: true },
      { id: 'combo', description: 'Build a 2-hit combo', type: 'combo', value: 2, star: true },
      { id: 'no_items', description: 'Win without items', type: 'no_items', star: true },
    ],

    rewards: {
      gold: 70,
      xp: 150,
      equipment: ['leather_vest'],
    },

    unlocks: ['lanista_03_crowd_favorite'],

    pathMechanicEffects: {
      gladiatorRoster: 1,
      reputation: 10,
      ludusProfit: 70,
      trainingQuality: 'Basic',
    },
  },

  lanista_03_crowd_favorite: {
    id: 'lanista_03_crowd_favorite',
    pathId: 'lanista',
    name: 'Crowd Favorite',
    description: "Win over the crowd to increase your fighter's value.",
    difficulty: 3,
    type: 'standard',
    act: 1,
    gladiatorRoster: 1,

    dialogue: {
      before: '"Make them love your fighter! Showmanship sells tickets!"',
      after: '"The crowd adores them! Your fighter\'s value has tripled!"',
      patronInterest: '"A wealthy patron has taken notice of your ludus..."',
    },

    enemy: {
      name: 'Showman Gladiator',
      class: 'AGILE',
      health: 260,
      strength: 14,
      level: 3,
    },

    objectives: [
      { id: 'win', description: 'Win with style', type: 'win', required: true },
      { id: 'crits', description: 'Land 3 critical hits', type: 'crits', value: 3, star: true },
      { id: 'fast', description: 'Win within 7 rounds', type: 'rounds', value: 7, star: true },
    ],

    rewards: {
      gold: 120,
      xp: 220,
      equipment: ['iron_sword'],
    },

    unlocks: ['lanista_04_second_recruit'],

    pathMechanicEffects: {
      gladiatorRoster: 1,
      reputation: 20,
      ludusProfit: 190,
      crowdFavor: 'Growing',
    },
  },

  lanista_04_second_recruit: {
    id: 'lanista_04_second_recruit',
    pathId: 'lanista',
    name: 'Second Recruit',
    description:
      'Your profits allow you to purchase a second gladiator. Prove your stable is growing.',
    difficulty: 4,
    type: 'survival',
    act: 1,
    gladiatorRoster: 2,

    dialogue: {
      before: '"Two fighters mean double the profit! Win both matches today!"',
      after: '"Both victories! Your ludus is becoming a force to be reckoned with!"',
    },

    waves: [
      { name: 'Rival Fighter 1', class: 'BRAWLER', health: 280, strength: 15, level: 3 },
      { name: 'Rival Fighter 2', class: 'BALANCED', health: 300, strength: 16, level: 4 },
    ],

    objectives: [
      { id: 'win', description: 'Win both matches', type: 'win', required: true },
      {
        id: 'health',
        description: 'Finish with 60% HP',
        type: 'health_percent',
        value: 60,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 500+ total damage',
        type: 'damage_dealt',
        value: 500,
        star: true,
      },
    ],

    rewards: {
      gold: 180,
      xp: 320,
      equipment: ['chainmail', 'steel_axe'],
    },

    unlocks: ['lanista_05_wealthy_patron'],

    pathMechanicEffects: {
      gladiatorRoster: 2,
      reputation: 30,
      ludusProfit: 370,
    },
  },

  lanista_05_wealthy_patron: {
    id: 'lanista_05_wealthy_patron',
    pathId: 'lanista',
    name: 'Wealthy Patron',
    description:
      'A wealthy senator sponsors a special event. Win to secure their continued patronage.',
    difficulty: 5,
    type: 'boss',
    act: 1,
    gladiatorRoster: 2,

    dialogue: {
      before: '"The senator expects victory. Disappoint them and lose their support!"',
      after: '"Magnificent! The senator is pleased. Their gold will flow freely!"',
      sponsorship: '"With this patronage, you can expand your ludus significantly."',
    },

    enemy: {
      name: 'Sponsored Champion',
      class: 'TANK',
      health: 420,
      strength: 19,
      level: 5,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the sponsored champion', type: 'win', required: true },
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
      gold: 300,
      xp: 450,
      equipment: ['flame_blade'],
    },

    unlocks: ['lanista_06_expanding_empire'],

    pathMechanicEffects: {
      gladiatorRoster: 2,
      reputation: 45,
      ludusProfit: 670,
      patronage: 'Senator Marcus',
    },
  },

  // ========== ACT 2: BUILDING EMPIRE (Missions 6-10) ==========

  lanista_06_expanding_empire: {
    id: 'lanista_06_expanding_empire',
    pathId: 'lanista',
    name: 'Expanding Empire',
    description: 'Purchase your third and fourth gladiators. Build your roster.',
    difficulty: 6,
    type: 'standard',
    act: 2,
    gladiatorRoster: 4,

    dialogue: {
      before: '"Four fighters! Your ludus is becoming a proper school!"',
      after: '"Victory! People speak of your ludus across the city!"',
    },

    enemy: {
      name: "Rival Lanista's Champion",
      class: 'ASSASSIN',
      health: 380,
      strength: 22,
      level: 6,
    },

    objectives: [
      { id: 'win', description: "Defeat rival's champion", type: 'win', required: true },
      { id: 'crits', description: 'Land 4 critical hits', type: 'crits', value: 4, star: true },
      { id: 'skills', description: 'Use 5 skills', type: 'skills_used', value: 5, star: true },
    ],

    rewards: {
      gold: 350,
      xp: 600,
    },

    unlocks: ['lanista_07_grand_tournament'],

    pathMechanicEffects: {
      gladiatorRoster: 4,
      reputation: 60,
      ludusProfit: 1020,
    },
  },

  lanista_07_grand_tournament: {
    id: 'lanista_07_grand_tournament',
    pathId: 'lanista',
    name: 'Grand Tournament',
    description: "Enter the city's grand tournament. Multiple victories await.",
    difficulty: 7,
    type: 'survival',
    act: 2,
    gladiatorRoster: 4,

    dialogue: {
      before: '"The grand tournament! Win this and your fame will spread throughout the empire!"',
      after: '"Champion of the tournament! Your ludus is now legendary!"',
    },

    waves: [
      { name: 'Tournament Fighter 1', class: 'WARRIOR', health: 400, strength: 23, level: 7 },
      { name: 'Tournament Fighter 2', class: 'MAGE', health: 350, strength: 26, level: 7 },
      { name: 'Tournament Champion', class: 'PALADIN', health: 500, strength: 28, level: 8 },
    ],

    objectives: [
      { id: 'win', description: 'Win the grand tournament', type: 'win', required: true },
      {
        id: 'efficient',
        description: 'Complete within 18 rounds',
        type: 'rounds',
        value: 18,
        star: true,
      },
      {
        id: 'damage',
        description: 'Deal 900+ total damage',
        type: 'damage_dealt',
        value: 900,
        star: true,
      },
    ],

    rewards: {
      gold: 600,
      xp: 850,
      equipment: ['steel_plate', 'mystic_robes'],
    },

    unlocks: ['lanista_08_imperial_invitation'],

    pathMechanicEffects: {
      gladiatorRoster: 4,
      reputation: 80,
      ludusProfit: 1620,
      fame: 'Empire-wide',
    },
  },

  lanista_08_imperial_invitation: {
    id: 'lanista_08_imperial_invitation',
    pathId: 'lanista',
    name: 'Imperial Invitation',
    description: 'The Emperor himself invites your champion to fight in the Colosseum!',
    difficulty: 8,
    type: 'boss',
    act: 2,
    gladiatorRoster: 4,

    dialogue: {
      before: '"The Emperor watches! This is the greatest honor a lanista can receive!"',
      after: '"Victory before the Emperor! Your name is made!"',
      emperorsFavor: '"The Emperor himself congratulates you. This changes everything."',
    },

    enemy: {
      name: 'Imperial Guard Champion',
      class: 'HYBRID',
      health: 600,
      strength: 32,
      level: 9,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Win before the Emperor', type: 'win', required: true },
      {
        id: 'perfect',
        description: 'Take less than 100 damage',
        type: 'damage_taken',
        value: 100,
        star: true,
      },
      { id: 'combo', description: 'Build a 5-hit combo', type: 'combo', value: 5, star: true },
    ],

    rewards: {
      gold: 1000,
      xp: 1200,
      equipment: ['dragons_fang', 'titans_guard'],
    },

    unlocks: ['lanista_09_rival_school'],

    pathMechanicEffects: {
      gladiatorRoster: 4,
      reputation: 95,
      ludusProfit: 2620,
      imperialFavor: true,
    },
  },

  lanista_09_rival_school: {
    id: 'lanista_09_rival_school',
    pathId: 'lanista',
    name: 'Rival School',
    description: 'A rival lanista challenges your ludus. Defend your reputation!',
    difficulty: 9,
    type: 'standard',
    act: 2,
    gladiatorRoster: 5,

    dialogue: {
      before: '"They mock your fighters! Show them the strength of your training!"',
      after: '"Crushed! Your rival\'s reputation is in tatters!"',
      acquisition: '"Several of your rival\'s best fighters have asked to join your ludus..."',
    },

    enemy: {
      name: "Rival Lanista's Best",
      class: 'BERSERKER',
      health: 550,
      strength: 35,
      level: 10,
    },

    objectives: [
      { id: 'win', description: "Defeat your rival's champion", type: 'win', required: true },
      { id: 'crits', description: 'Land 6 critical hits', type: 'crits', value: 6, star: true },
      { id: 'fast', description: 'Win within 10 rounds', type: 'rounds', value: 10, star: true },
    ],

    rewards: {
      gold: 800,
      xp: 1400,
    },

    unlocks: ['lanista_10_underworld_deal'],

    pathMechanicEffects: {
      gladiatorRoster: 5, // Acquired rival's fighters
      reputation: 100,
      ludusProfit: 3420,
      rivalDestroyed: true,
    },
  },

  lanista_10_underworld_deal: {
    id: 'lanista_10_underworld_deal',
    pathId: 'lanista',
    name: 'Underworld Deal',
    description: 'A shady offer promises great profit... but at what cost?',
    difficulty: 10,
    type: 'boss',
    act: 2,
    gladiatorRoster: 5,

    dialogue: {
      before: '"They want you to throw the fight. Refuse, and face their wrath."',
      after: '"You chose honor over gold. But you\'ve made dangerous enemies..."',
      warning: '"Watch your back, lanista. The underworld doesn\'t forget."',
    },

    enemy: {
      name: 'Underworld Enforcer',
      class: 'ASSASSIN',
      health: 600,
      strength: 38,
      level: 11,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the enforcer', type: 'win', required: true },
      {
        id: 'survive',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
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
      gold: 600, // Less than if you threw the fight
      xp: 1600,
      equipment: ['arcane_staff'],
    },

    unlocks: ['lanista_11_legendary_fighter'],

    pathMechanicEffects: {
      gladiatorRoster: 5,
      reputation: 100, // Honor maintained
      underworldEnemy: true,
    },
  },

  // ========== ACT 3: LEGENDARY STATUS (Missions 11-14) ==========

  lanista_11_legendary_fighter: {
    id: 'lanista_11_legendary_fighter',
    pathId: 'lanista',
    name: 'Legendary Fighter',
    description: 'Recruit a legendary warrior. They cost a fortune but could secure your legacy.',
    difficulty: 11,
    type: 'standard',
    act: 3,
    gladiatorRoster: 6,

    dialogue: {
      before: '"This fighter is legendary. Prove they were worth the investment!"',
      after: '"Incredible! With this fighter, your ludus is unstoppable!"',
    },

    enemy: {
      name: 'Former Champion',
      class: 'BALANCED',
      health: 700,
      strength: 42,
      level: 12,
    },

    objectives: [
      { id: 'win', description: 'Win with your legendary recruit', type: 'win', required: true },
      { id: 'combo', description: 'Build a 6-hit combo', type: 'combo', value: 6, star: true },
      { id: 'crits', description: 'Land 7 critical hits', type: 'crits', value: 7, star: true },
    ],

    rewards: {
      gold: 1200,
      xp: 1900,
      equipment: ['thunderstrike'],
    },

    unlocks: ['lanista_12_empire_tour'],

    pathMechanicEffects: {
      gladiatorRoster: 6,
      reputation: 100,
      ludusProfit: 4620,
      legendaryFighter: true,
    },
  },

  lanista_12_empire_tour: {
    id: 'lanista_12_empire_tour',
    pathId: 'lanista',
    name: 'Empire Tour',
    description: "Tour the empire's greatest arenas. Multiple legendary battles await.",
    difficulty: 12,
    type: 'survival',
    act: 3,
    gladiatorRoster: 6,

    dialogue: {
      before: '"Four arenas, four champions. Win them all and your legacy is secured!"',
      after: '"Undefeated across the empire! Your ludus is legendary!"',
    },

    waves: [
      { name: 'Champion of Athens', class: 'MAGE', health: 650, strength: 40, level: 12 },
      { name: 'Champion of Alexandria', class: 'PALADIN', health: 750, strength: 38, level: 12 },
      { name: 'Champion of Carthage', class: 'WARRIOR', health: 700, strength: 44, level: 13 },
      { name: 'Champion of Gaul', class: 'BERSERKER', health: 800, strength: 46, level: 13 },
    ],

    objectives: [
      { id: 'win', description: 'Conquer all four arenas', type: 'win', required: true },
      {
        id: 'health',
        description: 'Finish with 35% HP',
        type: 'health_percent',
        value: 35,
        star: true,
      },
      {
        id: 'efficient',
        description: 'Complete within 25 rounds',
        type: 'rounds',
        value: 25,
        star: true,
      },
    ],

    rewards: {
      gold: 2000,
      xp: 2300,
      equipment: ['phoenix_armor', 'void_pendant'],
    },

    unlocks: ['lanista_13_succession_crisis'],

    pathMechanicEffects: {
      gladiatorRoster: 6,
      reputation: 100,
      ludusProfit: 6620,
      fame: 'Universal',
    },
  },

  lanista_13_succession_crisis: {
    id: 'lanista_13_succession_crisis',
    pathId: 'lanista',
    name: 'Succession Crisis',
    description: 'You must choose an heir to your empire. But first, one final test.',
    difficulty: 13,
    type: 'boss',
    act: 3,
    gladiatorRoster: 6,

    dialogue: {
      before: '"Your greatest fighter must prove they can carry your legacy forward."',
      after: '"They have proven themselves worthy. Your empire will endure!"',
      legacy: '"Your ludus will outlive you. Your name will never be forgotten."',
    },

    enemy: {
      name: 'The Last Test',
      class: 'HYBRID',
      health: 850,
      strength: 48,
      level: 14,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Pass the final test', type: 'win', required: true },
      {
        id: 'perfect',
        description: 'Win with 30% HP remaining',
        type: 'health_percent',
        value: 30,
        star: true,
      },
      {
        id: 'legendary',
        description: 'Deal 1400+ total damage',
        type: 'damage_dealt',
        value: 1400,
        star: true,
      },
    ],

    rewards: {
      gold: 2500,
      xp: 2600,
      equipment: ['ring_of_fury', 'excalibur'],
    },

    unlocks: ['lanista_14_eternal_legacy'],

    pathMechanicEffects: {
      gladiatorRoster: 6,
      reputation: 100,
      succession: 'Secured',
    },
  },

  lanista_14_eternal_legacy: {
    id: 'lanista_14_eternal_legacy',
    pathId: 'lanista',
    name: 'Eternal Legacy',
    description: 'One final battle to cement your place among the greatest lanistas in history.',
    difficulty: 15,
    type: 'boss',
    act: 3,
    gladiatorRoster: 6,

    dialogue: {
      before: '"This is it. The final battle. Win, and your legend becomes eternal."',
      after:
        '"VICTORY! Your name will echo through eternity! The greatest lanista who ever lived!"',
      epilogue: '"Centuries from now, people will speak of your ludus with awe. You are immortal."',
    },

    enemy: {
      name: 'Champion of Ages',
      class: 'NECROMANCER',
      health: 1000,
      strength: 50,
      level: 15,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the Champion of Ages', type: 'win', required: true },
      {
        id: 'ultimate',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
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
      gold: 5000,
      xp: 3000,
      equipment: ['crown_of_champions', 'aegis_of_legends'],
    },

    unlocks: ['path_complete'],

    pathMechanicEffects: {
      pathComplete: true,
      gladiatorRoster: 6,
      reputation: 100,
      legacy: 'Eternal',
      empireStatus: 'Greatest Ludus in History',
    },
  },
};

/**
 * Get mission by ID
 */
export function getLanistaMissionById(id) {
  return LANISTA_MISSIONS[id] || null;
}

/**
 * Get all missions for this path
 */
export function getAllLanistaMissions() {
  return Object.values(LANISTA_MISSIONS);
}

/**
 * Get missions by act
 */
export function getLanistaMissionsByAct(act) {
  return Object.values(LANISTA_MISSIONS).filter((m) => m.act === act);
}

/**
 * Get missions available based on roster size and reputation
 */
export function getAvailableLanistaMissions(rosterSize, reputation) {
  return Object.values(LANISTA_MISSIONS).filter((m) =>
    m.gladiatorRoster <= rosterSize && m.reputation !== undefined
      ? reputation >= (m.reputation || 0)
      : true
  );
}

/**
 * Get next mission in progression
 */
export function getNextLanistaMission(currentMissionId) {
  const current = LANISTA_MISSIONS[currentMissionId];
  if (!current || !current.unlocks || current.unlocks.length === 0) return null;

  return LANISTA_MISSIONS[current.unlocks[0]] || null;
}

/**
 * Check if mission is unlocked
 */
export function isLanistaMissionUnlocked(missionId, completedMissions, rosterSize) {
  const mission = LANISTA_MISSIONS[missionId];
  if (!mission) return false;

  // Check roster requirement
  if (mission.gladiatorRoster > rosterSize) return false;

  // First mission is always available
  if (missionId === 'lanista_01_first_acquisition') return true;

  // Check if prerequisite mission is completed
  const allMissions = Object.values(LANISTA_MISSIONS);
  const prerequisiteMission = allMissions.find((m) => m.unlocks && m.unlocks.includes(missionId));

  if (!prerequisiteMission) return false;

  return completedMissions[prerequisiteMission.id] !== undefined;
}

/**
 * Calculate total ludus value
 */
export function calculateLudusValue(rosterSize, reputation, profit) {
  return rosterSize * 1000 + reputation * 50 + profit;
}

export default LANISTA_MISSIONS;
