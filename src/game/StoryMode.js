/**
 * StoryMode - Handles story progression, mission tracking, and objective evaluation
 * Manages the campaign system and mission rewards
 */

import { gameStore } from '../store/gameStore.js';
import {
  setCurrentMissionState,
  trackMissionEvent as trackMissionEventAction,
  completeMission as completeMissionAction,
  unlockRegion as unlockRegionAction,
  incrementStat,
  updatePathProgress as updatePathProgressAction,
} from '../store/actions.js';

import { SLAVE_GLADIATOR_MISSIONS, getAllSlaveMissions } from '../data/slave_gladiator_missions.js';
import {
  ROMAN_LEGIONNAIRE_MISSIONS,
  getAllLegionMissions,
} from '../data/roman_legionnaire_missions.js';
import { LANISTA_MISSIONS, getAllLanistaMissions } from '../data/lanista_missions.js';
import {
  BARBARIAN_TRAVELLER_MISSIONS,
  getAllBarbarianMissions,
} from '../data/barbarian_traveller_missions.js';
import { DESERT_NOMAD_MISSIONS, getAllDesertMissions } from '../data/desert_nomad_missions.js';
import { EconomyManager } from './EconomyManager.js';
import { LevelingSystem } from './LevelingSystem.js';
import { EquipmentManager } from './EquipmentManager.js';
import { DurabilityManager } from './DurabilityManager.js';
import { Logger } from '../utils/logger.js';
import { AchievementManager } from './AchievementManager.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

// Path-to-missions mapping
const PATH_MISSIONS = {
  slave_gladiator: SLAVE_GLADIATOR_MISSIONS,
  roman_legionnaire: ROMAN_LEGIONNAIRE_MISSIONS,
  lanista: LANISTA_MISSIONS,
  barbarian_traveller: BARBARIAN_TRAVELLER_MISSIONS,
  desert_nomad: DESERT_NOMAD_MISSIONS,
};

/**
 * Get mission by ID from appropriate path
 * @param {string} missionId - Mission ID
 * @returns {Object|null} - Mission data
 */
function getMissionById(missionId) {
  const state = gameStore.getState();
  const currentPath = state.player.storyPath;

  // If no path selected, fall back to old missions
  if (!currentPath) {
    ConsoleLogger.warn(LogCategory.STORY, 'No story path selected');
    return null;
  }

  // Get missions for current path
  const pathMissions = PATH_MISSIONS[currentPath];
  if (!pathMissions) {
    ConsoleLogger.warn(LogCategory.STORY, `Unknown path: ${currentPath}`);
    return null;
  }

  return pathMissions[missionId] || null;
}

/**
 * Get all missions for current path
 * @returns {Array} - All missions for active path
 */
function getAllPathMissions() {
  const state = gameStore.getState();
  const currentPath = state.player.storyPath;

  if (!currentPath) return [];

  switch (currentPath) {
    case 'slave_gladiator':
      return getAllSlaveMissions();
    case 'roman_legionnaire':
      return getAllLegionMissions();
    case 'lanista':
      return getAllLanistaMissions();
    case 'barbarian_traveller':
      return getAllBarbarianMissions();
    case 'desert_nomad':
      return getAllDesertMissions();
    default:
      return [];
  }
}

export class StoryMode {
  /**
   * Start a story mission
   * @param {string} missionId - Mission ID
   * @returns {Object} - Mission data and tracking object
   */
  static startMission(missionId) {
    const mission = getMissionById(missionId);
    if (!mission) {
      ConsoleLogger.error(LogCategory.STORY, 'Mission not found:', missionId);
      return null;
    }

    // Create mission tracking object
    const missionState = {
      missionId,
      mission,
      startTime: Date.now(),
      roundCount: 0,
      damageDealt: 0,
      damageTaken: 0,
      critsLanded: 0,
      skillsUsed: 0,
      itemsUsed: 0,
      healingUsed: false,
      defended: false,
      maxCombo: 0,
      maxSingleHit: 0,
      objectives: this.initializeObjectives(mission),
    };

    // Set as current mission
    gameStore.dispatch(setCurrentMissionState(missionState));

    ConsoleLogger.info(LogCategory.STORY, `📖 Started Mission: ${mission.name}`);
    return missionState;
  }

  /**
   * Initialize objective tracking
   * @param {Object} mission - Mission data
   * @returns {Object} - Objectives with tracking
   */
  static initializeObjectives(mission) {
    const objectives = {};

    mission.objectives.forEach((obj) => {
      objectives[obj.id] = {
        ...obj,
        completed: false,
        current: 0,
      };
    });

    return objectives;
  }

  /**
   * Update mission tracking during battle
   * @param {string} event - Event type
   * @param {*} data - Event data
   */
  static trackMissionEvent(event, data = {}) {
    const state = gameStore.getState();
    const missionState = state.story.currentMission;
    if (!missionState || typeof missionState === 'string') return;

    // Dispatch tracking event to update mission state
    gameStore.dispatch(trackMissionEventAction(event, data));
  }

