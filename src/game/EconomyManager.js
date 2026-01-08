/**
 * EconomyManager - Handles gold currency and economic transactions
 * Manages earning, spending, and tracking of gold throughout the game
 */

import { SaveManager } from '../utils/saveManager.js';
import { Logger } from '../utils/logger.js';

export class EconomyManager {
  /**
   * Award gold to player
   * @param {number} amount - Amount of gold to award
   * @param {string} source - Source of gold (for logging)
   * @returns {boolean} - Success status
   */
  static addGold(amount, source = 'Unknown') {
    if (amount <= 0) {
      console.warn('⚠️ Cannot add negative or zero gold');
      return false;
    }

    const currentGold = SaveManager.get('profile.gold') || 0;
    const newGold = currentGold + amount;
    
    SaveManager.update('profile.gold', newGold);
    SaveManager.increment('stats.totalGoldEarned', amount);

    console.log(`💰 +${amount} gold earned from ${source} (Total: ${newGold})`);
    
    // Log to combat log
    const message = `
      <div class="gold-award" style="
        background: linear-gradient(135deg, rgba(255, 193, 7, 0.2), rgba(255, 152, 0, 0.3));
        border-left: 4px solid #ffc107;
        padding: 12px;
        margin: 8px 0;
        border-radius: 8px;
        text-align: center;
      ">
        <span style="font-size: 24px; margin-right: 8px;">💰</span>
        <strong style="color: #ffc107; font-size: 18px;">+${amount} Gold</strong>
        <span style="color: #ffecb3; margin-left: 8px;">(${source})</span>
      </div>
    `;
    Logger.log(message);

    return true;
  }

  /**
   * Spend gold from player's balance
   * @param {number} amount - Amount of gold to spend
   * @param {string} purpose - Purpose of spending (for logging)
   * @returns {boolean} - Success status
   */
  static spendGold(amount, purpose = 'Purchase') {
    if (amount <= 0) {
      console.warn('⚠️ Cannot spend negative or zero gold');
      return false;
    }

    const currentGold = SaveManager.get('profile.gold') || 0;
    
    if (currentGold < amount) {
      console.log(`❌ Insufficient gold. Need ${amount}, have ${currentGold}`);
      
      // Log error message
      const message = `
        <div class="gold-error" style="
          background: linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(211, 47, 47, 0.3));
          border-left: 4px solid #f44336;
          padding: 12px;
          margin: 8px 0;
          border-radius: 8px;
          text-align: center;
        ">
          <span style="font-size: 24px; margin-right: 8px;">❌</span>
          <strong style="color: #ef5350;">Insufficient Gold!</strong>
          <span style="color: #ffcdd2; margin-left: 8px;">Need ${amount}, have ${currentGold}</span>
        </div>
      `;
      Logger.log(message);
      
      return false;
    }

    const newGold = currentGold - amount;
    SaveManager.update('profile.gold', newGold);
    SaveManager.increment('stats.totalGoldSpent', amount);

    console.log(`💸 -${amount} gold spent on ${purpose} (Remaining: ${newGold})`);

    return true;
  }

  /**
   * Check if player can afford a purchase
   * @param {number} amount - Amount to check
   * @returns {boolean} - Can afford
   */
  static canAfford(amount) {
    const currentGold = SaveManager.get('profile.gold') || 0;
    return currentGold >= amount;
  }

  /**
   * Get current gold balance
   * @returns {number} - Current gold amount
   */
  static getGold() {
    return SaveManager.get('profile.gold') || 0;
  }

  /**
   * Calculate battle reward based on difficulty and victory
   * @param {string} difficulty - Difficulty level
   * @param {boolean} victory - Whether player won
   * @param {number} enemyLevel - Enemy level (optional)
   * @returns {number} - Gold reward
   */
  static calculateBattleReward(difficulty = 'normal', victory = true, enemyLevel = 1) {
    if (!victory) {
      return Math.floor(10 + (enemyLevel * 2)); // Small consolation prize
    }

    const baseReward = 30;
    let multiplier = 1.0;

    // Difficulty multipliers
    switch (difficulty) {
      case 'easy':
        multiplier = 0.8;
        break;
      case 'normal':
        multiplier = 1.0;
        break;
      case 'hard':
        multiplier = 1.5;
        break;
      case 'nightmare':
        multiplier = 2.0;
        break;
    }

    // Level scaling
    const levelBonus = Math.floor(enemyLevel * 3);
    
    const totalReward = Math.floor((baseReward + levelBonus) * multiplier);
    return Math.max(20, totalReward); // Minimum 20 gold
  }

  /**
   * Calculate tournament reward
   * @param {string} difficulty - Tournament difficulty
   * @param {number} round - Tournament round (1-3)
   * @returns {number} - Gold reward
   */
  static calculateTournamentReward(difficulty = 'normal', round = 1) {
    const baseRewards = {
      normal: [50, 100, 200],
      hard: [100, 200, 400],
      nightmare: [150, 300, 600],
    };

    const rewards = baseRewards[difficulty] || baseRewards.normal;
    return rewards[round - 1] || 50;
  }

  /**
   * Calculate story mission reward
   * @param {number} missionDifficulty - Mission difficulty (1-10)
   * @param {number} stars - Stars earned (1-3)
   * @returns {number} - Gold reward
   */
  static calculateStoryReward(missionDifficulty = 1, stars = 1) {
    const baseReward = 50 + (missionDifficulty * 10);
    const starBonus = stars * 20;
    return baseReward + starBonus;
  }

  /**
   * Format gold amount for display
   * @param {number} amount - Gold amount
   * @returns {string} - Formatted string
   */
  static formatGold(amount) {
    return `${amount.toLocaleString()} 💰`;
  }

  /**
   * Show gold notification
   * @param {number} amount - Amount gained/lost
   * @param {boolean} isGain - Whether gold was gained or lost
   */
  static showGoldNotification(amount, isGain = true) {
    const symbol = isGain ? '+' : '-';
    const color = isGain ? '#ffc107' : '#f44336';
    const bgColor = isGain ? 'rgba(255, 193, 7, 0.2)' : 'rgba(244, 67, 54, 0.2)';

    const message = `
      <div class="gold-notification" style="
        background: ${bgColor};
        border-left: 4px solid ${color};
        padding: 10px;
        margin: 5px 0;
        border-radius: 8px;
        text-align: center;
        animation: slideInRight 0.3s ease;
      ">
        <strong style="color: ${color}; font-size: 16px;">${symbol}${amount} 💰</strong>
      </div>
    `;
    Logger.log(message);
  }

  /**
   * Get total gold statistics
   * @returns {Object} - Gold statistics
   */
  static getGoldStats() {
    return {
      current: SaveManager.get('profile.gold') || 0,
      totalEarned: SaveManager.get('stats.totalGoldEarned') || 0,
      totalSpent: SaveManager.get('stats.totalGoldSpent') || 0,
    };
  }
}
