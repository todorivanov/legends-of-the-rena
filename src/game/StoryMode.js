/**
 * StoryMode - Handles story progression, mission tracking, and objective evaluation
 * Manages the campaign system and mission rewards
 */

import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { gameStore } from '../store/gameStore.js';
import {
  setCurrentMissionState,
  trackMissionEvent as trackMissionEventAction,
  completeMission as completeMissionAction,
  unlockRegion as unlockRegionAction,
  incrementStat,
} from '../store/actions.js';
import { getMissionById } from '../data/storyMissions.js';
import { getRegionById, isRegionUnlocked } from '../data/storyRegions.js';
import { EconomyManager } from './EconomyManager.js';
import { LevelingSystem } from './LevelingSystem.js';
import { EquipmentManager } from './EquipmentManager.js';
import { DurabilityManager } from './DurabilityManager.js';
import { Logger } from '../utils/logger.js';
import { AchievementManager } from './AchievementManager.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

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

    // Check if region is unlocked
    const state = gameStore.getState();
    const storyProgress = {
      completedMissions: state.story.completedMissions || {},
      unlockedRegions: state.story.unlockedRegions || [],
    };
    if (!isRegionUnlocked(mission.region, storyProgress)) {
      ConsoleLogger.warn(LogCategory.STORY, '❌ Region not unlocked yet');
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

    return rewards;
  }

  /**
   * Get available missions for a region
   * @param {string} regionId - Region ID
   * @returns {Array} - Available mission IDs
   */
  static getAvailableMissions(regionId) {
    const region = getRegionById(regionId);
    if (!region) return [];

    const state = gameStore.getState();
    const completedMissions = state.story.completedMissions || {};

    // All missions in region are available once region is unlocked
    return region.missions.filter((missionId) => !completedMissions[missionId]);
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
}
