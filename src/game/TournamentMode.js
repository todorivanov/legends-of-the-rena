/**
 * TournamentMode - Manages bracket-style tournaments
 * Quarter Final → Semi Final → Final
 */

import { SaveManagerV2 as SaveManager } from '../utils/SaveManagerV2.js';
import { LevelingSystem } from './LevelingSystem.js';
import { EquipmentManager } from './EquipmentManager.js';
import { Logger } from '../utils/logger.js';
import { soundManager } from '../utils/soundManager.js';

export class TournamentMode {
  constructor() {
    this.currentRound = 0; // 0 = Quarter, 1 = Semi, 2 = Final
    this.opponents = []; // All 4 opponents
    this.currentOpponentIndex = 0;
    this.playerWins = 0;
    this.isActive = false;
    this.difficulty = 'normal'; // normal, hard, nightmare
  }

  /**
   * Start a new tournament with 4 opponents
   * @param {Array} opponents - 4 fighters to face
   * @param {string} difficulty - Tournament difficulty
   */
  startTournament(opponents, difficulty = 'normal') {
    if (opponents.length !== 4) {
      console.error('❌ Tournament requires exactly 4 opponents');
      return false;
    }

    this.opponents = opponents;
    this.difficulty = difficulty;
    this.currentRound = 0;
    this.currentOpponentIndex = 0;
    this.playerWins = 0;
    this.isActive = true;

    console.log('🏆 Tournament Started!');
    console.log(`📋 Difficulty: ${difficulty}`);
    console.log(`👥 Opponents: ${opponents.map((f) => f.name).join(', ')}`);

    // Apply difficulty modifiers to opponents
    this.applyDifficultyModifiers();

    // Log tournament start
    const message = `
      <div class="tournament-start" style="
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 152, 0, 0.3));
        border: 3px solid gold;
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        text-align: center;
        box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
      ">
        <div style="font-size: 48px; margin-bottom: 10px;">🏆</div>
        <div style="font-size: 32px; font-weight: bold; color: gold; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8); margin-bottom: 10px;">
          TOURNAMENT BEGINS!
        </div>
        <div style="font-size: 18px; color: white; margin: 10px 0;">
          Difficulty: <strong>${this.getDifficultyDisplay(difficulty)}</strong>
        </div>
        <div style="font-size: 16px; color: #ffd; margin-top: 15px;">
          Win 3 battles to claim the championship! 🏅
        </div>
        <div style="font-size: 14px; color: #ffb; margin-top: 10px;">
          Opponents: ${opponents.map((f) => f.name).join(' • ')}
        </div>
      </div>
    `;
    Logger.log(message);
    soundManager.play('event');

    return true;
  }

  /**
   * Apply difficulty modifiers to opponents
   */
  applyDifficultyModifiers() {
    const modifiers = {
      normal: { hp: 1.0, str: 1.0 },
      hard: { hp: 1.3, str: 1.2 },
      nightmare: { hp: 1.5, str: 1.5 },
    };

    const mod = modifiers[this.difficulty] || modifiers.normal;

    this.opponents.forEach((opponent) => {
      opponent.health = Math.floor(opponent.health * mod.hp);
      opponent.maxHealth = Math.floor(opponent.maxHealth * mod.hp);
      opponent.strength = Math.floor(opponent.strength * mod.str);
    });

    console.log(
      `⚡ Applied ${this.difficulty} difficulty modifiers: +${Math.floor((mod.hp - 1) * 100)}% HP, +${Math.floor((mod.str - 1) * 100)}% STR`
    );
  }

  /**
   * Get difficulty display name
   */
  getDifficultyDisplay(difficulty) {
    const displays = {
      normal: '⚔️ Normal',
      hard: '💀 Hard',
      nightmare: '👹 Nightmare',
    };
    return displays[difficulty] || displays.normal;
  }

  /**
   * Get current opponent
   */
  getCurrentOpponent() {
    if (!this.isActive || this.currentOpponentIndex >= this.opponents.length) {
      return null;
    }
    return this.opponents[this.currentOpponentIndex];
  }

