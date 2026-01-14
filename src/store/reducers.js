/**
 * Reducers - Pure functions that handle state mutations
 * Each reducer takes (state, payload) and returns new state slice
 */

import { ActionTypes } from './actions.js';
import { GameConfig } from '../config/gameConfig.js';

/**
 * Player reducers
 */
export const playerReducers = {
  [ActionTypes.SET_PLAYER]: (state, payload) => ({
    player: { ...payload },
  }),

  [ActionTypes.UPDATE_PLAYER]: (state, payload) => ({
    player: { ...state.player, ...payload },
  }),

  [ActionTypes.ADD_GOLD]: (state, { amount }) => ({
    player: {
      ...state.player,
      gold: state.player.gold + amount,
    },
    stats: {
      ...state.stats,
      totalGoldEarned: state.stats.totalGoldEarned + amount,
    },
  }),

  [ActionTypes.SPEND_GOLD]: (state, { amount }) => {
    const newGold = Math.max(0, state.player.gold - amount);
    return {
      player: {
        ...state.player,
        gold: newGold,
      },
      stats: {
        ...state.stats,
        totalGoldSpent: state.stats.totalGoldSpent + amount,
      },
    };
  },

  [ActionTypes.ADD_XP]: (state, { amount }) => {
    const newXP = state.player.xp + amount;
    const xpNeeded = state.player.xpToNextLevel;

    // Check if leveled up
    if (newXP >= xpNeeded && state.player.level < GameConfig.leveling.maxLevel) {
      const remainingXP = newXP - xpNeeded;
      const newLevel = state.player.level + 1;
      const nextLevelXP = Math.floor(
        GameConfig.leveling.baseXP * Math.pow(GameConfig.leveling.xpScaling, newLevel)
      );

      return {
        player: {
          ...state.player,
          level: newLevel,
          xp: remainingXP,
          xpToNextLevel: nextLevelXP,
          maxHealth: state.player.maxHealth + GameConfig.leveling.hpPerLevel,
          strength: state.player.strength + GameConfig.leveling.strengthPerLevel,
          defense: state.player.defense + GameConfig.leveling.defensePerLevel,
        },
        ui: {
          ...state.ui,
          notification: {
            message: `🎉 Level Up! You are now level ${newLevel}!`,
            type: 'success',
            visible: true,
          },
        },
      };
    }

    return {
      player: {
        ...state.player,
        xp: newXP,
      },
    };
  },

  [ActionTypes.LEVEL_UP]: (state) => {
    // Manual level up (if called directly)
    const newLevel = state.player.level + 1;
    const nextLevelXP = Math.floor(
      GameConfig.leveling.baseXP * Math.pow(GameConfig.leveling.xpScaling, newLevel)
    );

    return {
      player: {
        ...state.player,
        level: newLevel,
        xp: 0,
        xpToNextLevel: nextLevelXP,
        maxHealth: state.player.maxHealth + GameConfig.leveling.hpPerLevel,
        strength: state.player.strength + GameConfig.leveling.strengthPerLevel,
        defense: state.player.defense + GameConfig.leveling.defensePerLevel,
      },
    };
  },
};

/**
 * Combat reducers
 */
export const combatReducers = {
  [ActionTypes.START_COMBAT]: (state, { fighter1, fighter2, options }) => ({
    combat: {
      active: true,
      fighter1,
      fighter2,
      round: 1,
      currentTurn: fighter1.id,
      options: options || {},
    },
  }),

  [ActionTypes.END_COMBAT]: (state, { winner, stats }) => ({
    combat: {
      ...state.combat,
      active: false,
      winner,
      stats,
    },
  }),

  [ActionTypes.UPDATE_FIGHTER]: (state, { fighterId, updates }) => {
    const fighterKey = state.combat.fighter1?.id === fighterId ? 'fighter1' : 'fighter2';
    return {
      combat: {
        ...state.combat,
        [fighterKey]: {
          ...state.combat[fighterKey],
          ...updates,
        },
      },
    };
  },

  [ActionTypes.SET_COMBAT_ROUND]: (state, { round }) => ({
    combat: {
      ...state.combat,
      round,
    },
  }),

  [ActionTypes.SET_CURRENT_TURN]: (state, { fighterId }) => ({
    combat: {
      ...state.combat,
      currentTurn: fighterId,
    },
  }),
};

/**
 * Game mode reducers
 */
export const gameModeReducers = {
  [ActionTypes.SET_GAME_MODE]: (state, { mode }) => ({
    gameMode: mode,
  }),

  [ActionTypes.SET_SCREEN]: (state, { screen }) => ({
    currentScreen: screen,
  }),

  [ActionTypes.START_TOURNAMENT]: (state, { opponents, difficulty }) => ({
    tournament: {
      active: true,
      opponents,
      difficulty,
      currentRound: 1,
      roundsWon: 0,
    },
  }),

  [ActionTypes.END_TOURNAMENT]: (state, { won }) => ({
    tournament: {
      ...state.tournament,
      active: false,
      won,
    },
    stats: won
      ? {
          ...state.stats,
          tournamentsWon: state.stats.tournamentsWon + 1,
        }
      : state.stats,
  }),

  [ActionTypes.TOURNAMENT_NEXT_ROUND]: (state) => ({
    tournament: {
      ...state.tournament,
      currentRound: state.tournament.currentRound + 1,
      roundsWon: state.tournament.roundsWon + 1,
    },
  }),
};

