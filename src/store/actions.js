/**
 * Action Types - All possible state mutations
 */

export const ActionTypes = {
  // Player Actions
  SET_PLAYER: 'SET_PLAYER',
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  ADD_GOLD: 'ADD_GOLD',
  SPEND_GOLD: 'SPEND_GOLD',
  ADD_XP: 'ADD_XP',
  LEVEL_UP: 'LEVEL_UP',

  // Combat Actions
  START_COMBAT: 'START_COMBAT',
  END_COMBAT: 'END_COMBAT',
  UPDATE_FIGHTER: 'UPDATE_FIGHTER',
  SET_COMBAT_ROUND: 'SET_COMBAT_ROUND',
  SET_CURRENT_TURN: 'SET_CURRENT_TURN',

  // Game Mode Actions
  SET_GAME_MODE: 'SET_GAME_MODE',
  SET_SCREEN: 'SET_SCREEN',
  START_TOURNAMENT: 'START_TOURNAMENT',
  END_TOURNAMENT: 'END_TOURNAMENT',
  TOURNAMENT_NEXT_ROUND: 'TOURNAMENT_NEXT_ROUND',

  // Story Mode Actions
  SET_STORY_MISSION: 'SET_STORY_MISSION',
  COMPLETE_MISSION: 'COMPLETE_MISSION',
  UNLOCK_REGION: 'UNLOCK_REGION',
  UNLOCK_MISSION: 'UNLOCK_MISSION',

  // Inventory Actions
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  EQUIP_ITEM: 'EQUIP_ITEM',
  UNEQUIP_ITEM: 'UNEQUIP_ITEM',
  UPDATE_DURABILITY: 'UPDATE_DURABILITY',

  // Statistics Actions
  INCREMENT_STAT: 'INCREMENT_STAT',
  RECORD_BATTLE: 'RECORD_BATTLE',
  UPDATE_STREAK: 'UPDATE_STREAK',

  // Settings Actions
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  TOGGLE_SOUND: 'TOGGLE_SOUND',
  TOGGLE_AUTO_BATTLE: 'TOGGLE_AUTO_BATTLE',
  TOGGLE_AUTO_SCROLL: 'TOGGLE_AUTO_SCROLL',

  // Achievement Actions
  UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',

  // UI State Actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
};

/**
 * Action Creators - Functions that create actions
 */

// Player Actions
export const setPlayer = (playerData) => ({
  type: ActionTypes.SET_PLAYER,
  payload: playerData,
});

export const updatePlayer = (updates) => ({
  type: ActionTypes.UPDATE_PLAYER,
  payload: updates,
});

export const addGold = (amount) => ({
  type: ActionTypes.ADD_GOLD,
  payload: { amount },
});

export const spendGold = (amount) => ({
  type: ActionTypes.SPEND_GOLD,
  payload: { amount },
});

export const addXP = (amount) => ({
  type: ActionTypes.ADD_XP,
  payload: { amount },
});

export const levelUp = () => ({
  type: ActionTypes.LEVEL_UP,
  payload: {},
});

// Combat Actions
export const startCombat = (fighter1, fighter2, options = {}) => ({
  type: ActionTypes.START_COMBAT,
  payload: { fighter1, fighter2, options },
});

export const endCombat = (winner, stats) => ({
  type: ActionTypes.END_COMBAT,
  payload: { winner, stats },
});

export const updateFighter = (fighterId, updates) => ({
  type: ActionTypes.UPDATE_FIGHTER,
  payload: { fighterId, updates },
});

export const setCombatRound = (round) => ({
  type: ActionTypes.SET_COMBAT_ROUND,
  payload: { round },
});

export const setCurrentTurn = (fighterId) => ({
  type: ActionTypes.SET_CURRENT_TURN,
  payload: { fighterId },
});

// Game Mode Actions
export const setGameMode = (mode) => ({
  type: ActionTypes.SET_GAME_MODE,
  payload: { mode },
});

export const setScreen = (screen) => ({
  type: ActionTypes.SET_SCREEN,
  payload: { screen },
});

export const startTournament = (opponents, difficulty) => ({
  type: ActionTypes.START_TOURNAMENT,
  payload: { opponents, difficulty },
});

export const endTournament = (won) => ({
  type: ActionTypes.END_TOURNAMENT,
  payload: { won },
});

export const tournamentNextRound = () => ({
  type: ActionTypes.TOURNAMENT_NEXT_ROUND,
  payload: {},
});

// Story Mode Actions
export const setStoryMission = (missionId) => ({
  type: ActionTypes.SET_STORY_MISSION,
  payload: { missionId },
});

export const completeMission = (missionId, stars, rewards) => ({
  type: ActionTypes.COMPLETE_MISSION,
  payload: { missionId, stars, rewards },
});

export const unlockRegion = (regionId) => ({
  type: ActionTypes.UNLOCK_REGION,
  payload: { regionId },
});

export const unlockMission = (missionId) => ({
  type: ActionTypes.UNLOCK_MISSION,
  payload: { missionId },
});

// Inventory Actions
export const addItem = (item) => ({
  type: ActionTypes.ADD_ITEM,
  payload: { item },
});

export const removeItem = (itemId) => ({
  type: ActionTypes.REMOVE_ITEM,
  payload: { itemId },
});

export const equipItem = (itemId, slot) => ({
  type: ActionTypes.EQUIP_ITEM,
  payload: { itemId, slot },
});

export const unequipItem = (slot) => ({
  type: ActionTypes.UNEQUIP_ITEM,
  payload: { slot },
});

export const updateDurability = (itemId, durability) => ({
  type: ActionTypes.UPDATE_DURABILITY,
  payload: { itemId, durability },
});

// Statistics Actions
export const incrementStat = (statName, amount = 1) => ({
  type: ActionTypes.INCREMENT_STAT,
  payload: { statName, amount },
});

export const recordBattle = (won, stats) => ({
  type: ActionTypes.RECORD_BATTLE,
  payload: { won, stats },
});

export const updateStreak = (won) => ({
  type: ActionTypes.UPDATE_STREAK,
  payload: { won },
});

// Settings Actions
export const setDifficulty = (difficulty) => ({
  type: ActionTypes.SET_DIFFICULTY,
  payload: { difficulty },
});

export const toggleSound = () => ({
  type: ActionTypes.TOGGLE_SOUND,
  payload: {},
});

export const toggleAutoBattle = () => ({
  type: ActionTypes.TOGGLE_AUTO_BATTLE,
  payload: {},
});

export const toggleAutoScroll = () => ({
  type: ActionTypes.TOGGLE_AUTO_SCROLL,
  payload: {},
});

// Achievement Actions
export const unlockAchievement = (achievementId, reward) => ({
  type: ActionTypes.UNLOCK_ACHIEVEMENT,
  payload: { achievementId, reward },
});

// UI State Actions
export const setLoading = (isLoading, message = '') => ({
  type: ActionTypes.SET_LOADING,
  payload: { isLoading, message },
});

export const setError = (error) => ({
  type: ActionTypes.SET_ERROR,
  payload: { error },
});

export const clearError = () => ({
  type: ActionTypes.CLEAR_ERROR,
  payload: {},
});

export const showNotification = (message, type = 'info', duration = 3000) => ({
  type: ActionTypes.SHOW_NOTIFICATION,
  payload: { message, type, duration },
});

export const hideNotification = () => ({
  type: ActionTypes.HIDE_NOTIFICATION,
  payload: {},
});
