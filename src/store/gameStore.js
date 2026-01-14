/**
 * Game Store - Main application state store
 */

import { createStore } from './Store.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

import { reducers } from './reducers.js';
import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';

/**
 * Get initial state from SaveManager or defaults
 */
function getInitialState() {
  const saveData = SaveManager.load();

  // If no save exists, return minimal state for character creation
  if (!saveData) {
    ConsoleLogger.info(LogCategory.STORE, '💾 No save found, initializing for character creation');
    return {
      player: {
        id: `player_${Date.now()}`,
        name: '',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        gold: 100,
        health: 100,
        maxHealth: 100,
        strength: 10,
        defense: 0,
        class: null,
        characterCreated: false,
        character: null,
        talents: {
          tree1: {},
          tree2: {},
          tree3: {},
        },
      },
      combat: {
        active: false,
        fighter1: null,
        fighter2: null,
        round: 0,
        currentTurn: null,
        winner: null,
        options: {},
      },
      gameMode: null,
      currentScreen: 'character-creation',
      fighters: [],
      selectedFighters: [],
      tournament: {
        active: false,
        opponents: [],
        difficulty: 'normal',
        currentRound: 0,
        roundsWon: 0,
        won: false,
      },
      story: {
        currentMission: null,
        completedMissions: {},
        unlockedRegions: ['tutorial'],
        unlockedMissions: ['tutorial_1'],
      },
      inventory: {
        equipment: [],
        consumables: {
          health_potion: 3,
          mana_potion: 3,
        },
      },
      equipped: {
        weapon: null,
        head: null,
        torso: null,
        arms: null,
        trousers: null,
        shoes: null,
        coat: null,
        accessory: null,
      },
      equipmentDurability: {},
      stats: {
        totalWins: 0,
        totalLosses: 0,
        totalDraws: 0,
        winStreak: 0,
        bestStreak: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        totalFightsPlayed: 0,
        tournamentsWon: 0,
        tournamentsPlayed: 0,
        criticalHits: 0,
        skillsUsed: 0,
        itemsUsed: 0,
        totalGoldEarned: 0,
        totalGoldSpent: 0,
        bossesDefeated: 0,
        survivalMissionsCompleted: 0,
      },
      settings: {
        difficulty: 'normal',
        soundEnabled: true,
        soundVolume: 0.3,
        autoBattle: false,
        autoScroll: true,
        darkMode: true,
        showPerformanceMonitor: false,
      },
      unlocks: {
        fighters: [],
        skills: [],
        achievements: [],
      },
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
      talents: saveData.profile.talents || {
        tree1: {},
        tree2: {},
        tree3: {},
      },
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
      completedMissions: (() => {
        const missions = saveData.story?.completedMissions || {};
        // Handle migration from array format to object format
        if (Array.isArray(missions)) {
          const migratedMissions = {};
          missions.forEach((missionId) => {
            migratedMissions[missionId] = { stars: 0, completedAt: Date.now() };
          });
          return migratedMissions;
        }
        return missions;
      })(),
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
    equipped: {
      weapon: saveData.equipped?.weapon || null,
      head: saveData.equipped?.head || null,
      torso: saveData.equipped?.torso || saveData.equipped?.armor || null, // Backward compat: armor -> torso
      arms: saveData.equipped?.arms || null,
      trousers: saveData.equipped?.trousers || null,
      shoes: saveData.equipped?.shoes || null,
      coat: saveData.equipped?.coat || null,
      accessory: saveData.equipped?.accessory || null,
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
 * Save current state to SaveManager
 */
export function saveGameState() {
  // Skip saving if we're in the middle of resetting
  if (isResetting) {
    ConsoleLogger.info(LogCategory.STORE, '💾 Save skipped (resetting)');
    return;
  }

  const state = gameStore.getState();
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
    ConsoleLogger.info(LogCategory.STORE, '💾 Game auto-saved');
  } catch (error) {
    ConsoleLogger.error(LogCategory.STORE, '❌ Failed to save:', error);
  }
}

/**
 * Initialize auto-save interval (30 seconds)
 */
let autoSaveInterval = null;
let isResetting = false;

export function startAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }

  // Auto-save every 30 seconds
  autoSaveInterval = setInterval(() => {
    saveGameState();
  }, 30000);

  ConsoleLogger.info(LogCategory.STORE, '⏰ Auto-save started (every 30 seconds)');
}

export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    ConsoleLogger.info(LogCategory.STORE, '⏰ Auto-save stopped');
  }
}

export function setResetting(value) {
  isResetting = value;
}

// Save before page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    saveGameState();
  });
}

/**
 * Middleware: Log all actions in development
 */
if (import.meta.env.DEV) {
  gameStore.use({
    before: (state, action) => {
      console.group(`%c Action: ${action.type}`, 'color: #03A9F4; font-weight: bold;');
      ConsoleLogger.info(LogCategory.STORE, 'Payload:', action.payload);
      ConsoleLogger.info(LogCategory.STORE, 'State before:', state);
    },
    after: (state, _action, _prevState) => {
      ConsoleLogger.info(LogCategory.STORE, 'State after:', state);
      console.groupEnd();
    },
  });
}

// Export store instance
export default gameStore;

// Make store available globally for debugging
if (typeof window !== 'undefined') {
  window.__GAME_STORE__ = gameStore;
  ConsoleLogger.info(
    LogCategory.STORE,
    '🎮 Game Store initialized. Access via window.__GAME_STORE__'
  );
}
