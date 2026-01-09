/**
 * AchievementManager - Manages achievement tracking and unlocking
 */

import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { LevelingSystem } from './LevelingSystem.js';
import { Logger } from '../utils/logger.js';
import { soundManager } from '../utils/soundManager.js';
import { ACHIEVEMENTS, getAchievementById } from '../data/achievements.js';
import { EconomyManager } from './EconomyManager.js';

export class AchievementManager {
  /**
   * Check if an achievement is unlocked
   */
  static isUnlocked(achievementId) {
    const unlocked = SaveManager.get('unlocks.achievements') || [];
    return unlocked.includes(achievementId);
  }

  /**
   * Get all unlocked achievements
   */
  static getUnlockedAchievements() {
    const unlocked = SaveManager.get('unlocks.achievements') || [];
    return unlocked.map((id) => getAchievementById(id)).filter(Boolean);
  }

  /**
   * Get completion percentage
   */
  static getCompletionPercentage() {
    const unlocked = SaveManager.get('unlocks.achievements') || [];
    return Math.floor((unlocked.length / ACHIEVEMENTS.length) * 100);
  }

  /**
   * Unlock an achievement
   */
  static unlockAchievement(achievementId) {
    if (this.isUnlocked(achievementId)) {
      return false; // Already unlocked
    }

    const achievement = getAchievementById(achievementId);
    if (!achievement) {
      console.error(`Achievement not found: ${achievementId}`);
      return false;
    }

    // Add to unlocked list
    const unlocked = SaveManager.get('unlocks.achievements') || [];
    unlocked.push(achievementId);
    SaveManager.update('unlocks.achievements', unlocked);

    // Award XP
    if (achievement.reward.xp) {
      LevelingSystem.awardXP(achievement.reward.xp, `Achievement: ${achievement.name}`);
    }

    // Award Gold
    if (achievement.reward.gold) {
      // Import dynamically to avoid circular dependency
      import('./EconomyManager.js').then(({ EconomyManager }) => {
        EconomyManager.addGold(achievement.reward.gold, `Achievement: ${achievement.name}`);
      });
    }

    // Show achievement notification
    this.showAchievementNotification(achievement);

    console.log(`🏅 Achievement Unlocked: ${achievement.name}`);
    return true;
  }

