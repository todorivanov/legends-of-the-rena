/**
 * Route Definitions
 * Centralized route configuration with guards
 */

import { gameStore } from '../store/gameStore.js';

/**
 * Route Guards - Access control functions
 */
export const RouteGuards = {
  /**
   * Check if character has been created
   */
  characterCreated: () => {
    const state = gameStore.getState();
    return state.player.characterCreated;
  },

  /**
   * Check if player has reached minimum level
   * @param {Object} data - Route data with minLevel
   */
  minimumLevel: (data) => {
    const state = gameStore.getState();
    const minLevel = data.minLevel || 1;
    return state.player.level >= minLevel;
  },

  /**
   * Check if story region is unlocked
   * @param {Object} data - Route data with regionId
   */
  regionUnlocked: (data) => {
    if (!data.regionId) return true;
    const state = gameStore.getState();
    return state.story?.unlockedRegions?.includes(data.regionId) || false;
  },

  /**
   * Check if mission is unlocked
   * @param {Object} data - Route data with missionId
   */
  missionUnlocked: (data) => {
    if (!data.missionId) return true;
    const state = gameStore.getState();
    return state.story?.unlockedMissions?.includes(data.missionId) || false;
  },

  /**
   * Check if tournament is unlocked (level 5+)
   */
  tournamentUnlocked: () => {
    const state = gameStore.getState();
    return state.player.level >= 5;
  },
};

/**
 * Route Paths
 */
export const RoutePaths = {
  // Main screens
  HOME: '/',
  CHARACTER_CREATION: '/character-creation',
  PROFILE: '/profile',
  ACHIEVEMENTS: '/achievements',
  SETTINGS: '/settings',
  WIKI: '/wiki',

  // Game modes
  OPPONENT_SELECTION: '/opponent-selection',
  COMBAT: '/combat',
  TOURNAMENT: '/tournament',
  TOURNAMENT_BRACKET: '/tournament/bracket',
  STORY_MODE: '/story',
  STORY_MISSION: '/story/mission',
  MARKETPLACE: '/marketplace',
  EQUIPMENT: '/equipment',

  // Save management
  SAVE_MANAGEMENT: '/save-management',

  // Future routes (for upcoming features)
  TRAINING: '/training',
  CRAFTING: '/crafting',
  TALENTS: '/talents',
  DUNGEON: '/dungeon',
  PVP: '/pvp',
  GUILD: '/guild',
  CODEX: '/codex',
};

/**
 * Get route configuration
 * @param {Function} handlers - Object with route handler functions
 * @returns {Array} Array of route configurations
 */
export function getRouteConfig(handlers) {
  return [
    // Main Navigation
    {
      path: RoutePaths.HOME,
      handler: handlers.showTitleScreen,
      title: 'Legends of the Arena',
    },
    {
      path: RoutePaths.CHARACTER_CREATION,
      handler: handlers.showCharacterCreation,
      title: 'Character Creation - Legends of the Arena',
    },
    {
      path: RoutePaths.PROFILE,
      handler: handlers.showProfileScreen,
      guard: 'characterCreated',
      title: 'Profile - Legends of the Arena',
    },
    {
      path: RoutePaths.ACHIEVEMENTS,
      handler: handlers.showAchievementsScreen,
      guard: 'characterCreated',
      title: 'Achievements - Legends of the Arena',
    },
    {
      path: RoutePaths.TALENTS,
      handler: handlers.showTalentTreeScreen,
      guard: 'characterCreated',
      title: 'Talents - Legends of the Arena',
    },
    {
      path: RoutePaths.SETTINGS,
      handler: handlers.showSettingsScreen,
      title: 'Settings - Legends of the Arena',
    },
    {
      path: RoutePaths.WIKI,
      handler: handlers.showWikiScreen,
      title: 'Game Wiki - Legends of the Arena',
    },

    // Game Modes
    {
      path: RoutePaths.OPPONENT_SELECTION,
      handler: handlers.showOpponentSelection,
      guard: 'characterCreated',
      title: 'Select Opponent - Legends of the Arena',
    },
    {
      path: RoutePaths.COMBAT,
      handler: handlers.showCombat,
      guard: 'characterCreated',
      title: 'Combat - Legends of the Arena',
    },
    {
      path: RoutePaths.TOURNAMENT_BRACKET,
      handler: handlers.showTournamentBracketScreen,
      guard: 'characterCreated',
      title: 'Tournament - Legends of the Arena',
    },
    {
      path: RoutePaths.STORY_MODE,
      handler: handlers.showCampaignMapScreen,
      guard: 'characterCreated',
      title: 'Story Mode - Legends of the Arena',
    },
    {
      path: RoutePaths.STORY_MISSION,
      handler: handlers.showMissionBriefing,
      guard: 'characterCreated',
      title: 'Mission Briefing - Legends of the Arena',
    },
    {
      path: RoutePaths.MARKETPLACE,
      handler: handlers.showMarketplaceScreen,
      guard: 'characterCreated',
      title: 'Marketplace - Legends of the Arena',
    },
    {
      path: RoutePaths.EQUIPMENT,
      handler: handlers.showEquipmentScreen,
      guard: 'characterCreated',
      title: 'Equipment - Legends of the Arena',
    },
    {
      path: RoutePaths.SAVE_MANAGEMENT,
      handler: handlers.showSaveManagementScreen,
      title: 'Save Management - Legends of the Arena',
    },
  ];
}
