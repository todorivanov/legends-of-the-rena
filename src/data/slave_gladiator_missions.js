/**
 * Slave Gladiator Story Path Missions
 * 12 missions following the journey from enslaved fighter to freedom
 *
 * Path Mechanics:
 * - Freedom Meter (0-100): Increases with victories and crowd favor
 * - Ludus (training school) interactions
 * - Master's favor system
 * - Crowd reputation
 */

export const SLAVE_GLADIATOR_MISSIONS = {
  // ========== ACT 1: CHAINS OF SERVITUDE (Missions 1-4) ==========

  slave_01_first_blood: {
    id: 'slave_01_first_blood',
    pathId: 'slave_gladiator',
    name: 'First Blood',
    description: 'Your first fight in the arena. Survive to see another day.',
    difficulty: 1,
    type: 'standard',
    act: 1,
    requiredFreedom: 0,

    dialogue: {
      before: '"Fresh meat! Let\'s see if you last more than ten seconds, slave!"',
      after: '"You... you survived. The master will be pleased. Back to your cell."',
      masterComment: '"Not bad for your first time. Perhaps you\'re worth the coin I paid."',
    },

    enemy: {
      name: 'Condemned Prisoner',
      class: 'BALANCED',
      health: 150,
      strength: 8,
      level: 1,
    },

    objectives: [
      { id: 'win', description: 'Survive your first arena fight', type: 'win', required: true },
      {
        id: 'no_damage',
        description: 'Take less than 30 damage',
        type: 'damage_taken',
        value: 30,
        star: true,
      },
      { id: 'fast', description: 'Win within 5 rounds', type: 'rounds', value: 5, star: true },
    ],

    rewards: {
      gold: 20,
      xp: 100,
      freedomMeter: 5,
    },

    unlocks: ['slave_02_training_grounds'],

    pathMechanicEffects: {
      freedomMeter: 5,
      crowdFavor: 10,
      masterMood: 'neutral',
    },
  },

  slave_02_training_grounds: {
    id: 'slave_02_training_grounds',
    pathId: 'slave_gladiator',
    name: 'Training Grounds',
    description: 'Prove your worth in the ludus training yard against fellow slaves.',
    difficulty: 2,
    type: 'standard',
    act: 1,
    requiredFreedom: 5,

    dialogue: {
      before: '"Your opponent is another slave like you. Only one of you will eat tonight."',
      after: '"Victory! But remember, we\'re all just property here."',
      masterComment: '"Good. You learn quickly. But don\'t get cocky."',
    },

    enemy: {
      name: 'Fellow Slave Marcus',
      class: 'WARRIOR',
      health: 200,
      strength: 10,
      level: 2,
    },

    objectives: [
      { id: 'win', description: 'Defeat Marcus in training', type: 'win', required: true },
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
      gold: 30,
      xp: 150,
      equipment: ['leather_vest'],
      freedomMeter: 8,
    },

    unlocks: ['slave_03_crowd_pleaser'],

    pathMechanicEffects: {
      freedomMeter: 8,
      crowdFavor: 0, // Training, no crowd
      masterMood: 'pleased',
    },
  },

  slave_03_crowd_pleaser: {
    id: 'slave_03_crowd_pleaser',
    pathId: 'slave_gladiator',
    name: 'Crowd Pleaser',
    description: "Win the crowd's favor in a public exhibition match.",
    difficulty: 3,
    type: 'standard',
    act: 1,
    requiredFreedom: 13,

    dialogue: {
      before: '"The crowd is watching. Give them a show and you\'ll be rewarded!"',
      after: '"The crowd loves you! Listen to them chant your name!"',
      crowdReaction: '"MORE! MORE! MORE!"',
    },

    enemy: {
      name: 'Armored Veteran',
      class: 'TANK',
      health: 280,
      strength: 12,
      level: 3,
    },

    objectives: [
      { id: 'win', description: 'Defeat the veteran gladiator', type: 'win', required: true },
      { id: 'crits', description: 'Land 3 critical hits', type: 'crits', value: 3, star: true },
      { id: 'no_defend', description: 'Win without defending', type: 'no_defend', star: true },
    ],

    rewards: {
      gold: 50,
      xp: 200,
      equipment: ['iron_sword'],
      freedomMeter: 12,
    },

    unlocks: ['slave_04_blood_debt'],

    pathMechanicEffects: {
      freedomMeter: 12,
      crowdFavor: 30,
      masterMood: 'delighted',
    },
  },

  slave_04_blood_debt: {
    id: 'slave_04_blood_debt',
    pathId: 'slave_gladiator',
    name: 'Blood Debt',
    description: 'Your master owes a debt. Win to save his reputation - and your life.',
    difficulty: 4,
    type: 'boss',
    act: 1,
    requiredFreedom: 25,

    dialogue: {
      before: '"My honor depends on this fight. Do not fail me, slave!"',
      after: '"You... you actually won! My debt is paid. You\'ve earned a small reward."',
      masterComment: '"Perhaps there\'s hope for you yet. But you\'re still my property."',
    },

    enemy: {
      name: 'Champion Brutus',
      class: 'BERSERKER',
      health: 400,
      strength: 18,
      level: 4,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat Champion Brutus', type: 'win', required: true },
      {
        id: 'damage',
        description: 'Deal 500+ total damage',
        type: 'damage_dealt',
        value: 500,
        star: true,
      },
      {
        id: 'survive',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
        star: true,
      },
    ],

    rewards: {
      gold: 100,
      xp: 350,
      equipment: ['steel_axe', 'chainmail'],
      freedomMeter: 15,
    },

    unlocks: ['slave_05_whispers_of_freedom'],

    pathMechanicEffects: {
      freedomMeter: 15,
      crowdFavor: 40,
      masterMood: 'grateful',
    },
  },

  // ========== ACT 2: PATH TO GLORY (Missions 5-8) ==========

  slave_05_whispers_of_freedom: {
    id: 'slave_05_whispers_of_freedom',
    pathId: 'slave_gladiator',
    name: 'Whispers of Freedom',
    description: 'A mysterious benefactor offers hope. Win to gain their attention.',
    difficulty: 5,
    type: 'standard',
    act: 2,
    requiredFreedom: 40,

    dialogue: {
      before: '"Someone in the crowd is watching you closely. Make them notice you."',
      after: '"A hooded figure nods from the stands. They slip away into the shadows."',
      mysteryNote: '"You fight well, slave. Continue winning. Freedom may yet be yours."',
    },

    enemy: {
      name: 'Desert Raider',
      class: 'AGILE',
      health: 350,
      strength: 16,
      level: 5,
    },

    objectives: [
      {
        id: 'win',
        description: "Win to gain the benefactor's attention",
        type: 'win',
        required: true,
      },
      { id: 'combo', description: 'Build a 4-hit combo', type: 'combo', value: 4, star: true },
      { id: 'fast', description: 'Win within 8 rounds', type: 'rounds', value: 8, star: true },
    ],

    rewards: {
      gold: 120,
      xp: 400,
      equipment: ['shadow_dagger'],
      freedomMeter: 18,
    },

    unlocks: ['slave_06_champions_league'],

    pathMechanicEffects: {
      freedomMeter: 18,
      crowdFavor: 50,
      benefactorContact: true,
    },
  },

  slave_06_champions_league: {
    id: 'slave_06_champions_league',
    pathId: 'slave_gladiator',
    name: 'Champions League',
    description: 'Fight in the Grand Arena against seasoned champions.',
    difficulty: 6,
    type: 'survival',
    act: 2,
    requiredFreedom: 58,

    dialogue: {
      before: '"Three champions stand between you and glory. Defeat them all!"',
      after: '"Incredible! A slave defeating three champions! The crowd is yours!"',
    },

    waves: [
      { name: 'Iron Fist Gaius', class: 'BRAWLER', health: 320, strength: 18, level: 6 },
      { name: 'Swift Blade Helena', class: 'ASSASSIN', health: 280, strength: 20, level: 6 },
      { name: 'Mountain Titus', class: 'TANK', health: 450, strength: 16, level: 7 },
    ],

    objectives: [
      { id: 'win', description: 'Defeat all three champions', type: 'win', required: true },
      {
        id: 'health',
        description: 'Finish with 50% HP',
        type: 'health_percent',
        value: 50,
        star: true,
      },
      {
        id: 'efficient',
        description: 'Complete within 15 rounds total',
        type: 'rounds',
        value: 15,
        star: true,
      },
    ],

    rewards: {
      gold: 200,
      xp: 600,
      equipment: ['flame_blade', 'steel_plate'],
      freedomMeter: 20,
    },

    unlocks: ['slave_07_the_executioner'],

    pathMechanicEffects: {
      freedomMeter: 20,
      crowdFavor: 70,
      reputation: 'Rising Star',
    },
  },

  slave_07_the_executioner: {
    id: 'slave_07_the_executioner',
    pathId: 'slave_gladiator',
    name: 'The Executioner',
    description: "Face the arena's legendary executioner - a fight meant to break you.",
    difficulty: 8,
    type: 'boss',
    act: 2,
    requiredFreedom: 78,

    dialogue: {
      before: '"This is punishment for your arrogance, slave. The Executioner ends all dreams."',
      after:
        '"Impossible! You... defeated the Executioner! The crowd has never seen such a thing!"',
      masterReaction: '"You\'re becoming too valuable. I cannot afford to lose you now."',
    },

    enemy: {
      name: 'The Executioner',
      class: 'HYBRID',
      health: 600,
      strength: 25,
      level: 8,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat The Executioner', type: 'win', required: true },
      { id: 'crits', description: 'Land 5 critical hits', type: 'crits', value: 5, star: true },
      {
        id: 'damage',
        description: 'Deal 800+ total damage',
        type: 'damage_dealt',
        value: 800,
        star: true,
      },
    ],

    rewards: {
      gold: 300,
      xp: 800,
      equipment: ['dragons_fang', 'titans_guard'],
      freedomMeter: 22,
    },

    unlocks: ['slave_08_masters_gambit'],

    pathMechanicEffects: {
      freedomMeter: 22,
      crowdFavor: 90,
      masterMood: 'conflicted',
      reputation: 'Legend',
    },
  },

  slave_08_masters_gambit: {
    id: 'slave_08_masters_gambit',
    pathId: 'slave_gladiator',
    name: "Master's Gambit",
    description: 'Your master bets everything on you. Win to prove your worth - or die trying.',
    difficulty: 9,
    type: 'standard',
    act: 2,
    requiredFreedom: 100, // This will be the freedom threshold

    dialogue: {
      before: '"I\'ve wagered my entire fortune on you. Win, and I\'ll consider your freedom."',
      after: '"You won! My fortune is secure! As promised, we will discuss your future..."',
      masterOffer: '"Perhaps... perhaps you\'ve earned the right to choose your destiny."',
    },

    enemy: {
      name: 'Imperial Champion',
      class: 'PALADIN',
      health: 550,
      strength: 28,
      level: 9,
    },

    objectives: [
      { id: 'win', description: 'Defeat the Imperial Champion', type: 'win', required: true },
      { id: 'combo', description: 'Build a 5-hit combo', type: 'combo', value: 5, star: true },
      {
        id: 'perfect',
        description: 'Take less than 100 damage',
        type: 'damage_taken',
        value: 100,
        star: true,
      },
    ],

    rewards: {
      gold: 400,
      xp: 1000,
      freedomMeter: 100, // Reaches freedom threshold
    },

    unlocks: ['slave_09_the_offer'],

    pathMechanicEffects: {
      freedomMeter: 100,
      crowdFavor: 100,
      masterMood: 'contemplative',
      freedomEligible: true,
    },
  },

  // ========== ACT 3: CHOICE AND CONSEQUENCE (Missions 9-12) ==========

  slave_09_the_offer: {
    id: 'slave_09_the_offer',
    pathId: 'slave_gladiator',
    name: 'The Offer',
    description: 'Your master offers a choice: Freedom or become his champion with riches.',
    difficulty: 7,
    type: 'standard',
    act: 3,
    requiredFreedom: 100,

    dialogue: {
      before: '"Before I grant you freedom, prove once more that you are worthy."',
      after: '"You are free to leave... or stay as my champion. The choice is yours."',
      choice: '"What will you choose: Freedom as a pauper, or riches as my champion?"',
    },

    enemy: {
      name: 'Final Test Guardian',
      class: 'BALANCED',
      health: 500,
      strength: 26,
      level: 10,
    },

    objectives: [
      { id: 'win', description: 'Pass the final test', type: 'win', required: true },
      { id: 'no_items', description: 'Win without items', type: 'no_items', star: true },
      { id: 'fast', description: 'Win within 10 rounds', type: 'rounds', value: 10, star: true },
    ],

    rewards: {
      gold: 500,
      xp: 1200,
      storyChoice: true, // Triggers path branching
    },

    unlocks: ['slave_10_path_of_freedom', 'slave_10_path_of_glory'], // Two branches

    pathMechanicEffects: {
      storyBranch: 'choice_offered',
    },
  },

  // Branch A: Freedom Path
  slave_10_path_of_freedom: {
    id: 'slave_10_path_of_freedom',
    pathId: 'slave_gladiator',
    name: 'Path of Freedom',
    description: 'You chose freedom. Now fight one last time to truly earn it.',
    difficulty: 10,
    type: 'boss',
    act: 3,
    requiredChoice: 'freedom',

    dialogue: {
      before: '"So you choose freedom over riches. Very well. But first, one final battle."',
      after: '"You are free. Go, and may the gods watch over you."',
      epilogue: '"You walk away from the arena, a free person. Your journey begins anew."',
    },

    enemy: {
      name: "Master's Champion",
      class: 'WARRIOR',
      health: 650,
      strength: 30,
      level: 11,
      isBoss: true,
    },

    objectives: [
      {
        id: 'win',
        description: 'Defeat the champion to earn freedom',
        type: 'win',
        required: true,
      },
      {
        id: 'survive',
        description: 'Win with 30% HP remaining',
        type: 'health_percent',
        value: 30,
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
      gold: 200, // Less gold, but freedom
      xp: 1500,
      equipment: ['bronze_ring'], // Basic equipment for new journey
      pathEnding: 'freedom',
    },

    unlocks: ['slave_ending_freedom'],

    pathMechanicEffects: {
      status: 'free',
      reputation: 'Former Gladiator',
    },
  },

  // Branch B: Champion Path
  slave_10_path_of_glory: {
    id: 'slave_10_path_of_glory',
    pathId: 'slave_gladiator',
    name: 'Path of Glory',
    description: 'You chose to remain as champion. Prove your worth in legendary combat.',
    difficulty: 10,
    type: 'boss',
    act: 3,
    requiredChoice: 'champion',

    dialogue: {
      before: '"You will be my champion! Together we will conquer the arena world!"',
      after: '"Magnificent! You are the greatest champion I have ever owned!"',
      epilogue: '"You remain in the arena, but now as a legend. Gold and glory are yours."',
    },

    enemy: {
      name: "Rival Master's Champion",
      class: 'BERSERKER',
      health: 700,
      strength: 32,
      level: 11,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: 'Defeat the rival champion', type: 'win', required: true },
      { id: 'crits', description: 'Land 7 critical hits', type: 'crits', value: 7, star: true },
      { id: 'combo', description: 'Build a 6-hit combo', type: 'combo', value: 6, star: true },
    ],

    rewards: {
      gold: 1000, // Much more gold as champion
      xp: 1500,
      equipment: ['excalibur', 'aegis_of_legends'], // Legendary equipment
      pathEnding: 'champion',
    },

    unlocks: ['slave_ending_glory'],

    pathMechanicEffects: {
      status: 'champion',
      reputation: 'Arena Legend',
    },
  },

  // Final Mission (after either choice)
  slave_11_final_reckoning: {
    id: 'slave_11_final_reckoning',
    pathId: 'slave_gladiator',
    name: 'Final Reckoning',
    description: 'One last battle to cement your legacy, regardless of your choice.',
    difficulty: 12,
    type: 'boss',
    act: 3,
    requiredChoice: 'any', // Available for both branches

    dialogue: {
      before: '"This is your final test. Win, and your story becomes legend."',
      after: '"You have proven yourself beyond all doubt. Your name will live forever!"',
    },

    enemy: {
      name: "Emperor's Shadow",
      class: 'NECROMANCER',
      health: 800,
      strength: 35,
      level: 12,
      isBoss: true,
    },

    objectives: [
      { id: 'win', description: "Defeat the Emperor's Shadow", type: 'win', required: true },
      {
        id: 'perfect',
        description: 'Win with 40% HP remaining',
        type: 'health_percent',
        value: 40,
        star: true,
      },
      {
        id: 'legendary',
        description: 'Complete within 12 rounds',
        type: 'rounds',
        value: 12,
        star: true,
      },
    ],

    rewards: {
      gold: 2000,
      xp: 2000,
      equipment: ['crown_of_champions'],
    },

    unlocks: ['path_complete'],

    pathMechanicEffects: {
      pathComplete: true,
      legend: true,
    },
  },
};