  /**
   * Get current round name
   */
  getCurrentRoundName() {
    const rounds = ['Quarter Final', 'Semi Final', 'GRAND FINAL'];
    return rounds[this.currentRound] || 'Round';
  }

  /**
   * Get current round number (1-3)
   */
  getCurrentRoundNumber() {
    return this.currentRound + 1;
  }

  /**
   * Record a victory and advance tournament
   * @returns {Object} - { tournamentComplete: boolean, nextRound: string }
   */
  recordVictory() {
    this.playerWins++;
    this.currentOpponentIndex++;
    this.currentRound++;

    console.log(`✅ Tournament Victory ${this.playerWins}/3`);

    // Check if tournament is complete
    if (this.playerWins >= 3) {
      return this.completeTournament();
    }

    // Show round transition
    const nextRoundName = this.getCurrentRoundName();
    const message = `
      <div class="round-transition" style="
        background: linear-gradient(135deg, rgba(33, 150, 243, 0.3), rgba(156, 39, 176, 0.3));
        border: 2px solid #2196f3;
        border-radius: 12px;
        padding: 20px;
        margin: 15px 0;
        text-align: center;
      ">
        <div style="font-size: 24px; font-weight: bold; color: #2196f3; margin-bottom: 10px;">
          🎯 Round ${this.playerWins} Complete!
        </div>
        <div style="font-size: 18px; color: white;">
          Next: <strong>${nextRoundName}</strong>
        </div>
        <div style="font-size: 14px; color: #b3d4fc; margin-top: 10px;">
          Opponent: ${this.getCurrentOpponent()?.name || 'Unknown'}
        </div>
      </div>
    `;
    Logger.log(message);

    return {
      tournamentComplete: false,
      nextRound: nextRoundName,
      nextOpponent: this.getCurrentOpponent(),
    };
  }

  /**
   * Record a defeat - tournament ends
   */
  recordDefeat() {
    const defeatedAt = this.getCurrentRoundName();
    console.log(`💔 Tournament ended at ${defeatedAt} (${this.playerWins}/3 wins)`);

    const message = `
      <div class="tournament-defeat" style="
        background: linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(139, 0, 0, 0.3));
        border: 2px solid #f44336;
        border-radius: 12px;
        padding: 20px;
        margin: 15px 0;
        text-align: center;
      ">
        <div style="font-size: 32px; margin-bottom: 10px;">💔</div>
        <div style="font-size: 24px; font-weight: bold; color: #f44336;">
          Tournament Ended
        </div>
        <div style="font-size: 16px; color: white; margin-top: 10px;">
          Defeated at: <strong>${defeatedAt}</strong>
        </div>
        <div style="font-size: 14px; color: #ffb3b3; margin-top: 10px;">
          Wins: ${this.playerWins}/3
        </div>
      </div>
    `;
    Logger.log(message);

    // Award consolation XP
    const consolationXP = this.playerWins * 50;
    if (consolationXP > 0) {
      LevelingSystem.awardXP(consolationXP, `Tournament Progress (${this.playerWins} wins)`);
    }

    this.endTournament();

    return {
      tournamentComplete: false,
      defeated: true,
      defeatedAt,
      wins: this.playerWins,
    };
  }

