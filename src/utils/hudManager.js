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

    // Hide fighter selection view and show combat view
    const selectionView = document.querySelector('.fighter-selection-view');
    const combatView = document.querySelector('.combat-view');
    
    if (selectionView) {
      selectionView.style.display = 'none';
    }
    if (combatView) {
      combatView.style.display = 'flex';
    }

    const gameContent = document.querySelector('.game-content');
    if (!gameContent) return;

    // Create HUD Web Component
    const hud = document.createElement('fighter-hud');
    hud.fighter1 = this.fighter1;
    hud.fighter2 = this.fighter2;
    
    gameContent.insertBefore(hud, gameContent.firstChild);
    this.hudElement = hud;
  }

  /**
   * Update HUD with current fighter stats
   */
  update() {
    if (!this.hudElement || !this.fighter1 || !this.fighter2) return;
    
    // Update fighter data
    this.hudElement.fighter1 = this.fighter1;
    this.hudElement.fighter2 = this.fighter2;
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