  /**
   * Show achievement unlock notification
   */
  static showAchievementNotification(achievement) {
    const message = `
      <div class="achievement-unlock" style="
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 152, 0, 0.3));
        border: 3px solid gold;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        text-align: center;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
        animation: achievementPop 0.6s ease;
      ">
        <div style="font-size: 48px; margin-bottom: 10px;">${achievement.icon}</div>
        <div style="font-size: 24px; font-weight: bold; color: gold; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8); margin-bottom: 10px;">
          🏅 ACHIEVEMENT UNLOCKED!
        </div>
        <div style="font-size: 20px; color: white; font-weight: bold; margin-bottom: 5px;">
          ${achievement.name}
        </div>
        <div style="font-size: 14px; color: #ffd; margin-bottom: 10px;">
          ${achievement.description}
        </div>
        <div style="font-size: 14px; color: #ffa726;">
          ${achievement.reward.xp ? `+${achievement.reward.xp} XP` : ''}
          ${achievement.reward.xp && achievement.reward.gold ? ' • ' : ''}
          ${achievement.reward.gold ? `+${achievement.reward.gold} 💰` : ''}
        </div>
      </div>
    `;

    Logger.log(message);
    soundManager.play('victory');

    // Add achievement animation if not already present
    if (!document.getElementById('achievement-animations')) {
      const style = document.createElement('style');
      style.id = 'achievement-animations';
      style.innerHTML = `
        @keyframes achievementPop {
          0% { transform: scale(0) rotate(-5deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Check and unlock achievements based on stats
   */
  static checkAchievements() {
    const stats = SaveManager.get('stats');
    const profile = SaveManager.get('profile');
    const unlockedCount = this.getUnlockedAchievements().length;

    ACHIEVEMENTS.forEach((achievement) => {
      if (this.isUnlocked(achievement.id)) {
        return; // Skip already unlocked
      }

      let shouldUnlock = false;

      switch (achievement.requirement.type) {
        case 'wins':
          shouldUnlock = stats.totalWins >= achievement.requirement.target;
          break;

        case 'criticalHits':
          shouldUnlock = stats.criticalHits >= achievement.requirement.target;
          break;

        case 'winStreak':
          shouldUnlock =
            stats.winStreak >= achievement.requirement.target ||
            stats.bestStreak >= achievement.requirement.target;
          break;

        case 'skillsUsed':
          shouldUnlock = stats.skillsUsed >= achievement.requirement.target;
          break;

        case 'tournamentsWon':
          shouldUnlock = stats.tournamentsWon >= achievement.requirement.target;
          break;

        case 'level':
          shouldUnlock = profile.level >= achievement.requirement.target;
          break;

        case 'totalDamageDealt':
          shouldUnlock = stats.totalDamageDealt >= achievement.requirement.target;
          break;

        case 'equipmentCollected': {
          const inventorySize = SaveManager.get('inventory.equipment')?.length || 0;
          shouldUnlock = inventorySize >= achievement.requirement.target;
          break;
        }

        // Story Mode achievements
        case 'storyMissionsCompleted': {
          const completedMissions = SaveManager.get('storyProgress.completedMissions')?.length || 0;
          shouldUnlock = completedMissions >= achievement.requirement.target;
          break;
        }

        case 'totalStars': {
          const missionStars = SaveManager.get('storyProgress.missionStars') || {};
          const totalStars = Object.values(missionStars).reduce((sum, stars) => sum + stars, 0);
          shouldUnlock = totalStars >= achievement.requirement.target;
          break;
        }

        // Economy achievements
        case 'marketplacePurchases':
          shouldUnlock = stats.marketplacePurchases >= achievement.requirement.target;
          break;

        case 'marketplaceTransactions': {
          const purchases = stats.marketplacePurchases || 0;
          const sales = stats.itemsSold || 0;
          shouldUnlock = purchases + sales >= achievement.requirement.target;
          break;
        }

        case 'itemsRepaired':
          shouldUnlock = stats.itemsRepaired >= achievement.requirement.target;
          break;

        case 'goldBalance': {
          const currentGold = SaveManager.get('profile.gold') || 0;
          shouldUnlock = currentGold >= achievement.requirement.target;
          break;
        }

        case 'totalGoldSpent':
          shouldUnlock = stats.totalGoldSpent >= achievement.requirement.target;
          break;

        case 'totalGoldEarned':
          shouldUnlock = stats.totalGoldEarned >= achievement.requirement.target;
          break;

        // Special achievements tracked manually
        case 'flawless':
        case 'criticalFinish':
        case 'singleHit':
        case 'basicOnly':
        case 'noItems':
        case 'maxCombo':
        case 'tournamentHard':
        case 'tournamentNightmare':
        case 'legendaryCollected':
        case 'perfectMissions':
        case 'perfectRegions':
        case 'bossesDefeated':
        case 'fastMissions':
        case 'survivalMissionsCompleted':
        case 'flawlessMissions':
        case 'legendaryPurchases':
        case 'goldFromSales':
        case 'neverBrokenEquipment':
          // These are checked when the specific event happens
          break;
      }

      if (shouldUnlock) {
        this.unlockAchievement(achievement.id);
      }
    });

    // Check if we unlocked any new achievements this session
    const newUnlockedCount = this.getUnlockedAchievements().length;
    return newUnlockedCount - unlockedCount;
  }

  /**
   * Manually track special achievements
   */
  static trackFlawlessVictory(damageTaken) {
    if (damageTaken === 0) {
      this.unlockAchievement('flawless_victory');
    }
  }

  static trackCriticalFinish(finishedWithCrit) {
    if (finishedWithCrit) {
      this.unlockAchievement('finishing_blow');
    }
  }

  static trackSingleHit(damage) {
    if (damage >= 500) {
      this.unlockAchievement('heavy_hitter');
    }
  }

  static trackBasicOnly(usedOnlyBasic) {
    if (usedOnlyBasic) {
      this.unlockAchievement('basic_warrior');
    }
  }

  static trackNoItems(usedNoItems) {
    if (usedNoItems) {
      this.unlockAchievement('no_items');
    }
  }

  static trackMaxCombo(combo) {
    if (combo >= 5) {
      this.unlockAchievement('combo_king');
    }
  }

  static trackTournamentDifficulty(difficulty) {
    if (difficulty === 'hard') {
      this.unlockAchievement('hard_mode');
    } else if (difficulty === 'nightmare') {
      this.unlockAchievement('nightmare_mode');
    }
  }

  static trackLegendaryCollected(rarity) {
    if (rarity === 'legendary') {
      this.unlockAchievement('legendary_collector');
    }
  }

  /**
   * Track story mode achievements
   */
  static trackStoryMissionCompleted(mission, stars) {
    // Check first mission
    this.unlockAchievement('first_mission');

    // Check if 3 stars
    if (stars === 3) {
      this.unlockAchievement('perfect_mission');
    }

    // Check if boss
    if (mission.type === 'boss') {
      SaveManager.increment('stats.bossesDefeated');
      this.unlockAchievement('boss_slayer');
    }

    // Check if survival
    if (mission.type === 'survival') {
      SaveManager.increment('stats.survivalMissionsCompleted');
      this.unlockAchievement('survivor');
    }

    // Check for fast completion (tracked by mission tracking)
    // This would be called from StoryMode.completeMission if rounds <= 5
  }

  static trackFastMission() {
    this.unlockAchievement('speed_runner');
  }

  static trackFlawlessMission() {
    this.unlockAchievement('flawless_mission');
  }

  static trackPerfectRegion() {
    this.unlockAchievement('perfect_region');
  }

  /**
   * Track marketplace achievements
   */
  static trackMarketplacePurchase(item) {
    SaveManager.increment('stats.marketplacePurchases');
    this.unlockAchievement('first_purchase');

    if (item.rarity === 'legendary') {
      SaveManager.increment('stats.legendaryPurchases');
      this.unlockAchievement('legendary_buyer');
    }

    this.checkAchievements();
  }

  static trackItemSold(goldEarned) {
    SaveManager.increment('stats.itemsSold');
    SaveManager.increment('stats.goldFromSales', goldEarned);
    this.checkAchievements();
  }

  static trackItemRepaired() {
    SaveManager.increment('stats.itemsRepaired');
    this.unlockAchievement('first_repair');
    this.checkAchievements();
  }

  /**
   * Award gold from achievements
   */
  static awardAchievementRewards(achievement) {
    if (achievement.reward.gold) {
      EconomyManager.addGold(achievement.reward.gold, `Achievement: ${achievement.name}`);
    }
  }

  /**
   * Get achievement progress for a specific achievement
   */
  static getAchievementProgress(achievementId) {
    const achievement = getAchievementById(achievementId);
    if (!achievement) return null;

    if (this.isUnlocked(achievementId)) {
      return {
        current: achievement.requirement.target,
        target: achievement.requirement.target,
        percentage: 100,
        unlocked: true,
      };
    }

    const stats = SaveManager.get('stats');
    const profile = SaveManager.get('profile');
    let current = 0;

    switch (achievement.requirement.type) {
      case 'wins':
        current = stats.totalWins;
        break;
      case 'criticalHits':
        current = stats.criticalHits;
        break;
      case 'winStreak':
        current = stats.bestStreak;
        break;
      case 'skillsUsed':
        current = stats.skillsUsed;
        break;
      case 'tournamentsWon':
        current = stats.tournamentsWon;
        break;
      case 'level':
        current = profile.level;
        break;
      case 'totalDamageDealt':
        current = stats.totalDamageDealt;
        break;
      case 'equipmentCollected':
        current = SaveManager.get('inventory.equipment')?.length || 0;
        break;
      case 'storyMissionsCompleted':
        current = SaveManager.get('storyProgress.completedMissions')?.length || 0;
        break;
      case 'totalStars': {
        const stars = SaveManager.get('storyProgress.missionStars') || {};
        current = Object.values(stars).reduce((sum, s) => sum + s, 0);
        break;
      }
      case 'marketplacePurchases':
        current = stats.marketplacePurchases || 0;
        break;
      case 'marketplaceTransactions': {
        const purchases = stats.marketplacePurchases || 0;
        const sales = stats.itemsSold || 0;
        current = purchases + sales;
        break;
      }
      case 'itemsRepaired':
        current = stats.itemsRepaired || 0;
        break;
      case 'goldBalance':
        current = SaveManager.get('profile.gold') || 0;
        break;
      case 'totalGoldSpent':
        current = stats.totalGoldSpent || 0;
        break;
      case 'totalGoldEarned':
        current = stats.totalGoldEarned || 0;
        break;
      default:
        current = 0;
    }

    const target = achievement.requirement.target;
    const percentage = Math.min(100, Math.floor((current / target) * 100));

    return {
      current,
      target,
      percentage,
      unlocked: false,
    };
  }

  /**
   * Get statistics
   */
  static getStatistics() {
    const unlocked = this.getUnlockedAchievements();
    const total = ACHIEVEMENTS.length;
    const percentage = this.getCompletionPercentage();

    return {
      unlocked: unlocked.length,
      total,
      percentage,
      remaining: total - unlocked.length,
    };
  }
}

// Export singleton for convenience
export const achievementManager = new AchievementManager();