/**
 * Story mode reducers
 */
export const storyReducers = {
  [ActionTypes.SET_STORY_MISSION]: (state, { missionId }) => ({
    story: {
      ...state.story,
      currentMission: missionId,
    },
  }),

  [ActionTypes.SET_CURRENT_MISSION_STATE]: (state, { missionState }) => ({
    story: {
      ...state.story,
      currentMission: missionState,
    },
  }),

  [ActionTypes.TRACK_MISSION_EVENT]: (state, { event, data }) => {
    const currentMission = state.story.currentMission;
    if (!currentMission || typeof currentMission === 'string') return {};

    const updatedMission = { ...currentMission };

    switch (event) {
      case 'round_complete':
        updatedMission.roundCount++;
        break;
      case 'damage_dealt':
        updatedMission.damageDealt += data.amount;
        updatedMission.maxSingleHit = Math.max(updatedMission.maxSingleHit, data.amount);
        break;
      case 'damage_taken':
        updatedMission.damageTaken += data.amount;
        break;
      case 'critical_hit':
        updatedMission.critsLanded++;
        break;
      case 'skill_used':
        updatedMission.skillsUsed++;
        break;
      case 'item_used':
        updatedMission.itemsUsed++;
        if (data.isHealing) {
          updatedMission.healingUsed = true;
        }
        break;
      case 'defended':
        updatedMission.defended = true;
        break;
      case 'combo':
        updatedMission.maxCombo = Math.max(updatedMission.maxCombo, data.combo);
        break;
    }

    return {
      story: {
        ...state.story,
        currentMission: updatedMission,
      },
    };
  },

  [ActionTypes.COMPLETE_MISSION]: (state, { missionId, stars, rewards: _rewards }) => {
    const completedMissions = state.story.completedMissions || {};
    const currentStars = completedMissions[missionId]?.stars || 0;

    return {
      story: {
        ...state.story,
        completedMissions: {
          ...completedMissions,
          [missionId]: {
            stars: Math.max(currentStars, stars),
            completedAt: Date.now(),
          },
        },
        currentMission: null,
      },
    };
  },

  [ActionTypes.UNLOCK_REGION]: (state, { regionId }) => ({
    story: {
      ...state.story,
      unlockedRegions: [...(state.story.unlockedRegions || []), regionId],
    },
  }),

  [ActionTypes.UNLOCK_MISSION]: (state, { missionId }) => ({
    story: {
      ...state.story,
      unlockedMissions: [...(state.story.unlockedMissions || []), missionId],
    },
  }),
};

/**
 * Inventory reducers
 */
export const inventoryReducers = {
  [ActionTypes.ADD_ITEM]: (state, { item }) => ({
    inventory: {
      ...state.inventory,
      equipment: [...state.inventory.equipment, item],
    },
  }),

  [ActionTypes.REMOVE_ITEM]: (state, { itemId }) => ({
    inventory: {
      ...state.inventory,
      equipment: state.inventory.equipment.filter((item) => item !== itemId),
    },
  }),

  [ActionTypes.EQUIP_ITEM]: (state, { itemId, slot }) => ({
    equipped: {
      ...state.equipped,
      [slot]: itemId,
    },
    inventory: {
      ...state.inventory,
      equipment: state.inventory.equipment.filter((id) => id !== itemId),
    },
  }),

  [ActionTypes.UNEQUIP_ITEM]: (state, { slot }) => {
    const unequippedItemId = state.equipped[slot];
    return {
      equipped: {
        ...state.equipped,
        [slot]: null,
      },
      inventory: {
        ...state.inventory,
        equipment: unequippedItemId
          ? [...state.inventory.equipment, unequippedItemId]
          : state.inventory.equipment,
      },
    };
  },

  [ActionTypes.UPDATE_DURABILITY]: (state, { itemId, durability }) => ({
    equipmentDurability: {
      ...state.equipmentDurability,
      [itemId]: durability,
    },
  }),
};

/**
 * Statistics reducers
 */
