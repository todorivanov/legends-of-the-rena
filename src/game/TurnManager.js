/**
 * TurnManager - Handles turn-based combat system
 */
export class TurnManager {
  constructor() {
    this.currentTurn = 'player'; // 'player' or 'enemy'
    this.turnNumber = 0;
    this.isWaitingForPlayerAction = false;
    this.selectedAction = null;
    this.isPaused = false;
  }

  /**
   * Start a new turn
   */
  startTurn() {
    this.turnNumber++;
    this.isWaitingForPlayerAction = false;
    this.selectedAction = null;
  }

  /**
   * Switch to next turn
   */
  nextTurn() {
    this.currentTurn = this.currentTurn === 'player' ? 'enemy' : 'player';
    this.startTurn();
  }

  /**
   * Check if it's player's turn
   */
  isPlayerTurn() {
    return this.currentTurn === 'player';
  }

  /**
   * Set player action and proceed
   */
  setPlayerAction(action, target = null) {
    this.selectedAction = { action, target };
    this.isWaitingForPlayerAction = false;
  }

  /**
   * Wait for player to choose action
   */
  waitForPlayerAction() {
    this.isWaitingForPlayerAction = true;
  }

  /**
   * Toggle pause state
   */
  togglePause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  /**
   * Reset turn manager
   */
  reset() {
    this.currentTurn = 'player';
    this.turnNumber = 0;
    this.isWaitingForPlayerAction = false;
    this.selectedAction = null;
    this.isPaused = false;
  }
}
