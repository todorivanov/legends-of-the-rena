/**
 * Achievements Database
 * Defines all available achievements in the game
 */

export const ACHIEVEMENT_CATEGORIES = {
  COMBAT: 'combat',
  CLASS: 'class',
  STRATEGIC: 'strategic',
  SPECIAL: 'special',
  PROGRESSION: 'progression',
  STORY: 'story',
  ECONOMY: 'economy',
};

export const ACHIEVEMENTS = [
  // COMBAT ACHIEVEMENTS
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Win your first battle',
    icon: '⚔️',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'wins',
      target: 1,
    },
    reward: { xp: 50 },
  },
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'Win 10 battles',
    icon: '🗡️',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'wins',
      target: 10,
    },
    reward: { xp: 100 },
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Win 50 battles',
    icon: '⚔️',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'wins',
      target: 50,
    },
    reward: { xp: 250 },
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Win 100 battles',
    icon: '🏅',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'wins',
      target: 100,
    },
    reward: { xp: 500 },
  },
  {
    id: 'flawless_victory',
    name: 'Flawless Victory',
    description: 'Win a battle without taking damage',
    icon: '💎',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'flawless',
      target: 1,
    },
    reward: { xp: 200 },
  },
  {
    id: 'critical_master',
    name: 'Critical Master',
    description: 'Land 50 critical hits',
    icon: '💥',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'criticalHits',
      target: 50,
    },
    reward: { xp: 150 },
  },
  {
    id: 'finishing_blow',
    name: 'Finishing Blow',
    description: 'Win a battle with a critical hit',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'criticalFinish',
      target: 1,
    },
    reward: { xp: 100 },
  },
  {
    id: 'heavy_hitter',
    name: 'Heavy Hitter',
    description: 'Deal 500 damage in a single hit',
    icon: '🔥',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'singleHit',
      target: 500,
    },
    reward: { xp: 300 },
  },
  {
    id: 'winning_streak',
    name: 'Winning Streak',
    description: 'Win 5 battles in a row',
    icon: '🔥',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'winStreak',
      target: 5,
    },
    reward: { xp: 200 },
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Win 10 battles in a row',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.COMBAT,
    requirement: {
      type: 'winStreak',
      target: 10,
    },
    reward: { xp: 400 },
  },

  // STRATEGIC ACHIEVEMENTS
  {
    id: 'skill_master',
    name: 'Skill Master',
    description: 'Use skills 50 times',
    icon: '🌟',
    category: ACHIEVEMENT_CATEGORIES.STRATEGIC,
    requirement: {
      type: 'skillsUsed',
      target: 50,
    },
    reward: { xp: 150 },
  },
  {
    id: 'combo_king',
    name: 'Combo King',
    description: 'Build a 5-hit combo',
    icon: '💫',
    category: ACHIEVEMENT_CATEGORIES.STRATEGIC,
    requirement: {
      type: 'maxCombo',
      target: 5,
    },
    reward: { xp: 150 },
  },
  {
    id: 'basic_warrior',
    name: 'Basic Warrior',
    description: 'Win using only basic attacks',
    icon: '✊',
    category: ACHIEVEMENT_CATEGORIES.STRATEGIC,
    requirement: {
      type: 'basicOnly',
      target: 1,
    },
    reward: { xp: 200 },
  },
  {
    id: 'no_items',
    name: 'Purist',
    description: 'Win without using items',
    icon: '🚫',
    category: ACHIEVEMENT_CATEGORIES.STRATEGIC,
    requirement: {
      type: 'noItems',
      target: 1,
    },
    reward: { xp: 150 },
  },

  // SPECIAL ACHIEVEMENTS
  {
    id: 'first_tournament',
    name: 'Tournament Champion',
    description: 'Win your first tournament',
    icon: '🏆',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'tournamentsWon',
      target: 1,
    },
    reward: { xp: 300 },
  },
  {
    id: 'hard_mode',
    name: 'Hard Mode Champion',
    description: 'Win a tournament on Hard difficulty',
    icon: '💀',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'tournamentHard',
      target: 1,
    },
    reward: { xp: 500 },
  },
  {
    id: 'nightmare_mode',
    name: 'Nightmare Conqueror',
    description: 'Win a tournament on Nightmare difficulty',
    icon: '👹',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'tournamentNightmare',
      target: 1,
    },
    reward: { xp: 1000 },
  },
  {
    id: 'serial_champion',
    name: 'Serial Champion',
    description: 'Win 10 tournaments',
    icon: '🏆',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'tournamentsWon',
      target: 10,
    },
    reward: { xp: 1000 },
  },
  {
    id: 'equipment_collector',
    name: 'Equipment Collector',
    description: 'Collect 10 equipment pieces',
    icon: '📦',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'equipmentCollected',
      target: 10,
    },
    reward: { xp: 200 },
  },
  {
    id: 'legendary_collector',
    name: 'Legendary Collector',
    description: 'Collect a legendary item',
    icon: '🌟',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL,
    requirement: {
      type: 'legendaryCollected',
      target: 1,
    },
    reward: { xp: 500 },
  },

  // PROGRESSION ACHIEVEMENTS
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⬆️',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    requirement: {
      type: 'level',
      target: 5,
    },
    reward: { xp: 100 },
  },
  {
    id: 'level_10',
    name: 'Expert Fighter',
    description: 'Reach level 10',
    icon: '⬆️',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    requirement: {
      type: 'level',
      target: 10,
    },
    reward: { xp: 250 },
  },
  {
    id: 'level_20',
    name: 'Master Fighter',
    description: 'Reach maximum level (20)',
    icon: '👑',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    requirement: {
      type: 'level',
      target: 20,
    },
    reward: { xp: 500 },
  },
  {
    id: 'total_damage',
    name: 'Damage Dealer',
    description: 'Deal 10,000 total damage',
    icon: '💥',
    category: ACHIEVEMENT_CATEGORIES.PROGRESSION,
    requirement: {
      type: 'totalDamageDealt',
      target: 10000,
    },
    reward: { xp: 300 },
  },

  // STORY MODE ACHIEVEMENTS
  {
    id: 'first_mission',
    name: 'Hero\'s Journey Begins',
    description: 'Complete your first story mission',
    icon: '📖',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'storyMissionsCompleted',
      target: 1,
    },
    reward: { xp: 100, gold: 50 },
  },
  {
    id: 'story_veteran',
    name: 'Story Veteran',
    description: 'Complete 10 story missions',
    icon: '📚',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'storyMissionsCompleted',
      target: 10,
    },
    reward: { xp: 300, gold: 150 },
  },
  {
    id: 'perfect_mission',
    name: 'Perfectionist',
    description: 'Earn 3 stars on any mission',
    icon: '⭐',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'perfectMissions',
      target: 1,
    },
    reward: { xp: 200, gold: 100 },
  },
  {
    id: 'perfect_region',
    name: 'Master of the Region',
    description: 'Earn 3 stars on all missions in a region',
    icon: '🌟',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'perfectRegions',
      target: 1,
    },
    reward: { xp: 500, gold: 250 },
  },
  {
    id: 'boss_slayer',
    name: 'Boss Slayer',
    description: 'Defeat your first boss in story mode',
    icon: '👑',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'bossesDefeated',
      target: 1,
    },
    reward: { xp: 300, gold: 150 },
  },
  {
    id: 'boss_master',
    name: 'Boss Master',
    description: 'Defeat all story bosses',
    icon: '🏆',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'bossesDefeated',
      target: 6, // Tutorial Arena boss + 5 region bosses
    },
    reward: { xp: 1000, gold: 500 },
  },
  {
    id: 'speed_runner',
    name: 'Speed Runner',
    description: 'Complete a mission in 5 rounds or less',
    icon: '⚡',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'fastMissions',
      target: 1,
    },
    reward: { xp: 200, gold: 100 },
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete your first survival mission',
    icon: '🛡️',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'survivalMissionsCompleted',
      target: 1,
    },
    reward: { xp: 250, gold: 125 },
  },
  {
    id: 'story_complete',
    name: 'Legend of the Arena',
    description: 'Complete the entire story campaign',
    icon: '🎊',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'storyMissionsCompleted',
      target: 25, // All missions
    },
    reward: { xp: 2000, gold: 1000 },
  },
  {
    id: 'star_collector',
    name: 'Star Collector',
    description: 'Earn 50 total stars in story mode',
    icon: '✨',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'totalStars',
      target: 50,
    },
    reward: { xp: 750, gold: 400 },
  },
  {
    id: 'flawless_mission',
    name: 'Flawless Campaign',
    description: 'Complete a story mission without taking damage',
    icon: '💎',
    category: ACHIEVEMENT_CATEGORIES.STORY,
    requirement: {
      type: 'flawlessMissions',
      target: 1,
    },
    reward: { xp: 300, gold: 150 },
  },

  // ECONOMY & MARKETPLACE ACHIEVEMENTS
  {
    id: 'first_purchase',
    name: 'First Purchase',
    description: 'Buy an item from the marketplace',
    icon: '🛒',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'marketplacePurchases',
      target: 1,
    },
    reward: { xp: 100, gold: 50 },
  },
  {
    id: 'shrewd_trader',
    name: 'Shrewd Trader',
    description: 'Buy and sell 10 items',
    icon: '💼',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'marketplaceTransactions',
      target: 10,
    },
    reward: { xp: 300, gold: 150 },
  },
  {
    id: 'first_repair',
    name: 'Blacksmith Apprentice',
    description: 'Repair equipment for the first time',
    icon: '🔧',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'itemsRepaired',
      target: 1,
    },
    reward: { xp: 100, gold: 50 },
  },
  {
    id: 'master_smith',
    name: 'Master Smith',
    description: 'Repair equipment 25 times',
    icon: '🛠️',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'itemsRepaired',
      target: 25,
    },
    reward: { xp: 500, gold: 250 },
  },
  {
    id: 'gold_hoarder',
    name: 'Gold Hoarder',
    description: 'Accumulate 1,000 gold',
    icon: '💰',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'goldBalance',
      target: 1000,
    },
    reward: { xp: 300, gold: 100 },
  },
  {
    id: 'wealthy',
    name: 'Wealthy Champion',
    description: 'Accumulate 5,000 gold',
    icon: '💎',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'goldBalance',
      target: 5000,
    },
    reward: { xp: 750, gold: 250 },
  },
  {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Spend 2,000 total gold',
    icon: '💸',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'totalGoldSpent',
      target: 2000,
    },
    reward: { xp: 400, gold: 200 },
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'Earn 5,000 total gold',
    icon: '🤑',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'totalGoldEarned',
      target: 5000,
    },
    reward: { xp: 600, gold: 300 },
  },
  {
    id: 'legendary_buyer',
    name: 'Legendary Buyer',
    description: 'Purchase a legendary item from the marketplace',
    icon: '🌟',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'legendaryPurchases',
      target: 1,
    },
    reward: { xp: 500, gold: 250 },
  },
  {
    id: 'merchant_prince',
    name: 'Merchant Prince',
    description: 'Sell items worth 1,000 gold',
    icon: '👑',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'goldFromSales',
      target: 1000,
    },
    reward: { xp: 500, gold: 250 },
  },
  {
    id: 'maintenance_master',
    name: 'Maintenance Master',
    description: 'Never let equipment break (repair before it reaches 0)',
    icon: '🏅',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY,
    requirement: {
      type: 'neverBrokenEquipment',
      target: 1,
    },
    reward: { xp: 400, gold: 200 },
  },
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id) {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category) {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Get all achievement categories with counts
 */
export function getAchievementCategoriesWithCounts() {
  return Object.values(ACHIEVEMENT_CATEGORIES).map(category => ({
    id: category,
    name: category.charAt(0).toUpperCase() + category.slice(1),
    achievements: getAchievementsByCategory(category),
    count: getAchievementsByCategory(category).length,
  }));
}
