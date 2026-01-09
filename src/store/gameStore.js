/**
 * Game Store - Main application state store
 */

import { createStore } from './Store.js';
import { reducers } from './reducers.js';
import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';

/**
 * Get initial state from SaveManager or defaults
 */
function getInitialState() {
  const saveData = SaveManager.load();

  return {
    // Player state
    player: {
      id: saveData.profile.id,
      name: saveData.profile.name || 'Player',
      level: saveData.profile.level || 1,
      xp: saveData.profile.xp || 0,
      xpToNextLevel: saveData.profile.xpToNextLevel || 100,
      gold: saveData.profile.gold || 100,
      health: saveData.profile.maxHealth || 100,
      maxHealth: saveData.profile.maxHealth || 100,
      strength: saveData.profile.character?.strength || 10,
      defense: saveData.profile.character?.defense || 0,
      class: saveData.profile.class || 'BALANCED',
      characterCreated: saveData.profile.characterCreated || false,
      character: saveData.profile.character,
    },

    // Combat state
    combat: {
      active: false,
      fighter1: null,
      fighter2: null,
      round: 0,
      currentTurn: null,
      winner: null,
      options: {},
    },

    // Game mode state
    gameMode: null, // 'single' | 'team' | 'tournament' | 'story'
    currentScreen: 'title',
    fighters: [],
    selectedFighters: [],

    // Tournament state
    tournament: {
      active: false,
      opponents: [],
      difficulty: 'normal',
      currentRound: 0,
      roundsWon: 0,
      won: false,
    },

    // Story mode state
    story: {
      currentMission: null,
      completedMissions: saveData.story?.completedMissions || {},
      unlockedRegions: saveData.story?.unlockedRegions || ['tutorial'],
      unlockedMissions: saveData.story?.unlockedMissions || ['tutorial_1'],
    },

    // Inventory state
    inventory: {
      equipment: saveData.inventory?.equipment || [],
      consumables: saveData.inventory?.consumables || {
        health_potion: 3,
        mana_potion: 3,
      },
    },
    equipped: saveData.equipped || {
      weapon: null,
      armor: null,
      accessory: null,
    },
    equipmentDurability: saveData.equipmentDurability || {},

    // Statistics
    stats: {
      totalWins: saveData.stats?.totalWins || 0,
      totalLosses: saveData.stats?.totalLosses || 0,
      totalDraws: saveData.stats?.totalDraws || 0,
      winStreak: saveData.stats?.winStreak || 0,
      bestStreak: saveData.stats?.bestStreak || 0,
      totalDamageDealt: saveData.stats?.totalDamageDealt || 0,
      totalDamageTaken: saveData.stats?.totalDamageTaken || 0,
      totalFightsPlayed: saveData.stats?.totalFightsPlayed || 0,
      tournamentsWon: saveData.stats?.tournamentsWon || 0,
      tournamentsPlayed: saveData.stats?.tournamentsPlayed || 0,
      criticalHits: saveData.stats?.criticalHits || 0,
      skillsUsed: saveData.stats?.skillsUsed || 0,
      itemsUsed: saveData.stats?.itemsUsed || 0,
      totalGoldEarned: saveData.stats?.totalGoldEarned || 0,
      totalGoldSpent: saveData.stats?.totalGoldSpent || 0,
      bossesDefeated: saveData.stats?.bossesDefeated || 0,
      survivalMissionsCompleted: saveData.stats?.survivalMissionsCompleted || 0,
    },

    // Settings
    settings: {
      difficulty: saveData.settings?.difficulty || 'normal',
      soundEnabled: saveData.settings?.soundEnabled !== false,
      soundVolume: saveData.settings?.soundVolume || 0.3,
      autoBattle: saveData.settings?.autoBattle || false,
      autoScroll: saveData.settings?.autoScroll !== false,
      darkMode: saveData.settings?.darkMode !== false,
      showPerformanceMonitor: saveData.settings?.showPerformanceMonitor || false,
    },

    // Unlocks
    unlocks: {
      fighters: saveData.unlocks?.fighters || [],
      skills: saveData.unlocks?.skills || [],
      achievements: saveData.unlocks?.achievements || [],
    },

    // UI state (not persisted)
    ui: {
      loading: false,
      loadingMessage: '',
      error: null,
      notification: {
        message: '',
        type: 'info',
        duration: 3000,
        visible: false,
      },
    },
  };
}

/**
 * Create the game store
 */
export const gameStore = createStore(getInitialState(), reducers);

/**
 * Middleware: Auto-save to localStorage on state changes
 */
gameStore.use({
  after: (state, action, _prevState) => {
    // Skip UI-only actions
    const uiOnlyActions = [
      'SET_LOADING',
      'SET_ERROR',
      'CLEAR_ERROR',
      'SHOW_NOTIFICATION',
      'HIDE_NOTIFICATION',
      '@@UNDO',
      '@@REDO',
    ];

    if (uiOnlyActions.includes(action.type)) {
      return;
    }

    // Auto-save state to SaveManager
    try {
      SaveManager.save({
        version: '4.0.0',
        profile: {
          ...state.player,
          character: state.player.character,
          characterCreated: state.player.characterCreated,
          lastPlayedAt: Date.now(),
        },
        stats: state.stats,
        equipped: state.equipped,
        inventory: state.inventory,
        equipmentDurability: state.equipmentDurability,
        unlocks: state.unlocks,
        settings: state.settings,
        story: state.story,
      });
    } catch (error) {
      console.error('❌ Failed to auto-save:', error);
    }
  },
});

/**
 * Middleware: Log all actions in development
 */
if (import.meta.env.DEV) {
  gameStore.use({
    before: (state, action) => {
      console.group(`%c Action: ${action.type}`, 'color: #03A9F4; font-weight: bold;');
      console.log('Payload:', action.payload);
      console.log('State before:', state);
    },
    after: (state, _action, _prevState) => {
      console.log('State after:', state);
      console.groupEnd();
    },
  });
}

// Export store instance
export default gameStore;

// Make store available globally for debugging
if (typeof window !== 'undefined') {
  window.__GAME_STORE__ = gameStore;
  console.log('🎮 Game Store initialized. Access via window.__GAME_STORE__');
}