  /**
   * Complete tournament - player won all 3 rounds!
   */
  completeTournament() {
    console.log('🏆 TOURNAMENT CHAMPION!');

    const message = `
      <div class="tournament-victory" style="
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.4), rgba(255, 152, 0, 0.4));
        border: 4px solid gold;
        border-radius: 15px;
        padding: 30px;
        margin: 20px 0;
        text-align: center;
        box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
        animation: championPulse 2s infinite;
      ">
        <div style="font-size: 64px; margin-bottom: 15px;">🏆</div>
        <div style="font-size: 36px; font-weight: bold; color: gold; text-shadow: 0 0 15px rgba(255, 215, 0, 1); margin-bottom: 15px;">
          TOURNAMENT CHAMPION!
        </div>
        <div style="font-size: 20px; color: white; font-weight: bold; margin: 15px 0;">
          Flawless Victory: 3/3
        </div>
        <div style="font-size: 16px; color: #ffd; margin-top: 15px;">
          ${this.getChampionshipRewards()}
        </div>
      </div>
    `;
    Logger.log(message);
    soundManager.play('victory');

    // Add animation
    if (!document.getElementById('tournament-animations')) {
      const style = document.createElement('style');
      style.id = 'tournament-animations';
      style.innerHTML = `
        @keyframes championPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
          50% { transform: scale(1.02); box-shadow: 0 0 60px rgba(255, 215, 0, 1); }
        }
      `;
      document.head.appendChild(style);
    }

    // Award championship rewards
    this.awardChampionshipRewards();

    // Update tournament stats
    SaveManager.increment('stats.tournamentsWon');
    SaveManager.save();

    this.endTournament();

    return {
      tournamentComplete: true,
      champion: true,
    };
  }

  /**
   * Get championship rewards description
   */
  getChampionshipRewards() {
    const rewards = [];

    // Base rewards
    rewards.push('🎁 <strong>+300 XP</strong>');

    // Difficulty bonuses
    if (this.difficulty === 'hard') {
      rewards.push('💎 <strong>+150 Bonus XP</strong> (Hard)');
      rewards.push('⚔️ <strong>Guaranteed Epic Equipment</strong>');
    } else if (this.difficulty === 'nightmare') {
      rewards.push('💎 <strong>+300 Bonus XP</strong> (Nightmare)');
      rewards.push('🌟 <strong>Guaranteed Legendary Equipment</strong>');
    } else {
      rewards.push('⚔️ <strong>Guaranteed Rare Equipment</strong>');
    }

    rewards.push('🏆 <strong>Champion Title</strong>');

    return rewards.join('<br>');
  }

  /**
   * Award championship rewards
   */
  awardChampionshipRewards() {
    // Base XP
    let totalXP = 300;

    // Difficulty bonus
    if (this.difficulty === 'hard') {
      totalXP += 150;
    } else if (this.difficulty === 'nightmare') {
      totalXP += 300;
    }

    LevelingSystem.awardXP(totalXP, 'Tournament Championship');

    // Guaranteed equipment drop based on difficulty
    const minRarity =
      this.difficulty === 'nightmare' ? 'legendary' : this.difficulty === 'hard' ? 'epic' : 'rare';

    this.awardGuaranteedEquipment(minRarity);
  }

  /**
   * Award guaranteed equipment of minimum rarity
   */
  awardGuaranteedEquipment(minRarity = 'rare') {
    // This is a simplified version - in a full implementation,
    // you'd filter equipment by rarity and award a specific piece
    console.log(`🎁 Awarding guaranteed ${minRarity}+ equipment`);

    // For now, just trigger multiple drops with higher chances for better items
    const dropAttempts = minRarity === 'legendary' ? 3 : minRarity === 'epic' ? 2 : 1;

    for (let i = 0; i < dropAttempts; i++) {
      EquipmentManager.awardRandomDrop();
    }
  }

  /**
   * End tournament and cleanup
   */
  endTournament() {
    this.isActive = false;
    this.opponents = [];
    this.currentRound = 0;
    this.currentOpponentIndex = 0;
    this.playerWins = 0;
    console.log('🏁 Tournament ended');
  }

  /**
   * Check if tournament is active
   */
  isTournamentActive() {
    return this.isActive;
  }

  /**
   * Get tournament progress
   */
  getProgress() {
    return {
      active: this.isActive,
      round: this.currentRound,
      roundName: this.getCurrentRoundName(),
      wins: this.playerWins,
      totalRounds: 3,
      currentOpponent: this.getCurrentOpponent(),
      difficulty: this.difficulty,
    };
  }

  /**
   * Get tournament statistics
   */
  static getTournamentStats() {
    return {
      totalWins: SaveManager.get('stats.tournamentsWon') || 0,
    };
  }
}

// Export singleton instance
export const tournamentMode = new TournamentMode();
