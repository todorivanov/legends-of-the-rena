/**
 * Selectors - Functions to retrieve specific data from state
 * These provide a clean API to access state and can compute derived data
 */

/**
 * Player selectors
 */
export const selectPlayer = (state) => state.player;
export const selectPlayerLevel = (state) => state.player?.level || 1;
export const selectPlayerGold = (state) => state.player?.gold || 0;
export const selectPlayerXP = (state) => state.player?.xp || 0;
export const selectPlayerHealth = (state) => state.player?.health || 0;
export const selectPlayerMaxHealth = (state) => state.player?.maxHealth || 100;
export const selectPlayerStrength = (state) => state.player?.strength || 10;
export const selectPlayerDefense = (state) => state.player?.defense || 0;

/**
 * Combat selectors
 */
export const selectCombat = (state) => state.combat;
export const selectIsCombatActive = (state) => state.combat?.active || false;
export const selectCombatRound = (state) => state.combat?.round || 0;
export const selectCurrentTurn = (state) => state.combat?.currentTurn;
export const selectFighter1 = (state) => state.combat?.fighter1;
export const selectFighter2 = (state) => state.combat?.fighter2;
export const selectCombatWinner = (state) => state.combat?.winner;

/**
 * Game mode selectors
 */
export const selectGameMode = (state) => state.gameMode;
export const selectCurrentScreen = (state) => state.currentScreen;
export const selectFighters = (state) => state.fighters || [];
export const selectSelectedFighters = (state) => state.selectedFighters || [];

/**
 * Tournament selectors
 */
export const selectTournament = (state) => state.tournament;
export const selectIsTournamentActive = (state) => state.tournament?.active || false;
export const selectTournamentRound = (state) => state.tournament?.currentRound || 0;
export const selectTournamentDifficulty = (state) => state.tournament?.difficulty;

/**
 * Story mode selectors
 */
export const selectStory = (state) => state.story;
export const selectCurrentMission = (state) => state.story?.currentMission;
export const selectCompletedMissions = (state) => state.story?.completedMissions || {};
export const selectUnlockedRegions = (state) => state.story?.unlockedRegions || [];
export const selectUnlockedMissions = (state) => state.story?.unlockedMissions || [];

// Derived selector: Mission completion info
export const selectMissionInfo = (state, missionId) => {
  const completedMissions = selectCompletedMissions(state);
  return completedMissions[missionId] || null;
};

// Derived selector: Total stars earned
export const selectTotalStars = (state) => {
  const completed = selectCompletedMissions(state);
  return Object.values(completed).reduce((total, mission) => total + (mission.stars || 0), 0);
};

/**
 * Inventory selectors
 */
export const selectInventory = (state) => state.inventory;
export const selectEquipment = (state) => state.inventory?.equipment || [];
export const selectConsumables = (state) => state.inventory?.consumables || {};
export const selectEquipped = (state) => state.equipped || {};
export const selectEquippedWeapon = (state) => state.equipped?.weapon;
export const selectEquippedArmor = (state) => state.equipped?.armor;
export const selectEquippedAccessory = (state) => state.equipped?.accessory;
export const selectEquipmentDurability = (state) => state.equipmentDurability || {};

// Derived selector: Can afford item
export const selectCanAfford = (state, cost) => {
  return selectPlayerGold(state) >= cost;
};

// Derived selector: Inventory count
export const selectInventoryCount = (state) => {
  return selectEquipment(state).length;
};

/**
 * Statistics selectors
 */
export const selectStats = (state) => state.stats;
export const selectTotalWins = (state) => state.stats?.totalWins || 0;
export const selectTotalLosses = (state) => state.stats?.totalLosses || 0;
export const selectWinStreak = (state) => state.stats?.winStreak || 0;
export const selectBestStreak = (state) => state.stats?.bestStreak || 0;
export const selectTotalFights = (state) => state.stats?.totalFightsPlayed || 0;

// Derived selector: Win rate
export const selectWinRate = (state) => {
  const wins = selectTotalWins(state);
  const total = selectTotalFights(state);
  return total > 0 ? Math.round((wins / total) * 100) : 0;
};

/**
 * Settings selectors
 */
export const selectSettings = (state) => state.settings;
export const selectDifficulty = (state) => state.settings?.difficulty || 'normal';
export const selectSoundEnabled = (state) => state.settings?.soundEnabled !== false;
export const selectAutoBattle = (state) => state.settings?.autoBattle || false;
export const selectAutoScroll = (state) => state.settings?.autoScroll !== false;

/**
 * Achievement selectors
 */
export const selectUnlockedAchievements = (state) => state.unlocks?.achievements || [];

// Derived selector: Is achievement unlocked
export const selectIsAchievementUnlocked = (state, achievementId) => {
  return selectUnlockedAchievements(state).includes(achievementId);
};

// Derived selector: Achievement count
export const selectAchievementCount = (state) => {
  return selectUnlockedAchievements(state).length;
};

/**
 * UI state selectors
 */
export const selectUI = (state) => state.ui;
export const selectIsLoading = (state) => state.ui?.loading || false;
export const selectLoadingMessage = (state) => state.ui?.loadingMessage || '';
export const selectError = (state) => state.ui?.error;
export const selectNotification = (state) => state.ui?.notification;
export const selectIsNotificationVisible = (state) => state.ui?.notification?.visible || false;

/**
 * Complex derived selectors
 */

// Get player's total stats including equipment bonuses
export const selectPlayerTotalStats = (state) => {
  const baseStats = {
    health: selectPlayerMaxHealth(state),
    strength: selectPlayerStrength(state),
    defense: selectPlayerDefense(state),
    critChance: 15, // base
    manaRegen: 10, // base
  };

  // TODO: Add equipment bonus calculation here once equipment system is integrated
  // const equipped = selectEquipped(state);
  // Apply bonuses from equipped items

  return baseStats;
};

// Get player progress to next level
export const selectLevelProgress = (state) => {
  const xp = selectPlayerXP(state);
  const xpNeeded = state.player?.xpToNextLevel || 100;
  return {
    current: xp,
    needed: xpNeeded,
    percentage: Math.floor((xp / xpNeeded) * 100),
  };
};

// Check if player meets requirements
export const selectMeetsRequirements = (state, requirements) => {
  if (!requirements) return true;

  if (requirements.level && selectPlayerLevel(state) < requirements.level) {
    return false;
  }

  if (requirements.gold && selectPlayerGold(state) < requirements.gold) {
    return false;
  }

  // Add more requirement checks as needed

  return true;
};