export const statsReducers = {
  [ActionTypes.INCREMENT_STAT]: (state, { statName, amount }) => ({
    stats: {
      ...state.stats,
      [statName]: (state.stats[statName] || 0) + amount,
    },
  }),

  [ActionTypes.RECORD_BATTLE]: (state, { won, stats: battleStats }) => {
    const newWins = state.stats.totalWins + (won ? 1 : 0);
    const newLosses = state.stats.totalLosses + (won ? 0 : 1);
    const newStreak = won ? state.stats.winStreak + 1 : 0;
    const newBestStreak = Math.max(state.stats.bestStreak, newStreak);

    return {
      stats: {
        ...state.stats,
        totalWins: newWins,
        totalLosses: newLosses,
        totalFightsPlayed: state.stats.totalFightsPlayed + 1,
        winStreak: newStreak,
        bestStreak: newBestStreak,
        totalDamageDealt: state.stats.totalDamageDealt + (battleStats.damageDealt || 0),
        totalDamageTaken: state.stats.totalDamageTaken + (battleStats.damageTaken || 0),
      },
    };
  },

  [ActionTypes.UPDATE_STREAK]: (state, { won }) => {
    const newStreak = won ? state.stats.winStreak + 1 : 0;
    return {
      stats: {
        ...state.stats,
        winStreak: newStreak,
        bestStreak: Math.max(state.stats.bestStreak, newStreak),
      },
    };
  },
};

/**
 * Settings reducers
 */
export const settingsReducers = {
  [ActionTypes.SET_DIFFICULTY]: (state, { difficulty }) => ({
    settings: {
      ...state.settings,
      difficulty,
    },
  }),

  [ActionTypes.TOGGLE_SOUND]: (state) => ({
    settings: {
      ...state.settings,
      soundEnabled: !state.settings.soundEnabled,
    },
  }),

  [ActionTypes.TOGGLE_AUTO_BATTLE]: (state) => ({
    settings: {
      ...state.settings,
      autoBattle: !state.settings.autoBattle,
    },
  }),

  [ActionTypes.TOGGLE_AUTO_SCROLL]: (state) => ({
    settings: {
      ...state.settings,
      autoScroll: !state.settings.autoScroll,
    },
  }),

  [ActionTypes.TOGGLE_PERFORMANCE_MONITOR]: (state) => ({
    settings: {
      ...state.settings,
      showPerformanceMonitor: !state.settings.showPerformanceMonitor,
    },
  }),
};

/**
 * Achievement reducers
 */
export const achievementReducers = {
  [ActionTypes.UNLOCK_ACHIEVEMENT]: (state, { achievementId, reward }) => ({
    unlocks: {
      ...state.unlocks,
      achievements: [...(state.unlocks.achievements || []), achievementId],
    },
    ui: {
      ...state.ui,
      notification: {
        message: `🏆 Achievement Unlocked! ${reward?.xp ? `+${reward.xp} XP` : ''}`,
        type: 'achievement',
        visible: true,
      },
    },
  }),
};

/**
 * UI state reducers
 */
export const uiReducers = {
  [ActionTypes.SET_LOADING]: (state, { isLoading, message }) => ({
    ui: {
      ...state.ui,
      loading: isLoading,
      loadingMessage: message,
    },
  }),

  [ActionTypes.SET_ERROR]: (state, { error }) => ({
    ui: {
      ...state.ui,
      error,
    },
  }),

  [ActionTypes.CLEAR_ERROR]: (state) => ({
    ui: {
      ...state.ui,
      error: null,
    },
  }),

  [ActionTypes.SHOW_NOTIFICATION]: (state, { message, type, duration }) => ({
    ui: {
      ...state.ui,
      notification: {
        message,
        type,
        duration,
        visible: true,
      },
    },
  }),

  [ActionTypes.HIDE_NOTIFICATION]: (state) => ({
    ui: {
      ...state.ui,
      notification: {
        ...state.ui.notification,
        visible: false,
      },
    },
  }),
};

/**
 * Talent reducers
 */
export const talentReducers = {
  LEARN_TALENT: (state, { treeId, talentId }) => {
    const currentRank = state.player.talents[treeId]?.[talentId] || 0;

    return {
      player: {
        ...state.player,
        talents: {
          ...state.player.talents,
          [treeId]: {
            ...state.player.talents[treeId],
            [talentId]: currentRank + 1,
          },
        },
      },
    };
  },

  UNLEARN_TALENT: (state, { treeId, talentId }) => {
    const currentRank = state.player.talents[treeId]?.[talentId] || 0;
    const newRank = Math.max(0, currentRank - 1);

    const newTreeTalents = { ...state.player.talents[treeId] };
    if (newRank === 0) {
      delete newTreeTalents[talentId];
    } else {
      newTreeTalents[talentId] = newRank;
    }

    return {
      player: {
        ...state.player,
        talents: {
          ...state.player.talents,
          [treeId]: newTreeTalents,
        },
      },
    };
  },

  RESET_TALENTS: (state, { cost = 0 }) => {
    return {
      player: {
        ...state.player,
        gold: cost > 0 ? state.player.gold - cost : state.player.gold,
        talents: {
          tree1: {},
          tree2: {},
          tree3: {},
        },
      },
      ui: {
        ...state.ui,
        notification: {
          message: '✨ Talents reset successfully!',
          type: 'success',
          visible: true,
        },
      },
    };
  },
};

/**
 * Combine all reducers
 */
export const reducers = {
  ...playerReducers,
  ...combatReducers,
  ...gameModeReducers,
  ...storyReducers,
  ...inventoryReducers,
  ...statsReducers,
  ...settingsReducers,
  ...achievementReducers,
  ...talentReducers,
  ...uiReducers,
};