/**
 * Get mission by ID
 */
export function getSlaveMissionById(id) {
  return SLAVE_GLADIATOR_MISSIONS[id] || null;
}

/**
 * Get all missions for this path
 */
export function getAllSlaveMissions() {
  return Object.values(SLAVE_GLADIATOR_MISSIONS);
}

/**
 * Get missions by act
 */
export function getSlaveMissionsByAct(act) {
  return Object.values(SLAVE_GLADIATOR_MISSIONS).filter((m) => m.act === act);
}

/**
 * Get missions available based on freedom meter
 */
export function getAvailableSlaveMissions(freedomMeter) {
  return Object.values(SLAVE_GLADIATOR_MISSIONS).filter((m) => m.requiredFreedom <= freedomMeter);
}

/**
 * Get next mission in progression
 */
export function getNextSlaveMission(currentMissionId) {
  const current = SLAVE_GLADIATOR_MISSIONS[currentMissionId];
  if (!current || !current.unlocks || current.unlocks.length === 0) return null;

  // Return first unlocked mission
  return SLAVE_GLADIATOR_MISSIONS[current.unlocks[0]] || null;
}

/**
 * Check if mission is unlocked
 */
export function isSlaveMissionUnlocked(missionId, completedMissions, freedomMeter) {
  const mission = SLAVE_GLADIATOR_MISSIONS[missionId];
  if (!mission) return false;

  // Check freedom requirement
  if (mission.requiredFreedom > freedomMeter) return false;

  // First mission is always available
  if (missionId === 'slave_01_first_blood') return true;

  // Check if any prerequisite mission is completed
  const allMissions = Object.values(SLAVE_GLADIATOR_MISSIONS);
  const prerequisiteMission = allMissions.find((m) => m.unlocks && m.unlocks.includes(missionId));

  if (!prerequisiteMission) return false;

  return completedMissions[prerequisiteMission.id] !== undefined;
}

export default SLAVE_GLADIATOR_MISSIONS;