  /**
   * Complete mission and evaluate objectives
   * @param {boolean} victory - Whether player won
   * @param {Object} playerState - Final player state (HP, maxHP, etc)
   * @returns {Object} - Mission results with rewards
   */
  static completeMission(victory, playerState = {}) {
    const state = gameStore.getState();
    const missionState = state.story.currentMission;
    if (!missionState || typeof missionState === 'string') {
      ConsoleLogger.error(LogCategory.STORY, 'No active mission');
      return null;
    }

    const mission = missionState.mission;

    if (!victory) {
      // Mission failed
      ConsoleLogger.info(LogCategory.STORY, '❌ Mission failed');
      gameStore.dispatch(setCurrentMissionState(null));

      return {
        success: false,
        mission,
        stars: 0,
        rewards: null,
      };
    }

    // Evaluate objectives
    const results = this.evaluateObjectives(missionState, playerState);
    const starsEarned = results.starsEarned;

    // Mark mission as completed and store stars
    gameStore.dispatch(completeMissionAction(mission.id, starsEarned, null));

    // Unlock new missions/regions
    if (mission.unlocks) {
      mission.unlocks.forEach((unlock) => {
        if (unlock.startsWith('region_')) {
          // Region unlock
          const regionId = unlock.replace('region_', '');
          const unlockedRegions = state.story.unlockedRegions || [];
          if (!unlockedRegions.includes(regionId)) {
            gameStore.dispatch(unlockRegionAction(regionId));
            ConsoleLogger.info(LogCategory.STORY, `🗺️ Unlocked new region: ${regionId}`);
          }
        }
      });
    }

    // Award rewards
    const rewards = this.awardMissionRewards(mission, starsEarned);

    ConsoleLogger.info(LogCategory.STORY, `✅ Mission Complete: ${starsEarned}/3 stars`);

    // Track achievements
    AchievementManager.trackStoryMissionCompleted(mission, starsEarned);

    // Check for flawless mission (no damage taken)
    if (missionState.damageTaken === 0) {
      gameStore.dispatch(incrementStat('flawlessMissions'));
      AchievementManager.trackFlawlessMission();
    }

    // Check for fast mission (5 rounds or less)
    if (missionState.roundCount <= 5) {
      gameStore.dispatch(incrementStat('fastMissions'));
      AchievementManager.trackFastMission();
    }

    // Check for perfect missions (3 stars)
    if (starsEarned === 3) {
      gameStore.dispatch(incrementStat('perfectMissions'));
    }

    // Check all achievements after mission completion
    AchievementManager.checkAchievements();

    // Log completion message
    const message = `
      <div class="mission-complete" style="
        background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(56, 142, 60, 0.4));
        border: 3px solid #4caf50;
        border-radius: 15px;
        padding: 20px;
        margin: 15px 0;
        text-align: center;
      ">
        <div style="font-size: 48px; margin-bottom: 10px;">🎊</div>
        <div style="font-size: 28px; font-weight: 900; color: #66bb6a; margin-bottom: 10px;">MISSION COMPLETE!</div>
        <div style="font-size: 24px; color: #ffc107; margin-bottom: 10px;">
          ${'⭐'.repeat(starsEarned)}${'☆'.repeat(3 - starsEarned)}
        </div>
        <div style="color: #a5d6a7; font-size: 18px; margin-top: 10px;">
          ${mission.name}
        </div>
      </div>
    `;
    Logger.log(message);

    return {
      success: true,
      mission,
      stars: starsEarned,
      objectives: results.objectives,
      rewards,
    };
  }

  /**
   * Evaluate all mission objectives
   * @param {Object} missionState - Current mission state
   * @param {Object} playerState - Final player state
   * @returns {Object} - Evaluation results
   */
  static evaluateObjectives(missionState, playerState) {
    const objectives = missionState.objectives;
    let starsEarned = 0;

    Object.keys(objectives).forEach((objId) => {
      const obj = objectives[objId];
      const completed = this.evaluateObjective(obj, missionState, playerState);

      obj.completed = completed;

      if (completed && obj.star) {
        starsEarned++;
      }
    });

    // Base star for winning
    starsEarned++; // Always get 1 star for completing mission

    return {
      objectives,
      starsEarned: Math.min(3, starsEarned),
    };
  }

  /**
   * Evaluate a single objective
   * @param {Object} objective - Objective data
   * @param {Object} missionState - Mission tracking state
   * @param {Object} playerState - Player final state
   * @returns {boolean} - Whether objective was completed
   */
  static evaluateObjective(objective, missionState, playerState) {
    switch (objective.type) {
      case 'win':
        return true; // If we're evaluating, we won

      case 'no_items':
        return missionState.itemsUsed === 0;

      case 'no_healing':
        return !missionState.healingUsed;

      case 'no_defend':
        return !missionState.defended;

      case 'rounds':
        return missionState.roundCount <= objective.value;

      case 'damage_dealt':
        return missionState.damageDealt >= objective.value;

      case 'damage_taken':
        return missionState.damageTaken <= objective.value;

      case 'health_percent': {
        const hpPercent = (playerState.currentHP / playerState.maxHP) * 100;
        return hpPercent >= objective.value;
      }

      case 'crits':
        return missionState.critsLanded >= objective.value;

      case 'combo':
        return missionState.maxCombo >= objective.value;

      case 'skills_used':
        return missionState.skillsUsed >= objective.value;

      case 'single_hit':
        return missionState.maxSingleHit >= objective.value;

      default:
        ConsoleLogger.warn(LogCategory.STORY, 'Unknown objective type:', objective.type);
        return false;
    }
  }

