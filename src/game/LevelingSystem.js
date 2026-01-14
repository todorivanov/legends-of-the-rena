/**
 * LevelingSystem - Manages player progression, XP, and level-ups
 */

import { gameStore } from '../store/gameStore.js';
import { ConsoleLogger, LogCategory } from '../utils/ConsoleLogger.js';

import { addXP as addXPAction, levelUp as levelUpAction, updatePlayer } from '../store/actions.js';
import { Logger } from '../utils/logger.js';
import { soundManager } from '../utils/soundManager.js';
import { DifficultyManager } from './DifficultyManager.js';

export class LevelingSystem {
  /**
   * Calculate XP required for a specific level
   * Formula: 100 * level^1.5
   */
  static getXPForLevel(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  /**
   * Get total XP required to reach a level from level 1
   */
  static getTotalXPForLevel(level) {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += this.getXPForLevel(i);
    }
    return total;
  }

  /**
   * Calculate level from total XP
   */
  static getLevelFromXP(totalXP) {
    let level = 1;
    let xpAccumulated = 0;

    while (xpAccumulated + this.getXPForLevel(level) <= totalXP) {
      xpAccumulated += this.getXPForLevel(level);
      level++;

      if (level > 100) break; // Safety cap
    }

    return level;
  }

  /**
   * Award XP to player
   * @param {number} amount - XP to award
   * @param {string} reason - Why XP was awarded
   * @returns {Object} - { leveledUp: boolean, newLevel: number, xpGained: number }
   */
  static awardXP(amount, reason = 'Victory') {
    // Apply difficulty multiplier
    const scaledAmount = DifficultyManager.getScaledXP(amount);

    const state = gameStore.getState();
    const currentLevel = state.player.level;
    const currentXP = state.player.xp;
    const newXP = currentXP + scaledAmount;

    // Calculate new level
    const newLevel = this.getLevelFromXP(newXP);
    const leveledUp = newLevel > currentLevel;

    // Update state
    gameStore.dispatch(addXPAction(scaledAmount));

    if (leveledUp) {
      gameStore.dispatch(levelUpAction());
    }

    if (newLevel > 1) {
      const xpForNextLevel = this.getTotalXPForLevel(newLevel + 1);
      gameStore.dispatch(updatePlayer({ xpToNextLevel: xpForNextLevel - newXP }));
    }

    // Log XP gain (show scaled amount)
    const xpMessage = `<div class="xp-gain-message" style="background: rgba(255, 215, 0, 0.2); border-left-color: gold; color: white; padding: 12px; margin: 8px 0; border-radius: 8px;">
      ✨ <strong>+${scaledAmount} XP</strong> earned from ${reason}!
    </div>`;
    Logger.log(xpMessage);

    // If leveled up, show celebration
    if (leveledUp) {
      const levelsGained = newLevel - currentLevel;
      this.showLevelUpAnimation(newLevel, levelsGained);
      soundManager.play('victory'); // Play victory sound for level up
    }

    ConsoleLogger.info(LogCategory.LEVELING, `🎯 Awarded ${scaledAmount} XP for ${reason}`);
    if (leveledUp) {
      ConsoleLogger.info(LogCategory.LEVELING, `🎉 LEVEL UP! ${currentLevel} → ${newLevel}`);
    }

    return {
      leveledUp,
      newLevel,
      oldLevel: currentLevel,
      xpGained: scaledAmount,
      totalXP: newXP,
    };
  }

  /**
   * Show level-up animation and notification
   */
  static showLevelUpAnimation(newLevel, _levelsGained = 1) {
    const levelUpMessage = `<div class="level-up-message" style="
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.3));
      border: 2px solid gold;
      border-radius: 12px;
      padding: 20px;
      margin: 15px 0;
      text-align: center;
      animation: levelUpPulse 0.6s ease;
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    ">
      <div style="font-size: 32px; font-weight: bold; color: gold; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8); margin-bottom: 10px;">
        🎉 LEVEL UP! 🎉
      </div>
      <div style="font-size: 24px; color: white; font-weight: bold;">
        Level ${newLevel}
      </div>
      <div style="font-size: 14px; color: #ffd; margin-top: 10px;">
        ${this.getLevelUpRewards(newLevel)}
      </div>
    </div>`;

    Logger.log(levelUpMessage);

    // Add CSS animation if not already present
    if (!document.getElementById('levelup-animations')) {
      const style = document.createElement('style');
      style.id = 'levelup-animations';
      style.innerHTML = `
        @keyframes levelUpPulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Get rewards description for level up
   */
  static getLevelUpRewards(level) {
    const rewards = [];

    // Stat bonuses
    rewards.push('+5% Max HP');
    rewards.push('+3% Strength');

    // Special rewards at milestone levels
    if (level % 5 === 0) {
      rewards.push('🎁 <strong>Bonus Reward!</strong>');
      rewards.push('+ 1 Equipment Piece');
    }

    if (level === 10) {
      rewards.push('🏆 <strong>Special Item Unlocked!</strong>');
    }

    if (level === 20) {
      rewards.push('👑 <strong>Max Level Reached!</strong>');
      rewards.push('🎖️ "Master Fighter" Title');
    }

    return rewards.join(' • ');
  }

  /**
   * Apply level-based stat bonuses to fighter
   */
  static applyLevelBonuses(fighter) {
    const state = gameStore.getState();
    const level = state.player.level || 1;

    if (level === 1) return fighter; // No bonuses at level 1

    // Calculate bonuses (5% HP, 3% Strength per level)
    const hpBonus = 1 + (level - 1) * 0.05;
    const strBonus = 1 + (level - 1) * 0.03;

    // Store original values for logging
    const originalHealth = fighter.health;
    const originalStrength = fighter.strength;

    // Apply bonuses directly to the fighter object (mutate in place)
    fighter.health = Math.floor(fighter.health * hpBonus);
    fighter.maxHealth = Math.floor(fighter.maxHealth * hpBonus);
    fighter.strength = Math.floor(fighter.strength * strBonus);

    ConsoleLogger.info(
      LogCategory.LEVELING,
      `💪 Applied level ${level} bonuses to ${fighter.name}:`,
      {
        hp: `${originalHealth} → ${fighter.health}`,
        str: `${originalStrength} → ${fighter.strength}`,
      }
    );

    return fighter;
  }

  /**
   * Get current player level
   */
  static getCurrentLevel() {
    const state = gameStore.getState();
    return state.player.level || 1;
  }

  /**
   * Get current player XP
   */
  static getCurrentXP() {
    const state = gameStore.getState();
    return state.player.xp || 0;
  }

  /**
   * Get XP progress for current level (0-100%)
   */
  static getXPProgress() {
    const currentXP = this.getCurrentXP();
    const currentLevel = this.getCurrentLevel();

    const xpForCurrentLevel = this.getTotalXPForLevel(currentLevel);
    const xpForNextLevel = this.getTotalXPForLevel(currentLevel + 1);
    const xpInCurrentLevel = currentXP - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;

    return Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);
  }

  /**
   * Get XP needed for next level
   */
  static getXPForNextLevel() {
    const currentXP = this.getCurrentXP();
    const currentLevel = this.getCurrentLevel();
    const xpForNextLevel = this.getTotalXPForLevel(currentLevel + 1);

    return xpForNextLevel - currentXP;
  }
}
