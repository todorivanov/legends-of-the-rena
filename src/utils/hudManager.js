/**
 * HUD Manager - Manages the fighter stats display using Web Components
 */
export class HUDManager {
  constructor() {
    this.hudElement = null;
    this.fighter1 = null;
    this.fighter2 = null;
  }

  /**
   * Initialize HUD for single fight
   */
  initSingleFight(fighter1, fighter2) {
    this.fighter1 = fighter1;
    this.fighter2 = fighter2;
    this.enemyFighters = null; // Clear multi-enemy mode

    this.createHUD();
    this.update();
  }

  /**
   * Initialize HUD for multi-enemy fight
   * @param {Fighter} playerFighter - Player fighter
   * @param {Fighter[]} enemyFighters - Array of enemy fighters
   */
  initMultiEnemyFight(playerFighter, enemyFighters) {
    this.fighter1 = playerFighter;
    this.fighter2 = null; // Not used in multi-enemy mode
    this.enemyFighters = enemyFighters;

    this.createHUD();
    this.update();
  }

  /**
   * Create HUD using Web Component
   */
  createHUD() {
    // Remove existing HUD if any
    const existingHUD = document.querySelector('fighter-hud');
    if (existingHUD) {
      existingHUD.remove();
    }

    // Find HUD area in combat arena
    const arena = document.querySelector('combat-arena');
    let hudArea = null;

    if (arena && arena.shadowRoot) {
      hudArea = arena.shadowRoot.querySelector('#hud-area');
    }

    // Fallback to old method if arena not found
    if (!hudArea) {
      hudArea = document.querySelector('.game-content') || document.body;
    }

    // Create HUD Web Component
    const hud = document.createElement('fighter-hud');
    hud.fighter1 = this.fighter1;
    
    // Set either single enemy or multiple enemies
    if (this.enemyFighters) {
      hud.enemyFighters = this.enemyFighters;
    } else {
      hud.fighter2 = this.fighter2;
    }

    hudArea.appendChild(hud);
    this.hudElement = hud;
  }

  /**
   * Update HUD with current fighter stats
   */
  update() {
    if (!this.hudElement || !this.fighter1) return;
    
    // In multi-enemy mode, check for enemyFighters instead of fighter2
    if (!this.enemyFighters && !this.fighter2) return;

    // Update fighter data
    this.hudElement.fighter1 = this.fighter1;
    
    if (this.enemyFighters) {
      this.hudElement.enemyFighters = this.enemyFighters;
    } else {
      this.hudElement.fighter2 = this.fighter2;
    }
  }

  /**
   * Update round number
   */
  setRound(round) {
    if (this.hudElement) {
      this.hudElement.round = round;
    }
  }

  /**
   * Show winner
   */
  showWinner(winner) {
    if (this.hudElement) {
      this.hudElement.showWinner(winner);
    }
  }

  /**
   * Remove HUD
   */
  remove() {
    if (this.hudElement) {
      this.hudElement.remove();
      this.hudElement = null;
    }

    // Show fighter selection view and hide combat view
    const selectionView = document.querySelector('.fighter-selection-view');
    const combatView = document.querySelector('.combat-view');

    if (selectionView) {
      selectionView.style.display = 'flex';
    }
    if (combatView) {
      combatView.style.display = 'none';
    }

    this.fighter1 = null;
    this.fighter2 = null;
  }
}

// Export singleton instance
export const hudManager = new HUDManager();