  /**
   * Award mission rewards
   * @param {Object} mission - Mission data
   * @param {number} stars - Stars earned
   * @returns {Object} - Rewards given
   */
  static awardMissionRewards(mission, stars) {
    const rewards = {
      gold: 0,
      xp: 0,
      equipment: [],
      pathProgress: {},
    };

    // Base rewards
    if (mission.rewards.gold) {
      const goldAmount = EconomyManager.calculateStoryReward(mission.difficulty, stars);
      EconomyManager.addGold(goldAmount, `Mission: ${mission.name}`);
      rewards.gold = goldAmount;
    }

    if (mission.rewards.xp) {
      const xpAmount = mission.rewards.xp + (stars - 1) * 50; // Bonus XP for stars
      LevelingSystem.awardXP(xpAmount, `Mission: ${mission.name}`);
      rewards.xp = xpAmount;
    }

    // Equipment rewards (guaranteed drops)
    if (mission.rewards.equipment && mission.rewards.equipment.length > 0) {
      mission.rewards.equipment.forEach((equipmentId) => {
        if (EquipmentManager.addToInventory(equipmentId)) {
          DurabilityManager.initializeItemDurability(equipmentId);
          rewards.equipment.push(equipmentId);
        }
      });
    }

    // Path-specific mechanic effects (v5.0.0)
    if (mission.pathMechanicEffects) {
      const state = gameStore.getState();

      // Apply path-specific progress updates
      if (mission.pathMechanicEffects.freedomMeter !== undefined) {
        const currentFreedom = state.story.pathProgress.freedomMeter || 0;
        const newFreedom = Math.min(100, currentFreedom + mission.pathMechanicEffects.freedomMeter);
        gameStore.dispatch(updatePathProgressAction('freedomMeter', newFreedom));
        rewards.pathProgress.freedomMeter = mission.pathMechanicEffects.freedomMeter;
        ConsoleLogger.info(
          LogCategory.STORY,
          `⛓️ Freedom Meter: ${currentFreedom} → ${newFreedom} (+${mission.pathMechanicEffects.freedomMeter})`
        );
      }

      // Additional path mechanics can be added here as needed
      // Example: Rank progression, territory control, reputation, etc.
    }

    return rewards;
  }

  /**
   * Get mission stars
   * @param {string} missionId - Mission ID
   * @returns {number} - Stars earned (0-3)
   */
  static getMissionStars(missionId) {
    const state = gameStore.getState();
    const completedMissions = state.story.completedMissions || {};
    return completedMissions[missionId]?.stars || 0;
  }

  /**
   * Check if mission is completed
   * @param {string} missionId - Mission ID
   * @returns {boolean}
   */
  static isMissionCompleted(missionId) {
    const state = gameStore.getState();
    const completedMissions = state.story.completedMissions || {};
    return !!completedMissions[missionId];
  }

  /**
   * Get total story progress percentage
   * @returns {number} - Percentage (0-100)
   */
  static getTotalProgress() {
    const state = gameStore.getState();
    const completedMissions = state.story.completedMissions || {};

    // Calculate based on completed missions count
    return Math.floor((Object.keys(completedMissions).length / 25) * 100);
  }

  /**
   * Get total stars earned
   * @returns {Object} - { earned, total }
   */
  static getTotalStars() {
    const state = gameStore.getState();
    const completedMissions = state.story.completedMissions || {};

    let earned = 0;
    let count = 0;
    Object.values(completedMissions).forEach((mission) => {
      earned += mission.stars || 0;
      count++;
    });

    const total = count * 3; // 3 stars per mission

    return { earned, total };
  }

  /**
   * Get all available missions for current path
   * @returns {Array} - Available missions based on path progress
   */
  static getAvailablePathMissions() {
    const state = gameStore.getState();
    const currentPath = state.player.storyPath;

    if (!currentPath) return [];

    const allMissions = getAllPathMissions();
    const completedMissions = state.story.completedMissions || {};

    // Filter out completed missions
    return allMissions.filter((mission) => !completedMissions[mission.id]);
  }

  /**
   * Get missions by act for current path
   * @param {number} act - Act number (1, 2, or 3)
   * @returns {Array} - Missions in that act
   */
  static getMissionsByAct(act) {
    const allMissions = getAllPathMissions();
    return allMissions.filter((mission) => mission.act === act);
  }
}
