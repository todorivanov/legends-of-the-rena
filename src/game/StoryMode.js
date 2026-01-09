/**
 * StoryMode - Handles story progression, mission tracking, and objective evaluation
 * Manages the campaign system and mission rewards
 */

import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { getMissionById } from '../data/storyMissions.js';
import { getRegionById, isRegionUnlocked } from '../data/storyRegions.js';
import { EconomyManager } from './EconomyManager.js';
import { LevelingSystem } from './LevelingSystem.js';
import { EquipmentManager } from './EquipmentManager.js';
import { DurabilityManager } from './DurabilityManager.js';
import { Logger } from '../utils/logger.js';
import { AchievementManager } from './AchievementManager.js';

export class StoryMode {
  /**
   * Start a story mission
   * @param {string} missionId - Mission ID
   * @returns {Object} - Mission data and tracking object
   */
  static startMission(missionId) {
    const mission = getMissionById(missionId);
    if (!mission) {
      console.error('Mission not found:', missionId);
      return null;
    }

    // Check if region is unlocked
    const storyProgress = SaveManager.get('storyProgress');
    if (!isRegionUnlocked(mission.region, storyProgress)) {
      console.log('❌ Region not unlocked yet');
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
    SaveManager.update('storyProgress.currentMission', missionState);

    console.log(`📖 Started Mission: ${mission.name}`);
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
    const missionState = SaveManager.get('storyProgress.currentMission');
    if (!missionState) return;

    switch (event) {
      case 'round_complete':
        missionState.roundCount++;
        break;

      case 'damage_dealt':
        missionState.damageDealt += data.amount;
        missionState.maxSingleHit = Math.max(missionState.maxSingleHit, data.amount);
        break;

      case 'damage_taken':
        missionState.damageTaken += data.amount;
        break;

      case 'critical_hit':
        missionState.critsLanded++;
        break;

      case 'skill_used':
        missionState.skillsUsed++;
        break;

      case 'item_used':
        missionState.itemsUsed++;
        if (data.isHealing) {
          missionState.healingUsed = true;
        }
        break;

      case 'defended':
        missionState.defended = true;
        break;

      case 'combo':
        missionState.maxCombo = Math.max(missionState.maxCombo, data.combo);
        break;
    }

    // Update current mission state
    SaveManager.update('storyProgress.currentMission', missionState);
  }

  /**
   * Complete mission and evaluate objectives
   * @param {boolean} victory - Whether player won
   * @param {Object} playerState - Final player state (HP, maxHP, etc)
   * @returns {Object} - Mission results with rewards
   */
  static completeMission(victory, playerState = {}) {
    const missionState = SaveManager.get('storyProgress.currentMission');
    if (!missionState) {
      console.error('No active mission');
      return null;
    }

    const mission = missionState.mission;

    if (!victory) {
      // Mission failed
      console.log('❌ Mission failed');
      SaveManager.update('storyProgress.currentMission', null);

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

    // Mark mission as completed
    const completedMissions = SaveManager.get('storyProgress.completedMissions') || [];
    if (!completedMissions.includes(mission.id)) {
      completedMissions.push(mission.id);
      SaveManager.update('storyProgress.completedMissions', completedMissions);
    }

    // Update mission stars (track best attempt)
    const missionStars = SaveManager.get('storyProgress.missionStars') || {};
    const previousStars = missionStars[mission.id] || 0;
    if (starsEarned > previousStars) {
      missionStars[mission.id] = starsEarned;
      SaveManager.update('storyProgress.missionStars', missionStars);
    }

    // Unlock new missions/regions
    if (mission.unlocks) {
      mission.unlocks.forEach((unlock) => {
        if (unlock.startsWith('region_')) {
          // Region unlock
          const regionId = unlock.replace('region_', '');
          const unlockedRegions = SaveManager.get('storyProgress.unlockedRegions') || [];
          if (!unlockedRegions.includes(regionId)) {
            unlockedRegions.push(regionId);
            SaveManager.update('storyProgress.unlockedRegions', unlockedRegions);
            console.log(`🗺️ Unlocked new region: ${regionId}`);
          }
        }
      });
    }

    // Award rewards
    const rewards = this.awardMissionRewards(mission, starsEarned);

    // Clear current mission
    SaveManager.update('storyProgress.currentMission', null);

    console.log(`✅ Mission Complete: ${starsEarned}/3 stars`);

    // Track achievements
    AchievementManager.trackStoryMissionCompleted(mission, starsEarned);

    // Check for flawless mission (no damage taken)
    if (missionState.damageTaken === 0) {
      SaveManager.increment('stats.flawlessMissions');
      AchievementManager.trackFlawlessMission();
    }

    // Check for fast mission (5 rounds or less)
    if (missionState.roundCount <= 5) {
      SaveManager.increment('stats.fastMissions');
      AchievementManager.trackFastMission();
    }

    // Check for perfect missions (3 stars)
    if (starsEarned === 3) {
      SaveManager.increment('stats.perfectMissions');
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
        console.warn('Unknown objective type:', objective.type);
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

    const completedMissions = SaveManager.get('storyProgress.completedMissions') || [];

    // All missions in region are available once region is unlocked
    return region.missions.filter((missionId) => !completedMissions.includes(missionId));
  }

  /**
   * Get mission stars
   * @param {string} missionId - Mission ID
   * @returns {number} - Stars earned (0-3)
   */
  static getMissionStars(missionId) {
    const missionStars = SaveManager.get('storyProgress.missionStars') || {};
    return missionStars[missionId] || 0;
  }

  /**
   * Check if mission is completed
   * @param {string} missionId - Mission ID
   * @returns {boolean}
   */
  static isMissionCompleted(missionId) {
    const completedMissions = SaveManager.get('storyProgress.completedMissions') || [];
    return completedMissions.includes(missionId);
  }

  /**
   * Get total story progress percentage
   * @returns {number} - Percentage (0-100)
   */
  static getTotalProgress() {
    const completedMissions = SaveManager.get('storyProgress.completedMissions') || [];

    // Calculate based on completed missions count
    return Math.floor((completedMissions.length / 25) * 100);
  }

  /**
   * Get total stars earned
   * @returns {Object} - { earned, total }
   */
  static getTotalStars() {
    const missionStars = SaveManager.get('storyProgress.missionStars') || {};
    const completedMissions = SaveManager.get('storyProgress.completedMissions') || [];

    const earned = Object.values(missionStars).reduce((sum, stars) => sum + stars, 0);
    const total = completedMissions.length * 3; // 3 stars per mission

    return { earned, total };
  }
}
