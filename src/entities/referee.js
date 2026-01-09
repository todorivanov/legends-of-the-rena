import { Logger } from '../utils/logger.js';
import { soundManager } from '../utils/soundManager.js';

let roundCounter = 0;

/**
 * Referee - Manages game announcements and status updates
 */
export class Referee {
  static introduceFighters(first, second) {
    const message = `
      <div class='intro-div text-center'>
        <h2>⚔️ BATTLE ARENA ⚔️</h2>
        <p class="mb-0">Two warriors enter, only one will emerge victorious!</p>
      </div>`;
    Logger.log(message);
    Logger.logFighter(first);
    Logger.logFighter(second);
  }

  // Team Battle mode removed - keeping only Story, Single Combat, and Tournament modes

  static showRoundNumber() {
    roundCounter++;
    const msg = `
      <hr>
      <div class="round-summary text-center bg-light py-2">
        <h4 class="mb-0">📢 Round ${roundCounter} - FIGHT!</h4>
      </div>`;
    Logger.log(msg);
  }

  static clearRoundNumber() {
    roundCounter = 0;
  }

  static roundSummary(first, second) {
    const firstHealth = Math.max(0, first.health);
    const secondHealth = Math.max(0, second.health);

    const firstBar = this.getHealthBar(firstHealth, 1000);
    const secondBar = this.getHealthBar(secondHealth, 1000);

    const msg = `
      <div class="round-summary text-center my-2">
        <div class="row">
          <div class="col-6">
            <strong>${first.name}</strong>
            <div class="progress" style="height: 20px;">
              ${firstBar}
            </div>
            <small>${firstHealth} HP</small>
          </div>
          <div class="col-6">
            <strong>${second.name}</strong>
            <div class="progress" style="height: 20px;">
              ${secondBar}
            </div>
            <small>${secondHealth} HP</small>
          </div>
        </div>
      </div>`;
    Logger.log(msg);
  }

  // Team Battle mode removed

  static declareWinner(fighter) {
    const msg = `
      <div class="winner-div text-center">
        <h2>🏆 VICTORY! 🏆</h2>
        <p class="lead">${fighter.name} has won the battle!</p>
      </div>`;
    Logger.log(msg);
    Logger.logFighter(fighter);
    soundManager.play('victory');
  }

  // Team Battle mode removed

  /**
   * Generate health bar HTML
   * @private
   */
  static getHealthBar(currentHealth, maxHealth) {
    const percentage = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));
    let colorClass = 'bg-success';
    if (percentage < 30) colorClass = 'bg-danger';
    else if (percentage < 60) colorClass = 'bg-warning';

    return `<div class="progress-bar ${colorClass}" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>`;
  }
}
